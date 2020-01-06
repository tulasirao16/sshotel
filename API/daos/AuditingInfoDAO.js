/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var CommonService = require('../services/CommonService');
var AD_AuditingInfo = require('../models/AD-AuditingInfo');
var EU_AuditingInfo = require('../models/EU-AuditingInfo');
var SP_AuditingInfo = require('../models/SP-AuditingInfo');

// --- Begining of CommonDAO
module.exports = {

    euAuditing: function(tokenDecodedData, actionType, collectionObj, keysValuesObj) {
        var currentUTC = CommonService.currentUTCObj();
        var euAuditObj = {
            euUserId: tokenDecodedData.iss ? tokenDecodedData.iss : 'SAID01',
            euName: tokenDecodedData.un ? tokenDecodedData.un : 'Super Admin',
            actionType: actionType,
            collectionName: collectionObj.name,
            collectionId: collectionObj.id,
            collectionValue: collectionObj.value,
            keysValuesObj: keysValuesObj,

            createdBy: tokenDecodedData.ua ? tokenDecodedData.ua : 'superadmin',
            createdAt: currentUTC.currentUTCDateTimeNumber,
            createdOn: currentUTC.currentUTCDateTimeString,
            updatedBy: tokenDecodedData.ua ? tokenDecodedData.ua : 'superadmin',
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        }
        new EU_AuditingInfo(euAuditObj).save(function(err, resObj){});
    },

    spAuditing: function(tokenDecodedData, actionType, collectionObj, keysValuesObj) {
        var currentUTC = CommonService.currentUTCObj();
        var spAuditObj = {
            spUserId: tokenDecodedData.iss ? tokenDecodedData.iss : 'SAID01',
            spName: tokenDecodedData.un ? tokenDecodedData.un : 'Super Admin',
            actionType: actionType,
            collectionName: collectionObj.name,
            collectionId: collectionObj.id,
            collectionValue: collectionObj.value,
            keysValuesObj: keysValuesObj,

            createdBy: tokenDecodedData.ua ? tokenDecodedData.ua : 'superadmin',
            createdAt: currentUTC.currentUTCDateTimeNumber,
            createdOn: currentUTC.currentUTCDateTimeString,
            updatedBy: tokenDecodedData.ua ? tokenDecodedData.ua : 'superadmin',
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        }
        new SP_AuditingInfo(spAuditObj).save(function(err, resObj){});
    },

    adAuditing: function(tokenDecodedData, actionType, collectionObj, keysValuesObj) {
        var currentUTC = CommonService.currentUTCObj();
        var adAuditObj = {
            adUserId: tokenDecodedData.iss ? tokenDecodedData.iss : 'ADUID01',
            adName: tokenDecodedData.un ? tokenDecodedData.un : 'Super Admin',
            actionType: actionType,
            collectionName: collectionObj.name,
            collectionId: collectionObj.id,
            collectionValue: collectionObj.value,
            keysValuesObj: keysValuesObj,

            createdBy: tokenDecodedData.ua ? tokenDecodedData.ua : 'superadmin',
            createdAt: currentUTC.currentUTCDateTimeNumber,
            createdOn: currentUTC.currentUTCDateTimeString,
            updatedBy: tokenDecodedData.ua ? tokenDecodedData.ua : 'superadmin',
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        }
        new AD_AuditingInfo(adAuditObj).save(function(err, resObj){});
    }
}
// --- End of CommonDAO
