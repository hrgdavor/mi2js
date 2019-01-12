describe( 'mi2.js Base library', function () { 
	var $ = mi2= mi2JS;

	describe( 'extend', function () { 

		function Animal(animal){
			this.animalName = animal;
		}

		// function declarations are processed before rest of the code in the scope
		// so we can call this before the function is declared in the code
		var DogSuper = $.extend(Dog, Animal);
		function Dog(name){
			Dog.superClass.constructor.call(this, 'Dog');
			this.dogName = name;
		}

		var HuskySuper = $.extend(Husky, Dog);
		function Husky(){
			// alternative aproach and minimizer friendly version
			// HuskySuper is identical to Husky.superClass
			HuskySuper.constructor.call(this, 'Husky');
		}

		var dog = new Dog();
		var husky = new Husky();


		it('superClass propper prototype', function () {
			expect(Dog.superClass).toEqual(Animal.prototype);
			expect(Dog.superClass).toEqual(DogSuper);
			
			expect(Husky.superClass).toEqual(Dog.prototype);
			expect(Husky.superClass).toEqual(HuskySuper);

			expect(Husky.superClass.prototype).toEqual(Husky.prototype.prototype);
		});

		it('instanceof', function () {
			expect(dog instanceof Animal).toBeTruthy();
			expect(dog instanceof Dog   ).toBeTruthy();

			expect(husky instanceof Animal).toBeTruthy();
			expect(husky instanceof Dog   ).toBeTruthy();
			expect(husky instanceof Husky ).toBeTruthy();
		});

		it('superClass properties from construction', function () {
			// if superClass constructor was not called, dog would not have this property
			expect(dog.animalName).toEqual('Dog');
			
			expect(husky.animalName).toEqual('Dog');
			expect(husky.dogName).toEqual('Husky');

		});

	});

	it(' / wrapper', function () {

		var node = document.createElement('DIV');
		var v1 = $(node);
		var v2 = new $(node);

		// check if $ function is implemented so that it returns "new $(node)" when called without "new"
		expect( v1 instanceof $ ).toBeTruthy();
		expect( v2 instanceof $ ).toBeTruthy();
	});

	it(' / find', function () {
		var node = document.createElement('DIV');
		node.innerHTML = '<a></a><b></b><i></i>';

		var a = $.find('A',node);
		expect(node.getElementsByTagName('A')).not.toBeNull();// case insensitive in HTML
		expect(node.getElementsByTagName('A').length).toEqual(1);
		expect(a).not.toBeNull();
		expect(a.tagName).toEqual('A');

	});

	it(' / copy & update', function () {
		expect($.copy([1,2])).toEqual([1,2]);
		expect($.copy([1,2],void 0)).toEqual([1,2]);
		expect($.copy([1,2],[3])).toEqual([1,2,3]);

		var arr = [1,2];
		$.update(arr,[3]);
		expect(arr).toEqual([1,2,3]);
		
		var orig = {a:1,b:2};
		var copy = mi2.copy(orig);
		copy.a=2;
		expect(orig).toEqual({a:1,b:2});
		expect(copy).toEqual({a:2,b:2});
		
		expect(mi2.copy(orig,{c:3},{d:4})).toEqual({a:1,b:2,c:3,d:4});

		mi2.update(copy,{c:2});
		expect(copy).toEqual({a:2,b:2,c:2});


	});

	it(' / extractDirectives', function () {
		// console.log('mi2.directives',mi2.directives);

		var dirs = mi2.extractDirectives({'x-click':'test1', x:'test2'});

		expect(dirs.x.click).toEqual('test1');

	});

});