
mi2JS.comp.add('base/Form', 'base/Group', '',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	var mi2 = mi2JS;

	mi2.mixin(comp,mi2.InputGroup);

	/**
		@param event - name of the event to fire on parent (default: submit)
	*/
	proto.construct = function(el, parent){
		superProto.construct.call(this, el, parent);
		if(this.getCompName() == 'base/Form'){
			var m = 'base/Form must be extended, rather use mi2JS.InputGroup inside: ' + parent.getCompName();
			console.log(m,this.el, this);
			throw new Error(m);			
		}

		this.stopSubmit = (this.attr('stop-submit') || '1') == '1';
		this.event = this.attr('event') || 'submit';

	};

	proto.parseChildren = function(){
        superProto.parseChildren.call(this);

		if(!this.items){
			var m = 'This form is empty ' + this.getCompName();
			console.log(m,this.el, this);
			throw new Error(m);
		} 
		this.fixItems();

		this.listen(this.el,'submit', function(evt){
			if(this.stopSubmit) evt.stop();
			alert(this.stopSubmit);
			// make sure submit does not hapen on error, and error can go into console
			try{
				this.parent.fireEvent('submit',{src:this, domEvent:evt});
			}catch(e){
				evt.stop();
				console.error(e);
				return false;
			}

			if(this.stopSubmit) return false;
		});

		this.required = this.attrBoolean('required', true);
	};

    proto.on_nextInput = function(evt){
    	this.setTimeout(function(){
	    	this.changeFocus(evt.src,true);		
    	},50);
    };

    proto.changeFocus = function(from,toNext){
        var first,prev,found,next,last, items= this.focusItems || this;
        items.forEach(function(item){
            if(!first) first = item;
            if(found && !next) next = item;
            
            if(from == item) 
            	found = item;
            else if(!found)
            	prev = item;

            last = item;
        });
        var elem = toNext ? next:prev;
        if(!elem) elem = toNext ? first:last;
        if(elem && elem.focus) elem.focus();
    };
});


