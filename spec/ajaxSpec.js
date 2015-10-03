describe( 'ajax.js', function () { 
	var mi2 = mi2JS;

	it('/ fetch + callback', function (done){
		var callCount = 0;
		var response = null;

		var callback = function(resp){
			callCount++;
			response = resp;
			done();
		};
		mi2.ajax({url:'/base/spec/test.json', callback: callback });

		// waitsFor(function() {
		// 	return callCount > 0;
		// }, "The Ajax call timed out.", 1000);

		// runs(function(){
		afterEach(function() {
			expect(response).toBeDefined();
			expect(response.responseText).toEqual('{"name":"test"}');
		});
	});

	it('/ fetch + errback', function (done){
		var errback = jasmine.createSpy();
		mi2.ajax({url:'/base/spec/test2.json', errback: function(){
			errback();
			done();
		} });
		// waitsFor(function(){
		// 	return errback.callCount > 0;
		// }, "The Ajax call timed out.", 1000);

		// runs(function() {
		afterEach(function() {
			expect(errback).toHaveBeenCalled();
		});
	});

});