describe( 'formatter.js', function () { 
	var mi2 = mi2JS;

	// format: 'noNull'
	it('/ noNull', function (){
		expect(mi2.format(null, 'noNull')).toEqual('');
		expect(mi2.format(1,    'noNull')).toEqual(1);
	});

	// format: 'fixedStr2'
	it('/ fixedStr2', function (){
		expect(mi2.format(null, 'fixedStr2')).toEqual('0.00');
		expect(mi2.format(1,    'fixedStr2')).toEqual('1.00');
	});

	// format: ['fixedStr',3]
	it('/ fixedStr 3', function (){
		expect(mi2.format(null, ['fixedStr',3] )).toEqual('0.000');
		expect(mi2.format(1,    ['fixedStr',3] )).toEqual('1.000');
	});

	// format: 'intStr'
	it('/ intStr', function (){
		expect(mi2.format(5.2, 'intStr' )).toEqual('5');
		expect(mi2.format(5.5, 'intStr' )).toEqual('6');
	});

	function myFunction(value, params){
		return '('+value+')';
	}

	// format: myFunction
	it('/ myFunction', function (){
		expect(mi2.format(null, myFunction )).toEqual('(null)');
		expect(mi2.format(7,    myFunction )).toEqual('(7)');
	});



	// format: ['noNull','fixedStr',4]
	it('/ noNull + fixedStr', function (){
		expect(mi2.format(null, ['noNull','fixedStr',4] )).toEqual('');
		expect(mi2.format(5,    ['noNull','fixedStr',4] )).toEqual('5.0000');
	});

	// format: ['noNull','intStr']
	it('/ intStr', function (){
		expect(mi2.format(null, ['noNull','intStr'] )).toEqual('');
		expect(mi2.format(5.1,  ['noNull','intStr'] )).toEqual('5');
	});

	// format: ['noNull',myFunction]
	it('/ noNull + myFunction', function (){
		expect(mi2.format(null, ['noNull',myFunction] )).toEqual('');
		expect(mi2.format(7,    ['noNull',myFunction] )).toEqual('(7)');
	});



	// format: ['ifNull','-unknown-']
	it('/ ifNull', function (){
		expect(mi2.format(null, ['ifNull','-unknown-'] )).toEqual('-unknown-');
		expect(mi2.format(6,    ['ifNull','-unknown-'] )).toEqual(6);
	});

	// format: ['ifNull','nope','fixedStr',1]
	it('/ ifNull + fixedStr', function (){
		expect(mi2.format(null, ['ifNull','nope','fixedStr',1] )).toEqual('nope');
		expect(mi2.format(7,    ['ifNull','nope','fixedStr',1] )).toEqual('7.0');
	});

	it('/ parse format', function (){
		expect(mi2.parseFormat('ifNull,nope,fixedStr,1')).toEqual(['ifNull','nope','fixedStr','1']);
		expect(mi2.parseFormat(null)).toEqual(null);
		expect(mi2.parseFormat('ifNull,11')).toEqual(['ifNull','11']);
	});

});