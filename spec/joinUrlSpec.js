describe( 'joinUrl.js', function () { 
	var mi2 = mi2JS;

	it('/ empty', function (){
		expect(mi2.joinUrl({})).toEqual('');
		expect(mi2.joinUrl({x:null})).toEqual('');
	});

	it('/ sammple', function (){
		expect(mi2.joinUrl({x:1})).toEqual('x=1');
		expect(mi2.joinUrl({x:1,y:2})).toEqual('x=1&y=2');
	});

	it('/ array', function (){
		expect(mi2.joinUrl({x:1,y:[1,2,3]})).toEqual('x=1&y=1&y=2&y=3');
	});
});