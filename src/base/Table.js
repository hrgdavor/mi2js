mi2JS.comp.add('base/Table', 'base/Loop', '',

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


	comp.constructor = function(el, tpl, parent){
		var THEAD = this.THEAD = findOrAdd(el, 'THEAD');
		var TBODY = this.TBODY = findOrAdd(el, 'TBODY');

		// extract header cell if defined together in body
		var it = TBODY.getElementsByTagName('TH');
		var arr = [];
		for(var i=0; i<it.length;i++){
			var th = it[i];
			var colName = th.getAttribute('column');
			arr.push(th);
		}

		// move them to THEAD
		for(var i=0; i<arr.length; i++) THEAD.appendChild(arr[i]);

		superClass.constructor.call(this, el, tpl, parent);
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
