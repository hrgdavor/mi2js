describe( 'base/Table.js', function () {
	var mi2 = mi2JS;
	mi2.addFormatter('ageTest', function(value){ return value+'--'});

	it('/ basic ', function (){
		var node = mi2.addHtml(null,
'<table as="base/Table">'+
    '<tr>'+
        '<th column="first" sort></th><td gender="${gender}">$(first)</td>'+
        '<th column="last" sort></th> <td>$(last)</td>'+
        '<th column="age" sort></th>  <td>$(age)</td>'+
    '</tr>'+
'</table>'
			);

		var comp = mi2.comp.make(node);

		var data = [
			{name:"John", last:'Doe', age:44},
			{name:"Mary", last:'Blast', age:33}
		];

		// after reading template
// 		expect(comp.el.innerHTML).toEqual(
// '<thead>'+
// '</thead>'+
// '<tbody>'+
// '</tbody>'
// 		);


		//after setting data
		comp.setValue(data);
	});



});
