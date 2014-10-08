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

	proto.fetch	= function(_arg){
		var args = mi2.update({ // defaults
			method:'GET', 
			self: this,
			url:"", 
			callback:function(){}, 
			async:true, 
			headers:{}
		}, _arg);

		args.method = args.method.toUpperCase();

		this.request.open(args.method, args.url, args.async);

		if (args.method == 'POST' && !args.headers['Content-Type']) args.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		for(var h in args.headers) this.request.setRequestHeader(h,args.headers[h]);

		var ret = null;
		this.request.onreadystatechange = function(){
			if(this.readyState == 4){
				if(this.status == 200){
					args.callback.call(args.self,this);
					ret = this;
				}
				else if(args.errback) args.errback.call(args.self,this);
			}
		};

		this.request.send(args.postData);

		return ret;
	};

	/** ajax request <br>
		Parameters: single object with fields
		@param {string} [method=GET] - HTTP method
		@param {string|object} url - if object is provided then mi2JS.joinUrl will be called to gen url string 
		@param {function} callback - callback function when data is received
		@param {function} errback - callback if communication error occurs
		@param {boolean} [async=false] - async / sync
		@param {object} - The value of this provided for the call to callback and errback, check Function.prototype.call docs online
	*/
	mi2.ajax = function(args){
		return new MicroAjax().fetch(args);
	};

}(mi2JS));
