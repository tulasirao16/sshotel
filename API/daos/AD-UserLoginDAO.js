/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var EU_Users = require('../models/EU-Users');
var AD_Users = require('../models/AD-Users');
var AD_UsersLogs = require('../models/AD-UsersLogs');
var EU_UsersVerifications = require('../models/EU-UsersVerifications');
var AuditingInfoDAO = require('../daos/AuditingInfoDAO');

// --- Begin: AD-UserLoginDAO
module.exports = {
  // --- Begin adminUserLogin: Code to handle User Login credentials
  adminUserLogin: function (userID, callback) {
    AD_Users.findOne({
      $or: [{ userAccount: userID }, { email: userID }, { mobileNumber: userID }],
      isDeleted: false
    }).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-UserLoginDAO.js,',
          ' at adminUserLogin of User query:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '1000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9950', result: {} });
      }
    });
  },

  // --- Begin postADUserLogsData:
  postADUserLogsData: function (userLogObj, callback) {
    userLogObj.save(function (error, resObj) {
      AuditingInfoDAO.adAuditing({ iss: resObj.adUserId, ua: resObj.createdBy, un: resObj.adName }, 'Create', { name: config.collectionADUsersLogs, id: resObj._id, value: resObj.macAddress }, resObj);
    });
  },
  // --- End postADUserLogsData

  // --- Begin: getADUserData
  getADUserData: function (userId, callback) {
    AD_Users.findOne({
      $or: [{ email: userId }, { mobileNumber: userId }],
      userStatus: 'Active',
      isDeleted: false
    }).exec(function (error, data) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-UserLoginDAO.js, at getADUserData:' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (data && data._id) {
        callback({ httpCode: 200, statusCode: '0000', result: data });
      } else {
        callback({ httpCode: 400, statusCode: '9986', result: {} });
      }
    });
  },
  // --- End: getADUserData

  // Begin: setADUserForgotPasswordOTP
  setADUserForgotPasswordOTP: function (recordID, otpObj, currentUTC, callback) {
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
    AD_Users.findOneAndUpdate(query, { $set: updateObj }, { new: true }, function (error, resData) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-UserLoginDAO.js, at setADUserForgotPasswordOTP:' + error);
        callback({ httpCode: 500, statusCode: '9999', result: { otpMessage: 'OTP Sent failed' } });
      } else if (resData && resData._id) {
        AuditingInfoDAO.adAuditing({ iss: resData._id, ua: resData.userAccount, un: resData.name }, 'Update', { name: config.collectionADUsers, id: resData._id, value: resData.userAccount }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resData });
      } else {
        logger.error('There was an Error occured in daos/AD-UserLoginDAO.js, at setADUserForgotPasswordOTP: Update failed');
        callback({ httpCode: 400, statusCode: '9953', result: { otpMessage: 'OTP Sent failed' } });
      }
    });
  },
  // End: setADUserForgotPasswordOTP

  //  Begin --  updateADForgotPasswordVerifyOTP
  updateADForgotPasswordVerifyOTP: function (adminData, currentUTC, callback) {
    var updateADObj = {
      otp: '',
      otpSalt: '',
      updatedBy: adminData.userAccount,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString,
      status: 'Active'
    };
    AD_Users.findOneAndUpdate({ _id: adminData._id }, { $set: updateADObj }, { new: true }, function (error, adresObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-UserLoginDAO.js, at updateADForgotPasswordVerifyOTP:' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (adresObj && adresObj._id) {
        AuditingInfoDAO.adAuditing({ iss: adresObj._id, ua: adresObj.userAccount, un: adresObj.name }, 'Update', { name: config.collectionADUsers, id: adresObj._id, value: adresObj.userAccount }, updateADObj);
        callback({ httpCode: 200, statusCode: '0000', result: {} });
      } else {
        logger.error('There was an Un-known Error occured in daos/AD-UserLoginDAO.js, at updateADForgotPasswordVerifyOTP:');
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // End --  updateADForgotPasswordVerifyOTP

  // Begin -- updateADPassword
  updateADPassword: function (tokenDecodedData, updateADPasswordObj, callback) {
    var query = { _id: tokenDecodedData._id, isDeleted: false };
    AD_Users.findOneAndUpdate(query, { $set: updateADPasswordObj }, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-Known Error occured in daos/AD-UserLoginDAO.js,'+
          'at updateADPassword:'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing({ iss: resObj._id, ua: resObj.userAccount, un: resObj.name }, 'Update', { name: config.collectionADUsers, id: resObj._id, value: resObj.userAccount }, updateADPasswordObj);
        callback({ httpCode: 200, statusCode: '1012', result: {} });
      } else {
        callback({ httpCode: 400, statusCode: '9985', result: {} });
      }
    });
  }
  // End -- updateADPassword
}
// --- End: AD-UserLoginDAO
