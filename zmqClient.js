var bob = function(connectionString){
  this.requester = require('zmq').socket('req');
  this.requester.connect(connectionString);
  var that = this;
  this.requester.on('message', function(msg) {that.handleMessage(msg);});
  this.waiting = [];
};

bob.prototype.removeRequestById = function(id) {
  this.waiting = this.waiting.filter(function(request){
    return request.id != id;
  });
};

bob.prototype.getRequestById = function(id, cb) {
  var waitingRequest = this.waiting.filter(function(request){
    return request.id == id;
  });
  if (waitingRequest.length) {
    return cb(null, waitingRequest[0]);
  }
  cb(new Error('request not found'));
};

bob.prototype.handleMessage = function(msg) {
  msg = JSON.parse(msg.toString());
  var waitingRequest = this.waiting.filter(function(request){
    return request.id == msg.id;
  });

  var that = this;

  this.getRequestById(msg.id, function(err, request) {
    if (err) {
      return console.log('request already timed out :(');
    }
    that.removeRequestById(msg.id);
    request.cb(null, msg);
  });
};

bob.prototype.send = function(payload, timeout, cb) {
  var id = require('shortid').generate();
  this.waiting.push({timestamp: Date.now(), id: id, payload: payload, cb: cb});
  this.requester.send(JSON.stringify({id: id, payload: payload}));
  var that = this;

  setTimeout(function() {
    that.getRequestById(id, function(err, request) {
      if (err) {
        return console.log('nothing to clean up...');
      }
      that.removeRequestById(id);
      request.cb(new Error('timeout'));
    });
  }, timeout);
};

var Bob = new bob('tcp://localhost:5559');

Bob.send('banana!', 1000, function(err, result) {
  console.log(err, result);
  Bob.send('papaya!', 3000, function(err, result) {
    console.log(err, result);
  });
});
