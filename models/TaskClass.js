'use strict';

var Q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var types = {};

types.url = function (data, val, cb) {
  var regexp = new RegExp(val);
  cb(null, regexp.test(data));
};

var TaskClass = new Schema({
  name: String,
  message: String,
  exp: Number,
  type: {
    type: String,
    enum: Object.keys(types)
  },
  url: String,
  value: String
});

TaskClass.methods.check = function (data) {
  var deferred = Q.defer();
  var check = types[this.type];
  if (check) {
    check(data, this.value, function (err, success) {
      if (err) {
        return deferred.reject(err);
      }
      deferred.resolve(success);
    });
  } else {
    deferred.resolve(false);
  }
  return deferred.promise;
};

module.exports = TaskClass;
