'use strict';

var config = require('../config.json');
var oauth = require('../lib/oauth');
var userCtrl = module.exports = {};

userCtrl.login = {
  method: 'get',
  path: '/user/login',
  fn: function (req, res, next) {
  }
};

userCtrl.authorize = {
  method: 'get',
  path: '/user/authorize',
  fn: function (req, res, next) {
    var url = oauth.getAuthorizeUrl();
    console.log(url);
    res.redirect(url);
  }
};

userCtrl.callback = {
  method: 'get',
  path: config['github.redirectUri'],
  fn: function (req, res, next) {
    var code = req.query.code;
    if (!code) {
      return next();
    }
    oauth.getAccessToken(code)
    .then(function (accessToken) {
      return oauth.callAPI('/user', accessToken, 'get');
    })
    .then(function (body) {
      res.jsonp({
        success: true,
        user: {
          name: body.name,
          login: body.login,
          avatar: body.avatar_url
        }
      });
    }, function (err) {
      next(err);
    })
  }
};
