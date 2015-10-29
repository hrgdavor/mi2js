describe( 'template.js', function () {
	var mi2 = mi2JS;

	it('/ create', function (){
		var mc = mi2.addComp(null, {tag:'DIV', attr:{as:'base/MultiCheck'} } );

		mc.setConfig({a:'A',b:'B'});
		expect(mc.el.innerHTML).toEqual('<b data-id="a">A</b><b data-id="b">B</b>');
	});

	it('/ setValue', function (){
		var mc = mi2.addComp(null, {tag:'DIV', attr:{as:'base/MultiCheck'} } );

		mc.setConfig({a:'A',b:'B'});
		expect(mc.el.innerHTML).toEqual('<b data-id="a">A</b><b data-id="b">B</b>');

		mc.setValue(['a']);
		expect(mc.items['a'].isSelected()).toEqual(true);
		expect(mc.el.innerHTML).toEqual('<b data-id="a" class="selected">A</b><b data-id="b">B</b>');

		expect(mc.getValue()).toEqual(['a']);
	});

	it('/ single-value', function (){
		var mc = mi2.addComp(null, {tag:'DIV', attr:{as:'base/MultiCheck', 'single-value':'1'} } );

		mc.setConfig([ {id:'a',text:'A'},{id:'b',text:'B'} ]);
		expect(mc.el.innerHTML).toEqual('<b data-id="a">A</b><b data-id="b">B</b>');

		mc.setValue('a');
		expect(mc.items['a'].isSelected()).toEqual(true);
		expect(mc.el.innerHTML).toEqual('<b data-id="a" class="selected">A</b><b data-id="b">B</b>');

		expect(mc.getValue()).toEqual('a');

	});

});