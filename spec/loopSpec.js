describe( 'base/Loop.js', function () {
	var mi2 = mi2JS;
	mi2.addFormatter('loopTest', function(value){ return value+'--'});

	it('/ basic ', function (){
		var node = mi2.addHtml(null,
'<div as="base/Loop">'+
    '<div as="base/Template">Name: ${name}, Last: ${last}</div>'+
'</div>'
			);

		var comp = mi2.comp.make(node);

		var data = [
			{name:"John", last:'Doe', age:44},
			{name:"Mary", last:'Blast', age:33}
		];

		comp.setValue(data);

		expect(comp.items.length).toEqual(2);
		expect(comp.el.innerHTML).toEqual(
'<div as="base/Template">Name: John, Last: Doe</div>'+
'<div as="base/Template">Name: Mary, Last: Blast</div>'
		);
	});

});
