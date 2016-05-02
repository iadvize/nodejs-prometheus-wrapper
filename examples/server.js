'use strict';

var express = require('express');
var prometheus = require('../index');

module.exports = {
  instanciate: function() {
    var app = express();

    prometheus.init('myapp', app);

    app.listen(8080);

    return app;
  }
};