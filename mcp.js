var axon = require('axon');

var replySocket = axon.socket('rep');

replySocket.bind(3000, 'localhost');

var interfacePortCounter = 0;
var interfacePorts = {};

var boostrapInterface = function(interfaceName, cb) {
  console.log('booting interface', interfaceName);
  cb(null)
};

replySocket.on('message', function(interfaceName, reply){
  if (!interfacePorts[interfaceName]) {
    interfacePorts[interfaceName] = {
      interfaceName: interfaceName,
      producerPort: 4000 + interfacePortCounter,
      consumerPort: 5000 + interfacePortCounter
    }
    interfacePortCounter++;
    return boostrapInterface(interfaceName, function() {
      console.log(interfaceName, 'created');
      reply(interfacePorts[interfaceName]);
    });
  }
  console.log(interfaceName, 'requested');
  reply(interfacePorts[interfaceName]);
});
