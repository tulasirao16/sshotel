/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var multer = require('multer');
var fs = require('fs');
var uuid = require('node-uuid');
var config = require('config');
// var PromiseA = require('bluebird').Promise;

// var genPubPrivKeys = require('../config/rsa-keypairgen');
var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var EU_UserLoginService = require('../services/EU-UserLoginService');

module.exports.controller = function(app, passport) {

  var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      var uplLoc = 'assets/eu-users/' + uuid.v1();
      if(!fs.existsSync(uplLoc)) {
        fs.mkdirSync(uplLoc);
      }
      callback(null, uplLoc);
    },
    filename: function(req, file, callback) {
      callback(null, file.originalname);
    }
  });
  var upload = multer({ storage: storage }).single('profileImage');

  // --- Begin '/api/v1/eu/user/login': User login API to handle login authentication
  app.post('/api/v1/eu/user/login', function(req, res, next) {
    if(req.body.userID && req.body.password) {
      EU_UserLoginService.userLogin(req, res, next, passport, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserLoginController.js, at post API -' +
        '/api/v1/eu/user/login: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/eu/user/login': User login API to handle login authentication

  // --- Begin: /api/v1/eu/user/signup/mobile/sendotp
  app.post('/api/v1/eu/user/signup/mobile/sendotp', function(req, res, next) {
    if(req.body.mobileNumber && req.body.email) {
      EU_UserLoginService.endUserSignupMobileOTP(req.body, res, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserLoginController.js at post API -' +
        ' /api/v1/eu/user/signup/mobile/sendotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- Begin: /api/v1/eu/signup/mobile/verifyotp
  app.post('/api/v1/eu/signup/mobile/verifyotp', function(req, res, next) {
    if(req.headers.otp_token && req.body.otp) {
      CommonService.tokenExpireValidation(req.headers.otp_token, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserLoginService.endUserSignupMobileOTPValidation(req.body.otp, tokenDecodedData.decodedTokenData, res, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserLoginController.js at post API -' +
            ' /api/v1/eu/signup/mobile/verifyotp: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-UserLoginController.js at post API -' +
            ' /api/v1/eu/signup/mobile/verifyotp: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserLoginController.js at post API -' +
        ' /api/v1/eu/signup/mobile/verifyotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: /api/v1/eu/signup/mobile/verifyotp

  // --- Begin: /api/v1/eu/user/signup/email/sendotp
  app.post('/api/v1/eu/user/signup/email/sendotp', function(req, res, next) {
    if(req.body.mobileNumber && req.body.email) {
      EU_UserLoginService.endUserSignupEmailOTP(req.body, res, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserLoginController.js at post API -' +
        ' /api/v1/eu/user/signup/email/sendotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: /api/v1/eu/user/signup/email/sendotp

  // --- Begin: /api/v1/eu/signup/email/verifyotp
  app.post('/api/v1/eu/signup/email/verifyotp', function(req, res, next) {
    if(req.headers.otp_token && req.body.otp) {
      CommonService.tokenExpireValidation(req.headers.otp_token, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserLoginService.endUserSignupEmailOTPValidation(req.body.otp, tokenDecodedData.decodedTokenData, res, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserLoginController.js at post API -' +
            ' /api/v1/eu/signup/email/verifyotp: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-UserLoginController.js at post API -' +
            ' /api/v1/eu/signup/email/verifyotp: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserLoginController.js at post API -' +
        ' /api/v1/eu/signup/email/verifyotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End:/api/v1/eu/signup/email/verifyotp

  // --- Begin: /api/v1/eu/user/signup
  app.post('/api/v1/eu/user/signup', function(req, res, next) {
    var currentUTC = CommonService.currentUTCObj();
    // upload(req, res, function(err) {
      var bodyValidation = endUserBodyValidation(req.body);
      if(bodyValidation) {
        EU_UserLoginService.endUserSignup(req, res, next, passport, function(resObj) {
          utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
        });
      } else {
        logger.error('There was an Error in controllers/EU-UserLoginController.js at post API -' +
          ' /api/v1/eu/user/signup: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
      }
    // });
  });
  // --- End: /api/v1/eu/user/signup


  // --- Begin: /api/v1/eu/user/signup/sendotp
  app.post('/api/v1/eu/user/signup/sendotp', function(req, res, next) {
    if(req.body.mobileNumber) {
      EU_UserLoginService.endUserSignupSendOTP(req.body, res, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserLoginController.js at post API -' +
        ' /api/v1/eu/user/signup/sendotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // --- Begin: /api/v1/eu/user/signup/verifyotp
  app.post('/api/v1/eu/user/signup/verifyotp', function(req, res, next) {
    if(req.headers.otp_token && req.body.otpNumber) {
      CommonService.tokenExpireValidation(req.headers.otp_token, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserLoginService.endUserSignupMobileOTPValidation(req.body.otpNumber, tokenDecodedData.decodedTokenData, res, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserLoginController.js at post API -' +
            ' /api/v1/eu/user/signup/verifyotp: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-UserLoginController.js at post API -' +
            ' /api/v1/eu/user/signup/verifyotp: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserLoginController.js at post API -' +
        ' /api/v1/eu/user/signup/verifyotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.post('/api/v1/eu/user/social/signup', function(req, res, next) {
    if(req.body.name && req.body.email) {
      EU_UserLoginService.userSocialLoginRegister(req.body, res, function(resObj) {
        var euObj = resObj.result;
        var decObj = {
          mobileNumber: !resObj.result.mobileNumber.includes('@') ? resObj.result.mobileNumber : '',
          email: resObj.result.email.includes('@') ? resObj.result.email : '',
          alternateContactNumber: resObj.result.alternateContactNumber ? CommonService.decrypt(resObj.result.alternateContactNumber) : '',
          alternateEmail: resObj.result.alternateEmail ? CommonService.decrypt(resObj.result.alternateEmail) : '',
        };
        euObj['_id'] = undefined;
        euObj['passwordSalt'] = undefined;
        euObj['password'] = undefined;
        euObj['loginKey'] = undefined;
        euObj['otp'] = undefined;
        euObj['otpSalt'] = undefined;
        euObj['mobileNumber'] = undefined;
        euObj['email'] = undefined;
        euObj['alternateEmail'] = undefined;
        euObj['alternateContactNumber'] = undefined;
        if(!euObj._id && !euObj.passwordSalt && !euObj.password && !euObj.loginKey && !euObj.otp && !euObj.otpSalt) {
          var resultObj = JSON.parse((JSON.stringify(euObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
          utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resultObj);
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserLoginController.js, at post API -' +
        ' /api/v1/eu/user/social/signup: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v1/eu/user/social/auth/google', function(req, res, next) {
    passport.authenticate('google', {
      scope: [ 'email', 'profile' ]
    })(req, res, next);
  });
 
  app.get('/api/v1/eu/user/social/auth/google/callback', function(req, res, next) {
    passport.authenticate('google',
    function(error, userObj) {
      try {
        if(userObj && userObj.loginKey) {
          CommonService.tokenGeneration(userObj, res, function(token) {
            if(token) {
              userObj['_id'] = undefined;
              userObj['passwordSalt'] = undefined;
              userObj['password'] = undefined;
              userObj['otp'] = undefined;
              userObj['otpSalt'] = undefined;
              userObj['mobileNumber'] = !userObj.mobileNumber.includes('@') ? userObj.mobileNumber : '';
              userObj['email'] = userObj.email.includes('@') ? userObj.email : '';
              if(!userObj._id && !userObj.passwordSalt && !userObj.password
              && !userObj.otp && !userObj.otpSalt) {
                res.writeHead(301,
                  {Location: config.uiDomain + 'social/login/success/' + userObj.loginKey + '/' + token}
                );
                res.end();
              }
            } else {
              logger.error('There was an Error in controllers/EU-UserLoginController.js,' +
              ' at socialLogin using google - generateToken:', error);
              res.writeHead(301,
                {Location: config.uiDomain + 'hotels/'}
              );
              res.end();
            }
          });
        } else {
          logger.error('There was an Error in controllers/EU-UserLoginController.js, at get API -' +
          ' /api/v1/eu/user/social/auth/google/callback: ' + error);
          res.writeHead(301,
            {Location: config.uiDomain + 'hotels/'}
          );
          res.end();
        }
      } catch (err) {
        logger.error('There was an Un-known Error occured in controllers/EU-UserLoginController.js, at get API -' +
        ' /api/v1/eu/user/social/auth/google/callback: ' + err);
        res.writeHead(301,
          {Location: config.uiDomain + 'hotels/'}
        );
      }
    // },
    // {
    //   successRedirect: config.uiDomain,
    //   failureRedirect: config.uiDomain + 'hotels/'
    })(req, res, next);
  });

  app.get('/api/v1/eu/user/social/auth/facebook', function(req, res, next) {
    passport.authenticate('facebook', {
      scope: ['user_friends', 'email', 'public_profile']
    })(req, res, next);
  });

  app.get('/api/v1/eu/user/social/auth/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook',
    function(error, userObj) {
      try {
        if(userObj && userObj.loginKey) {
          CommonService.tokenGeneration(userObj, res, function(token) {
            if(token) {
              userObj['_id'] = undefined;
              userObj['passwordSalt'] = undefined;
              userObj['password'] = undefined;
              userObj['otp'] = undefined;
              userObj['otpSalt'] = undefined;
              userObj['mobileNumber'] = !userObj.mobileNumber.includes('@') ? userObj.mobileNumber : '';
              userObj['email'] = userObj.email.includes('@') ? userObj.email : '';
              if(!userObj._id && !userObj.passwordSalt && !userObj.password
              && !userObj.otp && !userObj.otpSalt) {
                res.writeHead(301,
                  {Location: config.uiDomain + 'social/login/success/' + userObj.loginKey + '/' + token}
                );
                res.end();
              }
            } else {
              logger.error('There was an Error in controllers/EU-UserLoginController.js,' +
              ' at socialLogin using facebook - generateToken:', error);
              res.writeHead(301,
                {Location: config.uiDomain + 'hotels/'}
              );
              res.end();
            }
          });
        } else {
          logger.error('There was an Error in controllers/EU-UserLoginController.js, at get API -' +
          ' /api/v1/eu/user/social/auth/facebook/callback: ' + error);
          res.writeHead(301,
            {Location: config.uiDomain + 'hotels/'}
          );
          res.end();
        }
      } catch (err) {
        logger.error('There was an Un-known Error occured in controllers/EU-UserLoginController.js, at get API -' +
        ' /api/v1/eu/user/social/auth/facebook/callback: ' + err);
        res.writeHead(301,
          {Location: config.uiDomain + 'hotels/'}
        );
      }
    // },
    // {
    //   successRedirect: config.uiDomain,
    //   failureRedirect: config.uiDomain + 'hotels/'
    })(req, res, next);
  });

  app.post('/api/v1/eu/user/social/login', function(req, res, next) {
    if(req.headers.token && req.body.accessToken) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserLoginService.endUsersSocialLogin(req.body.accessToken, tokenDecodedData.decodedTokenData, res, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserLoginController.js at post API - /api/v1/eu/user/social/login: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/EU-UserLoginController.js at post API - /api/v1/eu/user/social/login: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserLoginController.js, at post API -' +
      ' /api/v1/eu/user/social/login: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });


  app.post('/api/v1/eu/user/profile/mobileNumber/uniqness', function (req, res, next) {
    if (req.headers.token && req.body.mobileNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserLoginService.updateUserProfileMobileNumberVerify(req.body,
            tokenDecodedData.decodedTokenData, res, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/EU-UsersProfileController.js at put API -',
                ' /api/v1/eu/user/profile/mobileNumber/uniqness: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Un-known Error in controllers/EU-UsersProfileController.js at put API -',
                ' /api/v1/eu/user/profile/mobileNumber/uniqness: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/EU-UsersProfileController.js at put API -',
            '/api/v1/eu/user/profile/mobileNumber/uniqness: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });


  // --- Begin: /api/v1/eu/user/profile/mobileNumber/verifyotp
  app.post('/api/v1/eu/user/profile/mobileNumber/verifyotp', function(req, res, next) {
    if(req.headers.otp_token && req.body.otpNumber) {
      CommonService.tokenExpireValidation(req.headers.otp_token, function(otpTokenDecodedData) {
        if(otpTokenDecodedData && !otpTokenDecodedData.expStatus) {
          EU_UserLoginService.endUserProfileMobileOTPValidation(req.body.otpNumber, otpTokenDecodedData.decodedTokenData, res, function(resObj) {
            if (resObj.statusCode == '1002') {
              CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
                if(tokenDecodedData && !tokenDecodedData.expStatus) {
                  EU_UserLoginService.updateUserMobileNumber(tokenDecodedData.decodedTokenData, otpTokenDecodedData.decodedTokenData.iss, res, function(resObj) {
                    utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                  });
                } else if(tokenDecodedData && tokenDecodedData.expStatus) {
                  logger.error('There was an Error in controllers/EU-UserLoginController.js at post API - /api/v1/eu/user/profile/mobileNumber/verifyotp: Token expired');
                  utils.sendResponse(res, 400, '9995', {});
                }
              });
            } else {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            }
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserLoginController.js at post API -' +
            '/api/v1/eu/user/profile/mobileNumber/verifyotp: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-UserLoginController.js at post API -' +
            '/api/v1/eu/user/profile/mobileNumber/verifyotp: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserLoginController.js at post API -' +
        '/api/v1/eu/user/profile/mobileNumber/verifyotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // app.get('/api/v1/public/private/keys', function(req, res, next) {
  //   PromiseA.all([
  //     genPubPrivKeys.keypair('assets/bob'),
  //     genPubPrivKeys.keypair('assets/alice')
  //   ]).then(function (keys) {
  //     // console.log('generated %d keypairs', keys.length);
  //     utils.sendResponse(res, 200, '0000', {});
  //   });
  // });
}

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function endUserBodyValidation(reqBodyObj) {
  // if(reqBodyObj.firstName && reqBodyObj.lastName && reqBodyObj.userID && reqBodyObj.mobileNumber && reqBodyObj.email && reqBodyObj.password &&
  // reqBodyObj.dob && reqBodyObj.address) {
  if(reqBodyObj.mobileNumber && reqBodyObj.password) {
    return true;
  } else
    return false;
}
