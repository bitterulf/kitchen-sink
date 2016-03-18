var axon = require('axon');
var sock = axon.socket('req');

sock.connect(3000, 'localhost');

// need to handle timeout and retry
sock.send('foo', function(res){
  console.log(res);
});
