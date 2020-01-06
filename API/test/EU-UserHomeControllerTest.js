/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

// Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
chai.use(chaiHttp);

describe('EU-UserHomeController Testing', function() {
  // Begin: EU-UserLoginController app.post('/api/v1/eu/user/login') API Unit Test Code
  describe('/POST defaultdata', function() {
    it('User Home Default Data Validation - Positive Case 01:With ip Address', function(done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var body = {
        ip: '183.82.124.235'
      };
      chai.request(app).post('/api/v1/eu/home/sps/default').send(body).end(function(error, res) {
        if (res.body.statusCode == '1000') {
          console.log(' ============ Default data Status: ', res.body.statusMessage);
        } else {
          console.log(' ============ Default data Status: ', res.body.statusMessage);
        }
      });
    });
    it('User Home Default Data Validation - Negative Case 01:With Empty ip Address', function(done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var body = {
        ip: ''
      };
      chai.request(app).post('/api/v1/eu/home/sps/default').send(body).end(function(error, res) {
        if (res.body.statusCode == '1000') {
          console.log(' ============ Default data Status: ', res.body.statusMessage);
        } else {
          console.log(' ============ Default data Status: ', res.body.statusMessage);
        }
      });
    });
    it('User Home Default Data Validation - Negative Case 02: With Invalid ip Address', function(done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var body = {
        ip: 'invalid@ipaddress'
      };
      chai.request(app).post('/api/v1/eu/home/sps/default').send(body).end(function(error, res) {
        if (res.body.statusCode == '1000') {
          console.log(' ============ Default data Status: ', res.body.statusMessage);
        } else {
          console.log(' ============ Default data Status: ', res.body.statusMessage);
        }
      });
    });
  });
  // End: EU-UserHomeController app.get('/api/v1/eu/home/sps/default') API Unit Test Code
});
