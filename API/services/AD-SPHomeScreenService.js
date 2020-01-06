
/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var randomNumber = require('random-number');
var CommonService = require('../services/CommonService');
var AD_SPHomeScreenDAO = require('../daos/AD-SPHomeScreenDAO');
var moment = require('moment');
var EU_Bookings = require('../models/EU-Bookings')

// --- Begin: AD_HomeScreenService
module.exports = {
    // --- Begin getADHomeScreenUsersCount:
    getSPHomeScreenUsersCount: function (hostId, tokendecodedData, callback) {
        var utcMoment = moment();
        // var istMoment = utcMoment.add(5, 'hours'). add(30, 'minutes');
        var endStartDate = utcMoment.endOf('day');
        var endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
        var endUTCDateTimeNumber = moment(endStartTime).valueOf();
        var userStartDate = utcMoment.startOf('day');
        var userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
        var startUTCDateTimeNumber = moment(userStartTime).valueOf();
        var query = {
            getSPBookingStatusCountsQuery: {
                isDeleted: false, spServiceProviderId: hostId,
            },
            getSPUsersMessagesCountsQuery: {
                isDeleted: false, spServiceProviderId: hostId, spReadStatus: 'Unread',
            },
            getSPExpieredBookingsQuery: {
                isDeleted: false, spServiceProviderId: hostId, checkInDateNumber: { $lte: startUTCDateTimeNumber }
            },
        }
        AD_SPHomeScreenDAO.getSPHomeScreenUsersCount(tokendecodedData, query, function (resObj) {
            callback(resObj)
        })
    },
    // --- End getADHomeScreenUsersCount:

    // --- Begin getADBookingsAmountsList:
    getSPBookingsAmountsList: function (hostId, bookingAmountStatus, pageNumber, searchString, tokendecodedData, callback) {
        var istMoment = moment();
        // var istMoment = istMoment.add(5, 'hours'). add(30, 'minutes');
        var endStartDate = istMoment.endOf('day');
        var endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
        var endUTCDateTimeNumber = moment(endStartTime).valueOf();
        var userStartDate = istMoment.startOf('day');
        var userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
        var startUTCDateTimeNumber = moment(userStartTime).valueOf();
        AD_SPHomeScreenDAO.getADSPBookingsAmountsList(hostId, bookingAmountStatus, pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // --- End getADBookingsAmountsList:

}