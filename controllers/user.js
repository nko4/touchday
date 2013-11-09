'use strict';

var config = require('../config.json');
var oauth = require('../lib/oauth');
var models = require('../lib/app').models;
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
    var User = models.User;
    var Token = models.Token;
    if (!code) {
      return next();
    }
    oauth.getAccessToken(code)
    .then(function (accessToken) {
      return oauth.callAPI('/user', accessToken, 'get');
    })
    .then(function (body) {
      return User.createAndGet({
        name: body.name,
        login: body.login,
        avatar: body.avatar_url,
        email: body.email,
        location: body.location
      });
    })
    .then(function (user) {
      return Token.generate(user);
    })
    .then(function (token) {
      res.redirect('/login-success?token=' + token._id);
    }, function (err) {
      console.log(err);
      res.redirect('/login-failed');
    })
  }
};

userCtrl.loginSuccess = {
  path: '/login-success',
  method: 'get',
  fn: function (req, res, next) {
    res.send('SUCCESS');
  }
};

userCtrl.loginFailed = {
  path: '/login-failed',
  method: 'get',
  fn: function (req, res, next) {
    res.send('FAILED');
  }
};
