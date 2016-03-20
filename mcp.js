var axon = require('axon');

var replySocket = axon.socket('rep');

replySocket.bind(3000, 'localhost');

var interfacePortCounter = 0;
var interfacePorts = {};

// mcp could aks every running service about existing interfaces
// so nothing has to be stored!

var boostrapInterface = function(interfaceName, cb) {
  var interfaceData = interfacePorts[interfaceName];
  var inputSocket = axon.socket('req');
  inputSocket.bind(interfaceData.producerPort, 'localhost');

  var outputSocket = axon.socket('rep');
  outputSocket.bind(interfaceData.consumerPort, 'localhost');

  outputSocket.on('message', function(data, reply){
    inputSocket.send(data, reply);
  });

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
