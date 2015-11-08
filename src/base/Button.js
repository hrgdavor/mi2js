
mi2JS.comp.add('base/Button', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	proto.construct = function(el, tpl, parent){
		superProto.construct.call(this, el, tpl, parent);

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
					this.parent.fireEvent(this.getEvent(), {
						action: this.getAction(), 
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

	proto.getEvent = function(){
		return this.attrDef("event", "action");
	};

	proto.getAction = function(){
		return this.attrDef("action", this.__propName);
	};

	proto.setValue = function(value){
		this.el.value = value;
	};

	proto.getValue = function(value){
		return this.el.value;
	};


}); 
