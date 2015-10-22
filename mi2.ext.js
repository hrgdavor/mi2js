
(function(mi2){
	var Base = mi2.comp.get('Base');
	var baseProto = Base.prototype;
	var mi2Proto = mi2.prototype;

	// ----------------------- extra utility -------------------
	mi2.scroll = function(){
		var d = document.documentElement, b = document.body;
		var dim = {
			left: d.scrollLeft || b.scrollLeft,
			top: d.scrollTop || b.scrollTop,
			w: window.innerWidth || d.clientWidth ||b.clientWidth,
			h: window.innerHeight || d.clientHeight || b.clientHeight
		};
		return dim;
	};

	mi2.num2 = function(num){
		if(num <10) return '0'+num;
		return num;
	};

	mi2.printDate = function(date){
		if(!date) return '';
		return mi2.num2(date.getDate())+ // day of month
		'.'+mi2.num2(date.getMonth()+1)+
		'.'+date.getFullYear();
	};

	mi2.printTime = function(date){
		if(!date) return '';
		return mi2.num2(date.getHours())+
		':'+mi2.num2(date.getMinutes());
	};


	mi2.printTimeS = function(date){
		if(!date) return '';
		return mi2.num2(date.getHours())+
		':'+mi2.num2(date.getMinutes())+
		':'+mi2.num2(date.getSeconds());
	};

	mi2.printDateTime = function(date){
		if(!date) return '';
		return mi2.printDate(date)+' '+mi2.printTime(date);
	};

	mi2.printDateTimeS = function(date){
		if(!date) return '';
		return mi2.printDate()+' '+mi2.printTimeS();
	};

	mi2.parseDate = function(str){
		if(!str) return null;
		var reg = /(\d{1,2})\.(\d{1,2})\.(\d{4})/;
		if(!reg.test(str)) return null;
		var m = str.match(reg);
		return new Date(m[3],m[2]-1,m[1]);
	};

	mi2.parseTime = function(str){
		if(!str) return null;
		var reg = /(\d{1,2})\:(\d{1,2})(\:(\d{1,2}))?/;
		if(!reg.test(str)) return null;
		var m = str.match(reg);
		return new Date(0,0,0,m[1],m[2],m[4]||0);
	};

	mi2.parseDateTime = function(str){
		if(!str) return null;
		var idx = str.indexOf(' ');
		var tStr = '';
		if(idx != -1){
			tStr = str.substring(idx+1);
			str = str.substring(0,idx);
		}
		var date = mi2.parseDate(str);
		if(date && tStr){
			var time = mi2.parseTime(tStr);
			if(time){
				date.setHours(time.getHours());
				date.setMinutes(time.getMinutes());
				date.setSeconds(time.getSeconds());
			}
		}
		return date;
	};


	// ----------------------------  extra functions for wrapped nodes (and components consequently)   ----------------

	mi2Proto.fade = function(op1,op2, hide){
		var s = this.el.style;
		s.transition = '';
		s.display = '';
		s.opacity = op1;
		setTimeout(function(){
			s.transitionProperty = 'opacity';
			s.transitionDuration = '400ms';
			s.opacity = op2;
			if(hide) setTimeout(function(){s.display = 'none';},410); 
		},50);
	};

	mi2Proto.fadeIn = function(){ this.fade('0','1'); };
	
	mi2Proto.fadeOut = function(hide){ this.fade('1','0', hide); };


// ------------------------------   Base component ext   --------------------

	baseProto.reloadComponent = function(scripts, callback){
		scripts = scripts || [];
		scripts.unshift('/js/'+this.constructor.compName+'.js');
		this.reloadScripts(scripts, function(){
			var compName = this.constructor.compName;
			var comp = mi2.comp.get(compName);
			comp.prototype.constructor.call(this,this.el,mi2.comp.tpl[compName],this.parent);
			if(callback) callback.call(this);
		});
	};

	baseProto.reloadScripts = function(scripts, callback){
		callback = callback || function(){console.log(scripts, 'loaded');};
		var mt = new Date().getTime();
		var loadedCount = 0;
		var self = this;
		function oneDone(){
			loadedCount ++;
			if(loadedCount == scripts.length) callback.call(self);
		}

		function ready() {
			if (this.readyState == 'complete') oneDone();
		}

		for(var i=0; i<scripts.length; i++){
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.onreadystatechange = ready;
			script.onload = oneDone;
			script.src = scripts[i]+'?__mt__='+mt;
			head.appendChild(script);			
		}
	};


	// ------------------------------------ RPC for components --------------------------------
	Base.rpcUrl = 'rpc';

	if(!Base.rpcIdSeq) Base.rpcIdSeq = 1;
	baseProto.rpc = function(method, params, callback, errback){
		callback = callback.bind(this);
		errback = !errback ? null: errback.bind(this);
		var data = {method:method, params:params, id: Base.rpcIdSeq++, 'jsonrpc':'2.0'};
		function ajaxErrback(err){
			if(errback) errback({ id:data.id, code: -32000, message: "network error", data: err});
		}
		
		function ajaxCallback(resp){
			var rpcResp;
			try{

				rpcResp = JSON.parse(resp.responseText);
			}catch(e){
				if(errback) errback({ id:data.id, code: -32700, message: "Parse error", data: resp.responseText});
				return;
			}

			if(rpcResp.error){
				console.log(method, params, "RPC ERROR ", rpcResp.error);

				if( rpcResp.error.code == -3 ){  // not allowed
					MAIN_APP.fireEvent('userNotification', { data:[{title:'you_are_not_allowed_to'}] });
				}

				if( rpcResp.error.code == -2 || // auth
						rpcResp.error.code == -4 // second login
					){
					MAIN_APP.fireEvent('authError', {data: { force:true } });
				}

				if(errback) errback(rpcResp.error);
			}else
				callback(rpcResp.result);
		}

		mi2.ajax( { method:"POST", url: Base.rpcUrl+"?method="+method, pars:JSON.stringify(data), callback: ajaxCallback, errback: ajaxErrback } );
	};

}(mi2JS));