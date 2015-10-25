(function(){
	var mi2 = mi2JS;

	var DEF = mi2.FormHandler = function FormHandler(inp, label, info, required){
		// better we fix the case when called without "new" operator than confusing developer with err later
		if(!(this instanceof DEF)) return new DEF(inp, label, info, required);
		this.items = inp;
		this.required = required;

		this.label = label || {};
		this.info = info || {};

		this.fixItems();
	};

	mi2.extend(DEF, mi2.Group);
	// extend must happen before gettign reference to the prototype
	var proto = DEF.prototype;

	// TODO do these functions using forEach and other methods inherited from Group
	proto.fixItems = function(){
		for(var p in this.items){
			var comp = this.items[p];
			var compName = comp.el.getAttribute('as'); 
			if(!compName){
				this.items[p] = mi2.comp.make(comp.el,'base/Input',this);
			}else if(!comp.getValue || ! comp.setValue){
				console.log('invalid input for Form component ', comp.el, ' inputs in Form must implement getValue & setValue and',compName,'does not');
			}
		}
	};

	proto.focus = function(){
		for(var p in this.items){
			if(this.items[p].attr('firstInput') && this.items[p].focus && !this.items[p].attr('readonly')){
				this.items[p].focus();
				return;
			}
		}
	};

	proto.setReadOnly = function(readOnly){
		for(var p in this.items){
			if(this.items[p].setReadOnly){
				this.items[p].setReadOnly(readOnly);
			}
		}
	};

	proto.setValue = function(value){
		for(var p in this.items){
			this.items[p].setValue(value[p]);
		}
	};

	proto.validate = function(){
		var valid = true, data={};
		for(var p in this.items){
			var err = null;
			if(this.items[p].validate)
				err = this.items[p].validate(this.required);
			if(err){
				data[p] = {_error:err};
				valid = false;
			}
		}
		return valid ? null : data;
	};

	proto.markValidate = function(data){
		data = data ||{};
		for(var p in this.items){
			if(this.items[p].markValidate)
				this.items[p].markValidate(data[p],this.info[p], this.label[p]);
		}
	};

	proto.getValue = function(){
		var value = {};
		for(var p in this.items){
			value[p] = this.items[p].getValue();
		}
		return value;
	};

})();