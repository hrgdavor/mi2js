describe( 'comp.js Component utilities', function () { 
	var mi2 = mi2JS;

	it('mi2JS html functions inherited', function () {

		var node = mi2.addTag(null, 'DIV');
		var base = mi2.comp.make(node,'Base');

		expect(base.addClass).toBeDefined();

		expect(node.className).toEqual('');

		base.addClass('c1');
		expect(node.className).toEqual('c1');

		base.addClass('c2');
		expect(node.className).toEqual('c1 c2');

	}); 

	it('add', function () {

		var baseComp = mi2.comp.get('Base');

		expect(baseComp.compName).toEqual('Base');

		var base = mi2.comp.make('DIV','Base');

		expect(base.getCompName()).toEqual('Base');

	});

	it('make', function () {
		var node = mi2.addHtml(null,'<b as="Base"></b>');
		var comp = mi2.comp.make(node);

		comp.addClass('test');

		expect(comp instanceof mi2).toBeTruthy();
		expect(comp instanceof mi2.comp.get('Base')).toBeTruthy();
		expect(comp.el).toEqual(node);
		expect(comp.el.className).toEqual('test');

	});


});