/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var AD_Users = require('../models/AD-Users');
var SP_ServiceProviders = require('../models/SP-ServiceProviders');
var AD_UsersKyc = require('../models/SP-UsersKyc');

// --- Begining of AD ProfileDAO
module.exports = {
    // ---Begin: AD Profile
    adProfileUpdate: function (updateUserObj, tokenDecodedData, callback) {
        var query = { _id: tokenDecodedData.iss, isDeleted: false };
        AD_Users.findOneAndUpdate(query, { $set: updateUserObj }, { new: true }, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj) {
                AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount }, updateUserObj);
                var spUserObj = resObj;
                var decObj = {
                  mobileNumber: resObj.mobileNumber,
                  email: resObj.email,
                  alternateContactNumber: resObj.alternateContactNumber ? CommonService.decrypt(resObj.alternateContactNumber) : '',
                  alternateEmail: resObj.alternateEmail ? CommonService.decrypt(resObj.alternateEmail) : '',
                };
                var resultObj = JSON.parse((JSON.stringify(spUserObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
                callback({httpCode: 200, statusCode: '0000', result: resultObj});
                // callback({ httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9900', result: {} });
            }
        });
    },

    updateUserProfilePassword: function(updateUserPasswordObj, tokenDecodedData, callback) {
        var query = {_id: tokenDecodedData.iss, isDeleted: false};
        AD_Users.updateOne(query, {$set: updateUserPasswordObj}, function(error, resObj) {
          if(error) {
            logger.error('There was an Un-Known Error occured in daos/AD-ProfileDAO.js,',
            ' at updateUserProfilePassword:', err);
            callback({httpCode: 500, statusCode: '9999', result: {}});
          } else if(resObj.nModified == 1) {
            AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPUsers, id: tokenDecodedData.iss, value: tokenDecodedData.ua }, updateUserPasswordObj);
            callback({httpCode: 200, statusCode: '1012', result: resObj});
          } else {
            callback({httpCode: 400, statusCode: '9993', result: {}});
          }
        });
    },
    updateADUserPreferenceData: function (tokenDecodedData, userPreferenceObj, callback) {
        AD_Users.findOneAndUpdate({ _id: tokenDecodedData.iss, isDeleted: false },
        { $set: userPreferenceObj }, {new: true}, function (error, data) {
            if (error) {
                logger.error('There was an Un-konwn Error occured in daos/AD-ProfileDAO.js,',
                    ' at updateADUserPreferenceData:', error);
                callback(error, { statusCode: '9999', result: {} });
            } else if (data && data._id) {
                AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPUsers, id: data._id, value: data.userAccount }, userPreferenceObj);
                callback(error, { statusCode: '0000', result: data });
            } else {
                logger.error('There was an Error occured in daos/AD-ProfileDAO.js,',
                    ' at updateADUserPreferenceData: User Profile preference Update Failed');
                callback(error, { statusCode: '9992', result: {} });
            }
        });
    },

   
    // --- End updateSPData:
};
// -----Ending of AD ProfileDAO