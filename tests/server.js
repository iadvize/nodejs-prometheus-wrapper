'use strict';

var express = require('express');
var prometheus = require('../index');
var app = express();

var server = null;

prometheus.setNamespace('test');

app.get('/metrics', function (req, res) {
  prometheus.getMetrics().then((metrics) => res.end(metrics));
});

module.exports = {
  app: app,
  start: function () {
    server = app.listen(8083);
  },
  stop: function () {
    server.close();
  },
};
