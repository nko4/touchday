'use strict';

var Q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  login: String,
  email: String,
  avatar: String,
  name: String,
  location: String,
  exp: {
    type: Number,
    default: 0
  },
  lv: {
    type: Number,
    default: 0
  }
});

User.statics.createAndGet = function (data) {
  var deferred = Q.defer();
  this.findOne({login: data.login}, (function (err, user) {
    if (err) {
      return deferred.reject(err);
    }
    if (user) {
      user.location = data.location;
      user.name = data.name;
      user.avatar = data.avatar;
      user.save(function (err) {
        if (err) {
          return deferred.reject(err);
        }
        deferred.resolve(user);
      });
    } else {
      this.create(data, function (err, user) {
        if (err) {
          return deferred.reject(err);
        }
        deferred.resolve(user);
      });
    }
  }).bind(this));
  return deferred.promise;
};

User.methods.getTasks = function (status) {
  var deferred = Q.defer();
  var Task = mongoose.model('Task');
  var query = {};
  query.user = this._id;
  if (status) {
    query.status = status;
  }
  Task.find(query, function (err, tasks) {
    if (err) {
      return deferred.reject(err);
    }
    deferred.resolve(tasks);
  });
  return deferred.promise;
};

User.methods.checkTasks = function () {
  var deferred = Q.defer();
  var Emit = mongoose.model('Emit');
  var TaskClass = mongoose.model('TaskClass');
  var Task = mongoose.model('Task');
  var user = this;
  Emit.find({
    $or: [
      {all: true},
      {target: {$in: [user._id]}}
  ]}, function (err, newTasks) {
    var promises = [];
    newTasks.forEach(function (emit) {
      var innerDeferred = Q.defer();
      promises.push(innerDeferred.promise);
      TaskClass.findOne({
        _id: emit.taskClass
      }, function (err, taskClass) {
        if (err) {
          return innerDeferred.reject(err);
        }
        Task.create({
          taskClass: taskClass._id,
          user: user._id
        }, function (err) {
          if (err) {
            return innerDeferred.reject(err);
          }
          innerDeferred.resolve();
        });
      });
    });
    deferred.all(promises);
  });
  return deferred.promise;
};

module.exports = User;
