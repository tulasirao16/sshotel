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

// --- Begining of EU-Users ProfileDAO
module.exports = {
    // ---Begin: EU-Users Profile
    endUsersProfileUpdate: function (updateUserObj, tokenDecodedData, callback) {
        var query = { _id: tokenDecodedData.iss, isDeleted: false };
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
                AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserUsers, id: resObj._id, value: resObj.userAccount }, updateUserObj);
                callback({httpCode: 200, statusCode: '0000', result: resultObj});
            } else {
                callback({ httpCode: 400, statusCode: '9900', result: {} });
            }
        });
    },
    // -----Ending of EU-Users ProfileDAO

    updateUserPreferenceData: function (tokenDecodedData, userPreferenceObj, callback) {
        EU_Users.findOneAndUpdate({ _id: tokenDecodedData.iss, isDeleted: false },
        { $set: userPreferenceObj }, { new: true }, function (error, data) {
            if (error) {
                logger.error('There was an Un-konwn Error occured in daos/EU-Users ProfileDAO.js, at updateUserPreferenceData:', error);
                callback(error, { statusCode: '9999', result: {} });
            } else if (data && data._id) {
                AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserUsers, id: data._id, value: data.userAccount }, userPreferenceObj);
                callback(error, { statusCode: '0000', result: data });
            } else {
                logger.error('There was an Error occured in daos/EU-Users ProfileDAO.js,' +
                    ' at updateUserPreferenceData: User Profile preference Update Failed');
                callback(error, { statusCode: '9992', result: {} });
            }
        });
    },

    userNameObj: function (tokenDecodedData, userNameObj, res, callback) {
        EU_Users.findOneAndUpdate({ _id: tokenDecodedData.iss, isDeleted: false },
        { $set: userNameObj }, { new: true }, function (error, data) {
            if (error) {
                if(error.errmsg.indexOf('mobileNumber_1') > 0) {
                    logger.error('There was an Uniqueness(mobileNumber) Error occured in daos/EU-UserProfileDAO.js,' +
                        ' at userNameObj:', error);
                    callback({ httpCode: 400, statusCode: '9956', result: {} });
                } else {
                    logger.error('There was an Un-konwn Error occured in daos/EU-UserProfileDAO.js, at userNameObj:', error);
                    callback({ httpCode: 500, statusCode: '9999', result: {} });
                }
            } else if (data && data._id) {
                var euUserObj = data;
                var decObj = {
                  mobileNumber: data.mobileNumber,
                  email: data.email,
                  alternateContactNumber: data.alternateContactNumber ? CommonService.decrypt(data.alternateContactNumber) : '',
                  alternateEmail: data.alternateEmail ? CommonService.decrypt(data.alternateEmail) : '',
                };
                var resultObj = JSON.parse((JSON.stringify(euUserObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
                CommonService.tokenGeneration(data, res, function(token) { 
                    if (token) {
                        AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserUsers, id: data._id, value: data.userAccount }, userNameObj);
                        callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                    } else {
                        callback({httpCode: 400, statusCode: '9997', result: {}});
                    }
                });
            } else {
                logger.error('There was an Error occured in daos/EU-Users ProfileDAO.js, at userNameObj: User Name Update Failed');
                callback({ httpCode: 400, statusCode: '9992', result: {} });
            }
        });
    },

    updateUserProfilePassword: function (updateUserPasswordObj, tokenDecodedData, callback) {
        var query = { _id: tokenDecodedData.iss, isDeleted: false };
        EU_Users.updateOne(query, { $set: updateUserPasswordObj }, function (error, resObj) {
            if (error) {
                logger.error('There was an Un-Known Error occured in daos/EU-Users ProfileDAO.js, at updateUserProfilePassword:', err);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.nModified == 1) {
                AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserUsers, id: tokenDecodedData.iss, value: tokenDecodedData.ua }, updateUserPasswordObj);
                callback({ httpCode: 200, statusCode: '1012', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9993', result: {} });
            }
        });
    }
};