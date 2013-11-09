'use strict';

var http = require('http');
var path = require('path');
var express = require('express');
var db = require('./lib/db');
var routes = require('./lib/routes');
var app = require('./lib/app');
var events = require('./lib/events');
var config = require('./config.json');

// connect database and create models
var models = db(config.mongodb, path.join(__dirname, 'models'));
app.models = models;

// init socket.io
events(path.join(__dirname, 'events'));

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

http.createServer(app).listen(app.get('port'), config.host, function(){
  console.log('Express server listening on port ' + app.get('port'));
});
