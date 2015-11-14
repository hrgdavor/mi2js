describe( 'template.js', function () {
	var mi2 = mi2JS;
	mi2.addFilter('specTest', function(value){ return value+'--'});

	it('/ not found', function (){
		expect(mi2.parseTemplate('some text without template')).toEqual(null);
	});

	it('/ simple', function (){
		var builderFunc = mi2.parseTemplate('Name:${name}');

		expect(builderFunc({name:'John'})).toEqual('Name:John');
	});

	it('/ array', function (){
		var builderFunc = mi2.parseTemplate('Value must be between ${0} and ${1}');

		expect(builderFunc([10,20])).toEqual('Value must be between 10 and 20');
		expect(builderFunc({'0':10,'1':20})).toEqual('Value must be between 10 and 20');
	});

	it('/ formatted', function (){
		var builderFunc = mi2.parseTemplate('Name:${name:specTest}');

		expect(builderFunc({name:'John'})).toEqual('Name:John--');
	});

	it('/ template component', function (){
		var node = mi2.addTag(null,{tag:'B', attr:{as:'base/Tpl', 'my-attr':'${name}'}});
		var comp = mi2.comp.make(node);
		comp.setValue({name:'John'});

		expect(comp.el.getAttribute('my-attr')).toEqual('John');
	});

	it('/ template component complex', function (){
		var node = mi2.addTag(null,{tag:'base-tpl', attr:{'my-attr':'${name}'}, html:'X:${last:specTest}:X'} );
		var comp = mi2.comp.make(node);
		comp.setValue({name:'Adam', last:'Jones'});

		expect(comp.el.getAttribute('my-attr')).toEqual('Adam');
		expect(comp.el.innerHTML).toEqual('X:Jones--:X');
	});


});