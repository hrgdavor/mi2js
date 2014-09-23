describe( 'mi2.js Base library', function () { 
	var mi2 = mi2JS;

	describe( 'extend', function () { 

		function Animal(animal){
			this.animalName = animal;
		}

		// function declarations are processed before rest of the code in the scope
		// so we can call this before the function is declared in the code
		var DogSuper = mi2.extend(Dog, Animal);
		function Dog(name){
			Dog.superClass.constructor.call(this, 'Dog');
			this.dogName = name;
		}

		var HuskySuper = mi2.extend(Husky, Dog);
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

		it('superClass properties from consturction', function () {
			// if superClass constructor was not called, dog would not have this property
			expect(dog.animalName).toEqual('Dog');
			
			expect(husky.animalName).toEqual('Dog');
			expect(husky.dogName).toEqual('Husky');

		});

	});


});