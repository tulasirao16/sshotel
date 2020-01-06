/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var EU_Users = require('../models/EU-Users');
var EU_UsersKyc = require('../models/EU-UsersKyc');
var CommonService = require('../services/CommonService');

// --- Begining of AD-EndUsers ProfileDAO
module.exports = {
    // ---Begin: ADEndUsersProfileUpdate
    ADEndUsersProfileUpdate: function (updateUserObj,recordID, tokenDecodedData, callback) {
        var query = { _id: recordID, isDeleted: false };
        EU_Users.findOneAndUpdate(query, { $set: updateUserObj }, { new: true }, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj && resObj._id) {
                var euUserObj = resObj;
                var decObj = {
                  mobileNumber: resObj.mobileNumber,
                  email: resObj.email,
                  alternateContactNumber: resObj.alternateContactNumber ? CommonService.decrypt(resObj.alternateContactNumber) : '',
                  alternateEmail: resObj.alternateEmail ? CommonService.decrypt(resObj.alternateEmail) : '',
                };
                var resultObj = JSON.parse((JSON.stringify(euUserObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
                AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserUsers, id: resObj._id, value: resObj.userAccount }, updateUserObj);
                callback({httpCode: 200, statusCode: '0000', result: resultObj});
            } else {
                callback({ httpCode: 400, statusCode: '9900', result: {} });
            }
        });
    },
    // -----Ending of ADEndUsersProfileUpdate

   // --- Begin  updateADEndUsersChangePassword:
   updateADEndUsersChangePassword: function( userID ,newPassword, tokenDecodedData, callback) {
    var query = {_id:userID, isDeleted: false};
    EU_Users.findOneAndUpdate(query, {$set: newPassword}, function(error, resObj) {
          if(error) {
              logger.error('There was an Un-Known Error occured in daos/AD-EndUserProfileDAO.js,'+
              ' at updateADEndUsersChangePassword:', error);
              callback({httpCode: 500, statusCode: '9999', result: {}});
            } else if(resObj && resObj._id) {
            callback({httpCode: 200, statusCode: '1012', result: resObj});
            } else {
              callback({httpCode: 400, statusCode: '9985', result: {}});
            }
        });
    },
    // --- End updateADEndUsersChangePassword:

    // --- Begin updateADEndUserPreferenceData:
    updateADEndUserPreferenceData: function (recordID, tokenDecodedData, userPreferenceObj, callback) {
        EU_Users.findOneAndUpdate({ _id: recordID, isDeleted: false },
        { $set: userPreferenceObj }, {new: true}, function (error, resObj) {
            if (error) {
                logger.error('There was an Un-konwn Error occured in daos/AD-EndUserProfileDAO.js,'+
                    ' at updateADEndUserPreferenceData:', error);
                callback(error, { statusCode: '9999', result: {} });
            } else if (resObj && resObj._id) {
            AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionEuUsers, id: resObj._id, value: resObj.userAccount }, userPreferenceObj);
                callback(error, { statusCode: '0000', result: resObj });
            } else {
                logger.error('There was an Error occured in daos/AD-EndUserProfileDAO.js,',
                    ' at updateADEndUserPreferenceData: User Profile preference Update Failed');
                callback(error, { statusCode: '9992', result: {} });
            }
        });
    }
// --- Ending updateADEndUserPreferenceData
}
// --- Ending of AD-EndUsers ProfileDAO