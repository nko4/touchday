'use strict';

var homeCtrl = module.exports = {};

homeCtrl.home = {
  path: '/',
  method: 'get',
  fn: function (req, res, next) {
    res.render('home', {});
  }
};
