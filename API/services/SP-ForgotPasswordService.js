/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var CommonService = require('./CommonService');
var SP_ForgotPasswordDAO = require('../daos/SP-ForgotPasswordDAO');
var Feedback = require('../models/Feedback');
var randomNumber = require('random-number');
var config = require('config');
var mail = require('../config/mail');
var sendSMS = require('../config/sendSMS');

// Begin --- ServiceProviders Feedback
module.exports = {

  spForgotPasswordSendOtp: function(userId, res, callback) {
    let isEmail = userId.includes('@');
    var otpNumberLimit = { min: 1000, max: 9999, integer: true };
    var otpNumber = randomNumber(otpNumberLimit).toString();
    SP_ForgotPasswordDAO.getSPUserData(userId, function(userObj) {
      if(userObj.statusCode == '0000') {
        var data = userObj.result;
        if(isEmail) {
          spUserForgotPasswordSendEmailOTP(userId, otpNumber, 'forget', data._id, res, function(resObj) {
            callback(resObj);
          });
        } else {
          spUserForgotPasswordSendMobileOTP(userId, otpNumber, 'forget', data._id, res, function(resObj) {
            callback(resObj);
          });
        }
      } else {
        callback(userObj);
      }
    });
  },
  // Begin -- SP Forgot Password Otp validation
  spForgotPasswordOTPValidation: function(otpNumber, tokenDecodedData, res, callback) {
    spForgotPasswordOTPResponse(tokenDecodedData.ise || tokenDecodedData.iss, tokenDecodedData, otpNumber, res, function(resObj) {
      callback(resObj);
    });
  },
  // Begin -- SP Reset Password
  updateSpPassword: function(password, decodedTokenData, callback) {
    CommonService.saltGeneration(config.saltSize, function(salt) {
      CommonService.passwordEncryption(password, salt, function(pswdObj) {
        var currentUTC = CommonService.currentUTCObj();
        var updatePasswordObj = {
          password: pswdObj.passwordHash,
          passwordSalt: pswdObj.salt,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedOn: currentUTC.currentUTCDateTimeString
        };
        SP_ForgotPasswordDAO.updateSpPassword(decodedTokenData, updatePasswordObj, function(regData) {
          callback(regData);
        });
      });
    });
  },
}

/**
 * @param {string} contactEmail string
 * @param {string} otpNumber string
 * @param {string} otpType string
 * @param {object} res object
 * @param {function} callback is a callback function
 */
function spUserForgotPasswordSendEmailOTP(contactEmail, otpNumber, otpType, recordID, res, callback) {
  var currentUTC = CommonService.currentUTCObj();
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(otpNumber, salt, function(pswObj) {
      if(pswObj && pswObj.passwordHash) {
        SP_ForgotPasswordDAO.setSPUserForgotPasswordOTP(recordID, pswObj, currentUTC, function(resObj) {
          if(resObj.statusCode == '0000') {
            CommonService.loginOTPTokenGeneration({ 'email': contactEmail, '_id': recordID }, otpType,
            res, function(token) {
              if(token) {
                callback({ httpCode: 200, statusCode: '1001', result: { 'otpNumber': otpNumber, 'otpMessage': 'OTP Sent success' } });
              } else {
                logger.error('There was an Un-known Error in services/SP-ForgotPasswordService.js at spUserForgotPasswordSendEmailOTP - loginOTPTokenGeneration: Token generation failed');
                callback({ httpCode: 500, statusCode: '9999', result: { otpMessage: 'OTP Sent failed' } });
              }
            });
          } else {
            callback(resObj);
          }
        });
      } else {
        logger.error('There was an Error in services/SP-ForgotPasswordService.js at spUserForgotPasswordSendEmailOTP - passwordEncryption: OTP generation failed');
        callback({ httpCode: 400, statusCode: '9994', result: { otpMessage: 'OTP Sent failed' } });
      }
    });
  });
}

/**
* @param {string} contactEmail string
* @param {string} otpNumber string
* @param {string} otpType string
* @param {object} res object
* @param {function} callback is a callback function
*/
function spUserForgotPasswordSendMobileOTP(mobileNumber, otpNumber, otpType, recordID, res, callback) {
  var currentUTC = CommonService.currentUTCObj();
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(otpNumber, salt, function(pswObj) {
      if(pswObj && pswObj.passwordHash) {
        SP_ForgotPasswordDAO.setSPUserForgotPasswordOTP(recordID, pswObj, currentUTC, function(resObj) {
          if(resObj.statusCode == '0000') {
            CommonService.loginOTPTokenGeneration({ 'mobileNumber': mobileNumber, '_id': recordID }, otpType,
              res, function(token) {
                if(token) {
                  callback({ httpCode: 200, statusCode: '1001', result: { 'otpNumber': otpNumber, 'otpMessage': 'OTP Sent success' } });
                } else {
                  logger.error('There was an Un-known Error in services/SP-ForgotPasswordService.js at spUserForgotPasswordSendMobileOTP - loginOTPTokenGeneration: Token generation failed');
                  callback({ httpCode: 500, statusCode: '9999', result: { otpMessage: 'OTP Sent failed' } });
                }
              });
          } else {
            callback(resObj);
          }
        });
      } else {
        logger.error('There was an Error in services/SP-ForgotPasswordService.js at spUserForgotPasswordSendMobileOTP - passwordEncryption: OTP generation failed');
        callback({ httpCode: 400, statusCode: '9994', result: { otpMessage: 'OTP Sent failed' } });
      }
    });
  });
}

/**
* @param {string} userId string
* @param {object} tokenDecodedData object
* @param {string} otpNumber string
* @param {object} res object
* @param {function} callback is a callback function
*/
function spForgotPasswordOTPResponse(userId, tokenDecodedData, otpNumber, res, callback) {
  var currentUTC = CommonService.currentUTCObj();
  SP_ForgotPasswordDAO.getSPUserData(userId, function(spResData) {
    var spData = spResData.result;
    if(spResData.statusCode == '0000') {
      CommonService.passwordEncryption(otpNumber, spData.otpSalt, function(pswObj) {
        if(pswObj && pswObj.passwordHash && pswObj.passwordHash == spData.otp) {
          SP_ForgotPasswordDAO.updateSPForgotPasswordOTP(spData, currentUTC, function(updateRespObj) {
            if(updateRespObj.statusCode == '0000') {
              CommonService.loginOTPTokenGeneration({ 'email': tokenDecodedData.ise, 'mobileNumber': tokenDecodedData.iss, '_id': tokenDecodedData._id },
              'forget', res, function(token) {
                if(token) {
                  callback({ httpCode: 200, statusCode: '1002', result: { 'otpMessage': 'Forgot Password OTP verified successfully' } });
                } else {
                  logger.error('There was an Un-known Error in services/SP-ForgotPasswordService.js at serviceProvidersLoginOTPResponse - loginOTPTokenGeneration: Token generation failed');
                  callback({ httpCode: 500, statusCode: '9999', result: {} });
                }
              });
            } else {
              logger.error('There was an Error in services/SP-ForgotPasswordService.js at serviceProvidersLoginOTPResponse - updateSPForgotPasswordOTP: OTP verification failed');
              callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
            }
          });
        } else {
          logger.error('There was an Error in services/SP-ForgotPasswordService.js at serviceProvidersLoginOTPResponse - passwordEncryption: OTP verification failed');
          callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
        }
      });
    } else {
      logger.error('There was an Error in services/SP-ForgotPasswordService.js at serviceProvidersLoginOTPResponse - getSPUserData: OTP verification failed');
      callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
    }
  });
}
