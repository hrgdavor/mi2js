(function(){
/** 
@namespace mi2JS(comp)
*/

/** Base class for all components. Goes beyond simple {@link NodeWrapper} to add parent/child/children
  relationship. Also adding other functionalities needed for component based composition of an application.
@class Base
@memberof mi2JS(comp)
@extends NodeWrapper
*/
	var mi2 = mi2JS;
	var mi2Proto = mi2.prototype;

	function Base(){}

	mi2.comp.def.Base = Base;
	mi2.comp.tpl.Base = '';
	Base.compName = 'Base';
	// extend mi2JS to get addClass and other html utility functions (html.js must be included in the bundle to have them)
	mi2.extend(Base, mi2);

	var proto = Base.prototype; //

	/* called when the component is initially constructed */
	proto.construct = function(el, parent){
		this.children = [];
		this.el = el;
	};

	proto.__init = function(){
		if(!this.__initialized){
			this.initTemplate();
			this.parseChildren();
			this.initChildren();
			this.fireEvent('init');
		}
		this.__initialized = true;
	};

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

	proto.parseChildren = function(){
		mi2.parseChildren(this.el,this);
	};

	proto.initChildren = function(){
		var c;
		for(var i=0; i<this.children.length; i++){
			c = this.children[i];
			if(!c.lazyInit) c.__init();
		}
	};

	proto.on_init = function(evt){ };

	proto.getCompName = function(){
		if(this.el && this.el.getAttribute){
			return this.el.getAttribute('as');
		}
	};

	/** listener shortcut that by default binds callback function to current object/component
	so you can use this in callback without extra bloat otherwise needed
	*/
	proto.listen = function(el,evt,listener){
		listener = listener || this['on_'+evt];

		if(el.addListener){
			el.addListener( evt, listener, this);
		}else //dom node
			mi2.listen( el, evt, listener, this);
	};

	//setTimeout and setInterval shortcut that by default binds callback function to current object
	//so you can use this in callback without extra bloat otherwise needed
	proto.setTimeout = function(fc,delay){
		return setTimeout( fc.bind(this), delay );
	};
  
	proto.setInterval = function(fc,delay){
		return setInterval( fc.bind(this), delay );
	};

	proto.addListener = function(evtName,callback, scope){
		if(!this.__listeners) this.__listeners = {};
		var l = this.__listeners[evtName];
		if(!l) l = this.__listeners[evtName] = [];

		// bind a scope to the callback function
		if(scope) callback = mi2.bind( scope, callback );
		
		l.push({callback:callback, scope:scope });
	};

	proto.isTransitive = function(){ return false; };

/** Event object used for firing events inside components
  @typedef EventObject
  @type {object}
  @property {string} name - event name
  @property {string} fireTo - direction of the event
  @property {Object} src - source component where the the event originated
  @property {Event} domEvent - (optional) should be passed whan DOM Event was th cause
 */



/** Fire event in desired direction in component tree (the component itself, to children, to parent)
	
	@method fireEvent
	@memberof mi2JS(comp).Base

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
			if((this.isTransitive && this.isTransitive()) || initialFire){
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

	proto.addRef = function(r){
		if(!this.__refs) this.__refs = [];
		this.__refs.push(r);
	};

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

	proto.removeChild = function(){
		var found = -1, cnt = this.children.length >>> 0;
		for(var i =0; i<cnt; i++) if(c == this.children[i]) return; 
		if(found != -1) this.children.splice(found,1);
	};

	proto.setParent = function(p){
		var old = this.parent;
		if(old && old.removeChild) 
			old.removeChild(this);
		this.parent = p;
		if(p  && p.addChild) p.addChild(this);
	};

	/* find component that is holding the DOM node */
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

	proto.find    = function(search){ return mi2.find   (this.el, search); }
	proto.findAll = function(search){ return mi2.findAll(this.el, search); }

	/** Use this when the tag on which the component is defined*/
	proto.replaceTag = function(el,tag){
		var ret = document.createElement(tag);
		var arr = el.attributes;
		for(var i=0; i<arr.length; i++){
			ret.setAttribute(arr[i].name, arr[i].value);
		}
		el.parentNode.replaceChild(ret,el);
		return ret;
	};

	proto.isVisibleTruly = function(){
		var c = this;
		while(c){
			if(!c.isVisible()) return false;
			c = c.parent;
		}
		return true;
	};

	proto.setVisible = function(visible){
		if(visible == this.isVisible()) return;

		mi2Proto.setVisible.call(this, visible);

		// when hidden by parent, there is no point in firing the event
		// correct event will be fired when parent becomes visible
		if(!this.parent || this.parent.isVisibleTruly()) 
			this.fireEvent({name:visible ? 'show':'hide',fireTo:'children'});
	};

}(mi2JS));
