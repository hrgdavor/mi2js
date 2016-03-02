/*
Combination of button functionality with variable expansion support.

*/

mi2JS.comp.add('base/Button', 'base/Tpl', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	proto.minClickDelay = 300;

	proto.initTemplate = function(){
		superProto.initTemplate.call(this);
		this.listen(this.el,'click');
	};

	proto.on_click = function(evt){
		if(evt.which != 1) return; // only left click

		var evtNames = [], actions = [], comp, enabled = true;
		var el = evt.target;
		while(true){
			if(this.cancelClick(el)) return;

			if(el.hasAttribute('event')) evtNames.push(el.getAttribute('event'));
			if(el.hasAttribute('action')) actions.push(el.getAttribute('action'));

			if(el == this.el) break;
			el = el.parentNode;
		}

		if(this.__propName) actions.push(this.__propName);

		if(evtNames.length && this.parent.fireEvent){
			var now = Date.now();
			if(this._lastClick && now - this._lastClick < this.minClickDelay) return;	
			this._lastClick = now;

			this.parent.fireEvent(evtNames[0],{
				action:actions[0],
				actions:actions,
				events:evtNames,
				domEvent: evt,
				target: evt.target,
				src:this,
				eventFor: 'parent'
			});
			evt.stop();
			return false;
		}
	};

	proto.cancelClick = function(el){
		
		// if disabled at any level 
		if(el.hasAttribute(mi2JS.disabledAttribute)) return true;
		
		// do not mess with other components
		comp = el.getAttribute('as');
		return (comp && el != this.el && !(comp == 'base/Tpl' || comp =='Base' )); 
	};

});
