
mi2JS.comp.add('base/FilteredTable', 'base/Table', 'extend:',

// component initializer function that defines constructor and adds methods to the prototype 
function(comp, proto, superClass){

	var mi2 = mi2JS;

	comp.constructor = function(el, tpl, parent){
		superClass.constructor.call(this, el, tpl, parent);
		this.columns = this.attr('search-columns','name').split(',');
	};

	proto.buildSearch = function(data){
		var str = '';
		for(var i in this.columns) str += data[this.columns[i]]+'/';

		data.searchStr = str.toLowerCase();
	}

	proto.update = function(r){
		var data = this.rows = r.data || [];
		for(var i in data){
			this.buildSearch(data[i]);
		}
		this.dofilter();
	};

	proto.setfilter = function(f){
		this.filterStr = (f || '').toLowerCase().trim();
		this.dofilter();
	}

	proto.dofilter = function(){
		var data = this.rows;
		if(this.filterStr){
			var filters = this.filterStr.split(' ');
			var tmp = [];
			if(filters.length >1){
				// multiple word search
				for(var i in data){
					var hasAll = true;
					for(var j in filters){
						if(data[i].searchStr.indexOf(filters[j]) == -1) hasAll = false;
					}
					if(hasAll)tmp.push(data[i]);
				}
			}else{
				for(var i in data) if(data[i].searchStr.indexOf(this.filterStr) != -1) tmp.push(data[i]);
			}
				data = tmp;				
		}

		superClass.prototype.update.call(this, {data:data, offset:0, totalrows:data.length});
	};

});
