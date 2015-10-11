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

	var numReg = /^[0-9]+(\.[0-9]+)?$/;

	mi2.parseFormat = function(str){
		var format = [];
		var idx = str.indexOf(',');
		var offset = 0;
		// dd,"aaa,bbb",c
		while(idx != -1){
			var p = str.substring(offset,idx);
			if(p.length > 0){
				// allow commas inside quoted strings, if translated text includes
				var first = p.charAt(0);
				if(first == '"' || first == "'"){
					offset++;// skip first quote
					idx = str.indexOf(first,offset);
					if(idx == -1) throw new Error('quote from char #'+offset+' not closed in format str: '+str)

					p = str.substring(offset,idx);
					//comma after second quote or end of text
					idx = str.indexOf(',',idx);
					if(idx == -1) idx = str.length;

				}else{
					// number if not quoted
					if(numReg.test(p)) p = mi2.num(p);
				}
			}
			format.push(p);
			offset = idx+1;
			idx = str.indexOf(',',offset);
			if(idx == -1 && offset < str.length) idx = str.length;
		}
		console.log("str "+str+" parsed format "+format);
		return format;
	};

	mi2.formatNext = function(value,args,skip){
		return mi2.format(value, Array.prototype.slice.call(args,skip));
	};

	mi2.format = function(value, fName){
		if(!fName) return value;

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