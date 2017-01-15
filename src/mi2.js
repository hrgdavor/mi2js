(function(){
/** 
@namespace mi2JS(core)

*/

/** Very basic wrapper used for scripting(similar to JQuery and alike). Contains some useful
   methods to allow manipulation, and can be extended further if needed. For more advanced 
   functionalities check {@link mi2JS.comp..Base} component and it's descendants in {@link mi2JS.comp.}.
@class NodeWrapper
@memberof mi2JS(core)
*/
var $ = window.mi2JS = window.mi2JS || function NodeWrapper(node, root){
	if( this instanceof $){ // called as "new mi2JS(node);"
		this.el = node instanceof String ? $.find(node, root) : node;
		if(this.el === null) throw new Error('null node or not found '+node);			
	}else 
		return new $(node, root);
};

/**  &#47;^[A-Za-z]+[\w-_]*&#47; - defines allowed tag names when sent as parameter to find/findAll
@constant tagNameReg
@memberof mi2JS(core)
*/
$.tagNameReg = /^[A-Za-z]+[\w-_]*/;

/** return first node matching the search criteria
@function find
@memberof mi2JS(core)
@param {String} search Search pattern
@param {Element} root root node
*/
$.find = function(search, root){
	// $.nn('find',{search:search});//ASSERT

	root = root || document.body;
	if(root instanceof $) root = root.el;

	if(search.charAt(0) == '#') return root.getElementById(search.substring(1));

	if($.tagNameReg.test(search)) return root.getElementsByTagName(search)[0];

	return root.querySelector(search); 
}

/** return all nodes matching the search criteria
@function findAll
@memberof mi2JS(core)
@param {String} search Search pattern
@param {Element} root root node
*/
$.findAll = function(search, root){
	// $.nn('find',{search:search});//ASSERT

	root = root || document.body;
	if(root instanceof $) root = root.el;

	if($.tagNameReg.test(search)) return root.getElementsByTagName(search);

	return root.querySelectorAll(search); 
}

/** use the object as scope for the function (popular)
@function bind
@memberof mi2JS(core)
@param {Object} object scope for the function
@param {Element} func function
*/
$.bind = function(object, func){
	// dynamic
	if(typeof func == 'string')
		return function() { object[func].apply(object, arguments); };

	// native implementation
	if(func.bind) return func.bind(object);

	// closure when native implementation not present
	return function() { func.apply(object, arguments); };
};

/** 
<p><b>utility for classes </b> - 
Extends destination class with source class.
</p>
<p><i>
Taken over from Oliver Caldwell's blog:  Prototypical inheritance done right<br>
{@link http://oli.me.uk/2013/06/01/prototypical-inheritance-done-right/}
</i></p>

@function extend
@memberof mi2JS(core)
 
@param {class} destination The class that should be inheriting things.
@param {class} source The parent class that should be inherited from.
@return {object} The prototype of the parent.
  
 */
$.extend = function(destination, source) {
	destination.prototype = Object.create(source.prototype);
	destination.prototype.constructor = destination;
	destination.superClass = source.prototype;
	return source.prototype;
};

/**<p><b>utility for classes </b> - 
Takes prototype of the source(mixin) class and copies properties to prototype of destination class.
</p>
@function mixin
@memberof mi2JS(core)

@param {class} destination - The class that is being enhanced with the mixin
@param {class} source - The mixin class
@param {boolean} overwrite - should the existing properties be overwritten
*/
$.mixin = function(dest, source, overwrite) {
	var proto = dest.prototype, ext = source.prototype;
	for(var p in ext) if(!proto[p])	proto[p] = ext[p];	
};

/** Update dest object by adding properties from another object. Copied aro only own properties
of the other object (checked by hasOwnProperty).

@function update
@memberof mi2JS(core)

@param {Object} destination - The object that is being updated
@param {Object} update - Object from which the properties are copied
*/
$.update = function(dest, update){
	if(dest && update ){
		for (var prop in update)
			if(update.hasOwnProperty(prop)) dest[prop] = update[prop];
	}
	return dest;
};

/** Check if the passed parameter is an array
@function isArray
@memberof mi2JS(core)
@param {Object} object
*/
$.isArray = Array.isArray ||  function (xs) {
    return {}.toString.call(xs) === '[object Array]';
};

/** Make a shallow copy of an object.

@function copy
@memberof mi2JS(core)

@param {Object} obj - objec to copy
*/
$.copy = function(obj){
    if ($.isArray(obj)) {
        var len = obj.length;
        copy = Array(len);
        for (var i = 0; i < len; i++) {
            copy[i] = obj[i];
        }
        return copy;
    }
	return $.update({},obj);
};

/** Parse number using parseFloat, but return zero if not a number.

@function num
@memberof mi2JS(core)

@param obj - string or anything else (if parseFloat fails, zero is returned)
*/
$.num = function(str){
	var n = parseFloat(str);
	if(isNaN(n)) return 0;
	return n;
};

/** Check if passed value is empty.
<ul>
  <li>null
  <li>undefined
  <li> === 0
  <li>empty string
  <li>empty array
  <li>empty object (without any iterable properties)
</ul>

@function isEmpty
@memberof mi2JS(core)

@param obj
*/
$.isEmpty = function(obj){
	if(obj === void 0 || obj === null || obj === 0) return true;
	if(obj instanceof Array || typeof obj == 'string') return obj.length == 0;
	if(typeof obj == 'object'){
		for(var p in obj) return false;
		return true;
	}
	return false;
};


/** Uses {@link mi2JS(core).fixEvent}. Listen for event on an object. Any object that has either 
addEventListener or attachEvent.

@function listen
@memberof mi2JS(core)
@param {Object} obj object that will generate the event
@param {String} evt event name
@param {Function} fnc callback
@param {Object} self callback function scope ( bind will be performed )
@param {boolean|object} options options parameter for addEventListener
*/
$.listen = function ( obj, evt, fnc, self, options ){

//	$.nn('$.listen', {obj:obj, evt:evt, fnc:fnc} );

	var listener = function(evt){
		if(typeof(fnc) == 'string') fnc = self[fnc];
		fnc.call(self || obj, $.fixEvent(evt));
	};

	if (obj.addEventListener){
		obj.addEventListener(evt,listener,options);
		return true;
	}
	else 
		return obj.attachEvent("on"+evt,listener);
};

/** Used by {@link mi2JS(core).listen}. Do some cleaning on the event object provided by the browser, for easier handling of browser differences.
This is likely more extensive in other libraries. Override it if you need more.

@function fixEvent
@memberof mi2JS(core)
@param {Event} evt Browser  event
*/
$.fixEvent = function(evt){
	evt = evt || window.event;
	evt.stop = function() {
		if(this.preventDefault){ 
			this.preventDefault(); 
			this.stopPropagation(); 
		} else {
			this.returnValue = false;
		}
	};

	evt.target = evt.target || evt.srcElement;
	
	evt.pointerX = function() {
		return this.pageX || (this.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
	};
	
	evt.pointerY = function() {
		return this.pageY || (this.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
	};

	return evt;
};


}());
