
/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var randomNumber = require('random-number');
var CommonService = require('../services/CommonService');
var AD_HomeScreenDAO = require('../daos/AD-HomeScreenDAO');
var moment = require('moment');
var EU_Bookings = require('../models/EU-Bookings')

// --- Begin: AD_HomeScreenService
module.exports = {
    // --- Begin getADHomeScreenUsersCount:
    getADHomeScreenUsersCount: function (tokendecodedData, callback) {
        var utcMoment = moment();
        // var istMoment = utcMoment.add(5, 'hours'). add(30, 'minutes');
        var endStartDate = utcMoment.endOf('day');
        var endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
        var endUTCDateTimeNumber = moment(endStartTime).valueOf();
        var userStartDate = utcMoment.startOf('day');
        var userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
        var startUTCDateTimeNumber = moment(userStartTime).valueOf();
        var query = {
            getADUsersCheckInCountQuery: {
                'isDeleted': false,
                '$or': [
                    { 'checkInDateNumber': { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber } },
                    {
                        '$and': [
                            {
                                'updatedAt': { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber },
                                'bookingStatus': 'Checked-In'
                            }
                        ]
                    }
                ]
            },
            getADUsersCheckOutCountQuery: {
                isDeleted: false,
                '$or': [
                    { 'checkOutDateNumber': { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber } },
                    {
                        '$and': [
                            {
                                'updatedAt': { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber },
                                'bookingStatus': 'Checked-Out'
                            }
                        ]
                    }
                ]
            },
            getADUserBlockingDatesCountQuery: {
                isDeleted: false,
                $or: [
                    { blockingFromDateNumber: { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber } },
                    { blockingToDateNumber: { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber } },
                    { blockingFromDateNumber: { $lte: startUTCDateTimeNumber }, blockingToDateNumber: { $gte: startUTCDateTimeNumber } }
                ],
            },
            getADUsersBookingStatusCountsQuery: {
                isDeleted: false, createdAt: { $gte: startUTCDateTimeNumber }
            },
            getADUsersByStatusCountsQuery: {
                isDeleted: false,
            },
            getADUsersBookingAccountsQuery: {
                isDeleted: false, createdAt: { $gte: startUTCDateTimeNumber },
            },
            getADUsersReviewsCountsQuery: {
                isDeleted: false, createdAt: { $gte: startUTCDateTimeNumber },
            },
            getADUsersMessagesCountsQuery: {
                isDeleted: false, spReadStatus: 'Unread', createdAt: { $gte: startUTCDateTimeNumber },
            },
            getADUsersNotificationsCountsQuery: {
                isDeleted: false, status: 'Unread',
            },
            getADUsersPropertiesCountsQuery: {
                isDeleted: false
            },
            getADEndUsersCountsQuery: {
                isDeleted: false,
            },
            getADHostUsersCountsQuery: {
                isDeleted: false,
            },
            getADHostCountsQuery: {
                isDeleted: false,
            },

        }
        AD_HomeScreenDAO.getADHomeScreenUsersCount(tokendecodedData, query, function (resObj) {
            callback(resObj)
        })
    },
    // --- End getADHomeScreenUsersCount:

    // --- Begin getADHomeScreenUsersCountByStatus:
    getADHomeScreenUsersCountByStatus: function (pageNum, status, tokenDecodedData, searchString, callback) {
        AD_HomeScreenDAO.getADHomeScreenUsersCountByStatus(pageNum, status, tokenDecodedData, searchString, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        })
    },
    // --- End getADHomeScreenUsersCountByStatus:

    // --- Begin getADHomeScreenHostUsersCountByStatus:
    getADHomeScreenHostUsersCountByStatus: function (pageNum, status, tokenDecodedData, searchString, callback) {
        AD_HomeScreenDAO.getADHomeScreenHostUsersCountByStatus(pageNum, status, tokenDecodedData, searchString, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        })
    },
    // --- End getADHomeScreenHostUsersCountByStatus:

    // --- Begin getADHomeScreenHostsPropertiesByStatus: Code get Service Provider Properties data
    getADHomeScreenHostsPropertiesByStatus: function (pageNum, Status, searchString, callback) {
        AD_HomeScreenDAO.getADHomeScreenHostsPropertiesByStatus(pageNum, Status, searchString, function (resObj) {
            callback(resObj);
        });
    },
    //--- End getADHomeScreenHostsPropertiesByStatus: Code get Service Provider Properties data

    // --- Begin getADBookingsCountBookingsList:
    getADBookingsCountBookingsList: function (pageNumber, searchString, tokendecodedData, callback) {
        var istMoment = moment();
        // var istMoment = utcMoment.add(5, 'hours'). add(30, 'minutes');
        var endStartDate = istMoment.endOf('day');
        var endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
        var endUTCDateTimeNumber = moment(endStartTime).valueOf();
        var userStartDate = istMoment.startOf('day');
        var userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
        var startUTCDateTimeNumber = moment(userStartTime).valueOf();
        AD_HomeScreenDAO.getADBookingsCountBookingsList(pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // --- End getADBookingsCountBookingsList:

    // --- Begin getADCheckInBookingsList:
    getADCheckInBookingsList: function (pageNumber, searchString, tokendecodedData, callback) {
        var istMoment = moment();
        // var istMoment = istMoment.add(5, 'hours'). add(30, 'minutes');
        var endStartDate = istMoment.endOf('day');
        var endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
        var endUTCDateTimeNumber = moment(endStartTime).valueOf();
        var userStartDate = istMoment.startOf('day');
        var userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
        var startUTCDateTimeNumber = moment(userStartTime).valueOf();
        AD_HomeScreenDAO.getADCheckInBookingsList(pageNumber, searchString, startUTCDateTimeNumber, endUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // --- End getADCheckInBookingsList:

    // --- Begin getADCheckOutBookingsList:
    getADCheckOutBookingsList: function (pageNumber, searchString, tokendecodedData, callback) {
        var istMoment = moment();
        // var istMoment = istMoment.add(5, 'hours'). add(30, 'minutes');
        var endStartDate = istMoment.endOf('day');
        var endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
        var endUTCDateTimeNumber = moment(endStartTime).valueOf();
        var userStartDate = istMoment.startOf('day');
        var userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
        var startUTCDateTimeNumber = moment(userStartTime).valueOf();
        AD_HomeScreenDAO.getADCheckOutBookingsList(pageNumber, searchString, startUTCDateTimeNumber, endUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // --- End getADCheckOutBookingsList:

    // --- Begin getADBookingsAmountsList:
    getADBookingsAmountsList: function (pageNumber, searchString, tokendecodedData, callback) {
        var istMoment = moment();
        // var istMoment = istMoment.add(5, 'hours'). add(30, 'minutes');
        var endStartDate = istMoment.endOf('day');
        var endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
        var endUTCDateTimeNumber = moment(endStartTime).valueOf();
        var userStartDate = istMoment.startOf('day');
        var userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
        var startUTCDateTimeNumber = moment(userStartTime).valueOf();
        AD_HomeScreenDAO.getADBookingsAmountsList(pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
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

    // --- Begin getADBookingsCountCancelledList:
    getADBookingsCountCancelledList: function (pageNumber, searchString, tokendecodedData, callback) {
        var istMoment = moment();
        // var istMoment = istMoment.add(5, 'hours'). add(30, 'minutes');
        var endStartDate = istMoment.endOf('day');
        var endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
        var endUTCDateTimeNumber = moment(endStartTime).valueOf();
        var userStartDate = istMoment.startOf('day');
        var userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
        var startUTCDateTimeNumber = moment(userStartTime).valueOf();
        AD_HomeScreenDAO.getADBookingsCountCancelledList(pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // --- End getADBookingsCountCancelledList:

    // --- Begin getADHomeScreenBlockedDatesList:
    getADHomeScreenBlockedDatesList: function (pageNumber, searchString, tokendecodedData, callback) {
        var istMoment = moment();
        // var istMoment = istMoment.add(5, 'hours'). add(30, 'minutes');
        var endStartDate = istMoment.endOf('day');
        var endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
        var endUTCDateTimeNumber = moment(endStartTime).valueOf();
        var userStartDate = istMoment.startOf('day');
        var userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
        var startUTCDateTimeNumber = moment(userStartTime).valueOf();
        AD_HomeScreenDAO.getADHomeScreenBlockedDatesList(pageNumber, searchString, startUTCDateTimeNumber, endUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    }
    // --- End getADHomeScreenBlockedDatesList:
}