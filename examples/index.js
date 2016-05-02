'use strict';

var express = require('express');
var prometheus = require('../index');
var app = express();

prometheus.init('examples', app);

require('./counter');
require('./gauge');
require('./histogram');
require('./summary');

app.listen(8080);
