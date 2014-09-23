
mi2JS.comp.add('base/TabPane', 'Base', '<-TEMPLATE->',

// component initializer function that defines constructor and adds methods to the prototype 
function(comp, proto, superClass){

	var mi2 = mi2JS; // minimizer friendly

	comp.constructor = function(el, tpl, parent){
		// template is not pased because it will be used only if no inline template is defined
		superClass.constructor.call(this, el, '', parent);

		if(!this.buttonsArea){// no inline template, so we use default one
			var arr = [];
			while(this.el.firstChild){
				arr.push(this.el.removeChild(this.el.firstChild));
			}
			// use defaulet template
			el.innerHTML = tpl;
			mi2.parseChildren(el,this);

			for(var i=0; i<arr.length; i++){
				this.contentArea.el.appendChild(arr[i]);
			}
		}

		this.selectedTab = null;

		if(!this.tabs) this.tabs = {};
		var str = '';
		for(var t in this.tabs){
			var tab = this.tabs[t];
			if(tab.attr('selected') || (!this.selectedTab) ) this.selectedTab = t;
			str += '<tabbt mi-set="buttons.'+t+'" event="selectTab" action="'+t+'" mi-comp="base/Button">'
				+tab.attr('title')+'</tabbt>';
		}
		this.buttonsArea.el.innerHTML = str;
		// parse generated buttons that match tabs
		mi2.parseChildren(this.buttonsArea.el, this);
	};

	proto.on_selectTab = function(evt){
		this.selectTab(evt.action);
	};

	proto.selectTab = function(sel){
		if(!this.tabs[sel]) throw new Error('Tab not found '+sel);
		this.selectedTab = sel;
		for(var t in this.tabs){
			this.tabs[t].setVisible(t == sel);
			this.buttons[t].setSelected(t == sel);
		}
	};

});
