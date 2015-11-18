(function(mi2){

	var mi2Proto = mi2.prototype; // allow minimizer to shorten prototype assignments

	/** Create a html node. <br>
		Example: mi2.addTag(document.body, 
			{	tag:'DIV', 
				html: '<b>Title:</b>Sunshine', 
				attr:{'class':'freaky-line'}
			}
		);
		Example: mi2.addTag(document.body, 'DIV', 'freaky-line', '<b>Title:</b>Sunshine');

		@param {HTMLElement} [parent] - parent for the new node. Use null if you intend to add the node to a parent later using appendChild(..) .
		@param {string} tag - tag name, must be uppercase
		@param {string} [cls] - css class name for the new node
		@param {string} [html] - innerHTML for the new node
		@param {object} {attribs} - list of attributes to set

		@returns {HTMLElement} new node
	*/
	mi2.addTag = function(parent, tag, cls, html, attribs){

		// transitional version, until all code switches to object parameter
		if(typeof tag != 'string'){
			html = tag.html;
			attribs = tag.attr;
			tag = tag.tag;
		}

		var e = document.createElement(tag);

		if(cls)    e.className = cls;
		if(parent){
			if(parent instanceof mi2) parent = parent.el;
			parent.appendChild(e);
		}
		if(html)   e.innerHTML=html;
		
		if(attribs)
			for(var attrName in attribs)
				e.setAttribute(attrName, attribs[attrName]);
		
		return e;
	};

	mi2.add = function(parent,tag){
		return new mi2(mi2.addTag(parent,tag));
	}

	/** Check if two rectangles are intersecting */
	mi2.intersect = function(a, b) {
		return (a.left <= b.right &&
			b.left <= a.right &&
			a.top <= b.bottom &&
			b.top <= a.bottom);
	}

	mi2.toTemplate = function(node, defAttr){
		var tpl = { tag: node.tagName, html: node.innerHTML};
		var attr = defAttr ? mi2.copy(defAttr) : {};
		var it = node.attributes;
   		if(it) for(var i=0; i<it.length; i++) attr[it[i].name] = it[i].value;
		tpl.attr = attr;
		return tpl;
	}

	mi2Proto.hasAttr = function(name){
		return this.el.hasAttribute(name);
	};

	mi2Proto.attrDef = function(name, def){
		var val = this.el.getAttribute(name);
		if(val === null) return def;
		return val;
	};

	mi2Proto.attr = function(name, val){
		if(arguments.length > 1){
			if(val === null || val === void 0){
				if(this.el.hasAttribute(name)) this.el.removeAttribute(name);
			}else{
				if(val !== this.el.getAttribute(name)) 
					this.el.setAttribute(name,val);
			}
		}else{
			return this.el.getAttribute(name);
		}
	};

	mi2Proto.attrNum = function(name, def){
		return mi2.num( this.attrDef(name, def) );
	};

	/** Boolean from attribute
		just defined - <input required> <input required="">
		value same as name <input required="required">
		value 1,true - <input required="1"> <input required="true">
	*/
	mi2Proto.attrBoolean = function(name, def){

		if(this.hasAttr(name)){
			var val = this.attr(name);
			if(val === null || val == '' || val == 'true' || val == name || val == '1') return true;
		}else
			return def;

		return false;
	};

	mi2Proto.data = function(name, val){
		if(arguments.length > 1){
			if(val === null || val === void 0){
				if(this.el.dataset[name] !== void 0) delete this.el.dataset[name];
			}else{
				if(val !== this.el.dataset[name]) 
					this.el.dataset[name] = val;
			}
		}else{
			return this.el.dataset[name];
		}
	};

	/** Add class to the element if condition is true, and remove if false. 
		@parameter toAdd - className to add/remove 
		@parameter condition - (true/false) determines if add/remove is executed. Usualy a result of an expression in the caller code. 
	*/
	mi2Proto.classIf = function(toAdd, condition){
		if(condition)
			this.el.classList.add(toAdd);
		else
			this.el.classList.remove(toAdd);
	};

	/*** Same as classIf but reversed condition. */
	mi2Proto.classUnless = function(toAdd, condition){ 
		this.classIf(toAdd, !condition); 
	};

	/** Add a css class to the element. Common function to initiate change defined in css. */
	mi2Proto.addClass = function(toAdd) {
		this.el.classList.add(toAdd);
	};

	/** Check if one of space separated values is in the element's className */
	mi2Proto.hasClass = function(name) {
		return this.el.classList.contains(name);
	};

	/** Remove a css class from the element (leaving others intact) */
	mi2Proto.removeClass = function(toRemove) {
		if(this.el.classList.length)
			return this.el.classList.remove(toRemove);
	};

	mi2Proto.setHtml = function(html){
		if(this.el.innerHTML !== html) this.el.innerHTML = html;
	};

	mi2Proto.setText = function(text){
		if(this.el.textContent !== text) this.el.textContent = text;	
	};

})(mi2JS);
