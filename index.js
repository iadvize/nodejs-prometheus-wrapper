'use strict';

/**
 * Wraps Prometheus client - https://github.com/siimon/prom-client
 * Goal: use metrics in any file of your app without harm
 */

var assert = require('assert');
var client = require('prom-client');
var _ = require('lodash');
var express = require('express');

var references = {};
var namespace = '';

/**
 * Starts an Express server
 *
 * @param {Object}   port     - Server port
 * @param {Function} callback - Callback(HTTP server, Express app)
 */
function startExpress(port, callback) {
  assert(_.isFunction(callback));

  var app = express();
  var server = http.createServer(app);

  server.listen(port, function() {
    callback(server, app);
  });

  return app;
}

module.exports = {
  /**
   * Exposes a route /metrics in the given express app
   * If we don't pass an app, it will pop an express instance
   * @param ns
   * @param expressApp
   */
  init: function(ns, expressApp) {
    assert(_.isString(ns));
    assert(!_.isUndefined(ns));
    namespace = ns;

    var app = expressApp;

    if (!expressApp) {
      var defaultPort = 9000;
      startExpress(defaultPort, function(server, newApp) {});
      app = newApp;
    }
    app.get('/metrics', function(req, res) {
      res.end(client.register.metrics());
    });
  },

  createCounter: function (name, help) {
    references[name] = new client.Counter(namespace + '_' + name, help);
    return references[name];
  },

  createGauge: function (name, help) {
    references[name] = new client.Gauge(namespace + '_' + name, help);
    return references[name];
  },

  createHistogram: function (name, help, params) {
    references[name] = new client.Histogram(namespace + '_' + name, help, params);
    return references[name];
  },

  createSummary: function (name, help, params) {
    references[name] = new client.Summary(namespace + '_' + name, help, params);
    return references[name];
  },

  get: function (name) {
    return references[name];
  }
};
