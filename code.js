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

var extend = function(Base, constructor) {
  var extensions = Array.prototype.slice.call(arguments, 2);

  var Offspring;

  Offspring = function() {
    this.parent();
    constructor.apply(this);
  };
  Offspring.prototype = Base.prototype;
  Offspring.prototype.parent = Base.prototype.constructor;

  extensions.forEach(function(extension) {
    for (var key in extension) {
      Offspring.prototype[key] = extension[key];
    }
  });

  return Offspring;
};

var Note = extend(Document, function() {
  console.log('note');
  this.maxPages = 10;
}, {
  addPage: function() {
  }
},
{
  removePage: function() {
  }
}
);

var specialNote = extend(Note, function() {
  console.log('note');
  this.maxPages = 10;
});

var note1 = new Note();

note1.render(true);
