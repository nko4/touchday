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

User.methods.getTasks = function () {
};

module.exports = User;
