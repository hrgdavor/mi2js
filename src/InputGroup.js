(function(){
	var mi2 = mi2JS;

	var DEF = mi2.InputGroup = function InputGroup(inp, label, info, required){
		// better we fix the case when called without "new" operator than confusing developer with err later
		if(!(this instanceof DEF)) return new DEF(inp, label, info, required);
		this.items = inp;
		this.required = required;

		this.label = label || {};
		this.info = info || {};

		this.fixItems();
	};

	mi2.extend(DEF, mi2.NWGroup);
	// extend must happen before getting reference to the prototype
	var proto = DEF.prototype;

	// TODO do these functions using forEach and other methods inherited from NWGroup
	proto.fixItems = function(){
		for(var p in this.items){
			var comp = this.items[p];
			var compName = comp.attr('as'); 
			if(!compName){
				this.items[p] = mi2.comp.make(comp.el,'base/Input',this);
			}else if(!comp.getValue || ! comp.setValue){
				console.log('invalid input for Form component ', comp.el, ' inputs in Form must implement getValue & setValue and',compName,'does not');
			}
		}
	};

	proto.focus = function(){
		var item, toFocus;
		for(var p in this.items){
			item = this.items[p];
			if( ( !toFocus || item.hasAttr('firstInput') )
					&& item.focus 
					&& !(item.isReadOnly && item.isReadOnly()) ){

				toFocus = item;
			}
		}
		if(toFocus) toFocus.focus();
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
		var validator = this.getValidator();
		var result = validator.validate(this.getValue());
		this.markValidate(result);
		return result;
	};

	proto.getValidator = function(){
		var defReq = this.required;
		var rules = this.forEachGetObject(function(item,code){
			return mi2.getValidator(item, defReq);
		});
		return new mi2.GroupValidator(rules, defReq);
	}

	proto.markValidate = function(data){
		data = data || new mi2.GroupValidity({});
		if(data.item && data.item instanceof Function){
			this.forEach(function(item,p){
				if(item.markValidate)
					item.markValidate(data.item(p));
				else
					mi2.markValidate(item, data.item(p));			
			});
		}else{
			console.error('GroupValidity expected');
			console.log('Validity provided', data, 'for',this);
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