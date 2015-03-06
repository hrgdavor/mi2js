
mi2JS.comp.add('base/Input', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(comp, proto, superClass){

	var mi2 = mi2JS; // minimizer friendly

	comp.constructor = function(el, tpl, parent){
		superClass.constructor.call(this, el, tpl, parent);
		if(!this.input) this.input = this;
		// input html node
		this.inp=this.input.el;

		var tag = el.tagName;
		if(tag != 'INPUT' && tag != 'SELECT' && tag != 'TEXTAREA'){
			var msg = 'Input component can only be used for INPUT,SELECT,TEXTAREA';
			console.log(msg,el);
			throw new Error(msg);
		}

		// type=checkbox support
		this.useValue = this.attr('value',true);
		this.unchecked = this.attr('unchecked',false);
		if(el.type == 'checkbox'){
			var n = el.nextElementSibling;
			if(n && n.className && n.className.indexOf('checkboxLabel') != -1){
				this.listen(n, 'click', function(){
					this.inp.checked = !this.inp.checked;
					this.fireIfChanged();
				});
			}
		}

		this.notNull = this.attr('not-null',false);
		this.def = this.attr('default','');
	};

	proto.setData = function(data){
		var el = this.inp;
		if(el.tagName != 'SELECT') throw new Error('setData supported only for SELECT element');
		while(el.options.length) el.options.remove(0);
		var op;
		for(var i=0; i<data.length; i++){
			if(data[i].id) op = new Option(data[i].id, data[i].text);
			else op = new Option(data[i]);
			el.options.add(op);
		}
	};

	proto.setValue = function(value){

		if(value === null || typeof(value) == 'undefined') value = '';

		if(this.inp.type == 'checkbox'){
			this.inp.checked = value == this.useValue;
		}else{
			this.inp.value = value;
		}
		// for tracking changes
		if(this.hasOwnProperty('oldValue'))
			this.fireIfChanged();
	};

	proto.getValue = function(){

		if(this.inp.type == 'checkbox') return this.inp.checked ? this.useValue:this.unchecked;

		var val = this.inp.value;
		if(val === '' || val === null){
			if(this.notNull) val = this.def;
			else val = null;
		}
		return val;
	};

	// texts:
	proto.formats = {
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
	proto.validate = function(defReq){
		var opts ={
			required: this.attr('required',defReq ? '1':'0') == '1',
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

		if(this.formats[opts.format]){
			var predef = this.formats[opts.format];
			if(typeof(predef) == 'function'){
				return predef(v,opts);
			}
			opts.format = predef.format;
			if(!opts.example) opts.example = predef.example;
			if(!opts.invalid) opts.invalid = predef.invalid;
		}

		var reg = new RegExp(opts.format);
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

	proto.markValidate = function(data, info, label){
		data = data || {};
		this.classIf('validationError', data._error);
		if(info){
			info.classIf('validationError', data._error);
			info.setVisible(data._error && data._error.message);
			if(data._error) info.html(data._error.message);			
		}
		if(label) label.classIf('validationError', data._error);
	};

	proto.focus = function(){
		if(this.inp.focus) this.inp.focus();
		if(this.inp.select) this.inp.select();
	};

	proto.fireIfChanged = function(evt){
		if(this.timer) clearTimeout(this.timer);// avoid event bursts

		this.timer = this.setTimeout(function(){
			var old = this.oldValue;
			var value = this.getValue();
			if(value != old){
				this.oldValue = value;
				this.fireEvent('change',{oldValue:old, value: value});
			}
		},50);
	};

	proto.addListener = function(evtName,callback,thisObj){
		if(evtName == 'change') this.trackChanges();
		superClass.prototype.addListener.call(this,evtName,callback,thisObj);
	};	

	proto.trackChanges = function(){
		if(this.tracking) return;
		this.tracking = true;
		this.oldValue = this.getValue();

		this.listen(this.inp,'change','fireIfChanged');
		this.listen(this.inp,'click','fireIfChanged');
		this.listen(this.inp,'keydown','fireIfChanged');
	};

});
