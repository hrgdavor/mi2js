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
		for(var i=0; i<arr.length; i++){
			obj[arr[i]] = val;
		}
		return obj;
	}

	/* this is usefull to add a group of elements, os they can be changed together */
	proto.setVisible  = function(v){ this.callFunc('setVisible', [v]); };
	proto.setSelected = function(v){ this.callFunc('setSelected',[v]); };
	proto.setEnabled  = function(v){ this.callFunc('setEnabled', [v]); };
	proto.classIf     = function(){ this.callFunc('classIf', arguments); };
	proto.addClass    = function(){ this.callFunc('addClass', arguments); };
	proto.removeClass = function(){ this.callFunc('removeClass', arguments); };

	proto.visibleIs  = function(){ this.toggle('setVisible', arguments, true, false); }
	proto.selectedIs = function(){ this.toggle('setSelected', arguments, true, false);	}
	proto.enabledIs  = function(){ this.toggle('setEnabled', arguments, true, false); }

	proto.hiddenIs     = function(){ this.toggle('setVisible', arguments, false, true); }
	proto.deselectedIs = function(){ this.toggle('setSelected', arguments, false, true);	}
	proto.disabledIs   = function(){ this.toggle('setEnabled', arguments, false, true); }

	/* what - what to set visible
	          supports either string code for single item , or object with multiple keys (and different values),
	   def - default value if not specified     
	*/
	proto.toggle = function(funcName, arr, on, off){
		var what = makeMap(arr, on);

		for(var p in this.items){
			this.items[p][funcName]( what.hasOwnProperty(p) ? what[p] : off );
		}
	};

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

}());
