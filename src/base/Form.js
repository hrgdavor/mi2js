
mi2JS.comp.add('base/Form', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(comp, proto, superClass){

	/**
		@param event - name of the event to fire on parent (default: submit)
	*/
	comp.constructor = function(el, tpl, parent){
		this.info = {};
		this.label = {};
		superClass.constructor.call(this, el, tpl, parent);
		if(!this.inp){
			var m = 'This form is empty ' + this.getCompName();
			console.log(m,this.el, this);
			throw new Error(m);
		} 

		this.event = this.attr('event','submit');
		this.eventsToParent = this.attr('events-to-parent','1') == '1';

		this.init();
	};

	proto.init = function(method, params){

		this.listen(this.el,'submit', function(evt){
			evt.stop();

			// make sure submit does not hapen on error, and error can go into console
			this.setTimeout(function(){
				this.parent.fireEvent('submit',{src:this});
			},0);

			return false;
		});

		if(this.inp){
			for(var p in this.inp){
				var comp = this.inp[p];
				var compName = comp.el.getAttribute('as'); 
				if(!compName){
					this.inp[p] = mi2JS.comp.make(comp.el,'base/Input',this);
				}else if(!comp.getValue || ! comp.setValue){
					console.log('invalid input for Form component ', comp.el, ' inputs in Form must implement getValue & setValue and',compName,'does not');
				}
			}
		}
	};

	proto.focus = function(){
		for(var p in this.inp){
			if(this.inp[p].attr('firstInput') && this.inp[p].focus && !this.inp[p].attr('readonly')){
				this.inp[p].focus();
				return;
			}
		}
	};

	proto.setValue = function(value){
		for(var p in this.inp){
			this.inp[p].setValue(value[p]);
		}
	};

	proto.validate = function(){
		var valid = true, data={};
		for(var p in this.inp){
			var err = null;
			if(this.inp[p].validate)
				err = this.inp[p].validate(this.attr('required','1') == '1');
			if(err){
				data[p] = {_error:err};
				valid = false;
			}
		}
		return valid ? null:data;
	};

	proto.markValidate = function(data){
		data = data ||{};
		for(var p in this.inp){
			if(this.inp[p].markValidate)
				this.inp[p].markValidate(data[p],this.info[p], this.label[p]);
		}
	};

	proto.getValue = function(){
		var value = {};
		for(var p in this.inp){
			value[p] = this.inp[p].getValue();
		}
		return value;
	};

	proto.fireEvent = function(name, evt){
		if(!this.eventsToParent || name == 'afterCreate') {
			superClass.prototype.fireEvent.call(this,name,evt);
			return;
		}
		evt = evt || {};
		evt.form = this;
		this.parent.fireEvent(name, evt);
	};

});
