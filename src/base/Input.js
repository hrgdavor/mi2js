
mi2JS.comp.add('base/Input', 'base/InputBase', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	var mi2 = mi2JS; // minimizer friendly

	proto.construct = function(el, parent){
		superProto.construct.call(this, el, parent);

		var tag = el.tagName;
		if(tag != 'INPUT' && tag != 'SELECT' && tag != 'TEXTAREA'){
			var msg = 'Input component can only be used for INPUT,SELECT,TEXTAREA';
			console.log(msg,el);
			throw new Error(msg);
		}

		// type=checkbox support
		this.useValue = this.attrDef('value',true);
		this.unchecked = this.attrDef('unchecked',false);

		this.notNull = this.attrDef('not-null',false);
		this.def     = this.attrDef('default','');

        this.typingFilter = this.attrDef('typing-filter', this.typingFilter);
	};

	proto.parseChildren = function(){
		superProto.parseChildren.call(this);
		var el = this.el;
		// input html node
		if(!this.input) this.input = this;
		this.inp=this.input.el;
		if(!this.inp) console.log('input problem', this.el);
		if(el.type == 'checkbox'){
			var n = el.nextElementSibling;
			if(n && n.className && n.className.indexOf('checkboxLabel') != -1){
				this.listen(n, 'click', function(){
					if(this.isReadOnly() || !this.isEnabled()) return;
					this.inp.checked = !this.inp.checked;
					this.fireIfChanged();
				});
			}
		}


		this.listen(this.input.el,'blur',  'on_blur');
	};

	proto.on_blur = function(evt){
        if(this.typingFilter)
            this.inp.value = mi2.filter(this.inp.value, this.typingFilter);
	};

	proto.setConfig = function(data){
		var el = this.inp;
		if(el.tagName != 'SELECT') throw new Error('setData supported only for SELECT element');
		while(el.options.length) el.options.remove(0);
		var op;
		for(var i=0; i<data.length; i++){
			if(data[i].id) op = new Option(data[i].text, data[i].id);
			else op = new Option(data[i], data[i]);
			el.options.add(op);
		}
	};

	proto.setReadOnly = function(readOnly){
		superProto.setReadOnly.call(this,readOnly);
		this.inp.readOnly = readOnly;
		if(this.inp.type == 'checkbox') this.inp.disabled = readOnly;
	};

	proto.setRawValue = function(value){

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

	proto.getRawValue = function(){

		if(this.inp.type == 'checkbox') return this.inp.checked ? this.useValue:this.unchecked;

		var val = this.inp.value;
		if(val === '' || val === null){
			if(this.notNull) val = this.def;
			else val = null;
		}
		return val;
	};

	proto.focus = function(){
		if(this.inp.focus) this.inp.focus();
		if(this.inp.select) this.inp.select();
	};

	proto.addListener = function(evtName,callback,thisObj){
		if(evtName == 'change') this.trackChanges();
		superProto.addListener.call(this,evtName,callback,thisObj);
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
