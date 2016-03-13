module.exports = function(Base, constructor) {
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
