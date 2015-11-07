
mi2JS.comp.add('base/InputBase', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	var mi2 = mi2JS; // minimizer friendly

	proto.construct = function(el, tpl, parent){
		superProto.construct.call(this, el, tpl, parent);
		
		if(this.hasAttr('in-filter'))
			this.inFilter = mi2.parseFilter(this.attr('in-filter'));
		
		if(this.hasAttr('out-filter'))
			this.outFilter = mi2.parseFilter(this.attr('out-filter'));		
	};

	proto.setReadOnly = function(readOnly){
		this.attr('readonly', readOnly ? '':null);
	};

	proto.isReadOnly = function(readOnly){
		return this.hasAttr('readonly');
	};

	proto.setValue = function(value){
		this.setRawValue( mi2.filter(value, this.inFilter) );
	};

	proto.getValue = function(){
		return mi2.filter( this.getRawValue(), this.outFilter );
	};

	proto.markValidate = function(data){
		data = data || {};
		var info  = this.validationInfo;
		var label = this.label;
		this.classIf('validationError', data._error);
		if(info){
			info.classIf('validationError', data._error);
			info.setVisible(data._error && data._error.message);
			if(data._error) info.setText(data._error.message);			
		}
		if(label) label.classIf('validationError', data._error);
	};

	proto.fireIfChanged = function(evt){
		if(this.timer) clearTimeout(this.timer);// avoid event bursts

		this.timer = this.setTimeout(function(){
			var old = this.oldValue;
			var value = this.getValue();
			if(value !== old){
				this.oldValue = value;
				this.fireEvent('change',{oldValue:old, value: value});
			}
		},50);
	};

});
