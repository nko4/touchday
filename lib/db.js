'use strict';

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var colors = require('colors');

module.exports = function (dburl, modelsDir) {
  console.log('  Models:'.blue);
  mongoose.connect(dburl);
  var models = {};
  var files;
  try {
    files = fs.readdirSync(modelsDir);
  } catch (e) {}
  files && files.forEach(function (file) {
    var schema;
    var modelName = path.basename(file, path.extname(file));
    if (modelName === 'index') {
      return;
    }
    file = path.join(modelsDir, file);
    try {
      schema = require(file);
    } catch (e) {}
    if (schema instanceof mongoose.Schema) {
      console.log('  - %s', modelName.yellow);
      models[modelName] = mongoose.model(modelName, schema);
    }
  });
  try {
    require(modelsDir)(models, mongoose);
  } catch (e) {}
  console.log();
  return models;
};
