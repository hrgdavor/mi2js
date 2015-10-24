describe( 'base/Loop.js', function () {
	var mi2 = mi2JS;
	mi2.addFormatter('loopTest', function(value){ return value+'--'});

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
				html: '<div as="base/Tpl">Name: ${name}, Last: ${last}</div>' 
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

});
