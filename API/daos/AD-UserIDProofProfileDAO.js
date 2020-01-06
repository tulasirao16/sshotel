/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var AD_UsersKyc = require('../models/AD-UsersKyc');

// --- Begining of UserIDProofProfileDAO
module.exports = {
    setADUserProfileUserKyc: function (spUserKycObj, tokenDecodedData, callback) {
        spUserKycObj.save(function (error, resObj) {
            if (error) {
                logger.error('There was an Un-known Error occured in daos/AD-UserIDProofProfileDAO.js,'+
                ' at setADUserProfileUserKyc:', error);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj && resObj._id) {
                AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', {name: config.collectionSPUsersKyc, id: resObj._id, value: resObj.idNumber }, resObj);
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9993', result: {} });
            }
        });
    },

    getADIDProofsData: function (tokenDecodedData, callback) {
        var query = {
            'adUserId': tokenDecodedData.iss,
            'isDeleted': false,
        }
        AD_UsersKyc
        .find(query)
        .populate('adUserId')
        .sort({ 'createdAt': -1 }).exec(function (error, data) {
            if (error) {
                logger.error('There was an Error occured in daos/AD-UserIDProofProfileDAO.js,'
                    , error);
                callback(error, { httpCode: 500, statusCode: '9999', result: {} });
            } else if (data && data.length > 0) {
                callback(error, { httpCode: 200, statusCode: '0000', result: data });
            } else {
                callback(error, { httpCode: 400, statusCode: '9997', result: {} });
            }
        });
    },

    updateADUserProfileUserKyc: function (_id, updateIDProofObj, tokenDecodedData, callback) {
        var query = { _id: _id, adUserId: tokenDecodedData.iss, isDeleted: false };
        AD_UsersKyc.findOneAndUpdate(query, { $set: updateIDProofObj }, { new: true }, function (error, resObj) {
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

    getADUserKycByIdType: function (idType, tokenDecodedData, callback) {
        AD_UsersKyc.findOne({'adUserId': tokenDecodedData.iss, 'idType': {'$eq': idType }, 'isDeleted': false })
        .exec(function (error, resObj) { 
        if (error) {
            logger.error('There was an Un-Known Error occured in daos/AD-UserIDProofProfileDAO.js at find query - getADUserKycByIdType:', error);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj._id) {
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
        } else {
            callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
        });
    }
    // --- End getADUserKycByIdType
};
// -----Ending of AD-UserIDProofProfileDAO