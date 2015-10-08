describe( 'ajax.js', function () { 
	var mi2 = mi2JS;

	it('/ fetch + callback', function (){
		var callCount = 0;
		var response = null;

		beforeEach(function(done) {
			var callback = function(resp){
				callCount++;
				response = resp;
				done();
			};
			mi2.ajax({url:'/base/spec/test.json', callback: callback });
		});
			
		afterEach(function() {
			expect(response).toBeDefined();
			expect(response.responseText).toEqual('{"name":"test"}');
		});
	});

	it('/ fetch + errback', function (done){
		var errback = jasmine.createSpy('errback');
		mi2.ajax({url:'/base/spec/test2.json', errback: function(){
			errback();
			done();
		} });

		afterEach(function() {
			expect(errback).toHaveBeenCalled();
		});
	});

});