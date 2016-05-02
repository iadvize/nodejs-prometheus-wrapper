'use strict';

var express = require('express');
var prometheus = require('../index');

function example_counter(prometheus) {
    setInterval(function () {
	prometheus.get("mycounter").inc(42);
    }, 10000);
};

function example_gauge(prometheus) {
    prometheus.get("mygauge").set(42);
};

function example_histogram(prometheus) {
    var end = prometheus.get("myhistogram").startTimer();
    setTimeout(function () {
	end();
    }, 15000);
};

function example_summary(prometheus) {
    for (var i = 0; i < 10000; ++i) {
	prometheus.get("mysummary").observe(Math.random());
    }
};

module.exports = {
  instanciate: function() {
    var app = express();

      prometheus.init('examples', app);

      prometheus.createCounter("mycounter", "A number we occasionally increment.");
      prometheus.createGauge("mygauge", "A random number we occasionally set.");
      prometheus.createHistogram("myhistogram", "A chat duration histogram.", {
	  buckets: [ 10, 30, 60, 300, 600, 1800, 3600 ]
      });
      prometheus.createSummary("mysummary", "Compute percentils and median of a random list of numbers.", {
	  percentiles: [ 0.01, 0.1, 0.5, 0.9, 0.99 ]
      });

      app.listen(8080);

      console.log("toto")

      example_counter(prometheus);
      example_gauge(prometheus);
      example_histogram(prometheus);
      example_summary(prometheus);

      console.log("toto")

    return app;
  }
};
