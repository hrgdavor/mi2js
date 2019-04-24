describe( 'util/agregate.js', function () { 
	var mi2 = mi2JS;
	var agr = mi2.agregatorFunc;

	var filterMale = row=>row.sex == 'M';
	var filterFemale = row=>row.sex == 'F';
	
	var agrDef = new mi2.Agregator().withFields({
		count: agr.count(), 
		count_m: agr.count(filterMale), 
		count_f: agr.count(filterFemale),
		exp_total: agr.sum('exp'), 
		exp_min: agr.min('exp'), 
		exp_max: agr.max('exp'), 
		exp_total_m: agr.sum('exp', filterMale), 
		exp_total_f: agr.sum('exp', filterFemale), 
	});

	var rows = [
		{sex: 'M', age: 22, exp: 50 },
		{sex: 'M', age: 43, exp: 81 },
		{sex: 'F', age: 28, exp: 30 },
		{sex: 'F', age: 39, exp: 62 },
		{sex: 'F', age: 53, exp: 61 },
	];

	it('/ agregate', function () { 
		var result = agrDef.agregate(rows);

		expect(result.count).toEqual(5);
		expect(result.count_m).toEqual(2);
		expect(result.count_f).toEqual(3);
		
		expect(result.exp_total).toEqual(284);
		expect(result.exp_total_m).toEqual(131);
		expect(result.exp_total_f).toEqual(153);
		
		expect(result.exp_min).toEqual(30);
		expect(result.exp_max).toEqual(81);

	});


	it('/ compute', function () { 
		var result = agrDef.agregate(rows);

		var computeConf = {
			exp_avg: row=>row.count ? row.exp_total/row.count:0
		}

		agrDef.addComputed(result,[computeConf]);

		expect(result.exp_avg).toEqual(56.8);
	});

	it('/ compute multi', function () { 
		var result = agrDef.agregate(rows);

		var computeConf = [{
			exp_avg: row=>row.count ? row.exp_total/row.count:0
		},{
			exp_avg_f: row=>row.count_f ? row.exp_total_f/row.count_f:0
		}]

		agrDef.addComputed(result, computeConf);

		expect(result.exp_avg).toEqual(56.8);
		expect(result.exp_avg_f).toEqual(51);
	});

	it('/ combine', function () { 
		var result1 = agrDef.agregate(rows);
		var result2 = agrDef.agregate([]);

		var result = agrDef.combine([result2, result1]);

		expect(result.count).toEqual(5);
		expect(result.count_m).toEqual(2);
		expect(result.count_f).toEqual(3);
		
		expect(result.exp_total).toEqual(284);
		expect(result.exp_total_m).toEqual(131);
		expect(result.exp_total_f).toEqual(153);
		
		expect(result.exp_min).toEqual(30);
		expect(result.exp_max).toEqual(81);		
	});


	function logObj(obj){
		for(var p in obj) console.log(p, obj[p]);
	}

});