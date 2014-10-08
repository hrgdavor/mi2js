(function(mi2){

	mi2.joinUrl = function(pars){
		if(!pars) return "";
		if(typeof(pars) == 'string') return pars;
		var arr = [], str='';
		for(var p in pars){
			if(typeof(pars[p]) == 'string' || typeof(pars[p]) == 'number')
				arr.push(encodeURIComponent(p)+"="+encodeURIComponent(pars[p]));
			else 
				if(pars[p].length>0) for(var p2 in pars[p]) arr.push(encodeURIComponent(p)+"="+encodeURIComponent(pars[p][p2]));
		}
		if(arr.length >0){
			str = arr[0];
			for(var i=1; i<arr.length; i++) str += '&'+arr[i];
		}
		return str;
	};

}(mi2JS));