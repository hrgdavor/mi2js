describe( 'base/Table.js', function () {
	var mi2 = mi2JS;
	mi2.addFormatter('ageTest', function(value){ return value+'--'});

	it('/ basic ', function (){
		var node = mi2.addTag(null, { tag: 'TABLE', attr:{as:'base/Table'},
            html:
    '<tr>'+
        '<th column="first" sort></th><td gender="${gender}">${first}</td>'+
        '<th column="last" sort></th><td>${last}</td>'+
        '<th column="age" sort></th><td>${age}</td>'+
    '</tr>'
			});

		var comp = mi2.comp.make(node);

		var data = [
			{first:"John", last:'Doe',   age:44, gender:'M'},
			{first:"Mary", last:'Blast', age:33, gender:'F'}
		];

		// after reading template
		expect(comp.el.innerHTML).toEqual(
'<tbody>'+
'</tbody>'+
'<thead>'+
    '<th column="first" sort=""></th>'+
    '<th column="last" sort=""></th>'+
    '<th column="age" sort=""></th>'+
'</thead>'
		);

		expect(comp.itemTpl.html).toEqual('<td gender="${gender}">${first}</td><td>${last}</td><td>${age}</td>');

		//after setting data
		comp.setValue(data);

		expect(comp.el.innerHTML).toEqual(
'<tbody>'+
    '<tr as="base/Tpl">'+
        '<td gender="M">John</td>'+
        '<td>Doe</td>'+
        '<td>44</td>'+
    '</tr>'+
    '<tr as="base/Tpl">'+
        '<td gender="F">Mary</td>'+
        '<td>Blast</td>'+
        '<td>33</td>'+
    '</tr>'+
'</tbody>'+
'<thead>'+
    '<th column="first" sort=""></th>'+
    '<th column="last" sort=""></th>'+
    '<th column="age" sort=""></th>'+
'</thead>'
		);

	});



});
