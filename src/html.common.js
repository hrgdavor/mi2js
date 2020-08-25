(function(){

	var mi2 = mi2JS;
	var mi2Proto = mi2.prototype;

	mi2.hiddenAttribute = 'hidden';
	mi2.disabledAttribute = 'disabled';


	mi2.dom_register('isVisible', true, function(node, text){
		return !node.hasAttribute(mi2.hiddenAttribute);
	});


	mi2.dom_register('setVisible', false, function(node, value){
		mi2.h_attr(node, mi2.hiddenAttribute, value ? null:'');
	});


	mi2.dom_register('isEnabled', true, function(node){
		return !node.hasAttribute(mi2.disabledAttribute);
	});


	mi2.dom_register('setEnabled', false, function(node, value){
		mi2.h_attr(node, mi2.disabledAttribute, value ? null:'');
	});



	mi2.dom_register('isSelected', true, function(node){
		return mi2.h_hasClass(node, 'selected');
	});


	mi2.dom_register('setSelected', false, function(node, value){
		mi2.h_classIf(node, 'selected', value);
	});


}(mi2JS));
