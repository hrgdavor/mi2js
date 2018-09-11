describe( 'base/Dialog.js', function () { 
	var $ = mi2= mi2JS;
	var h = mi2.h;
	
	// translation implementation
	var TRANS = {name:'Name', title:'Title', content:'Content', ok:'OK', cancel:'Cancel'};
	function t(code){ return TRANS[code] ||code;}

    function makeDialog(){
		var node = mi2.addTag(null, { tag: 'DIV', attr:{as:'base/Dialog'} });
		return mi2.makeComp(node);    	
    }

	it(' / template', function () {
		var dialog = makeDialog()

		expect(dialog.el.innerHTML).toEqual('<div class="dialog-inner"> '
			+'<div class="dialog-title" p="title"></div> '
			+'<div class="dialog-content" p="content"></div> '
			+'<div class="dialog-buttons" p="buttons" as="base/Loop">'
			+'</div> '
			+'</div>'
			);
	});

	it(' / buttons', function () {
		var dialog = makeDialog()

		dialog.show({buttons:[{action:'ok'}]});

		expect(dialog.buttons.el.innerHTML).toEqual(''
			+'<button as="base/Button" event="close" action="ok">ok</button>'
		);

		dialog.show({});

		expect(dialog.buttons.el.innerHTML).toEqual(''
			+'<button as="base/Button" event="close" action="ok">ok</button>'
			+'<button as="base/Button" event="close" action="cancel">cancel</button>'
		);

	});

	it(' / title', function () {
		var dialog = makeDialog()

		dialog.show({title:'Title'});

		expect(dialog.title.el.innerHTML).toEqual('Title');
	});

	it(' / content', function () {
		var dialog = makeDialog()

		dialog.show({content:'Content'});

		expect(dialog.content.el.innerHTML).toEqual('Content');
	});

	it(' / content node', function () {
		var dialog = makeDialog()
		var node = mi2.addTag(null, { tag: 'DIV', attr:{as:'base/Button'} });

		dialog.show({content:node});

		expect(dialog.content.el.innerHTML).toEqual('<div as="base/Button"></div>');
	});

});