/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */
var config = require('config');
var geolite2 = require('geolite2');
var maxmind = require('maxmind');
var fs = require('fs');
var request = require('request');
var uuid = require('node-uuid');
var randomNumber = require('random-number');

var CommonService = require('./CommonService');
var EU_UserLoginDAO = require('../daos/EU-UserLoginDAO');
var EU_Users = require('../models/EU-Users');
var EU_UsersVerifications = require('../models/EU-UsersVerifications');
var logger = require('../lib/logger');
var mail = require('../config/mail');
// --- Begin: EU-UserLoginService
module.exports = {
  // --- Begin userLogin: Code to handle User Login credentials
  userLogin: function(req, res, next, passport, callback) {
    // --- This is to authenticate login credentials and gives the response using passport
    passport.authenticate('eu-local-login', function(resObj) {
      try {
        if(resObj.statusCode == '1000') {
          CommonService.tokenGeneration(resObj.result, res, function(token) {
            if(token) {
              var euObj = resObj.result;
              var decObj = {
                mobileNumber: !resObj.result.mobileNumber.includes('@') ? resObj.result.mobileNumber : '',
                email: resObj.result.email.includes('@') ? resObj.result.email : '',
                alternateContactNumber: resObj.result.alternateContactNumber ? CommonService.decrypt(resObj.result.alternateContactNumber) : '',
                alternateEmail: resObj.result.alternateEmail ? CommonService.decrypt(resObj.result.alternateEmail) : '',
                pgcInPercent: config.pgcInPercent
              };
              euObj['_id'] = undefined;
              euObj['passwordSalt'] = undefined;
              euObj['password'] = undefined;
              euObj['loginKey'] = undefined;
              euObj['otp'] = undefined;
              euObj['otpSalt'] = undefined;
              // euObj['mobileNumber'] = !euObj.mobileNumber.includes('@') ? euObj.mobileNumber : '';
              // euObj['email'] = euObj.email.includes('@') ? euObj.email : '';
              euObj['mobileNumber'] = undefined;
              euObj['email'] = undefined;
              euObj['alternateEmail'] = undefined;
              euObj['alternateContactNumber'] = undefined;
              if(!euObj._id && !euObj.passwordSalt && !euObj.password && !euObj.loginKey && !euObj.otp && !euObj.otpSalt) {
                var resultObj = JSON.parse((JSON.stringify(euObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resultObj });
              }
            } else {
              logger.error('There was an Error in services/EU-UserLoginService.js,',
                ' at userLogin function of generateToken:', error);
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            }
          });
        } else if(resObj.statusCode != '9999') {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: {} });
        } else {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } catch (error) {
        logger.error('There was an Un-Known Error occured in services/EU-UserLoginService.js,',
          ' at userLogin:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    })(req, res, next);
  },
  // --- End userLogin: Code to handle User Login credentials

  // --- Begin : endUserSignupMobileOTP
  endUserSignupMobileOTP: function(reqBody, res, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var otpNumberLimit = { min: 1000, max: 9999, integer: true };
    var otpNumber = randomNumber(otpNumberLimit).toString();
    EU_UserLoginDAO.userVerifyLogin(reqBody.mobileNumber, reqBody.email, function(resObj) {
      if(resObj.statusCode == '1000' && (resObj.result.mbnVerifyStatus == 'Verified' && resObj.result.emailVerifyStatus == 'Verified') && resObj.result.isUserCreated) {
        callback({ httpCode: 200, statusCode: '1003', result: {} });
      } else if(resObj.statusCode == '1000' && resObj.result.mbnVerifyStatus == 'Verified' && !resObj.result.isUserCreated) {
        callback({ httpCode: 200, statusCode: '1006', result: {} });
      } else if(resObj.statusCode == '1000' && resObj.result.mbnVerifyStatus !== 'Verified') {
        setMobileNumberVerification(reqBody.mobileNumber, resObj.result, otpNumber, currentUTC, function(mbObj) {
          if(mbObj.statusCode == '0000') {
            CommonService.loginOTPTokenGeneration({ 'mobileNumber': reqBody.mobileNumber, 'nToken': '' }, 'registration',
              res, function(token) {
                if(token) {
                  // var message = otpNumber + config.smsLoginOTPMessage;
                  // sendSMS.sendSMS(mobileNumber, message, function(smsError, smsRes) {
                  //   if(smsError) {
                  //     logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupMobileOTP - sendSMS:', smsError);
                  //     callback({httpCode: 500, statusCode: '9999', result: {}});
                  //   } else {
                  //     callback({httpCode: 200, statusCode: spuResObj.statusCode, result: {'otpMessage': 'OTP Sent', 'otpNumber': otpNumber}});
                  //   }
                  // });
                  callback({ httpCode: 200, statusCode: '1001', result: { 'otpMessage': 'OTP Sent', 'otpNumber': otpNumber } });
                } else {
                  logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupMobileOTP - loginOTPTokenGeneration: Token generation failed');
                  callback({ httpCode: 400, statusCode: '9953', result: {} });
                }
              });
          } else {
            logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupMobileOTP - loginOTPTokenGeneration: Token generation failed');
            callback({ httpCode: 400, statusCode: '9953', result: {} });
          }
        });
      } else if(resObj.statusCode == '0000' && reqBody.email == resObj.result.email) {
        callback({ httpCode: 200, statusCode: '1008', result: { message: 'your Email linked with' + resObj.result.mobileNumber } });
      } else if(resObj.statusCode == '0000' && reqBody.mobileNumber == resObj.result.mobileNumber) {
        callback({ httpCode: 200, statusCode: '1008', result: { message: 'your Mobile number linked with' + resObj.result.email } });
      } else if(resObj.statusCode == '9950') {
        setEndUserMobileOTP(reqBody, otpNumber, currentUTC, function(userResObj) {
          if(userResObj.statusCode == '0000') {
            CommonService.loginOTPTokenGeneration({ 'mobileNumber': reqBody.mobileNumber, 'nToken': '' }, 'registration',
              res, function(token) {
                if(token) {
                  // var message = otpNumber + config.smsLoginOTPMessage;
                  // sendSMS.sendSMS(mobileNumber, message, function(smsError, smsRes) {
                  //   if(smsError) {
                  //     logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupMobileOTP - sendSMS:', smsError);
                  //     callback({httpCode: 500, statusCode: '9999', result: {}});
                  //   } else {
                  //     callback({httpCode: 200, statusCode: spuResObj.statusCode, result: {'otpMessage': 'OTP Sent', 'otpNumber': otpNumber}});
                  //   }
                  // });
                  callback({ httpCode: 200, statusCode: '1001', result: { 'otpMessage': 'OTP Sent', 'otpNumber': otpNumber } });
                } else {
                  logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupMobileOTP - loginOTPTokenGeneration: Token generation failed');
                  callback({ httpCode: 400, statusCode: '9953', result: {} });
                }
              });
          } else {
            logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupMobileOTP - loginOTPTokenGeneration: Token generation failed');
            callback({ httpCode: 400, statusCode: '9953', result: {} });
          }
        });
      } else {
        logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupMobileOTP');
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    });
  },
  // --- End : endUserSignupMobileOTP

  // --- Begin: endUserSignupMobileOTPValidation:
  endUserSignupMobileOTPValidation: function(otp, tokenDecodedData, res, callback) {
    EU_UserLoginDAO.userMobile1Verify(tokenDecodedData.iss, function(regObj) {
      if(regObj.result && regObj.result.mobileNumber) {
        CommonService.passwordEncryption(otp, regObj.result.mbnOtpSalt, function(otpVObj) {
          if(otpVObj && otpVObj.passwordHash && otpVObj.passwordHash == regObj.result.mbnOtp) {
            var currentUTC = CommonService.currentUTCObj();
            EU_UserLoginDAO.updateEndUserSignupMobileOTP(tokenDecodedData, currentUTC, function(upObj) {
              CommonService.loginOTPTokenGeneration({ 'mobileNumber': regObj.result.mobileNumber, 'nToken': '' }, 'registration',
              res, function(token) {
                if(token) {
                  callback({ httpCode: upObj.httpCode, statusCode: upObj.statusCode, result: upObj.result });
                } else {
                  callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
                }
              });
            });
          } else {
            logger.error('There was an Error in services/EU-UserLoginService.js at endUserSignupMobileOTPValidation - OTP verification failed');
            callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
          }
        });
      } else {
        logger.error('There was an Error in services/EU-UserLoginService.js at endUserSignupMobileOTPValidation - OTP verification failed');
        callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
      }
    });
  },
  // --- End: endUserSignupMobileOTPValidation:

  // --- Begin : endUserSignupEmailOTP
  endUserSignupEmailOTP: function(reqBody, res, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var otpNumberLimit = { min: 1000, max: 9999, integer: true };
    var otpNumber = randomNumber(otpNumberLimit).toString();
    EU_UserLoginDAO.userVerifyLogin(reqBody.mobileNumber, reqBody.email, function(resObj) {
      if(resObj.statusCode == '1000' && (resObj.result.mbnVerifyStatus == 'Verified' || resObj.result.emailVerifyStatus == 'Verified') && resObj.result.isUserCreated) {
        callback({ httpCode: 200, statusCode: '1003', result: {} });
      } else if(resObj.statusCode == '1000' && resObj.result.emailVerifyStatus == 'Verified' && !resObj.result.isUserCreated) {
        callback({ httpCode: 200, statusCode: '1007', result: {} });
      } else if(resObj.statusCode == '1000' && resObj.result.emailVerifyStatus !== 'Verified') {
        setEmailVerification(reqBody.email, resObj.result, otpNumber, currentUTC, function(emObj) {
          if(emObj.statusCode == '0000') {
            CommonService.loginOTPTokenGeneration({ 'email': reqBody.email, 'nToken': '' }, 'registration',
              res, function(token) {
                if(token) {
                  // mail.sendEMail(resObj.result.email, 'Email OTP Verification', otpNumber, function(error, resEObj) {
                  //   if(error) {
                  //   logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupEmailOTP  email otp send failed');
                  //     callback({httpCode:400, statusCode: '9953', result: {}});
                  //   } else {
                  //     callback({ httpCode: 200, statusCode: '1001', result: { 'otpMessage': 'OTP Sent', 'otpNumber': otpNumber } });
                  //   }
                  // });
                  callback({ httpCode: 200, statusCode: '1001', result: { 'otpMessage': 'OTP Sent', 'otpNumber': otpNumber } });
                } else {
                  logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupEmailOTP - loginOTPTokenGeneration: Token generation failed');
                  callback({ httpCode: 400, statusCode: '9953', result: {} });
                }
              });
          } else {
            logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupEmailOTP - loginOTPTokenGeneration: Token generation failed');
            callback({ httpCode: 400, statusCode: '9953', result: {} });
          }
        });
      } else if(resObj.statusCode == '0000' && reqBody.email == resObj.result.email) {
        callback({ httpCode: 200, statusCode: '1008', result: { message: 'your Email linked with' + resObj.result.mobileNumber } });
      } else if(resObj.statusCode == '0000' && reqBody.mobileNumber == resObj.result.mobileNumber) {
        callback({ httpCode: 200, statusCode: '1008', result: { message: 'your Mobile number linked with' + resObj.result.email } });
      } else if(resObj.statusCode == '9950') {
        setEndUserEmailOTP(reqBody, otpNumber, currentUTC, function(userResObj) {
          if(userResObj.statusCode == '0000') {
            CommonService.loginOTPTokenGeneration({ 'email': reqBody.email, 'nToken': '' }, 'registration',
              res, function(token) {
                if(token) {
                  // mail.sendEMail(userResObj.result.email, 'Email OTP Verification', otpNumber, function(error, resEObj) {
                  //   if(error) {
                  //   logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupEmailOTP  email otp send failed');
                  //     callback({httpCode:400, statusCode: '9953', result: {}});
                  //   } else {
                  //     callback({ httpCode: 200, statusCode: 1001, result: { 'otpMessage': 'OTP Sent', 'otpNumber': otpNumber } });
                  //   }
                  // });
                  callback({ httpCode: 200, statusCode: '1001', result: { 'otpMessage': 'OTP Sent', 'otpNumber': otpNumber } });
                } else {
                  logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupEmailOTP - loginOTPTokenGeneration: Token generation failed');
                  callback({ httpCode: 400, statusCode: '9953', result: {} });
                }
              });
          } else {
            logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupEmailOTP - loginOTPTokenGeneration: Token generation failed');
            callback({ httpCode: 400, statusCode: '9953', result: {} });
          }
        });
      } else {
        logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupEmailOTP');
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    });
  },
  // --- End : endUserRegistrationMobileOTP

  // --- Begin : endUserSignupEmailOTPValidation
  endUserSignupEmailOTPValidation: function(otp, tokenDecodedData, res, callback) {
    EU_UserLoginDAO.userEmailVerify(tokenDecodedData.ise, function(regObj) {
      if(regObj.result && regObj.result.email) {
        CommonService.passwordEncryption(otp, regObj.result.emailOtpSalt, function(otpVObj) {
          if(otpVObj && otpVObj.passwordHash && otpVObj.passwordHash == regObj.result.emailOtp) {
            var currentUTC = CommonService.currentUTCObj();
            EU_UserLoginDAO.updateEndUserSignupEmailOTP(tokenDecodedData, currentUTC, function(upObj) {
              CommonService.loginOTPTokenGeneration({ 'email': regObj.result.email, 'nToken': '' }, 'registration',
                res, function(token) {
                  if(token) {
                    callback({ httpCode: upObj.httpCode, statusCode: upObj.statusCode, result: upObj.result });
                  }
                });
            });
          } else {
            logger.error('There was an Error in services/EU-UserLoginService.js at endUserSignupEmailOTPValidation - : OTP verification failed');
            callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
          }
        });
      } else {
        logger.error('There was an Error in services/EU-UserLoginService.js at endUserSignupEmailOTPValidation - : OTP verification failed');
        callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
      }
    });
  },
  // --- End : endUserSignupEmailOTPValidation

  // --- Begin : endUserSignup
  endUserSignup: function(req, res, next, passport, callback) {
    passport.authenticate('eu-local-signup', function(resObj) {
      try {
        callback(resObj);
      } catch (error) {
        logger.error('There was an Un-Known Catch Error occured in services/EU-UserLoginService.js,'+
        ' at endUserSignup:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    })(req, res, next);
  },
  // --- End : endUserSignup


  // --- Begin : endUserSignupSendOTP
  endUserSignupSendOTP: function(reqBody, res, callback) {
    EU_UserLoginDAO.checkMNAndEmail(reqBody.mobileNumber, function(userData) {
      if(userData.statusCode == '0000') {
        callback({ httpCode: 400, statusCode: '9989', result: {} });
      } else {
        var currentUTC = CommonService.currentUTCObj();
        var otpNumberLimit = { min: 1000, max: 9999, integer: true };
        var otpNumber = randomNumber(otpNumberLimit).toString();
        EU_UserLoginDAO.isUserVerified(reqBody.mobileNumber, function(resObj) {
          if(resObj.statusCode == '0000') {
            updateEndUserMobileOTP(reqBody, otpNumber, currentUTC, function(uvResObj) {
              if(uvResObj.statusCode == '0000') {
                sendOtpSMS(reqBody, otpNumber, res, function(smsResObj) {
                  callback(smsResObj);
                });
              } else {
                callback({ httpCode: 400, statusCode: '9953', result: { 'otpMessage': 'OTP Sent Failed' } });
              }
            });
          } else {
            setEndUserMobileOTP(reqBody, otpNumber, currentUTC, function(uvResObj) {
              if(uvResObj.statusCode == '0000') {
                sendOtpSMS(reqBody, otpNumber, res, function(smsResObj) {
                  callback(smsResObj);
                });
              } else {
                callback({ httpCode: 400, statusCode: '9953', result: { 'otpMessage': 'OTP Sent Failed' } });
              }
            });
          }
        });
      }
    });
  },
  // --- End : endUserSignupSendOTP

  // --- Begin: endUserSignupOTPValidation:
  endUserSignupOTPValidation: function(otp, tokenDecodedData, res, callback) {
    EU_UserLoginDAO.isUserVerified(tokenDecodedData.iss, function(regObj) {
      if(regObj.result && regObj.result.verifyValue) {
        CommonService.passwordEncryption(otp, regObj.result.mbnOtpSalt, function(otpVObj) {
          if(otpVObj && otpVObj.passwordHash && otpVObj.passwordHash == regObj.result.mbnOtp) {
            var currentUTC = CommonService.currentUTCObj();
            EU_UserLoginDAO.updateEUSignupOTPVerification(regObj.result._id, currentUTC, function(upObj) {
              if(upObj.statusCode == '1002') {
                CommonService.loginOTPTokenGeneration({ 'mobileNumber': regObj.result.verifyValue, 'nToken': '' }, 'registration',
                res, function(token) {
                  if(token) {
                    callback(upObj);
                  } else {
                    callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
                  }
                });
              } else {
                callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
              }
            });
          } else {
            logger.error('There was an Error in services/EU-UserLoginService.js at endUserSignupOTPValidation - OTP verification failed');
            callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
          }
        });
      } else {
        logger.error('There was an Error in services/EU-UserLoginService.js at endUserSignupOTPValidation - OTP verification failed');
        callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
      }
    });
  },
  // --- End: endUserSignupMobileOTPValidation:

  // --- Begin : userSocialLoginRegister
  userSocialLoginRegister: function(body, res, callback) {
    EU_UserLoginDAO.userLoginVerification(body, res, function(resObj) {
      if(resObj.statusCode == '0000') {
        var currentUTC = CommonService.currentUTCObj();
        var updateObj = {
          deviceNotifyToken: body.deviceToken,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedBy: 'superadmin',
          updatedOn: currentUTC.currentUTCDateTimeString
        };
        EU_UserLoginDAO.userSocialLoginUpdateDeviceToken(updateObj, resObj.result._id, function(resObj) {
          callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
        });
      } else if(resObj.statusCode == '9997') {
        var currentUTC = CommonService.currentUTCObj();
        var currentUTCDateTimeNumber = currentUTC.currentUTCDateTimeNumber;
        var userIcon = '';
        var userIconPath = '';
        if(body.ipAddress) {
          var lookup = maxmind.openSync(geolite2.paths.city);
          var locObj = lookup.get(body.ipAddress);
        }
        const string = body.name;
        const words = string.split(' ');
        const slashSplit = body.profileImage.split('/');
        const fileName = slashSplit.slice(slashSplit.length-1, slashSplit.length).join('');
        const dotSplit = fileName.split('.');
        const fileExt = dotSplit.slice(dotSplit.length-1, dotSplit.length).join('');
        const firstName = words.slice(0, words.length-1).join(' ');
        const lastName = words.slice(words.length-1, words.length).join('');
        if(body.profileImage) {
          var uplLoc = 'assets/eu-users/' + uuid.v1();
          if(!fs.existsSync(uplLoc)) {
            fs.mkdirSync(uplLoc);
          }
          if(body.fbID) {
            download(body.profileImage, 'fb'+currentUTCDateTimeNumber, uplLoc+'/', function() {});
            userIcon = 'fb'+ currentUTCDateTimeNumber;
            userIconPath = uplLoc+'/' + 'fb' + currentUTCDateTimeNumber;
          } else {
            download(body.profileImage, 'gm'+ currentUTCDateTimeNumber, uplLoc+'/', function() {});
            userIcon = 'gm'+ currentUTCDateTimeNumber;
            userIconPath = uplLoc+'/' + 'gm' + currentUTCDateTimeNumber;
          }
        }
        const fName = body.firstName ? body.firstName : firstName;
        const lName = body.lastName ? body.lastName : lastName;
        var dataObj = {
            displayName: body.name,
            firstName: body.firstName ? body.firstName : firstName,
            lastName: body.lastName ? body.lastName : lastName,
            name: fName + ' ' + lName,
            address: body.address ? body.address : locObj.city.names.en,
            userAccount: body.email,
            mobileNumber:  body.email,
            mbnVerifyStatus: 'Open',
            email: body.email,
            emailVerifyStatus: 'Verified',
            userRole: 'Customer',
            userStatus:  'Active',
            userIcon: userIcon,
            userIconPath: userIconPath,
            userIconOriginalName: fileName,
            signupType: body.signupType,
            deviceNotifyToken: body.deviceToken,
            createdBy: 'superadmin',
            createdAt: currentUTC.currentUTCDateTimeNumber,
            createdOn: currentUTC.currentUTCDateTimeString,
            updatedBy: 'superadmin',
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        };
        var userObj = new EU_Users(dataObj);
        EU_UserLoginDAO.userSocialLoginRegister(userObj, res, function(resObj) {
          callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
        });
      } else {
        callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
      }
    });
  },
  // --- End : userSocialLoginRegister

  // --- Begin : endUsersSocialLogin
  endUsersSocialLogin: function(accessToken, tokenDecodedData, res, callback) {
    var query = {
      _id: tokenDecodedData.iss,
      loginKey: accessToken,
      isDeleted: false
    }
    EU_UserLoginDAO.endUsersSocialLogin(query, function(resObj) {
      if(resObj.statusCode == '0000') {
        CommonService.tokenGeneration(resObj.result, res, function(token) {
          if(token) {
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
            if(!euObj._id && !euObj.passwordSalt && !euObj.password && !euObj.loginKey && !euObj.otp && !euObj.otpSalt) {
              var resultObj = JSON.parse((JSON.stringify(euObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
              callback({ httpCode: 200, statusCode: resObj.statusCode, result: resultObj });
            }
          } else {
            logger.error('There was an Error in services/EU-UserLoginService.js, at endUsersSocialLogin function of generateToken');
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          }
        });
      } else {
        callback(resObj);
      }
    });
  },
  // --- End : endUsersSocialLogin

  updateUserProfileMobileNumberVerify: function (body, tokenDecodedData, res, callback) {
    EU_UserLoginDAO.updateUserProfileMobileNumberVerify(tokenDecodedData, body.mobileNumber, res, function (resObj) {
      if (resObj.statusCode == '0000') {
        callback({ httpCode: 400, statusCode: '9989', result: {} });
      } else {
        var currentUTC = CommonService.currentUTCObj();
        var otpNumberLimit = { min: 1000, max: 9999, integer: true };
        var otpNumber = randomNumber(otpNumberLimit).toString();
        EU_UserLoginDAO.isUserVerified(body.mobileNumber, function(resObj) {
          if(resObj.statusCode == '0000') {
            updateEndUserMobileOTP(body, otpNumber, currentUTC, function(uvResObj) {
              if(uvResObj.statusCode == '0000') {
                sendOtpSMS(body, otpNumber, res, function(smsResObj) {
                  callback(smsResObj);
                });
              } else {
                callback({ httpCode: 400, statusCode: '9953', result: { 'otpMessage': 'OTP Sent Failed' } });
              }
            });
          } else {
            setEndUserMobileOTP(body, otpNumber, currentUTC, function(uvResObj) {
              if(uvResObj.statusCode == '0000') {
                sendOtpSMS(body, otpNumber, res, function(smsResObj) {
                  callback(smsResObj);
                });
              } else {
                callback({ httpCode: 400, statusCode: '9953', result: { 'otpMessage': 'OTP Sent Failed' } });
              }
            });
          }
        });
      }
    });
  },

  // --- Begin: endUserProfileMobileOTPValidation:
  endUserProfileMobileOTPValidation: function(otp, tokenDecodedData, res, callback) {
    EU_UserLoginDAO.userMobile1Verify(tokenDecodedData.iss, function(regObj) {
      if(regObj.result && regObj.result.mobileNumber) {
        CommonService.passwordEncryption(otp, regObj.result.mbnOtpSalt, function(otpVObj) {
          if(otpVObj && otpVObj.passwordHash && otpVObj.passwordHash == regObj.result.mbnOtp) {
            var currentUTC = CommonService.currentUTCObj();
            EU_UserLoginDAO.updateEndUserSignupMobileOTP(tokenDecodedData, currentUTC, function(upObj) {
              callback({ httpCode: upObj.httpCode, statusCode: upObj.statusCode, result: upObj.result });
            });
          } else {
            logger.error('There was an Error in services/EU-UserLoginService.js at endUserProfileMobileOTPValidation - OTP verification failed');
            callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
          }
        });
      } else {
        logger.error('There was an Error in services/EU-UserLoginService.js at endUserProfileMobileOTPValidation - OTP verification failed');
        callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
      }
    });
  },
  // --- End: endUserProfileMobileOTPValidation:


  // --- Begin: updateUserMobileNumber:
  updateUserMobileNumber: function(tokenDecodedData, mobileNumber, res, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var userObj = {
        mobileNumber: mobileNumber,
        mbnVerifyStatus: 'verified',
        updatedBy: tokenDecodedData.ua,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
    }
    EU_UserLoginDAO.updateUserMobileNumber(userObj, tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    })
  },
  // --- End: updateUserMobileNumber:

};
// --- End: EU-UserLoginService

var download = function(uri, filename, filePath, callback) {
  request.head(uri, function(err, res, body) {
    request(uri).pipe(fs.createWriteStream(filePath+filename)).on('close', callback);
  });
};

/**
 * @param {object} reqBody object
 * @param {string} otpNumber string
 * @param {object} currentUTC object
 * @param {function} callback is a callback function
 */
function setEndUserMobileOTP(reqBody, otpNumber, currentUTC, callback) {
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(otpNumber, salt, function(otpObj) {
      var otpData = {
        mobileNumber: reqBody.mobileNumber,
        mbnVerifyStatus: 'Open',
        mbnOtp: otpObj.passwordHash,
        mbnOtpSalt: otpObj.salt,
        verifyType: 'Mobile',
        verifySign: reqBody.mobileNumber,
        verifyValue: reqBody.mobileNumber,
        isDeleted: false,
        createdBy: 'superadmin',
        createdAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      var verificationData = new EU_UsersVerifications(otpData);
      EU_UserLoginDAO.setMobileOtpToVerifications(verificationData, function(vfyObj) {
        callback(vfyObj);
      });
    });
  });
}

/**
 * @param {object} reqBody object
 * @param {string} otpNumber string
 * @param {object} res object
 * @param {function} callback is a callback function
 */
function sendOtpSMS(reqBody, otpNumber, res, callback) {
  CommonService.loginOTPTokenGeneration({ 'mobileNumber': reqBody.mobileNumber, 'nToken': '' }, 'registration',
  res, function(token) {
    if(token) {
      // var message = otpNumber + config.smsLoginOTPMessage;
      // sendSMS.sendSMS(mobileNumber, message, function(smsError, smsRes) {
      //   if(smsError) {
      //     logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupMobileOTP - sendSMS:', smsError);
      //     callback({httpCode: 500, statusCode: '9999', result: {}});
      //   } else {
      //     callback({httpCode: 200, statusCode: spuResObj.statusCode, result: {'otpMessage': 'OTP Sent', 'otpNumber': otpNumber}});
      //   }
      // });
      callback({ httpCode: 200, statusCode: '1001', result: { 'otpMessage': 'OTP Sent Successfully', 'otpNumber': otpNumber } });
    } else {
      logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupMobileOTP - loginOTPTokenGeneration: Token generation failed');
      callback({ httpCode: 400, statusCode: '9953', result: { 'otpMessage': 'OTP Sent Failed' } });
    }
  });
}

/**
 * @param {object} reqBody object
 * @param {string} otpNumber string
 * @param {object} currentUTC object
 * @param {function} callback is a callback function
 */
function updateEndUserMobileOTP(reqBody, otpNumber, currentUTC, callback) {
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(otpNumber, salt, function(otpObj) {
      var otpData = {
        mbnVerifyStatus: 'Open',
        mbnOtp: otpObj.passwordHash,
        mbnOtpSalt: otpObj.salt,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      EU_UserLoginDAO.updateMobileOtpToVerifications(reqBody.mobileNumber, otpData, function(vfyObj) {
        callback(vfyObj);
      });
    });
  });
}

/**
 * @param {object} reqBody object
 * @param {string} otpNumber string
 * @param {object} currentUTC object
 * @param {function} callback is a callback function
 */

function setEndUserEmailOTP(reqBody, otpNumber, currentUTC, callback) {
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(otpNumber, salt, function(otpObj) {
      var otpData = {
        mobileNumber: reqBody.mobileNumber,
        mbnVerifyStatus: 'open',
        email: reqBody.email,
        emailVerifyStatus: 'Processing',
        emailOtp: otpObj.passwordHash,
        emailOtpSalt: otpObj.salt,
        isDeleted: false,
        createdBy: 'superadmin',
        createdAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      var verificationData = new EU_UsersVerifications(otpData);
      EU_UserLoginDAO.setMobileOtpToVerifications(verificationData, function(vfyObj) {
        callback(vfyObj);
      });
    });
  });
}

/**
* @param {object} mobileNumber object
* @param {string} tokenDecodedData string
* @param {string} otpNumber string
* @param {object} currentUTC object
* @param {function} callback is a callback function
*/
function setMobileNumberVerification(mobileNumber, resObj, otpNumber, currentUTC, callback) {
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(otpNumber, salt, function(otpObj) {
      var vfyObj = {
        mbnVerifyStatus: 'Processing',
        mbnOtp: otpObj.passwordHash,
        mbnOtpSalt: otpObj.salt,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      EU_UserLoginDAO.updateMobileVerification(resObj._id, vfyObj, function(userResObj) {
        callback(userResObj);
      });
    });
  });
}

/**
* @param {object} email object
* @param {string} tokenDecodedData string
* @param {string} otpNumber string
* @param {object} currentUTC object
* @param {function} callback is a callback function
*/
function setEmailVerification(email, resObj, otpNumber, currentUTC, callback) {
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(otpNumber, salt, function(otpObj) {
      var vfyObj = {
        emailVerifyStatus: 'Processing',
        emailOtp: otpObj.passwordHash,
        emailOtpSalt: otpObj.salt,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      EU_UserLoginDAO.updateMobileVerification(resObj._id, vfyObj, function(userResObj) {
        callback(userResObj);
      });
    });
  });
}