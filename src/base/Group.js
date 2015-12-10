mi2JS.comp.add('base/Group', 'Base', '',

function(proto, superProto, comp){
	
	// add/mixin methods from NWGroup but do not override any existing methods
	// this assumes both use this.items for keeping list of items
	mi2JS.mixin(comp,mi2JS.NWGroup);

});
