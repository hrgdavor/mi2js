
mi2JS.addCompClass('base/ListScrollbar', 'Base', '<div></div>',

// component initializer function that defines constructor and adds methods to the prototype
function(proto, superProto, comp, mi2, h, t, filters){

	var mi2 = mi2JS;

	proto.initChildren = function(){
		superProto.initChildren.call(this);
 
		this.allData = this.data = this.chunk = [];
		this.limit = 0;
		this.offset = 0;
		this.scrollAmount = 0;
		this.filter = null;
		this.sort = null; 
		this.bar = this.el.firstElementChild;
		this.listen(this.el,'click');
		this.listen(this.el.parentNode,'mouseover', ()=>this.updateScroll);
		this.listen(this.bar,'mousedown');
		this.listen(document,'mousemove');
		this.listen(document,'mouseup');
		this.minLength = 20;
		this.endBuffer = 0;
		this.pivot = 0
		this.maxLimit = 50
	};

	proto.on_click = function(evt){
		if(evt.target == this.el){
			var rect = this.el.getBoundingClientRect();
			var len = this.data.length + this.endBuffer;
			var to = ((evt.pointerY()-rect.top)/this.el.offsetHeight);
			this.fireEvent({name:'scrollTo',pos:to});
			this.setOffset( Math.floor(to*len) );
			this.updateScroll();
		}
	};

	proto.on_show = function(evt){
		if(this.autoScroll && !this.skipResize) this.on_resize({});
	};

	proto.on_init = function(evt){
		this.setTimeout(()=>this.on_resize({}),100);
	};

	proto.on_mousedown = function(evt){
		evt.stop();
		this.addClass('scroll-moving');
		this.mousedown = true;
	};

	proto.on_mousemove = function(evt){
		if(!this.mousedown) return;
		evt.stop();
		var rect = this.el.getBoundingClientRect();
		var len = this.data.length + this.endBuffer;
		var to = ((evt.pointerY()-rect.top)/this.el.offsetHeight);
		this.setOffset( Math.floor(to*len) );		
	};

	proto.on_mouseup = function(evt){
		if(!this.mousedown) return;
		this.removeClass('scroll-moving');
		this.mousedown = false;
	};

	proto.setValue = function(offset,range,max){
		var hor = this.attr('direction') == 'horizontal';
		var style = this.bar.style;
		var maxSize = hor ? this.el.offsetWidth : this.el.offsetHeight;
		var len = Math.floor( (range/max)*maxSize );
		if(len<this.minLength){
			maxSize -= this.minLength;
			range = max/(maxSize)*this.minLength;
			len = this.minLength;
		} 
		var pos = Math.floor( ((offset+range)/max)*(maxSize))-len;
		if(hor){
			style.width = len+'px';
			style.left = pos+'px';
		}else{
			style.height = len+'px';
			style.top = pos+'px';
		}
	};

	proto.init = function(list, scrollAmount, autoScroll){
		this.list = list;
		this.scrollAmount = scrollAmount || 1;
		// FF
		this.listen(this.list.el.parentNode,'DOMMouseScroll',this.on_mousewheel);
		// other
		this.listen(this.list.el.parentNode,'mousewheel');

		this.autoScroll = autoScroll;
		if(autoScroll){
			this.listen(MAIN_APP, 'resizeContent', this.on_resize);
		}
	};


	proto.setPivot = function(pivot){
		this.pivot = pivot
		this.on_resize({skipUpdate:true})
	};

	proto.on_resize = function(evt){
		this.skipResize = true;
		
		this.list.setVisible(false);
		this.attr('hidden', true);
		var h = this.list.el.parentNode.offsetHeight;
		this.list.setVisible(true);
		this.attr('hidden', false);
		var limit = Math.min(Math.floor(h/this.autoScroll),this.maxLimit)
		if(this.autoScroll){
			this.el.style.height = ((limit-this.pivot)*this.autoScroll)+'px'
			this.el.style.marginTop = (this.pivot*this.autoScroll)+'px'
		} 
		if(limit) this.setLimit(limit); 
		if(!evt.skipUpdate) this.applyLimit();

		this.skipResize = false;
	};

	proto.on_mousewheel = function(evt){
		var dir = evt.deltaY || evt.detail;
		// this.moveOffset(this.limit * (dir > 0 ? 1:-1) );
		if(this.moveOffset(this.scrollAmount * (dir > 0 ? 1:-1) ))
			evt.stop();
	};

	proto.updateScroll = function(data){
		cancelAnimationFrame(this._updateScroll_timer);
		this._updateScroll_timer = this.requestAnimationFrame(function(){		
			var len = this.data.length + this.endBuffer;
			var vis = this.limit < len;
			this.skipResize = true;
			if(this.isVisible() != vis) this.setVisible(vis);
			this.skipResize = false;
			this.setValue( this.offset, this.limit, len );
		    if(data && this.list) this.list.setValue(this.chunk)
		    if(data) this.fireEvent({name: 'afterUpdate', list:this.list, listData:data})

		});
	};


	function makeAsc(column){
		return function(a,b){
			if (a[column] == b[column]) return 0; 
			return a[column] > b[column] ? 1:-1; 
		}
	}

	function makeDesc(column){
		return function(a,b){
			if (a[column] == b[column]) return 0; 
			return a[column] > b[column] ? -1:1; 
		}
	}
	
	proto.setOrderColumn = function(order){
		if(order){
			this.setSort( order[1] == 'DESC' ?  makeDesc(order[0]) : makeAsc(order[0]));
		}else{
			this.setSort(null);
		}
	};

	proto.newData = function(allData){
	    this.allData = allData || [];
	    this.applySort();
	    this.applyFilter();
	    this.applyLimit();
	};

	proto.moveOffset = function(move){
		return this.setOffset(this.offset + move);
	};

	proto.setOffset = function(offset, limit){
		var old = this.offset;
		this.offset = offset;
		if(limit !== void 0) this.limit = limit;
		this.applyLimit();
		return old != this.offset;
	};

	proto.setLimit = function(limit){
	  this.limit = limit;
	  this.applyLimit();
	};

	proto.setFilter = function(filter){
	  this.filter = filter;
	  this.applyFilter();
	  this.applyLimit();
	};

	proto.setSort = function(sort){
	  this.sort = sort;
	  this.applySort();
	  this.applyFilter();
	  this.applyLimit();
	};

	proto.applySort = function(){
	  if(this.sort) this.allData.sort(this.sort);
	};

	proto.applyFilter = function(){
	    if(this.filter){
	      this.data = this.allData.filter(this.filter);
	    }else{
	      this.data = this.allData;
	    }  
	};

	proto.applyLimit = function(){
	    var data = this.data;
	    var len = data.length + this.endBuffer
	    if(len > this.maxLimit){
	    	this.limit = this.maxLimit
	    } 
	    if(this.limit){
	      if(this.limit + this.offset > len) this.offset = len - this.limit;
	      if(this.offset < 0) this.offset = 0;
	      let offset = this.offset
	      var to = this.offset + this.limit
	      let chunk = this.data.slice(this.offset, to)


	      for(let i = this.pivot-1; i>=0; i--){
	      	if(i<offset) chunk.unshift(data[i])
	      }

	      if(chunk.length > this.limit){
	      	chunk.length = this.limit
	      }
	      this.chunk = chunk 
	    }else{
	      this.chunk = this.data;
	    }
	    this.updateScroll(this.chunk)
	};


	proto.makeIndexVisible = function(idx){
		if(!(idx >= this.offset && idx<this.offset+this.limit)){
			this.setOffset(Math.round(idx-this.limit/2));
		}
	};

});