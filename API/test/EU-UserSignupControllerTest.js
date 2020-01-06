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

describe('EU-UserSignupController Testing', function () {
  // Begin: EU-UserSignupControllerTest app.post('/api/v1/eu/user/signup/mobile/sendotp') API Unit Test Code
  describe('/POST send OTP to MobileNumber', function () {
    it('User send OTP to MobileNumber - Positive Case 01: With all credentials', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        firstName: 'demo',
        mobileNumber: '1111111111',
        email: 'demo@gmail.com'
      };
      chai.request(app).post('/api/v1/eu/user/signup/mobile/sendotp').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============ MobileNumber OTP Status Error: ', error);
        } else {
          console.log(' ============ MobileNumber OTP: ', res.body.statusMessage);
        }
      });
    });

    it('User send OTP to MobileNumber - Negative Case 01: With Empty credentials', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        firstName: '',
        mobileNumber: '',
        email: ''
      };
      chai.request(app).post('/api/v1/eu/user/signup/mobile/sendotp').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============ MobileNumber OTP Status Error: ', error);
        } else {
          console.log(' ============ MobileNumber OTP Status: ', res.body.statusMessage);
        }
      });
    });
    it('User send OTP to MobileNumber - Negative Case 02: With existing MobileNumber and email', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        firstName: 'demo',
        mobileNumber: '9989315149',
        email: 'saiprasad@gmail.com'
      };
      chai.request(app).post('/api/v1/eu/user/signup/mobile/sendotp').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============ MobileNumber OTP Status Error: ', error);
        } else {
          console.log(' ============ MobileNumber OTP: ', res.body.statusMessage);
        }
      });
    });
    it('User send OTP to MobileNumber - Negative Case 03: With existing Email and different MobileNumber', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        firstName: 'demo',
        mobileNumber: '1111111111',
        email: 'sai@gmail.com'
      };
      chai.request(app).post('/api/v1/eu/user/signup/mobile/sendotp').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============ MobileNumber OTP Status Error: ', error);
        } else {
          console.log(' ============ MobileNumber OTP Status: ', res.body.statusResult.message);
        }
      });
    });
  });
  // End: EU-UserSignupControllerTest app.post('/api/v1/eu/user/signup/mobile/sendotp') API Unit Test Code

  // Begin: EU-UserSignupControllerTest app.post('/api/v1/eu/signup/mobile/verifyotp') API Unit Test Code
  describe('/POST Validate MobileNumber', function () {
    it('User Validate MobileNumber - Positive Case 01: With credentials', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        token: 'skdjsjadjsfksakfj',
        otp: '1234',
      };
      chai.request(app).post('/api/v1/eu/signup/mobile/verifyotp').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============Validate MobileNumber Status Error: ', error);
        } else {
          console.log(' ============ Validate MobileNumber OTP: ', res.body.statusMessage);
        }
      });
    });
    it('User Validate MobileNumber - Negative Case 01: With Empty credentials', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        token: '',
        otp: '',
      };
      chai.request(app).post('/api/v1/eu/signup/mobile/verifyotp').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============Validate MobileNumber Status Error: ', error);
        } else {
          console.log(' ============ Validate MobileNumber OTP: ', res.body.statusMessage);
        }
      });
    });
  });
  // End: EU-UserSignupControllerTest app.post('/api/v1/eu/signup/mobile/verifyotp') API Unit Test Code

  // Begin: EU-UserSignupControllerTest app.post('/api/v1/eu/user/signup/email/sendotp') API Unit Test Code
  describe('/POST send OTP to Email', function () {
    it('User send OTP to Email - Positive Case 01: With all credentials', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        firstName: 'demo',
        mobileNumber: '1111111111',
        email: 'demo@gmail.com'
      };
      chai.request(app).post('/api/v1/eu/user/signup/email/sendotp').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============ Email OTP Status Error: ', error);
        } else {
          console.log(' ============ Email OTP: ', res.body.statusMessage);
        }
      });
    });

    it('User send OTP to Email - Negative Case 01: With Empty Credentials', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        firstName: '',
        mobileNumber: '',
        email: ''
      };
      chai.request(app).post('/api/v1/eu/user/signup/email/sendotp').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============ Email OTP Status Error: ', error);
        } else {
          console.log(' ============ Email OTP: ', res.body.statusMessage);
        }
      });
    });
    it('User send OTP to Email - Negative Case 02: With existing MobileNumber and email', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        firstName: 'demo',
        mobileNumber: '9989315149',
        email: 'saiprasad@gmail.com'
      };
      chai.request(app).post('/api/v1/eu/user/signup/email/sendotp').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============ Email Status Error: ', error);
        } else {
          console.log(' ============ Email Status: ', res.body.statusMessage);
        }
      });
    });
    it('User send OTP to Email - Negative Case 03: With existing Email and different MobileNumber', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        firstName: 'demo',
        mobileNumber: '1111111111',
        email: 'sai@gmail.com'
      };
      chai.request(app).post('/api/v1/eu/user/signup/email/sendotp').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============ Email  Status Error: ', error);
        } else {
          console.log(' ============ Email Status: ', res.body.statusResult.message);
        }
      });
    });
    it('User send OTP to MobileNumber - Negative Case 04: With existing Email and different MobileNumber', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        firstName: 'demo',
        mobileNumber: '2222222222',
        email: 'sai@gmail.com'
      };
      chai.request(app).post('/api/v1/eu/user/signup/email/sendotp').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============ Email Status Error: ', error);
        } else {
          console.log(' ============ Email Status: ', res.body.statusResult.message);
        }
      });
    });
  });
  // End: EU-UserSignupControllerTest app.post('/api/v1/eu/user/signup/email/sendotp') API Unit Test Code

  // Begin: EU-UserSignupControllerTest app.post('/api/v1/eu/signup/email/verifyotp') API Unit Test Code
  describe('/POST Validate Email', function () {
    it('User Validate Email - Positive Case 01: With credentials', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        token: 'skdjsjadjsfksakfj',
        otp: '1234',
      };
      chai.request(app).post('/api/v1/eu/signup/email/verifyotp').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============Validate Email Status Error: ', error);
        } else {
          console.log(' ============ Validate Email OTP: ', res.body.statusMessage);
        }
      });
    });

    it('User Validate Email - Negative Case 01: With Empty credentials', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        token: '',
        otp: '',
      };
      chai.request(app).post('/api/v1/eu/signup/email/verifyotp').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============Validate Email Status Error: ', error);
        } else {
          console.log(' ============ Validate Email OTP: ', res.body.statusMessage);
        }
      });
    });
  });
  // End: EU-UserSignupControllerTest app.post('/api/v1/eu/signup/email/verifyotp') API Unit Test Code

  // Begin: EU-UserSignupControllerTest app.post('/api/v1/eu/user/signup') API Unit Test Code
  describe('/POST EndUser Signup', function () {
    it('EndUser Signup - Positive Case 01: With credentials', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        firstName: 'sai prasad',
        lastName: 'koti',
        userID: 'sai',
        mobileNumber: '0987654321',
        email: 'abc@gmail.com',
        password: 'sai',
        dob: '23-12-2000',
        deviceToken: '===============',
        address: 'Tarnaka'
      };
      chai.request(app).post('/api/v1/eu/user/signup').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============ EndUser Signup Status Error: ', error);
        } else {
          console.log(' ============ EndUser Signup Status: ', res.body.statusMessage);
        }
      });
    });

    it('EndUser Signup - Negative Case 01: With existing MobileNumber and Email credentials', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        firstName: 'sai prasad',
        lastName: 'koti',
        userID: 'sai',
        mobileNumber: '9989315149',
        email: 'sai@gmail.com',
        password: 'sai',
        dob: '23-12-2000',
        deviceToken: '===============',
        address: 'Tarnaka'
      };
      chai.request(app).post('/api/v1/eu/user/signup').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============ EndUser Signup Status Error: ', error);
        } else {
          console.log(' ============ EndUser Signup Status: ', res.body.statusMessage);
        }
      });
    });
    it('EndUser Signup - Negative Case 01: With existing UserID', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        firstName: 'sai prasad',
        lastName: 'koti',
        userID: 'sai',
        mobileNumber: '0987654321',
        email: 'abc@gmail.com',
        password: 'sai',
        dob: '23-12-2000',
        deviceToken: '===============',
        address: 'Tarnaka'
      };
      chai.request(app).post('/api/v1/eu/user/signup').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============ EndUser Signup Status Error: ', error);
        } else {
          console.log(' ============ EndUser Signup Status: ', res.body.statusMessage);
        }
      });
    });
    it('EndUser Signup - Negative Case 02: With Empty credentials', function (done) {
      this.timeout(10000);
      setTimeout(done, 5000);
      var userCredentials = {
        firstName: '',
        lastName: '',
        userID: '',
        mobileNumber: '',
        email: '',
        password: '',
        dob: '',
        deviceToken: '',
        address: ''
      };
      chai.request(app).post('/api/v1/eu/user/signup').send(userCredentials).end(function (error, res) {
        if (error) {
          console.log(' ============ EndUser Signup Status Error: ', error);
        } else {
          console.log(' ============ EndUser Signup Status: ', res.body.statusMessage);
        }
      });
    });
  });
  // End: EU-UserSignupControllerTest app.post('/api/v1/eu/user/signup') API Unit Test Code
});
