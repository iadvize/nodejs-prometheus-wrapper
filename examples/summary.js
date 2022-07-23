'use strict';

var prometheus = require('../index');

prometheus.createSummary(
  'mysummary',
  'Compute percentils and median of a random list of numbers.',
  {
    percentiles: [0.5],
  }
);

prometheus.get('mysummary').observe(1);
prometheus.get('mysummary').observe(2);
/*
for (var i = 0; i < 10000; ++i) {
  prometheus.get("mysummary").observe(Math.random());
}*/
