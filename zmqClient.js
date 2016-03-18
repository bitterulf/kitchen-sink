var requester = require('zmq').socket('req');

requester.connect('tcp://localhost:5559');
requester.on('message', function(msg) {
  console.log('got reply', msg.toString());
});

requester.send("client request");
