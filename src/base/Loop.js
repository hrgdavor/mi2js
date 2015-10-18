mi2JS.comp.add('base/Loop', 'Base', '',

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
function(comp, proto, superClass){
	
	var $ = mi2JS;

	proto.itemTpl = {
		tag:'DIV',
		attr: { as: 'Base' },
		html: ''
	};

	comp.constructor = function(el, tpl, parent){
		if(tpl) el.innerHTML = tpl;


		// support for components with inline template, and skip noData node
		this.itemsArea = this.findItemsArea(el) || el;

		this.loadItemTpl(el);

		// this was done before calling parent constructor to avoid stack overflow in case
		// of component recursion using Loop component (example: tree-like structures)

		superClass.constructor.call(this, el, tpl, parent);

		this.items = [];
		this.count = 0;
	};

	proto.loadItemTpl = function(el){
		var ch = this.itemsArea.firstChild;
		while(ch && !ch.tagName) ch=ch.nextSibling;

		if(ch && ch.tagName){
			this.itemTpl = $.toTemplate(ch, this.itemTpl.attr);
			ch.parentNode.removeChild(ch);
		}
		// else if not found, we inherit the value from the prototype
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
		var node = $.addTag(this.itemsArea, this.itemTpl);

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

	proto.callFunc = function(funcName, args){
		for(var i=0; i<this.count; i++){
			this.items[i][funcName].apply(this.items[i],args);
		}
	};

	proto.customValue = function(funcName, arr){
		for(var i=0; i<arr.length; i++){
			var item = this.items[i];
			if(!item) item = this.items[i] = this.makeItem(newData, i);
			this.items[i][funcName](arr[i]);
		}
		this.count = arr.length;
	};

});
