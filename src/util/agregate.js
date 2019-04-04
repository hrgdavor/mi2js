(function(mi2){

	var undef = void 0;
/** utility function to help build agregator definition with plenty of handy defaults.
*/
mi2.makeAgregator = function(def){

	if(def.column){
		if(typeof def.column == 'string'){
			var column = def.column;
			def.column = row=>row[column];
		} 

	}else{
		def.column = row=>1
	}

	if(!def.visit) def.visit = function(){};

	if(!def.done) def.done = function(){};

	if(!def.filter) def.filter = row=>true;

	if(!def.reset){
		var initialValue = def.value;
		def.reset = function(){ this.value = initialValue; }
	}

	return def;
}

mi2.agregator = {
	sum:   (column, filter)=> mi2.makeAgregator({ 
		column,filter,
		visit: function(val){ if(val !== undef) this.value += val; }, 
		value: 0 
	}),
	count: (filter)=> mi2.makeAgregator({
		filter,
		visit: function(val){ if(val !== undef) this.value +=val; }, 
		value: 0 
	}),
	min:   (column, filter)=> mi2.makeAgregator({
		column,filter,
		visit: function(val){ if(val !== undef && (this.value === undef || this.value > val) ) this.value = val; }
	}),
	max:   (column, filter)=> mi2.makeAgregator({
		column,filter, 
		visit: function(val){ if(val !== undef && this.value < val) this.value = val }, 
		value: 0 
	}),
	column:(column, filter)=> mi2.makeAgregator({
		column,filter,
		visit: function(val){ this.value = val },
	}),

};

/** generate grouping key based on columns, by concatenating values into a string

columns example:
  ['direction','service_id','instance_id','queue_id','user_id']

hardcoded version that would give same key:
  row.direction+'/'+row.service_id+'/'+row.instance_id+'/'+row.queue_id+'/'+row.user_id+'/'
*/
mi2.makeGroupKeyFunction = function(columns){
	return function(row){
		ret = '';
		columns.forEach(column=>ret += row[column]+'/');
		return ret;
	}
}

mi2.resetAgregate = function(agrDef){
	for(var p in agrDef) agrDef[p].reset();
}

mi2.runAgregate = function(agrDef, rows){
	for(var p in agrDef){
		var agregator = agrDef[p];
		agregator.reset();
		if(rows && rows.length){
			for(var i=0; i<rows.length; i++){
				mi2.agregateOne(agregator, rows[i]);
			}
		}
		agregator.done();
	}

	return agrDef;
}

/** for arrays just call.
	<code>agrDefArray.map(agrDef=>mi2.getAgregateResult(agrDef));</code>
*/
mi2.getAgregateResult = function(agrDef){
	var result = {};
	for(var p in agrDef){
		result[p] = agrDef[p].value;	
	}
	return result;
}

mi2.agregateOne = function(agregator, row){
	if(agregator.filter(row)) agregator.visit(agregator.column(row));
}

/** for arrays just call.
	<code>groups.map(rows=>mi2.agregate(agrDef, rows));</code>
	agregators are reusable
*/
mi2.agregate = function(agrDef, rows){
	mi2.runAgregate(agrDef, rows);
	return mi2.getAgregateResult(agrDef);
}

mi2.combineResults = function(agrDef, arr){
	for(var p in agrDef){
		var agregator = agrDef[p];
		agregator.reset();
		if(arr && arr.length){
			for(var i=0; i<arr.length; i++){
				agregator.visit(arr[i][p]);
			}
		}
		agregator.done();
	}
	return mi2.getAgregateResult(agrDef);
}

mi2.addComputedColumns = function(conf, row){
	if(conf){
		if(conf instanceof Array){
			conf.forEach(singleConf=>mi2.addComputedColumns(singleConf,row));
			return;
		}
		for(var p in conf){
			row[p] = conf[p](row);
		}
	}
}

mi2.groupRows = function(groupFunc, arr){
	return mi2.objToArray(mi2.mapRows(groupFunc, arr));
}

mi2.mapRow = function(groupFunc, row, groups){
	var groupKey = groupFunc(row);
	groups[groupKey] = groups[groupKey] || []; 
	groups[groupKey].push(row);
	return groupKey;
}

mi2.mapRows = function(groupFunc, arr, groups){
	groups = groups || {};
	arr.forEach( row=>mi2.mapRow(groupFunc, row, groups) );
	return groups;
}

mi2.average = function(total, count){
	return count == 0 ? 0: total / count;
}

mi2.objToArray = function(obj){
	var ret = [];
	for(var p in obj) ret.push(obj[p]);
	return ret;
}

})(mi2JS)