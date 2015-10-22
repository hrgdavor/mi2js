
mi2JS.comp.add('base/Button', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	proto.construct = function(el, tpl, parent){
		superProto.construct.call(this, el, tpl, parent);

		this.action = this.attr("action") || "action";
		this.event  = this.attr("event")  || "action";
		this.lastClick = 0;
		this.listen(el,"click",function(evt){
			evt.stop();
		});

		this.listen(el,"mousedown",function(evt){
			if(evt.which != 1) return; // only left click
			evt.stop();
			if(this.isEnabled() && this.parent.fireEvent){
				var now = new Date().getTime();
				if(now -this.lastClick > 300){ // one click per second
					this.parent.fireEvent(this.event, {
						action: this.action, 
						button:this, 
						domEvent: evt, 
						src:this,
						eventFor: 'parent'
					}); 
					this.lastClick = now;
				} 
			}
		});

	};

	proto.setValue = function(value){
		this.el.value = value;
	};

	proto.getValue = function(value){
		return this.el.value;
	};


}); 
