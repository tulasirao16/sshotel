
/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var CommonService = require('./CommonService');
var EU_ForgotPasswordDAO = require('../daos/EU-ForgotPasswordDAO');
var Feedback = require('../models/Feedback');
var randomNumber = require('random-number');    
var config = require('config');
var mail = require('../config/mail');
var sendSMS = require('../config/sendSMS');

// Begin --- EndUsers Feedback
module.exports = {

    euForgotPasswordSendOtp: function (email, res, callback) {
      let checkmobileNumberorEmail = email.includes('@');
        var otpNumberLimit = { min: 1000, max: 9999, integer: true };
        var otpNumber = randomNumber(otpNumberLimit).toString();
        EU_ForgotPasswordDAO.euForgetPasswordSendOTP(email, 'Active', function (regData) {
          if(checkmobileNumberorEmail) {
            if (regData && regData.email) {
                endUsersLoginWithOTP(email, otpNumber, 'forget', res, function (resObj) {
                    callback(resObj);
                });
            } else {
                callback({ httpCode: 400, statusCode: '9788', result: {} });
            }
          } else {
            if (regData && regData.mobileNumber) {
              endUsersforotPasswordMobileWithOTP(email, otpNumber, 'forget', res, function (resObj) {
                  callback(resObj);
              });
          } else {
              callback({ httpCode: 400, statusCode: '9788', result: {} });
          }
        }
      });
    },
    // Begin -- EU Forgot Password Otp validation
    euForgotPasswordOTPValidation: function(otpNumber, tokenDecodedData, res, callback) {
        euForgotPasswordOTPResponse(tokenDecodedData.ise || tokenDecodedData.iss, tokenDecodedData.ot, otpNumber, res, function(resObj) {
          callback(resObj);
        });
      },
   // Begin -- EU Reset Password
   updateEuPassword: function(password, decodedTokenData, callback) {
    CommonService.saltGeneration(config.saltSize, function(salt) {
      CommonService.passwordEncryption(password, salt, function(pswdObj) {
        var currentUTC = CommonService.currentUTCObj();
        var updatePasswordObj = {
          password: pswdObj.passwordHash,
          passwordSalt: pswdObj.salt,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedOn: currentUTC.currentUTCDateTimeString
        };
        EU_ForgotPasswordDAO.updateEuPassword(decodedTokenData, updatePasswordObj, function(regData) {
          callback({httpCode: regData.httpCode, statusCode: regData.statusCode, result: regData.result});
        });
      });
    });
  },
}

/**
 * @param {string} email string
 * @param {string} otpNumber string
 * @param {string} otpType string
 * @param {object} res object
 * @param {function} callback is a callback function
 */
function endUsersLoginWithOTP(email, otpNumber, otpType, res, callback) {
    var currentUTC = CommonService.currentUTCObj();
    CommonService.saltGeneration(config.saltSize, function(salt) {
      CommonService.passwordEncryption(otpNumber, salt, function(pswObj) {
        if(pswObj && pswObj.passwordHash) {
            EU_ForgotPasswordDAO.setUsersLoginOTP(email, pswObj, currentUTC, function(eulOTPError, resObj) { 
            if(eulOTPError) {
              logger.error('There was an Un-known Error in services/EU-ForgotPasswordService.js at endUsersLoginWithOTP - setUsersLoginOTP:', eulOTPError);
              callback({httpCode: 500, statusCode: '9999', result: {}});
            } else if(resObj.statusCode == '1254') {
              CommonService.loginOTPTokenGeneration({'email': email}, otpType,
              res, function(token) {
                if(token) {
                  //  mail.sendEMail(resObj.result.email, 'Forgot Password OTP', otpNumber, function(error, resEObj) {
                  //   if(error) {
                  //     logger.error('There was an Un-known Error in services/EU-ForgotPasswordService.js at endUsersLoginWithOTP  email otp send failed');
                  //     callback({httpCode:400, statusCode: '9953', result: {}});
                  //   } else {
                      callback({httpCode: 200, statusCode: resObj.statusCode, result: {'otpMessage': 'OTP Sent', 'otpNumber': otpNumber}});
                  //   }
                  // });
                } else {
                  logger.error('There was an Un-known Error in services/EU-ForgotPasswordService.js at endUsersLoginWithOTP - loginOTPTokenGeneration: Token generation failed');
                  callback({httpCode: 500, statusCode: '9999', result: {}});
                }
              });
            } else {
              logger.error('There was an Error in services/EU-ForgotPasswordService.js at endUsersLoginWithOTP - setUsersLoginOTP: OTP sent failed');
              callback({httpCode: 400, statusCode: resObj.statusCode, result: {otpMessage: 'OTP Sent failed'}});
            }
          });
        } else {
          logger.error('There was an Error in services/EU-ForgotPasswordService.js at endUsersLoginWithOTP - passwordEncryption: OTP generation failed');
          callback({httpCode: 400, statusCode: '9994', result: {otpMessage: 'OTP Sent failed'}});
        }
      });
    });
  }

  /**
* @param {string} email string
* @param {string} otpType String
* @param {string} otpNumber string
* @param {object} res object
* @param {function} callback is a callback function
*/
function euForgotPasswordOTPResponse(email, otpType, otpNumber, res, callback) {
    var currentUTC = CommonService.currentUTCObj();
    EU_ForgotPasswordDAO.euforgotPasswordEmailVerify(email,function(error, userResData) {
      var userData = userResData.result;
      var isUser = CommonService.isJsonObjectEmpty(userData);
      if(!isUser) {
        CommonService.passwordEncryption(otpNumber, userData.otpSalt, function(pswObj) {
          if(pswObj && pswObj.passwordHash && pswObj.passwordHash == userData.otp) {
                EU_ForgotPasswordDAO.updateEUForgotPasswordOTP(userData, currentUTC, function(updateResObj) {
                if(updateResObj.statusCode == '0000') {
                  CommonService.loginOTPTokenGeneration({'email': userData.email}, 'forget',
                  res, function(token) {
                    if(token) {
                      callback({httpCode: 200, statusCode: '1255', result: {'otpMessage': 'Forget Password OTP verified successfully'}});
                    } else {
                      logger.error('There was an Un-known Error in services/EU-ForgotPasswordService.js at endUsersLoginOTPResponse - loginOTPTokenGeneration: Token generation failed');
                      callback({httpCode: 500, statusCode: '9999', result: {}});
                    }
                  });
                } else {
                  logger.error('There was an Error in services/EU-ForgotPasswordService.js at endUsersLoginOTPResponse - updateOTPValue: OTP verification failed');
                  callback({httpCode: 400, statusCode: '9958', result: {otpMessage: 'OTP verification failed'}});
                }
              });
          } else {
            logger.error('There was an Error in services/EU-ForgotPasswordService.js at endUsersLoginOTPResponse - passwordEncryption: OTP verification failed');
            callback({httpCode: 400, statusCode: '9958', result: {otpMessage: 'OTP verification failed'}});
          }
        });
      } else {
        logger.error('There was an Error in services/EU-ForgotPasswordService.js at endUsersLoginOTPResponse - userLogin: OTP verification failed');
        callback({httpCode: 400, statusCode: '9958', result: {otpMessage: 'OTP verification failed'}});
      }
    });
  }
  
  /**
 * @param {string} email string
 * @param {string} otpNumber string
 * @param {string} otpType string
 * @param {object} res object
 * @param {function} callback is a callback function
 */
function endUsersforotPasswordMobileWithOTP(email, otpNumber, otpType, res, callback) {
  var currentUTC = CommonService.currentUTCObj();
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(otpNumber, salt, function(pswObj) {
      if(pswObj && pswObj.passwordHash) {
          EU_ForgotPasswordDAO.setUsersLoginOTP(email, pswObj, currentUTC, function(eulOTPError, resObj) {
          if(eulOTPError) {
            logger.error('There was an Un-known Error in services/EU-ForgotPasswordService.js at endUsersforotPasswordMobileWithOTP - setUsersLoginOTP:', eulOTPError);
            callback({httpCode: 500, statusCode: '9999', result: {}});
          } else if(resObj.statusCode == '1254') {
            CommonService.loginOTPTokenGeneration({'mobileNumber': email}, otpType,
            res, function(token) {             
              if(token) {
                  // var message = otpNumber + config.smsLoginOTPMessage;
                  // sendSMS.sendSMS(resObj.result.mobileNumber, message, function(smsError, smsRes) {
                  //   if(smsError) {
                  //     logger.error('There was an Un-known Error in services/EU-UserLoginService.js at endUserSignupMobileOTP - sendSMS:', smsError);
                  //     callback({httpCode: 500, statusCode: '9999', result: {}});
                  //   } else {
                  //     callback({httpCode: 200, statusCode: spuResObj.statusCode, result: {'otpMessage': 'OTP Sent', 'otpNumber': otpNumber}});
                  //   }
                  // });
                  // console.log('otpNumber', otpNumber);
                  callback({httpCode: 200, statusCode: resObj.statusCode, result: {'otpMessage': 'OTP Sent', 'otpNumber': otpNumber}});
              } else {
                logger.error('There was an Un-known Error in services/EU-ForgotPasswordService.js at endUsersforotPasswordMobileWithOTP - loginOTPTokenGeneration: Token generation failed');
                callback({httpCode: 500, statusCode: '9999', result: {}});
              }
            });
          } else {
            logger.error('There was an Error in services/EU-ForgotPasswordService.js at endUsersforotPasswordMobileWithOTP - setUsersLoginOTP: OTP sent failed');
            callback({httpCode: 400, statusCode: resObj.statusCode, result: {otpMessage: 'OTP Sent failed'}});
          }
        });
      } else {
        logger.error('There was an Error in services/EU-ForgotPasswordService.js at endUsersforotPasswordMobileWithOTP - passwordEncryption: OTP generation failed');
        callback({httpCode: 400, statusCode: '9994', result: {otpMessage: 'OTP Sent failed'}});
      }
    });
  });
}