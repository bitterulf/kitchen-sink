var Primus = require('primus');

var Path = require('path');
var Hapi = require('hapi');
var Inert = require('inert');

var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

server.connection({ port: 8080 });

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
    'mirage timeout': 5000
  });

  primus.use('mirage', require('mirage'));
  primus.id.generator(function generate(spark, fn) {
    console.log('mirage!');
    fn(undefined, 'boink');
  });

  primus.use('fortress maximus', require('fortress-maximus'));

  primus.use('emit', require('primus-emit'));

  primus.validate('data', function (msg, next) {
    if ('object' !== typeof msg) return next(new Error('Invalid'));

    return next();
  });

  primus.validate('move', function (msg, next) {
    console.log('spark', this);
    return next();
  });

  primus.on('invalid', function invalid(err, args) {
    console.log('INVALID!', err, args);
  });

  primus.on('connection', function (spark) {
    spark.write({ action: 'init' });
    spark.on('data', function (data) {
      console.log(data);
    });

    spark.on('move', function (target) {
      console.log(arguments);
    });

    spark.emit('start', { foo: 'foo' });
  });
});
