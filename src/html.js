(function(mi2){

	var mi2Proto = mi2.prototype; // allow minimizer to shorten prototype assignments

	/** Create a html node. <br>
		Example: mi2.addHtml(document.body, 'DIV', 'freaky-line', '<b>Title:</b>Sunshine');

		@param {HTMLElement} [parent] - parent for the new node. Use null if you intend to add the node to a parent later using appendChild(..) .
		@param {string} tag - tag name, must be uppercase
		@param {string} [cls] - css class name for the new node
		@param {string} [html] - innerHTML for the new node
		@param {object} {attribs} - list of attributes to set

		@returns {HTMLElement} new node
	*/
	mi2.addTag = function(parent, tag, cls, html, attribs){
		
		var e = document.createElement(tag);

		if(cls)    e.className = cls;
		if(parent) parent.appendChild(e);
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


	/** Add class to the element if condition is true, and remove if false. 
		@parameter toAdd - className to add/remove 
		@parameter condition - (true/false) determines if add/remove is executed. Usualy a result of an expression in the caller code. 
	*/
	mi2Proto.classIf = function(toAdd, condition){
		if(condition)
			this.addClass(toAdd);
		else
			this.removeClass(toAdd);
	};

	/*** Same as classIf but reversed condition. */
	mi2Proto.classUnless = function(toAdd, condition){ 
		this.classIf(toAdd, !condition); 
	};

	/** Add a css class to the element. Common function to initiate change defined in css. */
	mi2Proto.addClass = function(toAdd) {
		if( !this.el.className ) 
			this.el.className = toAdd;
		else if(!this.hasClass(toAdd))
			this.el.className += ' ' + toAdd;
	};

	/** Check if one of space separated values is in the element's className */
	mi2Proto.hasClass = function(name) {
			if(this.el.className == name) return true;
			var a = this.el.className.split(' ');
			for (var i = 0; i < a.length; i++) { if (a[i] == name) return true; }
			return false;
	};

	/** Remove a css class from the element (leaving others intact) */
	mi2Proto.removeClass = function(toRemove) {
		var newC = '';
		var a = this.el.className.split(' ');
		for (var i = 0; i < a.length; i++) {
			if (a[i] != toRemove) {
				if (i > 0)
					newC += ' ';
				newC += a[i];
			}
		}
		this.el.className = newC;
	};

	/* Set html andavoid changing innerHTML if it is same value, 
	so selection and copy/paste can work when html is updated with identical value.
	Setting same html clears selection even no visible change will be on the gui.
	
	@paramteter {string} html 

	*/
	mi2Proto.html = function(html, el){
		if(this.el.innerHTML != html) this.el.innerHTML = html;
	};

})(mi2JS);
