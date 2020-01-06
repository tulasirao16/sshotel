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
    // --- Begin getADEndUserIDProofsData:
    getADEndUserIDProofsData: function (recordID,tokenDecodedData, callback) {
        var query = {
            'euUserId': recordID,
            'isDeleted': false,
        }
        EU_UsersKyc
        .find(query)
        // .populate('euUserId')
        .sort({ 'createdAt': -1 })
        .exec(function (error, resObj) {
            if (error) {
                logger.error('There was an Error occured in daos/AD-EndUserProfileIDProofDAO.js,'
                    , error);
                callback(error, { httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj && resObj.length > 0) {
                callback(error, { httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback(error, { httpCode: 400, statusCode: '9997', result: {} });
            }
        });
    },
    // --- Ending getADEndUserIDProofsData:

    // --- Begin updateADEUProfileUserKyc:
    updateADEUProfileUserKyc: function (recordID, updateIDProofObj, tokenDecodedData, callback) {
        var query = { _id: recordID, isDeleted: false };
        EU_UsersKyc.findOneAndUpdate(query, { $set: updateIDProofObj }, { new: true }, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj && resObj._id) {
                AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserUsersKyc, id: recordID, value: resObj.idNumber }, updateIDProofObj);
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9900', result: {} });
            }
        });
    },
    // --- Ending updateADEUProfileUserKyc:

    // --- Begin setADEUProfileUserKyc:
    setADEUProfileUserKyc: function (euKycObj, decodedTokenData, callback) {
        euKycObj.save(function (error, resObj) {
          if (error) {
            logger.error('There was an Un-known Error occured in daos/AD-EndUserProfileIDProofDAO.js,'+
            ' at setADEUProfileUserKyc:', error);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if (resObj && resObj._id) {
            AuditingInfoDAO.adAuditing(decodedTokenData, 'Create', { name: config.collectionEndUserUsersKyc, id: resObj._id, value: resObj.idNumber }, resObj);
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          } else {
            callback({ httpCode: 400, statusCode: '9993', result: {} });
          }
        });
    },
    // --- Ending setADEUProfileUserKyc:

    // --- Begin  of getADEndUsersIDProofs
    getADEndUsersIDProofs: function (idType, euUserId, callback) {
      EU_UsersKyc.findOne({'euUserId': euUserId, 'idType': {'$eq': idType }, 'isDeleted': false }).exec(function (error, resObj) { 
        if (error) {
          logger.error('There was an Un-Known Error occured in daos/AD-EndUserProfileIDProofDAO.js at find query - getADEndUsersIDProofs:'+ error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj._id) {
          callback({ httpCode: 200, statusCode: '0000', result: resObj });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
    },
      // --- Ending of getADEndUsersIDProofs
}
// --- Ending of AD-EndUsers ProfileDAO