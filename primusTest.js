var config = require('config');

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
  // primus.id.generator(function generate(spark, fn) {
  //   console.log('mirage!');
  //   fn(undefined, 'boink');
  // });

  primus.use('fortress maximus', require('fortress-maximus'));

  primus.validate('data', function (msg, next) {
    if ('object' !== typeof msg) return next(new Error('Invalid'));

    return next();
  });

  primus.validate('move', function (msg, next) {
    console.log('spark', this);
    return next();
  });

  primus.use('emit', require('primus-emit'));

  primus.use('metroplex', require('metroplex'));

  primus.metroplex.servers(function (err, servers) {
    console.log('registered servers:', servers);
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
