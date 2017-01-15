
mi2JS.addCompClass('base/ShowHide', 'Base', '<-TEMPLATE->',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	var $ = mi2JS;

	proto.initTemplate = function(){
		var el = this.el;
		this.titleHTML = el.innerHTML;
		el.innerHTML = '';

		superProto.initTemplate.call(this);

		this.texts = this.attrDef('texts','+,-').split(',');
	};

	proto.initChildren = function(){
		superProto.initChildren.call(this);

		this.title.setHtml(this.titleHTML);

		var code = this.attrDef('target','+');
		this.panel = this.parent.findRef(code, this);
		if(!this.panel) throw new Error('Panel not found '+code);
		this.panel.addClass('ShowHidePanel');
		this.updateButton();
	};

	proto.updateButton = function(){
		try{
			var idx = this.panel.isVisible() ? 1:0;
			this.button.setText(this.texts[idx]);
			this.classIf('collapsed', !idx);
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
