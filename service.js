var axon = require('axon');

var Promise = require('bluebird');

var InterfaceManager = function(host, port) {
  this.socket = axon.socket('req');
  this.socket.connect(3000, 'localhost');
};

InterfaceManager.prototype.send = function(data, cb) {
  this.socket.send(data, function(interfaceData) {
    cb(null, {interfaceData: interfaceData});
  });
};

var im = Promise.promisifyAll(new InterfaceManager(3000, 'localhost'));

var addReplySocket = Promise.promisify(function(result, cb){
  if (!result.sockets) result.sockets = {};
  result.sockets.reply = axon.socket('rep');
  result.sockets.reply.connect(result.interfaceData.producerPort, 'localhost');

  cb(null, result);
});

var addRequestSocket = Promise.promisify(function(result, cb){
  if (!result.sockets) result.sockets = {};
  result.sockets.request = axon.socket('req');
  result.sockets.request.connect(result.interfaceData.consumerPort, 'localhost');

  cb(null, result);
});

var addReplyLogic = Promise.promisify(function(result, cb){
  result.sockets.reply.on('message', function(data, reply){
    reply(data+'bar');
  });

  cb(null, result);
});

var testInterfaces = Promise.promisify(function(result, cb){
  result.sockets.request.send('foo', function(result){
    console.log(result);
  });

  cb(null, result);
});

im.sendAsync('logger')
  .then(addReplySocket)
  .then(addRequestSocket)
  .then(addReplyLogic)
  .then(testInterfaces)
  .then(function(result){
    console.log('ready to rock!', result);
  });
