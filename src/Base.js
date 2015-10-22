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

	proto.construct = function(el,tpl, parent){
		this.el = el;

		if(tpl) el.innerHTML = tpl;
		mi2.parseChildren(el,this);
	};

	proto.find    = function(search){ return mi2.find   (this.el, search); }
	proto.findAll = function(search){ return mi2.findAll(this.el, search); }

	proto.getCompName = function(){
		if(this.el && this.el.getAttribute){
			return this.el.getAttribute('as');
		}
	};

	proto.getCompClass = function(){
		var compName = this.getCompName();
		if(compName)
			return mi2.comp.get(compName);
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

		// if not initialized yet, fire init event first
		if(evtName == 'show' && !this.__initialized){
			this.fireEvent('init',{ eventFor: 'children' });
		}

		// allow for init to be fired even when hidden (and then skipped on_show)
		if(evtName == 'init'){
			this.__initialized = true;
		}
		
		if(!ex) ex = {};
		ex.name = evtName;
		ex.target = this;

		if(ex.eventFor == 'parent' && this.isTransitive()){
			if(this.parent) this.parent.fireEvent(evtName, ex);
			return;
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
		if(typeof(this['on_'+evtName]) == 'function') this['on_'+evtName](ex);

		if(ex.eventFor == 'children' && this.children){
			for(var i=0; i<this.children.length; i++){
				this.children[i].fireEvent(evtName, ex);
			}
		}
	};

	proto.addChild = function(c){
		if(!this.el) {
			var msg = 'Component not propery initialized. Must call Base constructor before parseChildren';
			console.log(msg, this, this.el);
			throw new Error(msg);
		}
		if(!this.children) this.children = [];
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

	proto.attrInt = function(name, def){
		return mi2.num( this.attr(name,def) );
	};

	proto.setVisible = function(visible){
		mi2Proto.setVisible.call(this, visible);
		this.fireEvent(visible ? 'show':'hide',{eventFor:'children'});
	};

}(mi2JS));
