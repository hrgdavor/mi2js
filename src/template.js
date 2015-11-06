(function(mi2){
	
	function genPart(prop, format){
		// simple value extract
		if(!format) return function(data){ return data[prop]; };

		// format extracted value
		format = mi2.parseFilter(format);
		return function(data){ return mi2.filter(data[prop], format, prop, data); };
	}

	function genPrinter(arr){
		return function(data){
			if(!data) return '';
			var str = '';
			for( var i=0; i<arr.length; i++){
				str += arr[i] instanceof Function ? arr[i](data) : arr[i];
			}
			return str;
		}
	}

	var tplReg = /\$\{([a-zA-z_0-9]+):?([^\}]+)?\}/g;

	mi2.parseTemplate = function(str){
		var arr = [];
		var offset = 0;

		str.replace(tplReg, function(match, prop, format, idx){
			if(offset < idx) arr.push(str.substring(offset,idx));
			arr.push(genPart(prop, format));
			offset = idx+match.length
			return match;
		});

		if(offset == 0) return null;
		if(offset < str.length) arr.push(str.substring(offset,str.length));

		return genPrinter(arr);
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

	function setValue(data){
		var count = this.length;
		for(var i=0; i<count; i++){
			this[i](data);
		}
	}

	mi2.loadTemplate = function(el){
		if(el instanceof mi2) el = el.el;
		var list = [];
		mi2.loadTemplateRec(el,list)
		list.setValue = setValue;
		return list;
	};

	mi2.loadTemplateRec = function(el, list){
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
					mi2.loadTemplateRec(ch,list);
			}else{
				// TextNode
				updater = mi2.parseTemplate(ch.nodeValue);
				if(updater) list.push(forTextNode(ch,updater));
			}
			ch = ch.nextSibling;
		}
		return list;		
	}


}(mi2JS));