'use strict';

var sockets = require('./sockets');

module.exports = function (io, models) {
  var TaskClass = models.TaskClass;
  var Task = models.Task;
  var User = models.User;
  var commands = {};

  commands.emit = function (taskClass) {
    User.find({}, function (err, users) {
      if (err) {
        throw err;
      }
      users.forEach(function (user) {
        if (sockets[user._id]) {
          Task.create({
            user: user._id,
            taskClass: taskClass._id,
            status: 'new'
          }, function (err, task) {          
            if (err) {
              throw err;
            }
            sockets[user._id].emit('shit', task._id, taskClass.toJSON());
          });
        }
      });
    });
  };

  commands.createAndEmit = function (cb) {
    cb || (cb = function () {});
    TaskClass.create({
      name: 'blueeeeee',
      message: 'i am blueeeeeeeee',
      url: 'http:\/\/iamblue\.github\.io.*',
      value: 'Coding is not only a routine but also an art',
      exp: -100
    }, function (err, taskClass) {
      if (err) {
        return cb(err);
      }
      commands.emit(taskClass);
    });
  };

  return commands;
};
