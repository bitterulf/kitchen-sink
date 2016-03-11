var Document = function() {
  this.createdAt = new Date();
};

Document.prototype.render = function(renderFunctions) {
  function isFunction(functionToCheck) {
   var getType = {};
   return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  console.log('----');
  for (var key in this) {
    if (renderFunctions || !isFunction(this[key])) {
      console.log(key, this[key], this.hasOwnProperty(key));
    }
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
