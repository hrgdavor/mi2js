describe( 'base/Table.js', function () {
	var mi2 = mi2JS;
	mi2.addFormatter('ageTest', function(value){ return value+'--'});

	it('/ basic ', function (){
		var node = mi2.addHtml(null,'<table as="base/Table"></table>');
		var comp = mi2.comp.make(node);

		var data = [
			{name:"Jonh", last:'Doe', age:44},
			{name:"Mary", last:'Blast', age:33}
		];

		comp.setValue(data);

		expect(comp.el.innerHTML).toEqual(
'<thead>'+
'</thead>'+
'<tbody>'+
'</tbody>'
		);
	});

});
