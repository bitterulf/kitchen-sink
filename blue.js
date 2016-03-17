var Promise = require('bluebird');

var exampleFn = function(cb) {
  cb(null, 'tada');
};

var example2Fn = function(data, cb) {
  cb(null, data+'!');
};

var examplePromise = Promise.promisify(exampleFn);
var example2Promise = Promise.promisify(example2Fn);

examplePromise()
  .then(example2Promise)
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
  console.log('error', err);
});
