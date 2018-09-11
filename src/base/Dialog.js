
mi2JS.addCompClass('base/Dialog', 'Base', '<div class="dialog-inner"> <div class="dialog-title" p="title"></div> <div class="dialog-content" p="content"></div> <div class="dialog-buttons" p="buttons" as="base/Loop"><button template as="base/Button" event="close"></button></div> </div>',

// component initializer function that defines constructor and adds methods to the prototype
function(proto, superProto, comp, superComp){

	var mi2 = mi2JS;

	proto.initChildren = function(){
		superProto.initChildren.call(this);
		
		this.listen(document.body,'keyup', function(evt){
			if(evt.keyCode == 27){
				if(this.isVisible() && this.hasCancel) this.on_close({action:'cancel'});
			}
		});
	};

	proto.show = function(params){
		this.callback = params.callback;
		var title = params.title || '';
		var content = params.content || '';
		var buttonClass = params.buttonClass;
		var buttons = params.buttons || [{action:'ok'},{action:'cancel'}];
		// button: {action: 'ok', text: t('ok'), 'class':''}

		this.title.setText(title);
		if(typeof(content) == 'string'){
			this.content.setText(content);
		}else{
			this.content.el.innerHTML = '';
			if(content instanceof mi2) content = content.el;
			this.content.el.innerHTML = '';
			this.content.el.appendChild(content);
		}

		this.buttons.setValue([]);
		this.hasCancel = false;
		for(var i=0; i< buttons.length; i++){
			var text = buttons[i].text || mi2.t(buttons[i].action);
			this.buttons.push(text);
			var button = this.buttons.getItem(i);
			if(buttons[i].action == 'cancel') this.hasCancel = true;
			button.setText(text);
			button.attr('action', buttons[i].action);
			button.attr('class',  buttons[i]['class'] || buttonClass);
		}
		this.setVisible(true);

		if(buttons.length > 0){
			this.setTimeout(function(){
				var button = this.buttons.getItem(0);
				console.log('button.el.focus', button.el.focus);
				button.el.focus();
			},100);

		} 
	};

	proto.on_close = function(evt){
		this.setVisible(false);
		if(this.callback){
			this.callback(evt.action);
		}
	};

});