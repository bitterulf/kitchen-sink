var axon = require('axon');

var InterfaceManager = function(host, port) {
  this.socket = axon.socket('req');
  this.socket.connect(3000, 'localhost');
};

InterfaceManager.prototype.send = function(data, cb) {
  this.socket.send(data, function(result) {
    cb(null, result);
  });
};

var im = new InterfaceManager(3000, 'localhost');

// var interfaceSocket = axon.socket('req');

// interfaceSocket.connect(3000, 'localhost');

im.send('logger', function(err, interfaceData){
  var replySocket = axon.socket('rep');
  replySocket.connect(interfaceData.producerPort, 'localhost');

  replySocket.on('message', function(data, reply){
    reply(data+'bar');
  });

  var requestSocket = axon.socket('req');
  requestSocket.connect(interfaceData.consumerPort, 'localhost');

  requestSocket.send('foo', function(result){
    console.log(result);
  });
});
