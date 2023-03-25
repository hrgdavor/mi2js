
mi2JS.addCompClass('base/AutoComplete', 'base/InputBase', '<-TEMPLATE->',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, mi2, h, t, filters){

	var $ = mi2JS;
/*
 attributes:
   no_empty - [0/1] - does not allow empty value and disables selection when only one option is possible
   empty_text - when empty value selection is allowed, gives text for it
   showall - show all options when filtering, just select first match
*/

	proto.loadDelay = 100;

	proto.construct = function(el, parent){
		superProto.construct.call(this, el, parent);
		this.data = [];
	};

	proto.initTemplate = function(){	
		if(this.el.tagName == 'INPUT') this.el = this.replaceTag(this.el,'SPAN');
		superProto.initTemplate.apply(this, arguments);
	};

	proto.initChildren = function(){
		superProto.initChildren.call(this);


		this.addClass("AutoComplete");

		this.idInput.attr("name", this.attr('name'));
		
		this.noEmpty = this.attrBoolean('no_empty');
		this.freeText = this.attrBoolean('free_text');
		this.allowNew = this.attrBoolean('allow_new');
		
		this.emptyText = this.attrDef('empty_text', '') ;
		this.clearBt.setVisible(!this.attrBoolean('disable_clear_button') && (this.textInput.el.value || '') != this.emptyText);

		if(this.emptyText) this.setText(this.emptyText);
		this.list = [];
		this.displayLimit = mi2JS.num(this.attr('limit') || 999999);
		this.showall = this.attrBoolean('showall');
		// sample data: [{id:1,text:"default"},{id:2, text:'other'}, {id:3, text:'other 2'}]

		this.listen(this.textInput.el, "focus", function(evt){
			if(this.isReadOnly()) return;
			this.hasFocus = true;
            this.firstKey = true;
			this.selectFirst = false;
			this.lastTextValue = this.textInput.el.value;
			this.textInput.el.select();
			this.callLoad(true);
		});

		this.listen(this.textInput.el, "blur", function(evt){
			if(this.isReadOnly()) return;
			this.on_blur();
            this.hide();
        });

        this.listen(this.textInput.el, "keydown", function(evt){
            if(this.isReadOnly()) return;
			if(evt.keyCode == 9){ // TAB
				this.on_blur();
			}else if(evt.keyCode == 13 && this.div.isVisible()){ // ENTER
				this.applySelection();
				evt.stop();
				this.next();
				return false;
			}else{

			}
		});

		this.listen(this.div.el, "click", function(evt){
			if(!evt.target.unselectable && this.selectElem(evt.target)){
				this.applySelection();
				this.next();
			}
		});
		
		this.listen(this.div.el, "mouseover", function(evt){
			if(!evt.target.unselectable) this.selectElem(evt.target);
		});
		
		this.listen(this.textInput.el, "keyup", function(evt){
			if(this.isReadOnly()) return;
			//KEY_UP=38,KEY_DOWN=40;
			if((evt.keyCode == 38 || evt.keyCode == 40) && this.count > 0 ){
				var sel = this.selected;
				var i = sel ? sel.index:-1;
				var move = evt.keyCode == 40 ? 1:-1;
				var item
				do{
					i+=move
					item = this.list[i]
				}while(item && item.unselectable)

				if(item) this.selectElem(item.el);

			}else{
				this.firstKey = false;
			}
			this.selectFirst = this.textInput.el.value != '';
			this.callLoad();
		});
	};

	proto.setConfig = function(data){
		this.data = data;
	};

	proto.on_init = function(){
		superProto.on_init.apply(this, arguments);
		this.textInput.attr('placeholder',this.attr('placeholder'));
	};

	proto.on_blur = function(){
		this.hasFocus = false;
		if(this.lastTextValue !== this.textInput.el.value){
			if(this.freeText){
				this.idInput.el.value = this.textInput.el.value;
				this.fireIfChanged();
			}
		}
	};
	
	proto.on_clear = function(){
		if(this.isReadOnly()) return;
		var oldValue = this.getValue()
		this.setText(this.emptyText);
		this.setValue('', true);
		this.textInput.disabled = false;
		this.fireEvent({name:'change', oldValue, value: this.getValue()})
	};

	proto.clear = function(){
		if(this.isReadOnly()) return;
		this.setText(this.emptyText);
		this.setValue('', true);
		this.textInput.disabled = false;
	};

	proto.next = function(){
		if(this.nextInput) this.nextInput.focus();
		else this.textInput.el.blur();
		if(this.parent) this.fireEvent({name:'nextInput', fireTo:'parent'});
	};

	proto.focus = function(){
		this.textInput.el.focus();
	};
	proto.hide = function(sel){
		clearTimeout(this.hideTimer);
		this.hideTimer = this.setTimeout(function(){	
			this.div.setVisible(false);
			this.selectFirst = false;
		},200);
	};

	proto.selectElem = function(sel){
		while(sel && (!sel.data) ){
			if(sel == this.div.el) return false;
			sel = sel.parentNode;
		} 

		if(this.selected)
			$(this.selected).removeClass("selected");
		
		if(sel){
			$(sel).addClass("selected");
		}
		this.selected = sel;
		return true;
	};

	proto.callLoad = function(force){
		var val = this.textInput.el.value;
		if(val == this.oldVal  && !force) return;
		this.oldVal = val;
		clearTimeout(this.loadTimer);
		this.loadTimer = this.setTimeout(function(){
			this.loadResults(this.textInput.el.value.toLowerCase(),this);
		}, force ? 5:this.loadDelay);
	};

	proto.updateText = function(){
		this.updateTextFromData();
	};

	proto.getOptions = function(){
		return this.data;
	}

	proto.getTextFor = function(id){
		var data = this.getDataFor(id);
		return data ? (data.name || data.text):null;
	};

	proto.getDataFor = function(id){
		var allData = this.getOptions() || [];
		if(id) for(var i=0; i<allData.length; i++){
			if(allData[i].id == id) {
				return allData[i];
			}
		}
		return null;
	};
	
	proto.updateTextFromData = function(){
		this.textInput.disabled = false;
		var allData = this.getOptions() || [];
		if(allData.length <= 1 && this.noEmpty){
			this.textInput.disabled = true;
			this.clearBt.setEnabled(false);
		}
		this.selectedData = this.getDataFor(this.idInput.el.value);
		let text = this.emptyText
		if(this.selectedData){
			text  = this.selectedData.name || this.selectedData.text
		}else{
			if(this.allowNew && this.freeText) 
				text = this.idInput.el.value || this.emptyText
		}
		this.setText(text)
		
		if(this.noEmpty && allData.length >0 && !this.getText() ){
			this.selectedData = allData[0];
			this.setValue(allData[0].id);
		}
	};

	//load results from database (if already filtered jump to showResults)
	//if using cached all data (small lists) call filterResults
	proto.loadResults = function(srch,comp){
		this.filterResults(srch,comp);
	};

	proto.filterResult = function(srch,str, data){
		for(var i=0; i<srch.length; i++){
			if(!srch[i] || srch[i] == ' ') continue;
			if(str.indexOf(srch[i]) == -1) return false;
		}
		return true;
	};

	proto.filterResults = function(srch,comp){
		var showall = this.showall || this.firstKey;
		var allData = this.getOptions() || []
		if(!this.noEmpty || showall) allData = allData.filter(item=>this.filterResult('','',item));

		var data = [];
		srch = srch ? srch.toLowerCase() : '';
		srch = srch.split(' ');
		var firstIndex = -1;
		var firstIndexAll = -1;
		
		for(var i=0; i<allData.length; i++){
			var str = allData[i].name || allData[i].text || '';
			if( this.filterResult(srch, str.toLowerCase(), allData[i]) ){
				firstIndexAll = i;
				if(this.selectFirst && firstIndex == -1) firstIndex = data.length;
				data.push(allData[i]);
			} 
			if(this.displayLimit > 0 && data.length >= this.displayLimit) break;
		}
		
		if(data.length > 1 || !this.noEmpty || showall){
			if(showall && this.displayLimit > 0 && allData.length < this.displayLimit) {
				data = allData;
				firstIndex = firstIndexAll;
			}else{
				if(this.selectFirst && this.list.length) firstIndex = 0;
			}
        }
		this.showResults(data);
		if(firstIndex != -1 ) {
			this.selectElem(this.list[firstIndex].el); 
		} else 
    		this.selectElem(null);
	};

	proto.makeListElement = function(data,i){
		var d = $(mi2JS.addTag(this.div,{tag:'DIV',attr:{'class':'acItem'}}))
		return d
	}

	proto.updateListElement = function(d,data,i){
		d.attr('child', data.child ? true:void 0)
		d.attr('group', data.group ? true:void 0)
		d.attr('unselectable', data.unselectable ? '1':void 0)
		d.el.unselectable = d.unselectable = data.unselectable
		d.el.innerHTML = data.html || data.name || data.text;
	}

	proto.showResults = function(data){
		clearTimeout(this.hideTimer)
		if(this.emptyText && this.showall){
			var tmp = data;
			data = [{id:'',text:this.emptyText}, ...tmp];
		} 
	
		var num = this.count = data.length;
		var selectedId = this.idInput.el.value;
		for(var i=0; i<num; i++){
			var d = this.list[i];
			if(i>= this.list.length){
				d = this.list[i] = this.makeListElement(data[i], i)
				d.el.index = i;
			}
			this.updateListElement(d,data[i], i)
			d.el.data = data[i];
			d.setVisible(true);
			if(this.selectFirst && i==0) selectedId = data[i].id;
			d.classIf("selected", selectedId == data[i].id);
			if(selectedId == data[i].id) this.selected = d.el;
		}

		for(var i=data.length; i<this.list.length; i++){
			this.list[i].setVisible(false);
		}

		if(this.hasFocus && this.count >0){
			this.div.setVisible(true);
			const tx  =this.textInput.el
			this.div.el.style.top = (tx.offsetTop + tx.offsetHeight) +'px';
			this.div.el.style.minWidth = (this.textInput.el.offsetWidth - this.div.el.offsetWidth + this.list[0].el.offsetWidth) +'px';
		} else if (this.count < 1) {
			this.div.setVisible(false)
		}
	};

	proto.applySelection = function(skipIfNotSame){
		var sel = {};
		if(this.selected) sel = this.selected.data || sel;
		if(skipIfNotSame && (sel.name || sel.text) != this.textInput.el.value){
			sel = {text:this.textInput.el.value};
			this.idInput.el.value = '';
		} else if (sel.name || sel.text){
			this.selectedData = sel;
	        this.idInput.el.value = sel.id || '';
	        this.setText(sel.name || sel.text);			
		}
		this.fireIfChanged();
		this.fireEvent({name:"afterSelect", selected:sel, fireTo:'parent'});
	};

	proto.getSelectedData = function(){
		return this.idInput.el.value == '' ? null:  this.selectedData;
	};

	proto.setReadOnly = function(readOnly){
		this.attr('readonly', readOnly? '':null);
		this.clearBt.setVisible(!readOnly && !this.attr("disable_clear_button") && (this.textInput.el.value || '') != this.emptyText);
		this.textInput.el.readOnly = readOnly;
	};

	proto.isReadOnly = function(readOnly){
		return this.textInput.el.readOnly;
	};

	proto.setRawValue = function(val, fireChange){
		if(this.attr('inputVal')) this.textInput.setValue(val)
		
		if(val === null || val === void 0) val = '';
		this.idInput.el.value = val;
		this.updateText();
        if(fireChange)
            this.fireIfChanged();
        else
            this.oldValue = this.getValue();
	};

	proto.getRawValue = function(){
		return this.idInput.el.value;
	};

	proto.getText = function(){
		return this.textInput.el.value || '';
	};

	proto.setText = function(str){
		var newText = this.textInput.el.value = str || this.emptyText;
		this.clearBt.setVisible(!this.attrBoolean('disable_clear_button') && (this.textInput.el.value || '') != this.emptyText);
	};

	proto.triggerOnBlur = function(isReadOnly) {
		if (isReadOnly) {
			this.on_blur();
			this.hide();
		}
	}

	proto.validate = function(defReq){
		return $.Validity.required( !this.getValue() && this.attrBoolean('required'));
	};

});



