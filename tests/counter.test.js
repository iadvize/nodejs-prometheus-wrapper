'use strict';

var request = require('supertest');
var service = require('../examples/server');
var prometheus = require('../index');

describe('counter', function() {
  before(function(done) {
    service.start();
    done();
  });

  it('should be created', function(done) {
    prometheus.createCounter('mycounter', 'This is my test counter');

    request(service.app)
      .get('/metrics')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const payload = res.text;
        expect(payload).to.be.equal('# HELP test_mycounter This is my test counter\n# TYPE test_mycounter counter\n');
        done();
      });
  });

  it('should be incremented', function(done) {
    prometheus.get('mycounter').inc();

    request(service.app)
      .get('/metrics')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const payload = res.text;
        expect(payload).to.be.equal('# HELP test_mycounter This is my test counter\n# TYPE test_mycounter counter\ntest_mycounter 1\n');
        done();
      });
  });

  after(function(done) {
    service.stop();
    done();
  });
});
