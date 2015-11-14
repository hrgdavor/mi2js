describe( 'validate.js', function () { 
	var mi2 = mi2JS;

	it('/ required', function (){
		var validator = new mi2.Validator({required: true});
		var res = validator.validate();
		expect(res.isValid()).toEqual(false);
	});

	it('/ num', function (){
		var validator = new mi2.Validator({required: true, pattern:'int'});

		expect(validator.validate().isValid()).toEqual(false);
		expect(validator.validate('11x').isValid()).toEqual(false);
		expect(validator.validate('x').isValid()).toEqual(false);
		expect(validator.validate('11').isValid()).toEqual(true);
	});

	it('/ min max', function (){
		var validator = new mi2.Validator({required: true, pattern:'int', min:10, max:20});

		expect(validator.validate().isValid()).toEqual(false);
		expect(validator.validate('11').isValid()).toEqual(true);

		expect(validator.validate('1').isValid()).toEqual(false);
		expect(validator.validate('111').isValid()).toEqual(false);

	});

	it('/ simple Validity', function (){

		expect(new mi2.Validity().isValid()).toEqual(true);

		var val = new mi2.Validity('custom');
		expect(val.message).toEqual('custom');
		expect(val.type).toEqual('custom');
		expect(val.isValid()).toEqual(false);
	});

	it('/ complex Validity', function (){

		var val = new mi2.Validity({message:'custom', type:'newType'});
		expect(val.message).toEqual('custom');
		expect(val.type).toEqual('newType');
		expect(val.isValid()).toEqual(false);
	});

	it('/ group Validity', function (){
		var val = new mi2.GroupValidity({ 
			name: {message:'custom', type:'newType'},
			id: null
		});

		expect(val.isValid()).toEqual(false);
		expect(val.isValid('name')).toEqual(false);
		expect(val.isValid('id')).toEqual(true);

		val = new mi2.GroupValidity({ 
			name: null,
			id: null
		});
		expect(val.isValid()).toEqual(true);
		expect(val.isValid('name')).toEqual(true);
		expect(val.isValid('id')).toEqual(true);
		expect(val.isValid('x')).toEqual(true);

	});


	it('/ simple Validitor', function (){
		var check = new mi2.Validator();

		var val = check.validate(null);
		expect(val.isValid()).toEqual(true);

		check = new mi2.Validator({required: true});

		val = check.validate(null);
		expect(val.isValid()).toEqual(false);
		
	});


});