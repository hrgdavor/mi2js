
mi2JS.addCompClass('base/CalendarWidget', 'Base', '<-TEMPLATE->',

// component initializer function that defines constructor and adds methods to the prototype 
function(proto, superProto, comp, superComp){

	var mi2 = mi2JS; // minimizer friendly 
	
	proto.construct = function(el, parent){
		// template is not pased because it will be used only if no inline template is defined
		superProto.construct.call(this, el, parent);
		this.dayOffset = 1;

		this.addClass('CalendarWidget');
	};

	proto.initChildren = function(){
		superProto.initChildren.call(this);

		this.listen(this.dayGrid.el,'mousedown','on_dayClick');

		this.year.trackChanges();
		this.month.trackChanges();

		this.listen(this.month,'change','on_selectChange');
		this.listen(this.year,'change','on_selectChange');

		this.date = new Date();

		this.initElements();
		var l = [this.done.el, this.year.el, this.month.el, this.today.el, this.done.el, this.clear.el];

		this.listen(this.el,'mousedown',function(evt){
			for(var i=0; i<l.length; i++) if(evt.target == l[i]) return;
			this.done.el.focus();
		});

		for(var i=0; i<l.length; i++){
			this.listen(l[i],'focus','fireFocus');
			this.listen(l[i],'blur','fireBlur');
		} 

	};

	proto.fireFocus = function(evt){
		this.fireEvent({name:'focus',domEvent:evt});
	};

	proto.fireBlur = function(evt){
		this.fireEvent({name:'blur',domEvent:evt});
	};

	proto.initElements = function(){
		// Date.getDay:  0 = Sunday
		var tr = mi2.addTag(this.dayNames.el,'TR');
		var names = this.dayNames.el.getAttribute('names').split(',');
		for(var i=0; i<7; i++){
			var wd = (i+this.dayOffset)%7;
			mi2.addTag(tr, {tag:'TH',attr:{'class':'day'+wd},html:names[wd]});
		}
		this.days = [];
		for(var r=0; r<6; r++){
			tr = mi2.addTag(this.dayGrid.el,'TR');
			for(var c=0; c<7; c++){
				this.days.push(mi2.addTag(tr,'TD'));
			}
		}

	};

	proto.on_selectChange = function(evt){
		this.setDate(this.year.getValue(), this.month.getValue());
	};

	proto.setDate = function(year,month,day){
		var d = this.date;
		if(!d) d = new Date(0,0,0,0,0,0,0);
		this.update(new Date(
			year || d.getFullYear(),
			// month can be zero so same trick can not be used like for year
			typeof(month) !== 'undefined' ? month : d.getMonth(),
			day || d.getDate(),
			d.getHours(),
			d.getMinutes(),
			d.getSeconds()
		));
	};

	proto.update = function(date){
		this.date = date;
		var now = new Date();
		if(!date ) date = now;

		var m1 = new Date(date.getFullYear(), date.getMonth(),1);
		var offset = (m1.getDay()-this.dayOffset+7)%7;
		if(offset === 0) offset = 7;
		var first = new Date(m1.getFullYear(), m1.getMonth(),1 - offset);
		var count = this.days.length;
		for(var i=0; i<count; i++){
			var td = this.days[i];
			var day = td.date = new Date(first.getFullYear(), first.getMonth(),first.getDate()+i);
			if(i<offset){
				td.className='prevMonth';
			}else if(day.getMonth() != date.getMonth()){
				td.className='nextMonth';
			}else{
				td.className='curMonth';
				
				if( this.date &&
					day.getDate() == date.getDate() &&
					day.getMonth() == date.getMonth()) 
					td.className += ' selected';
				
				if(day.getFullYear() == now.getFullYear() && 
					day.getMonth() == now.getMonth() && 
					day.getDate() == now.getDate())
					td.className += ' today';

			}
			td.className += ' day'+day.getDay();
			td.innerHTML = day.getDate();
		}

		var year = date.getFullYear();
		years = [];
		for(var i=year-5; i<year+5; i++){
			years.push(''+i);
		}
		this.year.setConfig(years);
		this.year.setValue(year);
		this.month.setValue(date.getMonth());

	};

	proto.on_dayClick = function(evt){
		var td = evt.target;
		if(td.tagName != 'TD') return;

		var d = td.date;
		this.setDate( d.getFullYear(), d.getMonth(), d.getDate() );
		this.on_done();
	};

	proto.on_done = function(evt){
		var date = this.date;
		if(evt && evt.action == 'clear') date = null;
		this.fireEvent({name:'dateSelected', widget: this, date:date, fireTo:'parent'});
	};

	proto.on_today = function(evt){
		var d = new Date();
		this.setDate( d.getFullYear(), d.getMonth(), d.getDate() );
		this.on_done();
	};

});
