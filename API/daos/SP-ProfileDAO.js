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
var SP_UsersKyc = require('../models/SP-UsersKyc');
var CommonService = require('../services/CommonService');

// --- Begining of SP ProfileDAO
module.exports = {
    // ---Begin: SP Profile
    spProfileUpdate: function (updateUserObj, tokenDecodedData, callback) {
        var query = { _id: tokenDecodedData.iss, isDeleted: false };
        SP_Users.findOneAndUpdate(query, { $set: updateUserObj }, { new: true }, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj) {
                AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount }, updateUserObj);
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
        SP_Users.updateOne(query, {$set: updateUserPasswordObj}, function(error, resObj) {
          if(error) {
            logger.error('There was an Un-Known Error occured in daos/SP-ProfileDAO.js,',
            ' at updateUserProfilePassword:', err);
            callback({httpCode: 500, statusCode: '9999', result: {}});
          } else if(resObj.nModified == 1) {
            AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPUsers, id: tokenDecodedData.iss, value: tokenDecodedData.ua }, updateUserPasswordObj);
            callback({httpCode: 200, statusCode: '1012', result: resObj});
          } else {
            callback({httpCode: 400, statusCode: '9993', result: {}});
          }
        });
    },

    // --- Begin updateSPData:
    updateSPData: function (query, updateObj, tokenDecodedData, callback) {
        SP_ServiceProviders.findOneAndUpdate(query, { $set: updateObj }, { new: true }, function (error, data) {
            if (error) {
                logger.error('There was an Un-konwn Error occured in daos/SP-ProfileDAO.js, at updateSPData:', error);
                callback({ httpCode: 400, statusCode: '9900', result: {} });
            } else if (data && data._id) {
                AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPServiceProviders, id: data._id, value: data.serviceProvider }, updateObj);
                callback({ httpCode: 200, statusCode: '0000', result: data });
            } else {
                callback({ httpCode: 400, statusCode: '9992', result: {} });
            }
        });
    }
    // --- End updateSPData:
};
// -----Ending of SP ProfileDAO