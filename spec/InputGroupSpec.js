describe( 'FormHandler.js', function () { 
	var mi2 = mi2JS;

	it('/ fetch + callback', function (){
		var v1 = mi2.FormHandler({});
		var v2 = new mi2.FormHandler({});

		// check if function is implemented so that it returns "new func(...)" when called without "new"

		expect( v1 instanceof mi2.FormHandler ).toBeTruthy();
		expect( v2 instanceof mi2.FormHandler ).toBeTruthy();
	});

});