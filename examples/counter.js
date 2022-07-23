'use strict';

var prometheus = require('../index');

prometheus.createCounter('mycounter', 'A number we occasionally increment.');

setInterval(function () {
  prometheus.get('mycounter').inc(42);
}, 10000);
