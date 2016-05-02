'use strict';

var client = require('prom-client');
var _ = require('lodash');
var express = require('express');

var references = {};

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
}

module.exports = function() {
  return {
    init: function(expressApp) {
      var app = expressApp;

      if (!expressApp) {
        var defaultPort = 8080;
        startExpress(defaultPort, function(server, newApp) {
          app = newApp;
        });
      }

      app.get("/metrics", client.metrics());
    },

    createGauge: function (id, help, labels) {
      references[id] = new client.Gauge(id, help, labels);
    },

    set: function (id, labels, val) {
      refererences[id].set(labels, val);
    }
  };
};
