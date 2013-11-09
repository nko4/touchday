'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function (controllersDir, app) {
  console.log('  Routes:'.blue);
  var files;
  var routes = {};
  var define = defineRoute(app);
  files = fs.readdirSync(controllersDir);
  files && files.forEach(function (file) {
    var ctrl;
    if (!isJsFile(file)) {
      return;
    }
    var ctrlName = path.basename(file, '.js');
    console.log('  - %s', ctrlName.cyan);
    ctrl = require(path.join(controllersDir, file));
    ctrl && eachRoute(ctrl, define);
  });
  console.log();
};

function isJsFile(file) {
  return /\.js$/.test(file);
}

function eachRoute(ctrl, cb) {
  var prop;
  for (prop in ctrl) {
    if (ctrl.hasOwnProperty(prop)) {
      cb(ctrl[prop], prop);
    }
  }
}

function defineRoute(app) {
  return function (route, name) {
    console.log('    - %s', name.yellow);
    app[route.method](route.path, route.fn);
  };
}
