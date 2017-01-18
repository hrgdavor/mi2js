mi2JS.addCompClass('base/Group', 'Base', '',
/**  <b>Extends:</b> {@link mi2JS(comp).Base}<br>
@class base/Group
@memberof mi2JS(comp)
*/
function(proto, superProto, comp){
	
	// add/mixin methods from NWGroup but do not override any existing methods
	// this assumes both use this.items for keeping list of items
	mi2JS.mixin(comp,mi2JS.NWGroup);

});
