var responder = require('zmq').socket('rep');
responder.bindSync('tcp://*:5559');

var requester = require('zmq').socket('req');
requester.bindSync('tcp://*:5560');

requester.on('message', function(msg) {
  console.log('got reply from service', msg.toString());
  responder.send("server answer: "+msg.toString());
});

responder.on('message', function(msg) {
  console.log('received request:', msg.toString());
  requester.send(msg);
});

