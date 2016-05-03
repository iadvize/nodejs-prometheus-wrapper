'use strict';

/**
 * Wraps Prometheus client - https://github.com/siimon/prom-client
 * Goal: use metrics in any file of your app without harm
 */

var assert = require('assert');
var client = require('prom-client');
var _ = require('lodash');

var references = {};
var namespace = '';

module.exports = {
  /**
   * Sets a namespace for all the metrics created after its call
   * @param ns
   */
  setNamespace: function(ns) {
    assert(_.isString(ns));
    namespace = ns;
  },

  /**
   * What to expose in /metrics in your server
   */
  getMetrics: function() {
    return client.register.metrics();
  },

  /**
   * Get metric by its name
   * @param name
   * @returns {*}
   */
  get: function (name) {
    return references[name];
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
  }
};
