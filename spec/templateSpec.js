describe( 'template.js', function () {
	var mi2 = mi2JS;
	mi2.addFormatter('specTest', function(value){ return value+'--'});

	it('/ not found', function (){
		expect(mi2.parseTemplate('ifNull,"11,12"')).toEqual(null);
	});

	it('/ simple', function (){
		var p = mi2.parseTemplate('Name:${name}');
		expect(p({name:'John'})).toEqual('Name:John');
	});

	it('/ formatted', function (){
		var p = mi2.parseTemplate('Name:${name:specTest}');
		expect(p({name:'John'})).toEqual('Name:John--');
	});

	it('/ template component', function (){
		var node = mi2.addHtml(null,'<b as="base/Template" my-attr="${name}"></b>');
		var comp = mi2.comp.make(node);
		comp.setValue({name:'John'});
		expect(comp.el.getAttribute('my-attr')).toEqual('John');
	});

	it('/ template component', function (){
		var node = mi2.addHtml(null,'<base-template my-attr="${name}">X:${last:specTest}:X</base-template>');
		var comp = mi2.comp.make(node);
		comp.setValue({name:'Adam', last:'Jones'});
		expect(comp.el.getAttribute('my-attr')).toEqual('Adam');
		expect(comp.el.innerHTML).toEqual('X:Jones--:X');
	});


});