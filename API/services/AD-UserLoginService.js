/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var uuid = require('node-uuid');
var CommonService = require('./CommonService');
var AD_UserLoginDAO = require('../daos/AD-UserLoginDAO');
var randomNumber = require('random-number');
var logger = require('../lib/logger');
// --- Begin: AD-UserLoginService
module.exports = {
  // --- Begin adminUserLogin: Code to handle User Login credentials
  adminUserLogin: function (req, res, next, passport, callback) {
    // --- This is to authenticate login credentials and gives the response using passport
    passport.authenticate('ad-local-login', function (resObj) {
      try {
        if (resObj.statusCode == '1000') {
          CommonService.tokenGeneration(resObj.result, res, function (token) {
            if (token) {
              var adObj = resObj.result;
              var perObj = {
                pgcInPercent: config.pgcInPercent
              };
              adObj['_id'] = undefined;
              adObj['passwordSalt'] = undefined;
              adObj['password'] = undefined;
              adObj['loginKey'] = undefined;
              adObj['otp'] = undefined;
              adObj['otpSalt'] = undefined;
              adObj['pgcInPercent'] = 3;
              // euObj['mobileNumber'] = !euObj.mobileNumber.includes('@') ? euObj.mobileNumber : '';
              // euObj['email'] = euObj.email.includes('@') ? euObj.email : '';
              // adObj['mobileNumber'] = undefined;
              // adObj['email'] = undefined;
              // adObj['alternateEmail'] = undefined;
              // adObj['alternateContactNumber'] = undefined;
              if (!adObj._id && !adObj.passwordSalt && !adObj.password && !adObj.loginKey && !adObj.otp && !adObj.otpSalt) {
                var resultObj = JSON.parse((JSON.stringify(adObj) + JSON.stringify(perObj)).replace(/}{/g, ','))
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resultObj });
              }
            } else {
              logger.error('There was an Error in services/AD-UserLoginService.js, at adminUserLogin function of generateToken:'+ error);
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            }
          });
        } else if (resObj.statusCode != '9999') {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: {} });
        } else {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } catch (error) {
        logger.error('There was an Un-Known Error occured in services/AD-UserLoginService.js, at adminUserLogin:'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    })(req, res, next);
  },
  // --- End adminUserLogin: Code to handle User Login credentials

  // --- Begin: adForgotPasswordSendOTP
  adForgotPasswordSendOTP: function (userId, res, callback) {
    let isEmail = userId.includes('@');
    var otpNumberLimit = { min: 1000, max: 9999, integer: true };
    var otpNumber = randomNumber(otpNumberLimit).toString();
    AD_UserLoginDAO.getADUserData(userId, function (userObj) {
      if (userObj.statusCode == '0000') {
        var data = userObj.result;
        if (isEmail) {
          adUserForgotPasswordSendOTPToEmail(userId, otpNumber, 'forgot', data._id, res, function (resObj) {
            callback(resObj);
          });
        } else {
          adUserForgotPasswordSendOTPToMobile(userId, otpNumber, 'forgot', data._id, res, function (resObj) {
            callback(resObj);
          });
        }
      } else {
        callback(userObj);
      }
    });
  },
  // --- End: adForgotPasswordSendOTP

  // Begin -- adForgotPasswordVerifyOTPValidation
  adForgotPasswordVerifyOTPValidation: function (otpNumber, tokenDecodedData, res, callback) {
    adForgotPasswordVerifyOTPResponse(tokenDecodedData.ise || tokenDecodedData.iss, tokenDecodedData, otpNumber, res, function (resObj) {
      callback(resObj);
    });
  },
  // End -- adForgotPasswordVerifyOTPValidation

  // Begin -- updateADPassword
  updateADPassword: function(password, decodedTokenData, callback) {
    CommonService.saltGeneration(config.saltSize, function(salt) {
      CommonService.passwordEncryption(password, salt, function(pswdObj) {
        var currentUTC = CommonService.currentUTCObj();
        var updatePasswordObj = {
          password: pswdObj.passwordHash,
          passwordSalt: pswdObj.salt,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedOn: currentUTC.currentUTCDateTimeString
        };
        AD_UserLoginDAO.updateADPassword(decodedTokenData, updatePasswordObj, function(regData) {
          callback(regData);
        });
      });
    });
  },
  // End -- updateADPassword
}
// --- End: AD-UserLoginService

/**
 * @param {string} contactEmail string
 * @param {string} otpNumber string
 * @param {string} otpType string
 * @param {string} recordID string
 * @param {object} res object
 * @param {function} callback is a callback function
 */
function adUserForgotPasswordSendOTPToEmail(contactEmail, otpNumber, otpType, recordID, res, callback) {
  var currentUTC = CommonService.currentUTCObj();
  CommonService.saltGeneration(config.saltSize, function (salt) {
    CommonService.passwordEncryption(otpNumber, salt, function (pswObj) {
      if (pswObj && pswObj.passwordHash) {
        AD_UserLoginDAO.setADUserForgotPasswordOTP(recordID, pswObj, currentUTC, function (resObj) {
          if (resObj.statusCode == '0000') {
            CommonService.loginOTPTokenGeneration({ 'email': contactEmail, '_id': recordID }, otpType,
              res, function (token) {
                if (token) {
                  callback({ httpCode: 200, statusCode: '1001', result: { 'otpNumber': otpNumber, 'otpMessage': 'OTP Sent Successfully' } });
                } else {
                  logger.error('There was an Un-known Error in services/AD-UserLoginService.js at adUserForgotPasswordSendOTPToEmail - loginOTPTokenGeneration: Token generation failed');
                  callback({ httpCode: 500, statusCode: '9999', result: { otpMessage: 'OTP Sent failed' } });
                }
              });
          } else {
            callback(resObj);
          }
        });
      } else {
        logger.error('There was an Error in services/AD-UserLoginService.js at adUserForgotPasswordSendOTPToEmail - passwordEncryption: OTP generation failed');
        callback({ httpCode: 400, statusCode: '9994', result: { otpMessage: 'OTP Sent failed' } });
      }
    });
  });
}
/**
* @param {string} mobileNumber string
* @param {string} otpNumber string
* @param {string} otpType string
* @param {string} recordID string
* @param {object} res object
* @param {function} callback is a callback function
*/
function adUserForgotPasswordSendOTPToMobile(mobileNumber, otpNumber, otpType, recordID, res, callback) {
  var currentUTC = CommonService.currentUTCObj();
  CommonService.saltGeneration(config.saltSize, function (salt) {
    CommonService.passwordEncryption(otpNumber, salt, function (pswObj) {
      if (pswObj && pswObj.passwordHash) {
        AD_UserLoginDAO.setADUserForgotPasswordOTP(recordID, pswObj, currentUTC, function (resObj) {
          if (resObj.statusCode == '0000') {
            CommonService.loginOTPTokenGeneration({ 'mobileNumber': mobileNumber, '_id': recordID }, otpType,res, function (token) {
              if (token) {
                callback({ httpCode: 200, statusCode: '1001', result: { 'otpNumber': otpNumber, 'otpMessage': 'OTP Sent Successfully' } });
              } else {
                logger.error('There was an Un-known Error in services/AD-UserLoginService.js at adUserForgotPasswordSendOTPToMobile - loginOTPTokenGeneration: Token generation failed');
                callback({ httpCode: 500, statusCode: '9999', result: { otpMessage: 'OTP Sent failed' } });
              }
            });
          } else {
            callback(resObj);
          }
        });
      } else {
        logger.error('There was an Error in services/AD-UserLoginService.js at adUserForgotPasswordSendOTPToMobile - passwordEncryption: OTP generation failed');
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
function adForgotPasswordVerifyOTPResponse(userId, tokenDecodedData, otpNumber, res, callback) {
  var currentUTC = CommonService.currentUTCObj();
  AD_UserLoginDAO.getADUserData(userId, function (adResData) {
    var adData = adResData.result;
    if (adResData.statusCode == '0000') {
      CommonService.passwordEncryption(otpNumber, adData.otpSalt, function (pswObj) {
        if (pswObj && pswObj.passwordHash && pswObj.passwordHash == adData.otp) {
          AD_UserLoginDAO.updateADForgotPasswordVerifyOTP(adData, currentUTC, function (updateRespObj) {
            if (updateRespObj.statusCode == '0000') {
              CommonService.loginOTPTokenGeneration({ 'email': tokenDecodedData.ise, 'mobileNumber': tokenDecodedData.iss, '_id': tokenDecodedData._id },
                'forget', res, function (token) {
                  if (token) {
                    callback({ httpCode: 200, statusCode: '1002', result: { 'otpMessage': 'Forgot Password OTP verified successfully' } });
                  } else {
                    logger.error('There was an Un-known Error in services/AD-UserLoginService.js at adForgotPasswordVerifyOTPResponse - loginOTPTokenGeneration: Token generation failed');
                    callback({ httpCode: 500, statusCode: '9999', result: {} });
                  }
                });
            } else {
              logger.error('There was an Error in services/AD-UserLoginService.js at adForgotPasswordVerifyOTPResponse - updateADForgotPasswordVerifyOTP: OTP verification failed');
              callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
            }
          });
        } else {
          logger.error('There was an Error in services/AD-UserLoginService.js at adForgotPasswordVerifyOTPResponse - passwordEncryption: OTP verification failed');
          callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
        }
      });
    } else {
      logger.error('There was an Error in services/AD-UserLoginService.js at adForgotPasswordVerifyOTPResponse - getADUserData: OTP verification failed');
      callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
    }
  });
}
