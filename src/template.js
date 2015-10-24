(function(mi2){
	
	function genPart(prop, format){
		// simple value extract
		if(!format) return function(data){ return data[prop]; };

		// format extracted value
		format = mi2.parseFormat(format);
		return function(data){ return mi2.format(data[prop], format, prop, data); };
	}

	function genPrinter(arr){
		return function(data){
			if(!data) return '';
			var str = '';
			for( var i=0; i<arr.length; i++){
				str += arr[i] instanceof Function ? arr[i](data) : arr[i];
			}
			return str;
		}
	}

	var tplReg = /\$\{([a-zA-z_0-9]+):?([^\}]+)?\}/g;

	mi2.parseTemplate = function(str){
		var arr = [];
		var offset = 0;

		str.replace(tplReg, function(match, prop, format, idx){
			if(offset < idx) arr.push(str.substring(offset,idx));
			arr.push(genPart(prop, format));
			offset = idx+match.length
			return match;
		});

		if(offset == 0) return null;
		if(offset < str.length) arr.push(str.substring(offset,str.length));

		return genPrinter(arr);
	};


}(mi2JS));