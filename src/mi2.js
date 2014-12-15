
if(!window.mi2JS) window.mi2JS = function(node){
	if(node === null) throw new Error('Node must not be null');
	this.el = node;
};

(function(mi2){

	mi2.$ = function(node){
		if(typeof node == 'string'){
			node = document.getElementById(node);
			if(!node) throw new Error('Element with id '+id+' not found');
		}
		return mi2.wrap(node);
	};

	mi2.wrap = function(node){
		return new mi2(node);
	};

	mi2.bind = function(object, func){

		// dynamic
		if(typeof(func) == "string")
			return function() { object[func].apply(object, arguments); };

		// native implementation
		if(func.bind) return func.bind(object);

		// closure when native implementation not present
		return function() { func.apply(object, arguments); };

	};

	mi2.extend = function(destination, source) {
		destination.prototype = Object.create(source.prototype);
		destination.prototype.constructor = destination;
		destination.superClass = source.prototype;
		return source.prototype;
	};

	mi2.update = function(dest, update){
		if(dest && update ){
			for (var prop in update) dest[prop] = update[prop];
		}
		return dest;
	};
	
	mi2.num = function(str){
		var n = parseFloat(str);
		if(isNaN(n)) return 0;
		return n;
	};

	mi2.likeNull = function(obj){
		return obj === null || obj === 0 || obj === '';
	};

	/** Check if any of the the values are null and throw an Error. 
		Use where fail-fast is needed so invalid parameters don't cause errors later.
		
	*/
	mi2.nn = function(name,list){
		for(var p in list){
			if(typeof(list[p]) == "undefined"){
				console.error(name," parameter ",p," is null but should not be ");
			}
		}
	};

	mi2.listen = function ( obj, evt, fnc, self, useCapture ){

		mi2.nn('mi2.listen', {obj:obj, evt:evt, fnc:fnc} );

		var listener = function(evt){
			if(typeof(fnc) == 'string') fnc = self[fnc];
			fnc.call(self || obj, mi2.fixEvent(evt));
		};

		if (obj.addEventListener){
			obj.addEventListener(evt,listener,useCapture === true);
			return true;
		}
		else 
			return obj.attachEvent("on"+evt,listener);
	};

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

}(window.mi2JS));
