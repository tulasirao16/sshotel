/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
var commonService = require('./CommonService');
var EU_BookingsDAO = require('../daos/EU-BookingsHistoryDAO');
var moment = require('moment');
var config = require('config');

// --- Begin:  EndUsers Bookings  Service
module.exports = {

    getEndUsersBookings: function (dataType, searchString, tokendecodeddata, callback) {
        EU_BookingsDAO.getEndUsersBookings(dataType, searchString, tokendecodeddata, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },

    getEUBookings: function (pageNum, status, searchString, tokenDecodedData, callback) {
        EU_BookingsDAO.getEUBookings(pageNum, status, searchString, tokenDecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    getEndUserBookingData: function (recordId, tokendecodeddata, callback) {
      EU_BookingsDAO.getEndUserBookingData(recordId, tokendecodeddata, function (resObj) {
        callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
      });
    },
    cancelEndUsersBookings: function (bookingID, checkInDate, spServiceProviderId, tokendecodeddata, callback) {
        var checkIn = moment.utc(checkInDate);
        var fromNow = moment();
        var duration = moment.duration(checkIn.diff(fromNow));
        var hours = duration.asHours();
        var currentUTC = commonService.currentUTCObj();
        if (spServiceProviderId && hours) {
            handleRefund(spServiceProviderId, hours, bookingID, tokendecodeddata, function (resObj) {
                if (resObj.statusCode === '0000' || resObj.statusCode === '8888' || resObj.statusCode === '7777') {
                    var updateBookingCancelObj = resObj.statusCode === '0000' 
                    ? {
                        appRefundAmount: resObj.result.appRefundAmount,
                        spRefundAmount: resObj.result.spRefundAmount,
                        totalRefundAmount: resObj.result.totalRefundAmount,
                        bookingStatus: 'Cancelled',
                        updatedAt: currentUTC.currentUTCDateTimeNumber,
                        updatedBy: 'superadmin',
                        updatedOn: currentUTC.currentUTCDateTimeString
                      }
                    : {
                        bookingStatus: 'Cancelled',
                        updatedAt: currentUTC.currentUTCDateTimeNumber,
                        updatedBy: 'superadmin',
                        updatedOn: currentUTC.currentUTCDateTimeString
                      }
                EU_BookingsDAO.cancelEndUsersBookings(bookingID, tokendecodeddata, updateBookingCancelObj, function (resObj) {
                  callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
                });
              } else {
                callback({ httpCode: 400, statusCode: '7777', result: {} })
            }
            })
        } else {
            callback({ httpCode: 400, statusCode: '9999', result: {} })
        }
    }
}


/**
 * @param {string} spServiceProviderId string
 * @param {number} hours string
 * @param {function} callback is a callback function

 */
function handleRefund(spServiceProviderId, hours, bookingID, tokendecodeddata, callback) {
    var RefundAmount = 0;
    if (spServiceProviderId && hours) {
        EU_BookingsDAO.getSpPropertyInfo(spServiceProviderId, function (error, resObj) {
            let spPropertyInfo = resObj.result;
            if (resObj.statusCode === '0000') {
                EU_BookingsDAO.getBookinData(bookingID, tokendecodeddata, function (bkResObj) {
                    if (bkResObj.statusCode === '0000') {
                        if (bkResObj.result.paymentStatus == 'Pending') {
                            callback({ httpCode: 400, statusCode: '7777', result: {} })
                        } else {
                            let appCharges = Math.ceil((bkResObj.result.totalPrice) * (config.pgcInPercent / 100))
                            let afterAppChargesTotal = (bkResObj.result.totalPrice) - (appCharges)
                            if (hours >= spPropertyInfo.pricing.fullRefundCancelTime) {
                                let RefundAmount = {
                                    'appRefundAmount': (afterAppChargesTotal) - (bkResObj.result.spTotalAmount),
                                    'spRefundAmount': bkResObj.result.spTotalAmount,
                                    'totalRefundAmount': Math.floor((bkResObj.result.totalPrice) - (appCharges))
                                }
                                callback({ httpCode: 200, statusCode: '0000', result: RefundAmount })
                            } else if (hours >= spPropertyInfo.pricing.refundCancelTime && hours < spPropertyInfo.pricing.fullRefundCancelTime) {
                                let spRefundAmount = Math.floor((bkResObj.result.spTotalAmount) * (spPropertyInfo.pricing.refundCancelPercentage / 100))
                                let totalRefundAmount = Math.floor(((bkResObj.result.totalPrice) - (appCharges)) * (spPropertyInfo.pricing.refundCancelPercentage / 100))
                                let RefundAmount = {
                                    'appRefundAmount': (totalRefundAmount) - (spRefundAmount),
                                    'spRefundAmount':  spRefundAmount,
                                    'totalRefundAmount': totalRefundAmount
                                }
                                callback({ httpCode: 200, statusCode: '0000', result: RefundAmount })
                            } else if(hours < spPropertyInfo.pricing.refundCancelTime) {
                                callback({ httpCode: 400, statusCode: '8888', result: {} })
                            } else {
                                callback({ httpCode: 400, statusCode: '8888', result: {} })
                            }
                        }
                    } else {
                        callback({ httpCode: 400, statusCode: '7777', result: {} })
                    }
                });
            } else {
                callback(error, { httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        })
    } else {
      callback(error, { httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
    }
}