
mi2JS.comp.add('base/Tpl', 'Base', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

    var mi2 = mi2JS;

    proto.isTransitive = function(){ return this.getCompName() == 'base/Tpl' };

    proto.parseChildren = function(){
        superProto.parseChildren.call(this);
        if(!this.template) this.loadTemplate();
    };

    // in case of inline template
    proto.initTemplate = function(){
        superProto.initTemplate.call(this);
        if(!this.template) this.loadTemplate();
    };

    proto.setValue = function(data){
        if(!this.template) {
            var m = 'template not initialized yet';
            console.error(m);
            console.log(m, this.el,this.__initialized, this.el.innerHTML, mi2.loadTemplate(this.el, this));
            if(!this.template)
                this.template = mi2.loadTemplate(this.el, this);
        }
        this.template.setValue(data);
        var count = this.templateFwd.length;
        for(var i=0; i<count; i++){
            this.templateFwd[i].setValue(data);
        }
    };

    proto.loadTemplate = function(){
        this.template = mi2.loadTemplate(this.el, this);
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

});
