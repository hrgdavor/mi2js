/**
 * Component to display date or dateTime picker.
 *
 * Argument "past_not_allowed"
 *  - this argument tells validator not to allow date too far in past
 *  - it allows date to be in past just for several hours, which is set in "validate" method
 *  - if component is inside administration form, then form must set initial value when in edit mode, using "setInitialValue" method (example can be found in project)
 *    - reason for this is to allow saving date in past without limitation when user is editing form, but not changing the date
 *    - Example
 *      - if there is a record that has date set to "01.01.2020. 15:00", when user edits something in that record, validator would say "date_in_past_not_allowed"
 *      - but if initialValue "01.01.2020. 15:00" is passed to component, and on form submit that date is still "01.01.2020. 15:00", validator will allow that date in past
 */
mi2JS.addCompClass('base/Calendar', 'base/InputBase', '<input p="input" as="base/Input">',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, mi2, h, t, filters){

	var mi2 = mi2JS; // minimizer friendly 

	proto.construct = function(el, parent){
		superProto.construct.call(this, el, parent);
	};

	proto.initTemplate = function(){	
		if(this.el.tagName == 'INPUT') this.el = this.replaceTag(this.el,'SPAN');
		superProto.initTemplate.apply(this, arguments);
	};

	proto.initChildren = function(){
		superProto.initChildren.call(this);

		var t = this.editType = (this.attr('type') || 'date').toLowerCase();
		if(this.hasAttr('datetime')) t = 'datetime';
		this.editTime = t == 'time' || t =='datetime';
		this.editDate = t != 'time';

        this.typingFilter = this.attrDef('typing-filter', this.typingFilter);

		this.addClass('Calendar');

		this.widget = mi2.addComp(this,{tag:'DIV', attr:{as:'base/CalendarWidget'}});
		this.widget.setVisible(false);
		
		this.listen(this.input.el,'focus', 'on_focus');
		this.listen(this.input.el,'blur',  'on_blur');

		this.listen(this.widget,'focus', function(){
			clearTimeout(this.hideTimer);		
		});
		this.listen(this.el,'click', function(){
			//this.input.focus();
		});		
		this.listen(this.widget,'blur',  'on_blur');

		this.input.trackChanges();
		this.listen(this.input, 'change', 'on_changeInput');
		this.initialValue = null
	};

	proto.on_init = function(){
		superProto.on_init.apply(this, arguments);
		if(this.el.tagName != 'INPUT'){ 
			this.input.attr('name',this.attr('name'));
			this.input.attr('placeholder',this.attr('placeholder'));
			this.input.attr('value',this.attr('value'));
		}		
	};

	proto.insertBefore = function(before,elem){
		elem.parentNode.insertBefore(before,elem);
	};

	proto.setReadOnly = function(readOnly){
		this.input.el.readOnly = readOnly;
	};

	proto.isReadOnly = function(readOnly){
		return this.input.el.readOnly;
	};

	proto.on_focus = function(evt){
		if(this.isReadOnly()) return;
		clearTimeout(this.hideTimer);
		if(!this.editDate || evt.src == this.widget) return;

		this.insertBefore(this.widget.el, this.input.el);
		this.widget.el.style.top = this.input.el.offsetHeight+'px';
		var val = this.input.el.value;
		if(val == '' ) val = new Date();
		else val = this.parseValue();
		this.widget.update(val);
		this.input.el.select();
		this.showWidget(true);
	};
	
	proto.showWidget = function(show){
		this.widget.setEditTime(this.editTime);
		this.widget.setVisible(show);
		this.widgetVisible = show;
	};

	proto.on_blur = function(evt){
		if(this.isReadOnly()) return;
        var inp = this.input.el;
        
        if(this.typingFilter){
            inp.value = mi2.filter(inp.value, this.typingFilter);
        }
        this.fireIfChanged();
		this.hideTimer =this.setTimeout(function(){
			this.showWidget(false);
		},100);
	};

	proto.on_changeInput = function(evt){
		if(this.isReadOnly()) return;
		var val = this.parseValue();
		if(val && this.widgetVisible) this.widget.update(val);
	};

	proto.on_dateSelected = function(evt){
		this.setRawValue(evt.date);
		this.on_blur({});
		this.input.el.blur();
        this.fireEvent({name:'nextInput',eventFor:'parent'});
	};

	proto.validate = function(defReq){
		var attr = this.hasAttr('required');
		var required = attr ? this.attrBoolean('required') : defReq;
		var v = this.input.el.value;
		if(!v){
			if(required) return {type:'required', message:t('required')};
		}else{
			// not empty but can not be parsed (getValue returns null)
			if(!this.parseValue())
				return {type:'invalid', message:t('invalid_value')};
		}

		if (this.attrBoolean('past_not_allowed') && v) {
			const currentValue = mi2.parseDateTime(v).getTime()
			const diffInSeconds = (Date.now() - currentValue) / 1000

			// 3600 is number of seconds in 1 hour, so we multiply tolerated amount of hours with it
			if (this.initialValue != currentValue && diffInSeconds > (8 * 3600)) {
				return {type:'invalid', message:t('date_in_past_not_allowed')};
			}
		}

		return null;
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

	proto.getRawValue = function(){
		var d = this.date = this.parseValue();
		return d ? d:null;
	};

	proto.setRawValue = function(value){
		if(!value || value instanceof Date){
			this.date = value;
		}else{
			// if value is maybe in format Date constructor can recognize
			this.date = new Date(value);
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

	proto.setInitialValue = function(value) {
		this.initialValue = value
	}

	proto.focus = function(){
		this.input.focus();
	};

});
