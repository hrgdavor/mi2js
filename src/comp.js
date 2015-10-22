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
			c.construct(el, this.getTpl(compName), parent);

			c.setParent(parent);
			if(parent === null && c.isVisible()){
				// if ROOT component is not hidden, fire show event to cause init event also
				// so component is properly initialized 
				c.fireEvent('show',{eventFor:'children'});
			}

			return c;

		}catch(e){
			// log the component and the node where the error happened
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
		if(this.def[name] || this.later[name]) console.error('Component with same name already defined '+name);
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
		}
		// else: 
		// hapens when reloading component in runtime
		// changes to the component prototype can be applied to the already instantiated components
		initializer(comp.prototype, superClass.prototype, comp, superClass);
		comp.compName = name;

		if(tpl && tpl == 'extend:') 
			tpl = this.getTpl(supName);
		else if(tpl && tpl.length > 7 && tpl.substring(0,7) == 'extend:') 
			tpl = this.getTpl(tpl.substring(7));

		if(tpl || tpl === '') 
			this.tpl[name] = tpl;

		return (this.def[name] = comp);
	};

}(mi2JS));
