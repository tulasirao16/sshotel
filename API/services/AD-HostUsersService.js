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
var AD_HostUsersDAO = require('../daos/AD-HostUsersDAO');
var SP_Users = require('../models/SP-Users');

// --- Begin: AD-HostUsersService
module.exports = {
  // --- Begin getADHostUsersListingData: Code to get Service Provider Users data
  getADHostUsersListingData: function (hostId, pageNum ,searchString, tokenDecodedData,  callback) {
    AD_HostUsersDAO.getADHostUsersListingData(hostId, pageNum, searchString, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  //--- End getADUsersListingData: Code to get Service Provider Users data

  // --- Begin  updateADHostUsersChangePassword:
  updateADHostUsersChangePassword: function (userID , newPassword, tokenDecodedData, callback) {
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(newPassword, salt, function(pswObj) { 
      var currentUTC = CommonService.currentUTCObj();
            var updateUserPasswordObj = {
              password: pswObj.passwordHash,
              passwordSalt: pswObj.salt,
              updatedAt: currentUTC.currentUTCDateTimeNumber,
              updatedOn: currentUTC.currentUTCDateTimeString,
              updatedBy: 'superadmin'
            };
            AD_HostUsersDAO.updateADHostUsersChangePassword( userID , updateUserPasswordObj, tokenDecodedData, function(resObj) {
              callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
            });
        });
      })
  },
  // --- End updateADHostUsersChangePassword:

  // --- Begin: updateADHostUserData
  updateADHostUserData: function(reqBody, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var stringArray = reqBody.firstName ? reqBody.firstName.split(' ') : '';
    var displayName = stringArray.length ? stringArray[0] : '';
    var updateUserObj = {
      displayName: displayName,
      firstName: reqBody.firstName,
      lastName: reqBody.lastName ? reqBody.lastName : '',
      displayName: reqBody.displayName,
      name: reqBody.firstName + (reqBody.lastName ?  (' ' + reqBody.lastName) : ''),
      gender: reqBody.gender ? reqBody.gender : '',
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
    if(reqBody.password && reqBody.password != '') {
      CommonService.saltGeneration(config.saltSize, function(saltValue) {
        CommonService.passwordEncryption(reqBody.password, saltValue, function(passwordObj) {
          updateUserObj.password = passwordObj.passwordHash;
          updateUserObj.passwordSalt = passwordObj.salt;
          AD_HostUsersDAO.updateADHostUserData(reqBody, decodedTokenData, updateUserObj, function(resObj) {
            callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
          });
        });
      });
    } else {
      AD_HostUsersDAO.updateADHostUserData(reqBody, decodedTokenData, updateUserObj, function(resObj) {
        callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
      });
    }
  },
  // --- End: updateADHostUserData

  // --- Begin postADHostUserData: Code to post Service Provider Users data
  postADHostUserData: function(reqBody, tokenDecodedData, callback) {
    var stringArray = reqBody.firstName ? reqBody.firstName.split(' ') : '';
    var displayName = stringArray.length ? stringArray[0] : '';
    var spName = reqBody.firstName + reqBody.lastName;
    var spFullName = spName.replace(/\s/g,'');
    var currentUTC = CommonService.currentUTCObj();
    CommonService.saltGeneration(config.saltSize, function(saltValue) {
      CommonService.passwordEncryption(reqBody.password, saltValue, function(passwordObj) {
        var userAccount = moment().format('YY')+CommonService.orderSecureCodeGeneration(1, '012345678943210')+CommonService.orderSecureCodeGeneration(2, spFullName)+moment().format('MM')+CommonService.orderSecureCodeGeneration(3, '9876501234567894321');
        var userObj = {
          spServiceProviderId: reqBody.spServiceProviderId,
          spServiceProvider: reqBody.spServiceProvider,
          displayName: displayName,
          firstName: reqBody.firstName,
          lastName: reqBody.lastName ? reqBody.lastName : '',
          name: reqBody.firstName + (reqBody.lastName ?  (' ' + reqBody.lastName): ''),
          dob: reqBody.dob ? reqBody.dob : '',
          dobNumber: reqBody.dobNumber ? reqBody.dobNumber : 0,
          area: reqBody.area ? reqBody.area : '',
          city: reqBody.city ? reqBody.city : '',
          state:reqBody.state ? reqBody.state : '',
          zip: reqBody.pinCode ? reqBody.pinCode : '',
          country: reqBody.country ? reqBody.country : '',
          landMark: reqBody.landMark ? reqBody.landMark : '',
          address: reqBody.address,
          gender: reqBody.gender ? reqBody.gender : '',
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
        var userData = new SP_Users(userObj);
        AD_HostUsersDAO.postADHostUserData(userData, tokenDecodedData, function(resObj) {
          callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
      });
    });
  },
  //--- End postADHostUserData: Code to post Service Provider Users data

  // --- Begin: updateADHostUserStatus
  updateADHostUserStatus: function (recordId, reqBody, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var upObj = {
      userStatus: reqBody.status,
      updatedBy: tokenDecodedData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_HostUsersDAO.updateADHostUserStatus(upObj, recordId, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // --- End: updateADHostUserStatus

  // --- Begin: deleteADHostUserData
  deleteADHostUserData: function(body, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateUserObj = {
      mobileNumber: body.mobileNumber + '-' + currentUTC.currentUTCDateTimeNumber,
      email: body.email + '-' + currentUTC.currentUTCDateTimeNumber,
      userAccount: body.userAccount + '-' + currentUTC.currentUTCDateTimeNumber,
      isDeleted: true,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
    AD_HostUsersDAO.deleteADHostUserData(body._id, updateUserObj, decodedTokenData, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: deleteADHostUserData

  // BEGIN : getHostUserNotifications
  getHostUserNotifications: function (hostId, pageNumber,userId, searchString, tokenDecodedData, callback) {
    AD_HostUsersDAO.getHostUserNotifications(hostId, pageNumber,userId, searchString, tokenDecodedData, function (resObj) {
      callback(resObj);
    });
  },
  // END : getHostUserNotifications

  // --- Begin postSPUserData: Code to post Service Provider Users data
  postADSPUserData: function (reqBody, tokenDecodedData, res, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var userAccount = moment().format('YY') + CommonService.orderSecureCodeGeneration(1, '012345678943210') + CommonService.orderSecureCodeGeneration(2, reqBody.name) + moment().format('MM') + CommonService.orderSecureCodeGeneration(3, '9876501234567894321');
    var adSpUserObj = {
      spServiceProviderId: reqBody.spServiceProviderId,
      spServiceProvider: reqBody.spServiceProvider,
      displayName: reqBody.firstName,
      firstName: reqBody.firstName,
      lastName: reqBody.lastName ? reqBody.lastName : '',
      name: reqBody.name,
      dob: reqBody.dob ? reqBody.dob : '',
      dobNumber: reqBody.dobNumber ? reqBody.dobNumber : 0,
      area: reqBody.area ? reqBody.area : '',
      city: reqBody.city ? reqBody.city : '',
      state: reqBody.state ? reqBody.state : '',
      zip: reqBody.pinCode ? reqBody.pinCode : '',
      country: reqBody.country ? reqBody.country : '',
      landMark: reqBody.landMark ? reqBody.landMark : '',
      address: reqBody.address,
      gender: reqBody.gender ? reqBody.gender : '',
      deviceNotifyToken: reqBody.deviceNotifyToken ? reqBody.deviceNotifyToken : '',
      userAccount: userAccount,
      mobileNumber: reqBody.mobileNumber,
      alternateContactNumber: reqBody.alternateContactNumber ? reqBody.alternateContactNumber : '',
      mbnVerifyStatus: 'Verified',
      email: reqBody.email,
      alternateEmail: reqBody.alternateEmail ? reqBody.alternateEmail : '',
      emailVerifyStatus: 'Verified',
      userType: 'Owner',
      userRole: 'Admin',
      userStatus: 'Active',
      isDeleted: false,
      createdAt: currentUTC.currentUTCDateTimeNumber,
      createdBy: 'superadmin',
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: 'superadmin',
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    var adSpUserData = new SP_Users(adSpUserObj);
    AD_HostUsersDAO.postADSPUserData(adSpUserData, tokenDecodedData, res, reqBody, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  //--- End postSPUserData: Code to post Service Provider Users data

}
// --- End: AD-HostUsersService
