(function(mi2){

/* */
mi2.parse = function(elem, obj){
	if(!elem) mi2.nn({elem:elem});

	if(typeof(elem) == "string") elem = mi2.addHtml(elem);

	if(!obj){
		if(mi2.comp){
			var compName = elem.getAttribute('as') || mi2.comp.tags[elem.tagName];
			if(compName)
				obj = mi2.comp.make(elem, compName, obj);
			else
				obj = mi2.wrap(elem);			
		}
	}  

//	mi2.parseChildren(elem, obj);

	return obj;
};

/** 
p       access by
value        calling
--------------------------
info      |  obj.info
img.      |  obj.img[0]
img.      |  obj.img[1]
bt.edit   |  obj.bt.edit
bt.save   |  obj.bt.save
*/
mi2.setRef = function(obj, comp, prop){
	if(!prop) return;

	var idx = -1;
	if(prop){
		if( (idx=prop.indexOf('.')) != -1){
			var group = prop.substring(0,idx);
			prop = prop.substring(idx+1);
			comp.__propGroup = group;
			if(prop){
				//example: p="bt.edit"
				if(!obj[group]) obj[group] = {};
				comp.__propName  = prop;
				obj[group][prop] = comp;
			}else{
				//example: p="bt."
				if(!obj[group]) obj[group] = [];
				comp.__propName = obj[group].length;
				obj[group].push(comp);
			}
		}else{
			//example p="edit"
			comp.__propName = prop;
			obj[prop] = comp;
		}
	}
};

/** 

 if as=".." attribute is present, component will be instantiated with that node as root 
  - reference wil now point to component object
    (for components made correctly html element ref will be moved to .node property under that object)
  - assign will not go into recursion here, so component can choose the initialization itself
*/
 mi2.parseChildren = function(elem, obj){
	var el = elem.firstChild,next;
	while(el){
		next = el.nextSibling;
		if(el.getAttribute){
			var comp = null, stopRecursion = false;
			if(mi2.comp){
				var compName = el.getAttribute('as') || mi2.comp.tags[el.tagName];
				if(compName){
					comp = mi2.comp.make(el, compName, obj);
					stopRecursion = true;
				}				
			}

			var prop = el.getAttribute('p');
			if(prop){
				if(!comp) comp = mi2.wrap(el);
				mi2.setRef(obj, comp, prop);
				// if property id "group." the part after dot is based on index, 
				// we put the index into html for easy access for example "group.3" for fourth such element
				if(prop.charAt(prop.length-1) == '.') el.setAttribute('p',prop+comp.__propName);
			}

			// recursion is stopped for components, as the component can decide how to procede
			if(!stopRecursion) mi2.parseChildren(el, obj);
		}

		el = next;
	}
};

})(mi2JS);
