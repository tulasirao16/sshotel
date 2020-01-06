/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var commonService = require('./CommonService');
var SP_HomeScreenDAO = require('../daos/SP-HomeScreenDAO');
var moment = require('moment');
var async = require('async');
// var SP_Locations = require('../models/SP-Locations');

// --- Begin: SP_HomeScreenService
module.exports = {

  getSPDashboardCounts: function (tokendecodedData, byDateType, callback) {
    var utcMoment = moment();
    var userStartDate = '';
    var userStartTime = '';
    var startUTCDateTimeNumber = 0;
    var userEndDate = '';
    var userEndTime = '';
    var endUTCDateTimeNumber = 0;
    var LastDay = moment().subtract(1, 'days')
    // Last Week
    var lastWeekStartingDate = moment().subtract(1, 'weeks').startOf('week');
    var lastWeekEndingDate = moment().subtract(1, 'weeks').endOf('week');
    async.series([
      function (callback) {
        switch (byDateType) {
          case 'Today':
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = utcMoment.endOf('day');
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Week':
            userStartDate = utcMoment.startOf('week');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = utcMoment.endOf('week');
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Month':
            userStartDate = utcMoment.startOf('month');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = utcMoment.endOf('month');
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Year':
            userStartDate = utcMoment.startOf('year');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = utcMoment.endOf('year');
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'LastWeek':
            userStartDate = lastWeekStartingDate;
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = lastWeekEndingDate;
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'LastDay':
            userStartDate = LastDay.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = LastDay.endOf('day');
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          default:
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = utcMoment.endOf('day');
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
        }
      }
    ], function (err, result) {
      if (err) {
        logger.error('There was an Un-known Error occured in daos/SP-HomeScreenService.js, at getSPDashboardCounts:' + err);
      }
      var query = {
        getSPCheckInsCountQuery: {
          'spServiceProviderId': tokendecodedData.uspid,
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
        getSPCheckOutsCountQuery: {
          spServiceProviderId: tokendecodedData.uspid,
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
        getSPBookingsCount: {
          spServiceProviderId: tokendecodedData.uspid,
          isDeleted: false,
          createdAt: { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber }
        },
        getSPReviewRatingCount: {
          spServiceProviderId: tokendecodedData.uspid,
          isDeleted: false,
          createdAt: { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber }
        },
        getSPMessagesCount: {
          spServiceProviderId: tokendecodedData.uspid, isDeleted: false, spReadStatus: 'Unread',
        },
        getSPPropertiesCount: {
          spServiceProviderId: tokendecodedData.uspid, isDeleted: false
        },
        getSPBlockedDatesCount: {
          spServiceProviderId: tokendecodedData.uspid,
          isDeleted: false,
          $or: [
            { blockingFromDateNumber: { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber } },
            { blockingToDateNumber: { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber } },
            { blockingFromDateNumber: { $lte: startUTCDateTimeNumber }, blockingToDateNumber: { $gte: startUTCDateTimeNumber } }
          ],
        },
        getSPDashboardNotificationsCount: {
          spUserId: tokendecodedData.iss, isDeleted: false, status: 'Unread',
        }
      };
      SP_HomeScreenDAO.getSPDashboardCounts(tokendecodedData, query, function (resObj) {
        callback(resObj);
      });
    });
  },

  // --- Begin getSPCheckInBookingsList:
  getSPCheckInBookingsList: function (byDateType, pageNumber, searchString, tokendecodedData, callback) {
    var utcMoment = moment();
    var userStartDate = '';
    var userStartTime = '';
    var startUTCDateTimeNumber = 0;
    var userEndDate = '';
    var userEndTime = '';
    var endUTCDateTimeNumber = 0;
    var LastDay = moment().subtract(1, 'days')
    // Last Week
    var lastWeekStartingDate = moment().subtract(1, 'weeks').startOf('week');
    var lastWeekEndingDate = moment().subtract(1, 'weeks').endOf('week');
    async.series([
      function (callback) {
        switch (byDateType) {
          case 'Today':
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('day');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Week':
            userStartDate = utcMoment.startOf('week');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('week');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Month':
            userStartDate = utcMoment.startOf('month');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('month');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Year':
            userStartDate = utcMoment.startOf('year');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('year');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'LastWeek':
            userStartDate = lastWeekStartingDate;
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = lastWeekEndingDate;
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
          break;
          case 'LastDay':
            userStartDate = LastDay.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = LastDay.endOf('day');
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          default:
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('day');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
        }
      }
    ], function (err, result) {
      if (err) {
        logger.error('There was an Un-known Error occured in daos/SP-HomeScreenService.js, at getSPCheckInBookingsList:' + err);
      }
      SP_HomeScreenDAO.getSPCheckInBookingsList(pageNumber, searchString, startUTCDateTimeNumber, endUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
        if (error) {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj.statusCode === '0000') {
          callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
        } else {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
        }
      });
    });
  },
  // --- End getSPCheckInBookingsList:

  // --- Begin getSPCheckOutBookingsList:
  getSPCheckOutBookingsList: function (byDateType, pageNumber, searchString, tokendecodedData, callback) {
    var utcMoment = moment();
    var userStartDate = '';
    var userStartTime = '';
    var startUTCDateTimeNumber = 0;
    var userEndDate = '';
    var userEndTime = '';
    var endUTCDateTimeNumber = 0;
    var LastDay = moment().subtract(1, 'days')
    // Last Week
    var lastWeekStartingDate = moment().subtract(1, 'weeks').startOf('week');
    var lastWeekEndingDate = moment().subtract(1, 'weeks').endOf('week');
    async.series([
      function (callback) {
        switch (byDateType) {
          case 'Today':
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('day');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Week':
            userStartDate = utcMoment.startOf('week');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('week');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Month':
            userStartDate = utcMoment.startOf('month');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('month');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Year':
            userStartDate = utcMoment.startOf('year');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('year');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'LastWeek':
            userStartDate = lastWeekStartingDate;
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = lastWeekEndingDate;
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'LastDay':
            userStartDate = LastDay.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = LastDay.endOf('day');
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          default:
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('day');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
        }
      }
    ], function (err, result) {
      if (err) {
        logger.error('There was an Un-known Error occured in daos/SP-HomeScreenService.js, at getSPCheckOutBookingsList:' + err);
      }
      SP_HomeScreenDAO.getSPCheckOutBookingsList(pageNumber, searchString, startUTCDateTimeNumber, endUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
        if (error) {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj.statusCode === '0000') {
          callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
        } else {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
        }
      });
    });
  },
  // --- End getSPCheckOutBookingsList:

  // --- Begin getSPBookingsCountBookingsList:
  getSPBookingsCountBookingsList: function (byDateType, pageNumber, searchString, tokendecodedData, callback) {
    var utcMoment = moment();
    var userStartDate = '';
    var userStartTime = '';
    var startUTCDateTimeNumber = 0;
    var userEndDate = '';
    var userEndTime = '';
    var endUTCDateTimeNumber = 0;
    var LastDay = moment().subtract(1, 'days')
    // Last Week
    var lastWeekStartingDate = moment().subtract(1, 'weeks').startOf('week');
    var lastWeekEndingDate = moment().subtract(1, 'weeks').endOf('week');
    async.series([
      function (callback) {
        switch (byDateType) {
          case 'Today':
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('day');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Week':
            userStartDate = utcMoment.startOf('week');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('week');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Month':
            userStartDate = utcMoment.startOf('month');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('month');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Year':
            userStartDate = utcMoment.startOf('year');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('year');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'LastWeek':
            userStartDate = lastWeekStartingDate;
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = lastWeekEndingDate;
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'LastDay':
            userStartDate = LastDay.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = LastDay.endOf('day');
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          default:
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('day');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
        }
      }
    ], function (err, result) {
      if (err) {
        logger.error('There was an Un-known Error occured in daos/SP-HomeScreenService.js, at getSPBookingsCountBookingsList:' + err);
      }
      SP_HomeScreenDAO.getSPBookingsCountBookingsList(pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
        if (error) {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj.statusCode === '0000') {
          callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
        } else {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
        }
      });
    });
  },
  // --- End getSPBookingsCountBookingsList:

  // --- Begin getSPBookingsCountCancelledList:
  getSPBookingsCountCancelledList: function (byDateType, pageNumber, searchString, tokendecodedData, callback) {
    var utcMoment = moment();
    var userStartDate = '';
    var userStartTime = '';
    var startUTCDateTimeNumber = 0;
    var userEndDate = '';
    var userEndTime = '';
    var endUTCDateTimeNumber = 0;
    var LastDay = moment().subtract(1, 'days')
    // Last Week
    var lastWeekStartingDate = moment().subtract(1, 'weeks').startOf('week');
    var lastWeekEndingDate = moment().subtract(1, 'weeks').endOf('week');
    async.series([
      function (callback) {
        switch (byDateType) {
          case 'Today':
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('day');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Week':
            userStartDate = utcMoment.startOf('week');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('week');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Month':
            userStartDate = utcMoment.startOf('month');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('month');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Year':
            userStartDate = utcMoment.startOf('year');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('year');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'LastWeek':
            userStartDate = lastWeekStartingDate;
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = lastWeekEndingDate;
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'LastDay':
            userStartDate = LastDay.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = LastDay.endOf('day');
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          default:
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('day');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
        }
      }
    ], function (err, result) {
      if (err) {
        logger.error('There was an Un-known Error occured in daos/SP-HomeScreenService.js, at getSPBookingsCountCancelledList:' + err);
      }
      SP_HomeScreenDAO.getSPBookingsCountCancelledList(pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
        if (error) {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj.statusCode === '0000') {
          callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
        } else {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
        }
      });
    });
  },
  // --- End getSPBookingsCountCancelledList:

  // --- Begin getSPBookingsAmountsList:
  getSPBookingsAmountsList: function (byDateType, pageNumber, searchString, tokendecodedData, callback) {
    var utcMoment = moment();
    var userStartDate = '';
    var userStartTime = '';
    var startUTCDateTimeNumber = 0;
    var userEndDate = '';
    var userEndTime = '';
    var endUTCDateTimeNumber = 0;
    var LastDay = moment().subtract(1, 'days')
    // Last Week
    var lastWeekStartingDate = moment().subtract(1, 'weeks').startOf('week');
    var lastWeekEndingDate = moment().subtract(1, 'weeks').endOf('week');
    async.series([
      function (callback) {
        switch (byDateType) {
          case 'Today':
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('day');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Week':
            userStartDate = utcMoment.startOf('week');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('week');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Month':
            userStartDate = utcMoment.startOf('month');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('month');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Year':
            userStartDate = utcMoment.startOf('year');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('year');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'LastWeek':
            userStartDate = lastWeekStartingDate;
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = lastWeekEndingDate;
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'LastDay':
            userStartDate = LastDay.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = LastDay.endOf('day');
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          default:
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('day');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
        }
      }
    ], function (err, result) {
      if (err) {
        logger.error('There was an Un-known Error occured in daos/SP-HomeScreenService.js, at getSPBookingsAmountsList:' + err);
      }
      SP_HomeScreenDAO.getSPBookingsAmountsList(pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
        if (error) {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj.statusCode === '0000') {
          callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
        } else {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
        }
      });
    });
  },
  // --- End getSPBookingsAmountsList:

  // --- Begin getSPHomeScreenBlockedDatesList:
  getSPHomeScreenBlockedDatesList: function (byDateType, pageNumber, searchString, tokendecodedData, callback) {
    var utcMoment = moment();
    var userStartDate = '';
    var userStartTime = '';
    var startUTCDateTimeNumber = 0;
    var userEndDate = '';
    var userEndTime = '';
    var endUTCDateTimeNumber = 0;
    var LastDay = moment().subtract(1, 'days')
    // Last Week
    var lastWeekStartingDate = moment().subtract(1, 'weeks').startOf('week');
    var lastWeekEndingDate = moment().subtract(1, 'weeks').endOf('week');
    async.series([
      function (callback) {
        switch (byDateType) {
          case 'Today':
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('day');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Week':
            userStartDate = utcMoment.startOf('week');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('week');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Month':
            userStartDate = utcMoment.startOf('month');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('month');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'Year':
            userStartDate = utcMoment.startOf('year');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('year');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'LastWeek':
            userStartDate = lastWeekStartingDate;
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = lastWeekEndingDate;
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          case 'LastDay':
            userStartDate = LastDay.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            userEndDate = LastDay.endOf('day');
            userEndTime = userEndDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(userEndTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
          default:
            userStartDate = utcMoment.startOf('day');
            userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
            startUTCDateTimeNumber = moment(userStartTime).valueOf();
            endStartDate = utcMoment.endOf('day');
            endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
            endUTCDateTimeNumber = moment(endStartTime).valueOf();
            callback(null, startUTCDateTimeNumber, endUTCDateTimeNumber);
            break;
        }
      }
    ], function (err, result) {
      if (err) {
        logger.error('There was an Un-known Error occured in daos/SP-HomeScreenService.js, at getSPBookingsAmountsList:' + err);
      }
      SP_HomeScreenDAO.getSPHomeScreenBlockedDatesList(pageNumber, searchString, startUTCDateTimeNumber, endUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
        if (error) {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj.statusCode === '0000') {
          callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
        } else {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
        }
      });
    });
  }
  // --- End getSPHomeScreenBlockedDatesList:
}
