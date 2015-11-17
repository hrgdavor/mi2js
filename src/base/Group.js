mi2JS.comp.add('base/Group', 'Base', '',

function(proto, superProto, comp){
	
	proto.parseChildren = function(){
		superProto.parseChildren.call(this);
		// parser will create NWGroup 
		// we discard it but copy items object from it for our use
		// as we extend the NWGroup we need that reference to be this.items for all the inherited methods to work
		if(this.items) this.items = this.items.items;
	};
	
	// add/mixin methods from NWGroup but do not override any existing methods
	// this assumes both use this.items for keeping list of items
	mi2JS.mixin(comp,mi2JS.NWGroup);

});
