
mi2JS.comp.add('base/Template', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(comp, proto, superClass){

	comp.constructor = function(el, tpl, parent){
		superClass.constructor.call(this, el, tpl, parent);
		this.template = this.loadTemplate(el);
	};

	proto.setValue = function(data){
		this.fillTemplate(this.template, data);
	};

	proto.extractData = function(data, code){
		return (typeof(data[code]) != "undefined") ? data[code]: '';
	};

	proto.fillTemplate = function(list, data){
		var tplReg = /\$\{([a-zA-z_0-9]+)\}/g;
		var self = this;
		var func = function(match,code){ return self.extractData(data,code)};
		var count = list.length;
		var def, text; // def: [str, node, attribute] - attribute is optional
		for(var i=0; i<count; i++){
			def = list[i];
			text = def[0].replace(tplReg, func);
			if(def[2]){
				def[1].setAttribute(def[2], text);
			}else
				def[1].nodeValue = text;
		}
	};

	proto.loadTemplate = function(el, list){
		var tplReg = /\$\{([a-zA-z_0-9]+)\}/;
		list = list || [];
		var a = el.attributes;
		var count = a.length;
		var idx;
		for(var i=0; i<count; i++){
			if(!a[i].value) continue;
			if(tplReg.test(a[i].value))
				list.push([a[i].value, el, a[i].name]);
		}

		var ch = el.firstChild;
		while(ch){
			if(ch.tagName){
				if(!ch.getAttribute('mi-comp'))// each component handles own template
					this.loadTemplate(ch,list);
			}else{
				var str = ch.nodeValue;
				if(tplReg.test(str)){
					list.push([str, ch]);
				}
			}
			ch = ch.nextSibling;
		}

		return list;
	};

	
});
