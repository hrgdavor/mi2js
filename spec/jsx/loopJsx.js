describe( 'mi2.js loop with jsx', function () {
	var $ = mi2= mi2JS;
	var h = mi2.h;
	
	// translation implementation
	var TRANS = {name:'Name'};
	function t(code){ return TRANS[code] ||code;}

	mi2JS.addCompClass('test/LoopTestJsx', 'Base', '',
	function(proto, superProto, comp, superComp){

		proto.initTemplate = function(value){
			return <template>
				<div as="base/Loop" p="loop" tpl={(state)=>(
					<button action={state.action}>{state.name}</button>
				)}/>
			</template>;
		};
	});


	it(' / def', function () {
		var comp = mi2.addComp(null, {tag: 'B', attr:{as:'test/LoopTestJsx'}});
		// console.log(comp.el.innerHTML);

		comp.loop.setValue([{action:'action1', name:'Name1'}]);
		expect(comp.el.innerHTML).toEqual('<div as="base/Loop" p="loop"><button as="Base" action="action1">Name1</button></div>');
	});

});
