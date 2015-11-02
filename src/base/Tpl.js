
mi2JS.comp.add('base/Tpl', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	var mi2 = mi2JS;

	proto.isTransitive = function(){ return true; };

	proto.construct = function(el, tpl, parent){
		superProto.construct.call(this, el, tpl, parent);
		this.template = mi2.loadTemplate(el);
	};

	proto.setValue = function(data){
		this.template.setValue(data);
	};

});
