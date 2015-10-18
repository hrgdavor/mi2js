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

	/** Add nodes from html to the parent node and return the first top level node(with tagName) from the snippet.<br/>
		Usual use case would not have more than one top level node, but in cas needed, it is supported.

		@param {string} html - html code
		@param {HTMLElement} [parent] - parent to add the new node to

		@returns {HTMLElement} new node
	*/
	mi2.addHtml = function( parent, html ){
		
		if(parent && parent instanceof mi2) parent = parent.el;

		var tmp = mi2.addTag(null,"DIV",null,html);
		var newNode = null;

		var n = tmp.firstChild;
		while(n){
			if(!newNode && n.tagName) newNode = n;
			if(parent) parent.appendChild(n);
			n = n.nextSibling;
		}

		return newNode;
	};

	mi2.intersect = function(a, b) {
		return (a.left <= b.right &&
			b.left <= a.right &&
			a.top <= b.bottom &&
			b.top <= a.bottom);
	}

	mi2.toTemplate = function(node, defAttr){
		var tpl = { tag: node.tagName, html: node.innerHTML};
		var attr = defAttr ? mi2.clone(defAttr) : {};
		var it = node.attributes;
   		if(it) for(var i=0; i<it.length; i++) attr[it[i].name] = it[i].value;
		tpl.attr = attr;
		return tpl;
	}

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

	/* Set html andavoid changing innerHTML if it is same value, 
	so selection and copy/paste can work when html is updated with identical value.
	Setting same html clears selection even no visible change will be on the gui.
	
	@paramteter {string} html 

	*/
	mi2Proto.html = function(html, el){
		if(this.el.innerHTML !== html) this.el.innerHTML = html;
	};

})(mi2JS);
