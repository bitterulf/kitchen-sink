var axon = require('axon');
var requestSocket = axon.socket('req');

requestSocket.connect(3000, 'localhost');

requestSocket.send('logger', function(port){
  console.log(port);
});
