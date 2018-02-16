(function(){
	var mi2 = mi2JS;

	mi2.vdiffNode = function(node, def){
		mi2.vdifAttr(node, def.attr);
		mi2.vdiffChildren(node, def.children);
	}

	mi2.vdiffChildren = function(node, children){
		children = children || [];
		var def, remove, newNode, tag, tmp;
		
		var next = node.firstChild;

		var count = children.length;
		for(var i=0; i<count; i++){
		
			def = children[i];
		
			if(typeof(def) == 'string'){

				if(next && next.nodeType == 3){
					if(next.textContent != def){
						// console.log('change text', next.textContent, def);
						next.textContent = def;
					}
					next = next.nextSibling;
				}else{
					// console.log('insert text', def);
					node.insertBefore(document.createTextNode(def), next);
				}

			}else if(def instanceof mi2.TagDef){

				tag = def.tag.toUpperCase();

				if(next && next.tagName == tag){
					// console.log('update tag', tag);
					newNode = next;
					next = next.nextSibling;
				}else{
					// console.log('add tag', tag);
					newNode = document.createElement(tag);
					node.insertBefore(newNode, next);
				}
				mi2.vdiffNode(newNode, def);
			}
		}
		while(next){
			tmp = next;
			next = next.nextSibling;
			node.removeChild(tmp);
		}
	}

	mi2.vdifAttr = function(node, newAttr, update){
		var list = node.attributes;
		var count = list.length;
		var toRemove = [];
		var attr, name, newValue;
		for(var i=0; i<count; i++){
			attr = list[i];
			name = attr.name;
			newValue = newAttr ? newAttr[name] : void 0;
			if(newValue == void 0 || newValue === null || newValue === false){
				toRemove.push(name);
			}
		}

		count = update ? 0 : toRemove.length;// do not remove attributes if in update mode
		for(var i=0; i<count; i++){
			node.removeAttribute(toRemove[i]);
		}
		if(newAttr){
			for(var p in newAttr){
				newValue = newAttr[p];
				if(newValue != void 0 && newValue !== null && newValue !== false){
					if(newValue === true) newValue = '';
	 				if(typeof(newValue) != 'string') newValue = '' + newValue;

	 				if(!node.hasAttribute(p) || node.getAttribute(p) != newValue)
						node.setAttribute(p, newValue);
				}
			}			
		}
	}
}());
