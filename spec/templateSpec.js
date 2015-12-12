describe( 'template.js', function () {
	var mi2 = mi2JS;
	mi2.addFilter('specTest', function(value){ return value+'--'});
	mi2.addFilter('specTest2', function(value){ return '('+value+')'});
	mi2.addFilter('specNull', function(value){ return value == 'null-like'? null:value });

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
		var builderFunc = mi2.parseTemplate('Name:${name|specTest}');

		expect(builderFunc({name:'John'})).toEqual('Name:John--');
	});

	it('/ template component', function (){
		var node = mi2.addTag(null,{tag:'B', attr:{as:'base/Tpl', 'my-attr':'${name}'}});
		var comp = mi2.comp.make(node);
		comp.setValue({name:'John'});

		expect(comp.el.getAttribute('my-attr')).toEqual('John');
	});

	it('/ template component remove attribute', function (){
		var node = mi2.addTag(null,{tag:'B', attr:{as:'base/Tpl', 'my-attr':'${name}'}});
		var comp = mi2.comp.make(node);

		comp.setValue({name:'John'});
		expect(comp.hasAttr('my-attr')).toEqual(true);
		expect(comp.el.getAttribute('my-attr')).toEqual('John');

		comp.setValue({name:null});
		expect(comp.hasAttr('my-attr')).toEqual(false);
		expect(comp.attr('my-attr')).toEqual(null);
	});


	it('/ template component remove attribute', function (){
		var node = mi2.addTag(null,{tag:'B', attr:{as:'base/Tpl', 'hidden':'${name|specNull}'}});
		var comp = mi2.comp.make(node);

		comp.setValue({name:'John'});
		expect(comp.hasAttr('hidden')).toEqual(true);
		expect(comp.isVisible()).toEqual(false);
		expect(comp.el.getAttribute('hidden')).toEqual('John');

		comp.setValue({name:null});
		expect(comp.hasAttr('hidden')).toEqual(false);
		expect(comp.isVisible()).toEqual(true);
		expect(comp.attr('hidden')).toEqual(null);

		comp.setValue({name:'null-like'});
		expect(comp.hasAttr('hidden')).toEqual(false);
		expect(comp.isVisible()).toEqual(true);
		expect(comp.attr('hidden')).toEqual(null);
	});

	it('/ template component complex', function (){
		var node = mi2.addTag(null,{tag:'base-tpl', attr:{'my-attr':'${name}'}, html:'X:${last|specTest}:X'} );
		var comp = mi2.comp.make(node);
		comp.setValue({name:'Adam', last:'Jones'});

		expect(comp.el.getAttribute('my-attr')).toEqual('Adam');
		expect(comp.el.innerHTML).toEqual('X:Jones--:X');
	});

	it('/ template component complex', function (){
		var node = mi2.addTag(null,{tag:'base-tpl', attr:{}, html:'X:${last|specTest|specTest2}:X'} );
		var comp = mi2.comp.make(node);
		comp.setValue({name:'Adam', last:'Jones'});

		expect(comp.el.innerHTML).toEqual('X:(Jones--):X');
	});

	it('/ template component complex 2', function (){
		var node = mi2.addTag(null,{tag:'base-tpl', attr:{}, html:'X:${last|specTest2|specTest}:X'} );
		var comp = mi2.comp.make(node);
		comp.setValue({name:'Adam', last:'Jones'});

		expect(comp.el.innerHTML).toEqual('X:(Jones)--:X');
	});


	it('/ data expansion', function (){
		var data = {firstname:'John', lastname: 'Doe'};
		var exp = mi2.parseExpander({
			name: '${firstname} ${lastname}'
		});

		expect(mi2.expandData(data,exp, true)).toEqual({firstname:'John', lastname: 'Doe', name:'John Doe'});
		expect(mi2.expandData(data,exp, false)).toEqual({name:'John Doe'});

		expect(mi2.expandArray([data],exp, false)).toEqual([{name:'John Doe'}]);
	});


});