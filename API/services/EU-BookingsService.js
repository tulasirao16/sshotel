/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
var CommonService = require('./CommonService');
var EU_BookingsDAO = require('../daos/EU-BookingsDAO');
var SP_BlockedDatesDAO = require('../daos/SP-BlockedDatesDAO');
var EU_Bookings = require('../models/EU-Bookings');
var moment = require('moment');
var SP_BookingsDAO = require('../daos/SP-BookingsDAO');
var EU_BookingLifeCycle = require('../models/EU-BookingLifeCycle');

// --- Begin:  EndUsers Bookings Ratings Service
module.exports = {
  postEndUserBooking: function(reqBody, tokenDecodedData, res, callback) {
    var currentUTC = CommonService.currentUTCObj();
    EU_BookingsDAO.getPropertyInfo(reqBody.spPropertyInfoId, function(propertyInfoResObj) {
      if (propertyInfoResObj && propertyInfoResObj._id) {
        if (reqBody.bookingType == 'Days') {
          setEndUserDaysBookingData(reqBody, tokenDecodedData, currentUTC, propertyInfoResObj, function(resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
          });
        } else {
          setEndUserHourlyBookingData(reqBody, tokenDecodedData, currentUTC, propertyInfoResObj, function(resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
          });
        }
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} })
      }
    })
    // setEndUserBookingData(reqBody, tokenDecodedData, currentUTC, function(resObj) {
    //     callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    //   });
  },
  getSpPropertyAmenities: function(propertyId, callback) {
    EU_BookingsDAO.getSpPropertyAmenities(propertyId, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  getSpPropertyServices: function(propertyId, callback) {
    EU_BookingsDAO.getSpPropertyServices(propertyId, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  getSpRoomsCount: function(reqObj, callback) {
    var fromDate = moment.utc(reqObj.checkInDate).format('YYYY-MM-DD');
    var fromNumber = moment(fromDate, 'YYYY-MM-DD').valueOf();
    var toDate = moment.utc(reqObj.checkOutDate).format('YYYY-MM-DD');
    var toNumber = moment(toDate, 'YYYY-MM-DD').valueOf();
    var query = {
      'spServiceProviderId': reqObj.spServiceProviderId,
      'propertyId': reqObj.propertyId,
      '$or': [
        { 'blockingFromDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
        { 'blockingToDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
        { '$and': [{ 'blockingFromDateNumber': { '$lte': fromNumber } }, { 'blockingToDateNumber': { '$gte': toNumber } }] }
      ],
      'isDeleted': false
    };
    SP_BlockedDatesDAO.checkBlockedDatesIsAvailable(query, function(availResObj) {
      if(availResObj.statusCode == '1013') {
        callback({httpCode: '400', statusCode: '1017', result: availResObj.result});
      } else if(availResObj.statusCode == '9997') {
        EU_BookingsDAO.getSpRoomsCount(reqObj, function(resObj) {
          callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
      } else {
        callback({ httpCode: availResObj.httpCode, statusCode: availResObj.statusCode, result: availResObj.result });
      }
    });
  },
  getSpPropertyDocs: function(propertyId, callback) {
    EU_BookingsDAO.getSpPropertyDocs(propertyId, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  sendReminderNotificationBeforeDayToEndUser: function(callback) {
    var addDay = moment().add(1, 'days').format('YYYY-MM-DD');
    var addDayNumber = moment(addDay, 'YYYY-MM-DD').valueOf();

    var dayQuery = {
      'checkInDateNumber': {'$gte': addDayNumber, '$lte': addDayNumber},
      'bookingStatus': 'Booked',
      'isDeleted': false
    };
    EU_BookingsDAO.sendReminderNotificationBeforeDayToEndUser(dayQuery, function(resObj) {
    });
  },

  sendReminderNotificationBeforeWeekToEndUser: function(callback) {
    var weekday = moment.utc().add(7, 'days').format('YYYY-MM-DD');
    var weekdayNumber = moment(weekday, 'YYYY-MM-DD').valueOf();
    var weekQuery = {
      'checkInDateNumber': {'$gte': weekdayNumber, '$lte': weekdayNumber},
      'bookingStatus': 'Booked',
      'isDeleted': false
    };
    EU_BookingsDAO.sendReminderNotificationBeforeWeekToEndUser(weekQuery, function(resObj) {
    });
  }
}

/**
 * @param {object} reqObj object
 * @param {object} tokenDecodedData object
 * @return {object} currentUTC object
 * @param {function} callback is a callback function
 */

function setEndUserHourlyBookingData(reqObj, tokenDecodedData, currentUTC, propertyInfo, callback) {
  var bookingSecureCode = CommonService.orderSecureCodeGeneration(3, '0123456789') + CommonService.orderSecureCodeGeneration(7, '0123456789ACEGIKM0123456789') + CommonService.orderSecureCodeGeneration(7, '0123456789BDFHJLN0123456789');
  var bookingCode = 'BNB' + bookingSecureCode;
  var checkIn = moment.utc(reqObj.checkInDate);
  var checkOut = moment.utc(reqObj.checkOutDate);
  // var duration = moment.duration(checkOut.diff(checkIn));
  // var hours = duration.asHours();
  const dayType = reqObj.dateType === 'Weekday' ? true : false
  const propertyInfoPricing = JSON.parse((JSON.stringify(propertyInfo.pricing)))
  const minAppAmountWeekday = reqObj.totalHours == 5 ? propertyInfoPricing.minBaseAppCharges : (reqObj.totalHours == 11 ? propertyInfoPricing.minBaseAppCharges2 : 0)
  const minAppAmountWeekend = reqObj.totalHours == 5 ? propertyInfoPricing.weekEndMinBaseAppCharges : (reqObj.totalHours == 11 ? propertyInfoPricing.weekEndMinBaseAppCharges2 : 0)
  const minSpAmountWeekday = reqObj.totalHours == 5 ? propertyInfoPricing.minBaseSpAmount : (reqObj.totalHours == 11 ? propertyInfoPricing.minBaseSpAmount2 : 0)
  const minSpAmountWeekend = reqObj.totalHours == 5 ? propertyInfoPricing.weekEndMinBaseSpAmount : (reqObj.totalHours == 11 ?  propertyInfoPricing.weekEndMinBaseSpAmount2 : 0)
  const minGrandTotalWeekday = reqObj.totalHours == 5 ? propertyInfoPricing.minBaseGrandTotalPrice : (reqObj.totalHours == 11 ?  propertyInfoPricing.minBaseGrandTotalPrice2 : 0)
  const minGrandTotalWeekend = reqObj.totalHours == 5 ? propertyInfoPricing.weekEndMinBaseGrandTotalPrice : (reqObj.totalHours == 11 ?  propertyInfoPricing.weekEndMinBaseGrandTotalPrice2 : 0)
  const minTotalPriceWeekday = reqObj.totalHours == 5 ? propertyInfoPricing.minBaseTotalPrice : (reqObj.totalHours == 11 ?  propertyInfoPricing.minBaseTotalPrice2 : 0)
  const minTotalPriceWeekend = reqObj.totalHours == 5 ? propertyInfoPricing.weekEndMinBaseTotalPrice : (reqObj.totalHours == 11 ?  propertyInfoPricing.weekEndMinBaseTotalPrice2 : 0)
  var bookingObj = {
    euUserId: tokenDecodedData.iss,
    spServiceProviderId: reqObj.spServiceProviderId,
    spServiceProvider: reqObj.spServiceProvider,
    spLocationId: reqObj.spLocationId,
    spLocationObj: {
      contactPerson: reqObj.contactPerson,
      mobileNumber: reqObj.mobileNumber,
      alternateMobileNumber: reqObj.alternateMobileNumber ? reqObj.alternateMobileNumber : '',
      email: reqObj.spemail,
      address: reqObj.address,
      landmark: reqObj.landmark ? reqObj.landmark : '',
      area: reqObj.area,
      areaLocality: reqObj.areaLocality ? reqObj.areaLocality : '' ,
      zip: reqObj.zip,
      city: reqObj.city,
      state: reqObj.state,
      country: reqObj.country,
      latitude: reqObj.latitude,
      longitude: reqObj.longitude
    },
    spPropertyId: reqObj.spPropertyId,
    spPropertyTitle: reqObj.spPropertyTitle,
    spPropertyType: reqObj.spPropertyType,
    spPropertyInfoId: reqObj.spPropertyInfoId,
    euName: reqObj.name ? reqObj.name : reqObj.firstName + ' ' + reqObj.lastName,
    euMobileNumber: reqObj.contactEuNumber,
    euEmail: tokenDecodedData.ue,
    bookingCode: bookingCode,
    bookingSecureCode: bookingSecureCode,
    bookingSecureCodeAttempts: 5,
    bookingType: reqObj.bookingType,
    checkInDate: reqObj.checkInDate,
    checkInDateNumber: checkIn.valueOf(),
    checkOutDate: reqObj.checkOutDate,
    checkOutDateNumber: checkOut.valueOf(),
    noOfRooms: reqObj.noOfRooms,
    noOfAdults: reqObj.noOfAdults,
    noOfChilds: reqObj.noOfChilds,
    totalHours: reqObj.totalHours,
    totalDays: reqObj.noOfDays,
    totalNights: reqObj.noOfDays,
    appAmount: ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.appCharges : propertyInfoPricing.weekEndAppCharges) + (dayType ? minAppAmountWeekday : minAppAmountWeekend)) * reqObj.noOfRooms,
    appTotalAmount: ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.appCharges : propertyInfoPricing.weekEndAppCharges) + (dayType ? minAppAmountWeekday : minAppAmountWeekend)) * reqObj.noOfRooms,
    spAmount: ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.spAmount : propertyInfoPricing.weekEndSpAmount) + (dayType ? minSpAmountWeekday : minSpAmountWeekend)) * reqObj.noOfRooms,
    spTotalAmount: ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.spAmount : propertyInfoPricing.weekEndSpAmount) + (dayType ? minSpAmountWeekday : minSpAmountWeekend)) * reqObj.noOfRooms,
    grandTotal: ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.grandTotalPrice : propertyInfoPricing.weekEndGrandTotalPrice) + (dayType ? minGrandTotalWeekday : minGrandTotalWeekend)) * reqObj.noOfRooms,
    totalPrice: ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.totalPrice : propertyInfoPricing.weekEndTotalPrice) + (dayType ? minTotalPriceWeekday : minTotalPriceWeekend)) * reqObj.noOfRooms,
    onlineCharges: (((reqObj.noOfDays) * (dayType ? propertyInfoPricing.totalPrice : propertyInfoPricing.weekEndTotalPrice) + (dayType ? minTotalPriceWeekday : minTotalPriceWeekend)) - ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.grandTotalPrice : propertyInfoPricing.weekEndGrandTotalPrice) + (dayType ? minGrandTotalWeekday : minGrandTotalWeekend))) * reqObj.noOfRooms,
    spOtherCharges: 0,
    spDiscount: 0,
    bookingStatus: 'Booked',
    paymentStatus: 'Pending',
    isDeleted: false,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdBy: 'superadmin',
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedBy: 'superadmin',
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  EU_BookingsDAO.postEndUserBooking(bookingObj, tokenDecodedData, function(resObj) {
    callback(resObj);
    if (resObj && resObj.result._id) {
      postEndUserBookingLifeCycle(resObj, tokenDecodedData, currentUTC, function(resObj) {});
    }
  });
}

/**
 * @param {object} reqObj object
 * @param {object} tokenDecodedData object
 * @return {object} currentUTC object
 * @param {function} callback is a callback function
 */

function setEndUserDaysBookingData(reqObj, tokenDecodedData, currentUTC, propertyInfo, callback) {
  var bookingSecureCode = CommonService.orderSecureCodeGeneration(3, '0123456789') + CommonService.orderSecureCodeGeneration(7, '0123456789ACEGIKM0123456789') + CommonService.orderSecureCodeGeneration(7, '0123456789BDFHJLN0123456789');
  var bookingCode = 'BNB' + bookingSecureCode;
  var checkIn = moment.utc(reqObj.checkInDate);
  var checkOut = moment.utc(reqObj.checkOutDate);
  var duration = moment.duration(checkOut.diff(checkIn));
  var hours = duration.asHours();
  const dayType = reqObj.dateType === 'Weekday' ? true : false
  const propertyInfoPricing = JSON.parse((JSON.stringify(propertyInfo.pricing)))
  var bookingObj = {
    euUserId: tokenDecodedData.iss,
    spServiceProviderId: reqObj.spServiceProviderId,
    spServiceProvider: reqObj.spServiceProvider,
    spLocationId: reqObj.spLocationId,
    spLocationObj: {
      contactPerson: reqObj.contactPerson,
      mobileNumber: reqObj.mobileNumber,
      alternateMobileNumber: reqObj.alternateMobileNumber ? reqObj.alternateMobileNumber : '',
      email: reqObj.spemail,
      address: reqObj.address,
      landmark: reqObj.landmark ? reqObj.landmark : '',
      area: reqObj.area,
      areaLocality: reqObj.areaLocality ? reqObj.areaLocality : '' ,
      zip: reqObj.zip,
      city: reqObj.city,
      state: reqObj.state,
      country: reqObj.country,
      latitude: reqObj.latitude,
      longitude: reqObj.longitude
    },
    spPropertyId: reqObj.spPropertyId,
    spPropertyTitle: reqObj.spPropertyTitle,
    spPropertyType: reqObj.spPropertyType,
    spPropertyInfoId: reqObj.spPropertyInfoId,
    euName: reqObj.name ? reqObj.name : reqObj.firstName + ' ' + reqObj.lastName,
    euMobileNumber: reqObj.contactEuNumber,
    euEmail: tokenDecodedData.ue,
    bookingCode: bookingCode,
    bookingSecureCode: bookingSecureCode,
    bookingSecureCodeAttempts: 5,
    bookingType: reqObj.bookingType,
    checkInDate: reqObj.checkInDate,
    checkInDateNumber: checkIn.valueOf(),
    checkOutDate: reqObj.checkOutDate,
    checkOutDateNumber: checkOut.valueOf(),
    noOfRooms: reqObj.noOfRooms,
    noOfAdults: reqObj.noOfAdults,
    noOfChilds: reqObj.noOfChilds,
    totalHours: 0,          // hours
    totalDays: reqObj.noOfDays,
    totalNights: reqObj.noOfDays,
    appAmount: ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.appCharges : propertyInfoPricing.weekEndAppCharges)) * reqObj.noOfRooms,
    appTotalAmount: ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.appCharges : propertyInfoPricing.weekEndAppCharges)) * reqObj.noOfRooms,
    spAmount: ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.spAmount : propertyInfoPricing.weekEndSpAmount)) * reqObj.noOfRooms,
    spTotalAmount: ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.spAmount : propertyInfoPricing.weekEndSpAmount)) * reqObj.noOfRooms,
    grandTotal: ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.grandTotalPrice : propertyInfoPricing.weekEndGrandTotalPrice)) * reqObj.noOfRooms,
    totalPrice: ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.totalPrice : propertyInfoPricing.weekEndTotalPrice)) * reqObj.noOfRooms,
    onlineCharges: (((reqObj.noOfDays) * (dayType ? propertyInfoPricing.totalPrice : propertyInfoPricing.weekEndTotalPrice)) - ((reqObj.noOfDays) * (dayType ? propertyInfoPricing.grandTotalPrice : propertyInfoPricing.weekEndGrandTotalPrice))) * reqObj.noOfRooms,
    spOtherCharges: 0,
    spDiscount: 0,
    bookingStatus: 'Booked',
    paymentStatus: 'Pending',
    isDeleted: false,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdBy: 'superadmin',
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedBy: 'superadmin',
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  EU_BookingsDAO.postEndUserBooking(bookingObj, tokenDecodedData, function(resObj) {
    callback(resObj);
    if (resObj && resObj.result._id) {
      postEndUserBookingLifeCycle(resObj, tokenDecodedData, currentUTC, function(resObj) {});
    }
  });
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
      SP_BookingsDAO.postEndUserBookingLifeCycle(bookingLifeCycleObj, resObj.result.bookingCode, tokenDecodedData, function (resObj) {
    });
  }

