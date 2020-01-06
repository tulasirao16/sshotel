/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
var commonService = require('./CommonService');
var SP_RateHostDAO = require('../daos/SP-RateHostDAO');
var EU_ReviewRatings = require('../models/EU-ReviewRatings');
var moment = require('moment');

// --- Begin:  SP RateHost
module.exports = {

    getSPUsersHostRatings: function (pageNum, searchString, byDateType, tokendecodedData, callback) {
        var query = {};
        if (byDateType == 'All') {
            query = {
                'spServiceProviderId': tokendecodedData.uspid,
                'isDeleted': false,
                '$or': [
                    { spServiceProvider: { $regex: searchString, $options: 'i' } },
                    { reviewHeadline: { $regex: searchString, $options: 'i' } },
                    { reviewComments: { $regex: searchString, $options: 'i' } },
                    { reviewStatus: { $regex: searchString, $options: 'i' } },
                    { bookingCode: { $regex: searchString, $options: 'i' } }
                ]
            }; 
        } 
        else {
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
            switch (byDateType) {
                case 'Today':
                  userStartDate = utcMoment.startOf('day');
                  userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
                  startUTCDateTimeNumber = moment(userStartTime).valueOf();
                  endStartDate = utcMoment.endOf('day');
                  endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
                  endUTCDateTimeNumber = moment(endStartTime).valueOf();
                  break;
                case 'Week':
                  userStartDate = utcMoment.startOf('week');
                  userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
                  startUTCDateTimeNumber = moment(userStartTime).valueOf();
                  endStartDate = utcMoment.endOf('week');
                  endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
                  endUTCDateTimeNumber = moment(endStartTime).valueOf();
                  break;
                case 'Month':
                  userStartDate = utcMoment.startOf('month');
                  userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
                  startUTCDateTimeNumber = moment(userStartTime).valueOf();
                  endStartDate = utcMoment.endOf('month');
                  endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
                  endUTCDateTimeNumber = moment(endStartTime).valueOf();
                  break;
                case 'Year':
                  userStartDate = utcMoment.startOf('year');
                  userStartTime = userStartDate.format('YYYY-MM-DD HH:mm');
                  startUTCDateTimeNumber = moment(userStartTime).valueOf();
                  endStartDate = utcMoment.endOf('year');
                  endStartTime = endStartDate.format('YYYY-MM-DD HH:mm');
                  endUTCDateTimeNumber = moment(endStartTime).valueOf();
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
                  break;
            }
            query = {
                'spServiceProviderId': tokendecodedData.uspid,
                'isDeleted': false,
                'createdAt': {$gte: startUTCDateTimeNumber},
                '$or': [
                    { spServiceProvider: { $regex: searchString, $options: 'i' } },
                    { reviewHeadline: { $regex: searchString, $options: 'i' } },
                    { reviewComments: { $regex: searchString, $options: 'i' } },
                    { reviewStatus: { $regex: searchString, $options: 'i' } },
                    { bookingCode: { $regex: searchString, $options: 'i' } }
                ]
            };
        }
       SP_RateHostDAO.getSPUsersHostRatings(pageNum, query, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    spUsersReviewRatingData: function(reviewId, reviewStatus, tokenDecodedData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var updateObj = {
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString,
        reviewStatus: reviewStatus
     };
    
    SP_RateHostDAO.spUsersReviewRatingData(reviewId, updateObj, tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  }

}

