describe( 'parse.js', function () { 
	var mi2 = mi2JS;

	it('/ parse', function () { 
		var node = mi2.addHtml(null,'<div mi-comp="Base"><b mi-set="b1"></b></div>');
		var comp = mi2.parse(node);

		expect(comp instanceof mi2).toBeTruthy();
		expect(comp instanceof mi2.comp.get('Base')).toBeTruthy();
		expect(comp.el).toEqual(node);
		expect(comp.b1).toBeDefined();
		expect(comp.b1 instanceof mi2).toBeTruthy();
	});

	it('/ parse list', function () { 
		var node = mi2.addHtml(null,'<div mi-comp="Base"><b mi-set="bt.">x</b><b mi-set="bt.">y</b></div>');
		var comp = mi2.parse(node);

		expect(comp.bt).toBeDefined();
		console.log(comp.bt);
		expect(comp.bt.length).toEqual(2);
		expect(comp.bt[0] instanceof mi2).toBeTruthy();
	});

	it('/ parse list', function () { 
		var node = mi2.addHtml(null,'<div mi-comp="Base"><b mi-set="bt.x">x</b><b mi-set="bt.y" mi-comp="Base">y</b></div>');
		var comp = mi2.parse(node);

		expect(comp.bt).toBeDefined();
		expect(comp.bt.x).toBeDefined();
		expect(comp.bt.y).toBeDefined();
		expect(comp.bt.x instanceof mi2).toBeTruthy();
		expect(comp.bt.y instanceof mi2.comp.get('Base')).toBeTruthy();
	});

});