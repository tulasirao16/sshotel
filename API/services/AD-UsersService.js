/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var moment = require('moment');
var randomNumber = require('random-number');

var CommonService = require('./CommonService');
var AD_UsersDAO = require('../daos/AD-UsersDAO');
var AD_Users = require('../models/AD-Users');

// --- Begin: AD-UsersService
module.exports = {

  // --- Begin postADUserData: Code to post Admin Users data
  postADUserData: function (reqBody, tokenDecodedData, callback) {
    var stringArray = reqBody.firstName ? reqBody.firstName.split(' ') : '';
    var displayName = stringArray.length ? stringArray[0] : '';
    var name = reqBody.firstName + reqBody.lastName;
    var adFullName = name.replace(/\s/g, '');
    var currentUTC = CommonService.currentUTCObj();
    CommonService.saltGeneration(config.saltSize, function (saltValue) {
      CommonService.passwordEncryption(reqBody.password, saltValue, function (passwordObj) {
        var userAccount = moment().format('YY') + CommonService.orderSecureCodeGeneration(1, '012345678943210') + CommonService.orderSecureCodeGeneration(2, name) + moment().format('MM') + CommonService.orderSecureCodeGeneration(3, '9876501234567894321');
        var userObj = {
          adServiceProviderId: tokenDecodedData.uspid,
          adServiceProvider: tokenDecodedData.usp,
          displayName: displayName,
          firstName: reqBody.firstName,
          lastName: reqBody.lastName ? reqBody.lastName : '',
          name: reqBody.firstName + (reqBody.lastName ? (' ' + reqBody.lastName) : ''),
          dob: reqBody.dob ? reqBody.dob : '',
          dobNumber: reqBody.dobNumber ? reqBody.dobNumber : 0,
          area: reqBody.area ? reqBody.area : '',
          city: reqBody.city ? reqBody.city : '',
          state: reqBody.state ? reqBody.state : '',
          zip: reqBody.pinCode ? reqBody.pinCode : '',
          country: reqBody.country ? reqBody.country : '',
          landMark: reqBody.landMark ? reqBody.landMark : '',
          address: reqBody.address,
          deviceNotifyToken: reqBody.deviceNotifyToken ? reqBody.deviceNotifyToken : '',
          userAccount: userAccount,
          mobileNumber: reqBody.mobileNumber,
          alternateContactNumber: reqBody.alternateContactNumber ? reqBody.alternateContactNumber : '',
          mbnVerifyStatus: 'Open',
          email: reqBody.email,
          alternateEmail: reqBody.alternateEmail ? reqBody.alternateEmail : '',
          emailVerifyStatus: 'Open',
          password: passwordObj.passwordHash,
          passwordSalt: passwordObj.salt,
          userType: 'Employee',
          userRole: reqBody.userRole,
          userStatus: reqBody.userStatus,
          isDeleted: false,
          createdAt: currentUTC.currentUTCDateTimeNumber,
          createdBy: 'superadmin',
          createdOn: currentUTC.currentUTCDateTimeString,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedBy: 'superadmin',
          updatedOn: currentUTC.currentUTCDateTimeString
        };
        var userData = new AD_Users(userObj);
        AD_UsersDAO.postADUserData(userData, tokenDecodedData, function (resObj) {
          callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
      });
    });
  },
  //--- End postADUserData: Code to post Admin Users data

  // --- Begin getADUsersListingData: Code to get Admin Users data
  getADUsersListingData: function (pageNum, searchString, tokenDecodedData, callback) {
    AD_UsersDAO.getADUsersListingData(pageNum, searchString, tokenDecodedData, function (resObj) {
      callback(resObj);
    });
  },
  // --- End getADUsersListingData: Code to get Admin Users data


  // --- Begin getADUsersListDataForTickets: Code to get Admin Users data
  getADUsersListDataForTickets: function (tokenDecodedData, callback) {
    AD_UsersDAO.getADUsersListDataForTickets(tokenDecodedData, function (resObj) {
      callback(resObj);
    });
  },
  // --- End getADUsersListDataForTickets: Code to get Admin Users data

  //......Begin: getADUserDataByRecordId Get User Data by ID
  getADUserDataByRecordId: function (recordId, tokenDecodedData, callback) {
    AD_UsersDAO.getADUserDataByRecordId(recordId, tokenDecodedData, function (resObj) {
      callback(resObj);
    });
  },
  //.....End: getADUserDataByRecordId Get User data by ID

  // --- Begin  updateADUsers Password:
  updateADUsersPassword: function (userID, newPassword, tokenDecodedData, callback) {
    CommonService.saltGeneration(config.saltSize, function (salt) {
      CommonService.passwordEncryption(newPassword, salt, function (pswObj) {
        var currentUTC = CommonService.currentUTCObj();
        var updateUserPasswordObj = {
          password: pswObj.passwordHash,
          passwordSalt: pswObj.salt,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedOn: currentUTC.currentUTCDateTimeString,
          updatedBy: 'superadmin'
        };
        AD_UsersDAO.updateADUsersPassword(userID, updateUserPasswordObj, tokenDecodedData, function (resObj) {
          callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
      });
    })
  },
  // --- End updateADUsers Password:

  // --- Begin: updateADUserData
  updateADUserData: function(reqBody, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var stringArray = reqBody.firstName ? reqBody.firstName.split(' ') : '';
    var displayName = stringArray.length ? stringArray[0] : '';
    var updateUserObj = {
      displayName: displayName,
      firstName: reqBody.firstName,
      lastName: reqBody.lastName ? reqBody.lastName : '',
      displayName: reqBody.displayName,
      name: reqBody.firstName + (reqBody.lastName ?  (' ' + reqBody.lastName) : ''),
      dob: reqBody.dob ? reqBody.dob : '',
      dobNumber: reqBody.dobNumber ? reqBody.dobNumber : 0,
      area: reqBody.area ? reqBody.area : '',
      city: reqBody.city ? reqBody.city : '',
      state:reqBody.state ? reqBody.state : '',
      zip: reqBody.pinCode ? reqBody.pinCode : '',
      country: reqBody.country ? reqBody.country : '',
      landMark: reqBody.landMark ? reqBody.landMark : '',
      address: reqBody.address,
      deviceNotifyToken: reqBody.deviceNotifyToken ? reqBody.deviceNotifyToken : '',
      // userAccount: reqBody.userID,
      mobileNumber: reqBody.mobileNumber,
      alternateContactNumber: reqBody.alternateContactNumber ? reqBody.alternateContactNumber : '',
      email: reqBody.email,
      alternateEmail: reqBody.alternateEmail ? reqBody.alternateEmail : '',
      userRole: reqBody.userRole,
      userStatus: reqBody.userStatus,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
      AD_UsersDAO.updateADUserData(reqBody, decodedTokenData, updateUserObj, function(resObj) {
        callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
      });
    },
  // },
  // --- End: updateADUserData

  // --- Begin: activateADUserData
  activateADUserData: function(recordID, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateUserObj = {
      userStatus: 'Active',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
    AD_UsersDAO.activateADUserData(recordID, updateUserObj, decodedTokenData, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: activateADUserData

  // --- Begin: inActivateADUserData
  inActivateADUserData: function(recordID, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateUserObj = {
      userStatus: 'Inactive',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
    AD_UsersDAO.inActivateADUserData(recordID, updateUserObj, decodedTokenData, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: inActivateADUserData
}
// --- End: AD-UsersService
