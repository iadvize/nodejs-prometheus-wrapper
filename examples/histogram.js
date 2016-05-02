'use strict';

var prometheus = require('../index');

prometheus.createHistogram("myhistogram", "A chat duration histogram.", {
  buckets: [ 10, 30, 60, 300, 600, 1800, 3600 ]
});

var end = prometheus.get("myhistogram").startTimer();
setTimeout(function () {
  end();
}, 10000);
