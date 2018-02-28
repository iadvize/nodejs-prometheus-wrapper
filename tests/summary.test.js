'use strict';

var request = require('supertest');
var service = require('./server');
var prometheus = require('../index');

describe('summary', function() {
  before(function(done) {
    service.start();
    done();
  });

  it('should be created', function(done) {
    prometheus.createSummary('mysummary', 'This is my test summary', {
      percentiles: [ 0.5 ]
    });

    request(service.app)
      .get('/metrics')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const payload = res.text;
        expect(payload).to.contain('# HELP test_mysummary This is my test summary\n# TYPE test_mysummary summary\n');
        done();
      });
  });

  it('should be incremented', function(done) {
    prometheus.get("mysummary").observe(1);
    prometheus.get("mysummary").observe(2);

    request(service.app)
      .get('/metrics')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const payload = res.text;
        const expected = '# HELP test_mysummary This is my test summary\n' +
                          '# TYPE test_mysummary summary\n' +
                          'test_mysummary{quantile="0.5"} 1.5\n' +
                          'test_mysummary_sum 3\n' +
                          'test_mysummary_count 2';
        expect(payload).to.contain(expected);
        done();
      });
  });

  after(function(done) {
    service.stop();
    done();
  });
});
