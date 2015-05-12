(function(mi2){

	var mi2Proto = mi2.prototype; // allow minimizer to shorten prototype assignments

	/** Add class to the element if condition is true, and remove if false. 
		@parameter toAdd - className to add/remove 
		@parameter condition - (true/false) determines if add/remove is executed. Usualy a result of an expression in the caller code. 
	*/
	mi2Proto.classIf = function(toAdd, condition){
		if(condition)
			this.addClass(toAdd);
		else
			this.removeClass(toAdd);
	};

	/*** Same as classIf but reversed condition. */
	mi2Proto.classUnless = function(toAdd, condition){ 
		this.classIf(toAdd, !condition); 
	};

	/** Add a css class to the element. Common function to initiate change defined in css. */
	mi2Proto.addClass = function(toAdd) {
		if( !this.el.className ) 
			this.el.className = toAdd;
		else if(!this.hasClass(toAdd))
			this.el.className += ' ' + toAdd;
	};

	/** Check if one of space separated values is in the element's className */
	mi2Proto.hasClass = function(name) {
			if(this.el.className == name) return true;
			var a = this.el.className.split(' ');
			for (var i = 0; i < a.length; i++) { if (a[i] == name) return true; }
			return false;
	};

	/** Remove a css class from the element (leaving others intact) */
	mi2Proto.removeClass = function(toRemove) {
		var newC = '';
		var a = this.el.className.split(' ');
		for (var i = 0; i < a.length; i++) {
			if (a[i] != toRemove) {
				if (i > 0)
					newC += ' ';
				newC += a[i];
			}
		}
		this.el.className = newC;
	};

})(mi2JS);