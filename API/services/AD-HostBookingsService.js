/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var CommonService = require('./CommonService');
var moment = require('moment');
var AD_HostBookingsDAO = require('../daos/AD-HostBookingsDAO');
var EU_BookingLifeCycle = require('../models/EU-BookingLifeCycle');
var config = require('config');

// --- Begin: AD-HostsBookingsService
module.exports = {

    // --- Begin: getRefundAmountBooking
    getRefundAmountBooking: function (bookingId, checkInDate, tokenDecodedData, callback) {
        var checkIn = moment.utc(checkInDate);
        var fromNow = moment();
        var duration = moment.duration(checkIn.diff(fromNow));
        var hours = duration.asHours();
        var currentUTC = CommonService.currentUTCObj();
    if (bookingId && hours) {
        handleRefund(bookingId, hours, tokenDecodedData, function (resObj) {
            if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: '0000', result: resObj })
            } else if (resObj.statusCode === '7777') {
                callback({ httpCode: 400, statusCode: '7777', result: {} })
            } else {
                callback({ httpCode: 400, statusCode: '8888', result: {} })
            }
        })
    }
    else {
        callback({ httpCode: 400, statusCode: '9999', result: {} })
    }
},

    // --- End: getRefundAmountBooking
    // --- Begin: confirmCancelBooking

    confirmCancelBooking: function (reqBody, tokenDecodedData, callback) {
        var currentUTC = CommonService.currentUTCObj();
        var cancelBookingObj = reqBody.statusCode == '0000' || reqBody.statusCode == '8888' 
        ?  {
              appRefundAmount: reqBody.appRefundAmount ,
              spRefundAmount: reqBody.spRefundAmount,
              totalRefundAmount: reqBody.totalRefundAmount,
              bookingStatus: 'Cancelled',
              updatedAt: currentUTC.currentUTCDateTimeNumber,
              updatedBy: 'superadmin',
              updatedOn: currentUTC.currentUTCDateTimeString
           }
        :  {
            bookingStatus: 'Cancelled',
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedBy: 'superadmin',
            updatedOn: currentUTC.currentUTCDateTimeString
        }
        AD_HostBookingsDAO.confirmCancelBooking(reqBody, cancelBookingObj, tokenDecodedData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        })
    },
    // --- End: confirmCancelBooking

    // --- Begin: putEndUserBooking
    putEndUserBooking: function (reqBody, tokenDecodedData, callback) {
        var currentUTC = CommonService.currentUTCObj();
        let dt = moment(reqBody.checkInDate, 'YYYY-MM-DD HH:mm:ss')
        let dateName = dt.format('dddd')
        let Weekday = dateName === 'Saturday' || dateName === 'Sunday' ? 'Weekend' : 'Weekday'
        const dayType = Weekday === 'Weekday' ? true : false
        const propertyInfoPricing = reqBody.pricing
        if (reqBody.bookingType === 'Days') {
            putEndUserDaysBookingData(reqBody, dayType, propertyInfoPricing, tokenDecodedData, currentUTC, function(resObj) {
                callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
                });
        } else {
            putEndUserHourlyBookingData(reqBody, dayType, propertyInfoPricing, tokenDecodedData, currentUTC, function(resObj) {
                callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
            })
        }
    },
    // --- End: putEndUserBooking

    // --- Begin: getADBookingData
    getADBookingData: function (recordId, tokendecodeddata, callback) {
        AD_HostBookingsDAO.getADBookingData(recordId, tokendecodeddata, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    // --- End: getADBookingData

    // --- Begin getADHostBookingsList:
    getADHostBookingsList: function (spid, pageNumber, searchString, tokendecodedData, callback) {
        AD_HostBookingsDAO.getADHostBookingsList(spid, pageNumber, searchString, tokendecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // --- End getADHostBookingsList:

    // --- Begin getADHostBookings:
    getADHostBookings: function (spid, recordId, pageNumber, searchString, tokendecodedData, callback) {
        AD_HostBookingsDAO.getADHostBookings(spid, recordId, pageNumber, searchString, tokendecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // --- End getADHostBookings:
}
// --- End: AD-HostsBookingsService

/**
 * @param {string} bookingId string
 * @param {number} hours string
 * @param {function} callback is a callback function

 */
function handleRefund(bookingId, hours, tokendecodeddata, callback) {
    var RefundAmount = 0;
    AD_HostBookingsDAO.getSpPropertyInfo(bookingId, function (error, resObj) {
        let spPropertyInfo = resObj.result.spPropertyInfoId;
        if (resObj.statusCode === '0000') {
if (resObj.result.paymentStatus == 'Pending') {
    callback({ httpCode: 400, statusCode: '7777', result: {} })
} else {
    let appCharges = Math.ceil((resObj.result.totalPrice) * (config.pgcInPercent / 100))
    let afterAppChargesTotal = (resObj.result.totalPrice) - (appCharges)
    if (hours >= spPropertyInfo.pricing.fullRefundCancelTime) {
        let RefundAmount = {
            'appRefundAmount': (afterAppChargesTotal) - (resObj.result.spTotalAmount),
            'spRefundAmount': resObj.result.spTotalAmount,
            'totalRefundAmount': Math.floor((resObj.result.totalPrice) - (appCharges))
        }
        callback({ httpCode: 200, statusCode: '0000', result: RefundAmount })
    } else if (hours >= spPropertyInfo.pricing.refundCancelTime && hours < spPropertyInfo.pricing.fullRefundCancelTime) {
        let spRefundAmount = Math.floor((resObj.result.spTotalAmount) * (spPropertyInfo.pricing.refundCancelPercentage / 100))
        let totalRefundAmount = Math.floor(((resObj.result.totalPrice) - (appCharges)) * (spPropertyInfo.pricing.refundCancelPercentage / 100))
        let RefundAmount = {
            'appRefundAmount': (totalRefundAmount) - (spRefundAmount),
            'spRefundAmount': spRefundAmount,
            'totalRefundAmount': totalRefundAmount
        }
        callback({ httpCode: 200, statusCode: '0000', result: RefundAmount })
    } else if (hours < spPropertyInfo.pricing.refundCancelTime) {
        callback({ httpCode: 400, statusCode: '8888', result: {} })
    } else {
        callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
    }
}
} else {
callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
}

})
}


/**
 * @param {object} reqBody object
 * @param {object} propertyInfoPricing object
 * @param {boolean} dayType boolean
 * @return {object} currentUTC object
 * @param {function} callback is a callback function
 */

function putEndUserDaysBookingData(reqBody, dayType, propertyInfoPricing, tokenDecodedData, currentUTC, callback) {
    var putBookingObj = {
        euName: reqBody.euName,
        euMobileNumber: reqBody.euMobileNumber,
        noOfAdults: reqBody.noOfAdults,
        noOfChilds: parseInt(reqBody.noOfChilds),
        noOfRooms: reqBody.noOfRooms,
        totalDays: reqBody.totalDays,
        // totalHours: reqBody.totalHours,
        checkInDate: reqBody.checkInDate,
        checkInDateNumber: moment(reqBody.checkInDate, 'YYYY-MM-DD HH:mm').valueOf(),
        checkOutDate: reqBody.checkOutDate,
        checkOutDateNumber: moment(reqBody.checkOutDate, 'YYYY-MM-DD HH:mm').valueOf(),
        bookingStatus: reqBody.bookingStatus,
        bookingType: reqBody.bookingType,
        paymentMode: reqBody.paymentMode === 'Please Select' ? '' : reqBody.paymentMode,
        appAmount: ((reqBody.totalDays) * (dayType ? propertyInfoPricing.appCharges : propertyInfoPricing.weekEndAppCharges)) * reqBody.noOfRooms,
        appTotalAmount: ((reqBody.totalDays) * (dayType ? propertyInfoPricing.appCharges : propertyInfoPricing.weekEndAppCharges)) * reqBody.noOfRooms,
        spAmount: ((reqBody.totalDays) * (dayType ? propertyInfoPricing.spAmount : propertyInfoPricing.weekEndSpAmount)) * reqBody.noOfRooms,
        spTotalAmount: ((reqBody.totalDays) * (dayType ? propertyInfoPricing.spAmount : propertyInfoPricing.weekEndSpAmount)) * reqBody.noOfRooms,
        grandTotal: ((reqBody.totalDays) * (dayType ? propertyInfoPricing.grandTotalPrice : propertyInfoPricing.weekEndGrandTotalPrice)) * reqBody.noOfRooms,
        totalPrice: ((reqBody.totalDays) * (dayType ? propertyInfoPricing.totalPrice : propertyInfoPricing.weekEndTotalPrice)) * reqBody.noOfRooms,
        onlineCharges: (((reqBody.totalDays) * (dayType ? propertyInfoPricing.totalPrice : propertyInfoPricing.weekEndTotalPrice)) - ((reqBody.totalDays) * (dayType ? propertyInfoPricing.grandTotalPrice : propertyInfoPricing.weekEndGrandTotalPrice))) * reqBody.noOfRooms,
        paymentStatus: reqBody.paymentStatus,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedBy: 'superadmin',
        updatedOn: currentUTC.currentUTCDateTimeString
    }
    AD_HostBookingsDAO.putEndUserBookingData(reqBody, putBookingObj, tokenDecodedData, function (resObj) {
        if (resObj && resObj.result._id) {
            putEndUserBookingLifeCycle(resObj, reqBody.lifeCyclebookingStatus, tokenDecodedData, currentUTC, function(lifeCycleResObj) {})
        }
        callback(resObj);
    });
}

/**
 * @param {object} reqBody object
 * @param {object} propertyInfoPricing object
 * @param {boolean} dayType boolean
 * @return {object} currentUTC object
 * @param {function} callback is a callback function
 */

function putEndUserHourlyBookingData(reqBody, dayType, propertyInfoPricing, tokenDecodedData, currentUTC, callback) {
    const minAppAmountWeekday = reqBody.hours == 5 ? propertyInfoPricing.minBaseAppCharges : (reqBody.hours == 11 ? propertyInfoPricing.minBaseAppCharges2 : 0)
    const minAppAmountWeekend = reqBody.hours == 5 ? propertyInfoPricing.weekEndMinBaseAppCharges : (reqBody.hours == 11 ? propertyInfoPricing.weekEndMinBaseAppCharges2 : 0)
    const minSpAmountWeekday = reqBody.hours == 5 ? propertyInfoPricing.minBaseSpAmount : (reqBody.hours == 11 ? propertyInfoPricing.minBaseSpAmount2 : 0)
    const minSpAmountWeekend = reqBody.hours == 5 ? propertyInfoPricing.weekEndMinBaseSpAmount : (reqBody.hours == 11 ?  propertyInfoPricing.weekEndMinBaseSpAmount2 : 0)
    const minGrandTotalWeekday = reqBody.hours == 5 ? propertyInfoPricing.minBaseGrandTotalPrice : (reqBody.hours == 11 ?  propertyInfoPricing.minBaseGrandTotalPrice2 : 0)
    const minGrandTotalWeekend = reqBody.hours == 5 ? propertyInfoPricing.weekEndMinBaseGrandTotalPrice : (reqBody.hours == 11 ?  propertyInfoPricing.weekEndMinBaseGrandTotalPrice2 : 0)
    const minTotalPriceWeekday = reqBody.hours == 5 ? propertyInfoPricing.minBaseTotalPrice : (reqBody.hours == 11 ?  propertyInfoPricing.minBaseTotalPrice2 : 0)
    const minTotalPriceWeekend = reqBody.hours == 5 ? propertyInfoPricing.weekEndMinBaseTotalPrice : (reqBody.hours == 11 ?  propertyInfoPricing.weekEndMinBaseTotalPrice2 : 0)
    const noOfDays = parseInt(reqBody.totalDays)
        var putBookingObj = {
            euName: reqBody.euName,
            euMobileNumber: reqBody.euMobileNumber,
            noOfAdults: reqBody.noOfAdults,
            noOfChilds: parseInt(reqBody.noOfChilds),
            noOfRooms: reqBody.noOfRooms,
            totalNights: noOfDays,
            totalDays: noOfDays,
            totalHours: reqBody.hours,
            checkInDate: reqBody.checkInDate,
            checkInDateNumber: moment(reqBody.checkInDate, 'YYYY-MM-DD HH:mm').valueOf(),
            checkOutDate: reqBody.checkOutDate,
            checkOutDateNumber: moment(reqBody.checkOutDate, 'YYYY-MM-DD HH:mm').valueOf(),
            bookingStatus: reqBody.bookingStatus,
            bookingType: reqBody.bookingType,
            paymentMode: reqBody.paymentMode === 'Please Select' ? '' : reqBody.paymentMode,
            appAmount: ((noOfDays) * (dayType ? propertyInfoPricing.appCharges : propertyInfoPricing.weekEndAppCharges) + (dayType ? minAppAmountWeekday : minAppAmountWeekend)) * reqBody.noOfRooms,
            appTotalAmount: ((noOfDays) * (dayType ? propertyInfoPricing.appCharges : propertyInfoPricing.weekEndAppCharges) + (dayType ? minAppAmountWeekday : minAppAmountWeekend)) * reqBody.noOfRooms,
            spAmount: ((noOfDays) * (dayType ? propertyInfoPricing.spAmount : propertyInfoPricing.weekEndSpAmount) + (dayType ? minSpAmountWeekday : minSpAmountWeekend)) * reqBody.noOfRooms,
            spTotalAmount: ((noOfDays) * (dayType ? propertyInfoPricing.spAmount : propertyInfoPricing.weekEndSpAmount) + (dayType ? minSpAmountWeekday : minSpAmountWeekend)) * reqBody.noOfRooms,
            grandTotal: ((noOfDays) * (dayType ? propertyInfoPricing.grandTotalPrice : propertyInfoPricing.weekEndGrandTotalPrice) + (dayType ? minGrandTotalWeekday : minGrandTotalWeekend)) * reqBody.noOfRooms,
            totalPrice: ((noOfDays) * (dayType ? propertyInfoPricing.totalPrice : propertyInfoPricing.weekEndTotalPrice) + (dayType ? minTotalPriceWeekday : minTotalPriceWeekend)) * reqBody.noOfRooms,
            onlineCharges: (((noOfDays) * (dayType ? propertyInfoPricing.totalPrice : propertyInfoPricing.weekEndTotalPrice) + (dayType ? minTotalPriceWeekday : minTotalPriceWeekend)) - ((noOfDays) * (dayType ? propertyInfoPricing.grandTotalPrice : propertyInfoPricing.weekEndGrandTotalPrice) + (dayType ? minGrandTotalWeekday : minGrandTotalWeekend))) * reqBody.noOfRooms,
            paymentStatus: reqBody.paymentStatus,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedBy: 'superadmin',
            updatedOn: currentUTC.currentUTCDateTimeString
        }
        AD_HostBookingsDAO.putEndUserBookingData(reqBody, putBookingObj, tokenDecodedData, function (resObj) {
            if (resObj && resObj.result._id) {
                putEndUserBookingLifeCycle(resObj, reqBody.lifeCyclebookingStatus, tokenDecodedData, currentUTC, function(lifeCycleResObj) {})
            }
            callback(resObj);
        });
}

/**
 * @param {object} resObj object
 * @param {object} tokenDecodedData object
 * @return {object} currentUTC object
 * @param {function} callback is a callback function
 */

function putEndUserBookingLifeCycle(resObj, bookingOldStatus, tokenDecodedData, currentUTC, callback) { 
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
        bookingOldStatus: bookingOldStatus,
        bookingNewStatus: resObj.result.bookingStatus,

        isDeleted: false,
        createdBy: 'superadmin',
        createdAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
    }
    var bookingLifeCycleObj = new EU_BookingLifeCycle(bookingLifeCycle);
    AD_HostBookingsDAO.postEndUserBookingLifeCycle(bookingLifeCycleObj, resObj.result.bookingCode, tokenDecodedData, function (resObj) {});
  }
   /**
 * @param {object} resObj object
 * @param {object} tokenDecodedData object
 * @return {object} currentUTC object
 * @param {function} callback is a callback function
 */

function postEndUserBookingLifeCycle(resObj, tokenDecodedData, currentUTC, callback) { 
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
        bookingNewStatus: resObj.result.bookingStatus,
  
        isDeleted: false,
        createdBy: 'superadmin',
        createdAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
    }
    var bookingLifeCycleObj = new EU_BookingLifeCycle(bookingLifeCycle);
    AD_HostBookingsDAO.postEndUserBookingLifeCycle(bookingLifeCycleObj, resObj.result.bookingCode, tokenDecodedData, function (resObj) {
    });
  }
