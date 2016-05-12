mi2JS.comp.add('base/Loop', 'base/Group', '',

/**
if component extends Loop and has an element bound to itemsArea it will be used instead
of the component root.

example with inline template: 
	mi2JS.comp.add('base/List', 'lock3/Loop', '<div class="title">title</div><div p="itemsArea"></div>',

example in separate template file:
	<div class="title">title</div>
	<div p="itemsArea"></div>
*/

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){
	
	var $ = mi2JS;

	proto.itemTpl = {
		tag:'DIV',
		attr: { as: 'base/Tpl' },
		html: ''
	};

	proto.isTransitive = function(){ return true; };

	proto.initTemplate = function(){
		var el = this.el;
		
		if(this.__template) el.innerHTML = this.__template;
		delete this.__template;

		this.loadItemTpl(el);

		// this was done before calling parent constructor to avoid stack overflow in case
		// of component recursion using Loop component (example: tree-like structures)

		superProto.initTemplate.call(this);

		this.allItems = [];
		this.items = [];
		this.count = 0;
	};

	proto.findItemTpl = function(el){
		var ch = el.firstElementChild;
		while(ch){
			if(ch.hasAttribute('template')) return ch;
			if(!ch.hasAttribute('as')){
				var ret = this.findItemTpl(ch);
				if(ret) return ret;
			}
			ch=ch.nextElementSibling;
		}
	};

	proto.loadItemTpl = function(el){
		var ch = this.findItemTpl(el) || el.firstElementChild;

		if(ch && ch.tagName){
			this.itemsArea = ch.parentNode;
			this.itemTpl = $.toTemplate(ch, this.itemTpl.attr);
			this.itemNextSibling = ch.nextElementSibling;
			ch.parentNode.removeChild(ch);
		}else
			this.itemsArea = el;
	};

	proto.findItem = function(el){
		while(el){
			if(el.parentNode == this.itemsArea){
				for(var i=0; i<this.items.length; i++){
					if(this.items[i].el == el) return this.items[i];
				}
				break;
			} 
			el = el.parentNode;
		}
	};

	proto.findItemsArea = function(el){
		var ch = el.firstChild;
		while(ch){
			if(ch.getAttribute){
				if (ch.getAttribute('p') == 'itemsArea') return ch;
				if (!ch.hasAttribute('as')){
					var found = this.findItemsArea(ch);
					if(found) return found;
				} 
			} 
			ch = ch.nextSibling;
		}
	}

	proto.setValue = function(arr){
		arr = arr || [];
		for(var i=0; i<arr.length; i++){
			this.setItem(arr[i],i);
		}
		this.count = arr.length;
		if(this.noData) this.noData.setVisible(!this.count);

		// update items array to match visible elements
        this.items = this.allItems.slice(0,this.count);

		for(var i=arr.length; i<this.allItems.length; i++){
			this.allItems[i].setVisible(false);
		}
		this.fireEvent('afterSetValue');
	};

	/** returns only active items (do not access .times property directly as it contains also disabled ones) */
	proto.getItems = function(){
		return this.items;
	};

	function defGetValue(){ }
	function defSetValue(){ }

	proto.makeItem = function(newData,i){
		var node = $.addTag(this.itemsArea, this.itemTpl, this.itemNextSibling);

		var comp = $.comp.make(node, null, this);

		if(!comp.getValue) comp.getValue = defGetValue;
		if(!comp.setValue) comp.setValue = defSetValue;

		this.itemCreated(comp, i);

		return comp;
	};

	/** 
	Use this method to add extra initialization for created components (extra methods or init params).

	Component that extends Loop can override this method, and if used inside 
	another component it can listen to itemCreated event by adding method on_itemCreated.
	This distinction also avoids Loop inside a Loopp accidentaly coliding for this event. 
	*/
	proto.itemCreated = function(item, i){
		if(this.parent)
			this.parent.fireEvent('itemCreated',{item:item, index:i});
	};

	proto.setItemValue = function(item, newData){
		item.setValue(newData);
	};

	proto.setItem = function(newData,i){
		var item = this.allItems[i];

		if(!item) item = this.allItems[i] = this.makeItem(newData, i);

		item.el.index = i;
		this.setItemValue(item, newData);
		this.fireEvent('afterSetItemValue', {index:i, data:newData, item:item});
		item.setVisible(true);
	};

	proto.getValue = function(){
		return this.forEachGet(function(item){
			return item.getValue();
		});
	};

	proto.push = function(data){
		var index = this.count;
		this.setItem(data,index);
		this.count++;
        this.items = this.allItems.slice(0,this.count);
		this.fireEvent('afterAdd', {index:index, data:data, item:this.item(index)});
	};

	proto.pop = function(data){
		if(this.count == 0) return;
		this.count--;
		var item = this.items.pop();
		item.setVisible(false);

        this.items = this.allItems.slice(0,this.count);

		this.fireEvent('afterPop', {item:item});
		return item;
	};

});
