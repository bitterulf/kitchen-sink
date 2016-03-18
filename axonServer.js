var axon = require('axon');
var replySocket = axon.socket('rep');

replySocket.bind(3000, 'localhost');

var requestSocket = axon.socket('req');

requestSocket.bind(3001, 'localhost');

replySocket.on('message', function(msg, reply){
  requestSocket.send(msg, reply);
});
