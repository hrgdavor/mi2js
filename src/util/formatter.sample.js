(function(mi2){

	mi2.addFormatter('noNull',function(value, propName, data){
		return value === null ? '' : mi2.formatNext(value, arguments, 1);
	},-1);

	mi2.addFormatter('ifNull',function(value, propName, data, def){
		return value === null ? def : mi2.formatNext(value, arguments, 2);
	},-1);

	mi2.addFormatter('fixedStr', function(value, propName, data, decimals){
		value = mi2.num(value);
		return value.toFixed(mi2.num(decimals));
	},1);

	mi2.formatters.fixedStr2 = function(value){
		value = mi2.num(value);
		return value.toFixed(2);
	};

	mi2.formatters.intStr = function(value){
		value = mi2.num(value);
		return value.toFixed(0);
	}

	mi2.formatters.split = function(value,propName, data, delim){
		if(value == null) return [];
		if(value.split) return value.split(delim === void 0 ? ',':delim);
		return [];
	}

	mi2.formatters.join = function(value,propName, data, delim){
		if(value == null) return '';
		if(value.join) return value.join(delim === void 0 ? ',':delim);
		return '';
	}

}(mi2JS));