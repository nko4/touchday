'use strict';

var http = require('http');
var path = require('path');
var express = require('express');
var db = require('./lib/db');
var routes = require('./lib/routes');
var app = require('./lib/app');
var events = require('./lib/events');
if(process.argv[2]==='test'){
  var config = require('./config.test.json');
}else{
  var config = require('./config.json');
}
var repl = require('./console');

// connect database and create models
var models = db(config.mongodb, path.join(__dirname, 'models'));
app.models = models;

// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(path.join(__dirname, 'controllers'), app);

var server = http.createServer(app).listen(app.get('port'), config.host, function(){
  console.log('Express server listening on port ' + app.get('port'));
  // init socket.io
  var io = events(path.join(__dirname, 'events'), server);

  var commands = require('./commands')(io, models)

  repl({
    io: io,
    models: models,
    commands: commands
  });

  var auto_task = function(){
    var R = Math.floor(Math.random() * 20)
    switch(R){
      case 1: commands.sendTaskA(); break;
      case 3: commands.sendTaskB(); break;
      case 5: commands.sendTaskC(); break;
      case 6: commands.sendTaskD(); break;
      case 7: commands.sendTaskE(); break;
      case 11: commands.sendTaskF(); break;
    }
    console.log('auto_task send:', R)
    setTimeout(auto_task, 10000);
  }
  auto_task();

});
