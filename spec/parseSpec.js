describe( 'parse.js', function () { 
	var mi2 = mi2JS;

	it('/ parse', function () { 
		var node = mi2.addTag(null, {tag:'DIV', attr:{as:'Base'}, html:'<b p="b1"></b>'});
		var comp = mi2.parse(node);

		expect(comp instanceof mi2).toBeTruthy();
		expect(comp instanceof mi2.comp.get('Base')).toBeTruthy();
		expect(comp.el).toEqual(node);
		expect(comp.b1).toBeDefined();
		expect(comp.b1 instanceof mi2).toBeTruthy();
	});

	it('/ parse list', function () { 
		var node = mi2.addTag(null, {tag:'DIV', attr:{as:'Base'}, html:'<b p="bt.">x</b><b p="bt.">y</b>'});
		var comp = mi2.parse(node);

		expect(comp.bt).toBeDefined();
		expect(comp.bt.items.length).toEqual(2);
		expect(comp.bt.items[0] instanceof mi2).toBeTruthy();
	});

	it('/ parse list', function () { 
		var node = mi2.addTag(null,{tag:'DIV', attr:{as:'Base'}, html:'<b p="bt.x">x</b><b p="bt.y" as="Base">y</b>'});
		var comp = mi2.parse(node);

		expect(comp.bt).toBeDefined();
		expect(comp.bt.item('x')).toBeDefined();
		expect(comp.bt.items.y).toBeDefined();
		expect(comp.bt.item('x') instanceof mi2).toBeTruthy();
		expect(comp.bt.items.y instanceof mi2.comp.get('Base')).toBeTruthy();
	});

});