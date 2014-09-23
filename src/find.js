(function(mi2){

/** any tag  
 - () - any alement that is a tag and not TextElement
 - (func) - matching decided by the provided function
 - (tag) - element with that tag
 - (attr,value) - element with attribute and value for it
 - (tag,attr,value) */
function matcher(p1,p2,p3){
	if(typeof(p1) == 'function') return p1;
	if(!p3){
		if(!p2){	
			if(!p1) return function(e){ return e.tagName; };
			return function (e){ 
				return e.tagName == p1; 
			};
		}else{
			return function (e){ 
				return e.getAttribute && e.getAttribute(p1) == p2; 
			};
		}
	}else{
		return function (e){ 
			return e.getAttribute && e.tagName == p1 && e.getAttribute(p2) == p3; 
		};
	}
}

mi2.child = function(elem , p1, p2, p3){
	srch = matcher(p1, p2, p3);
	return find(elem,srch);

	function find(elem, srch){
		var ch = elem.firstChild;
		while(ch){
			if(srch(ch)) return ch;
			var ret = find(ch, srch);
			if(ret) return ret;
			ch = ch.nextSibling;
		}
	}
};

mi2.children = function(elem , p1, p2, p3){
	var arr = [];
	srch = matcher(p1, p2, p3);
	find(elem,srch,arr);
	return arr;
	
	function find(elem,srch,arr){
		var ch = elem.firstChild;
		while(ch){
			if(srch(ch)) arr.push(ch);
			find(ch, srch, arr);
			ch = ch.nextSibling;
		}
	}
};

function __find(nexElementProp){
	return function(e, p1, p2, p3){
		srch = matcher(p1, p2, p3);
		return find(e,srch);
	};
	function find(e,srch){
		var p = e[nexElementProp];
		while(p){
			if(p.getAttribute){
				if(srch(p)) return p;				
			}
			p = p[nexElementProp];
		}
		return null;		
	}
}

mi2.findComplex = function(){
	var elem = arguments[0];
	for(var i=1; i<arguments.length; i++){
		if(!elem) {
			console.log("null element while searching, at index "+index, arguments);
		}
		var a = arguments[i];
		elem = a[0].call(null, elem, a[1], a[2], a[3]);
	}
	return elem;
};

mi2.parent = __find('parentNode');
mi2.prev = __find('previousSibling');
mi2.next = __find('nextSibling');


})(mi2JS);
