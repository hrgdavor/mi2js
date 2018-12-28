(function(){

var mi2 = mi2JS;

mi2._xClickCancel = function(el){
	
	// if disabled at any level 
	if(el.hasAttribute(mi2JS.disabledAttribute)) return true;
	
	// do not mess with other components
	comp = el.getAttribute('as');
	return (comp && el != this.el && !(comp == 'Base' || comp =='Base' )); 
};

mi2._xClickEventData = function(el,evt, end){
	var evtNames = [], actions = [], comp, cancelClick = false;
	while(true){
		if(mi2._xClickCancel(el)) cancelClick = true;

		if(el.hasAttribute('event')) evtNames.push(el.getAttribute('event'));
		if(el.hasAttribute('action')) actions.push(el.getAttribute('action'));

		if(el == end) break;
		el = el.parentNode;
	}

	actions.push('default');
	
	return {
			action:actions[0],
			actions:actions,
			events:evtNames,
			name: evtNames[0],
			domEvent: evt,
			cancelClick: cancelClick,
			target: el,
			required: true,
			fireTo: 'parent'
		};
};

mi2._xClickListen = function(n, options, updaters, parentComp){
	if(!parentComp) return;
	parentComp.listen(n,'click',function(evt){
		var evtData = mi2._xClickEventData(evt.target, evt,n);
		var context;
		var attrValue = options._;
		if(typeof attrValue == 'function'){
			context = attrValue(evt, evtData.action);
		}else if(typeof attrValue == 'string'){
			evtData.name = attrValue;
		}

		evtData.context = context;

		// WORKAROUND to be compatible with base/Button
		// changing fireEvent recognitionf of skipping the initiator component
		// would break base/Button behavior, so this trick is used to make it work along
		evtData.__src = parentComp;

		if(evtData.name && !evt.cancelClick){
			parentComp.fireEvent(evtData);
		} 

//		parentComp.fireEvent('');
	});
}

mi2.registerDirective('x-click', {
	initNodeAttr: function(n, options, updaters, parentComp){
		mi2._xClickListen(n, options, updaters, parentComp);
	}
});

})();