(function(mi2){
	mi2.templateExpand = {};

	mi2.templateExpand.filter = function(prop, el, part, comp){
		var idx = prop.indexOf('|');

		// simple value extract
		if(idx == -1) return function(data){ return prop === '' ? data:data[prop]; };

		// filter extracted value
		var filter = mi2.parseFilter(prop.substring(idx+1));
		prop = prop.substring(0,idx);
		return function(data){
			return mi2.filter( prop === '' ? data:data[prop], filter, prop, data); 
		};
	}

	mi2.templateExpand['const'] = function(prop, el, part, comp){
		var val = mi2.filters['const'](prop);
		return function(){ return val; };
	};

	function genPart(prop, el, part, comp){
		var idx = prop.indexOf(':'), prefix = 'filter';
		if(idx != -1){
			prefix = prop.substring(0,idx);
			prop = prop.substring(idx+1);
		}
		if(!mi2.templateExpand[prefix]) consol.error('prefix not supported '+prefix+' in expression '+prefix+':'+prop);
		return mi2.templateExpand[prefix](prop, el, part, comp);
	}

	function genPrinter(arr){
		return function(data){
			data = data || {};
			if(arr.length == 1){
				// return exact value for single 
				return arr[0] instanceof Function ? arr[0](data) : arr[0];
			}else{
				// sanitize null and undefined for concatenated strings
				var str = '';
				for( var i=0; i<arr.length; i++){
					str += arr[i] instanceof Function ? toEmpty(arr[i](data)) : toEmpty(arr[i]);
				}
				return str;				
			}
		}
	}

	/** Fix value for string concatenation.
	    @returns empty string instead of null or undefined */
	function toEmpty(val){
		return val === null || val === void 0 ? '':val;
	}

	/** regexp that checks if expression is a template expression. */
	var tplReg = /\$\{([^}]*)\}/g;

	/**
	   @parameter str - template string that defines the functionality
	   @parameter el - element where template value will be inserted
	   @parameter part - part of element(text node or attribute)
	   @parameter comp - component instance
	*/
	mi2.parseTemplate = function(str, el, part, comp){
		var arr = [];
		var offset = 0;
		str.replace(tplReg, function(match, prop, idx){
			if(offset < idx) arr.push(str.substring(offset,idx));
			arr.push(genPart(prop, el, part, comp));
			offset = idx+match.length
			return match;
		});

		if(offset == 0) return null;
		if(offset < str.length) arr.push(str.substring(offset,str.length));
		return genPrinter(arr, el, part, comp);
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

	mi2.loadTemplate = function(el, comp){
		if(el instanceof mi2) el = el.el;
		var list = [];
		mi2.loadTemplateRec(el,list,comp)
		list.setValue = setValue;
		return list;
	};

	mi2.loadTemplateRec = function(el, list, comp){
		list = list || [];
		var attribs = el.attributes;
		var count = attribs.length;
		var updater, wrapped;

		// We go in reverse because templated attributes are removed right away.
		// This way we do not go out of bounds ot the collection as it shortens
		for(var i=count-1; i>=0; i--){
			if(!attribs[i].value) continue;

			updater = mi2.parseTemplate(attribs[i].value, el, attribs[i], comp);
			if(updater){
				if(wrapped == null) wrapped = new mi2(el); // create wrapper only if needed
				list.push(forAttr(wrapped, attribs[i].name, updater));
			}
		}

		var ch = el.firstChild;
		while(ch){
			if(ch.tagName){
				if(!ch.hasAttribute('template'))
					mi2.loadTemplateRec(ch,list, comp);
			}else{
				// TextNode
				updater = mi2.parseTemplate(ch.nodeValue, el, ch, comp);
				if(updater) list.push(forTextNode(ch,updater));
			}
			ch = ch.nextSibling;
		}
		return list;		
	}


}(mi2JS));