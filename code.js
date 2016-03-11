var extend = function(Base, constructor) {
  var mixins = Array.prototype.slice.call(arguments, 2);

  var Offspring;

  Offspring = function() {
    this.parent();
    constructor.apply(this);
  };
  Offspring.prototype = Base.prototype;
  Offspring.prototype.parent = Base.prototype.constructor;

  mixins.forEach(function(mixin) {
    for (var key in mixin) {
      Offspring.prototype[key] = mixin[key];
    }
  });

  return Offspring;
};

var pageMixin = {
  addPage: function() {
  },
  removePage: function() {
  }
};

var persistMixin = {
  save: function() {
  },
  reload: function() {
  }
};

var renderMixin = {
  render: function(renderFunctions) {
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
  }
};

var Document = extend(Object, function() {
  console.log('doc');
  this.createdAt = new Date();
}, renderMixin
);

var Note = extend(Document, function() {
  console.log('note');
  this.maxPages = 10;
}, pageMixin, persistMixin
);

var specialNote = extend(Note, function() {
  console.log('specialnote');
  this.maxPages = 10;
});

var note1 = new Note();

note1.render(true);
