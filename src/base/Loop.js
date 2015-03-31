mi2JS.comp.add('base/Loop', 'Base', '',

/**
if component extends Loop and has an element bound to itemsArea it will be used instead
of the component root.

example with inline template: 
	mi2JS.comp.add('base/List', 'lock3/Loop', '<div class="title">title</div><div p="itemsArea"></div>',

example in separate template file:
	<div class="title">title</div>
	<div p="noData">There are no results avaialble</div>
	<div p="itemsArea"></div>
*/

// component initializer function that defines constructor and adds methods to the prototype 
function(comp, proto, superClass){
	
	var mi2 = mi2JS;
	var $ = mi2.wrap;

	proto.itemTemplate = document.createElement('DIV');
	proto.itemTemplate.setAttribute('mi-comp','Base');

	comp.constructor = function(el, tpl, parent){
		if(tpl) el.innerHTML = tpl;

		// support for components with inline template, and skip noData node
		this.itemsArea = this.findItemsArea(el) || el;
		var ch = this.itemsArea.firstChild;
		while(ch && ch == ignore && !ch.tagName) ch=ch.nextSibling;

		if(ch && ch.tagName){
			this.itemTemplate = ch;
			ch.parentNode.removeChild(ch);
		}
		// this was done before calling parent constructor to avoid stack overflow in case
		// of component recursion using Loop component (example: tree-like structures)

		superClass.constructor.call(this, el, tpl, parent);

		var ignore = this.noData;
		if(ignore){
			ignore = ignore.el;
			ignore.parentNode.remove(ignore.el);
		}


		this.itemHtml = this.itemTemplate.innerHTML;

		this.items = [];
		this.count = 0;
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

		for(var i=arr.length; i<this.items.length; i++){
			this.items[i].setVisible(false);
		}
	};

	/** returns only active items (do not access .times property directly as it contains also disabled ones) */
	proto.getItems = function(id){
		var it = [];
		for(var i=0; i<this.count; i++){
			it.push(this.items[i]);
		}
		return it;
	};

	function defGetValue(){ return this.data;}
	function defSetValue(){ }

	proto.makeItem = function(newData,i){
		var node = mi2.addTag(this.itemsArea, this.itemTemplate.tagName, '');
		node.innerHTML = this.itemHtml;

		var attr = this.itemTemplate.attributes;
		if(attr) for(var i=0; i<attr.length; i++) node.setAttribute(attr[i].name, attr[i].value);

		var comp = mi2.comp.make(node, null, this);

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
		this.parent.fireEvent('itemCreated',{item:item, index:i});
	};

	proto.setItemValue = function(item, newData){
		item.setValue(newData);
	};
	
	proto.setItem = function(newData,i){
		var item = this.items[i];

		if(!item) item = this.items[i] = this.makeItem(newData, i);

		item.data = newData;
		item.el.index = i;
		this.setItemValue(item, newData);
		item.setVisible(true);
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

		if(this.parent && this.parent.fireEvent){
			evt = evt || {};
			evt.loop = this;
			this.parent.fireEvent(name, evt);
		}
	};
	
});
