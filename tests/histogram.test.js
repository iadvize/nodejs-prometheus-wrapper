'use strict';

var request = require('supertest');
var service = require('./server');
var prometheus = require('../index');

describe('histogram', function() {
  before(function(done) {
    service.start();
    done();
  });

  it('should be created', function(done) {
    prometheus.createHistogram('myhistogram', 'This is my test histogram', {
      buckets: [ 10, 30, 60, 300, 600, 1800, 3600 ]
    });

    request(service.app)
      .get('/metrics')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const payload = res.text;
        expect(payload).to.contain('# HELP test_myhistogram This is my test histogram\n# TYPE test_myhistogram histogram\n');
        done();
      });
  });

  it('should be incremented', function(done) {
    var end = prometheus.get("myhistogram").startTimer();
    setTimeout(function () {
      end();

      request(service.app)
        .get('/metrics')
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;

          const payload = res.text;
          const expected = '# HELP test_myhistogram This is my test histogram\n' +
                            '# TYPE test_myhistogram histogram\n' +
                            'test_myhistogram_bucket{le="10"} 1\n' +
                            'test_myhistogram_bucket{le="30"} 1\n' +
                            'test_myhistogram_bucket{le="60"} 1\n' +
                            'test_myhistogram_bucket{le="300"} 1\n' +
                            'test_myhistogram_bucket{le="600"} 1\n' +
                            'test_myhistogram_bucket{le="1800"} 1\n' +
                            'test_myhistogram_bucket{le="3600"} 1\n' +
                            'test_myhistogram_bucket{le="+Inf"} 1\n';
          expect(payload).to.contain(expected);
          expect(payload).to.contain('test_myhistogram_count 1');
          done();
        });
    }, 1);
  });

  after(function(done) {
    service.stop();
    done();
  });
});
