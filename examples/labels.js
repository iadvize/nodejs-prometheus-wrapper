'use strict';

var prometheus = require('../index');

prometheus.createCounter('mylabels', 'A number we occasionally increment.', [
  'foo',
]);

setInterval(function () {
  prometheus.get('mylabels').inc({ foo: 'bar' }, 42);
  prometheus.get('mylabels').inc({ foo: 'baz' }, 21);
}, 10000);
