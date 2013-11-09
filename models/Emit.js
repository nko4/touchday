'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Emit = new Schema({
  all: {
    type: Boolean,
    default: false
  },
  taskClass: ObjectId,
  target: [ObjectId],
  enable: {
    type: Boolean,
    default: true
  }
});

module.exports = Emit;
