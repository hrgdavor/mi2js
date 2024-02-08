
mi2JS.addCompClass('base/ListScrollbar', 'Base', '<div></div>',

// component initializer function that defines constructor and adds methods to the prototype
function(proto, superProto, comp, mi2, h, t, filters){

	const win = window

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
		this.listen(this.bar,'mousedown');
		this.listen(document,'mousemove');
		this.listen(document,'mouseup');
		this.minLength = 20;
		this.endBuffer = 2;
		this.pivot = 0
		this.maxLimit = 50
		this.heightOffset = mi2.num(getComputedStyle(this.el).getPropertyValue('--scroll-offset'))
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
		if(this.autoScroll && !this.skipResize && !win.observeResize) this.on_resize({});
	};

	proto.on_init = function(evt){
		if(!win.observeResize) this.setTimeout(()=>this.on_resize({}),100);
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
		maxSize -= this.heightOffset

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

	proto.init = function(list, scrollAmount, autoScroll, doCeil){
		this.listen(this.el.parentNode,'mouseover', ()=>this.updateScroll);
		if(win.observeResize && autoScroll){
			win.observeResize(list.el.parentNode,e=>this.newResize(e))
		}
		this.list = list;
		this.doCeil = doCeil
		if(list.el.style) list.el.style.touchAction = 'none'
		this.scrollAmount = scrollAmount || 1;
		// FF
		this.listen(this.list.el.parentNode,'DOMMouseScroll',this.on_mousewheel);
		this.listen(this.list.el.parentNode,'touchstart',this.on_touchStart);
		this.listen(this.list.el.parentNode,'touchend',this.on_touchEnd);
		this.listen(this.list.el.parentNode,'touchmove',this.on_touchMove);
		// other
		this.listen(this.list.el.parentNode,'mousewheel');

		this.touchStartY = null
		this.onTouchOffest = 0
		this.touchMoveSteps = 0
		this.animationRequested = false

		this.autoScroll = autoScroll
		if(autoScroll){
			if(!win.observeResize)this.listen(MAIN_APP, 'resizeContent', this.on_resize);
		}
	};


	proto.setPivot = function(pivot){
		if(pivot !== this.pivot){
			this.pivot = pivot
			this.on_resize({skipUpdate:true})
		}
	};

	proto.newResize = function(evt){
		const h = evt.contentRect.height
		var limit = Math.min(Math[this.doCeil ? 'ceil':'floor'](h/this.autoScroll),this.maxLimit)
		console.log('evt.contentRect', evt.contentRect)
		console.log('limit', limit, this.autoScroll)
		if(this.autoScroll && limit){
			this.el.style.height = ((limit-this.pivot)*this.autoScroll)+'px'
			this.el.style.marginTop = (this.pivot*this.autoScroll)+'px'
		}else{
			this.el.style.height = this.oldH+'px'
		}

		if(limit){
			this.setLimit(limit);
		}else{
			this.applyLimit();
		}
	};

	proto.on_resize = function(evt){
		if(this.skipResize) return
		this.skipResize = true;

		this.list.setVisible(false);
		this.attr('hidden', true);
		this.oldH = this.el.offsetHeight
		this.el.style.height = '1px'
		// console.error('X this.list.el.parentNode.offsetHeight', this.list.el.parentNode.offsetHeight, this.list.el.parentNode)
		this.setTimeout(()=>{
			var h = this.list.el.parentNode.offsetHeight;
			var limit = Math.min(Math.floor(h/this.autoScroll),this.maxLimit)
			// console.error('Y this.list.el.parentNode.offsetHeight', this.list.el.parentNode.offsetHeight, this.list.el.parentNode)
			this.list.setVisible(true);
			this.attr('hidden', false);
			if(this.autoScroll && limit){
				this.el.style.height = ((limit-this.pivot)*this.autoScroll)+'px'
				this.el.style.marginTop = (this.pivot*this.autoScroll)+'px'
			}else{
				this.el.style.height = this.oldH+'px'
			}

			if(limit){
				this.setLimit(limit);
			}else{
				if(!evt.skipUpdate) this.applyLimit();
			}

			this.skipResize = false;
		},100);

	};

	proto.on_touchStart = function(evt) {
		this.touchStartY = evt.touches[0].clientY;
		this.onTouchOffest = this.offset
		this.touchMoveSteps = 0
		this.fakeMovePx = 0
		this.animationRequested = false
	}

	proto.on_touchEnd = function(evt) {
		this.touchStartY = 0
		this.fakeMovePx = 0
		this.callAnim()
	}

	proto.callAnim = function(){
		if (this.animationRequested)  return
		this.animationRequested = true
		requestAnimationFrame(() => {
			let newOffset = this.onTouchOffest + this.touchMoveSteps
			let fakeMovePx = this.fakeMovePx
			if(newOffset < 0) fakeMovePx = fakeMovePx / 2.5
			if(newOffset < -1){
				fakeMovePx = this.autoScroll / 2.5
				newOffset = 0
			}
			if(!this.touchStartY) fakeMovePx = 0
			this.setOffset(this.onTouchOffest + Math.floor(this.touchMoveSteps))
			this.list.el.style.transition = this.touchStartY ? '':'margin 0.5s'
			this.list.el.style.marginTop = (fakeMovePx)+'px'
			this.animationRequested = false
		})
	}

	proto.on_touchMove = function (evt) {
		evt.preventDefault()
		evt.stop()
		if (!this.touchStartY) {
			return
		}

		var yPosition = evt.touches[ 0 ].clientY
		var yDiff = Math.round(this.touchStartY - yPosition)
		this.touchMoveSteps = Math.floor(yDiff / this.autoScroll)
		this.fakeMovePx = (yDiff % this.autoScroll) * -1
		this.callAnim()
	}

	proto.on_mousewheel = function(evt){
		var dir = evt.deltaY || evt.detail;
		requestAnimationFrame(() => {
			this.moveOffset(this.scrollAmount * (dir > 0 ? 1:-1) )
		})
		// todo calculate if move will happen and prevent default only then
		// this allows scrolling further of the parent when chil has no more content to scroll
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
			const valA = typeof a[column] == 'string' ? a[column].toLowerCase() : a[column]
			const valB = typeof b[column] == 'string' ? b[column].toLowerCase() : b[column]
			if (valA == valB) return 0;
			return valA > valB ? 1:-1;
		}
	}

	function makeDesc(column){
		return function(a,b){
			const valA = typeof a[column] == 'string' ? a[column].toLowerCase() : a[column]
			const valB = typeof b[column] == 'string' ? b[column].toLowerCase() : b[column]
			if (valA == valB) return 0;
			return valA > valB ? -1:1;
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
	    let limit = this.limit

	    if(len > this.maxLimit && !limit){
	    	limit = this.maxLimit
	    }

	    if(limit){
	      if(limit + this.offset > len) this.offset = len - limit;
	      if(this.offset < 0) this.offset = 0;
	      let offset = this.offset
	      var to = this.offset + limit
	      let chunk = this.data.slice(this.offset, to)


	      for(let i = this.pivot-1; i>=0; i--){
	      	if(i<offset) chunk.unshift(data[i])
	      }

	      if(chunk.length > limit){
	      	chunk.length = limit
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