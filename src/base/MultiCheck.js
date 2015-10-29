mi2JS.comp.add('base/MultiCheck', 'base/Group', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){
	
	var $ = mi2JS;

	proto.itemTpl = {tag:'B'};

	proto.construct = function(el, tpl, parent){
		this.items = {};
		superProto.construct.call(this, el, tpl, parent);

		this.inFormat = $.parseFormat(this.attr('in-format'));
		this.outFormat = $.parseFormat(this.attr('out-format'));		

		this.listen(el,'click');
	};

	proto.on_click = function(evt){
		var target = this.item(evt.target);
		if(target){
			if(this.attr('single-value')){
				this.selectedIs(target.data('id'));
			}else{
				target.setSelected(!target.isSelected());
			}
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
			var item = $.add(this.el, this.itemTpl);
			item.data('id', id);
			item.setText(   isArray ? data[p].text  : data[p]);
			this.items[id] = item;
		}
	};

	proto.setValue = function(value){
		this.selectedIs( $.format(value, this.inFormat) );
	};

	proto.getValue = function(value){
		var ret = this.forEachGetArray(function(item){
			if(item.isSelected()) return item.data('id');
		});

		if(this.attr('single-value')) ret = ret[0];

		return $.format(ret, this.outFormat);
	};

});
