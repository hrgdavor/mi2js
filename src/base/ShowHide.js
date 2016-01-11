
mi2JS.comp.add('base/ShowHide', 'Base', '<-TEMPLATE->',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	var $ = mi2JS;

	proto.construct = function(el, tpl, parent){
		var html = el.innerHTML;
		el.innerHTML = '';
		// template is not pased because it will be used only if no inline template is defined
		superProto.construct.call(this, el, tpl, parent);
		this.texts = this.button.attr('texts').split(',');

		this.title.setHtml(html);
	};

	proto.on_init = function(evt){
		superProto.on_init.call(this,evt);
		var code = this.attrDef('target','+');
		this.panel = this.parent.findRef(code, this);
		if(!this.panel) throw new Error('Panel not found '+code);
		this.updateButton();
	};
;
	proto.updateButton = function(){
		try{
			var idx = this.panel.isVisible() ? 1:0;
			this.button.setText(this.texts[idx]);
		}catch(e){
			console.error('updateButton error '+e.message);
		}
	};

	proto.on_showHide = function(sel){
		var panel = this.panel;
		panel.setVisible(!panel.isVisible());
		this.updateButton();
	};

});
