mi2JS.comp.add('base/List', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(comp, proto, superClass){
	
	var mi2 = mi2JS;
	var $ = mi2.wrap;

	comp.constructor = function(el, tpl, parent){
		superClass.constructor.call(this, el, tpl, parent);

		this.itemComp  = this.attr('item-comp','Base');
		this.itemTag   = this.attr('item-tag');
		this.itemId    = this.attr('item-id',  'id');
		this.itemTpl   = ''; 
		this.itemAttr  = {'class':this.attr('item-class','')};
		// additional functions to override the default component 
		// (small tweaks only, otherwise make a new component)
		this.itemExtend = {};

		// support for components with inline template
		if(!this.itemTag){
			var ch = el.firstChild;
			while(ch && ! ch.tagName) ch=ch.nextSibling;
			if(ch && ch.tagName){
				var attr = ch.attributes;
				if(attr){
					for(var i=0; i<attr.length; i++) {
						if(attr[i].value)
							this.itemAttr[attr[i].name] = attr[i].value;
					}
				}
				this.itemComp = this.itemAttr['as'] || mi2.comp.tags[ch.tagName] || 'Base';
				this.itemTag = ch.tagName;
				this.itemTpl = ch.innerHTML;
				el.removeChild(ch);
			}else // default tag
				this.itemTag = 'DIV';
		}


		var noDataText = this.attr('no_data');
		if(noDataText){
			this.noData = $(mi2.addTag(el,'DIV','hidden noData'));
			this.noData.el.innerHTML = t(noDataText);            
		}
		this.items = [];
		this.count = 0;
		if(this.attr('reorder')) this.enableReorder();
	};

	proto.extendItem = function(ext){
		this.itemExt = ext;
	};

	proto.enableReorder = function(){
		this.reorder = new Reorder(this.el,{onstop:util.bind(this,this.reorderStop)});
	};

	proto.reorderStop = function(evt){
		var i=0;
		var div = mi2.child(this.el,'DIV');
		var tmp = this.items; this.items = [];
		while(div){
			var item = tmp[div.index];
			if(item){
				this.items[i] = item;
				div.index = i;
				i++;
			}
			div = mi2.next(div, 'DIV');
		}
	};

	proto.setValue = function(arr){
		arr = arr || [];
		for(var i=0; i<arr.length; i++){
			this.setItem(arr[i],i);
		}
		this.count = arr.length;
		if(this.noData) this.noData.setVisible(!this.count);

		for(var i=arr.length; i<this.items.length; i++){
			this.items[i].setVisible(false);
		}
	};

	proto.getItem = function(id){
		var data;
		for(var i=0; i<this.count; i++){
			data = this.items[i].getValue();
			if(data[this.itemId] == id) return this.items[i]; 
		}
	};
	
	proto.updateItem = function(newData){
		var data;
		for(var i=0; i<this.count; i++){
			data = this.items[i].getValue();
			if(data[this.itemId] == newData[this.itemId]) this.setItem(newData,i); 
		}
	};

	function getValue(){
		return this.data;
	}
	
	proto.makeItem = function(list, newData,i, tagName){
		var node = mi2.addTag(list.el, tagName || this.itemTag, '');
		node.innerHTML = list.itemTpl;
		for(var p in list.itemAttr) node.setAttribute(p, list.itemAttr[p]);
		var comp = mi2.comp.make(node, list.itemComp, list);
		if(this.itemExt) mi2.update(comp,this.itemExt);
		return comp;
	};

	proto.setItem = function(newData,i){
		if(this.items.length <= i){
			this.items[i] = this.makeItem(this, newData, i, this.itemTag);
			if(!this.items[i].getValue) this.items[i].getValue = getValue;
		}
		this.items[i].data = newData;
		this.items[i].el.index = i;
		this.items[i].setValue(newData);
		this.items[i].setVisible(true);
	};
 
	proto.getItemHeight = function(){
		return this.items[0].el.offsetHeight;
	};

	proto.remove = function(removeData){
		var arr = [];
		var data;
		for(var i=0; i<this.count; i++){
			data = this.items[i].getValue();
			if(removeData[this.itemId] != data[this.itemId]) arr.push(data);
		}
		this.setValue(arr);
	};
	
	proto.getIds = function(){
		var arr = [], data;
		for(var i=0; i<this.count; i++){
			data = this.items[i].getValue();
			if(data !== null && this.items[i].isVisible())
				arr.push(data[this.itemId]);
		}
		return arr;
	};

	proto.getValue = function(){
		var arr = [],data;
		for(var i=0; i<this.count; i++){
			data = this.items[i].getValue();
			if(data !== null && this.items[i].isVisible())
				arr.push(data);
		}
		return arr;
	};

	proto.add = function(data){
		this.setItem(data,this.count);
		this.count++;
	};
	
	//we propagate all events from items to parent and add reference to self
	proto.fireEvent = function(name,evt){
		if(name == 'afterCreate') {
			superClass.prototype.fireEvent.call(this,name,evt);
			return;
		}
		evt = evt || {};
		evt.list = this;
		if(this.parent.fireEvent)
			this.parent.fireEvent(name, evt);
	};
	
});
