(function(mi2){

	mi2.formatters = {};

	mi2.addFormatter = function(fName, fc, params){
		fc.paramCount = params || 0;
		mi2.formatters[fName] = fc;
	}

	mi2.getFormatter = function(fName){
		if(fName instanceof Function) return fName;

		var f = mi2.formatters[fName];
		if(!f) throw new Error('formatter not found '+fName);

		return f;
	};

	mi2.formatNext = function(value,args,skip){
		return mi2.format(value, Array.prototype.slice.call(args,skip));
	};

	mi2.format = function(value, fName){
		if(fName instanceof Array){
			var ret = value, arr = fName, f,params, paramCount;
			while(arr.length){
				fName = arr.shift();
				f = mi2.getFormatter(fName);
				params = [ret];
				paramCount = f.paramCount || 0;
				if(paramCount == -1) paramCount = arr.length;// takes all
				for(var i=0; i<paramCount; i++) params.push(arr.shift());
				ret = f.apply(null,params);
			}
			return ret;
		}
		return mi2.getFormatter(fName).apply(null,[value]);
	};

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