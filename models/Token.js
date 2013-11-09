'use strict';

var Q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Token = new Schema({
  user: ObjectId,
  lastLoginDate: Date
});

Token.index({updatedAt: 1}, {expireAfterSeconds: 86400});

Token.statics.generate = function (user) {
  var deferred = Q.defer();
  this.create({
    lastLoginDate: new Date(),
    user: user._id
  }, function (err, token) {
    if (err) {
      return deferred.reject(err);
    }
    deferred.resolve(token);
  });
  return deferred.promise;
};

module.exports = Token;
