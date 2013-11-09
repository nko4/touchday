'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Task = new Schema({
  taskClass: ObjectId,
  user: ObjectId,
  status: {
    type: String,
    enum: ['new', 'success', 'failed']
  }
});

module.exports = Task;
