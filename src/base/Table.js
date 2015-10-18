mi2JS.comp.add('base/Table', 'Base', '',

/**

*/

// component initializer function that defines constructor and adds methods to the prototype 
function(comp, proto, superClass){
	
	var $ = mi2JS;

	proto.itemTpl = {
		tag:'TR',
		attr: { as: 'base/Tpl' },
		html: ''
	};

	function findOrAdd(el,tag){
		var ch = $.find(tag, el);
		return ch ? ch : $.addTag(el, tag);
	}

	function defComp(el, def){
		if(!el.getAttribute('as')) el.setAttribute('as',def.getAttribute('as'));		
	}

	comp.constructor = function(el, tpl, parent){
		var THEAD = this.THEAD = findOrAdd(el, 'THEAD');
		var TBODY = this.TBODY = findOrAdd(el, 'TBODY');

		// var opts = this.opts = { sortable: 0};
		// var cols = opts.columns = {};

		// var templateColumns

		// extract header cell info form inline html
		var it = el.getElementsByTagName('TH');
		for(var i=0; i<it.length;i++){
			var th = it[i];
			var colName = th.getAttribute('column');
			console.log(colName, th);
			THEAD.appendChild(th);
		}

		superClass.constructor.call(this, el, tpl, parent);
	};

	proto.findItemsArea = function(el){ return this.TBODY };	

	proto.makeTh = function(col){
		var node = mi2.addTag(this.THEAD, 'TH', '');
		var comp = mi2.comp.make(node, null, this);
	};

	proto.setValue = function(data){

	};

});
