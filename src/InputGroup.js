(function(){
	var mi2 = mi2JS;

	var DEF = mi2.InputGroup = function InputGroup(inp, label, info, required){
		// better we fix the case when called without "new" operator than confusing developer with err later
		if(!(this instanceof DEF)) return new DEF(inp, label, info, required);
		this.items = inp;
		this.required = required;

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


})();