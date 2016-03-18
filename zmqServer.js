var responder = require('zmq').socket('rep');
responder.bindSync('tcp://*:5559');

var requester = require('zmq').socket('req');
requester.bindSync('tcp://*:5560');

requester.on('message', function(msg) {
  responder.send(msg);
});

responder.on('message', function(msg) {
  requester.send(msg);
});

