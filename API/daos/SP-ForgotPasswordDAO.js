/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var SP_Users = require('../models/SP-Users');
var SP_ServiceProviders = require('../models/SP-ServiceProviders');


module.exports = {
  getSPUserData: function (userId, callback) {
    SP_Users.findOne({ 
      $or: [{ email: userId }, { mobileNumber: userId }],
      userStatus: 'Active',
      isDeleted: false   
    }).exec(function (error, data) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP-ForgotPasswordDAO.js, at getSPUserData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (data && data._id) {
        callback({ httpCode: 200, statusCode: '0000', result: data });
      } else {
        callback({ httpCode: 400, statusCode: '9986', result: {} });
      }
    });
  },
  setSPUserForgotPasswordOTP: function (recordID, otpObj, currentUTC, callback) {
    var updateObj = {
      'otp': otpObj.passwordHash,
      'otpSalt': otpObj.salt,
      'updatedBy': 'superadmin',
      'updatedAt': currentUTC.currentUTCDateTimeNumber,
      'updatedOn': currentUTC.currentUTCDateTimeString
    };
    var query = {
      '_id': recordID,
      'userStatus': 'Active',
      'isDeleted': false
    };
    SP_Users.findOneAndUpdate(query, { $set: updateObj }, {new: true}, function (error, resData) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP-ForgotPasswordDAO.js, at setSPUserForgotPasswordOTP:', error);
        callback({ httpCode: 500, statusCode: '9999', result: { otpMessage: 'OTP Sent failed' } });
      } else if (resData && resData._id) {
        AuditingInfoDAO.spAuditing({iss: resData._id, ua: resData.userAccount, un: resData.name}, 'Update', {name: config.collectionSPUsers, id: resData._id, value: resData.userAccount}, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resData });
      } else {
        logger.error('There was an Error occured in daos/SP-ForgotPasswordDAO.js, at setSPUserForgotPasswordOTP: Update failed');
        callback({ httpCode: 400, statusCode: '9953', result: { otpMessage: 'OTP Sent failed' } });
      }
    });

  },

  // Bgin -- SP Forgot Password update otp and otp salt
  updateSPForgotPasswordOTP: function (regSPData, currentUTC, callback) {
    var updateSPObj = {
      otp: '',
      otpSalt: '',
      updatedBy: regSPData.name,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString,
      status: 'Active'
    };
    SP_Users.findOneAndUpdate({ _id: regSPData._id }, { $set: updateSPObj }, {new: true}, function (error, spresObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP-ForgotPasswordDAO.js, at updateEUForgotPasswordOTP:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (spresObj && spresObj._id) {
        AuditingInfoDAO.spAuditing({iss: spresObj._id, ua: spresObj.userAccount, un: spresObj.name}, 'Update', {name: config.collectionSPUsers, id: spresObj._id, value: spresObj.userAccount}, updateSPObj);
        callback({ httpCode: 200, statusCode: '0000', result: {} });
      } else {
        logger.error('There was an Un-known Error occured in daos/SP-ForgotPasswordDAO.js, at updateSPForgotPasswordOTP:');
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // Begin -- SP Reset Password
  updateSpPassword: function (tokenDecodedData, updateSPPasswordObj, callback) {
    var query = { _id: tokenDecodedData._id, isDeleted: false };
    SP_Users.findOneAndUpdate(query, { $set: updateSPPasswordObj }, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-Known Error occured in daos/SP-ForgotPasswordDAO.js.js,'+
          ' at updateSpPassword:', err);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing({iss: resObj._id, ua: resObj.userAccount, un: resObj.name}, 'Update', {name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount}, updateSPPasswordObj);
        callback({ httpCode: 200, statusCode: '1012', result: {} });
      } else {
        callback({ httpCode: 400, statusCode: '9985', result: {} });
      }
    });
  }
}
