
mi2JS.comp.add('base/AutoComplete', 'base/InputBase', '<-TEMPLATE->',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	var $ = mi2JS;
/*
 attributes:
   no_empty - [0/1] - does not allow empty value and disables selection when only one option is possible
   empty_text - when empty value selection is allowed, gives text for it
   showall - show all options when filtering, just select first match
*/

	proto.loadDelay = 100;

	proto.construct = function(el, parent){
		if(el.tagName == 'INPUT') el = this.replaceTag(el,'DIV');
		superProto.construct.call(this, el, parent);

		this.data = [];

		this.addClass("AutoComplete");

	};

	proto.parseChildren = function(){
		superProto.parseChildren.call(this);

		this.idInput.attr("name", this.attr("name"));

		this.clearBt.setVisible(!this.attr("disable_clear_button"));
		this.noEmpty = this.attr("no_empty");
		this.emptyText = this.attr("empty_text") || '';
		this.freeText = (this.attr("free_text") || '0') != '0';

		if(this.emptyText) this.setText(this.emptyText);
		this.list = [];
		this.displayLimit = mi2JS.num(this.attr('limit') || 999999);
		this.showall = this.attr('showall');
		// sample data: [{id:1,text:"default"},{id:2, text:'other'}, {id:3, text:'other 2'}]

		this.listen(this.textInput.el, "focus", function(evt){
			if(this.isReadOnly()) return;
			this.hasFocus = true;
            this.firstKey = true;
			this.selectFirst = false;
			this.textInput.el.select();
			this.callLoad(true);
		});

		this.listen(this.textInput.el, "blur", function(evt){
			if(this.isReadOnly()) return;
			this.hasFocus = false;
			if(this.freeText){
                this.idInput.el.value = this.textInput.el.value;
                this.fireIfChanged();
            }else
                this.applySelection();
            this.hide();
        });

        this.listen(this.textInput.el, "keydown", function(evt){
            if(this.isReadOnly()) return;
            if(evt.keyCode == 9){ // TAB
                if(this.freeText){
                    this.idInput.el.value = this.textInput.el.value;
                    this.fireIfChanged();
                }else
				    this.applySelection();
			}
			if(evt.keyCode == 13){ // ENTER
				this.applySelection();
				evt.stop();
				this.next();
				return false;
			}
		});

		this.listen(this.div.el, "click", function(evt){
			if(this.selectElem(evt.target)){
				this.applySelection();
				this.next();
			}
		});
		
		this.listen(this.div.el, "mouseover", function(evt){
			this.selectElem(evt.target);
		});
		
		this.listen(this.textInput.el, "keyup", function(evt){
			if(this.isReadOnly()) return;
			//KEY_UP=38,KEY_DOWN=40;
			if((evt.keyCode == 38 || evt.keyCode == 40) && this.count > 0 ){
				var sel = this.selected;
				var i = sel ? sel.index:-1;
				i += evt.keyCode == 40 ? 1:-1;
				if(i<0 || i>=this.count){
					i = evt.keyCode == 40 ? 0:this.count-1;
				}
				this.selectElem(this.list[i].el);
			}else{
				this.firstKey = false;
			}
			this.selectFirst = this.textInput.el.value != '';
			this.callLoad();
		});
	};

	
	proto.on_clear = function(){
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

	proto.getDataFor = function(id){
		var allData = this.getOptions();
		if(id) for(var i=0; i<allData.length; i++){
			if(allData[i].id == id) {
				return allData[i];
			}
		}
		return null;
	};
	
	proto.updateTextFromData = function(){
		this.textInput.disabled = false;
		var allData = this.getOptions();
		if(allData.length <= 1 && this.noEmpty){
			this.textInput.disabled = true;
			this.clearBt.setEnabled(false);
		}
		this.selectedData = this.getDataFor(this.getValue());
		this.setText(this.selectedData ? this.selectedData.text:this.emptyText);
		var val = this.getValue();
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

	proto.filterResults = function(srch,comp){
		var allData = this.getOptions();
		var data = [];
		srch = srch ? srch.toLowerCase() : '';
		var firstIndex = -1;
		for(var i=0; i<allData.length; i++){
			if(allData[i].text.toLowerCase().indexOf(srch) != -1){
				if(this.selectFirst && firstIndex == -1) firstIndex = data.length;
				data.push(allData[i]);
			} 
			if(data.length >= this.displayLimit) break;
		}
		var showall = this.showall || this.firstKey;
		if(data.length > 1 || !this.noEmpty || showall){
			if(showall) {
				data = allData;
				if(data.length > this.displayLimit){
					data = data.slice(0,this.displayLimit);
				}
			   this.showResults(data, data.length > 0 ? data[0].id : null);
			}else{
				this.showResults(data);
				if(this.selectFirst && this.list.length) firstIndex = 0;
			}
        }
	   if(firstIndex != -1 ) this.selectElem(this.list[firstIndex].el); 
       else this.selectElem(null);
	};

	proto.showResults = function(data){
		if(this.emptyText && this.showall){
			var tmp = data;
			data = [{id:'',text:this.emptyText}];
			for(var i=0; i<tmp.length; i++) data.push(tmp[i]);
		} 
	
		var num = this.count = data.length;
		var selectedId = this.idInput.el.value;
		for(var i=0; i<num; i++){
			var d = this.list[i];
			if(i>= this.list.length){
				d = this.list[i] = $(mi2JS.addTag(this.div,{tag:'DIV',attr:{'class':'acItem'}}));
				d.el.index = i;
			}
			d.el.innerHTML = data[i].html || data[i].text;
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
			this.div.el.style.top = this.textInput.el.offsetHeight +'px';
			this.div.el.style.minWidth = (this.textInput.el.offsetWidth - this.div.el.offsetWidth + this.list[0].el.offsetWidth) +'px';
		}		
	};

	proto.applySelection = function(){
		var sel = {};
		if(this.selected) sel = this.selected.data || sel;
		this.selectedData = sel;
        this.idInput.el.value = sel.id || '';
        this.setText(sel.text);
		this.fireIfChanged();
		this.fireEvent({name:"afterSelect", selected:sel, fireTo:'parent'});
	};

	proto.getSelectedData = function(){
		return this.idInput.el.value == '' ? null:  this.selectedData;
	};

	proto.setReadOnly = function(readOnly){
		this.clearBt.setVisible(!readOnly && !this.attr("disable_clear_button"));
		this.textInput.el.readOnly = readOnly;
	};

	proto.isReadOnly = function(readOnly){
		return this.textInput.el.readOnly;
	};

	proto.setValue = function(val, fireChange){
		if(val === null || val === void 0) val = '';
		this.idInput.el.value = val;
		this.updateText();
        if(fireChange)
            this.fireIfChanged();
        else
            this.oldValue = this.getValue();
	};

	proto.getValue = function(){
		return this.idInput.el.value;
	};

	proto.getText = function(){
		return this.textInput.el.value || '';
	};

	proto.setText = function(str){
		return (this.textInput.el.value = str || '');
	};

	proto.validate = function(defReq){
		var attr = this.attr('required');
		var required = attr === null ? defReq : attr  == '1';
		if(required && !this.getValue()) return {message:t('required'), type:'required'}
	};

});



