describe( 'filter.js', function () { 
	var mi2 = mi2JS;

	// filter: 'noNull'
	it('/ noNull', function (){
		expect(mi2.filter(null, 'noNull')).toEqual('');
		expect(mi2.filter(1,    'noNull')).toEqual(1);
	});

	// filter: 'fixedStr2'
	it('/ fixedStr2', function (){
		expect(mi2.filter(null, 'fixedStr2')).toEqual('0.00');
		expect(mi2.filter(1,    'fixedStr2')).toEqual('1.00');
	});

	// filter: ['fixedStr',3]
	it('/ fixedStr 3', function (){
		expect(mi2.filter(null, ['fixedStr',3] )).toEqual('0.000');
		expect(mi2.filter(1,    ['fixedStr',3] )).toEqual('1.000');
	});

	// filter: 'intStr'
	it('/ intStr', function (){
		expect(mi2.filter(5.2, 'intStr' )).toEqual('5');
		expect(mi2.filter(5.5, 'intStr' )).toEqual('6');
	});

	// filter: 'trim'
	it('/ trim', function (){
		expect(mi2.filter('5.2', 'trim' )).toEqual('5.2');
		expect(mi2.filter(' aa ', 'trim' )).toEqual('aa');
		expect(mi2.filter(' a   a ', 'trim' )).toEqual('a a');
	});

	function myFunction(value, params){
		return '('+value+')';
	}

	// filter: myFunction
	it('/ myFunction', function (){
		expect(mi2.filter(null, myFunction )).toEqual('(null)');
		expect(mi2.filter(7,    myFunction )).toEqual('(7)');
	});



	// filter: ['noNull','fixedStr',4]
	it('/ noNull + fixedStr', function (){
		expect(mi2.filter(null, ['noNull','fixedStr',4] )).toEqual('');
		expect(mi2.filter(5,    ['noNull','fixedStr',4] )).toEqual('5.0000');
	});

	// filter: ['noNull','intStr']
	it('/ intStr', function (){
		expect(mi2.filter(null, ['noNull','intStr'] )).toEqual('');
		expect(mi2.filter(5.1,  ['noNull','intStr'] )).toEqual('5');
	});

	// filter: ['noNull',myFunction]
	it('/ noNull + myFunction', function (){
		expect(mi2.filter(null, ['noNull',myFunction] )).toEqual('');
		expect(mi2.filter(7,    ['noNull',myFunction] )).toEqual('(7)');
	});



	// filter: ['ifNull','-unknown-']
	it('/ ifNull', function (){
		expect(mi2.filter(null, ['ifNull','-unknown-'] )).toEqual('-unknown-');
		expect(mi2.filter(6,    ['ifNull','-unknown-'] )).toEqual(6);
	});

	// filter: ['ifNull','nope','fixedStr',1]
	it('/ ifNull + fixedStr', function (){
		expect(mi2.filter(null, ['ifNull','nope','fixedStr',1] )).toEqual('nope');
		expect(mi2.filter(7,    ['ifNull','nope','fixedStr',1] )).toEqual('7.0');
	});

	it('/ parse filter', function (){
		expect(mi2.parseFilter('ifNull,nope,fixedStr,1')).toEqual(['ifNull','nope','fixedStr','1']);
		expect(mi2.parseFilter(null)).toEqual(null);
		expect(mi2.parseFilter('ifNull,11')).toEqual(['ifNull','11']);
	});

	

});