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
      type: 'url',
      exp: -100
    }, function (err, taskClass) {
      if (err) {
        return cb(err);
      }
      commands.emit(taskClass);
    });
  };

  commands.sendTaskA = function (cb) {
    cb || (cb = function () {});
    console.log('testA');
    TaskClass.create({
      name: 'github commit',
      message: 'Don\'t forget to commit your changes to .gitignore!',
      url: 'github\.com',
      value: 'github',
      type: 'url',
      exp: -100
    }, function (err, taskClass) {
      if (err) {
        return cb(err);
      }
      commands.emit(taskClass);
    });
  };

  commands.sendTaskA = function (cb) {
    cb || (cb = function () {});
    console.log('sendTaskA');
    TaskClass.create({
      name: 'github commit',
      message: 'Don\'t forget to commit your changes to .gitignore!',
      url: 'github\.com',
      value: 'github',
      type: 'url',
      exp: -100
    }, function (err, taskClass) {
      if (err) {
        return cb(err);
      }
      commands.emit(taskClass);
    });
  };

  commands.sendTaskB = function (cb) {
    cb || (cb = function () {});
    console.log('sendTaskB');
    TaskClass.create({
      name: 'cat hungry',
      message: 'I\'m hungry',
      url: 'fish',
      value: null,
      type: 'url',
      exp: -100
    }, function (err, taskClass) {
      if (err) {
        return cb(err);
      }
      commands.emit(taskClass);
    });
  };

  commands.sendTaskC = function (cb) {
    cb || (cb = function () {});
    console.log('sendTaskC');
    TaskClass.create({
      name: 'dropbox',
      message: 'I live push files to dropbox, do you?',
      url: 'dropbox',
      value: null,
      type: 'url',
      exp: -100
    }, function (err, taskClass) {
      if (err) {
        return cb(err);
      }
      commands.emit(taskClass);
    });
  };

  commands.sendTaskD = function (cb) {
    cb || (cb = function () {});
    console.log('sendTaskD');
    TaskClass.create({
      name: 'NodeJS',
      message: 'Do you know last version of nodejs?',
      url: 'nodejs',
      value: null,
      type: 'url',
      exp: -100
    }, function (err, taskClass) {
      if (err) {
        return cb(err);
      }
      commands.emit(taskClass);
    });
  };

  commands.sendTaskE = function (cb) {
    cb || (cb = function () {});
    console.log('sendTaskE');
    TaskClass.create({
      name: 'TouchCat',
      message: 'Do you like TouchCat?',
      url: 'nodeknockout.com\/teams\/touchday',
      value: 'Taipei',
      type: 'url',
      exp: -100
    }, function (err, taskClass) {
      if (err) {
        return cb(err);
      }
      commands.emit(taskClass);
    });
  };

  commands.sendTaskF = function (cb) {
    cb || (cb = function () {});
    console.log('sendTaskD');
    TaskClass.create({
      name: 'vote',
      message: 'Oh, do not forget to vote!',
      url: 'nodeknockout.com',
      value: 'TouchDay',
      type: 'url',
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
