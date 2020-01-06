/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var config = require('config');
var commonService = require('./CommonService');
var AD_EndUserProfileIDProofDAO = require('../daos/AD-EndUserProfileIDProofDAO');
var EU_UsersKyc = require('../models/EU-UsersKyc');
var EU_UserLoginDAO = require('../daos/EU-UserLoginDAO');
var lookupsData = require('../config/lookupsData');
var moment = require('moment');


// --- Begin: AD-End Users Profile ID Proof Service
module.exports = {
    // --- Begin: getADEndUserIDProofsData
    getADEndUserIDProofsData: function (recordID,tokenDecodedData, callback) {
        AD_EndUserProfileIDProofDAO.getADEndUserIDProofsData(recordID, tokenDecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // --- End: getADEndUserIDProofsData

    // --- Begin: updateADEUProfileUserKyc
    updateADEUProfileUserKyc: function (recordID, profileObj, fileLoc, orginalFileName, fileName, currentUTC, decodedTokenData, callback) {
        var updateIDProofObj = setIDProofObj(profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC);
        AD_EndUserProfileIDProofDAO.updateADEUProfileUserKyc(recordID, updateIDProofObj, decodedTokenData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    // --- End: updateADEUProfileUserKyc

    // --- Begin: setADEUProfileUserKyc
    setADEUProfileUserKyc: function (reqObj, fileLoc, orginalFileName, fileName, tokenDecodedData, currentUTC, callback) {    
        var EUIdProofObj = {
            euName: reqObj.euName,
            euUserId: reqObj.euUserId,
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
        };
        var euKycObj = new EU_UsersKyc(EUIdProofObj);
        AD_EndUserProfileIDProofDAO.setADEUProfileUserKyc(euKycObj, tokenDecodedData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    // --- End: setADEUProfileUserKyc

    // --- Begin: getADEndUsersIDProofs 
    getADEndUsersIDProofs: function (idType, euUserId, callback) {
        AD_EndUserProfileIDProofDAO.getADEndUsersIDProofs(idType, euUserId, function (resObj) {
           callback(resObj);
        });
    },
    // --- End: getADEndUsersIDProofs 
}
// --- End: AD-End Users Profile ID Proof Service

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