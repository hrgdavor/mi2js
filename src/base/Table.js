mi2JS.comp.add('base/Table', 'base/Loop', '',

/**

*/

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){
	
	var $ = mi2JS;

	proto.itemTpl = {
		tag:'TR',
		attr: { as: 'base/Tpl' },
		html: ''
	};


	proto.construct = function(el, tpl, parent){
		var THEAD = this.THEAD = findOrAdd(el, 'THEAD');
		var TBODY = this.TBODY = findOrAdd(el, 'TBODY');

		// extract header cell if defined together in body
		var it = TBODY.getElementsByTagName('TH');
		var arr = [];
		for(var i=0; i<it.length;i++){
			arr.push(it[i]);
		}

		// move them to THEAD
		for(var i=0; i<arr.length; i++) THEAD.appendChild(arr[i]);

		superProto.construct.call(this, el, tpl, parent);

		var columns = {};
		// create Group for columns, by collecting each TH with "column" attribute
		for(var i=0; i<arr.length; i++){
			var colName = arr[i].getAttribute('column');
			if(colName){
				if(arr[i].hasAttribute('as') || arr[i].hasAttribute('p')){
					// it is a NodeWrapper/Component, and is inside this.children
					columns[colName] = this.findComp(arr[i]);
				}else { // create new NodeWrapper
					columns[colName] = new $(arr[i]);
				}
			}
		}
		this.columns = new $.NWGroup(columns);
	};

	proto.markSort = function(def){
		this.columns.forEach(function(item, code){
			// without this condition, columns that were not sortable 
			// would become sortable by setting the sort attribute
			if(item.hasAttr('sort')) 
				item.attr('sort', def[code] || '');
		});	
	};

	proto.getSort = function(def){
		return this.columns.forEachGetObject(function(item, code){
			return item.attr('sort') || void 0;
		});	
	};


	function findOrAdd(el,tag){
		var ch = $.find(tag, el);
		return ch ? ch : $.addTag(el, tag);
	}

	proto.findItemsArea = function(el){ return this.TBODY; };	

	proto.makeTh = function(col){
		var node = mi2.addTag(this.THEAD, 'TH', '');
		var comp = mi2.comp.make(node, null, this);
	};

});
