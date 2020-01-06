/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var commonService = require('./CommonService');
var AD_UserAddIDProofProfileDAO = require('../daos/AD-UserIDProofProfileDAO');
var AD_UsersKyc = require('../models/AD-UsersKyc');

// --- Begin: AD-UserIDProofProfileService
module.exports = {
    setADUserProfileUserKyc: function (reqObj, fileLoc, orginalFileName, fileName, tokenDecodedData, currentUTC, callback) {
        var adUserIdProofObj = {
            adName: tokenDecodedData.ua,
            adUserId: tokenDecodedData.iss,
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
        var spUserKycObj = new AD_UsersKyc(adUserIdProofObj);
        AD_UserAddIDProofProfileDAO.setADUserProfileUserKyc(spUserKycObj, tokenDecodedData, function(resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },

    getADIDProofsData: function (tokenDecodedData, callback) {
        AD_UserAddIDProofProfileDAO.getADIDProofsData(tokenDecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },

    updateADUserProfileUserKyc: function (_id, profileObj, fileLoc, orginalFileName, fileName, currentUTC, decodedTokenData, callback) {
        var updateIDProofObj = setIDProofObj(profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC);
        AD_UserAddIDProofProfileDAO.updateADUserProfileUserKyc(_id, updateIDProofObj, decodedTokenData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },

    // --- Begin getSPUserKycByIdType
    getADUserKycByIdType: function (idType, tokenDecodedData, callback) {
        AD_UserAddIDProofProfileDAO.getADUserKycByIdType(idType, tokenDecodedData, function (resObj) {
            callback(resObj);
        });
    },
    //--- End getSPUserKycByIdType
};
// --- End: AD-UserIDProofProfileService

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


