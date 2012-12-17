var t = require('./tree.js');

var ygg = t.create();

console.log(ygg);

ygg.add('/',{t: 123});

ygg.walk(function(a,b){
	console.log(a+b+'bar'+this.id);
}, ['foo', 'bar'])
