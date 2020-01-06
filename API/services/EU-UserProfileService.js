/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var config = require('config');

var commonService = require('./CommonService');
var EU_UserProfileDAO = require('../daos/EU-UserProfileDAO');
var EU_UserLoginDAO = require('../daos/EU-UserLoginDAO');
var lookupsData = require('../config/lookupsData');
var moment = require('moment');


// --- Begin: EU-Users Profile Service
module.exports = {
  // --- Begin EU-Users ProfileUpdate:
  endUsersProfileUpdate: function (profileObj, fileLoc, orginalFileName, fileName, decodedTokenData, callback) {
    var currentUTC = commonService.currentUTCObj();
    var updateUserObj = setUserObj(profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC);
    EU_UserProfileDAO.endUsersProfileUpdate(updateUserObj, decodedTokenData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // --- End EU-Users ProfileUpdate:

  updateUserPreferenceData: function (reqObj, tokenDecodedData, callback) {
    var currentUTC = commonService.currentUTCObj();
    var userPreferenceObj = {
      preferences: {
        defaultLanguage: reqObj.defaultLanguage,
        defaultTimezone: reqObj.defaultTimezone,
        defaultCurrency: reqObj.defaultCurrency,
        dateFormat: reqObj.dateFormat,
        updatedBy: tokenDecodedData.ua,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      }
    };
    EU_UserProfileDAO.updateUserPreferenceData(tokenDecodedData, userPreferenceObj,
      function (error, resObj) {
        if (error) {
          logger.error('There was an Un-known Error in controllers/EU-Users ProfileService.js',
            ' at updateUserPreferenceData:', error);
          callback({ httpCode: 500, statusCode: resObj.statusCode, result: resObj.result });
        } else if (resObj.statusCode === '0000') {
          callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
        } else {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
        }
      });
  },
  // --- End EU-Users ProfilePreferences:
  updateUserName: function (reqObj, tokenDecodedData, res, callback) {
    var currentUTC = commonService.currentUTCObj();
    var userNameObj = {
        firstName: reqObj.firstName,
        lastName: reqObj.lastName,
        name: reqObj.firstName + ' ' + reqObj.lastName,
        mobileNumber: reqObj.mobileNumber,
        updatedBy: tokenDecodedData.ua,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
    }
    EU_UserProfileDAO.userNameObj(tokenDecodedData, userNameObj, res, function (resObj) {
      callback(resObj);
    });
  },

  updateUserProfilePassword: function (profilePasswordObj, tokenDecodedData, callback) {
    var currentPassword = profilePasswordObj.currentPassword;
    var newPassword = profilePasswordObj.newPassword;
    EU_UserLoginDAO.userLogin(tokenDecodedData.umn, tokenDecodedData.ue, function (resObj) {
      if (resObj.statusCode == '1000') {
        var userObj = resObj.result;
        if (userObj.userStatus == lookupsData.userStatuses.active
          && userObj.password && userObj.passwordSalt) {
          commonService.passwordEncryption(currentPassword, userObj.passwordSalt, function (passwordObj) {
            if (passwordObj && passwordObj.passwordHash
              && passwordObj.passwordHash == userObj.password) {
              var currentUTC = commonService.currentUTCObj();
              commonService.saltGeneration(config.saltSize, function (salt) {
                commonService.passwordEncryption(newPassword, salt, function (pswObj) {
                  if (pswObj && pswObj.passwordHash) {
                    var updateUserPasswordObj = {
                      password: pswObj.passwordHash,
                      passwordSalt: pswObj.salt,
                      updatedAt: currentUTC.currentUTCDateTimeNumber,
                      updatedOn: currentUTC.currentUTCDateTimeString,
                      updatedBy: tokenDecodedData.ua
                    };
                    EU_UserProfileDAO.updateUserProfilePassword(updateUserPasswordObj, tokenDecodedData, function (pswUpdateResObj) {
                      callback(pswUpdateResObj);
                    });
                  } else {
                    callback({ httpCode: 400, statusCode: '', result: {} }); // New Status Code
                  }
                });
              });
            } else {
              callback({ httpCode: 400, statusCode: '9979', result: {} }); // New Status Code
            }
          });
        } else if (userObj.userStatus == lookupsData.userStatuses.inactive) {
          callback({ httpCode: 400, statusCode: '9951', result: {} });
          // } else if(userObj.userStatus == lookupsData.userStatuses.blocked) {
          //   callback({httpCode: 400, statusCode: '9952', result: {}});
        } else {
          callback({ httpCode: 400, statusCode: '9979', result: {} }); // New Status Code
        }
      } else {
        callback(resObj);
      }
    });
  }
};


/**
 * @param {string} profileObj object
 * @param {string} fileLoc string
 * @param {string} fileName string
 * @param {string} orginalFileName string
 * @param {object} decodedTokenData object
 * @param {object} currentUTC object
 * @return {object} object
 */
function setUserObj(profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC) {
  var userObj;
  if (fileLoc) {
    userObj = {
      email: profileObj.profileemail,
      mobileNumber: profileObj.profilemobileNumber,
      firstName: profileObj.profilefirstName,
      lastName: profileObj.profilelastName,
      displayName: profileObj.profiledisplayName,
      name: profileObj.profilefirstName + (profileObj.profilelastName ? (' ' + profileObj.profilelastName) : ''),
      dob: profileObj.profiledob ? profileObj.profiledob : '',
      dobNumber: profileObj.profiledob ? moment(profileObj.profiledob, 'YYYY-MM-DD').valueOf() : 0,
      area: profileObj.profilearea ? profileObj.profilearea : '',
      city: profileObj.profilecity ? profileObj.profilecity : '',
      state: profileObj.profilestate ? profileObj.profilestate : '',
      country: profileObj.profilecountry ? profileObj.profilecountry : '',
      zip: profileObj.profilezip ? profileObj.profilezip : '',
      userAccount: profileObj.profileuserAccount ? profileObj.profileuserAccount : '',
      address: profileObj.profileaddress,
      userIcon: fileName,
      userIconOriginalName: orginalFileName,
      userIconPath: fileLoc,
      updatedBy: decodedTokenData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
  } else {
    userObj = {
      mobileNumber: profileObj.profilemobileNumber,
      email: profileObj.profileemail,
      firstName: profileObj.profilefirstName,
      lastName: profileObj.profilelastName,
      displayName: profileObj.profiledisplayName,
      name: profileObj.profilefirstName + (profileObj.profilelastName ? (' ' + profileObj.profilelastName) : ''),
      dob: profileObj.profiledob ? profileObj.profiledob : '',
      dobNumber: profileObj.profiledob ? moment(profileObj.profiledob, 'YYYY-MM-DD').valueOf() : 0,
      area: profileObj.profilearea ? profileObj.profilearea : '',
      city: profileObj.profilecity ? profileObj.profilecity : '',
      state: profileObj.profilestate ? profileObj.profilestate : '',
      country: profileObj.profilecountry ? profileObj.profilecountry : '',
      zip: profileObj.profilezip ? profileObj.profilezip : '',
      userAccount: profileObj.profileuserAccount ? profileObj.profileuserAccount : '',
      address: profileObj.profileaddress,
      updatedBy: decodedTokenData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
  }
  return userObj;
}
// // --- End: EU-Users Profile Service
