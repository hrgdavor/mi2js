(function(){

/** 
<p>Event object used for firing events inside components</p>
<p><b>src and target are added automatically, you can not pass them to fireEvent</b></p>
<p>If you listen to 'submit' event on a Form, src will be the input that originated the 'submit' event
and target will be the Form</p>

  @typedef EventObject
  @type {object}
  @property {string} name - event name
  @property {string} fireTo - direction of the event (undefined|parent|children)
  @property {Object} src - source/origin component where of the event
  @property {Object} target - target component the event is firing from right now
  @property {Event} domEvent - (optional) should be passed when DOM Event was the cause
 */

/** <b>Extends:</b> {@link mi2JS(core).NodeWrapper}<br>
Base class for all components. Goes beyond simple {@link NodeWrapper} to add parent/child/children
relationship. Also adding other functionalities needed for component based composition of an application.

@class Base
@memberof mi2JS(comp)

*/
	var mi2 = mi2JS;
	var mi2Proto = mi2.prototype;

	function Base(){}

	mi2.compData.def.Base = Base;
	mi2.compData.tpl.Base = '';
	Base.compName = 'Base';
	// extend NodeWrapper to get addClass and other html utility functions (html.js must be included in the bundle to have them)
	mi2.extend(Base, mi2);

	var proto = Base.prototype; //

	/* called when the component is initially constructed
	@instance
	@function construct 
	@memberof mi2JS(comp).Base
	@param {Element} el
	@param {object} parent
	*/
	proto.construct = function(el, parent){
		this.children = [];
		this.el = el;
	};

	/** initialize the compoenent if not initialized already. Can be called more than once,
	but only executes the first time. Subsequent calls are ignored.<br>
	If not initialized does this in sequence:
	<li> {@link mi2JS(comp).Base#initTemplate initTemplate} - apply template2
	<li> {@link mi2JS(comp).Base#parseChildren parseChildren} - parse DOM nodes (recusrsion stop swhen a child component is foud)
	<li> {@link mi2JS(comp).Base#initChildren initChildren} - initialize child components (here the recursion continues again)
	<li> Fire <b>init</b> event via {@link mi2JS(comp).Base#fireEvent fireEvent} (on_init will be called actually)

	@instance
	@function __init
	@memberof mi2JS(comp).Base
	*/
	proto.__init = function(){
		if(!this.__initialized){
			this.__initialized = true;
			this.initTemplate();
			this.parseChildren();
			this.initChildren();
			this.fireEvent('init');
		}
	};

	/** 
	@instance
	@function initTemplate
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.initTemplate = function(){
		if(this.__template){
			this.el.innerHTML = this.__template;
		}
		// if(this.__template || this.el.getAttribute('template') == 'inline'){
		// 	this.parseChildren();
		// 	this.initChildren();
		// }
		delete this.__template;
	};

	/** 
	@instance
	@function parseChildren
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.parseChildren = function(){
		mi2.parseChildren(this.el,this);
	};

	/** 
	@instance
	@function initChildren
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.initChildren = function(){
		var c;
		for(var i=0; i<this.children.length; i++){
			c = this.children[i];
			if(!c.lazyInit) c.__init();
		}
	};

	/** 
	@instance
	@function on_init
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.on_init = function(evt){ };

	/** 
	@instance
	@function getCompName
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.getCompName = function(){
		if(this.el && this.el.getAttribute){
			return this.el.getAttribute('as');
		}
	};

	/** listener shortcut that by default binds callback function to current object/component
	so you can use this in callback without extra bloat otherwise needed

	@instance
	@function listen
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.listen = function(el,evt,listener, scope, options){
		scope = scope || this;
		listener = listener || this['on_'+evt];

		if(el.addListener){
			el.addListener( evt, listener, scope);
		}else //dom node
			mi2.listen( el, evt, listener, scope, options);
	};

	/** 
	setTimeout shortcut that by default binds callback function to current object, 
	so you can use this in callback without extra bloat otherwise needed
	@instance
	@function setTimeout
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.setTimeout = function(fc,delay){
		return setTimeout( fc.bind(this), delay );
	};

	/** 
	requestAnimationFrame shortcut that by default binds callback function to current object, 
	so you can use this in callback without extra bloat otherwise needed
	@instance
	@function requestAnimationFrame
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.requestAnimationFrame = function(fc){
		return requestAnimationFrame( fc.bind(this) );
	};
  
	/** 
	setInterval shortcut that by default binds callback function to current object, 
	so you can use this in callback without extra bloat otherwise needed

	@instance
	@function setInterval
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.setInterval = function(fc,delay){
		return setInterval( fc.bind(this), delay );
	};

	/** 
	@instance
	@function addListener
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.addListener = function(evtName,callback, scope){
		if(!this.__listeners) this.__listeners = {};
		var l = this.__listeners[evtName];
		if(!l) l = this.__listeners[evtName] = [];

		// bind a scope to the callback function
		if(scope) callback = mi2.bind( scope, callback );
		
		l.push({callback:callback, scope:scope });
	};

	/** Implement this to return true for transitive components (example: base/Loop). 
	Transitive component will forward events meant for parent.<br>
	base/Button inside a base/Loop will fire the event when clicked, but base/Loop will forward it to it's parent.
	This is desirable in this case as the loop is usually used inside an application component, and that component
	will want to catch the event from the button like it is usual when the button is a direct child.
	@instance
	@function isTransitive
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.isTransitive = function(evt){ return false; };




/** Fire event in desired direction in component tree (the component itself, to children, to parent)
	
	@method fireEvent
	@memberof mi2JS(comp).Base
	@instance

	@param {String|EventObject} evt event or just event name


	@example
// version when there is no additional data with event
this.someComp.fireEvent('reload'); 

// tell child component to reload
this.someComp.fireEvent({name:'reload'}); 

// tell all children components to reload
this.fireEvent({name:'reload', fireTo:'children'}); 

// tell parent you want to submit (inputs can fire this)
this.fireEvent({name:'submit', fireTo:'parent'}); 

// if the event is caused by domEvent, pass it along as domEvent property
this.fireEvent({name:'submit', fireTo:'parent', domEvent:evt}); 

	*/
	proto.fireEvent = function(evt){
		if(typeof(evt) == 'string'){
			evt = {name:evt};
		}
		var evtName = evt.name;

		if(evtName == 'show'){
			// if not initialized yet, fire init event first
			this.__init();
		}

		if(!evt) evt = {};
		evt.target = this;

		var initialFire = !evt.__src;
		if(initialFire) evt.src = evt.__src = this;
		
		if(evt.fireTo == 'parent'){
			if((this.isTransitive(evt)) || initialFire){
				if(this.parent) this.parent.fireEvent(evt);
				return;
			}
		}

		if(typeof(this['on_'+evtName]) == 'function'){
			try{
				this['on_'+evtName](evt);
			}catch(e){
				console.log('Error calling event handler function ','on_'+evtName, evt, 'component', this , 'error', e);
				console.error(e.message);
			}

		}

		var l;
		if(this.__listeners) l=this.__listeners[evtName];
		if(l) for(var i=0; i<l.length; i++){
			try{
				l[i].callback(evt);
			}catch(e){
				console.log('Error firing event ',evtName, evt, 'listener', l[i].scope, 'error', e);
				console.error(e.message);
			}
		}

		var child;
		if(evt.fireTo == 'children' && this.children){
			for(var i=0; i<this.children.length; i++){
				child = this.children[i];
				// if hidden no need for hide/show event to propagate
				if(!child.isVisible() && (evtName == 'hide' || evtName == 'show' )) continue; 
				
				child.fireEvent(evt);
			}
		}
	};

	/** 
	@instance
	@function 
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.addRef = function(r){
		if(!this.__refs) this.__refs = [];
		this.__refs.push(r);
	};

	/** 
	@instance
	@function 
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.addChild = function(c){
		if(!this.el) {
			var msg = 'Component not propery initialized. Must call Base constructor before parseChildren';
			console.log(msg, this, this.el);
			throw new Error(msg);
		}
		var cnt = this.children.length >>> 0;
		for(var i =0; i<cnt; i++) if(c == this.children[i]) return; 
		this.children.push(c);
	};

	/** 
	@instance
	@function 
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.removeChild = function(){
		var found = -1, cnt = this.children.length >>> 0;
		for(var i =0; i<cnt; i++) if(c == this.children[i]) return; 
		if(found != -1) this.children.splice(found,1);
	};

	/** 
	@instance
	@function 
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.setParent = function(p){
		var old = this.parent;
		if(old && old.removeChild) 
			old.removeChild(this);
		this.parent = p;
		if(p  && p.addChild) p.addChild(this);
	};

	/* find component that is holding the DOM node in question

	@instance
	@function findRef
	@memberof mi2JS(comp).Base
	@param {Element|string} toFind element to find
	@param {Component} from starting point
	*/
	proto.findRef = function(toFind, from){
		var testFunc = function(comp){
			return comp.el == toFind;
		}
		if(typeof toFind == 'string'){
			if('+' == toFind)
				toFind = from.el.nextElementSibling;
			else if('-' == toFind) 
				toFind = from.el.previousElementSibling;
			else{
				testFunc = function(comp){
					return comp.attr('p') == toFind;
				}
			}
		}
		var i,cd = this.children;
		if(cd) for(i=0; i<cd.length; i++){
			if(testFunc(cd[i])) return cd[i];
		}
		cd = this.__refs;
		if(cd) for(i=0; i<cd.length; i++){
			if(testFunc(cd[i])) return cd[i];
		}
		// if it is a domNode and we have no reference to it, just return a NodeWrapper
		if(toFind.tagName)
			return new mi2(toFind);
	}

	/** Call the static {@link mi2JS(core).find} using the component's HTML node and provided search critria.
	@instance
	@function find
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.find    = function(search){ return mi2.find   (this.el, search); }
	
	/** Call the static {@link mi2JS(core).findAll} using the component's HTML node and provided search critria.
	@instance
	@function findAll
	@memberof mi2JS(comp).Base
	@param {Object} object
	*/
	proto.findAll = function(search){ return mi2.findAll(this.el, search); }

	/** Useful when the tag on which the component is defined should be replaced.
	Copies all the attributes and child nodes to the new node with specified tag name.

	@instance
	@function replaceTag
	@memberof mi2JS(comp).Base
	@param {Element} el node
	@param {Object} tag tag name
	*/
	proto.replaceTag = function(el,tag){
		var ret = document.createElement(tag);
		var arr = el.attributes;
		for(var i=0; i<arr.length; i++){
			ret.setAttribute(arr[i].name, arr[i].value);
		}
		el.parentNode.replaceChild(ret,el);
		return ret;
	};

	/** Check visibility, but only report visible if the compoentn itself is visible,
	and all of it's parents.

	@instance
	@function isVisibleTruly
	@memberof mi2JS(comp).Base
	*/
	proto.isVisibleTruly = function(){
		var c = this;
		while(c){
			if(!c.isVisible()) return false;
			c = c.parent;
		}
		return true;
	};

	/** Change visibility of the component. 
	It is reliant on the css used, and by default uses 'hidden' HMTL attribute.

	@instance
	@function setVisible
	@memberof mi2JS(comp).Base
	@param {boolean} visible
	*/
	proto.setVisible = function(visible){
		if(visible == this.isVisible()) return;

		mi2Proto.setVisible.call(this, visible);

		// when hidden by parent, there is no point in firing the event
		// correct event will be fired when parent becomes visible
		if(!this.parent || this.parent.isVisibleTruly()) 
			this.fireEvent({name:visible ? 'show':'hide',fireTo:'children'});
	};


	/** Expand data expressions in the component and the children.
	If you need to hide the expressions before the data is set first time
	call this.loadExpander(); during component initialization.

	@instance
	@function expandVars
	@memberof mi2JS(comp).Base
	@param {Object} data
	*/
    proto.expandVars = function(data){
        if(!this.__expander) this.loadExpander();

        this.__expander.setValue(data);
        var count = this.__expanderFwd.length;
        for(var i=0; i<count; i++){
            this.__expanderFwd[i].setValue(data);
        }
    };

	/** By default setValue calls this.expandVars. Input components for example override 
	setValue for purpose of setting input values

	@instance
	@function expandVars
	@memberof mi2JS(comp).Base
	@param {Object} data
	*/
    proto.setValue = proto.expandVars;

	/** Expand data expressions in the component and the children.
	If you need to hide the expressions before the data is set first time
	call this.loadExpander(); during component initialization.

	@instance
	@function expandVars
	@memberof mi2JS(comp).Base
	@param {Object} data
	*/
    proto.loadExpander = function(){
        this.__expander = mi2.loadExpander(this.el, this);
        this.__expanderFwd = [];

        if(!this.children) return;
        
        var count = this.children.length;
        for(var i=0; i<count; i++){
            if(this.children[i].hasAttr('fwd-expand')){
                if(this.children[i].setValue)
                    this.__expanderFwd.push(this.children[i]);
            }
        }
    };

}(mi2JS));
