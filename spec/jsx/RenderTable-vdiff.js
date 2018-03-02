describe( 'mi2.js vdiff', function () { 
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
			}
		}});
		// console.log();
		console.log(1,table.tbody.el.innerHTML);
		table.update({data:[{name:'John'}, {name:'Jane'}]});
		console.log(2,table.tbody.el.innerHTML);
	});

});