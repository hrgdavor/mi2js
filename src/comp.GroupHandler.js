(function(){

	var mi2 = mi2JS;

	mi2.comp.GroupHandler = mi2.comp.GroupHandler || function(group){
		this.group = group;
	}

	var proto = mi2.comp.GroupHandler.prototype;

	function makeMap(key, val){
		var obj = {};
		obj[key] = val;
		return obj;
	}

	proto.setVisible = function(what, def){
		this.toggle(what, def, function(el, value){
			el.setVisible(value);
		});
	}
	
	proto.setSelected = function(what, def){
		this.toggle(what, def, function(el, value){
			el.setSelected(value);
		});
	}

	/* what - what to set visible
	          supports either string code for single item , or object with multiple keys (and different values),
	   def - default value if not specified     
	*/
	proto.toggle = function(what, def, func){
		if(typeof(what) == 'string') what = makeMap(what,true);
		if(arguments.length == 1) def = false; // hide by default

		for(var p in this.group){
			func(this.group[p], what.hasOwnProperty(p) ? what[p] : def);
		}
	};

}());
