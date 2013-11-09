'use strict';

var fs = require('fs');
var path = require('path');
var colors = require('colors');
var app = require('./app');
var io = require('socket.io').listen(app); 

module.exports = function (dir) {
  console.log('  Events:'.blue);
  var files;
  var events = [];
  try {
    files = fs.readdirSync(dir);
  } catch (e) {}
  files && files.forEach(function (file) {
    var event;
    var eventName = path.basename(file, '.js');
    console.log('  - %s', eventName.yellow);
    try {
      event = require(path.join(dir, file));
    } catch (e) {}
    event && events.push(event);
  });
  console.log();
  io.sockets.on('connection', function (socket) {
    events.forEach(function (event) {
      event(socket);
    });
  });
};
