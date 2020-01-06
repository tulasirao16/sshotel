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
var SupportDAO = require('../daos/SupportDAO');


// --- Begin: EU-UserSupportService
module.exports = {
    createSupportData: function (reqBody, callback) {
        if (!reqBody.user) {
            SupportDAO.getEuDetails(reqBody, function (resObj) {
                let supportObj = createEUTicketData(reqBody, resObj);
                var euSupportObj = new AD_Tickets(supportObj);
                SupportDAO.createSupportData(euSupportObj, reqBody, function (resObj) {
                    callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
                });
            });
        } else {
            SupportDAO.getSpDetails(reqBody, function (resObj) {
                let supportObj = createSPTicketData(reqBody, resObj);
                var spSupportObj = new AD_Tickets(supportObj);
                SupportDAO.createTicketData(spSupportObj, reqBody, function (resObj) {
                    callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
                });
            });
        }

    }
};

/**
* @param {object} reqBody object
* @param {object} currentUTC object
* @return {object}
*/
function createEUTicketData(reqBody, resObj) {
    let euData = resObj.result
    var currentUTC = CommonService.currentUTCObj();
    let supportObj = {
        euUserId: euData && euData._id ? euData._id : '',
        euName: reqBody.name,
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
        createdBy: 'superadmin',
        createdAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedBy: 'superadmin',
        updatedOn: currentUTC.currentUTCDateTimeString,
    };
    return supportObj;
}


/**
* @param {object} reqBody object
* @param {object} currentUTC object
* @return {object}
*/
function createSPTicketData(reqBody, resObj) {
    let spData = resObj.result
    var currentUTC = CommonService.currentUTCObj();
    let supportObj = {
        spServiceProviderId: spData && spData.spServiceProviderId ? spData.spServiceProviderId : '',
        spServiceProvider: spData && spData.spServiceProvider ? spData.spServiceProvider : '',
        spUserId: spData && spData._id ? spData._id : '',
        spName: reqBody.name,
        ticketTitle: reqBody.ticketTitle,
        ticketTag: reqBody.ticketTag,
        reqMobileNumber: reqBody.reqMobileNumber,
        reqEmail: reqBody.reqEmail,
        ticketDescription: reqBody.ticketDescription,
        ticketStatus: 'New',
        assignStatus: 'Unassigned',
        ticketGroup: 'Host Service',
        ticketPriority: 'Medium',
        ticketNumType: reqBody.ticketNumType,
        createdBy: 'superadmin',
        createdAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedBy: 'superadmin',
        updatedOn: currentUTC.currentUTCDateTimeString,
    };
    return supportObj;
}

// --- End: EU-UserSupportService
