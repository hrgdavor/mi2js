(function(){

	var DEF = mi2JS.FormHandler = function(inp, label, info, required){
		// better we fix the case when called without "new" operator than confusing developer with err later
		if(!(this instanceof DEF)) return new DEF(inp, label, info, required);
		
		this.inp = inp;
		this.label = label || {};
		this.info = info || {};
		this.required = required;

		for(var p in this.inp){
			var comp = this.inp[p];
			var compName = comp.el.getAttribute('as'); 
			if(!compName){
				this.inp[p] = mi2JS.comp.make(comp.el,'base/Input',this);
			}else if(!comp.getValue || ! comp.setValue){
				console.log('invalid input for Form component ', comp.el, ' inputs in Form must implement getValue & setValue and',compName,'does not');
			}
		}
	};

	var proto = DEF.prototype;

	proto.focus = function(){
		for(var p in this.inp){
			if(this.inp[p].attr('firstInput') && this.inp[p].focus && !this.inp[p].attr('readonly')){
				this.inp[p].focus();
				return;
			}
		}
	};

	proto.setReadOnly = function(readOnly){
		for(var p in this.inp){
			if(this.inp[p].setReadOnly){
				this.inp[p].setReadOnly(readOnly);
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
				err = this.inp[p].validate(this.required);
			if(err){
				data[p] = {_error:err};
				valid = false;
			}
		}
		return valid ? null : data;
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

})();