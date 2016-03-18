var responder = require('zmq').socket('rep');
responder.connect('tcp://localhost:5560');

responder.on('message', function(msg) {
  msg = JSON.parse(msg.toString());
  msg.payload += 'processed';
  msg = JSON.stringify(msg);
  setTimeout(function() {
    responder.send(msg);
  }, 2000);
});
