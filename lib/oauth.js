'use strict';

var Q = require('q');
var path = require('path');
var request = require('request');
var config = require('../config.json');

var oauth = module.exports = {};
var oauthBaseUrl = 'https://github.com/login/oauth';
var apiBaseUrl = 'https://api.github.com';

oauth.getUrl = function (url, data, base) { 
  data = data || {};
  var params = [];
  var prop;
  var val;
  for (prop in data) {
    if (data.hasOwnProperty(prop)) {
      val = data[prop];
      if (val) {
        params.push(prop + '=' + val);
      }
    }
  }
  url = (base || oauthBaseUrl) + url;
  params = params.join('&');
  params && (url += '?' + params);
  return url;
};

oauth.getAuthorizeUrl = function (scope) {
  var host = config.host;
  return oauth.getUrl('/authorize', {
    client_id: config['github.ClientID'],
    redirect_uri: 'http://' + host + config['github.redirectUri'],
    scope: scope || ''
  });
};

oauth.getAccessToken = function (code) {
  var deferred = Q.defer();
  request.post({
    url: oauth.getUrl('/access_token'),
    json: {
      client_id: config['github.ClientID'],
      client_secret: config['github.ClientSecret'],
      code: code
    }
  }, function (err, r, body) {
    if (err) {
      return deferred.reject(err);
    }
    if (body.error) {
      if (body.error === 'access_denied') {
        return deferred.resolve();
      }
      return deferred.reject(new Error('登入失敗'));
    }
    deferred.resolve(body.access_token);
  });
  return deferred.promise;
};

oauth.callAPI = function (path, accessToken, method, params, data) {
  var deferred = Q.defer();
  params = params || {};
  params.access_token = accessToken;
  data = data || {};
  method = method || 'get';
  var url = oauth.getUrl(path, params, apiBaseUrl);
  request[method]({
    url: url,
    json: data
  }, function (err, r, body) {
    if (err) {
      return deferred.reject(err);
    }
    deferred.resolve(body);
  });
  return deferred.promise;
};
