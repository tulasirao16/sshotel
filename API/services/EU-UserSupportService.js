/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */
var geolite2 = require('geolite2');
var maxmind = require('maxmind');
var CommonService = require('./CommonService');
var logger = require('../lib/logger');
var EU_Support = require('../models/EU-Support');
var AD_Tickets = require('../models/AD-Tickets');
var EU_UserSupportDAO = require('../daos/EU-UserSupportDAO');


// --- Begin: EU-UserSupportService
module.exports = {
    getEUSupportData: function (pageNum, searchString, tokenDecodedData, callback) {
        EU_UserSupportDAO.getEUSupportData(pageNum, searchString, tokenDecodedData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },

    createEUSupportData: function (reqBody, tokenDecodedData, callback) {
        var currentUTC = CommonService.currentUTCObj();
        var currentUTCNumString = currentUTC.currentUTCDateTimeNumber.toString();
        let supportObj = {
            euUserId: tokenDecodedData.iss,
            euName: tokenDecodedData.un,
            ticketTitle: reqBody.ticketTitle,
            ticketTag: reqBody.ticketTag,
            reqMobileNumber: reqBody.reqMobileNumber,
            reqEmail: reqBody.reqEmail,
            ticketDescription: reqBody.ticketDescription,
            ticketStatus: 'New',
            assignStatus: 'Unassigned',
            ticketGroup: 'End User Service',
            ticketPriority: 'Medium',
            ticketNumType: reqBody.ticketNumType,
            createdBy: tokenDecodedData.ua,
            createdAt: currentUTC.currentUTCDateTimeNumber,
            createdOn: currentUTC.currentUTCDateTimeString,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedBy: tokenDecodedData.ua,
            updatedOn: currentUTC.currentUTCDateTimeString,
        };
        var euSupportObj = new AD_Tickets(supportObj);
        EU_UserSupportDAO.createEUSupportData(euSupportObj, reqBody, tokenDecodedData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    }
};
// --- End: EU-UserSupportService
