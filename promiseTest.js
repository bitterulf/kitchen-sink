var Promise = require('bluebird');


var examplePromise = Promise.promisify(function(data, cb) {
  cb(null);
});
var examplePromise2 = Promise.promisify(function(data, cb) {
  cb(null);
});

var bundle = Promise.promisify(function(data, cb) {
  console.log('calling bundle');
  examplePromise({})
  .then(examplePromise2)
  .then(function() {
    cb(null);
  }).catch(function(error) {
    cb(error);
  });
});

var getStuff = Promise.promisify(function(data, cb) {
  cb(null, 'stuff');
});

Promise.join(getStuff(''),
    function(stuff) {
    console.log(stuff);
})
  .then(examplePromise)
  .then(examplePromise2)
  .then(bundle)
  .then(function() {
    return [1,2,3];
  })
  .mapSeries(function(num) {
    console.log(num);
  })
  .then(function() {
    console.log('ready');
  })
  .catch(function(err) {
  console.log('error', err);
});
