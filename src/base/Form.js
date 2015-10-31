
mi2JS.comp.add('base/Form', 'base/Group', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	/**
		@param event - name of the event to fire on parent (default: submit)
	*/
	proto.construct = function(el, tpl, parent){
		superProto.construct.call(this, el, tpl, parent);
		if(this.getCompName() == 'base/Form'){
			var m = 'base/Form must be extended, rather use mi2JS.InputGroup inside: ' + parent.getCompName();
			console.log(m,this.el, this);
			throw new Error(m);			
		}

		if(!this.items){
			var m = 'This form is empty ' + this.getCompName();
			console.log(m,this.el, this);
			throw new Error(m);
		} 

		this.stopSubmit = (this.attr('stop-submit') || '1') == '1';
		this.event = this.attr('event') || 'submit';

		this.init();
	};

	!function(){
		var ext = mi2JS.InputGroup.prototype;
		for(var p in ext) if(!proto[p])	proto[p] = ext[p];			
	}();

	proto.init = function(method, params){
		this.fixItems();

		this.listen(this.el,'submit', function(evt){
			if(this.stopSubmit) evt.stop();
			alert(this.stopSubmit);
			// make sure submit does not hapen on error, and error can go into console
			try{
				this.parent.fireEvent('submit',{src:this, domEvent:evt});
			}catch(e){
				evt.stop();
				console.error(e);
				return false;
			}

			if(this.stopSubmit) return false;
		});

		var attr = this.attr('required');
		var required = attr === null || attr  == '1';
	};

});


