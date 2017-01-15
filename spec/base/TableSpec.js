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

        var comp = mi2.makeComp(node);


        // after reading template
        expect(comp.el.innerHTML).toEqual(
'<tbody>'+
'</tbody>'+
'<thead><tr>'+
    '<th column="first" sort=""></th>'+
    '<th column="last" sort=""></th>'+
    '<th column="age" as="Base"></th>'+
'</tr></thead>'
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
'<thead><tr>'+
    '<th column="first" sort=""></th>'+
    '<th column="last" sort=""></th>'+
    '<th column="age" as="Base"></th>'+
'</tr></thead>'
        );

        expect(comp.$columns.item('age') instanceof mi2.getComp('Base')).toBeTruthy(comp.$columns.item('age'));

        var map = comp.columnIndexMap(['first','age']);
        expect(map).toEqual({'2':true, '0':true});

        expect(comp.extractText(comp.item(0), map)).toEqual(['John','44']);
        expect(comp.extractText(comp.item(0), map).join(' ').toLowerCase()).toEqual('john 44');
    });


    it('/ sort ', function (){
        var comp = mi2.makeComp(node);

        expect(comp.getSort()).toEqual({});
        expect(mi2.isEmpty(comp.getSort())).toEqual(true);

        comp.markSort({'first':'ASC', xx:'DESC'}); // xx is not a column, and gets ignored
        expect(comp.getSort()).toEqual({'first':'ASC'});
        expect(mi2.isEmpty(comp.getSort())).toEqual(false);

        expect(comp.$columns.item('first').attr('sort')).toEqual('ASC');

        comp.markSort({}); // clear sort
        expect(mi2.isEmpty(comp.getSort())).toEqual(true);
    });

    it('/ not sortable ', function (){
        var comp = mi2.makeComp(node);

        expect(comp.getSort()).toEqual({});
        expect(mi2.isEmpty(comp.getSort())).toEqual(true);

        comp.markSort({'age':'ASC'}); // age is not sortable, and gets ignored
        expect(comp.getSort()).toEqual({});
        expect(mi2.isEmpty(comp.getSort())).toEqual(true);

        comp.markSort({'first':'ASC'}); // age is not sortable, and gets ignored
        expect(comp.$columns.item('first').attr('sort')).toEqual('ASC');

    });

    it('/ column index ', function (){
        var comp = mi2.makeComp(node);
        
        expect(comp.columnIndex('first')).toEqual(0);
        expect(comp.columnIndex('last')).toEqual(1);
        expect(comp.columnIndex('age')).toEqual(2);

        comp.hideColumns('last');

        expect(comp.columnIndex('first')).toEqual(0);
        expect(comp.columnIndex('last')).toEqual(-1);
        expect(comp.columnIndex('age')).toEqual(1);

        expect(comp.columnIndexMap(['age'])).toEqual({'1':true});
        expect(comp.columnIndexMap(['first','age'])).toEqual({'1':true, '0':true});
    });

});
