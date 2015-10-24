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

	mi2.parseFormat = function(str, resolve){
		if(str === null || str === '') return null;
		var format = str.split(',');

		// resolve the formatter immediatelly (early error)
		if(resolve && format.length ) format[0] = mi2.getFormatter(format[0]);

		return format;
	};

	mi2.formatNext = function(value, args, skip){
		return mi2.format(value, Array.prototype.slice.call(args,skip+2), args[1], args[2]);
	};

	/** formatters: null, undefined, '', []  will return the original value without formatting */
	mi2.format = function(value, fName, propName, data){
		if(!fName) return value;

		if(fName instanceof Array){
			if(!fName.length) return value;

			var arr = fName, f, params;
			fName = arr[0];
			f = mi2.getFormatter(fName);
			params = [value, propName, data];
			if(arr.length > 1) params = params.concat(arr.slice(1));

			return f.apply(null,params);
		}

		return mi2.getFormatter(fName).apply(null,[value, propName, data]);
	};


}(mi2JS));