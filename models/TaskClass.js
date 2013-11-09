'use strict';

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
  description: String,
  exp: Number,
  type: {
    type: String,
    enum: Object.keys(types)
  },
  value: String
});

TaskClass.methods.check = function (data, cb) {
  cb || (cb = function () {});
  var check = types[this.type];
  if (check) {
    check(data, this.value, cb);
  } else {
    cb();
  }
};

module.exports = TaskClass;
