'use strict';

var express = require('express');
var prometheus = require('../index');

var app = express();
var server;

prometheus.init('test', app);

module.exports = {
  app: app,
  start: function() {
    server = app.listen(8080);
  },
  stop: function() {
    server.close();
  }
};