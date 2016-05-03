'use strict';

var express = require('express');
var prometheus = require('../index');
var app = express();

prometheus.setNamespace('examples');

app.get('/metrics', function(req, res) {
  res.end(prometheus.getMetrics());
});

require('./counter');
require('./gauge');
require('./histogram');
require('./summary');

app.listen(8080);
