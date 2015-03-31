(function(mi2){

	if(!mi2.comp) mi2.comp = {def:{}, tpl:{}, later:{}, tags:{}};

	var mi2Proto = mi2.prototype;

	mi2.comp.make = function(el, compName, parent, parNode){
		try{

			// string template for the element is provided when creating from scratch
			if(typeof(el) == 'string'){
				if(!parNode && parent) parNode = parent.el;
				el = mi2.addTag( parNode, el );
			} 

			if( !compName ){
				compName = el.getAttribute('as');
				if(!compName) compName = this.tags[el.tagName];
			} 
			el.setAttribute('as', compName);

			var compDef = this.get(compName, el);
			var c = new compDef();
			compDef.constructor.call(c, el, this.getTpl(compName), parent );

			c.setParent(parent);

			c.fireEvent('afterCreate');
			// fired only once
			if(c.__listeners) delete c.__listeners.afterCreate;

			return c;

		}catch(e){
			// log the compnent and the node where the error happened
			// this will occur for each parent too as the error is rethrown
			// and error will show up in console for inspection of execution stack
			console.log('error while creating a component ',compName, el, e);
			throw e;
		}
	};

	mi2.comp.getTpl = function(name){ 
		var tpl = this.tpl[name];
		if(!tpl && tpl !== '') throw new Error('Component template not found: '+name);
		return tpl;
	};

	mi2.comp.check = function(name){ return this.def[name] || this.later[name]; }
	
	mi2.comp.get = function(name, el){ 
		var compDef = this.def[name];
		if(!compDef && this.later[name]){
			compDef = this.later[name]();
		}
		if(!compDef) {
			var msg = 'Component not found: '+name;
			console.log(msg,el);
			throw new Error(msg);
		}
		return compDef; 
	};

	mi2.comp.add = function(name, supName, tpl, initializer){
		this.tags[name.replace('/','-').toUpperCase()] = name;
		this.tags[name] = name; // cover cases where tag is upercase(HTL), or exact case (XHTML)

		if(this.def[supName]){
			this.initComp(name, supName, tpl, initializer);
		}else{
			this.later[name]  = function(){ return mi2.comp.initComp(name, supName, tpl, initializer); };
		}

	};

	mi2.comp.initComp = function(name, supName, tpl, initializer){
		var comp = this.def[name];

		var superClass = this.get(supName);
		if(!comp){
			comp = eval('(function '+name.replace('/','_')+'(){})');
			comp.superClass = superClass;
			mi2.extend( comp, superClass );
			// nasty hard to catch bug happens if a comp def does not put a 
			// constructor with the 3 parameters. 
			// compDef.constructor.call fails with error: "SyntaxError: malformed formal parameter"
			// so here is the default one
			comp.constructor = function defaultConstructor(el, tpl, parent){
				superClass.constructor.call(this, el, tpl, parent);
			};
		}
		// else: 
		// hapens when reloading component in runtime
		// changes to the component prototype can be applied to the already instantiated components
		initializer(comp, comp.prototype, superClass);
		comp.compName = name;
		if(typeof(comp.constructor) != "function") console.log("constructor not function ",compName);

		if(tpl && tpl == 'extend:') 
			tpl = this.getTpl(supName);
		else if(tpl && tpl.length > 7 && tpl.substring(0,7) == 'extend:') 
			tpl = this.getTpl(tpl.substring(7));

		if(tpl || tpl === '') 
			this.tpl[name] = tpl;

		return (this.def[name] = comp);

	};


	/* ***********************  basic html nodes extension  ***************************** */

	mi2Proto.isVisible = function(){
		return !this.hasClass('hidden');
	};
	mi2Proto.setVisible = function(visible){
		this.classUnless('hidden',visible);
	};

	mi2Proto.isEnabled = function(){
		return !this.hasClass('disabled');
	};
	mi2Proto.setEnabled = function(enabled){
		this.classUnless('disabled', enabled);
	};

	mi2Proto.isSelected = function(){
		return this.hasClass('selected');
	};
	mi2Proto.setSelected = function(selected){
		this.classIf('selected', selected);
	};

/* ********************* Base component   ***********************************/

	function Base(){}

	Base.constructor = function(el,tpl){
		Base.superClass.constructor.call(this,el);

		if(tpl) el.innerHTML = tpl;
		mi2.parseChildren(el,this);

	};

	mi2.comp.def.Base = Base;
	mi2.comp.tpl.Base = '';
	Base.compName = 'Base';
	// extend mi2JS to get addClass and other html utility functions (html.js must be included in the bundle to have them)
	mi2.extend(Base, mi2);

	var proto = Base.prototype; //

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
		return setTimeout( mi2.bind(this,fc), delay );
	};
  
	proto.setInterval = function(fc,delay){
		return setInterval( mi2.bind(this,fc), delay );
	};

	proto.addListener = function(evtName,callback,thisObj){
		if(!this.__listeners) this.__listeners = {};
		var l = this.__listeners[evtName];
		if(!l) l = this.__listeners[evtName] = [];

		// bind a scope to the callback function
		if(thisObj) callback = mi2.bind( thisObj, callback );
		
		l.push(callback);
	};

	proto.fireEvent = function(evtName, ex){
		
		if(!ex) ex = {};
		ex.name = evtName;
		ex.target = this;

		var l;
		if(this.__listeners) l=this.__listeners[evtName];
		if(l) for(var i=0; i<l.length; i++){
			try{
				l[i](ex);
			}catch(e){console.log(e);}
		}
		if(typeof(this['on_'+evtName]) == 'function') this['on_'+evtName](ex);
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

	proto.attr = function(name, def){
		if(!this.el.hasAttribute(name)) return def;
		return this.el.getAttribute(name);
	};

	proto.setVisible = function(visible){
		this.classUnless('hidden',visible);
		this.fireEvent(visible ? 'show':'hide',{});
	};


}(mi2JS));
