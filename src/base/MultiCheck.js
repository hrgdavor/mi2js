mi2JS.comp.add('base/MultiCheck', 'base/InputBase', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){
	
	var mi2 = mi2JS;

	mi2.mixin(comp,mi2.NWGroup);

	proto.itemTpl = {tag:'B'};

	proto.construct = function(el, tpl, parent){
		this.items = {};
		superProto.construct.call(this, el, tpl, parent);

		this.listen(el,'click');
		this.mapItems(el.children);
	};


	proto.mapItems = function(it){
		var id, nw;
		for(var i=0; i<it.length; i++){
			nw = this.findRef(it[i]);
			id = nw.data('id');
			if(id !== null) this.items[id] = nw;
		}
	};

	proto.on_click = function(evt){
		var target = this.item(evt.target);
		if(target){
			if(this.attr('single-value')){
				this.selectedIs(target.data('id'));
			}else{
				target.setSelected(!target.isSelected());
			}
			this.fireIfChanged();
		}
	};

	proto.setConfig = function(data){
		// NodeWrapper is cheap, so we discard the old ones
		this.innerHTML = '';
		this.items = {};
		// allow key:value object or array of {id:'',text:''} objects
		var isArray = data instanceof Array;
		for(var p in data){
			var id = isArray ? data[p].id : p;
			var item = mi2.add(this.el, this.itemTpl);
			item.data('id', id);
			item.setText(   isArray ? data[p].text  : data[p]);
			this.items[id] = item;
		}
	};

	proto.setRawValue = function(value){
		this.selectedIs( value );
	};

	proto.getRawValue = function(value){
		var ret = this.forEachGetArray(function(item){
			if(item.isSelected()) return item.data('id');
		});

		if(this.attr('single-value')) ret = ret[0];

		return ret;
	};

});
