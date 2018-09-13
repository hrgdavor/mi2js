describe( 'RenderTable.js vdiff', function () { 
	var $ = mi2= mi2JS;
	var h = mi2.h;
	
	// translation implementation
	var TRANS = {name:'Name'};
	function t(code){ return TRANS[code] ||code;}
    mi2.t = t;

	it(' / diff node update', function () {
		var node = mi2.addTag(null, { tag: 'DIV', attr:{as:'base/RenderTable'} });
		var table = mi2.makeComp(node);
		table.setup({columns:{
			name:{
				td:function(tr,td,code,data){
					return <td>{data.name}</td>;
				}
			},
			age:{
				td:function(tr,td,code,data){
					return <td>{data.age}</td>;
				}
			}
		}});
		table.update({data:[{name:'John', age:12}, {name:'Jane', age:0}]});

		expect(table.tbody.el.innerHTML).toEqual('<tr class="high"><td class="cell_name">John</td><td class="cell_age">12</td></tr><tr class="high"><td class="cell_name">Jane</td><td class="cell_age">0</td></tr>');

		table.update({data:[{name:'John', age:12}, { age:0}]});
		expect(table.tbody.el.innerHTML).toEqual('<tr class="high"><td class="cell_name">John</td><td class="cell_age">12</td></tr><tr class="high"><td class="cell_name"></td><td class="cell_age">0</td></tr>');
	});

});