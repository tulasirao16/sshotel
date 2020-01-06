/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var commonService = require('./CommonService');
var AD_HostUsersIDProofProfileDAO = require('../daos/AD-HostUsersIDProofProfileDAO');
var SP_UsersKyc = require('../models/SP-UsersKyc');

// --- Begin: AD-HostUsersIDProofProfileService
module.exports = {
    // --- Begin setADHostUserProfileUserKyc:
    setADHostUserProfileUserKyc: function (reqObj, fileLoc, orginalFileName, fileName, tokenDecodedData, currentUTC, callback) {
        var spUserIdProofObj = {
            spServiceProviderId: reqObj.spServiceProviderId,
            spServiceProvider: reqObj.spServiceProvider,
            spName: reqObj.spName,
            spUserId: reqObj.spUserId,
            idType: reqObj.idType,
            idNumber: reqObj.idNumber,
            nameOnId: reqObj.nameOnId,
            idStatus: 'Not-Verified',
            kycStatus: 'Active',
            kycImage: fileName,
            kycImageOriginalName: orginalFileName,
            kycImagePath: fileLoc,
            isDeleted: false,
            createdBy: tokenDecodedData.ua,
            updatedBy: tokenDecodedData.ua,
            createdAt: currentUTC.currentUTCDateTimeNumber,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            createdOn: currentUTC.currentUTCDateTimeString,
            updatedOn: currentUTC.currentUTCDateTimeString
        }
        var spUserKycObj = new SP_UsersKyc(spUserIdProofObj);
        AD_HostUsersIDProofProfileDAO.setADHostUserProfileUserKyc(spUserKycObj, tokenDecodedData, function(resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    // --- End: setADHostUserProfileUserKyc

    // --- Begin: updateADHostUserProfileUserKyc
    updateADHostUserProfileUserKyc: function (recordID, profileObj, fileLoc, orginalFileName, fileName, currentUTC, decodedTokenData, callback) {
        var updateIDProofObj = setIDProofObj(profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC);
        AD_HostUsersIDProofProfileDAO.updateADHostUserProfileUserKyc(recordID, updateIDProofObj, decodedTokenData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    // --- End: updateADHostUserProfileUserKyc

    // --- Begin: getADHostIDProofsData
    getADHostIDProofsData: function (recordID,tokenDecodedData, callback) {
        AD_HostUsersIDProofProfileDAO.getADHostIDProofsData(recordID, tokenDecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // --- End: getADHostIDProofsData

    // --- Begin: updateADHostUserPreferenceData
    updateADHostUserPreferenceData: function ( reqObj, recordID, tokenDecodedData, callback) {
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
        AD_HostUsersIDProofProfileDAO.updateADHostUserPreferenceData(recordID, tokenDecodedData, userPreferenceObj,
            function (error, resObj) {
                if (error) {
                    logger.error('There was an Un-known Error in controllersAD-HostUsersIDProofProfileController.js'+
                        ' at updateADHostUserPreferenceData:', error);
                    callback({ httpCode: 500, statusCode: resObj.statusCode, result: resObj.result });
                } else if (resObj.statusCode === '0000') {
                    callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
                } else {
                    callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
                }
            });
    },
    // --- End: updateADHostUserPreferenceData

     // --- Begin: getADHostUserIDProofs 
     getADHostUserIDProofs: function (idType, spUserId, callback) {
        AD_HostUsersIDProofProfileDAO.getADHostUserIDProofs(idType, spUserId, function (resObj) {
           callback(resObj);
        });
    },
    // --- End: getADHostUserIDProofs 
}
// --- End: AD-HostUsersIDProofProfileService

/**
 * @param {object} reqObj object
 * @param {string} fileLoc string
 * @param {string} fileName string
 * @param {string} orginalFileName string
 * @param {object} decodedTokenData object
 * @param {object} currentUTC object
 * @return {object} object
 */
function setIDProofObj(reqObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC) {
    var idproofObj;
    if (fileLoc) {
        idproofObj = {
            idType: reqObj.idType,
            idNumber: reqObj.idNumber,
            nameOnId: reqObj.nameOnId,
            kycImage: fileName,
            kycImageOriginalName: orginalFileName,
            kycImagePath: fileLoc,
            idStatus: 'Not-Verified',
            kycStatus: 'Active',
            updatedBy: decodedTokenData.ua,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        };
    } else {
        idproofObj = {
            idType: reqObj.idType,
            idNumber: reqObj.idNumber,
            nameOnId: reqObj.nameOnId,
            idStatus: 'Not-Verified',
            kycStatus: 'Active',
            updatedBy: decodedTokenData.ua,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        };
    }
    return idproofObj;
}