
mi2JS.comp.add('base/Form', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	/**
		@param event - name of the event to fire on parent (default: submit)
	*/
	proto.construct = function(el, tpl, parent){
		this.info = {};
		this.label = {};
		superProto.construct.call(this, el, tpl, parent);
		if(this.getCompName() == 'base/Form'){
			var m = 'base/Form must be extended, rather use mi2JS.FormHandler inside: ' + parent.getCompName();
			console.log(m,this.el, this);
			throw new Error(m);			
		}

		if(!this.inp){
			var m = 'This form is empty ' + this.getCompName();
			console.log(m,this.el, this);
			throw new Error(m);
		} 


		this.stopSubmit = (this.attr('stop-submit') || '1') == '1';
		this.event = this.attr('event') || 'submit';

		this.init();
	};

	proto.init = function(method, params){

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
		this.handler = new mi2JS.FormHandler(this.inp, this.label, this.info, required);
	};

	proto.focus = function(){ this.handler.focus(); };

	proto.setValue = function(value){ this.handler.setValue(value); };

	proto.validate = function(){ return this.handler.validate(); };

	proto.markValidate = function(data){ this.handler.markValidate(data); };

	proto.getValue = function(){ return this.handler.getValue(); };

});


