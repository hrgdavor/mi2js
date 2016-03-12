(function(){

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
			this.fireEvent('init',{ });
		}
		this.__initialized = true;
	};

	proto.initTemplate = function(){
		if(this.__template){
			this.el.innerHTML = this.__template;
			this.parseChildren();
			this.initChildren();
		}
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

	proto.fireEvent = function(evtName, ex){

		if(evtName == 'show'){
			// if not initialized yet, fire init event first
			this.__init();
		}

		if(!ex) ex = {};
		ex.name = evtName;
		ex.target = this;

		if(ex.eventFor == 'parent' && this.isTransitive && this.isTransitive()){
			if(this.parent) this.parent.fireEvent(evtName, ex);
			return;
		}

		if(typeof(this['on_'+evtName]) == 'function'){
			try{
				this['on_'+evtName](ex);
			}catch(e){
				console.log('Error calling event handler function ','on_'+evtName, ex, 'component', this , 'error', e);
				console.error(e.message);
			}

		}

		var l;
		if(this.__listeners) l=this.__listeners[evtName];
		if(l) for(var i=0; i<l.length; i++){
			try{
				l[i].callback(ex);
			}catch(e){
				console.log('Error firing event ',evtName, ex, 'listener', l[i].scope, 'error', e);
				console.error(e.message);
			}
		}

		var child;
		if(ex.eventFor == 'children' && this.children){
			for(var i=0; i<this.children.length; i++){
				child = this.children[i];
				// if hidden no need for hide/show event to propagate
				if(!child.isVisible() && (evtName == 'hide' || evtName == 'show' )) continue; 
				
				child.fireEvent(evtName, ex);
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
			this.fireEvent(visible ? 'show':'hide',{eventFor:'children'});
	};

}(mi2JS));
