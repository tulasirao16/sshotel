/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var moment = require('moment');

var commonService = require('./CommonService');
var AD_ProfileDAO = require('../daos/AD-ProfileDAO');
var lookupsData = require('../config/lookupsData');
var AD_UserLoginDAO = require('../daos/AD-UserLoginDAO');

// --- Begin: AD Profile Service
module.exports = {
    // --- Begin AD ProfileUpdate:
    adminProfileUpdate: function (profileObj, fileLoc, orginalFileName, fileName, decodedTokenData, callback) {
      var currentUTC = commonService.currentUTCObj();
        var updateUserObj = setSpObj(profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC);
        AD_ProfileDAO.adProfileUpdate(updateUserObj, decodedTokenData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    updateUserProfilePassword: function(profilePasswordObj, tokenDecodedData, callback) {
        var currentPassword = profilePasswordObj.currentPassword;
        var newPassword = profilePasswordObj.newPassword;
        AD_UserLoginDAO.adminUserLogin(tokenDecodedData.umn, function(resObj) {
          if(resObj.statusCode == '1000') {
            var userObj = resObj.result;
            if(userObj.userStatus == lookupsData.userStatuses.active
            && userObj.password && userObj.passwordSalt) {
              commonService.passwordEncryption(currentPassword, userObj.passwordSalt, function(passwordObj) {
                if(passwordObj && passwordObj.passwordHash
                && passwordObj.passwordHash == userObj.password) {
                  var currentUTC = commonService.currentUTCObj();
                  commonService.saltGeneration(config.saltSize, function(salt) {
                    commonService.passwordEncryption(newPassword, salt, function(pswObj) {
                      if(pswObj && pswObj.passwordHash) {
                        var updateUserPasswordObj = {
                          password: pswObj.passwordHash,
                          passwordSalt: pswObj.salt,
                          updatedAt: currentUTC.currentUTCDateTimeNumber,
                          updatedOn: currentUTC.currentUTCDateTimeString,
                          updatedBy: tokenDecodedData.ua
                        };
                        AD_ProfileDAO.updateUserProfilePassword(updateUserPasswordObj, tokenDecodedData, function(pswUpdateResObj) {
                          callback(pswUpdateResObj);
                        });
                      } else {
                        callback({httpCode: 400, statusCode: '', result: {}}); // New Status Code
                      }
                    });
                  });
                } else {
                  callback({httpCode: 400, statusCode: '9979', result: {}}); // New Status Code
                }
              });
            } else if(userObj.userStatus == lookupsData.userStatuses.inactive) {
              callback({httpCode: 400, statusCode: '9951', result: {}});
            // } else if(userObj.userStatus == lookupsData.userStatuses.blocked) {
            //   callback({httpCode: 400, statusCode: '9952', result: {}});
            } else {
              callback({httpCode: 400, statusCode: '9979', result: {}}); // New Status Code
            }
          } else {
            callback(resObj);
          }
        });
      },
      updateADUserPreferenceData: function (reqObj, tokenDecodedData, callback) {
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
        };AD_ProfileDAO.updateADUserPreferenceData(tokenDecodedData, userPreferenceObj,
          function (error, resObj) {
              if (error) {
                  logger.error('There was an Un-known Error in controllers/SP-Users ProfileService.js',
                      ' at updateSPUserPreferenceData:', error);
                  callback({ httpCode: 500, statusCode: resObj.statusCode, result: resObj.result });
              } else if (resObj.statusCode === '0000') {
                  callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
              } else {
                  callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
              }
          });
  },

  // --- End: updateSPData
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
function setSpObj(profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC) {
    var userObj;
    if (fileLoc) {
        userObj = {
            email: profileObj.profileemail,
            mobileNumber: profileObj.profilemobileNumber,
            firstName: profileObj.profilefirstName,
            lastName: profileObj.profilelastName,
            name: profileObj.profilefirstName + (profileObj.profilelastName ?  (' ' + profileObj.profilelastName): ''),
            displayName: profileObj.profiledisplayName,
            area: profileObj.area ? profileObj.profilearea : '',
            city: profileObj.city ? profileObj.profilecity : '',
            state:profileObj.state ? profileObj.profilestate : '',
            zip: profileObj.zip ? profileObj.profilezip : '',
            country: profileObj.country ? profileObj.profilecountry : '',
            landMark: profileObj.landMark ? profileObj.profilelandMark : '',
            dob: profileObj.profiledob ? profileObj.profiledob : '',
            dobNumber: profileObj.dobNumber ? profileObj.dobNumber : 0,
            // dob: profileObj.profiledob ? profileObj.profiledob : '',
            dobNumber: profileObj.profiledob ? moment(profileObj.profiledob, 'YYYY-MM-DD').valueOf() : 0,
            userAccount: profileObj.profileuserAccount,
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
            name: profileObj.profilefirstName + (profileObj.profilelastName ?  (' ' + profileObj.profilelastName): ''),
            displayName: profileObj.profiledisplayName,
            dob: profileObj.profiledob ? profileObj.profiledob : '',
            dobNumber: profileObj.dobNumber ? profileObj.dobNumber : 0,
            // dob: profileObj.profiledob ? profileObj.profiledob : '',
            dobNumber: profileObj.profiledob ? moment(profileObj.profiledob, 'YYYY-MM-DD').valueOf() : 0,
            userAccount: profileObj.profileuserAccount,
            address: profileObj.profileaddress,
            area: profileObj.profilearea ? profileObj.profilearea: '',
            landMark: profileObj.profilelandMark ? profileObj.profilelandMark : '',
            city: profileObj.profilecity ? profileObj.profilecity: '',
            state: profileObj.profilestate ? profileObj.profilestate: '',
            zip: profileObj.profilezip ? profileObj.profilezip: '',
            country: profileObj.profilecountry ? profileObj.profilecountry: '',
            updatedBy: decodedTokenData.ua,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        };
    }
    return userObj;
}

/**
* @param {object} reqObj object
* @param {object} tokenDecodedData object
* @param {object} currentUTC object
* @return {object}
*/
function updateSPData(reqObj, tokenDecodedData, currentUTC) {
  var updateSPDataObj = {
      serviceProvider: reqObj.serviceProvider,
      contactPerson: reqObj.contactPerson,
      contactNumber: reqObj.contactNumber,
      contactEmail: reqObj.contactEmail,
      contactAddress: reqObj.contactAddress,
      area: reqObj.area,
      landmark: reqObj.landmark ? reqObj.landmark : '',
      zip: reqObj.zip,
      city: reqObj.city,
      state: reqObj.state,
      updatedBy: tokenDecodedData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
  };
  return updateSPDataObj;
}
// // --- End: SP Profile Service
