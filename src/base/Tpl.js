
mi2JS.comp.add('base/Tpl', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

    var mi2 = mi2JS;

    proto.isTransitive = function(){ return this.getCompName() == 'base/Tpl' };

    proto.construct = function(el, tpl, parent){
        superProto.construct.call(this, el, tpl, parent);
        this.initTemplate();
    };

    proto.initTemplate = function(){
        this.template = mi2.loadTemplate(this.el);
        this.templateFwd = [];
        if(!this.children) return;
        var count = this.children.length;
        for(var i=0; i<count; i++){
            if(this.children[i].hasAttr('fwd-tpl-data')){
                if(this.children[i].setValue)
                    this.templateFwd.push(this.children[i]);
            }
        }        
    };

    proto.setValue = function(data){
        this.template.setValue(data);
        var count = this.templateFwd.length;
        for(var i=0; i<count; i++){
            this.templateFwd[i].setValue(data);
        }
    };

});
