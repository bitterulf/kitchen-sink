var responder = require('zmq').socket('rep');
responder.connect('tcp://localhost:5560');

responder.on('message', function(msg) {
  console.log('received request to process:', msg.toString());
  responder.send('processed by Service.. input:'+msg);
});
