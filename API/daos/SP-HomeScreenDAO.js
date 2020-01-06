/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var EU_Bookings = require('../models/EU-Bookings');
var EU_Messages = require('../models/EU-Messages');
var EU_ReviewRatings = require('../models/EU-ReviewRatings');
var SP_Properties = require('../models/SP-Properties');
var SP_PropertyBlockings = require('../models/SP-PropertyBlockings');
var SP_Notifications  = require('../models/SP-Notifications');
var CommonService = require('../services/CommonService');
var async = require('async');

// --- Begining of SP_HomeScreenDAO
module.exports = {

  getSPDashboardCounts: function(tokenDecodedData, query, callback) {
    var checkInsCount = {}, checkOutsCount = {}, bookingsCount = {}, bookingsAmount={}, messagesCount={}, reviewsCount={}, propertysCount={}, blockedDatesCount={}, notificationsUnreadCount={}
    async.parallel([
      function(callback) {
        getSPDashboardCheckInsCount(query.getSPCheckInsCountQuery, function(resObj1) {
          checkInsCount = resObj1.result;
          callback(null, checkInsCount);
        });
      },
      function(callback) {
        getSPDashboardCheckOutsCount(query.getSPCheckOutsCountQuery, function(resObj2) {
          checkOutsCount = resObj2.result;
          callback(null, checkOutsCount);
        });
      },
      function(callback) {
        getSPDashboardBookingsCount(query.getSPBookingsCount, function(resObj3) {
          bookingsCount = resObj3.result;
          callback(null, bookingsCount);
        });
      },
      function(callback) {
        getSPDashboardBookingAccounts(query.getSPBookingsCount, function(resObj4) {
          bookingsAmount = resObj4.result;
          callback(null, bookingsAmount);
        });
      },
      function(callback) {
        getSPDashboardMessagesCounts(query.getSPMessagesCount, function(resObj5) {
          messagesCount = resObj5.result;
          callback(null, messagesCount);
        });
      },
      function(callback) {
        getSPDashboardReviewCounts(query.getSPReviewRatingCount, function(resObj6) {
          reviewsCount = resObj6.result;
          callback(null, reviewsCount);
        });
      },
      function(callback) {
        getSPDashboardPropertiesCounts(query.getSPPropertiesCount, function(resObj7) {
          propertysCount = resObj7.result;
          callback(null, propertysCount);
        });
      },
      function(callback) {
        getSPDashboardBlockDatesCounts(query.getSPBlockedDatesCount, function(resObj8) {
          blockedDatesCount = resObj8.result;
          callback(null, blockedDatesCount);
        });
      },
      function(callback) {
        getSPDashboardNotificationsCounts(query.getSPDashboardNotificationsCount, function(resObj9) {
          notificationsUnreadCount = resObj9.result;
          callback(null, notificationsUnreadCount);
        });
      },
    ], function (err, result) {
      if(err) {
        logger.error('There was an Un-known Error occured in daos/AD-TicketsDAO.js,' +
       ' at getADTicketsData:', err);
      }
      var cResObj = {checkInsCount: checkInsCount, checkOutsCount: checkOutsCount, bookingsCount: bookingsCount, bookingsAmount: bookingsAmount, messagesCount: messagesCount, reviewsCount: reviewsCount, propertysCount: propertysCount, blockedDatesCount: blockedDatesCount, notificationsUnreadCount: notificationsUnreadCount };
      callback({ httpCode: 200, statusCode: '0000', result: cResObj });
    });
  },

  // Begin: getSPCheckInBookingsList
  getSPCheckInBookingsList: function (pageNumber, searchString, startUTCDateTimeNumber, endUTCDateTimeNumber, tokendecodedData, callback) {
    var query = {
      spServiceProviderId: tokendecodedData.uspid, 
      isDeleted: false,
      '$and': [ 
        { '$or': [
          { '$and': [ 
              {
              'checkInDateNumber': {$gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber},
              'bookingStatus': ['Checked-In', 'Booked', 'Confirmed'],
              }
            ]
          },
          { '$and': [ 
              {
              'updatedAt': {$gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber},
              'bookingStatus': 'Checked-In'
              }
            ]
          }
        ]},
        { 
          '$or': [
            { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
            { 'bookingCode': { $regex: searchString, $options: 'i' } },
            { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
            { 'euEmail': { $regex: searchString, $options: 'i' } }
          ]
        }
      ]
    };
    EU_Bookings.find(query)
    .populate('spPropertyId')
    .populate('spPropertyInfoId')
    .populate('euUserId')
    .skip((pageNumber - 1) * 10)
    .limit(10)
    .exec(function (error, resultArray) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP_HomeScreenDAO.js, at getSPCheckInBookingsList:', error);
        callback(error, { statusCode: '9999', result: {} });
      } else if (resultArray && resultArray.length > 0) {
        var bookingArray = [];
        resultArray.forEach(function (bookObj) {
          var userObj = bookObj.euUserId;
          var decUserObj = {
            mobileNumber: bookObj.euUserId.mobileNumber,
            email: bookObj.euUserId.email,
            alternateContactNumber: bookObj.euUserId.alternateContactNumber ? CommonService.decrypt(bookObj.euUserId.alternateContactNumber) : '',
            alternateEmail: bookObj.euUserId.alternateEmail ? CommonService.decrypt(bookObj.euUserId.alternateEmail) : '',
          };
          var modifiedUserObj = JSON.parse((JSON.stringify(userObj) + JSON.stringify(decUserObj)).replace(/}{/g, ','))
          var bookingObj = bookObj;
          var decObj = {
            euMobileNumber: bookObj.euMobileNumber,
            paymentStatus: bookObj.paymentStatus,
            euEmail: bookObj.euEmail ? CommonService.decrypt(bookObj.euEmail) : '',
            paymentMode: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
            paymentModeCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
            paymentUrl: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
            paymentCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
            euUserId: modifiedUserObj
          };
          var resultObj = JSON.parse((JSON.stringify(bookingObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
          bookingArray.push(resultObj)
        });
        EU_Bookings.find(query).exec(function (errorCount, resultCount) {
          if (errorCount) {
            logger.error('There was an Un-known Error occured in daos/SP-UsersDAO.js, at getSPCheckInBookingsList:', errorCount);
            var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
            callback(error, {statusCode: '0000', result: resultObj });
          } else if (resultCount) {
            var resultObj = { totalDocs: resultCount.length, bookingsData: bookingArray };
            callback(error, { statusCode: '0000', result: resultObj });
          } else {
            var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
            callback(error, { statusCode: '0000', result: resultObj });
          }
        });
      } else {
        callback(error, { statusCode: '9997', result: {} });
      }
    });
  },
  // End: getSPCheckInBookingsList


  // Begin: getSPCheckOutBookingsList
  getSPCheckOutBookingsList: function (pageNumber, searchString, startUTCDateTimeNumber, endUTCDateTimeNumber, tokendecodedData, callback) {
    var query = {
      spServiceProviderId: tokendecodedData.uspid, 
      isDeleted: false,
      '$and': [ 
        { '$or': [
          { '$and': [ 
              {
              'checkOutDateNumber': {$gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber},
              'bookingStatus': ['Checked-In', 'Checked-Out'],
              }
            ]
          },
          { '$and': [ 
              {
              'updatedAt': {$gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber},
              'bookingStatus': 'Checked-Out'
              }
            ]
          }
        ]},
        { 
          '$or': [
            { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
            { 'bookingCode': { $regex: searchString, $options: 'i' } },
            { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
            { 'euEmail': { $regex: searchString, $options: 'i' } }
          ]
        }
      ]
    };
    EU_Bookings.find(query)
    .populate('spPropertyId')
    .populate('spPropertyInfoId')
    .populate('euUserId')
    .skip((pageNumber - 1) * 10)
    .limit(10)
    .exec(function (error, resultArray) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP_HomeScreenDAO.js, at getSPCheckOutBookingsList:', error);
        callback(error, { statusCode: '9999', result: {} });
      } else if (resultArray && resultArray.length > 0) {
        var bookingArray = [];
        resultArray.forEach(function (bookObj) {
          var userObj = bookObj.euUserId;
          var decUserObj = {
            mobileNumber: bookObj.euUserId.mobileNumber,
            email: bookObj.euUserId.email,
            alternateContactNumber: bookObj.euUserId.alternateContactNumber ? CommonService.decrypt(bookObj.euUserId.alternateContactNumber) : '',
            alternateEmail: bookObj.euUserId.alternateEmail ? CommonService.decrypt(bookObj.euUserId.alternateEmail) : '',
          };
          var modifiedUserObj = JSON.parse((JSON.stringify(userObj) + JSON.stringify(decUserObj)).replace(/}{/g, ','))
          var bookingObj = bookObj;
          var decObj = {
            euMobileNumber: bookObj.euMobileNumber,
            paymentStatus: bookObj.paymentStatus,
            euEmail: bookObj.euEmail ? CommonService.decrypt(bookObj.euEmail) : '',
            paymentMode: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
            paymentModeCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
            paymentUrl: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
            paymentCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
            euUserId: modifiedUserObj
          };
          var resultObj = JSON.parse((JSON.stringify(bookingObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
          bookingArray.push(resultObj)
        });
        EU_Bookings.find(query).exec(function (errorCount, resultCount) {
          if (errorCount) {
            logger.error('There was an Un-known Error occured in daos/SP_HomeScreenDAO.js, at getSPCheckOutBookingsList:', errorCount);
            var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
            callback(error, {statusCode: '0000', result: resultObj });
          } else if (resultCount) {
            var resultObj = { totalDocs: resultCount.length, bookingsData: bookingArray };
            callback(error, { statusCode: '0000', result: resultObj });
          } else {
            var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
            callback(error, { statusCode: '0000', result: resultObj });
          }
        });
      } else {
        callback(error, { statusCode: '9997', result: {} });
      }
    });
  },
  // End: getSPCheckOutBookingsList

  // Begin: getSPBookingsCountBookingsList
  getSPBookingsCountBookingsList: function (pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, callback) {
    var query = {
      spServiceProviderId: tokendecodedData.uspid, 
      isDeleted: false, 
      createdAt: {$gte: startUTCDateTimeNumber},
      bookingStatus: { "$nin": ['Cancelled','Completed']},
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'bookingCode': { $regex: searchString, $options: 'i' } },
        { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
        { 'euEmail': { $regex: searchString, $options: 'i' } }
      ]
    };
    EU_Bookings.find(query)
    .populate('spPropertyId')
    .populate('spPropertyInfoId')
    .populate('euUserId')
    .skip((pageNumber - 1) * 10)
    .limit(10)
    .exec(function (error, resultArray) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP_HomeScreenDAO.js, at getSPBookingsCountBookingsList:', error);
        callback(error, { statusCode: '9999', result: {} });
      } else if (resultArray && resultArray.length > 0) {
        var bookingArray = [];
        resultArray.forEach(function (bookObj) {
          var userObj = bookObj.euUserId;
          var decUserObj = {
            mobileNumber: bookObj.euUserId.mobileNumber,
            email: bookObj.euUserId.email,
            alternateContactNumber: bookObj.euUserId.alternateContactNumber ? CommonService.decrypt(bookObj.euUserId.alternateContactNumber) : '',
            alternateEmail: bookObj.euUserId.alternateEmail ? CommonService.decrypt(bookObj.euUserId.alternateEmail) : '',
          };
          var modifiedUserObj = JSON.parse((JSON.stringify(userObj) + JSON.stringify(decUserObj)).replace(/}{/g, ','))
          var bookingObj = bookObj;
          var decObj = {
            euMobileNumber: bookObj.euMobileNumber,
            paymentStatus: bookObj.paymentStatus,
            euEmail: bookObj.euEmail ? CommonService.decrypt(bookObj.euEmail) : '',
            paymentMode: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
            paymentModeCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
            paymentUrl: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
            paymentCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
            euUserId: modifiedUserObj
          };
          var resultObj = JSON.parse((JSON.stringify(bookingObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
          bookingArray.push(resultObj)
        });
        EU_Bookings.find(query).exec(function (errorCount, resultCount) {
          if (errorCount) {
            logger.error('There was an Un-known Error occured in daos/SP_HomeScreenDAO.js, at getSPBookingsCountBookingsList:', errorCount);
            var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
            callback(error, {statusCode: '0000', result: resultObj });
          } else if (resultCount) {
            var resultObj = { totalDocs: resultCount.length, bookingsData: bookingArray };
            callback(error, { statusCode: '0000', result: resultObj });
          } else {
            var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
            callback(error, { statusCode: '0000', result: resultObj });
          }
        });
      } else {
        callback(error, { statusCode: '9997', result: {} });
      }
    });
  },
  // End: getSPBookingsCountBookingsList

  // Begin: getSPBookingsCountCancelledList
  getSPBookingsCountCancelledList: function (pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, callback) {
    var query = {
      spServiceProviderId: tokendecodedData.uspid, 
      isDeleted: false, 
      updatedAt: {$gte: startUTCDateTimeNumber},
      bookingStatus: 'Cancelled',
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'bookingCode': { $regex: searchString, $options: 'i' } },
        { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
        { 'euEmail': { $regex: searchString, $options: 'i' } }
      ]
    };
    EU_Bookings.find(query)
    .populate('spPropertyId')
    .populate('spPropertyInfoId')
    .populate('euUserId')
    .skip((pageNumber - 1) * 10)
    .limit(10)
    .exec(function (error, resultArray) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP_HomeScreenDAO.js, at getSPBookingsCountCancelledList:', error);
        callback(error, { statusCode: '9999', result: {} });
      } else if (resultArray && resultArray.length > 0) {
        var bookingArray = [];
        resultArray.forEach(function (bookObj) {
          var userObj = bookObj.euUserId;
          var decUserObj = {
            mobileNumber: bookObj.euUserId.mobileNumber,
            email: bookObj.euUserId.email,
            alternateContactNumber: bookObj.euUserId.alternateContactNumber ? CommonService.decrypt(bookObj.euUserId.alternateContactNumber) : '',
            alternateEmail: bookObj.euUserId.alternateEmail ? CommonService.decrypt(bookObj.euUserId.alternateEmail) : '',
          };
          var modifiedUserObj = JSON.parse((JSON.stringify(userObj) + JSON.stringify(decUserObj)).replace(/}{/g, ','))
          var bookingObj = bookObj;
          var decObj = {
            euMobileNumber: bookObj.euMobileNumber,
            paymentStatus: bookObj.paymentStatus,
            euEmail: bookObj.euEmail ? CommonService.decrypt(bookObj.euEmail) : '',
            paymentMode: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
            paymentModeCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
            paymentUrl: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
            paymentCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
            euUserId: modifiedUserObj
          };
          var resultObj = JSON.parse((JSON.stringify(bookingObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
          bookingArray.push(resultObj)
        });
        EU_Bookings.find(query).exec(function (errorCount, resultCount) {
          if (errorCount) {
            logger.error('There was an Un-known Error occured in daos/SP_HomeScreenDAO.js, at getSPBookingsCountCancelledList:', errorCount);
            var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
            callback(error, {statusCode: '0000', result: resultObj });
          } else if (resultCount) {
            var resultObj = { totalDocs: resultCount.length, bookingsData: bookingArray };
            callback(error, { statusCode: '0000', result: resultObj });
          } else {
            var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
            callback(error, { statusCode: '0000', result: resultObj });
          }
        });
      } else {
        callback(error, { statusCode: '9997', result: {} });
      }
    });
  },
  // End: getSPBookingsCountCancelledList

  // Begin: getSPBookingsAmountsList
  getSPBookingsAmountsList: function (pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, callback) {
    var query = {
      spServiceProviderId: tokendecodedData.uspid, 
      isDeleted: false, 
      createdAt: {$gte: startUTCDateTimeNumber},
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'bookingCode': { $regex: searchString, $options: 'i' } },
        { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
        { 'euEmail': { $regex: searchString, $options: 'i' } }
      ]
    };
    EU_Bookings.find(query)
    .populate('spPropertyId')
    .populate('spPropertyInfoId')
    .populate('euUserId')
    .skip((pageNumber - 1) * 10)
    .limit(10)
    .exec(function (error, resultArray) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP_HomeScreenDAO.js, at getSPBookingsAmountsList:', error);
        callback(error, { statusCode: '9999', result: {} });
      } else if (resultArray && resultArray.length > 0) {
        var bookingArray = [];
        resultArray.forEach(function (bookObj) {
          var userObj = bookObj.euUserId;
          var decUserObj = {
          mobileNumber: bookObj.euUserId.mobileNumber,
          email: bookObj.euUserId.email,
          alternateContactNumber: bookObj.euUserId.alternateContactNumber ? CommonService.decrypt(bookObj.euUserId.alternateContactNumber) : '',
          alternateEmail: bookObj.euUserId.alternateEmail ? CommonService.decrypt(bookObj.euUserId.alternateEmail) : '',
          };
          var modifiedUserObj = JSON.parse((JSON.stringify(userObj) + JSON.stringify(decUserObj)).replace(/}{/g, ','))
          var bookingObj = bookObj;
          var decObj = {
            euMobileNumber: bookObj.euMobileNumber,
            paymentStatus: bookObj.paymentStatus,
            euEmail: bookObj.euEmail ? CommonService.decrypt(bookObj.euEmail) : '',
            paymentMode: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
            paymentModeCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
            paymentUrl: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
            paymentCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
            euUserId: modifiedUserObj
          };
          var resultObj = JSON.parse((JSON.stringify(bookingObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
          bookingArray.push(resultObj)
        });
        EU_Bookings.find(query).exec(function (errorCount, resultCount) {
          if (errorCount) {
            logger.error('There was an Un-known Error occured in daos/SP_HomeScreenDAO.js, at getSPBookingsAmountsList:', errorCount);
            var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
            callback(error, {statusCode: '0000', result: resultObj });
          } else if (resultCount) {
            var resultObj = { totalDocs: resultCount.length, bookingsData: bookingArray };
            callback(error, { statusCode: '0000', result: resultObj });
          } else {
            var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
            callback(error, { statusCode: '0000', result: resultObj });
          }
        });
      } else {
        callback(error, { statusCode: '9997', result: {} });
      }
    });
  },
  // End: getSPBookingsAmountsList

  // Begin: getSPHomeScreenBlockedDatesList
  getSPHomeScreenBlockedDatesList: function (pageNumber, searchString, startUTCDateTimeNumber, endUTCDateTimeNumber, tokendecodedData, callback) {
    var query = {
      'spServiceProviderId': tokendecodedData.uspid,
      'isDeleted': false,
      '$and': [ 
        { '$or': [
          { 'blockingFromDateNumber': {$gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber} },
          { 'blockingToDateNumber': {$gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber} },
          { 'blockingFromDateNumber': {$lte: startUTCDateTimeNumber}, blockingToDateNumber: {$gte: endUTCDateTimeNumber} }
        ]},
        { '$or': [
          { 'spServiceProvider': {$regex: searchString, $options: 'i' } },
          { 'propertyTitle': {$regex: searchString, $options: 'i' } }
      ]}
      ]
    };
    SP_PropertyBlockings.find(query)
    .populate('propertyId')
    .skip((pageNumber - 1) * 10)
    .limit(10)
    .exec(function (error, resultArray) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP_HomeScreenDAO.js, at getSPHomeScreenBlockedDatesList:', error);
        callback(error, { statusCode: '9999', result: {} });
      } else if (resultArray && resultArray.length > 0) {
        SP_PropertyBlockings.find(query).exec(function (errorCount, resultCount) {
          if (errorCount) {
            logger.error('There was an Un-known Error occured in daos/SP_HomeScreenDAO.js, at getSPHomeScreenBlockedDatesList:', errorCount);
            var resultObj = { totalDocs: resultArray.length, blockedDatesData: resultArray };
            callback(error, {statusCode: '0000', result: resultObj });
          } else if (resultCount) {
            var resultObj = { totalDocs: resultCount.length, blockedDatesData: resultArray };
            callback(error, { statusCode: '0000', result: resultObj });
          } else {
            var resultObj = { totalDocs: resultArray.length, blockedDatesData: resultArray };
            callback(error, { statusCode: '0000', result: resultObj });
          }
        });
      } else {
        callback(error, { statusCode: '9997', result: {} });
      }
    });
  },
  // End: getSPHomeScreenBlockedDatesList
}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPDashboardCheckInsCount(query, callback) {
  EU_Bookings.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$bookingStatus',
          myCount: { $sum: 1 }
        }
      }
    ])
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (data && data.length > 0) {
        callback({httpCode: 200, statusCode: '0000', result: data});
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPDashboardCheckOutsCount(query, callback) {
  EU_Bookings.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$bookingStatus',
          myCount: { $sum: 1 }
        }
      }
    ])
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (data && data.length > 0) {
        callback({httpCode: 200, statusCode: '0000', result: data});
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPDashboardBookingsCount(query, callback) {
  EU_Bookings.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$bookingStatus',
          myCount: { $sum: 1 }
        }
      }
    ])
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (data && data.length > 0) {
        callback({httpCode: 200, statusCode: '0000', result: data});
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPDashboardBookingAccounts(query, callback) {
  EU_Bookings.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$bookingStatus',
          total: { $sum: "$spAmount" },
        }
      }
    ])
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (data && data.length > 0) {
        callback({httpCode: 200, statusCode: '0000', result: data});
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPDashboardMessagesCounts(query, callback) {
  EU_Messages.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        }
      }
    ])
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (data && data.length > 0) {
        callback({httpCode: 200, statusCode: '0000', result: data});
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}

/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPDashboardReviewCounts(query, callback) {
  EU_ReviewRatings.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        }
      }
    ])
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (data && data.length > 0) {
        callback({httpCode: 200, statusCode: '0000', result: data});
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPDashboardPropertiesCounts(query, callback) {
  SP_Properties.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        }
      }
    ])
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (data && data.length > 0) {
        callback({httpCode: 200, statusCode: '0000', result: data});
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPDashboardBlockDatesCounts(query, callback) {
  SP_PropertyBlockings.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        }
      }
    ])
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (data && data.length > 0) {
        callback({httpCode: 200, statusCode: '0000', result: data});
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPDashboardNotificationsCounts(query, callback) {
  SP_Notifications.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        }
      }
    ])
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (data && data.length > 0) {
        callback({httpCode: 200, statusCode: '0000', result: data});
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}

