var extend = require('./extend.js');


var renderMixin =  require('./mixins/renderMixin.js');

var Document = extend(Object, function() {
  console.log('doc');
  this.createdAt = new Date();
}, renderMixin
);

var doc1 = new Document();

doc1.render(true);
