describe( 'comp.js Component utilities', function () { 
	var mi2 = mi2JS;

	mi2JS.addCompClass('test/LazyTestIn', 'Base', '<b p="bt1" as="base/Button">ok</b>',
	function(proto, superProto, comp, superComp){
		proto.lazyInit = true;
	});

	mi2JS.addCompClass('test/LazyTest', 'Base', '<div p="inside" as="test/LazyTestIn"></div>',
	function(proto, superProto, comp, superComp){
	});

	mi2JS.addCompClass('test/FormTest1', 'Base', '<div><input p="items.name"/><input p="items.gender"/></div>',
	function(proto, superProto, comp, superComp){
	});

	mi2JS.addCompClass('test/FormTest2', 'Base', '<div><input name="name"/><input name="gender"/></div>',
	function(proto, superProto, comp, superComp){
	});


	mi2JS.addCompClass('test/ShowHideInitTest', 'Base', '',
	function(proto, superProto, comp, superComp){
		proto.construct = function(el,parent){
			superProto.construct.apply(this,arguments);
			this.on_show_count = 0;
			this.on_hide_count = 0;
			this.on_init_count = 0;
		}
		proto.on_show = function(){ this.on_show_count++; }
		proto.on_hide = function(){ this.on_hide_count++; }
		proto.on_init = function(){ this.on_init_count++; }
	});


	it(' / lazyInit', function () {
		var comp = mi2.addComp(null,{tag:'B', attr:{as:'test/LazyTestIn',hidden:''}, html:''});

		expect(comp.bt1).toEqual(undefined);
		expect(comp.el.innerHTML).toEqual('');
		comp.setVisible(true);
		expect(comp.el.innerHTML).toEqual('<b p="bt1" as="base/Button">ok</b>');
		expect(comp.bt1 instanceof mi2.getComp('base/Button')).toBeTruthy();	
	});



	describe('setTimeout-bind', function () {
		var node = mi2.addTag(null,{tag:'B', attr:{as:'Base'}});
		var comp = mi2.makeComp(node);

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

	it(' / FormTest1', function () {
		var comp = mi2.addComp(null,{tag:'B', attr:{as:"test/FormTest1"}});

		expect(comp.el.innerHTML).toEqual('<div><input p="items.name" as="base/Input" autocomplete="fu-chrome"><input p="items.gender" as="base/Input" autocomplete="fu-chrome"></div>');
		expect(comp.items != null).toEqual(true);
		expect(comp.items.name!= null).toEqual(true);
		comp.$items.setValue({name:'name-val', gender:'gender-val'});
		expect(comp.items.name.getValue()).toEqual('name-val');
		expect(comp.items.gender.getValue()).toEqual('gender-val');
	});

	it(' / FormTest2', function () {
		var comp = mi2.addComp(null,{tag:'B', attr:{as:"test/FormTest2"}});

		expect(comp.el.innerHTML).toEqual('<div><input name="name" as="base/Input" autocomplete="fu-chrome"><input name="gender" as="base/Input" autocomplete="fu-chrome"></div>');
		expect(comp.items != null).toEqual(true);
		expect(comp.items.name!= null).toEqual(true);
		comp.$items.setValue({name:'name-val', gender:'gender-val'});
		expect(comp.items.name.getValue()).toEqual('name-val');
		expect(comp.items.gender.getValue()).toEqual('gender-val');
	});

});