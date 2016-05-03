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
  return express();
}

/**
 * Takes an express instance and exposes a /metrics route
 * @param app
 */
function exposeMetrics(app) {
  app.get('/metrics', function(req, res) {
    res.end(client.register.metrics());
  });
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
    assert(_.isObject(expressApp));
    namespace = ns;

    exposeMetrics(expressApp);
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
