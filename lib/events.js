'use strict';

var fs = require('fs');
var path = require('path');
var colors = require('colors');
var io = require('socket.io'); 

module.exports = function (dir, server) {
  io = io.listen(server);
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
    event = require(path.join(dir, file));
    event && events.push(event);
  });
  console.log();
  io.sockets.on('connection', function (socket) {
    events.forEach(function (event) {
      event(socket);
    });
  });
};
