'use strict';

var request = require('supertest');
var service = require('./server');
var prometheus = require('../index');

describe('gauge', function() {
  before(function(done) {
    service.start();
    done();
  });

  it('should be created', function(done) {
    prometheus.createGauge('mygauge', 'This is my test gauge');

    request(service.app)
      .get('/metrics')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const payload = res.text;
        expect(payload).to.contain('# HELP test_mygauge This is my test gauge\n# TYPE test_mygauge gauge\n');
        done();
      });
  });

  it('should be incremented', function(done) {
    prometheus.get('mygauge').set(42);

    request(service.app)
      .get('/metrics')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const payload = res.text;
        expect(payload).to.contain('# HELP test_mygauge This is my test gauge\n# TYPE test_mygauge gauge\ntest_mygauge 42\n');
        done();
      });
  });

  after(function(done) {
    service.stop();
    done();
  });
});
