(function(mi2){
/** 
@namespace mi2JS(html)
*/

/** 
<p>Tempalte object for passing info about a HTML node taht should be created</p>
<p>Used by {@link mi2JS(html).addTag}, {@link mi2JS(html).add}</p>
  @typedef TagTemplate
  @type {object}
  @property {string} tag - tag name (uppercase)
  @property {string} html - html code to put into innerHTML of the newly created node
  @property {Object} attribs - name/value pairs for desired attributes and the values
 */

	var mi2Proto = mi2.prototype; // allow minimizer to shorten prototype assignments

	/** 
	Create a html node. <br>


	@function addTag
	@memberof mi2JS(html)
	@param {Element} parent - parent for the new node. Use null if you intend to add the node to a parent later using appendChild(..) .
	@param {string|TagTemplate} tpl - tag name, or tag template object must be uppercase
	@param {Object} tpl - tag name, must be uppercase

	@returns {Element} new node

	@example 
	mi2.addTag(document.body, 
		{	tag:'DIV', 
			html: '<b>Title:</b>Sunshine', 
			attr:{'class':'freaky-line'}
		}
	);
	// returns creaed Element
	*/
	mi2.addTag = function(parent, tpl, nextSibling){

		if(typeof tpl == 'string') tpl = {tag:tpl};

		var e = document.createElement(tpl.tag);

		if(parent){
			if(parent instanceof mi2) parent = parent.el;
			parent.insertBefore(e, nextSibling || null);
		}
		if(tpl.html)   e.innerHTML=tpl.html;

		var attribs = tpl.attr;
		if(attribs){
			for(var attrName in attribs){
				e.setAttribute(attrName, attribs[attrName]);
			}
		}
		
		return e;
	};

	/** 
	Create a html node, and returns a {@link mi2JS(core).NodeWrapper}. Uses {@link mi2JS(html).addTag} with same parameters <br>
	but returns the created node wrapped with {@link mi2JS(core).NodeWrapper}.

	@function add
	@memberof mi2JS(html)
	@see {@link mi2JS(html).addTag}
	*/
	mi2.add = function(parent, tpl, nextSibling){
		return new mi2(mi2.addTag(parent, tpl, nextSibling));
	}

	/** Check if two rectangles are intersecting each other.

	@function intersect
	@memberof mi2JS(html)
	*/	
	mi2.intersect = function(a, b) {
		return (a.left <= b.right &&
			b.left <= a.right &&
			a.top <= b.bottom &&
			b.top <= a.bottom);
	}

	/** Generate {@link TagTemplate} object that represents the given Element.

	@function toTemplate
	@memberof mi2JS(html)
	@param {Element} node 
	@param {Object} defAttr oprional default attribute values
	*/
	mi2.toTemplate = function(node, defAttr){
		var tpl = { tag: node.tagName, html: node.innerHTML};
		var attr = defAttr ? mi2.copy(defAttr) : {};
		var it = node.attributes;
   		if(it) for(var i=0; i<it.length; i++){
   			if(it[i].name == 'template') continue;
   			attr[it[i].name] = it[i].value;
   		}
		tpl.attr = attr;
		return tpl;
	}

	/** Check if node har a specified attribute defined (regardless of value, null or other)

	@instance
	@method hasAttr
	@memberof mi2JS(core).NodeWrapper
	*/
	mi2Proto.hasAttr = function(name){
		return this.el.hasAttribute(name);
	};

	/** get/set attribute on the wrapped node. Setting attribute to null or undefined
	will remove the attribute.

	@instance
	@method attr
	@memberof mi2JS(core).NodeWrapper

	@param {String} name attribute name
	@param {String} value optionaly if sent sets the attribute
	*/
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

	/** Get attribute, but return default value if not defined

	@instance
	@method attrDef
	@memberof mi2JS(core).NodeWrapper
	@param {string} name attribute name
	@param {object} def default value if attribute is not present
	*/
	mi2Proto.attrDef = function(name, def){
		var val = this.el.getAttribute(name);
		if(val === null) return def;
		return val;
	};

	/** Get attribute, but convert frist using {@link mi2JS(core).num}. Returns 0 when value not a number or
	if attribute is not present.

	@instance
	@method attrNum
@memberof mi2JS(core).NodeWrapper
	@param {string} name attribute name
	@param {object} def default value if attribute is not present
	*/
	mi2Proto.attrNum = function(name, def){
		return mi2.num( this.attrDef(name, def) );
	};

	/** Boolean from attribute

		@instance
		@method attrBoolean
@memberof mi2JS(core).NodeWrapper
		@param {string} name attribute name
		@param {object} def default value if attribute is not present

@example 
Value is true for all these instances
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

/* 

@function data
@instance
@memberof mi2JS(core).NodeWrapper

no real need to use dataset, and attributes work on more browsers 
*/
	mi2Proto.dataAttr = function(name, val){
		name = 'data-'+name;
		if(arguments.length > 1){
			this.attr(name,val);
		}else{
			return this.attr(name);
		}
	};

	/** Add class to the element if condition is true, and remove if false. 

@function classIf
@instance
@memberof mi2JS(core).NodeWrapper
		@param toAdd - className to add/remove 
		@param condition - (true/false) determines if add/remove is executed. Usualy a result of an expression in the caller code. 
	*/
	mi2Proto.classIf = function(toAdd, condition){
		if(condition)
			this.el.classList.add(toAdd);
		else
			this.el.classList.remove(toAdd);
	};

	/*** Same as classIf but reversed condition. 
@function classUnless
@instance
@memberof mi2JS(core).NodeWrapper
	*/
	mi2Proto.classUnless = function(toAdd, condition){ 
		this.classIf(toAdd, !condition); 
	};

	/** Add a css class to the element. Common function to initiate change defined in css. 
@function addClass
@instance
@memberof mi2JS(core).NodeWrapper
	*/
	mi2Proto.addClass = function(toAdd) {
		this.el.classList.add(toAdd);
	};

	/** Check if one of space separated values is in the element's className 
@function hasClass
@instance
@memberof mi2JS(core).NodeWrapper
	*/
	mi2Proto.hasClass = function(name) {
		return this.el.classList.contains(name);
	};

	/** Remove a css class from the element (leaving others intact) 
@function removeClass
@instance
@memberof mi2JS(core).NodeWrapper
	*/
	mi2Proto.removeClass = function(toRemove) {
		if(this.el.classList.length)
			return this.el.classList.remove(toRemove);
	};

/*
@function setHtml
@instance
@memberof mi2JS(core).NodeWrapper
*/
	mi2Proto.setHtml = function(html){
		if(this.el.innerHTML !== html) this.el.innerHTML = html;
	};

/*
@function setText
@instance
@memberof mi2JS(core).NodeWrapper
*/
	mi2Proto.setText = function(text){
		if(this.el.textContent !== text) this.el.textContent = text;	
	};

/*
@function getText
@instance
@memberof mi2JS(core).NodeWrapper
*/
	mi2Proto.getText = function(){
		return this.el.textContent;	
	};

})(mi2JS);
