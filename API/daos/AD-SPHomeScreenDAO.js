/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var async = require('async');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var AD_Users = require('../models/AD-Users');
var EU_Bookings = require('../models/EU-Bookings')
var EU_Messages = require('../models/EU-Messages');
var EU_ReviewRatings = require('../models/EU-ReviewRatings');
var SP_Properties = require('../models/SP-Properties');
var SP_PropertyBlockings = require('../models/SP-PropertyBlockings');
var SP_Notifications = require('../models/SP-Notifications');
var EU_Users = require('../models/EU-Users');
var SP_Users = require('../models/SP-Users');
var SP_ServiceProviders = require('../models/SP-ServiceProviders')

// --- Begining of AD_SPHomeScreenDAO
module.exports = {

  // Begin: getADSPHomeScreenCounts
  getSPHomeScreenUsersCount: function (tokendecodedData, query, callback) {
    var BookingsAmount = {}, bookingsBookedCount = {},
      MessagesCount = {}, ReviewsCount = {}, PropertiesCount = {},
      SPExpieredBookings = {}
    async.parallel([

      function (callback) {
        getSPBookingStatusCounts(query.getSPBookingStatusCountsQuery, function (resObj1) {
          bookingsBookedCount = resObj1;
          callback(null, bookingsBookedCount);
        });
      },

      function (callback) {
        getSPBookingAccounts(query.getSPBookingStatusCountsQuery, function (resObj2) {
          BookingsAmount = resObj2;
          callback(null, BookingsAmount);
        });
      },
      function (callback) {
        getSPExpieredBookings(query.getSPExpieredBookingsQuery, function (resObj3) {
          SPExpieredBookings = resObj3
          callback(null, SPExpieredBookings);
        });
      },
      function (callback) {
        getSPUsersReviewsCounts(query.getSPBookingStatusCountsQuery, function (resObj4) {
          ReviewsCount = resObj4;
          callback(null, ReviewsCount);
        });
      },
      function (callback) {
        getSPUsersMessagesCounts(query.getSPUsersMessagesCountsQuery, function (resObj5) {
          MessagesCount = resObj5;
          callback(null, MessagesCount);
        });
      },


    ], function (err, result) {
      if (err) {
        logger.error('There was an Un-known Error occured in daos/AD-SPHomeScreenDAO.js,' +
          ' at AD-SPHomeScreenDAO:', err);
      }
      var fResObj = {
        bookingsBookedCount: bookingsBookedCount
        , BookingsAmount: BookingsAmount, MessagesCount: MessagesCount, ReviewsCount: ReviewsCount,
        SPExpieredBookings: SPExpieredBookings
      };
      callback({ httpCode: 200, statusCode: '0000', result: fResObj });
    });
  },

  // End: getADSPHomeScreenCounts

  // Begin: getADSPBookingsAmountsList
  getADSPBookingsAmountsList: function (hostId, bookingAmountStatus, pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, callback) {
    switch (bookingAmountStatus) {
      case 'all':
        var query = {
          isDeleted: false, spServiceProviderId: hostId, bookingStatus: { "$nin": ['Closed'] },
          '$or': [
            { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
            { 'bookingCode': { $regex: searchString, $options: 'i' } },
            { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
            { 'euEmail': { $regex: searchString, $options: 'i' } },
            { 'euName': { $regex: searchString, $options: 'i' } },
            { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
            { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
            { 'bookingStatus': { $regex: searchString, $options: 'i' } },
          ]
        };
        break;
      case 'actual amount':
        var query = {
          isDeleted: false, spServiceProviderId: hostId,
          bookingStatus: { "$nin": ['Cancelled', 'Closed'] },
          '$or': [
            { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
            { 'bookingCode': { $regex: searchString, $options: 'i' } },
            { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
            { 'euEmail': { $regex: searchString, $options: 'i' } },
            { 'euName': { $regex: searchString, $options: 'i' } },
            { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
            { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
            { 'bookingStatus': { $regex: searchString, $options: 'i' } },
          ]
        };
        break;
      case 'Cancelled':
        var query = {
          isDeleted: false, spServiceProviderId: hostId,
          bookingStatus: 'Cancelled',
          '$or': [
            { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
            { 'bookingCode': { $regex: searchString, $options: 'i' } },
            { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
            { 'euEmail': { $regex: searchString, $options: 'i' } },
            { 'euName': { $regex: searchString, $options: 'i' } },
            { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
            { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
            { 'bookingStatus': { $regex: searchString, $options: 'i' } },
          ]
        };
        break;
      case 'Expired':
        var query = {
          isDeleted: false, spServiceProviderId: hostId,
          checkInDateNumber: { $lte: startUTCDateTimeNumber },
          bookingStatus: ['Booked', 'Confirmed', 'Checked-In'],
          '$or': [
            { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
            { 'bookingCode': { $regex: searchString, $options: 'i' } },
            { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
            { 'euEmail': { $regex: searchString, $options: 'i' } },
            { 'euName': { $regex: searchString, $options: 'i' } },
            { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
            { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
            { 'bookingStatus': { $regex: searchString, $options: 'i' } },
          ]
        };
        break;
    }
    EU_Bookings.find(query)
      .populate('spPropertyId')
      .populate('spPropertyInfoId')
      .populate('euUserId')
      .skip((pageNumber - 1) * 10)
      .limit(10)
      .exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD_SPHomeScreenDAO.js, at getADSPBookingsAmountsList:' + error);
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
              logger.error('There was an Un-known Error occured in daos/AD_SPHomeScreenDAO.js, at getADSPBookingsAmountsList:' + errorCount);
              var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
              callback(error, { statusCode: '0000', result: resultObj });
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
  // End: getADSPBookingsAmountsList

}
// End of AD_SPHomeScreenDAO



/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPBookingStatusCounts(query, callback) {
  EU_Bookings.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$bookingStatus',
        count: { $sum: 1 }
      }
    }
  ])
    .exec(function (error, userData) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-SPHomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (userData && userData.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: userData });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPExpieredBookings(query, callback) {
  EU_Bookings.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$bookingStatus',
        count: { $sum: 1 }
      }
    }
  ])
    .exec(function (error, userData) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-SPHomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (userData && userData.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: userData });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPBookingAccounts(query, callback) {
  EU_Bookings.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$bookingStatus',
        total: { $sum: "$spAmount" },
      }
    }
  ]).exec(function (error, amountsData) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-SPHomeScreenDAO.js' + error);
      callback({ httpCode: 500, statusCode: '9999', result: [] });
    } else if (amountsData && amountsData.length > 0) {
      callback({ httpCode: 200, statusCode: '0000', result: amountsData });
    } else {
      callback({ httpCode: 400, statusCode: '9997', result: [] });
    }
  });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPUsersReviewsCounts(query, callback) {
  EU_ReviewRatings.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      }
    }
  ]).exec(function (error, reviewsData) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-SPHomeScreenDAO.js' + error);
      callback({ httpCode: 500, statusCode: '9999', result: [] });
    } else if (reviewsData && reviewsData.length > 0) {
      callback({ httpCode: 200, statusCode: '0000', result: reviewsData });
    } else {
      callback({ httpCode: 400, statusCode: '9997', result: [] });
    }
  });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getSPUsersMessagesCounts(query, callback) {
  EU_Messages.aggregate([
    {
      $match: query
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      }
    }
  ]).exec(function (error, messagesData) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-SPHomeScreenDAO.js' + error);
      callback({ httpCode: 500, statusCode: '9999', result: [] });
    } else if (messagesData && messagesData.length > 0) {
      callback({ httpCode: 200, statusCode: '0000', result: messagesData });
    } else {
      callback({ httpCode: 400, statusCode: '9997', result: [] });
    }
  });
}
