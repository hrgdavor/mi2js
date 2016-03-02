(function(mi2){
	
	function genPart(prop, filter){
		// simple value extract
		if(!filter) return function(data){ return prop === '' ? data:data[prop]; };

		// filter extracted value
		filter = mi2.parseFilter(filter);
		return function(data){
			return mi2.filter( prop === '' ? data:data[prop], filter, prop, data); 
		};
	}

	function genPrinter(arr){
		return function(data){
			data = data || {};
			if(arr.length == 1){
				return arr[0] instanceof Function ? arr[0](data) : arr[0];
			}else{
				var str = '';
				for( var i=0; i<arr.length; i++){
					str += arr[i] instanceof Function ? arr[i](data) : arr[i];
				}
				return str;				
			}
		}
	}

	var tplReg = /\$\{([a-zA-z_0-9]*)\|?([^\}]+)?\}/g;

	mi2.parseTemplate = function(str){
		var arr = [];
		var offset = 0;

		str.replace(tplReg, function(match, prop, filter, idx){
			if(offset < idx) arr.push(str.substring(offset,idx));
			arr.push(genPart(prop, filter));
			offset = idx+match.length
			return match;
		});

		if(offset == 0) return null;
		if(offset < str.length) arr.push(str.substring(offset,str.length));
		return genPrinter(arr);
	};

	mi2.parseExpander = function(exp){
		var tpl;
		for(var p in exp){
			if(typeof exp[p] == 'string'){
				tpl = mi2.parseTemplate(exp[p]);
				if(tpl) exp[p] = tpl;
			}
		}
		return exp;
	};

	mi2.expandData = function(data, exp, copy){
		var ret = copy ? mi2.update({},data) : {};

		for(var p in exp){
			ret[p] = exp[p] instanceof Function ? exp[p](data) : exp[p];
		}
		
		return ret;
	};

	mi2.expandArray = function(arr, exp, copy){
		var ret = [];
		
		for(var i=0; i<arr.length; i++){
			ret.push(mi2.expandData(arr[i], exp, copy));
		}

		return ret;
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
		var updater, wrapped;

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