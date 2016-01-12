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
		var TR    = findOrAdd(THEAD, 'TR');
		var TBODY = this.TBODY = findOrAdd(el, 'TBODY');

		this.listen(TBODY,'click',this.on_clickTbody);
		this.listen(THEAD,'click',this.on_clickThead);

		// extract header cell if defined together in body
		var it = TBODY.getElementsByTagName('TH');
		var arr = [];
		for(var i=0; i<it.length;i++){
			arr.push(it[i]);
		}

		// move them to THEAD
		for(var i=0; i<arr.length; i++) TR.appendChild(arr[i]);

		var cells = TBODY.getElementsByTagName('TD');
		if(!cells.length){
			console.error('Table has no columns defined ');
			console.log('table', this);
		} 
		var cellTpl = [];
		for(var i=0; i<cells.length; i++){
			cellTpl[i] = cells[i].outerHTML;
		}

		superProto.construct.call(this, el, tpl, parent);

		var columns = {}, column;
		this.columns = [];
		arr = TR.children;
		// create Group for columns, by collecting each TH with "column" attribute
		for(var i=0; i<arr.length; i++){
			var colName = arr[i].getAttribute('column') || 'column'+i;
			var column = this.findRef(arr[i]);
			column.__index = i;
			column.cellTpl = cellTpl[i] || '';
			columns[colName] = column;
			this.columns.push(column);
		}
		this.$columns = new $.NWGroup(columns);
	};

	proto.on_clickThead = function(evt){
	};

	proto.on_clickTbody = function(evt){
		var evtName, action, TR, TD, comp;
		var el = evt.target;
		while(el.tagName != 'TBODY'){
			comp = el.getAttribute('as');
			if(comp && !(comp == 'base/Tpl' || comp =='Base' )) return; // do not mess with other components

			if(el.tagName == 'TD' || el.tagName == 'TR'){
				evtName = evtName || el.getAttribute('event');
				action  = action  || el.getAttribute('action');
			}
			if(el.tagName == 'TD') TD = el;
			if(el.tagName == 'TR') { TR = el; break;};
			el = el.parentNode;
		}

		if(TR && this.parent.fireEvent){
			this.parent.fireEvent(evtName || 'rowClick',{
				action:action,
				domEvent: evt, 
				src:this,
				eventFor: 'parent',
				tr:TR,
				td:TD
			});
		}
		evt.stop();
		return false;
	};

	proto.columnIndex = function(colName){
		var column = this.$columns.item(colName);
		return column ? column.__index : -1;
	};

	proto.columnIndexMap = function(cols){
		var ret = {};
		for (var i = cols.length - 1; i >= 0; i--) {
			ret[ this.columnIndex(cols[i])] = true;
		};
		return ret;
	};

	proto.extractText = function(row, colMap){
		var ret = [];
		if(row instanceof $) row = row.el;
		var i=0, el=row.firstElementChild;

		while(el){
			if(colMap[i]) ret.push(el.textContent);
			i++;
			el = el.nextElementSibling;
		}

		return ret;
	}

	proto.getCol = function(row, index){
		if(typeof index == 'string') index = this.columnIndex(index);

		if(row instanceof $) row = row.el;
		var i=0, el=row.firstElementChild;

		while(el){
			if(i == index) return el;
			i++;
			el = el.nextElementSibling;
		}
	}

	proto.hideColumns = function(){
		this.$columns.forSome(arguments, function(item, code){
			item.setVisible(false); 
		});
		this.rebuild();
	};

	proto.rebuild = function(){
		var html = '', columns = this.columns;
		var j=0;
		for(var i=0; i<columns.length; i++){
			if(columns[i].isVisible()){
				html += columns[i].cellTpl;
				columns[i].__index = j;
				j++;
			}else{
				columns[i].__index = -1;
			}
		}
		this.itemTpl.html = html;
	};

	proto.markSort = function(def){
		this.$columns.forEach(function(item, code){
			// without this condition, columns that were not sortable 
			// would become sortable by setting the sort attribute
			if(item.hasAttr('sort')) 
				item.attr('sort', def[code] || '');
		}); 
	};

	proto.getSort = function(def){
		return this.$columns.forEachGetObject(function(item, code){
			return item.attr('sort') || void 0;
		}); 
	};


	function findOrAdd(el,tag){
		var ch = $.find(tag, el);
		return ch ? ch : $.addTag(el, tag);
	}

	proto.findItemsArea = function(el){ return this.TBODY; };   

});
