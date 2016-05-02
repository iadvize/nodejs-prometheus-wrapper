'use strict';

var prometheus = require('../index');

prometheus.createGauge("mygauge", "A random number we occasionally set.");

setInterval(function () {
  prometheus.get("mygauge").set(42);
}, 10000);
