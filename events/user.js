'use strict';

var app = require('../lib/app');
var sockets = require('../sockets');

module.exports = function (socket) {
  var models = app.models;
  var Token = models.Token;
  var User = models.User;
  var me;

  socket.on('user.kiss', function (data, cb) {
    if (data.what === 'my ass') {
      Token.getUser(data.token).then(function (user) {
        me = user.toJSON();
        sockets[me._id] = socket;
        cb(200, 'iamblue >///<');
      }, function (err) {
        cb(500);
      });
    } else {
      cb(500);
    }
  });

  socket.on('user.whoami', function (cb) {
    cb(200, me);
  });

  socket.on('user.alreadyLogin', function (cb) {
    cb(200, !!me);
  });

  socket.on('user.tasks.check', function (cb) {
    User.checkTasks().then(function () {
      cb(200);
    }, function () {
      cb(500);
    });
  });

  socket.on('user.tasks', function (status, cb) {
    if (typeof status === 'function') {
      cb = status;
      status = undefined;
    }
    User.getTasks(status).then(function (tasks) {
      cb(200, tasks.toJSON());
    }, function (err) {
      cb(500);
    });
  });

  socket.on('user.tasks.new', function (cb) {
    User.getTasks('new').then(function (tasks) {
      cb(200, tasks);
    }, function (err) {
      cb(500);
    });
  });

  socket.on('user.tasks.success', function (cb) {
    User.getTasks('success').then(function (tasks) {
      cb(200, tasks);
    }, function (err) {
      cb(500);
    });
  });

  socket.on('user.tasks.failed', function (cb) {
    User.getTasks('failed').then(function (tasks) {
      cb(200, tasks);
    }, function (err) {
      cb(500);
    });
  });

  socket.on('user.task.done', function (data, cb) {
    User.taskDone(data).then(function (success) {
      cb(200, success);
    }, function (err) {
      cb(500);
    });
  });

  socket.on('disconnect', function () {
    if (me) {
      delete sockets[me._id];
    }
  });
};
