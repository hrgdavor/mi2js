mi2JS.comp.add('base/RenderTable', 'Base', '<-TEMPLATE->',

// component initializer function that defines constructor and adds methods to the prototype 
function(comp, proto, superClass){
/*
data sample:  { offset:5, limit:5, rowcount:25, data: [{},{},{},{},{}] }
*/
	var mi2 = mi2JS;
	var $ = mi2.wrap;

	comp.constructor = function(el, tpl, parent){
		superClass.constructor.call(this, el, tpl, parent);

		this.noData.innerHTML = t(this.attr("no_data","no_data_to_display"));

		this.showPager = this.attr('show_pager','when_needed')// when_neede / always

		this.opts = {};
		this.listen(this.tbody.el,"click",this.rowClick);
		this.hideHeader = this.attr("hide_header");

		this.sortInline = true;
	};

	function tdFunc(func,def){
		if(!func) return def;
		if(typeof(func) == "string") return function(tr,td){td.innerHTML = func;};
		return func;
	}

	function defRender(tr,td,code, data, table){
		td.innerHTML = data[code] === null || typeof(data[code]) == 'undefined' ? '' : data[code];
	}

	function defTitle(tr,th,code,table){
		th.innerHTML = table.opts.title  ? t(table.opts.title) : t(code);
	}

	proto.defCompareFunc = function(d1,d2, code){
		if(d1[code] == d2[code]) return 0;
		if(d1[code] <  d2[code]) return -1;
		return 1;
	};

	function makeCompareFunc(self,func,code){
		return function(d1,d2){
			return func.call(self,d1,d2,code);
		};
	}

	proto.setup = function(optsIn){
		this.pager1.setup(optsIn.pager || {});
		this.pager2.setup(optsIn.pager || {});
		this.cols = optsIn.columns || {};
		this.pager1.classIf('hidden', optsIn.pager == 'hidden');
		this.pager2.classIf('hidden', optsIn.pager == 'hidden');
		var i=0;
		var tr = mi2.addTag(this.thead.el, "TR");
		var tr2 = mi2.addTag(this.thead.el,"TR");
		var span = 0;
		for(var code in this.cols){
			var th = mi2.addTag(tr,"TH");
			var opts = this.cols[code];
			th.code = code;
			if(opts.compareFunc) opts.sortable = 1;
			if(!opts.hasOwnProperty('sortable')) opts.sortable = optsIn.sortable;
			th.sortable =  opts.sortable;
			th.className = 'cell_'+code;
			if(opts.sortable){
				th.className = 'cell_'+code+" sortable";
				opts.compareFunc = opts.compareFunc || this.defCompareFunc; 
			} 

			opts.code = code; opts.index = i;

			opts.th = tdFunc(opts.th, defTitle);
			opts.td = opts.td || defRender;
			opts.th(tr,th,code,this);
			if(opts.group){
				var thGroup = mi2.addTag(tr,"TH","group");
				thGroup.innerHTML = opts.group.title;
				span = opts.group.span || 2;
				thGroup.setAttribute("colspan",span);
				$(th).addClass('group_first');
			}
			
			if(span > 0){
				if(span == 1) $(th).addClass('group_last');
				tr2.appendChild(th);
			}

			else th.setAttribute("rowspan",2);

			i++;
			span--;
		}
		if(this.hideHeader) this.thead.setVisible(false);
		this.listen(this.thead.el,"click",this.theadClick);
	};

	proto.theadClick = function(evt){
		var th = evt.target; if(th.tagName != 'TH') th = mi2.parent(th,'TH');
		// if it was asc(ascending) before the click, we will reverse it
		// this is also when is not sorted as well
		var asc = !$(th).hasClass("asc");
		this.sortBy(th,asc);
	};

	proto._findTh = function(code){
		var tr = mi2.child(this.thead.el,'TR');
		while(tr){
			var tmp = mi2.child(tr,'TH');
			while(tmp){
				if(tmp.code == code) return tmp;
				tmp = mi2.next(tmp,'TH');
			}
			tr = mi2.next(tr,'TR');			
		}
		return null;
	};

	proto.sortBy = function(th,asc){
		if(typeof th == "string") {
			var thNode = this._findTh(th);
			if(!thNode) return console.error('column not found '+th);
			else th = thNode;
		}
		this.sortColumn = th;
		if(th.sortable){
			var opts = this.cols[th.code];
			if(opts.compareFunc){
				var tmp = mi2.child(th.parentNode,'TH');
				while(tmp){
					if(tmp.sortable) tmp.className = "sortable";
					tmp = mi2.next(tmp,'TH');
				}
				th.className = asc ? "sortable asc": "sortable desc";
				this.applySort(th,opts, asc);
			}
		}
	};

	proto.applySort = function(th, opts, asc){
		if(this.tData && this.tData.data){
			this.tData.data.sort(makeCompareFunc(this, opts.compareFunc,th.code));
			if(!asc) this.tData.data.reverse();
		}
		if(this.tData)
			this.__update(this.tData);
	};

	proto.update = function(tData){
		this.tData = tData;

		if(this.sortColumn && this.sortInline){
			var asc = !$(this.sortColumn).hasClass("desc");
			this.sortBy(this.sortColumn,asc);
		}
		this.__update(tData);
		if(this.toBlink) this.blink(this.toBlink.col, this.toBlink.value);
	};

	proto.__update = function(tData){
		var empty = tData.data.length == 0;
		this.noData.classIf("hidden", !empty);
		this.data.classIf("hidden", empty);
		this.pager1.update(tData);
		this.pager2.update(tData);

		this.pager1.setVisible(this.showPager == 'always' ||  this.pager1.pagesCount > 1);
		this.pager2.setVisible(this.showPager == 'always' ||  this.pager2.pagesCount > 1);

		this.tbody.html('');
		for(var i=0; i<tData.data.length; i++){
			var row = tData.data[i];
			var tr = mi2.addTag(this.tbody.el,"TR","high");
			tr.data = tData.data[i];
			for(var code in this.cols){
				var td = mi2.addTag(tr,"TD",'cell_'+code);
				td.code = code;
				var opts = this.cols[code];
				opts.td(tr,td,code,tr.data,this);
			}
//			this.tbody ... save list
		}
	};

	proto.makeBt = function(action, text, param){
		return '<span class="tableBt" action="'+action+'" param="'+param+'">'+t(text || action)+'</span>';
	};

	proto.prepBlink = function(col, value){
		this.blink(col,value, true);
	};

	proto.blink = function(col, value, isBefore){
		
		if(isBefore) this.toBlink = {col:col, value: value};
		else this.toBlink = null;

		var tr = mi2.child(this.tbody.el,"TR");
		while(tr){
			if(tr.data[col] == value){
				if(isBefore){
					tr.style.opacity = '0';				
				}else
					$(tr).fadeIn();
				return;
			}
			tr = mi2.next(tr,"TR");
		}
	};

	proto.rowClick = function(evt, mouseDown){
		var bt = evt.target;
		var td = bt.tagName == 'TD' ? bt:mi2.parent(bt,'TD');
		var action = null, param = null;
		while(bt.tagName != 'TD' && !action ){
			action = bt.getAttribute("action");
			param = bt.getAttribute("param");
			bt=bt.parentNode;
		}
		if(! action ) action = "edit";
		var tr = mi2.parent(bt,"TR");
		this.parent.fireEvent("rowClick",{
			tr: tr, 
			data:tr.data, 
			td:td, 
			code:td.code, 
			action:action, 
			param:param, 
			src:this, 
			button:bt,
			domEvent: evt
		});
	};

	//we propagate all events to parent and add reference to self
	proto.fireEvent = function(name,evt){
		if(name == 'afterCreate') {
			superClass.prototype.fireEvent.call(this,name,evt);
			return;
		}
		evt = evt || {};
		evt.table = this;
		if (name == 'page'){
			evt.src = this;
		}

		if(this.parent.fireEvent)
			this.parent.fireEvent(name, evt);
	};

});

