var axon = require('axon');
var replySocket = axon.socket('rep');

replySocket.connect(3001, 'localhost');

// add a command socket wich connects services, server and client
// so everyone knows what is going on
replySocket.on('message', function(msg, reply){
  reply(msg+'bar');
});
