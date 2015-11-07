(function(mi2){

	mi2.formats = {
		'email': {
			format: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$',
			invalid: 'invalid_email_address'
		},
		'int':   {
			format: "^-*\\d+$", example:"123", 
			invalid:'must_be_integer' 
		},
		'float': { 
			format: "^-*((\\d+)|(\\d+\\.\\d+))$", example:"11.45", 
			invalid:'must_be_decimal'
		}
	};

	//texts:
	// required, invalid_value, example_correct_value, min_allowed_value, max_allowed_value, must_be_between
	mi2.validate = function(defReq){
		var attr = this.attr('required');
		var required = attr === null ? defReq : attr  == '1';
		var opts ={
			required: required,
			format:   this.attr('format'),
			invalid:  this.attr('invalid'),
			min:  this.attr('min'),
			max:  this.attr('max'),
			example: this.attr('example')
		};
		var v = this.getValue();

		if(!v){
			if(opts.required)
				return {message:t('required'), type:'required'};
			return null;
		}

		if(this.formats[opts.filter]){
			var predef = this.formats[opts.filter];
			if(typeof(predef) == 'function'){
				return predef(v,opts);
			}
			opts.filter = predef.filter;
			if(!opts.example) opts.example = predef.example;
			if(!opts.invalid) opts.invalid = predef.invalid;
		}

		var reg = new RegExp(opts.filter);
		if(!reg.test(v)){
			var msg = t(opts.invalid || 'invalid_value')+' ! ';
			if(opts.example) msg += t('example_correct_value')+': '+opts.example;
			return {type:'invalid', message:msg};
		}

		var hasMin = typeof(opts.min) != 'undefined';
		var hasMax = typeof(opts.max) != 'undefined';
		if(hasMin || hasMax){
			v = mi2.num(v);
			var min = mi2.num(opts.min);
			var max = mi2.num(opts.max);
			if(hasMax && hasMin){
				if(v<min || v>max) return {type:'invalid_range', message: t('must_be_between')+' '+opts.min+' & '+opts.max};
			}else if(hasMax){
				if(v>max) return {type:'invalid_range', message: t('max_allowed_value')+' '+opts.max};					
			}else if(hasMin){
				if(v<min) return {type:'invalid_range', message: t('min_allowed_value')+' '+opts.min};					
			}
		}
		return null;
	};

})(mi2JS);
