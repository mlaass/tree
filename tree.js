var branch = {
	value: null,
	parent: null,
	root: null,
	id: null,
	children: [],
	address: {
		set: function(value){
			throw new Error("Cannot set address");
		},
		get: function(){
			if(this.id === ''){
				return '';
			}else{
				return this.parent.address+'/'+this.id;
			}
		}
	},
	walk: function(fn, args){
		fn.apply(this, args);
		for( var i in this.children){
			this.children[i].walk(fn, args);
		}
	},
	walkDown: function(fn, args){
		for( var i in this.children){
			this.children[i].walkDown(fn, args);
		}
		fn.apply(this, args);
	},
	add: function(where, what){
		return this.exec(where, function(){
			var b = Object.create(branch);
			what['#branch'] = b;
			b.value = what;
			b.root = this.root;
			b.parent = this;
			b.children = [];
			b.id = this.children.length;
			this.children.push(b);
		});
	},
	exec: function(where, fn){
		if(typeof fn !== 'function'){
			throw new Error('Second parameter must be a function');
		}

		var i = where.indexOf('/');

		//check if slash on first place
		if(i === 0){
			where = where.substring(1);
			i = where.indexOf('/');
		}
		//we are there
		if(i === -1){
			return fn.call(this);
		}else{
			//traverse up the tree
			var n = where.substring(0, i);
			this.children[n].exec(where.substring(i+1), fn);
		}
	},
	remove: function(where){
		this.exec(where, function(){
			this.parent.children.splice(this.id, 1);
			this.parent.updateChildrenIds();
			return true;
		});
	},
	updateChildrenIds: function(){
		for( var i in this.children){
			this.children[i].id = i;
		}
	}
};

module.exports = {
	create: function( rootObject){
		var root = Object.create(branch);
		root.id= '';
		root.parent = root;
		root.root = root;
		root.value = rootObject;
		return root;
	}
};
