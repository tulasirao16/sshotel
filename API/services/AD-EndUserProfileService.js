/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var config = require('config');
var commonService = require('./CommonService');
var AD_EndUserProfileDAO = require('../daos/AD-EndUserProfileDAO');
var EU_UserLoginDAO = require('../daos/EU-UserLoginDAO');
var lookupsData = require('../config/lookupsData');
var moment = require('moment');


// --- Begin: AD-End Users Profile Service
module.exports = {
  // --- Begin ADEndUsersProfileUpdate:
  ADEndUsersProfileUpdate: function (profileObj,recordID, fileLoc, orginalFileName, fileName, decodedTokenData, callback) {
    var currentUTC = commonService.currentUTCObj();
    var updateUserObj = setUserObj(profileObj,recordID, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC);
    AD_EndUserProfileDAO.ADEndUsersProfileUpdate(updateUserObj, recordID, decodedTokenData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // --- End ADEndUsersProfileUpdate:

 // --- Begin  updateADEndUsersChangePassword:
  updateADEndUsersChangePassword: function (userID , newPassword, tokenDecodedData, callback) {
    commonService.saltGeneration(config.saltSize, function(salt) {
      commonService.passwordEncryption(newPassword, salt, function(pswObj) { 
        var currentUTC = commonService.currentUTCObj();
          var updateUserPasswordObj = {
            password: pswObj.passwordHash,
            passwordSalt: pswObj.salt,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString,
            updatedBy: 'superadmin'
          };
        AD_EndUserProfileDAO.updateADEndUsersChangePassword( userID , updateUserPasswordObj, tokenDecodedData, function(resObj) {
          callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
      });
    })
  },
  // --- End updateADEndUsersChangePassword:

  // --- Begin: updateADEndUserPreferenceData
  updateADEndUserPreferenceData: function ( reqObj, recordID, tokenDecodedData, callback) {
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
  AD_EndUserProfileDAO.updateADEndUserPreferenceData(recordID, tokenDecodedData, userPreferenceObj,
    function (error, resObj) {
        if (error) {
            logger.error('There was an Un-known Error in controllersAD-EndUserProfileService.js'+
                ' at updateADEndUserPreferenceData:', error);
            callback({ httpCode: 500, statusCode: resObj.statusCode, result: resObj.result });
        } else if (resObj.statusCode === '0000') {
            callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
        } else {
            callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
        }
    });
  },
// --- End: updateADEndUserPreferenceData
}
// --- End AD-End Users Profile Service


/**
 * @param {string} profileObj object
 * @param {string} fileLoc string
 * @param {string} fileName string
 * @param {string} orginalFileName string
 * @param {object} decodedTokenData object
 * @param {object} currentUTC object
 * @return {object} object
 */
function setUserObj(profileObj, recordID, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC) {
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
// // --- End: AD-End Users Profile Service