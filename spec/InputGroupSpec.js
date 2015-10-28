describe( 'InputGroup.js', function () { 
	var mi2 = mi2JS;

	it('/ with or WO new ', function (){
		var v1 = mi2.InputGroup({});
		var v2 = new mi2.InputGroup({});

		// check if function is implemented so that it returns "new func(...)" when called without "new"

		expect( v1 instanceof mi2.InputGroup ).toBeTruthy();
		expect( v2 instanceof mi2.InputGroup ).toBeTruthy();
	});

});