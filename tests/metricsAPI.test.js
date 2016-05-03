'use strict';

var request = require('supertest');
var service = require('./server');
var prometheus = require('../index');

describe('/metrics', function() {
  before(function(done) {
    service.start();
    done();
  });

  it('should be exposed', function() {
    request(service.app)
      .get('/metrics')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
      });
  });

  after(function(done) {
    service.stop();
    done();
  });
});
