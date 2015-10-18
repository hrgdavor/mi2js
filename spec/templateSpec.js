describe( 'template.js', function () {
	var mi2 = mi2JS;
	mi2.addFormatter('specTest', function(value){ return value+'--'});

	it('/ not found', function (){
		expect(mi2.parseTemplate('some text without template')).toEqual(null);
	});

	it('/ simple', function (){
		var builderFunc = mi2.parseTemplate('Name:${name}');

		expect(builderFunc({name:'John'})).toEqual('Name:John');
	});

	it('/ formatted', function (){
		var builderFunc = mi2.parseTemplate('Name:${name:specTest}');

		expect(builderFunc({name:'John'})).toEqual('Name:John--');
	});

	it('/ template component', function (){
		var node = mi2.addHtml(null,'<b as="base/Tpl" my-attr="${name}"></b>');
		var comp = mi2.comp.make(node);
		comp.setValue({name:'John'});

		expect(comp.el.getAttribute('my-attr')).toEqual('John');
	});

	it('/ template component complex', function (){
		var node = mi2.addHtml(null,'<base-tpl my-attr="${name}">X:${last:specTest}:X</base-tpl>');
		var comp = mi2.comp.make(node);
		comp.setValue({name:'Adam', last:'Jones'});

		expect(comp.el.getAttribute('my-attr')).toEqual('Adam');
		expect(comp.el.innerHTML).toEqual('X:Jones--:X');
	});


});