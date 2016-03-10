var Document = function() {
  this.createdAt = new Date();
};

Document.prototype.template = 'default';

Document.prototype.init = function() {
  console.log('document init');
  this.createdAt = new Date();
};

Document.prototype.open = function() {

};

Document.prototype.render = function() {
  console.log('----');
  for (var key in this) {
    console.log(key, this[key], this.hasOwnProperty(key));
  }
};

var extend = function(Base, constructor) {
  var Offspring = function() {
    this.parent();
    constructor.apply(this);
  };
  Offspring.prototype = Base.prototype;
  Offspring.prototype.parent = Base.prototype.constructor;

  return Offspring;
};

var Note = extend(Document, function() {
  this.maxPages = 10;
});

Note.prototype.addPage = function() {

};

var note1 = new Note();

note1.render();

