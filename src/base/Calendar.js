
mi2JS.comp.add('base/Calendar', 'Base', '<input p="input" as="base/Input">',

// component initializer function that defines constructor and adds methods to the prototype 
function(comp, proto, superClass){

	var mi2 = mi2JS; // minimizer friendly 

	comp.constructor = function(el, tpl, parent){
		if(el.tagName == 'INPUT') el = this.replaceTag(el,'SPAN');
		superClass.constructor.call(this, el, tpl, parent);
		var t = this.editType = this.attr('type','date').toLowerCase();
		this.editTime = t == 'time' || t =='datetime';
		this.editDate = t == 'date' || t =='datetime';

		this.addClass('Calendar');

		this.widget = mi2.comp.make('DIV', 'base/CalendarWidget',this);
		this.widget.setVisible(false);
		
		this.listen(this.input.el,'focus', 'on_focus');
		this.listen(this.input.el,'blur',  'on_blur');

		this.listen(this.widget,'focus', function(){
			clearTimeout(this.hideTimer);		
		});
		this.listen(this.widget,'blur',  'on_blur');

		this.input.trackChanges();
		this.listen(this.input, 'change', 'on_change');
	};

	proto.insertBefore = function(before,elem){
		elem.parentNode.insertBefore(before,elem);
	};

	proto.on_focus = function(evt){
		clearTimeout(this.hideTimer);
		if(!this.editDate) return;
		this.insertBefore(this.widget.el, this.input.el);
		this.widget.el.style.top = this.input.el.offsetHeight+'px';
		var val = this.input.el.value;
		if(val == '' ) val = new Date();
		else val = this.parseValue();
		this.widget.update(val);
		this.showWidget(true);
	};
	
	proto.showWidget = function(show){
		this.widget.setVisible(show);
		this.widgetVisible = show;
	};
	proto.on_blur = function(evt){
		this.hideTimer =this.setTimeout(function(){
			this.showWidget(false);
		},100);
	};

	proto.on_change = function(evt){
		var val = this.parseValue();
		if(val && this.widgetVisible) this.widget.update(val);
	};

	proto.on_dateSelected = function(evt){
		this.setValue(evt.date);
		this.on_blur({});
		this.input.el.blur();
	};

	proto.validate = function(defReq){
		var required = this.attr('required',defReq ? '1':'0') == '1';
		var v = this.input.el.value;
		if(!v){
			if(required) return {type:'required', message:t('required')};
		}else{
			// not empty but can not be parsed (getValue returns null)
			if(!this.parseValue())
				return {type:'invalid', message:t('invalid_value')};
		}

		return null;
	};	

	proto.markValidate = function(data, info){
		this.input.markValidate(data, info);
	};

	proto.getValue = function(){
		var d = this.date = this.parseValue();
		if(!d) return null;

		if(this.editDate && this.editTime){
			return d.getTime();
		}else if(this.editDate){
			return [d.getFullYear(),d.getMonth()+1,d.getDate()];
		}else{
			return [d.getHours(),d.getMinutes(),d.getSeconds(), d.getMilliseconds()];
		}
	};

	proto.updateInput = function(){
		var str = '';
		if(this.date){
			if(this.editDate && this.editTime){
				str = mi2.printDateTime(this.date);
			}else if(this.editDate){
				str = mi2.printDate(this.date);
			}else{
				str = mi2.printTime(this.date);
			}
		}
		this.input.el.value = str;
	};

	proto.setValue = function(value){
		if(!value || value instanceof Date){
			this.date = value;
		}else if(this.editDate && this.editTime){
			this.date = new Date(value);
		}else if(this.editDate){
			this.date = new Date(value[0], value[1]-1, value[2]);
		}else{
			this.date = new Date(0,0,0,value[0], value[1] || 0, value[2] ||0, value[3] ||0);
		}
		this.updateInput();
	};

	proto.parseValue = function(){
		var str = this.input.el.value;
		if(this.editDate && this.editTime){
			return mi2.parseDateTime(str);
		}else if(this.editDate){
			return mi2.parseDate(str);
		}else{
			return mi2.parseTime(str);
		}
	};

});
