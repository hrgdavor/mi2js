describe( 'mi2.js Base library', function () { 
	var $ = mi2= mi2JS;
	var h = mi2.h;
	
	// translation implementation
	var TRANS = {name:'Name'};
	function t(code){ return TRANS[code] ||code;}
    mi2.t = t;

	mi2JS.addCompClass('test/JsxTest', 'Base', '',
	function(proto, superProto, comp, superComp){

		proto.initTemplate = function(h,t,state){
			return <template>{state.x}</template>
		};
	});

	mi2JS.addCompClass('test/JsxTestRef', 'Base', '',
	function(proto, superProto, comp, superComp){

		proto.initTemplate = function(h,t,state){
			var $form  = <div><label>[[name]]:</label>{state.name}</div>

			return <template>{$form}</template>
		};
	});

	it(' / def', function () {
		var def = <div></div>

		expect(def.tag).toEqual('div');
		expect(def.attr).toBeNull();
		expect(def.children).toEqual([]);
	});

	it(' / translate', function () {
		var def = <div title="[[name]]" title2="[[name]] x">[[name]]</div>

		expect(def.tag).toEqual('div');
		expect(def.children[0]()).toEqual('Name');
		expect(def.attr.title()).toEqual('Name');
		expect(def.attr.title2()).toEqual('Name x');
	});


	it(' / es6', function () {
		expect([3,4].map((x)=>x-1)).toEqual([2,3])
	});

	it(' / jsx template', function () {
		var comp = mi2.addComp(null,{tag:'B', attr:{as:'test/JsxTest'}, html:''});

		expect(comp.el.innerHTML).toEqual('')

		comp.state.x = 1;
		comp.updateContent();
		expect(comp.el.innerHTML).toEqual('1')

		comp.state.x = 2;
		comp.updateContent();
		expect(comp.el.innerHTML).toEqual('2')
	});

	it(' / jsx template ref', function () {
		var comp = mi2.addComp(null,{tag:'B', attr:{as:'test/JsxTestRef'}, html:''});

		expect(comp.el.innerHTML).toEqual('<div><label>Name:</label></div>')

		comp.state.name = 'John';
		comp.updateContent();
		expect(comp.el.innerHTML).toEqual('<div><label>Name:</label>John</div>')

		comp.state.name = 'Jane';
		comp.updateContent();
		expect(comp.el.innerHTML).toEqual('<div><label>Name:</label>Jane</div>')
	});


});