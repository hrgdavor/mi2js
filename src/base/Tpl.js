
mi2JS.comp.add('base/Tpl', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	var mi2 = mi2JS;
	var mi2Proto = mi2.prototype;

	proto.construct = function(el, tpl, parent){
		superProto.construct.call(this, el, tpl, parent);
		this.template = this.loadTemplate(el);
	};

	proto.setValue = function(data){
		this.fillTemplate(this.template, data);
	};

	proto.fillTemplate = function(list, data){
		var count = list.length;
		for(var i=0; i<count; i++){
			list[i](data);
		}
	};

	function forAttr(el, attr, func){
		el.attr(attr, null);
		return function(data){
			el.attr(attr, func(data));
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
		var attribs = el.attributes;
		var count = attribs.length;
		var idx, updater, wrapped;

		// We go in reverse because templated attributes are removed right away.
		// This way we do not go out of bounds ot the collection as it shortens
		for(var i=count-1; i>=0; i--){
			if(!attribs[i].value) continue;

			updater = mi2.parseTemplate(attribs[i].value);
			if(updater){
				if(wrapped == null) wrapped = new mi2(el); // create wrapper only if needed
				list.push(forAttr(wrapped, attribs[i].name, updater));
			}
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
