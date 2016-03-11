var Document = function() {
  console.log('doc');
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

var extend = function(Base, constructor, extensions) {
  var Offspring;

  Offspring = function() {
    this.parent();
    constructor.apply(this);
  };
  Offspring.prototype = Base.prototype;
  Offspring.prototype.parent = Base.prototype.constructor;

  for (var key in extensions) {
    Offspring.prototype[key] = extensions[key];
  }

  return Offspring;
};

var Note = extend(Document, function() {
  console.log('note');
  this.maxPages = 10;
}, {
  addPage: function() {
  }
});

var specialNote = extend(Note, function() {
  console.log('note');
  this.maxPages = 10;
});

var note1 = new Note();

note1.render(true);
