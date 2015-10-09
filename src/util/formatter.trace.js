(function(mi2){

	// mi2.formatters = {};
	var bkp = {};
	var idx = {};

	mi2.formatTraceSetup = function(value, fName, params){
		if(bkp.format) return;

		bkp.format = mi2.format;
		mi2.format = function(value, fName, params){
			var index = ++idx.format;
			console.log('format-'+index,value, fName, params);
			var ret = bkp.format(value, fName, params);
			console.log('format-'+index+' returned', ret);
			return ret;
		};
	};

	mi2.formatTrace = function(value, fName, params){
		mi2.formatTraceSetup();
		idx.format = 0;

		try{
			var ret = mi2.format(value, fName, params);
			mi2.formatTraceRestore();
			return ret;
		}catch(e){
			mi2.formatTraceRestore();
			throw e;
		}

	}

	mi2.formatTraceRestore = function(){
		mi2.format = bkp.format;
		bkp = {};
	}


}(mi2JS));