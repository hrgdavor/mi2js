
mi2JS.comp.add('base/ShowHide', 'Base', '<-TEMPLATE->',

// component initializer function that defines constructor and adds methods to the prototype 
function(comp, proto, superClass){
	var mi2 = mi2JS;
	comp.constructor = function(el, tpl, parent){
		var html = el.innerHTML;
		el.innerHTML = '';
		// template is not pased because it will be used only if no inline template is defined
		superClass.constructor.call(this, el, tpl, parent);
		this.texts = this.button.attr('texts').split(',');

		this.title.html(html);
		this.listen(parent,'afterCreate', 'updateButton');
	};

	// we can not do this in the constructor, as we need the component next in DOM
	proto.getPanel = function(){
		if(!this.panel){
			var next = mi2.next(this.el);
			if(!next) { console.log("Component to show/hide must be after this ", this.el); return;}
			var cd = this.parent.children;
			var comp, count = cd.length;
			for(var i=0; i<count; i++){
				if(cd[i].el == next){
					comp = cd[i];
					break;
				}
			}
			if(!comp) comp = mi2.wrap(next);
			comp.addClass('ShowHidePanel');
			this.panel = comp;
		}
		return this.panel;
	};

	proto.updateButton = function(sel){
		var idx = this.getPanel().isVisible() ? 1:0;
		this.button.html(this.texts[idx]);
	};

	proto.on_showHide = function(sel){
		var panel = this.getPanel();
		var next = !panel.isVisible();
		panel.setVisible(next);
		this.updateButton();
	};

});
