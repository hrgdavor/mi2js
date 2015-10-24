(function(){

	var mi2 = mi2JS;

	var DEF = mi2.Group = function(group){

		// better we fix the case when called without "new" operator than confusing developer with err later
		if(!(this instanceof DEF)) return new DEF(group);

		this.items = group;

		this.forEachGet = group instanceof Array ? 
			this.forEachGetArray : this.forEachGetObject;
	}

	var proto = DEF.prototype;

	function makeMap(arr, val){
		var obj = {};
		if(arr instanceof array){
			for(var i=0; i<arr.length; i++){
				obj[arr[i]] = val;
			}			
		}else{
			obj[arr] = val;
		}
		return obj;
	}

	/** Call func on all items */
	proto.callFunc = function(funcName, params){
		for(var p in this.items){
			this.items[p][funcName].apply(this.items[p],params);
		}
	};

	proto.item = function(code){
		return this.items[code];
	};

	/* call function on each element */
	proto.forEach = function(func, params){
		var items = this.items;
		for(p in items){
			func(items[p], p, items, params);
		}
	}

	proto.forEachGet = function(func, params){
		return this.items instanceof Array ? 
			this.forEachGetArray(func, params) : this.forEachGetObject(func, params);
	};

	/* call function on each element, but collect returned values */
	proto.forEachGetArray = function(func, params){
		var items = this.items;
		var ret = [], fromFunc;
		for(p in items){
			fromFunc = func(items[p],p,items, params);
			if(fromFunc !== void 0) ret.push(fromFunc);
		}
		return ret;
	}

	/* call function on each element, but collect returned values */
	proto.forEachGetObject = function(func, params){
		var items = this.items;
		var ret = {}, fromFunc;
		for(p in items){
			fromFunc = func(items[p],p,items, params);
			if(fromFunc !== void 0) ret[p] = fromFunc;
		}
		return ret;
	}



/* ************************************************************************************************** */

	/* Toggle functionalities EXPERIMENTAL */

	/* this is usefull to add a group of elements, so they can be changed together */
	proto.visibleIs  = function(){ this.toggleParams('setVisible',  arguments, [true], [false]); };
	proto.selectedIs = function(){ this.toggleParams('setSelected', arguments, [true], [false]); };
	proto.enabledIs  = function(){ this.toggleParams('setEnabled',  arguments, [true], [false]); };

	proto.visibleNot  = function(){ this.toggleParams('setVisible',  arguments, [false], [true]); };
	proto.selectedNot = function(){ this.toggleParams('setSelected', arguments, [false], [true]); };
	proto.enabledNot  = function(){ this.toggleParams('setEnabled',  arguments, [false], [true]); };

	proto.toggleClass = function(className){
		this.toggleCall(
			Array.prototype.slice.call(arguments, 1),
			function(item){
				item.classIf(className, true);
			},
			function(item){
				item.classIf(className, false);
			}
		); 
	};

	proto.toggleAttr = function(name, on, off){
		this.toggleCall(
			Array.prototype.slice.call(arguments, 3),
			function(item){
				item.attr(name, on);
			},
			function(item){
				item.attr(name, off);
			}
		); 
	};

	proto.toggleParams = function(funcName, arr, on, off){
		var what = makeMap(arr, on), items = this.items, params, item;

		for(var p in items){
			params = what.hasOwnProperty(p) ? on : off;
			item = items[p];
			item[funcName].apply( item, params );
		}
	};

	proto.toggleCall = function(arr, onFunc, offFunc){
		var what = makeMap(arr, true), func, items = this.items;

		for(var p in items){
			func = what.hasOwnProperty(p) ? onFunc : offFunc;
			func(items[p],p,items);
		}
	};


}());
