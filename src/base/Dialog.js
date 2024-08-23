mi2JS.addCompClass('base/Dialog', 'Base', '<div class="dialog-inner" p="innerContainer"> <div p="dragContainer"></div> <div class="dialog-title" p="title"></div> <div class="dialog-content" p="content"></div> <div class="dialog-buttons" p="buttons" as="base/Loop"><button template as="base/Button" event="close"></button></div> </div>',

// component initializer function that defines constructor and adds methods to the prototype
function(proto, superProto, comp, mi2, h, t, filters){

	proto.initChildren = function(){
		superProto.initChildren.call(this);
		
		this.baseClass = this.el.className
		this.listen(document.body,'keyup', function(evt){
			if(evt.keyCode == 27){
				if(this.isVisible() && this.hasCancel) this.on_close({action:'cancel'});
			}
		});
		this.isDragging = false;
		this.initDrag();
	};

	proto.initDrag = function() {
		const innerContainer = this.innerContainer.el;
		let offsetX = 0;
		let offsetY = 0;
		const onMouseDown = (e) => {
			if (e.target.getAttribute('p') === 'dragContainer') {
				this.isDragging = true;
				offsetX = e.clientX - innerContainer.offsetLeft;
				offsetY = e.clientY - innerContainer.offsetTop;
				document.addEventListener('mousemove', onMouseMove);
				document.addEventListener('mouseup', onMouseUp);
			}
		};

		const onMouseMove = (e) => {
			if (this.isDragging) {
				innerContainer.style.position = 'fixed';
				innerContainer.style.left = (e.clientX - offsetX) + 'px';
				innerContainer.style.top = (e.clientY - offsetY) + 'px';
			}
		};

		const onMouseUp = () => {
			this.isDragging = false;
			document.getElementById('guiScreen').style.pointerEvents = 'all'
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		};

		this.enableDragging = () => {
			innerContainer.addEventListener('mousedown', onMouseDown);
		};

		this.disableDragging = () => {
			this.isDragging = false;
			innerContainer.removeEventListener('mousedown', onMouseDown);
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		};
	};

	proto.show = function(params){
		this.expandVars({});
		this.params = params;
		var title = params.title || '';
		var content = params.content || '';
		var buttonClass = params.buttonClass;
		var contentClass = params.contentClass || '';
		var dialogClass = params.dialogClass || '';
		var innerClass = params.innerClass || '';
		var buttons = params.buttons || [{action:'ok'},{action:'cancel'}];
		// button: {action: 'ok', text: t('ok'), 'class':''}

		this.title.setContent(title);
		this.content.el.className = 'dialog-content '+contentClass;
		this.innerContainer.el.className = 'dialog-inner '+innerClass;
		this.el.className = this.baseClass +' '+ dialogClass;
		this.content.setContent(content);

		this.buttons.setValue([]);
		this.hasCancel = false;
		for(var i=0; i< buttons.length; i++){
			var button = buttons[i];
			if(typeof button == 'string') button = {action:button};
			var text = button.text || mi2.t(button.action);
			this.buttons.push(text);
			if(button.action == 'cancel') this.hasCancel = true;

			var item = this.buttons.getItem(i);
			if (button.icon) {
				text = button.text || '';
				item.attr('icon', button.icon);
			}

			if (button.xTitle) {
				item.attr('x-title', button.xTitle);
			}

			item.setContent(text);
			item.attr('action', button.action);
			item.attr('class',  button['class'] || buttonClass);
		}
		this.setVisible(true);

		if(buttons.length > 0){
			this.setTimeout(function(){
				var button = this.buttons.getItem(0);
				button.el.focus();
			}, 10);
		}
		
		this.innerContainer.el.style.position = 'relative'
		this.innerContainer.el.style.top = 'inherit'
		this.innerContainer.el.style.left = 'inherit'
		this.innerContainer.el.style.transform = 'none'
		
		if(params.isDraggable){
			const innerContainer = this.innerContainer.el;
			innerContainer.style.position = 'fixed'
			innerContainer.style.left = '50%'
			innerContainer.style.top = '50%'
			innerContainer.style.transform = 'translate(-50%, -50%)'
			this.enableDragging();
		} else {
			this.disableDragging();
		}
	};

	proto.on_close = function(evt){
		var resp = evt.action;
		var params = this.params;
		if(params.callback){
			if(params.callback(evt.action) !== false){
				this.setVisible(false);
			}
		} else if(params['callback_'+resp]){
			if(params['callback_'+resp](evt.action) !== false){
				if (!this.params.skipAutoClose) {
					this.setVisible(false);
				}
			}
		} else {
			this.setVisible(false);
		}
	};

    proto.initTemplate = function(h2, t2, state, self) {
      return h2(
        "div",
        { "class": "dialog-inner", p: "innerContainer" },
        h2("div", { p: "dragContainer" }),
        h2("div", { "class": "dialog-title", p: "title" }),
        h2("div", { "class": "dialog-content", p: "content" }),
        h2(
          "div",
          { "class": "dialog-buttons", p: "buttons", as: "base/Loop" },
          h2("button", { template: true, as: "base/Button", event: "close" })
        )
      );
    }
});
