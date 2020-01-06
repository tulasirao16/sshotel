/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('./CommonService');
var moment = require('moment');
var AD_EndUsersBookingsHistoryDAO = require('../daos/AD-EndUsersBookingsHistoryDAO');
var EU_BookingLifeCycle = require('../models/EU-BookingLifeCycle')
// --- Begin: AD-EndUsersBookingsHistoryService
module.exports = {
    // --- Begin: getADEUBookings
    getADEUBookings: function (pageNum, euUserId, bhType, searchString, callback) {
        AD_EndUsersBookingsHistoryDAO.getADEUBookings(pageNum, euUserId, bhType, searchString, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // --- End: getADEUBookings

    // --- Begin: putADEndUserBooking
    putADEndUserBooking: function (reqBody, recordId, tokenDecodedData, callback) {
        var currentUTC = CommonService.currentUTCObj();
        var checkIn = moment.utc(reqBody.checkInDate);
        var checkOut = moment.utc(reqBody.checkOutDate);
        var duration = moment.duration(checkOut.diff(checkIn));
        var hours = duration.asHours();
        let appAmount = reqBody.totalPrice * 0.05;
        var putBookingObj = {
            euName: reqBody.euName,
            euMobileNumber: reqBody.euMobileNumber,
            noOfAdults: reqBody.noOfAdults,
            noOfChilds: parseInt(reqBody.noOfChilds),
            noOfRooms: reqBody.noOfRooms,
            totalDays: reqBody.totalDays,
            totalHours: hours,
            checkInDate: reqBody.checkInDate,
            checkInDateNumber: moment(checkIn, 'YYYY-MM-DD HH:mm').valueOf(),
            checkOutDate: reqBody.checkOutDate,
            checkOutDateNumber: moment(checkOut, 'YYYY-MM-DD HH:mm').valueOf(),
            bookingStatus: reqBody.bookingStatus,
            bookingType: reqBody.bookingType,
            paymentMode: reqBody.paymentMode,
            appAmount: appAmount,
            appTotalAmount: appAmount,
            spAmount: (reqBody.totalPrice - appAmount),
            spTotalAmount: (reqBody.totalPrice - appAmount),
            grandTotal: reqBody.totalPrice,
            totalPrice: reqBody.totalPrice,
            paymentStatus: reqBody.paymentStatus,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedBy: 'superadmin',
            updatedOn: currentUTC.currentUTCDateTimeString
        }
        AD_EndUsersBookingsHistoryDAO.putADEndUserBookingData(reqBody, recordId, putBookingObj, tokenDecodedData, function (resObj) {
            if (resObj && resObj.result._id) {
                var bookingLifeCycle = {
                    bookingId: resObj.result._id,
                    euUserId: resObj.result.euUserId,
                    spServiceProviderId: resObj.result.spServiceProviderId,
                    spLocationId: resObj.result.spLocationId,
                    spPropertyId: resObj.result.spPropertyId,

                    checkInDate: resObj.result.checkInDate,
                    checkInDateNumber: resObj.result.checkInDateNumber,
                    checkOutDate: resObj.result.checkOutDate,
                    checkOutDateNumber: resObj.result.checkOutDateNumber,
                    bookingOldStatus: resObj.lifeCyclebookingStatus ? resObj.lifeCyclebookingStatus : '',
                    bookingNewStatus: resObj.result.bookingStatus,

                    isDeleted: false,
                    createdBy: 'superadmin',
                    createdAt: currentUTC.currentUTCDateTimeNumber,
                    createdOn: currentUTC.currentUTCDateTimeString,
                    updatedBy: 'superadmin',
                    updatedAt: currentUTC.currentUTCDateTimeNumber,
                    updatedOn: currentUTC.currentUTCDateTimeString
                }

            }
            var bookingLifeCycleObj = new EU_BookingLifeCycle(bookingLifeCycle);
            AD_EndUsersBookingsHistoryDAO.postADEndUserBookingLifeCycle(bookingLifeCycleObj, resObj.result.bookingCode, tokenDecodedData, function (resObj) {
            });
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    // --- End: putADEndUserBooking
}
// --- End:AD-EndUsersBookingsHistoryService