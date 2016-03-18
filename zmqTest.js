var requester = require('zmq').socket('req');

requester.connect('tcp://localhost:5559');
requester.on('message', function(msg) {
  console.log('got reply', msg.toString());
});

requester.send("client request");

var responder = require('zmq').socket('rep');

responder.bindSync('tcp://*:5559');
responder.on('message', function(msg) {
  console.log('received request:', msg.toString());
  responder.send("server answer");
});
