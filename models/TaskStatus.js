'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TaskStatus = new Schema({
  task: ObjectId,
  user: ObjectId,
  status: {
    types: String,
    enum: ['success', 'failed']
  }
});

module.exports = TaskStatus;
