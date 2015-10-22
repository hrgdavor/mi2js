
mi2JS.comp.add('base/Tpl', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	var mi2 = mi2JS;

	proto.construct = function(el, tpl, parent){
		superProto.construct.call(this, el, tpl, parent);
		this.template = this.loadTemplate(el);
	};

	proto.setValue = function(data){
		this.fillTemplate(this.template, data);
	};

	proto.extractData = function(data, code){
		return (typeof(data[code]) != "undefined") ? data[code]: '';
	};

	var tplReg = /\$\{([a-zA-z_0-9]+)\}/g;
	proto.fillTemplate = function(list, data){
		var count = list.length;
		for(var i=0; i<count; i++){
			list[i](data);
		}
	};

	function forAttr(attr, func){
		attr.value = '';
		return function(data){
			var str = func(data);
			if(attr.value != str) attr.value = str; // avoid updating DOM if not needed
		}
	}

	function forTextNode(node, func){
		node.nodeValue = '';
		return function(data){
			var str = func(data);
			if(node.nodeValue != str) node.nodeValue = str; // avoid updating DOM if not needed
		}
	}

	proto.loadTemplate = function(el, list){
		list = list || [];
		var a = el.attributes;
		var count = a.length;
		var idx, updater;
		for(var i=0; i<count; i++){
			if(!a[i].value) continue;
			updater = mi2.parseTemplate(a[i].value);
			if(updater) list.push(forAttr(a[i], updater));
		}

		var ch = el.firstChild;
		while(ch){
			if(ch.tagName){
				if(!ch.getAttribute('as')) // each component handles own template
					this.loadTemplate(ch,list);
			}else{
				// TextNode
				updater = mi2.parseTemplate(ch.nodeValue);
				if(updater) list.push(forTextNode(ch,updater));
			}
			ch = ch.nextSibling;
		}
		return list;
	};

});
