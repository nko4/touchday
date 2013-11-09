'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
  login: String,
  email: String,
  exp: Number,
  lv: Number
});
