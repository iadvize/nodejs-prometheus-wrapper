'use strict';

var request = require('supertest');
var service = require('./server');
var prometheus = require('../index');

describe('counter', function () {
  before(function (done) {
    service.start();
    done();
  });

  it('should be created', function (done) {
    prometheus.createCounter('testcounter', 'This is a test counter');

    request(service.app)
      .get('/metrics')
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;

        const payload = res.text;
        expect(payload).to.contain(
          '# HELP test_testcounter This is a test counter\n# TYPE test_testcounter counter\n'
        );
        done();
      });
  });

  it('should be incremented', function (done) {
    prometheus.createCounter('inccounter', 'This is a counter incremented');
    prometheus.get('inccounter').inc();

    request(service.app)
      .get('/metrics')
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;

        const payload = res.text;
        expect(payload).to.contain(
          'HELP test_inccounter This is a counter incremented\n# TYPE test_inccounter counter\ntest_inccounter 1\n'
        );
        done();
      });
  });

  after(function (done) {
    service.stop();
    done();
  });
});
