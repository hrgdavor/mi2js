describe( 'GroupHandler.js', function () { 
	var mi2 = mi2JS;

	it('/ fetch + callback', function (){
		var v1 = mi2.GroupHandler({});
		var v2 = new mi2.GroupHandler({});

		// check if function is implemented so that it returns "new func(...)" when called without "new"
		expect( v1 instanceof mi2.GroupHandler ).toBeTruthy();
		expect( v2 instanceof mi2.GroupHandler ).toBeTruthy();
	});

});