(function(){
/** 
@namespace mi2JS(core)
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
@param {HTMLElement} root root node
*/
$.find = function(search, root){
	$.nn('find',{search:search});//ASSERT

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
@param {HTMLElement} root root node
*/
$.findAll = function(search, root){
	$.nn('find',{search:search});//ASSERT

	root = root || document.body;
	if(root instanceof $) root = root.el;

	if($.tagNameReg.test(search)) return root.getElementsByTagName(search);

	return root.querySelectorAll(search); 
}

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
<p>
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

$.mixin = function(dest, source, overwrite) {
	var proto = dest.prototype, ext = source.prototype;
	for(var p in ext) if(!proto[p])	proto[p] = ext[p];	
};

$.update = function(dest, update){
	if(dest && update ){
		for (var prop in update)
			if(update.hasOwnProperty(prop)) dest[prop] = update[prop];
	}
	return dest;
};

$.isArray = Array.idArray ||  function (xs) {
    return {}.toString.call(xs) === '[object Array]';
};

/** Make shallow copy */
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

$.num = function(str){
	var n = parseFloat(str);
	if(isNaN(n)) return 0;
	return n;
};

$.likeNull = function(obj){
	return !obj;
};

$.isEmpty = function(obj){
	if(obj === void 0 || obj === null || obj === 0) return true;
	if(obj instanceof Array || typeof obj == 'string') return obj.length == 0;
	if(typeof obj == 'object'){
		for(var p in obj) return false;
		return true;
	}
	return false;
};

/** Check if any of the the values are null and throw an Error. 
	Use where fail-fast is needed so invalid parameters don't cause errors later.
	
*/
$.nn = function(name,list){
	for(var p in list){
		if(list[p] === null || typeof(list[p]) == "undefined"){
			console.error(name," parameter ",p," is null but should not be ");
		}
	}
};

$.listen = function ( obj, evt, fnc, self, useCapture ){

	$.nn('$.listen', {obj:obj, evt:evt, fnc:fnc} );

	var listener = function(evt){
		if(typeof(fnc) == 'string') fnc = self[fnc];
		fnc.call(self || obj, $.fixEvent(evt));
	};

	if (obj.addEventListener){
		obj.addEventListener(evt,listener,useCapture === true);
		return true;
	}
	else 
		return obj.attachEvent("on"+evt,listener);
};

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
