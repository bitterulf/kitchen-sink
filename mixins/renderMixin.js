module.exports = {
  render: function(renderFunctions) {
    function isFunction(functionToCheck) {
     var getType = {};
     return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    console.log('----');
    for (var key in this) {
      if (key != 'parent' && (renderFunctions || !isFunction(this[key])) ) {
        console.log(key, this[key], this.hasOwnProperty(key));
      }
    }
  }
};
