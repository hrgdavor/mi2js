describe( 'comp.js Component utilities', function () { 
	var mi2 = mi2JS;

	mi2JS.comp.add('test/LazyTestIn', 'Base', '<b p="bt1" as="base/Button">ok</b>',
	function(proto, superProto, comp, superComp){

	});

	mi2JS.comp.add('test/LazyTest', 'Base', '<div p="inside" as="test/LazyTestIn"></div>',
	function(proto, superProto, comp, superComp){
		proto.lazyInit = true;
	});


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

	it(' / lazyInit', function () {
		var comp = mi2.addComp(null,{tag:'B', attr:{as:'test/LazyTest',hidden:''}, html:''});

		expect(comp.el.inside).toEqual(undefined);
		expect(comp.el.innerHTML).toEqual('<div p="inside" as="test/LazyTestIn"></div>');
		comp.setVisible(true);
		expect(comp.el.innerHTML).toEqual('<div p="inside" as="test/LazyTestIn"><b p="bt1" as="base/Button">ok</b></div>');
		expect(comp.inside instanceof mi2.comp.get('test/LazyTestIn')).toBeTruthy();	
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