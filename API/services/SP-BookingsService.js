/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */
var CommonService = require('./CommonService');
var SP_BookingsDAO = require('../daos/SP-BookingsDAO');
var EU_Bookings = require('../models/EU-Bookings');
var EU_BookingLifeCycle = require('../models/EU-BookingLifeCycle');
var EU_Users = require('../models/EU-Users');
var moment = require('moment');
var EU_BookingsDAO = require('../daos/EU-BookingsDAO');
var SP_BlockedDatesDAO = require('../daos/SP-BlockedDatesDAO');
var config = require('config');

// --- Begin: SP-BookingsService
module.exports = {
    // --- Begin getServiceProviderBookings: Code to get Service Provider Bookings data
    getServiceProviderBookings: function (pageNum, status, searchString, tokenDecodedData, callback) {
        SP_BookingsDAO.getServiceProviderBookings(pageNum, status, searchString, tokenDecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    //--- End getServiceProviderBookings: Code to get Service Provider Bookings data

    // --- Begin: getBookingByRecordID
    getBookingByRecordID: function (recordID, decodedTokenData, callback) {
        SP_BookingsDAO.getBookingByRecordID(recordID, decodedTokenData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // --- End: getBookingByRecordID


    // --- Begin: getPropertiesToCreateBooking
    getPropertiesToCreateBooking: function (hostsBy, pageNumber, searchString, decodedTokenData, callback) {
        var query = hostsBy == 'Days' ?
        {
          'pricing.isDefaultBasePrice': true,
          'isDeleted': false,
          'status': 'Active'
        } : {
          'pricing.isDefaultMinBasePrice': true,
          'isDeleted': false,
          'status': 'Active'
        };
        SP_BookingsDAO.getPropertiesToCreateBooking(query, pageNumber, searchString, decodedTokenData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // --- End: getPropertiesToCreateBooking 

    // --- Begin: postEndUserBooking
    postEndUserBooking: function (reqBody, tokenDecodedData, callback) {
        var fromDate = moment.utc(reqBody.checkInDate);
        var fromNumber = moment(fromDate, 'YYYY-MM-DD').valueOf();
        var toDate = moment.utc(reqBody.checkOutDate);
        var toNumber = moment(toDate, 'YYYY-MM-DD').valueOf();
        var query = {
            'spServiceProviderId': reqBody.spServiceProviderId,
            'propertyId': reqBody.spPropertyId,
            '$or': [
            { 'blockingFromDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
            { 'blockingToDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
            { '$and': [{ 'blockingFromDateNumber': { '$lte': fromNumber } }, { 'blockingToDateNumber': { '$gte': toNumber } }] }
            ],
            'isDeleted': false
        };
        var currentUTC = CommonService.currentUTCObj();
        if (reqBody.validUser === false) {
            createNewUser(reqBody, currentUTC, tokenDecodedData, function (resObj) {
                if (resObj.statusCode == '0000') {
                    checkBlockedDatesIsAvailable(query, function (availResObj) {
                      if (availResObj.statusCode == '9997') {
                        getPropertyInfo(reqBody.spPropertyInfoId, function (propertyInfoResObj) {
                            if (propertyInfoResObj && propertyInfoResObj._id) {
                                if (reqBody.bookingType == 'Days') {
                                    setEndUserDaysBookingData(reqBody, false, resObj.result._id, tokenDecodedData, currentUTC, propertyInfoResObj, function(resObj) {
                                    callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
                                  });
                                } else {
                                    setEndUserHourlyBookingData(reqBody, false, resObj.result._id, tokenDecodedData, currentUTC, propertyInfoResObj, function(resObj) {
                                    callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
                                  });
                              }
                            } else {
                              callback({ httpCode: 400, statusCode: '9992', result: {} })
                            }
                        })
                      } else {
                        callback(availResObj)
                      }
                    })
                } else {
                    callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
                }
            })
        } else {
            checkBlockedDatesIsAvailable(query, function (availResObj) {
                if (availResObj.statusCode == '9997') {
                    getPropertyInfo(reqBody.spPropertyInfoId, function (propertyInfoResObj) {
                      if (propertyInfoResObj && propertyInfoResObj._id) {
                          if (reqBody.bookingType == 'Days') {
                              setEndUserDaysBookingData(reqBody, true, '', tokenDecodedData, currentUTC, propertyInfoResObj, function(resObj) {
                              callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
                            });
                          } else {
                              setEndUserHourlyBookingData(reqBody, true, '', tokenDecodedData, currentUTC, propertyInfoResObj, function(resObj) {
                              callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
                            });
                          }
                        } else {
                          callback({ httpCode: 400, statusCode: '9992', result: {} })
                        }
                    });  
                } else {
                    callback(availResObj)
                }
            })
        }

    },
    // --- End: postEndUserBooking

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
        SP_BookingsDAO.confirmCancelBooking(reqBody, cancelBookingObj, tokenDecodedData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        })
    },

    // --- End: postEndUserBooking


    // --- Begin: postEndUserBooking
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
    // --- End: postEndUserBooking
    getSPBookingData: function (recordId, tokendecodeddata, callback) {
        SP_BookingsDAO.getSPBookingData(recordId, tokendecodeddata, function (resObj) {
          callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
      },
};


/**
 * @param {object} reqObj object
 * @param {function} callback is a callback function
 */

function createNewUser(reqObj, currentUTC, tokenDecodedData, callback) {
    var userAccountCode = CommonService.orderSecureCodeGeneration(2, '0123456789ACEGIKM0123456789');
    // var bookingCode = 'BNB' + bookingSecureCode;
    var name = reqObj.name.split(' ');

    var newUserObj = {
        displayName: name[0],
        firstName: reqObj.name,
        lastName: ' ',
        name: reqObj.name,
        address: 'Please Enter Your Address',

        userAccount: name[0] + userAccountCode,
        mobileNumber: reqObj.contactEuNumber,
        mbnVerifyStatus: 'Open',
        email: reqObj.euEmail,
        emailVerifyStatus: 'Open',
        userRole: 'Customer',
        userStatus: 'Active',
        signupType: 'Local',
        preferences: {
            defaultLanguage: 'English',
            defaultTimezone: 'IST - Indian Standard Time(UTC+05:30)',
            defaultCurrency: 'INR - Indian Rupee(₹)',
            currencyFormat: '#,###.##',
            dateFormat: 'MMM DD, YYYY',
            rowsPerPage: '20',
        },
        createdBy: tokenDecodedData.ua,
        createdAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedBy: tokenDecodedData.ua,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
    };
    var newUserObj = new EU_Users(newUserObj);
    SP_BookingsDAO.postNewUser(newUserObj, tokenDecodedData, function (resObj) {
        callback(resObj);
    });
}

/**
 * @param {object} query object
 * @return {function} callback is a callback function
 */
function checkBlockedDatesIsAvailable(query, callback) {
  SP_BlockedDatesDAO.checkBlockedDatesIsAvailable(query, function(availResObj) {
    if(availResObj.statusCode == '1013') {
        callback({httpCode: '400', statusCode: '1017', result: availResObj.result});
    } else if(availResObj.statusCode == '9997') {
        callback({httpCode: '200', statusCode: '9997', result: availResObj.result});
    } else {
        callback({ httpCode: availResObj.httpCode, statusCode: availResObj.statusCode, result: availResObj.result });
    }
    });
  }

  /**
 * @param {string} spPropertyInfoId string
 * @return {function} callback is a callback function
 */
function getPropertyInfo(spPropertyInfoId, callback) {
    EU_BookingsDAO.getPropertyInfo(spPropertyInfoId, function(propertyInfoResObj) {
      callback(propertyInfoResObj)
    })    
}

/**
 * @param {object} reqObj object
 * @param {object} tokenDecodedData object
 * @return {object} currentUTC object
 * @param {function} callback is a callback function
 */

function setEndUserDaysBookingData(reqObj, validUser, _id, tokenDecodedData, currentUTC, propertyInfo, callback) {
    var bookingSecureCode = CommonService.orderSecureCodeGeneration(3, '0123456789') + CommonService.orderSecureCodeGeneration(7, '0123456789ACEGIKM0123456789') + CommonService.orderSecureCodeGeneration(7, '0123456789BDFHJLN0123456789');
    var bookingCode = 'BNB' + bookingSecureCode;
    var checkIn = moment.utc(reqObj.checkInDate);
    var checkOut = moment.utc(reqObj.checkOutDate);
    var duration = moment.duration(checkOut.diff(checkIn));
    var hours = duration.asHours();
    let dt = moment(reqObj.checkInDate, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let Weekday = dateName === 'Saturday' || dateName === 'Sunday' ? 'Weekend' : 'Weekday'
    const dayType = Weekday === 'Weekday' ? true : false
    const propertyInfoPricing = JSON.parse((JSON.stringify(propertyInfo.pricing)))
    var bookingObj = {
      euUserId: validUser === false ? _id : reqObj.euUserId,
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
      euEmail: reqObj.euEmail,
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
      totalHours: 0,  // hours
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
      createdBy: tokenDecodedData.iss,
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.iss,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    EU_BookingsDAO.postEndUserBooking(bookingObj, tokenDecodedData, function(resObj) {
      callback(resObj);
      if (resObj && resObj.result._id) {
        postEndUserBookingLifeCycle(resObj, tokenDecodedData, currentUTC, function(resObj) {});
      }
    });
  }

  function setEndUserHourlyBookingData(reqObj,  validUser, _id, tokenDecodedData, currentUTC, propertyInfo, callback) {
    var bookingSecureCode = CommonService.orderSecureCodeGeneration(3, '0123456789') + CommonService.orderSecureCodeGeneration(7, '0123456789ACEGIKM0123456789') + CommonService.orderSecureCodeGeneration(7, '0123456789BDFHJLN0123456789');
    var bookingCode = 'BNB' + bookingSecureCode;
    var checkIn = moment.utc(reqObj.checkInDate);
    var checkOut = moment.utc(reqObj.checkOutDate);
    var duration = moment.duration(checkOut.diff(checkIn));
    var hours = duration.asHours();
    let dt = moment(reqObj.checkInDate, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let Weekday = dateName === 'Saturday' || dateName === 'Sunday' ? 'Weekend' : 'Weekday'
    const dayType = Weekday === 'Weekday' ? true : false
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
      euUserId: validUser === false ? _id : reqObj.euUserId,
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
      createdBy:  tokenDecodedData.iss,
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy:  tokenDecodedData.iss,
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



/**
 * @param {object} reqObj object
 * @param {object} tokenDecodedData object
 * @return {object} currentUTC object
 * @param {function} callback is a callback function
 */

function setEndUserBookingData(reqObj, validUser, _id, tokenDecodedData, currentUTC, callback) {
    var bookingSecureCode = CommonService.orderSecureCodeGeneration(3, '0123456789') + CommonService.orderSecureCodeGeneration(7, '0123456789ACEGIKM0123456789') + CommonService.orderSecureCodeGeneration(7, '0123456789BDFHJLN0123456789');
    var bookingCode = 'BNB' + bookingSecureCode;
    var checkIn = moment.utc(reqObj.checkInDate);
    var checkOut = moment.utc(reqObj.checkOutDate);
    var duration = moment.duration(checkOut.diff(checkIn));
    var hours = duration.asHours();
    var appAmount = reqObj.totalPrice * 0.05;
    var bookingObj = {
        euUserId: validUser === false ? _id : reqObj.euUserId,
        spServiceProviderId: reqObj.spServiceProviderId,
        spServiceProvider: reqObj.spServiceProvider,
        spLocationId: reqObj.spLocationId,
        spLocationObj: {
            contactPerson: reqObj.contactPerson,
            mobileNumber: reqObj.mobileNumber,
            // alternateMobileNumber: reqObj.alternateMobileNumber,
            email: reqObj.spemail,
            address: reqObj.address,
            landmark: reqObj.landmark ? reqObj.landmark : '',
            area: reqObj.area,
            // areaLocality: reqObj.areaLocality ? reqObj.areaLocality : '' ,
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
        euName: reqObj.name,
        euMobileNumber: reqObj.contactEuNumber,
        euEmail: reqObj.euEmail,
        bookingCode: bookingCode,
        bookingSecureCode: bookingSecureCode,
        bookingSecureCodeAttempts: 5,
        checkInDate: reqObj.checkInDate,
        checkInDateNumber: moment(checkIn, 'YYYY-MM-DD HH:mm').valueOf(),
        checkOutDate: reqObj.checkOutDate,
        checkOutDateNumber: moment(checkOut, 'YYYY-MM-DD HH:mm').valueOf(),
        noOfRooms: reqObj.noOfRooms,
        noOfAdults: parseInt(reqObj.noOfAdults),
        noOfChilds: parseInt(reqObj.noOfChilds),
        totalHours: hours,
        bookingType: reqObj.bookingType,
        totalDays: reqObj.totalDays ? reqObj.totalDays : 0,
        totalNights: reqObj.noOfDays ? reqObj.noOfDays : 0,
        appAmount: appAmount ? appAmount : 0,
        appOtherCharges: 0,
        appDiscount: 0,
        appTotalAmount: appAmount ? appAmount : 0,
        spAmount: (reqObj.totalPrice - appAmount),
        spOtherCharges: 0,
        spDiscount: 0,
        spTotalAmount: (reqObj.totalPrice - appAmount),
        grandTotal: reqObj.totalPrice,
        onlineCharges: 0,
        totalPrice: reqObj.totalPrice,
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
    SP_BookingsDAO.postEndUserBooking(bookingObj, tokenDecodedData, function (resObj) {
        var currentUTC = CommonService.currentUTCObj();
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
        SP_BookingsDAO.postEndUserBookingLifeCycle(bookingLifeCycleObj, bookingCode, tokenDecodedData, function (resObj) {
        });
        callback(resObj);
    });
}


/**
 * @param {string} bookingId string
 * @param {number} hours string
 * @param {function} callback is a callback function

 */
function handleRefund(bookingId, hours, tokendecodeddata, callback) {
    var RefundAmount = 0;
    SP_BookingsDAO.getSpPropertyInfo(bookingId, function (error, resObj) {
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
    SP_BookingsDAO.putEndUserBookingData(reqBody, putBookingObj, tokenDecodedData, function (resObj) {
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
        SP_BookingsDAO.putEndUserBookingData(reqBody, putBookingObj, tokenDecodedData, function (resObj) {
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
    SP_BookingsDAO.postEndUserBookingLifeCycle(bookingLifeCycleObj, resObj.result.bookingCode, tokenDecodedData, function (resObj) {});
  }


