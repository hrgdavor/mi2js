mi2JS.comp.add('base/MultiInput', 'base/Loop', '',

// component initializer function that defines constructor and adds methods to the prototype
    function(proto, superProto, comp, superComp) {

        var mi2 = mi2JS;

        proto.initTemplate = function(){
            superProto.initTemplate.call(this);

            if(this.hasAttr('in-filter'))
                this.inFilter = mi2.parseFilter(this.attr('in-filter'));
            
            if(this.hasAttr('out-filter'))
                this.outFilter = mi2.parseFilter(this.attr('out-filter'));      

            this.setValue([]);
        };

        proto.defaultNewValue = function(){
            return null;
        }

        proto.isEmptyValue = function(value){
            return value === null;
        }

        proto.itemCreated = function(item, i){
            superProto.itemCreated.call(this,item, i);
            this.listen(item,'change', this.on_itemChange);
        };

        proto.on_itemChange = function(evt){
            var items = this.getItems();
            var len = items.length;
            if(this.isEmptyValue(evt.value)){
                if(len > 1 && evt.target == items[len-2] && this.isEmptyValue(items[len-1].getValue()) ){
                    this.pop();
                }
            }else{
                if(evt.target == items[len-1]){
                    this.push(this.defaultNewValue());
                }
            }
        };

        proto.getValue = function(){
            var ret = superProto.getValue.call(this);
            while (ret.length && this.isEmptyValue(ret[ret.length -1])) ret.pop();

            if (this.attrBoolean('remove-empty')) {
                var tmp = [];
                for (var i=0; i<ret.length ; i++) {
                    if ( !this.isEmptyValue(ret[i]) ) tmp.push(ret[i]);
                }

                ret = tmp;
            }

            return mi2.filter( ret, this.outFilter );
        };
        
        proto.setValue = function(cval) {
            cval = mi2.filter(cval, this.inFilter);

            if (!cval) cval = [];
            superProto.setValue.call(this,cval);
            this.push(this.defaultNewValue());
        };

});