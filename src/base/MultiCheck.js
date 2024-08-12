mi2JS.addCompClass('base/MultiCheck', 'base/InputBase', '',

	// component initializer function that defines constructor and adds methods to the prototype 
	function(proto, superProto, comp, mi2, h, t, filters){
	
		var mi2 = mi2JS;
	
		if(mi2JS.applyNwGroup){
			mi2JS.applyNwGroup(proto, {setValue:1,getValue:1});
		}else
			mi2JS.mixin(comp,mi2JS.NWGroup);
	
	
		proto.itemTpl = {tag:'BUTTON'};
	
		proto.construct = function(el, parent){
			this.items = {};
			superProto.construct.call(this, el, parent);
		};
	
		proto.initChildren = function(){
			this.listen(this.el,'click');
			superProto.initChildren.call(this);
			this.mapItems(this.el.children);
			this.noTitle = this.attrBoolean("no-title");
			this.textWCount = this.attrBoolean("text-count");
			if(this.isReadOnly()) this.setReadOnly(true);
		}
	
		proto.mapItems = function(it){
			var id, nw;
			for(var i=0; i<it.length; i++){
				nw = this.findRef(it[i]);
				id = nw.dataAttr('id');
				if(id !== null){
					this.items[id] = nw;
				}else if(it[i].children){
					this.mapItems(it[i].children)
				}
			}
		};
	
		proto.setReadOnly = function(v){
			superProto.setReadOnly.call(this,v);
			this.callFunc('attr',['readonly',v ? '':null]);
		};
	
		proto.on_click = function(evt){
			if(this.isReadOnly() || !this.isEnabled()) return;
			let evtTarget = evt.target
			let targetClass = evt.target.getAttribute('class')
			if(targetClass && targetClass == 'btn-text') evtTarget = evt.target.parentNode
	
			var target = this.getItem(evtTarget);
			if(target){
				if(this.attrBoolean('single-value')){
					var sel = target.dataAttr('id');
					if (sel == this.getRawValue() && this.attrBoolean('no-empty')) return
					
					if(sel == this.getRawValue() && !this.attrBoolean('required')) sel = '';
					this.selectedIs(sel);
				}else{
					target.setSelected(!target.isSelected());
				}
				this.fireIfChanged();
			}
		};
	
		proto.setConfig = function(data){
			// NodeWrapper is cheap, so we discard the old ones
			mi2.clearNode(this.el)
			this.items = {};
			// allow key:value object or array of {id:'',text:''} objects
			var isArray = data instanceof Array;
			for(var p in data){
				var id = isArray ? data[p].id : p;
				var item = mi2.add(this.el, this.itemTpl);
				item.dataAttr('id', id);
				item.attr('icon', data[p].icon)
				item.attr('class', data[p].class)
				if(!this.noTitle) item.attr('x-title', data[p].title);
				item.setText(   isArray ? (data[p].text || data[p].name)  : data[p]);
				if(data[p].count) {
					let elCount = []
					if(this.textWCount) {
						elCount.push(h("span", { "class": "btn-text" }, data[p].text || data[p].name))
					}
					elCount.push(h("span", { "class": "count" }, data[p].count + ''))
					mi2.replaceHtml(item.el, elCount)
				}
				if(data[p].disabled) item.attr('disabled', true);
				this.items[id] = item;
			}
	
			if (!this.items || !Object.keys(this.items).length && this.attr('no-data-message')) {
				let elem = mi2.add(this.el, {tag:'DIV'})
				elem.setText(t(this.attr('no-data-message')))
			}
		};
	
		proto.setRawValue = function(value){
			this.selectedIs( value );
		};
	
		proto.getRawValue = function(value){
			var ret = [];
			this.forEach(function(item){
				if(item.isSelected()) ret.push(item.dataAttr('id'));
			});
	
			if(this.attrBoolean('single-value')) ret = ret[0];
	
			return ret;
		};
	
		proto.setRelated = function (component, fieldName) {
			this.relatedComponent = component
			this.relatedFieldName = fieldName
			this.listen(component, 'change', evt => {
				this.reloadData()
			})
		}
	
		proto.setCacheKey = function(key) {
			this.cackeKey = key
		}
	
		proto.reloadData = function() {
			let data = MAIN_APP.entityCache.allLists[this.cackeKey]
			data = data ? this.getActive(data) : data
			
			if (!this.relatedComponent) {
				this.setConfig(data)
	
				return
			}
	
			const relatedValue = this.relatedComponent.getValue()
			if (!relatedValue || (Array.isArray(relatedValue) && !relatedValue.length)) {
				this.setConfig([])
	
				return
			}
	
			data = UccUtil.filterOptions(data, this.relatedFieldName, relatedValue)
			this.setConfig(data)
		}
	
		proto.markCustomValid = function (isValid) {
			this.classIf('validation-error', !isValid)
			this.classIf('required', !isValid)
			this.attr('validation-error-message', isValid ? null : mi2.validationMessage({ message: 'required' }));
		}
	
		proto.markValidate = function() {
		}
	
		proto.getActive = function(data){
			return data.filter(item => item.deleted == 0)
		}
	
		proto.getCounts = function(){
			let ret = []
			this.forEach(function(item){
				let el = item.el
				if(item.isSelected()) ret.push({id: item.dataAttr('id'), count: el.querySelector('.count').innerText})
			})
	
			if(this.attrBoolean('single-value')) ret = ret[0]
	
			return ret
		};
	
	});
	