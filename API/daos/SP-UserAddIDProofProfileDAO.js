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

// --- Begining of SP-Users ProfileDAO
module.exports = {
    // ---Begin: SP-Users Profile

    setSPUserProfileUserKyc: function (spUserKycObj, tokenDecodedData, callback) {
        spUserKycObj.save(function (error, resObj) {
            if (error) {
                logger.error('There was an Un-known Error occured in daos/SP-UsersAddIDProofProfileDAO.js,'+
                ' at setSPUserProfileUserKyc:', error);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj && resObj._id) {
                AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionSPUsersKyc, id: resObj._id, value: resObj.idNumber }, resObj);
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9993', result: {} });
            }
        });
    },

    getSPIDProofsData: function (tokenDecodedData, callback) {
        var query = {
            'spUserId': tokenDecodedData.iss,
            'isDeleted': false,
        }
        SP_UsersKyc
        .find(query)
        .populate('spUserId')
        .sort({ 'createdAt': -1 }).exec(function (error, data) {
            if (error) {
                logger.error('There was an Error occured in daos/SP-UsersAddIDProofProfileDAO.js,'
                    , error);
                callback(error, { httpCode: 500, statusCode: '9999', result: {} });
            } else if (data && data.length > 0) {
                callback(error, { httpCode: 200, statusCode: '0000', result: data });
            } else {
                callback(error, { httpCode: 400, statusCode: '9997', result: {} });
            }
        });
    },

    updateSPProfileUserKyc: function (_id, updateIDProofObj, tokenDecodedData, callback) {
        var query = { _id: _id, spUserId: tokenDecodedData.iss, isDeleted: false };
        SP_UsersKyc.findOneAndUpdate(query, { $set: updateIDProofObj }, { new: true }, function (error, resObj) {
          if (error) {
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if (resObj && resObj._id) {
            AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update', { name: config.collectionSPUsersKyc, id: _id, value: resObj.idNumber }, updateIDProofObj);
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          } else {
            callback({ httpCode: 400, statusCode: '9900', result: {} });
          }
        });
      },

    updateSPUserPreferenceData: function (tokenDecodedData, userPreferenceObj, callback) {
        SP_Users.findOneAndUpdate({ _id: tokenDecodedData.iss, isDeleted: false },
        { $set: userPreferenceObj }, {new: true}, function (error, data) {
            if (error) {
                logger.error('There was an Un-konwn Error occured in daos/SP-UsersAddIDProofProfileDAO.js,',
                    ' at updateSPUserPreferenceData:', error);
                callback(error, { statusCode: '9999', result: {} });
            } else if (data && data._id) {
                AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPUsers, id: data._id, value: data.userAccount }, userPreferenceObj);
                callback(error, { statusCode: '0000', result: data });
            } else {
                logger.error('There was an Error occured in daos/SP-UsersAddIDProofProfileDAO.js,',
                    ' at updateSPUserPreferenceData: User Profile preference Update Failed');
                callback(error, { statusCode: '9992', result: {} });
            }
        });
    },

    // --- Begin getSPUserKycByIdType:
    getSPUserKycByIdType: function (idType, tokenDecodedData, callback) {
        SP_UsersKyc.findOne({'spUserId': tokenDecodedData.iss, 'idType': {'$eq': idType }, 'isDeleted': false })
        .exec(function (error, resObj) { 
        if (error) {
            logger.error('There was an Un-Known Error occured in daos/SP-UsersAddIDProofProfileDAO.js at find query - getSPUserKycByIdType:', error);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj._id) {
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
        } else {
            callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
        });
    }
    // --- End getSPUserKycByIdType
};
// -----Ending of SP-UsersAddIDProofProfileDAO