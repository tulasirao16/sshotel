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
var SP_UsersKyc = require('../models/SP-UsersKyc');
var commonService = require('../services/CommonService');

// --- Begining of AD-HostUsersIDProofProfileDAO
module.exports = {
    // ---Begin: setADHostUserProfileUserKyc
    setADHostUserProfileUserKyc: function (spUserKycObj, tokenDecodedData, callback) {
        spUserKycObj.save(function (error, resObj) {
            if (error) {
                logger.error('There was an Un-known Error occured in daos/AD-HostUsersIDProofProfileDAO.js,'+
                ' at setADHostUserProfileUserKyc:', error);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj && resObj._id) {
                AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', {name: config.collectionSPUsersKyc, id: resObj._id, value: resObj.idNumber }, resObj);
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9993', result: {} });
            }
        });
    },
    // ---Ending: setADHostUserProfileUserKyc

    // --- Begin updateADHostUserProfileUserKyc
    updateADHostUserProfileUserKyc: function (recordID, updateIDProofObj, tokenDecodedData, callback) {
        var query = { _id: recordID, isDeleted: false };
        SP_UsersKyc.findOneAndUpdate(query, { $set: updateIDProofObj }, { new: true }, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj) {
                AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPUsersKyc, id: resObj._id, value: resObj.idNumber }, updateIDProofObj);
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9900', result: {} });
            }
        });
    },
    // --- Ending updateADHostUserProfileUserKyc

    // --- Begin getADHostIDProofsData:
    getADHostIDProofsData: function (recordID,tokenDecodedData, callback) {
        var query = {
            'spUserId': recordID,
            'isDeleted': false,
        }
        SP_UsersKyc
        .find(query)
        // .populate('spUserId')
        .sort({ 'createdAt': -1 })
        .exec(function (error, resObj) {
            if (error) {
                logger.error('There was an Error occured in daos/AD-HostUsersIDProofProfileDAO.js,'
                    + error);
                callback(error, { httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj && resObj.length > 0) {
                callback(error, { httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback(error, { httpCode: 400, statusCode: '9997', result: {} });
            }
        });
    },
    // --- Ending getADHostIDProofsData:

    // --- Begin updateADHostUserPreferenceData:
    updateADHostUserPreferenceData: function (recordID, tokenDecodedData, userPreferenceObj, callback) {
        SP_Users.findOneAndUpdate({ _id: recordID, isDeleted: false },
        { $set: userPreferenceObj }, {new: true}, function (error, resObj) {
            if (error) {
                logger.error('There was an Un-konwn Error occured in daos/AD-HostUsersIDProofProfileDAO.js,'+
                    ' at updateADHostUserPreferenceData:', error);
                callback(error, { statusCode: '9999', result: {} });
            } else if (resObj && resObj._id) {
                var euUserObj = resObj;
                var decObj = {
                  mobileNumber: resObj.mobileNumber,
                  email: resObj.email,
                  alternateContactNumber: resObj.alternateContactNumber ? commonService.decrypt(resObj.alternateContactNumber) : '',
                  alternateEmail: resObj.alternateEmail ? commonService.decrypt(resObj.alternateEmail) : '',
                };
                var resultObj = JSON.parse((JSON.stringify(euUserObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
                AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount }, userPreferenceObj);
                callback(error, { statusCode: '0000', result: resultObj });
            } else {
                logger.error('There was an Error occured in daos/AD-HostUsersIDProofProfileDAO.js,'+
                    ' at updateADHostUserPreferenceData: User Profile preference Update Failed');
                callback(error, { statusCode: '9992', result: {} });
            }
        });
    },
    // --- Ending updateADHostUserPreferenceData:
    
    // --- Begin  of getADHostUserIDProofs
    getADHostUserIDProofs: function (idType, spUserId, callback) {
        SP_UsersKyc.findOne({'spUserId': spUserId, 'idType': {'$eq': idType }, 'isDeleted': false }).exec(function (error, resObj) { 
          if (error) {
            logger.error('There was an Un-Known Error occured in daos/AD-HostUsersIDProofProfileDAO.js at find query - getADHostUserIDProofs:'+ error);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if (resObj && resObj._id) {
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          } else {
            callback({ httpCode: 400, statusCode: '9997', result: {} });
          }
        });
    },
      // --- Ending of getADHostUserIDProofs
}
// --- Ending of AD-HostUsersIDProofProfileDAO
