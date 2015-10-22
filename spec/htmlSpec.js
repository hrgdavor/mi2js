describe( 'html.js', function () { 
	var mi2 = mi2JS;

	it('/ addTag', function () { 
		var tpl = {tag:'DIV', attr:{as:'Base', 'class':'test'}, html:'<b p="b1"></b>'};
		var node = mi2.addTag(null, tpl);

		expect(node.getAttribute('as')).toEqual('Base');
		expect(node.innerHTML).toEqual('<b p="b1"></b>');
		expect(node.className).toEqual('test');
	});

	it('/ toTemplate', function () { 
		var tpl = {tag:'DIV', attr:{as:'Base', 'class':'test'}, html:'<b p="b1"></b>'};
		var node = mi2.addTag(null, tpl);

		expect(mi2.toTemplate(node)).toEqual(tpl);
	});

	it('/ attr', function () { 
		var tpl = {tag:'DIV', attr:{as:'Base', 'my-attr':'test'}, html:''};
		var div = mi2(mi2.addTag(null, tpl));

		expect(div.attr('my-attr')).toEqual('test');
	});

	it('/ setVisible', function () {
		var tpl = {tag:'DIV', attr:{}, html:''};
		var div = mi2(mi2.addTag(null, tpl));

		expect(div.isVisible()).toBeTruthy();

		div.setVisible(false);
		expect(div.isVisible()).toEqual(false);
		expect(div.el.hasAttribute(mi2.hiddenAttribute)).toEqual(true);
	});

	it('/ setHtml', function () {
		var tpl = {tag:'DIV', attr:{}, html:''};
		var div = mi2(mi2.addTag(null, tpl));

		expect(div.el.firstElementChild).toEqual(null);

		div.setHtml('<b>xxx</b>')

		expect(div.el.innerHTML).toEqual('<b>xxx</b>');
		expect(div.el.firstElementChild.tagName).toEqual('B');
	});

});