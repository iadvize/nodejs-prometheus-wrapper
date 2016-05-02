'use strict';

var prometheus = require('../index');

prometheus.createSummary("mysummary", "Compute percentils and median of a random list of numbers.", {
  percentiles: [ 0.01, 0.1, 0.5, 0.9, 0.99 ]
});

for (var i = 0; i < 10000; ++i) {
  prometheus.get("mysummary").observe(Math.random());
}
