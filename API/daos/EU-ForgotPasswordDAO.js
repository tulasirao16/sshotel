/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var Users = require('../models/EU-Users');

module.exports = {
  euForgetPasswordSendOTP: function (email, userStatus, callback) {
    let checkmobileNumberorEmail = email.includes('@');
    Users.find(checkmobileNumberorEmail ? { email: email, userStatus: userStatus, isDeleted: false } : { mobileNumber: email, userStatus: userStatus, isDeleted: false }).exec(function (error, regData) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/EU-ForgotPasswordDAO.js, at euForgetPasswordSendOTP:', error);
        callback(null);
      } else if (regData && regData.length > 0) {
        callback(regData[0]);
      } else {
        callback(null);
      }
    });
  },

  setUsersLoginOTP: function (email, otpObj, currentUTC, callback) {
    let checkmobileNumberorEmail = email.includes('@');
    var ServiceProvider = 'Service Provider';
    var updateObj = {
      'otp': otpObj.passwordHash,
      'otpSalt': otpObj.salt,
      'updatedBy': 'superadmin',
      'updatedAt': currentUTC.currentUTCDateTimeNumber,
      'updatedOn': currentUTC.currentUTCDateTimeString
    };
    if (checkmobileNumberorEmail === true) {
      Users.findOneAndUpdate({ 'email': email }, { $set: updateObj }, function (error, resData) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/EU-ForgotPasswordDAO.js, at setUsersLoginOTP:', error);
          callback(error, { statusCode: '9999', result: {} });
        } else if (resData && resData.email) {
          AuditingInfoDAO.euAuditing({ iss: 'SAID01', un: 'Super Admin', ua: 'superadmin' }, 'Update', { name: config.collectionEndUserUsers, id: email, value: 'Forgot Password' }, updateObj);
          callback(error, { statusCode: '1254', result: resData });
        } else {
          logger.error('There was an Error occured in daos/EU-ForgotPasswordDAO.js, at setUsersLoginOTP: Update failed');
          callback(error, { statusCode: '9753', result: resData });
        }
      });
    } else {
      Users.findOneAndUpdate({ 'mobileNumber': email }, { $set: updateObj }, function (error, resData) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/EU-ForgotPasswordDAO.js, at setUsersLoginOTP:', error);
          callback(error, { statusCode: '9999', result: {} });
        } else if (resData && resData.mobileNumber) {
          AuditingInfoDAO.euAuditing({ iss: 'SAID01', un: 'Super Admin', ua: 'superadmin' }, 'Update', { name: config.collectionEndUserUsers, id: email, value: 'Forgot Password' }, updateObj);
          callback(error, { statusCode: '1254', result: resData });
        } else {
          logger.error('There was an Error occured in daos/EU-ForgotPasswordDAO.js, at setUsersLoginOTP: Update failed');
          callback(error, { statusCode: '9753', result: resData });
        }
      });
    }

  },
  //  Begin -- Eu Forgot Password Email verify
  euforgotPasswordEmailVerify: function (email, callback) {
    let checkmobileNumberorEmail = email.includes('@');
    Users.findOne(checkmobileNumberorEmail === true ? { email: email, isDeleted: false } : { mobileNumber: email, isDeleted: false }).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/EU-ForgotPasswordDAO.js,',
          ' at euforgotPasswordEmailVerify query:', error);
        callback(error, { httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj) {
        callback(error, { httpCode: 200, statusCode: '1255', result: resObj });
      } else {
        callback(error, { httpCode: 400, statusCode: '9950', result: {} });
      }
    });
  },
  // Bgin -- EU Forgot Password update otp and otp salt
  updateEUForgotPasswordOTP: function (regEuUserData, currentUTC, callback) {
    var Id = regEuUserData._id;
    var updateEUObj = {
      status: 'Active',
      updatedBy: regEuUserData.name,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    Users.findOneAndUpdate({ _id: regEuUserData._id }, { $set: updateEUObj }, function (error, euresObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/EU-ForgotPasswordDAO.js, at updateEUForgotPasswordOTP:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (euresObj && euresObj._id) {
        Users.findOneAndUpdate({ _id: regEuUserData._id }, { $set: updateEUObj }, function (error1, euuresObj) {
          if (error1) {
            logger.error('There was an Un-known Error occured in daos/EU-ForgotPasswordDAO.js, at updateEUForgotPasswordOTP:', error1);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if (euuresObj && euuresObj._id) {
            var updateObjOne = {
              otp: '',
              otpSalt: '',
              updatedBy: regEuUserData.name,
              updatedAt: currentUTC.currentUTCDateTimeNumber,
              updatedOn: currentUTC.currentUTCDateTimeString,
              userStatus: 'Active'
            };
            Users.findOneAndUpdate({ _id: euuresObj._id }, { $set: updateObjOne }, { new: true }, function (error2, userresObj) {
              if (error2) {
                logger.error('There was an Un-known Error occured in daos/EU-ForgotPasswordDAO.js, at updateEUForgotPasswordOTP:', error1);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
              } else if (userresObj && userresObj._id) {
                AuditingInfoDAO.euAuditing({ iss: euuresObj._id, un: userresObj.name, ua: userresObj.userAccount }, 'Update', { name: config.collectionEndUserUsers, id: euuresObj._id, value: userresObj.userAccount }, updateObjOne);
                callback({ httpCode: 200, statusCode: '0000', result: {} });
              } else {
                logger.error('There was an Un-known Error occured in daos/EU-ForgotPasswordDAO.js, at updateEUForgotPasswordOTP:');
                callback({ httpCode: 400, statusCode: '9992', result: {} });
              }
            });
          } else {
            logger.error('There was an Un-known Error occured in daos/EU-ForgotPasswordDAO.js, at updateEUForgotPasswordOTP:');
            callback({ httpCode: 400, statusCode: '9992', result: {} });
          }
        });
      } else {
        logger.error('There was an Un-known Error occured in daos/EU-ForgotPasswordDAO.js, at updateEUForgotPasswordOTP:');
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // Begin -- EU Reset Password
  updateEuPassword: function (tokenDecodedData, updateUserPasswordObj, callback) {
    var query = tokenDecodedData.ise ? { email: tokenDecodedData.ise, isDeleted: false } : { mobileNumber: tokenDecodedData.iss, isDeleted: false };
    Users.findOneAndUpdate(query, { $set: updateUserPasswordObj }, { new: true }, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-Known Error occured in daos/EU-ForgotPasswordDAO.js.js, at updateEuPassword:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.euAuditing({ iss: resObj._id, un: resObj.name, ua: resObj.userAccount }, 'Update', { name: config.collectionEndUserUsers, id: resObj._id, value: resObj.userAccount }, updateUserPasswordObj);
        callback({ httpCode: 200, statusCode: '1256', result: {} });
      } else {
        callback({ httpCode: 400, statusCode: '9755', result: {} });
      }
    });
  },
}