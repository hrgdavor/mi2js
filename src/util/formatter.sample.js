(function(mi2){

	mi2.addFormatter('noNull',function(value){
		return value === null ? '' : mi2.formatNext(value, arguments, 1);
	},-1);

	mi2.addFormatter('ifNull',function(value, def){
		return value === null ? def : mi2.formatNext(value, arguments, 2);
	},-1);

	mi2.addFormatter('fixedStr', function(value,decimals){
		value = mi2.num(value);
		return value.toFixed(decimals);
	},1);


	mi2.formatters.fixedStr2 = function(value){
		return mi2.formatters.fixedStr(value,2);
	};

	mi2.formatters.intStr = function(value){
		value = mi2.num(value);
		return value.toFixed(0);
	}

}(mi2JS));