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

  createCounter: function (name, help, labelNames = []) {
    references[name] = new client.Counter({
      name: namespace + '_' + name,
      help,
      labelNames
    });
    return references[name];
  },

  createGauge: function (name, help, labelNames = []) {
    references[name] = new client.Gauge({
      name: namespace + '_' + name,
      help,
      labelNames
    });
    return references[name];
  },

  createHistogram: function (name, help, params, labelNames = []) {
    references[name] = new client.Histogram({
      name: namespace + '_' + name,
      help,
      ...params,
      labelNames
    });
    return references[name];
  },

  createSummary: function (name, help, params, labelNames = []) {
    references[name] = new client.Summary({
      name: namespace + '_' + name,
      help,
      ...params,
      labelNames
    });
    return references[name];
  }
};
