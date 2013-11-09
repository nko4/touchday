'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
