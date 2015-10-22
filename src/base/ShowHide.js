
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
		this.updateButton();
	};

	// we can not do this in the constructor, as we need the component next in DOM
	proto.getPanel = function(){
		if(!this.panel){
			var next = this.el.nextElementSibling;
			if(!next) { console.log("Component to show/hide must be after this ", this.el); return;}
			var comp = this.parent.findComp(next);
			if(!comp) comp = new $(next);
			comp.addClass('ShowHidePanel');
			this.panel = comp;
		}
		return this.panel;
	};

	proto.updateButton = function(){
		try{
			var idx = this.getPanel().isVisible() ? 1:0;
			this.button.setText(this.texts[idx]);
		}catch(e){
			console.error('updateButton error '+e.message);
		}
	};

	proto.on_showHide = function(sel){
		var panel = this.getPanel();
		var next = !panel.isVisible();
		panel.setVisible(next);
		this.updateButton();
	};

});
