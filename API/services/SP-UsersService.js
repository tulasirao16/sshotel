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
var SP_UsersDAO = require('../daos/SP-UsersDAO');
var SP_Users = require('../models/SP-Users');

// --- Begin: SP-UsersService
module.exports = {

  // --- Begin getSPUsersListingData: Code to get Service Provider Users data
  getSPUsersListingData: function (pageNum, searchString, tokenDecodedData, callback) {
    SP_UsersDAO.getSPUsersListingData(pageNum, searchString, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  //--- End getSPUsersListingData: Code to get Service Provider Users data

  // --- Begin postSPUserData: Code to post Service Provider Users data
  postSPUserData: function(reqBody, tokenDecodedData, callback) {
    var stringArray = reqBody.firstName ? reqBody.firstName.split(' ') : '';
    var displayName = stringArray.length ? stringArray[0] : '';
    var spName = reqBody.firstName + reqBody.lastName;
    var spFullName = spName.replace(/\s/g,'');
    var currentUTC = CommonService.currentUTCObj();
    CommonService.saltGeneration(config.saltSize, function(saltValue) {
      CommonService.passwordEncryption(reqBody.password, saltValue, function(passwordObj) {
        var userAccount = moment().format('YY')+CommonService.orderSecureCodeGeneration(1, '012345678943210')+CommonService.orderSecureCodeGeneration(2, spFullName)+moment().format('MM')+CommonService.orderSecureCodeGeneration(3, '9876501234567894321');
        var userObj = {
          spServiceProviderId: tokenDecodedData.uspid,
          spServiceProvider: tokenDecodedData.usp,
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
        SP_UsersDAO.postSPUserData(userData, tokenDecodedData, function(resObj) {
          callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
      });
    });
  },
  //--- End postSPUserData: Code to post Service Provider Users data

  // --- Begin verifyUniqueness: Code to verify Service Provider Users data
  verifyUniqueness: function(reqBody, tokenDecodedData, callback) {
    SP_UsersDAO.verifyUniqueness(reqBody, tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  //--- End verifyUniqueness: Code to verify Service Provider Users data

  // --- Begin: updateSPUserData
  updateSPUserData: function(reqBody, decodedTokenData, callback) {
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
          SP_UsersDAO.updateSPUserData(reqBody, decodedTokenData, updateUserObj, function(resObj) {
            callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
          });
        });
      });
    } else {
      SP_UsersDAO.updateSPUserData(reqBody, decodedTokenData, updateUserObj, function(resObj) {
        callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
      });
    }
  },
  // --- End: updateSPUserData


  // --- Begin: activateSPUserData
  activateSPUserData: function(recordID, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateUserObj = {
      userStatus: 'Active',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
    SP_UsersDAO.activateSPUserData(recordID, updateUserObj, decodedTokenData, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: activateSPUserData

  // --- Begin: inActivateSPUserData
  inActivateSPUserData: function(recordID, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateUserObj = {
      userStatus: 'Inactive',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
    SP_UsersDAO.inActivateSPUserData(recordID, updateUserObj, decodedTokenData, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: inActivateSPUserData

  // --- Begin: deleteSPUserData
  deleteSPUserData: function(body, decodedTokenData, callback) {
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
    SP_UsersDAO.deleteSPUserData(body._id, updateUserObj, decodedTokenData, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },

  // --- End: deleteSPUserData
  getSPUserData: function(recordId, tokenDecodedData, callback) {
    SP_UsersDAO.getSPUserData(recordId, tokenDecodedData, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },

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
        SP_UsersDAO.updateSpPassword(decodedTokenData, updatePasswordObj, function(regData) {
          callback(regData);
        });
      });
    });
  },

};
// --- End: SP-UsersService
