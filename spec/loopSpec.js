describe( 'base/Loop.js', function () {
	var mi2 = mi2JS;
	mi2.addFilter('loopTest', function(value){ return value+'--'});

	mi2JS.addCompClass('test/LoopTest', 'Base', '',
	function(proto, superProto, comp, superComp){
		proto.setValue = function(value){
			this.value = value;
			this.setText(value);
		};

		proto.getValue = function(value){
			return this.value;
		};
	});

	it('/ splice', function (){
		var loop = mi2.addComp(null, {tag: 'B', attr:{as:'base/Loop'}, html:'<b template></b>'});
		loop.setItemValue = function(item,value){
			item.el.loopValue = value;
			item.loopValue = value;
			item.setText(value);
		};
		loop.getItemValue = function(item){
			return item.el.loopValue;
		};
		loop.setValue([1,2,3,4]);
		expect(loop.el.innerHTML).toEqual('<b>1</b><b>2</b><b>3</b><b>4</b>');
		expect(loop.getValue()).toEqual([1,2,3,4]);

		loop.pop();		
		expect(loop.el.innerHTML).toEqual('<b>1</b><b>2</b><b>3</b><b hidden="">4</b>');
		expect(loop.getValue()).toEqual([1,2,3]);

		loop.push(14);
		expect(loop.el.innerHTML).toEqual('<b>1</b><b>2</b><b>3</b><b>14</b>');
		expect(loop.getValue()).toEqual([1,2,3,14]);

		var tmpItem = loop.getItem(1);	
		loop.splice(1,1);
		// check that the elemnt was moved properly
		expect(loop.count).toEqual(3);
		expect(tmpItem).toEqual(loop.allItems[3]);
		expect(loop.getValue()).toEqual([1,3,14]);

		// reset to start again
		loop.setValue([1,2,3,4]);
		expect(loop.el.innerHTML).toEqual('<b>1</b><b>2</b><b>3</b><b>4</b>');
		expect(loop.getValue()).toEqual([1,2,3,4]);

		var tmpItem = loop.getItem(1);	
		loop.splice(1,2);
		expect(loop.count).toEqual(2);
		expect(tmpItem).toEqual(loop.allItems[2]);
		expect(loop.getValue()).toEqual([1,4]);


		// reset to start again
		loop.setValue([1,2,3,4]);
		expect(loop.el.innerHTML).toEqual('<b>1</b><b>2</b><b>3</b><b>4</b>');
		expect(loop.getValue()).toEqual([1,2,3,4]);

		var tmpItem = loop.getItem(2);
		loop.splice(1,2,9);
		expect(tmpItem).toEqual(loop.allItems[3]);//moved to last
		expect(loop.getValue()).toEqual([1,9,4]);

		// reset to start again
		loop.setValue([1,2,3,4]);
		expect(loop.el.innerHTML).toEqual('<b>1</b><b>2</b><b>3</b><b>4</b>');
		expect(loop.getValue()).toEqual([1,2,3,4]);

		loop.splice(1,2,8,9);
		expect(loop.getValue()).toEqual([1,8,9,4]);

		// reset to start again
		loop.setValue([1,2,3,4]);
		expect(loop.el.innerHTML).toEqual('<b>1</b><b>2</b><b>3</b><b>4</b>');
		expect(loop.getValue()).toEqual([1,2,3,4]);

		loop.splice(1,0,8,9);
		expect(loop.getValue()).toEqual([1,8,9,2,3,4]);

		// reset to start again
		loop.setValue([1,2,3,4,5]);
		expect(loop.el.innerHTML).toEqual('<b>1</b><b>2</b><b>3</b><b>4</b><b>5</b><b hidden="">4</b>');
		expect(loop.getValue()).toEqual([1,2,3,4,5]);

		loop.splice(1,1,8,9);
		expect(loop.getValue()).toEqual([1,8,9,3,4,5]);
		expect(loop.el.innerHTML).toEqual('<b>1</b><b>8</b><b>9</b><b>3</b><b>4</b><b>5</b>');

	});

	it('/ basic ', function (){
		var node = mi2.addTag(null, {tag:'DIV', 
				attr: {as:'base/Loop'},
				html: '<div template as="Base" >Name: ${value.name}, Last: ${value.last}</div>' 
			});

		var comp = mi2.makeComp(node);

		var data = [
			{name:"John", last:'Doe', age:44},
			{name:"Mary", last:'Blast', age:33}
		];

		comp.setValue(data);

		expect(comp.getItems().length).toEqual(2);
		expect(comp.el.innerHTML).toEqual(
'<div as="Base">Name: John, Last: Doe</div>'+
'<div as="Base">Name: Mary, Last: Blast</div>'
		);
	});

	it('/ not the only child ', function (){
		var node = mi2.addTag(null, {tag:'DIV', 
				attr: {as:'base/Loop'},
				html: '<div template as="Base" >Name: ${value.name}, Last: ${value.last}</div><b>xx</b>' 
			});

		var comp = mi2.makeComp(node);

		var data = [
			{name:"John", last:'Doe', age:44},
			{name:"Mary", last:'Blast', age:33}
		];

		comp.setValue(data);

		expect(comp.getItems().length).toEqual(2);
		expect(comp.el.innerHTML).toEqual(
'<div as="Base">Name: John, Last: Doe</div>'+
'<div as="Base">Name: Mary, Last: Blast</div>'+
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
