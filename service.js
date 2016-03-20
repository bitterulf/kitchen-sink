var axon = require('axon');
var interfaceSocket = axon.socket('req');

interfaceSocket.connect(3000, 'localhost');

interfaceSocket.send('logger', function(interfaceData){
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
