'use strict';

var app = require('../lib');

module.exports = function (socket) {
  var models = app.models;
  var Token = models.Token;
  var me;

  socket.on('user.kiss', function (data, cb) {
    if (data.what === 'my ass') {
      Token.getUser(data.token).then(function (user) {
        me = user;
        cb(200, '>///<');
      }, function (err) {
        cb(500);
      });
    }
  });

  socket.on('user.whoami', function (cb) {
    cb(200, me);
  });

  socket.on('user.alreadyLogin', function (cb) {
    cb(200, !!me);
  });
};
