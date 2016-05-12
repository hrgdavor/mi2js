describe( 'base/MultiInput.js', function () {
	var mi2 = mi2JS;

	function makeSample(){
		return mi2.addComp(null, {
			tag:'DIV', 
			attr:{as:'base/MultiInput'}, 
			html:'<input as="base/Input">' 
		});
	};

	function makeSampleWithFilters(){
		return mi2.addComp(null, {
			tag:'DIV', 
			attr:{as:'base/MultiInput','in-filter':'split','out-filter':'join'}, 
			html:'<input as="base/Input">' 
		});
	};
	// it('/ create', function (){
	// 	var m = makeSample();
	// 	expect(m.getItems().length).toEqual(1);
	// });

	// it('/ setValue', function (){
	// 	var m = makeSample();
	// 	m.setValue(['a']);

	// 	expect(m.getItems().length).toEqual(2);
	// 	expect(m.getItems()[0].getValue()).toEqual('a');
	// 	expect(m.getValue()).toEqual(['a']);
	// });

	// it('/ change push', function (){
	// 	var m = makeSample();
	// 	m.getItems()[0].inp.value = 'a';
	// 	m.getItems()[0].fireIfChangedNow();

	// 	expect(m.getItems().length).toEqual(2);
	// 	expect(m.getItems()[0].getValue()).toEqual('a');
	// 	expect(m.getValue()).toEqual(['a']);
	// });

	// it('/ change remove', function (){
	// 	var m = makeSample();
	// 	m.setValue(['a','b']);
	// 	expect(m.getItems().length).toEqual(3);
	// 	expect(m.getValue()).toEqual(['a','b']);

	// 	// if last 2 are empty, last one is removed
	// 	m.getItems()[1].inp.value = '';
	// 	m.getItems()[1].fireIfChangedNow();

	// 	expect(m.getItems().length).toEqual(2);
	// 	expect(m.getValue()).toEqual(['a']);
	// });

	it('/ filtering', function (){
		var m = makeSampleWithFilters();

		m.setValue('a,b');

		expect(m.getValue()).toEqual('a,b');
		expect(m.getItems().length).toEqual(3);

		m.getItems()[2].inp.value = 'c';

		expect(m.getValue()).toEqual('a,b,c');

		m.getItems()[2].fireIfChangedNow();
		expect(m.getItems().length).toEqual(4);
	});

});