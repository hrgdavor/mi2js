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
		var div = mi2.add(null, tpl);

		expect(div.attr('my-attr')).toEqual('test');
	});

	it('/ setVisible', function () {
		var tpl = {tag:'DIV', attr:{}, html:''};
		var div = mi2.add(null, tpl);

		expect(div.isVisible()).toBeTruthy();

		div.setVisible(false);
		expect(div.isVisible()).toEqual(false);
		expect(div.el.hasAttribute(mi2.hiddenAttribute)).toEqual(true);
	});

	it('/ setSelected', function () {
		var tpl = {tag:'DIV', attr:{}, html:''};
		var div = mi2.add(null, tpl);

		expect(div.isSelected()).toEqual(false);

		div.setSelected(true);
		expect(div.isSelected()).toEqual(true);
		expect(div.hasClass("selected")).toEqual(true);
	});

	it('/ setHtml', function () {
		var tpl = {tag:'DIV', attr:{}, html:''};
		var div = mi2.add(null, tpl);

		expect(div.el.firstElementChild).toEqual(null);

		div.setHtml('<b>xxx</b>')

		expect(div.el.innerHTML).toEqual('<b>xxx</b>');
		expect(div.el.firstElementChild.tagName).toEqual('B');
	});

	it('/ attrBoolean', function () { 
		var tpl = {tag:'DIV', attr:{as:'Base', 'required':''}, html:'<b p="b1"></b>'};
		var node = mi2.addTag(null, tpl);
		var nw = new mi2(node);

		expect(nw.attrBoolean('required')).toBeTruthy();

		node.setAttribute('required','1');
		expect(nw.attrBoolean('required')).toBeTruthy();

		node.setAttribute('required','0');
		expect(nw.attrBoolean('required')).toBeFalsy();

		node.setAttribute('required','required');
		expect(nw.attrBoolean('required')).toBeTruthy();

		node.setAttribute('required','true');
		expect(nw.attrBoolean('required')).toBeTruthy();

		node.setAttribute('required','false');
		expect(nw.attrBoolean('required')).toBeFalsy();
	});


});