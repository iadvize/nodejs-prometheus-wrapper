'use strict';

var request = require('supertest');
var service = require('../examples/server');
var app = service.instanciate();

describe('/metrics', function() {
  it('should be exposed', function() {
    request(app)
      .get('/metrics')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
      });
  });
});
