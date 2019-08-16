describe( 'Group.js', function () { 
	var mi2 = mi2JS;

	mi2JS.addCompClass('test/GroupTest', 'Base', '',
	function(proto, superProto, comp, superComp){
		var seq = 0;
		proto.initChildren = function(){
			superProto.initChildren.call(this);
			this.seq = ++seq;
			// console.log("CREATE."+this.seq);
		}
		proto.setValue = function(value){
			this.value = value;
			this.setText(value);
			// console.log('setValue', value, this.el.innerHTML, this.parent.el);
		};

		proto.getValue = function(value){
			return this.value;
		};
	});


	it('/ fetch + callback', function (){
		var v1 = mi2.NWGroup({});
		var v2 = new mi2.NWGroup({});

		// check if function is implemented so that it returns "new func(...)" when called without "new"
		expect( v1 instanceof mi2.NWGroup ).toBeTruthy();
		expect( v2 instanceof mi2.NWGroup ).toBeTruthy();
	});

	it('/ setValue getValue Object based', function (){
		var root = mi2.addComp(null, {tag: 'B', attr:{as:'Base'}});
		root.el.seq = 'ROOT';
		var data = { first: 'John', last:'Doe'};
		var tmp = {};
		for(var p in data){
			tmp[p] = mi2.addComp(root, {tag: 'B', attr:{as:'test/GroupTest'}});
		}

		expect(root.el.innerHTML).toEqual('<b as="test/GroupTest"></b><b as="test/GroupTest"></b>');

		var group = mi2.NWGroup(tmp);

		group.forEach(function(child, prop){
			child.setValue(data[prop]);
		});
		// chect inserted html
		expect(root.el.innerHTML).toEqual('<b as="test/GroupTest">John</b><b as="test/GroupTest">Doe</b>');

		// collect data
		var newData = group.forEachGet(function(child, prop){
			return child.getValue();
		});

		expect(newData).toEqual(data);

		// set value of last to undefined so it is not collected 
		group.getItem('last').setValue(undefined);

		// collect data
		newData = group.forEachGet(function(child, prop){
			return child.getValue();
		});

		expect(newData).toEqual({first:'John'});

	});


	it('/ setValue getValue Array based', function (){
		var root = mi2.addComp(null, {tag: 'B', attr:{as:'Base'}});
		var data = [ 'John', 'Doe' ];
		var tmp = [];
		for(var p in data){
			tmp[p] = mi2.addComp(root, {tag: 'B', attr:{as:'test/GroupTest'}});
		}

		expect(root.el.innerHTML).toEqual('<b as="test/GroupTest"></b><b as="test/GroupTest"></b>');

		var group = mi2.NWGroup(tmp);
		group.forEach(function(child, prop){
			child.setValue(data[prop]);
			// console.log('PROP.'+prop, child.el.parentNode == root.el, child.el.parentNode.seq, child.el.innerHTML, child.el.parentNode.innerHTML);
		});

		// chect inserted html
		expect(root.el.innerHTML).toEqual('<b as="test/GroupTest">John</b><b as="test/GroupTest">Doe</b>');

		// collect data
		var newData = group.forEachGet(function(child, prop){
			return child.getValue();
		});

		expect(newData).toEqual(data);

		// set value of last to undefined so it is not collected 
		group.getItem(1).setValue(undefined);

		// collect data
		newData = group.forEachGet(function(child, prop){
			return child.getValue();
		});

		expect(newData).toEqual(['John']);

	});



});