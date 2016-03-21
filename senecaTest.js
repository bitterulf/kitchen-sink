var seneca = require('seneca')();
var Promise = require('bluebird');
var extend = require('extend');

seneca.add({role: 'tax', cmd: 'salestax'}, function (msg, respond) {
  respond(null, {value: msg.value + (msg.steps || 1) });
});

var createSenecaPromise = function(config) {
return Promise.promisify(
    function(data, cb) {
      extend(data, config);
      seneca.act(data, cb);
    }
  );
};

var salesTax = function(data, cb) {
  seneca.act({role: 'tax', cmd: 'salestax', data: data}, cb);
};

var salesTaxProm = createSenecaPromise({role: 'tax', cmd: 'salestax', steps: 2});
var salesTaxProm2 = createSenecaPromise({role: 'tax', cmd: 'salestax'});

salesTaxProm({value: 10})
  .then(salesTaxProm)
  .then(salesTaxProm2)
  .then(function(result){
  console.log('res', result);
});
