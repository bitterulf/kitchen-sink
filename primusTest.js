var config = require('config');

var Primus = require('primus');

var Path = require('path');
var Hapi = require('hapi');
var Inert = require('inert');

var seneca = require('seneca')();

seneca.use('redis-store', {});

var userCollection = seneca.make('user');

var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

console.log('set NODE_ENV=', config.get('name'));

server.connection({ port: config.get('port') });

server.register(Inert, function(){});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
});

server.start(function(err) {
  if (err) {
      throw err;
  }

  console.log('Server running at:', server.info.uri);

  var primus = new Primus(server.listener, {
    fortress: 'spark',
    'mirage timeout': 5000,
    namespace: 'metroplex',
  });

  primus.use('mirage', require('mirage'));

  primus.id.generator(function generate(spark, fn) {
    userCollection.save$(function(err, doc) {
      if (err) return fn(err);
      console.log('new user generated:', doc.id);
      fn(null, doc.id);
    });
  });

  primus.id.validator(function validator(spark, fn) {
    userCollection.load$(spark.mirage, function (err, doc) {
      if (err) return fn(err);

      if (!doc) {
        console.log('user is not cool!', spark.mirage);
        return fn(new Error('user does not exist'));
      }
      else {
        console.log('user is cool', spark.mirage);
        fn(null);
      }
    });
  });

  primus.use('fortress maximus', require('fortress-maximus'));

  primus.validate('data', function (msg, next) {
    console.log(msg);
    return next();
    if ('object' !== typeof msg) {
      return next(new Error('input has to be a object'));
    }

    // if this is internal another validation makes no sense...
    if (this.stream) {
      if (this.name == 'chat') {
        return next();
      }
      else {
        return next(new Error('invalid internal substream'));
      }
    }
    else if (this.mirage) {
      if (msg.substream == 'chat') {
        return next();
      }
      else {
        return next(new Error('invalid substream'));
      }
    }

    return next(new Error('input is wrong'));
  });

  primus.validate('move', function (msg, next) {
    return next();
  });

  primus.use('substream', require('substream'));

  primus.use('emit', require('primus-emit'));

  primus.use('omega-supreme', require('omega-supreme'));

  primus.use('metroplex', require('metroplex'));

  primus.metroplex.servers(function (err, servers) {
    // console.log('registered servers:', servers);
  });

  primus.on('invalid', function invalid(err, args) {
    console.log('INVALID!', err, args);
  });

  primus.on('connection', function (spark) {

    primus.forward.broadcast('data!', function (err, result) {
      // console.log(result);
    });

    // substreams do not work with events
    var chat = spark.substream('chat');

    chat.on('data', function (data) {
      console.log('chat:', data);
    });

    chat.write('server question');

    spark.write({ action: 'init' });

    spark.on('data', function (data) {
      //console.log('data', data);
    });

    spark.on('move', function (target) {
      //console.log(arguments);
    });

    spark.emit('start', { foo: 'foo' });
  });
});
