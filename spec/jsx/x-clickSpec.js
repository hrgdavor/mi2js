describe( 'x-click', function () { 
	var $ = mi2= mi2JS;
	var h = mi2.h;
	var t = mi2.t;

	mi2JS.addCompClass('test/XClickTestJsx', 'Base', '',
	function(proto, superProto, comp, superComp){

		proto.on_save = function(evt){
			this.saveContext = evt.context;
			this.saveAction = evt.action;
		};

		proto.initTemplate = function(h,t,state){
			return <template>
				<div disabled x-click={(evt,action)=>{return 11;}} action="aaaa" event="save"/>
				<div x-click="save">
					<button action="b1">b1</button>
					<button action="b2">b2</button>
				</div>
			</template>;
		};

	});

	it(' / extractDirectives', function () {
		// console.log('mi2.directives',mi2.directives);

		var dirs = mi2.extractDirectives({'x-click':'test1', x:'test2'});

		expect(dirs.x.click._).toEqual('test1');

	});

	it(' / x-click node', function () {
		var comp = mi2.addComp(null, {tag: 'B', attr:{as:'test/XClickTestJsx'}});

		comp.el.firstChild.click();

		expect(comp.saveContext).toEqual(11);
		expect(comp.saveAction).toEqual('aaaa');

		var bt1 = comp.el.firstChild.nextSibling.firstChild;
		bt1.click();
		expect(comp.saveAction).toEqual('b1');

		var bt2 = bt1.nextSibling;
		bt2.click();
		expect(comp.saveAction).toEqual('b2');

	});

});