describe( 'base/Table.js', function () {
	var mi2 = mi2JS;
	mi2.addFilter('ageTest', function(value){ return value+'--'});

    var data = [
        {first:"John", last:'Doe',   age:44, gender:'M'},
        {first:"Mary", last:'Blast', age:33, gender:'F'}
    ];
    var node;

    beforeEach( function (){
        node = mi2.addTag(null, { tag: 'TABLE', attr:{as:'base/Table'},
            html:
    '<tr>'+
        '<th column="first" sort></th><td gender="${gender}">${first}</td>'+
        '<th column="last" sort></th><td>${last}</td>'+
        '<th column="age" as="Base"></th><td>${age}</td>'+
    '</tr>'
            });
    });



    it('/ basic ', function (){

        var comp = mi2.comp.make(node);


        // after reading template
        expect(comp.el.innerHTML).toEqual(
'<tbody>'+
'</tbody>'+
'<thead>'+
    '<th column="first" sort=""></th>'+
    '<th column="last" sort=""></th>'+
    '<th column="age" as="Base"></th>'+
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
    '<th column="age" as="Base"></th>'+
'</thead>'
        );

        expect(comp.columns.item('age') instanceof mi2.comp.get('Base')).toBeTruthy();

    });


    it('/ sort ', function (){
        var comp = mi2.comp.make(node);

        expect(comp.getSort()).toEqual({});
        expect(mi2.isEmpty(comp.getSort())).toEqual(true);

        comp.markSort({'first':'ASC', xx:'DESC'}); // xx is not a column, and gets ignored
        expect(comp.getSort()).toEqual({'first':'ASC'});
        expect(mi2.isEmpty(comp.getSort())).toEqual(false);

        expect(comp.columns.item('first').attr('sort')).toEqual('ASC');

        comp.markSort({}); // clear sort
        expect(mi2.isEmpty(comp.getSort())).toEqual(true);
    });

    it('/ not sortable ', function (){
        var comp = mi2.comp.make(node);

        expect(comp.getSort()).toEqual({});
        expect(mi2.isEmpty(comp.getSort())).toEqual(true);

        comp.markSort({'age':'ASC'}); // age is not sortable, and gets ignored
        expect(comp.getSort()).toEqual({});
        expect(mi2.isEmpty(comp.getSort())).toEqual(true);

        comp.markSort({'first':'ASC'}); // age is not sortable, and gets ignored
        expect(comp.columns.item('first').attr('sort')).toEqual('ASC');

    });

});
