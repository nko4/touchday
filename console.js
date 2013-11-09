'use strict';

var repl = require("repl");

module.exports = function (data) {
  var ctx = repl.start({
    prompt: "> ",
    input: process.stdin,
    output: process.stdout
  }).context;

  var i;
  for (i in data) {
    if (data.hasOwnProperty(i)) {
      ctx[i] = data[i];
    }
  };
};
