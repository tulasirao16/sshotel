/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var EU_Support = require('../models/EU-Support');
var AD_Tickets = require('../models/AD-Tickets');
var AD_TicketsLifeCycle = require('../models/AD-TicketsLifeCycle')

// --- Begining of SP-SupportDAO
module.exports = {
    getSPSupportData: function (pageNum, searchString, tokenDecodedData, callback) {
        var query = {
            spServiceProviderId: tokenDecodedData.uspid,
            isDeleted: false,
            '$or': [
                { ticketTitle: { $regex: searchString, $options: 'i' } },
                { ticketDescription: { $regex: searchString, $options: 'i' } },
                { ticketTag: { $regex: searchString, $options: 'i' } },
                { ticketStatus: { $regex: searchString, $options: 'i' } },
                { ticketNumber: { $regex: searchString, $options: 'i' } },
                { ticketNumType: { $regex: searchString, $options: 'i' } },
                { adTicketId: { $regex: searchString, $options: 'i' } } 
            ]
        };
        AD_Tickets.find(query)
            .populate('spUserId')
            .skip((pageNum - 1) * 10)
            .limit(10).sort({ 'createdAt': -1 })
            .exec(function (error, resultArray) {
                if (error) {
                    logger.error('There was an Un-konwn Error occured in daos/SP-SupportDAO.js,',
                        ' at getSPSupportData:', error);
                    callback({ httpCode: 500, statusCode: '9999', result: {} });
                } else if (resultArray && resultArray.length > 0) {
                    AD_Tickets.find(query).exec(function (errorCount, resultCount) {
                        if (errorCount) {
                            logger.error('There was an Un-known Error occured in daos/SP-UsersDAO.js, at getSPSupportData:', errorCount);
                            var resultObj = { totalDocs: resultArray.length, supportData: resultArray };
                            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                        } else if (resultCount) {
                            var resultObj = { totalDocs: resultCount.length, supportData: resultArray };
                            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                        } else {
                            var resultObj = { totalDocs: resultArray.length, supportData: resultArray };
                            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                        }
                    });
                } else {
                    callback({ httpCode: 400, statusCode: '9997', result: {} });
                }
            });
    },

    createSPSupportData: function (spSupportObj, reqBody, tokenDecodedData, callback) {
        spSupportObj.save(function (error, resObj) {
            if (error) {
                logger.error('There was an Un-konwn Error occured in daos/SP-SupportDAO.js,' +
                    ' at createSPSupportData:', error);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj && resObj._id) {
                spTicketLifeCycle(reqBody, resObj, function (ticketObj) {
                })
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9993', result: {} });
            }
        })
    }
};
// --- Ending of SP-SupportDAO


/**
 * @param {object} body object
 * @param {function} callback is a callback function
 */
function spTicketLifeCycle(reqBody, resObj, callback) {
    var currentUTC = CommonService.currentUTCObj();
    let spCreateticketLifeCycleData = {
        adTicketId: resObj._id,
        spServiceProviderId: resObj._id,
        spServiceProvider: resObj.spServiceProvider,
        reqMobileNumber: reqBody.reqMobileNumber,
        reqEmail: reqBody.reqEmail,
        spName: resObj.spName,
        ticketNumType: resObj.ticketNumType,
        ticketTitle: reqBody.ticketTitle,
        ticketDescription: reqBody.ticketDescription,
        ticketNumber: resObj.ticketNumber,
        ticketStatus: 'New',
        assignStatus: 'Unassigned',
        ticketGroup: 'Host Service',
        ticketPriority: 'Medium',
        ticketTag: reqBody.ticketTag,
        createdAt: currentUTC.currentUTCDateTimeNumber,
        createdBy: 'superadmin',
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
    }
    let spCreateTicketObj = new AD_TicketsLifeCycle(spCreateticketLifeCycleData)
    spCreateTicketObj.save(function (error, TicketLifeCycleresObj) {
        if (error) {
            callback({ httpCode: 400, statusCode: '9999', result: {} });
        } else if (TicketLifeCycleresObj && TicketLifeCycleresObj._id) {
            callback({ httpCode: 200, statusCode: '0000', result: TicketLifeCycleresObj })
        } else {
            callback({ httpCode: 400, statusCode: '9999', result: {} });
        }
    })
}