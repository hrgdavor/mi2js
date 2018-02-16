(function(){
/** 
@namespace mi2JS(core)

*/



/** 
Defines properties needed to extract single element template from a a node,
or to programatically define such template.

  @typedef ElementTemplate
  @type {object}
  @property {string} tag - tag name
  @property {Object} attr - object containing key->value pairs for attributes
  @property {string} html - innerHTML of the element
 */


/** Very basic wrapper used for scripting(similar to JQuery and alike). Contains some useful
   methods to allow manipulation, and can be extended further if needed. For more advanced 
   functionalities check {@link mi2JS.comp..Base} component and it's descendants in {@link mi2JS.comp.}.
@class NodeWrapper
@memberof mi2JS(core)
*/
var mi2 = window.mi2JS = window.mi2JS || function NodeWrapper(node, root){
	if( this instanceof mi2){ // called as "new mi2JS(node);"
		this.el = node instanceof String ? mi2.find(node, root) : node;
		if(this.el === null) throw new Error('null node or not found '+node);			
	}else 
		return new mi2(node, root);
};

/**  &#47;^[A-Za-z]+[\w-_]*&#47; - defines allowed tag names when sent as parameter to find/findAll
@constant tagNameReg
@memberof mi2JS(core)
*/
mi2.tagNameReg = /^[A-Za-z]+[\w-_]*/;

/** return first node matching the search criteria
@function find
@memberof mi2JS(core)
@param {String} search Search pattern
@param {Element} root root node
*/
mi2.find = function(search, root){
	// mi2.nn('find',{search:search});//ASSERT

	root = root || document.body;
	if(root instanceof mi2) root = root.el;

	if(search.charAt(0) == '#') return root.getElementById(search.substring(1));

	if(mi2.tagNameReg.test(search)) return root.getElementsByTagName(search)[0];

	return root.querySelector(search); 
}

/** return all nodes matching the search criteria
@function findAll
@memberof mi2JS(core)
@param {String} search Search pattern
@param {Element} root root node
*/
mi2.findAll = function(search, root){
	// mi2.nn('find',{search:search});//ASSERT

	root = root || document.body;
	if(root instanceof mi2) root = root.el;

	if(mi2.tagNameReg.test(search)) return root.getElementsByTagName(search);

	return root.querySelectorAll(search); 
}

/** use the object as scope for the function (popular)
@function bind
@memberof mi2JS(core)
@param {Object} object scope for the function
@param {Element} func function
*/
mi2.bind = function(object, func){
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
mi2.extend = function(destination, source) {
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
mi2.mixin = function(dest, source, overwrite) {
	var proto = dest.prototype, ext = source.prototype;
	for(var p in ext) if(!proto[p])	proto[p] = ext[p];	
};

/** Update dest object by adding properties from another object. Copied aro only own properties
of the other object (checked by hasOwnProperty).<br>
For array, all elements of upodate array are added to the first array.

@function update
@memberof mi2JS(core)

@param {Object} destination - The object that is being updated
@param {Object} update - [one or more accepted as variable parameter func] Object from which the properties are copied
*/
mi2.update = function(dest){
	var update;
	var isArray = mi2.isArray(dest);
	for(var i=1; i<arguments.length; i++){
		update = arguments[i];
		if(update === void 0 || update === null) continue;
	    if (isArray){
	        arrayPush.apply(dest,update);
	    }else{
	    	mi2.updateObj(dest,update);
	    }
	}
	return dest;
};

mi2.updateObj = function(dest, update){
	var prop,keys = Object.keys(update);// only own keys are returned
	for (var i=0; i<keys.length; i++){
		prop = keys[i];
		dest[prop] = update[prop];
	}	    	
};

/** Check if the passed parameter is an array
@function isArray
@memberof mi2JS(core)
@param {Object} object
*/
mi2.isArray = Array.isArray ||  function (xs) {
    return {}.toString.call(xs) === '[object Array]';
};
var arrayPush = Array.prototype.push;

/** Make a shallow copy of an object. All parameters both must be same type (all Object or all Array).<br>
this method: mi2JS.copy(obj, update); is just a shortcut to  mi2JS.copy({}, obj, update);

@function copy
@memberof mi2JS(core)

@param {Object} obj - object to make copy from
@param {Object} update - [optional multiple time] additional update after the copy
*/
mi2.copy = function(obj, update){
    // copy is just an update with an empty object/array as start
    var newArgs = [mi2.isArray(obj) ? []:{}];
    // we made a new array with emty object, and push all arguments after that
    arrayPush.apply(newArgs, arguments);
    // now just call the update method with new arguments
    newArgs = Array.prototype.slice.call(arguments,0);
    newArgs.unshift(mi2.isArray(obj) ? []:{});
	return mi2.update.apply(this, newArgs);
};

/** Parse number using parseFloat, but return zero if not a number.

@function num
@memberof mi2JS(core)

@param obj - string or anything else (if parseFloat fails, zero is returned)
*/
mi2.num = function(str){
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
mi2.isEmpty = function(obj){
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
mi2.listen = function ( obj, evt, fnc, self, options ){

//	mi2.nn('mi2.listen', {obj:obj, evt:evt, fnc:fnc} );

	var listener = function(evt){
		if(typeof(fnc) == 'string') fnc = self[fnc];
		fnc.call(self || obj, mi2.fixEvent(evt));
	};

	if (obj.addEventListener){
		obj.addEventListener(evt,listener,options);
		return true;
	} else if(obj.attachEvent){
		return obj.attachEvent("on"+evt,listener);
	}else{
		throw new Error('unable to add listener to '+obj);
	}
};

/** Used by {@link mi2JS(core).listen}. Do some cleaning on the event object provided by the browser, for easier handling of browser differences.
This is likely more extensive in other libraries. Override it if you need more.

@function fixEvent
@memberof mi2JS(core)
@param {Event} evt Browser  event
*/
mi2.fixEvent = function(evt){
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

mi2.TagDef = function(tag,attr, children){
	this.tag = tag;
	this.attr = attr;
	this.children = children;
}

mi2.h = function(tag,attr){
	// using mi2.TagDef class for security (if needed)
	// user input that looks like tag definition will not pass "instanceof mi2.TagDef" test
	return new mi2.TagDef(tag, attr, Array.prototype.slice.call(arguments,2) );
}

mi2.t = function(code){	return code; }

mi2.insertHtml = function(parent, def, before, updaters){
	updaters = updaters || [];

    function updateAttr(node, attr, func){
        return function(){
            var newValue = func();
            if(node.getAttribute(attr) != newValue) node.setAttribute(attr, newValue);        
        }
    }

    function updateText(node, func){
        return function(){
            var newValue = func();
            if(node.textContent != newValue) node.textContent = newValue;
        }
    }

    if(parent && parent instanceof mi2) parent = parent.el;

    if (typeof def == 'string') {
        var n = document.createTextNode(def);
        parent.insertBefore(n, before);

    } else if(def && def instanceof Function){
        var n = document.createTextNode('');
        parent.insertBefore(n, before);
        // prepare text updater
        updaters.push(updateText(n,def));

    } else if(def instanceof Array){
        def.forEach(function (c) { mi2.insertHtml(parent, c, null, updaters);} );

    } else {
        var n = document.createElement(def.tag);
		if(def.html) n.innerHTML = def.html;
        if (def.attr) {
            for (var a in def.attr) {
                var value = def.attr[a];
                if(value && (value instanceof Function)){
                    // preapre updater for attribute value
                    updaters.push(updateAttr(n, a, value));
                }else{
                    n.setAttribute(a, value);
                }
            }
        }
        if(parent) parent.insertBefore(n, before);
        if (def.children && def.children.length) {
            mi2.insertHtml(n, def.children, null, updaters);
        }
        return n;
    }
}

}());
