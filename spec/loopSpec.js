describe( 'base/Loop.js', function () {
	var mi2 = mi2JS;
	mi2.addFilter('loopTest', function(value){ return value+'--'});

	mi2JS.comp.add('test/LoopTest', 'Base', '',
	function(proto, superProto, comp, superComp){
		proto.setValue = function(value){
			this.value = value;
			this.setText(value);
		};

		proto.getValue = function(value){
			return this.value;
		};
	});


	it('/ basic ', function (){
		var node = mi2.addTag(null, {tag:'DIV', 
				attr: {as:'base/Loop'},
				html: '<div template as="base/Tpl" >Name: ${name}, Last: ${last}</div>' 
			});

		var comp = mi2.comp.make(node);

		var data = [
			{name:"John", last:'Doe', age:44},
			{name:"Mary", last:'Blast', age:33}
		];

		comp.setValue(data);

		expect(comp.getItems().length).toEqual(2);
		expect(comp.el.innerHTML).toEqual(
'<div as="base/Tpl">Name: John, Last: Doe</div>'+
'<div as="base/Tpl">Name: Mary, Last: Blast</div>'
		);
	});

	it('/ not the only child ', function (){
		var node = mi2.addTag(null, {tag:'DIV', 
				attr: {as:'base/Loop'},
				html: '<div template as="base/Tpl" >Name: ${name}, Last: ${last}</div><b>xx</b>' 
			});

		var comp = mi2.comp.make(node);

		var data = [
			{name:"John", last:'Doe', age:44},
			{name:"Mary", last:'Blast', age:33}
		];

		comp.setValue(data);

		expect(comp.getItems().length).toEqual(2);
		expect(comp.el.innerHTML).toEqual(
'<div as="base/Tpl">Name: John, Last: Doe</div>'+
'<div as="base/Tpl">Name: Mary, Last: Blast</div>'+
'<b>xx</b>'
		);
	});


	it('/ setValue getValue Array based', function (){
		var loop = mi2.addComp(null, {tag: 'B', attr:{as:'base/Loop'}, html:'<b as="test/LoopTest"></b>'});
		var data = [ 'John', 'Doe' ];

		loop.setValue(data);

		// chect inserted html
		expect(loop.el.innerHTML).toEqual('<b as="test/LoopTest">John</b><b as="test/LoopTest">Doe</b>');

		// collect data
		var newData = loop.getValue();

		expect(newData).toEqual(data);

		// set value of last to undefined so it is not collected 
		loop.getItems()[1].setValue(void 0);

		// collect data
		newData = loop.getValue();

		expect(newData).toEqual(['John']);

	});

	it('/ visible is', function (){
		var loop = mi2.addComp(null, {tag: 'B', attr:{as:'base/Loop'}, html:'<b as="test/LoopTest"></b>'});
		var data = [ 'John', 'Doe' ];

		loop.setValue(data);

		// chect inserted html
		expect(loop.el.innerHTML).toEqual('<b as="test/LoopTest">John</b><b as="test/LoopTest">Doe</b>');

		loop.visibleIs([0]);
		expect(loop.item(0).isVisible()).toEqual(true);
		expect(loop.item(1).isVisible()).toEqual(false);

		// none provided, so all are visible
		loop.visibleNot([]);
		expect(loop.item(0).isVisible()).toEqual(true);
		expect(loop.item(1).isVisible()).toEqual(true);

		loop.visibleIs([0]);
		loop.callFunc('setVisible',[true]); //equivalent to : loop.visibleNot([]);

		expect(loop.item(0).isVisible()).toEqual(true);
		expect(loop.item(1).isVisible()).toEqual(true);
	});

	it('/ selected is', function (){
		var loop = mi2.addComp(null, {tag: 'B', attr:{as:'base/Loop'}, html:'<b as="test/LoopTest"></b>'});
		var data = [ 'John', 'Doe' ];

		loop.setValue(data);

		// chect inserted html
		expect(loop.el.innerHTML).toEqual('<b as="test/LoopTest">John</b><b as="test/LoopTest">Doe</b>');

		loop.selectedIs([0]);
		expect(loop.item(0).isSelected()).toEqual(true);
		expect(loop.item(1).isSelected()).toEqual(false);

	});


});
