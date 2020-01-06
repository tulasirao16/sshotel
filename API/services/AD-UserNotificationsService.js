/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var moment = require('moment');
var CommonService = require('../services/CommonService');
var AD_UserNotificationsDAO = require('../daos/AD-UserNotificationsDAO');
// var SP_Properties = require('../models/SP-Properties');
// var SP_Users = require('../models/SP-Users');

// BEGIN : AD-UserNotificationsService
module.exports = {
    // BEGIN : getUserNotifications
    getUserNotifications: function (userId, pageNumber, searchString, tokenDecodedData, callback) {
        AD_UserNotificationsDAO.getUserNotifications(userId, pageNumber, searchString, tokenDecodedData, function (resObj) {
            callback(resObj);
        });
    },
    // END : getUserNotifications

    // BEGIN : userNotificationsReadStatus    
    userNotificationsReadStatus: function (recordID, reqBody, tokenDecodedData, callback) {
        var currentUTC = CommonService.currentUTCObj();
        var updateObj = {
            status: reqBody.status,
            updatedBy: tokenDecodedData.ua,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        };
        AD_UserNotificationsDAO.userNotificationsReadStatus(updateObj, recordID, tokenDecodedData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    // END : userNotificationsReadStatus

    // BEGIN : userNotificationsDelete
    userNotificationsDelete: function (recordID, tokenDecodedData, callback) {
        var currentUTC = CommonService.currentUTCObj();
        var updateObj = {
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedBy: tokenDecodedData.ua,
            updatedOn: currentUTC.currentUTCDateTimeString,
            isDeleted: true
        };
        AD_UserNotificationsDAO.userNotificationsDelete(recordID, updateObj, tokenDecodedData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    // END : userNotificationsDelete 
}
// END : AD-UserNotificationsService