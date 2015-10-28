mi2JS.comp.add('base/Group', 'Base', '',

function(proto){
	
	// add/mixin methods from NWGroup but do not override any existing methods
	// this assumes both use this.items for keeping list of items
	var ext = mi2JS.NWGroup.prototype;
	for(var p in ext) if(!proto[p])	proto[p] = ext[p];	

});
