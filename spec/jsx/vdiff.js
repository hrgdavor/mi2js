describe( 'mi2.js vdiff', function () { 
	var $ = mi2= mi2JS;
	var h = mi2.h;
	
	// translation implementation
	var TRANS = {name:'Name'};
	function t(code){ return TRANS[code] ||code;}

	function attrStr(attr){
		if(!attr) return '';
		var ret = '';
		if(attr.getNamedItem){
			var tmp = attr;
			attr = {};
			for(var i=0; i<tmp.length; i++){
				attr[tmp[i].name] = tmp[i].value;
			}
		}
		var keys = Object.keys(attr);
		keys.sort();
		for(var p of keys){
			ret += p+'='+attr[p]+',';
		}
		return ret;
	}

	it(' / diff attr', function () {
		var node = mi2.insertHtml(null,<div id="1" b="2"/>);

		expect(attrStr(node.attributes)).toEqual('b=2,id=1,');

		mi2.vdiffNode(node, <div id="2" c="0"/>);
		expect(attrStr(node.attributes)).toEqual('c=0,id=2,');

		mi2.vdiffNode(node, <div/>);
		expect(attrStr(node.attributes)).toEqual('');

		mi2.vdiffNode(node, <div id="22" c="110"/>);
		expect(attrStr(node.attributes)).toEqual('c=110,id=22,');
	});

	it(' / diff node update', function () {
		var node = mi2.insertHtml(null,<div/>);
		
		mi2.vdiffNode(node, <div><b id="22" c="110"/>bla</div>);
		expect(node.outerHTML).toEqual('<div><b id="22" c="110"></b>bla</div>');

		mi2.vdiffNode(node, <div><b>bla</b></div>);
		expect(node.outerHTML).toEqual('<div><b>bla</b></div>');

		mi2.vdiffNode(node, <div>bla<b>bla1</b></div>);
		expect(node.outerHTML).toEqual('<div>bla<b>bla1</b></div>');

		mi2.vdiffNode(node, <div></div>);
		expect(node.outerHTML).toEqual('<div></div>');
	});

});