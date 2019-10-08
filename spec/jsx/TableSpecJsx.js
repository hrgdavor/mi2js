describe( 'mi2.js loop with jsx', function () {
	var mi2 = mi2JS;
	var h = mi2.h;
	var Base = mi2.getComp('Base');
	
	// translation implementation
	var TRANS = {name:'Name'};
	function t(code){ return TRANS[code] ||code;}

    var data = [
        {first:"John", last:'Doe',   age:44, gender:'M'},
        {first:"Mary", last:'Blast', age:33, gender:'F'}
    ];

	mi2JS.addCompClass('test/TableTestJsx', 'Base', '',
	function(proto, superProto, comp, superComp){

		proto.initTemplate = function(value){
			return <template>
				<table as="base/Table" p="table" 
				header={(
					<tr as="Base">
						<th column="first" sort></th>
						<th column="last" sort></th>
						<th column="age"></th>
					</tr>
				)}
				tpl={(state)=>(
					<tr>
						<td gender={state.gender}>{state.first}</td>
						<td>{state.last}</td>
						<td>{state.age}</td>
					</tr>
				)}/>
			</template>;
		};
	});


	it(' / def', function () {
		var comp = mi2.addComp(null, {tag: 'B', attr:{as:'test/TableTestJsx'}});
		var table = comp.table;

		table.setValue(data);
		console.log('table.THEAD',table.THEAD);
		console.log('table.TBODY',table.TBODY);
		console.log('table.0',table.getItems()[0]);


	});

});
