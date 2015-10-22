describe( 'comp.js Component utilities', function () { 
	var mi2 = mi2JS;

	it(' / mi2JS html functions inherited', function () {

		var node = mi2.addTag(null, 'DIV');
		var base = mi2.comp.make(node,'Base');

		expect(base.addClass).toBeDefined();

		expect(node.className).toEqual('');

		base.addClass('c1');
		expect(node.className).toEqual('c1');

		base.addClass('c2');
		expect(node.className).toEqual('c1 c2');

	});

	it(' / add', function () {

		var baseComp = mi2.comp.get('Base');

		expect(baseComp.compName).toEqual('Base');

		var base = mi2.addComp(null,{tag:'DIV', attr:{as:'Base'}});

		expect(base.getCompName()).toEqual('Base');

	});

	it(' / make', function () {
		var comp = mi2.addComp(null,{tag:'B', attr:{as:'base/Loop'}});

		comp.addClass('test2');

		expect(comp instanceof mi2).toBeTruthy();
		expect(comp instanceof mi2.comp.get('Base')).toBeTruthy();
		expect(comp instanceof mi2.comp.get('base/Loop')).toBeTruthy();
		expect(comp.el.className).toEqual('test2');

	});

	it(' / make2', function () {
		var node = mi2.addTag(null,{tag:'B', attr:{as:'Base'}});
		var comp = mi2.comp.make(node);

		comp.addClass('test');

		expect(comp instanceof mi2).toBeTruthy();
		expect(comp instanceof mi2.comp.get('Base')).toBeTruthy();
		expect(comp.el).toEqual(node);
		expect(comp.el.className).toEqual('test');

	});

	it(' / make3', function () {
		var comp = mi2.addComp(null,{tag:'B', attr:{as:'Base'}, html:'<b p="btOk" as="base/Button">ok</b>'});

		comp.btOk.setVisible(false);

		expect(comp instanceof mi2).toBeTruthy();
		expect(comp instanceof mi2.comp.get('Base')).toBeTruthy();
		expect(comp.btOk instanceof mi2.comp.get('base/Button')).toBeTruthy();

	});

	describe('setTimeout-bind', function () {
		var node = mi2.addTag(null,{tag:'B', attr:{as:'Base'}});
		var comp = mi2.comp.make(node);

		var self = null;

		beforeEach(function(done) {
			comp.setTimeout(function(){
				self = this;
				done();
			},10);
		});

		it('should bind',function() {
			// expect(self).toEqual(comp);
		});

	});


});