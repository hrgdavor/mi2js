describe( 'comp.js Component utilities', function () { 
	var mi2 = mi2JS;

	mi2JS.comp.add('test/LazyTestIn', 'Base', '<b p="bt1" as="base/Button">ok</b>',
	function(proto, superProto, comp, superComp){
		proto.lazyInit = true;
	});

	mi2JS.comp.add('test/LazyTest', 'Base', '<div p="inside" as="test/LazyTestIn"></div>',
	function(proto, superProto, comp, superComp){
	});


	mi2JS.comp.add('test/ShowHideInitTest', 'Base', '',
	function(proto, superProto, comp, superComp){
		proto.construct = function(el,parent){
			superProto.construct.call(this,el,parent);
			this.on_show_count = 0;
			this.on_hide_count = 0;
			this.on_init_count = 0;
		}
		proto.on_show = function(){ this.on_show_count++; }
		proto.on_hide = function(){ this.on_hide_count++; }
		proto.on_init = function(){ this.on_init_count++; }
	});


	it(' / lazyInit', function () {
		window.__DEBUG = true;
		var comp = mi2.addComp(null,{tag:'B', attr:{as:'test/LazyTest',hidden:''}, html:''});
		window.__DEBUG = false;

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

	it(' / show hide event', function () {
		var comp = mi2.addComp(null,{tag:'B', attr:{as:'test/ShowHideInitTest',hidden:''}, html:''});
		
		comp.setVisible(true);
		expect(comp.on_show_count).toEqual(1);
		expect(comp.on_init_count).toEqual(1);

		comp.setVisible(false);
		comp.setVisible(true);
		expect(comp.on_show_count).toEqual(2);
		expect(comp.on_init_count).toEqual(1);
		expect(comp.on_hide_count).toEqual(1);

	});

	it(' / show hide event skip', function () {
		var comp = mi2.addComp(null,{tag:'B', attr:{as:'test/ShowHideInitTest',hidden:''}, 
			html:'<b as="test/ShowHideInitTest" p="child" hidden>x</b>'});
		
		expect(comp.on_show_count).toEqual(0);
		comp.setVisible(true);
		expect(comp.on_show_count).toEqual(1);

		expect(comp.child.on_show_count).toEqual(0);
		comp.setVisible(false);
		expect(comp.child.on_hide_count).toEqual(0);

		// show child while parent hidden (must skip)
		comp.child.setVisible(true);
		expect(comp.child.on_show_count).toEqual(0);
		
		// show parent now when child is visible (must fire)
		comp.setVisible(true);
		expect(comp.child.on_show_count).toEqual(1);

	});

});