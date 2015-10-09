(function(mi2){

	mi2.formatters = {};

	mi2.addFormatter = function(fName, fc){
		mi2.formatters[fName] = fc;		
	}

	mi2.format = function(value, fName, params){
		if(fName instanceof Array){
			// parameterized formatter
			return mi2.format(value, fName[0], fName.slice(1));
		}
		var f = null;
		if(fName instanceof Function)
			f=fName
		else
			f = mi2.formatters[fName];

		if(!f) {
			console.error('formatter not found '+fName);
			return value;
		}
		return f(value, params);
	}

	mi2.formatNext = function(value, params){
		if(params && params instanceof Array && params.length >0){
			return mi2.format(value, params[0], params.slice(1));
		}
		return value;
	}

	mi2.formatters.noNull = function(value, params){
		if(value === null) return '';
		return mi2.formatNext(value, params);
	}

	mi2.formatters.ifNull = function(value, params){
		if(!params || !params.length){
			throw new error('ifNull can not be used without parameters');
		}
		if(value === null) {
			return  params[0];
		}
		return mi2.formatNext(value, params.slice(1));
	}

	mi2.formatters.fixedStr = function(value, params){
		value = mi2.num(value);
		var decimals = 2;
		if(params) decimals = mi2.num(params[0]);
		return value.toFixed(decimals);
	}

	mi2.formatters.intStr = function(value, params){
		value = mi2.num(value);
		return value.toFixed(0);
	}


}(mi2JS));