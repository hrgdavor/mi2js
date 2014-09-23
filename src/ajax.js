(function(mi2){

	function MicroAjax(){
		this.request = this.build();
	}
	var proto = MicroAjax.prototype;

	var builders = [
		function(){return new XMLHttpRequest();},
		function(){return new ActiveXObject("Msxml2.XMLHTTP");},
		function(){return new ActiveXObject("Microsoft.XMLHTTP");}
	];
	for(var i=0; i<builders.length; i++){
		try{ 
			builders[i](); 
			proto.build = builders[i]; 
			break;
		}catch(e){}
	}

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

	proto.fetch	= function(_arg){
		var args = mi2.update({method:'GET', url:"", callback:function(){}, async:true, headers:{}}, _arg);
		var params = mi2.joinUrl(args.pars || args.parameters);
		args.method = args.method.toUpperCase();

		if (args.method == 'GET'){
			if(params) args.url += (args.url.indexOf('?') > 0 ? '&':'?') + params;
			params = null;
		}

		this.request.open(args.method, args.url, args.async);
		for(var h in args.headers) this.request.setRequestHeader(h,args.headers[h]);
		if (args.method == 'POST') this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		var ret = null;
		this.request.onreadystatechange = function(){
			if(this.readyState == 4){
				if(this.status == 200){
					// try{
						args.callback(this);
					// }catch(e){console.log("error in callback ",e);}
					ret = this;
				}
				else if(args.errback) args.errback(this);
			}
		};

		this.request.send(params);
		return ret;
	};

	/** ajax request 
		siungle object with parameters
		@param {string} [method=GET] - HTTP method
		@param {string|object} url - if object is provided then mi2JS.joinUrl will be called to gen url string 
		@param {function} callback - callback function when data is received
		@param {function} errback - callback if communication error occurs
		@param {boolean} [async=false] - async / sync
	*/
	mi2.ajax = function(args){
		return new MicroAjax().fetch(args);
	};

}(mi2JS));
