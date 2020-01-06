/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
var commonService = require('./CommonService');
var EU_FeedbackDAO = require('../daos/EU-FeedbackDAO');
var Feedback = require('../models/Feedback');

// Begin --- EndUsers Feedback
module.exports = {

    getEndUsersFeedback: function (searchString, tokendecodeddata, callback) {
        EU_FeedbackDAO.getEndUsersFeedback(searchString, tokendecodeddata, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // End --- EndUsers Feedback
    //Begin -- End User Bookings Feedback by bookingcode
    getEndUsersHostRatingsRecord: function (bookingCode, tokendecodeddata, callback) {
        EU_FeedbackDAO.getEndUsersHostRatingsRecord(bookingCode, tokendecodeddata, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    //End -- End User Bookings Feedback by bookingcode
    //Begin -- updateCustomerFeedback
    updateCustomerFeedback: function (reqObj, tokenDecodedData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var customerUpdateFeedbackObj = {
            feedbackType: reqObj.feedbackType,
            feedbackTitle: reqObj.feedbackTitle,
            feedbackMessage: reqObj.feedbackMessage,
            updatedBy: tokenDecodedData.ua,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        };
        EU_FeedbackDAO.updateCustomerFeedback(customerUpdateFeedbackObj, reqObj.bookingCode, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    //End -- updateCustomerFeedback
    // Begin -- setEndUseFeedback:
    setEndUseFeedback: function (reqObj, tokenDecodedData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var FeedbackObj = new Feedback();
        FeedbackObj.euUserId = tokenDecodedData.iss,
        FeedbackObj.euName = tokenDecodedData.ua,
        FeedbackObj.spServiceProviderId = reqObj.spServiceProviderId,
        FeedbackObj.spServiceProvider = reqObj.spServiceProvider,
        FeedbackObj.spUserId = reqObj.spUserId,
        FeedbackObj.spName = reqObj.spName,
        FeedbackObj.bookingCode = reqObj.bookingCode,
        FeedbackObj.feedbackType = reqObj.feedbackType,
        FeedbackObj.feedbackTitle = reqObj.feedbackTitle,
        FeedbackObj.feedbackMessage = reqObj.feedbackMessage,
        FeedbackObj.feedbackStatus = 'Active',
        FeedbackObj.isDeleted = false,
        FeedbackObj.createdBy = tokenDecodedData.ua,
        FeedbackObj.createdAt = currentUTC.currentUTCDateTimeNumber,
        FeedbackObj.createdOn = currentUTC.currentUTCDateTimeString,
        FeedbackObj.updatedBy = tokenDecodedData.ua,
        FeedbackObj.updatedAt = currentUTC.currentUTCDateTimeNumber,
        FeedbackObj.updatedOn = currentUTC.currentUTCDateTimeString,
        EU_FeedbackDAO.setEndUseFeedback(FeedbackObj, function (error, resObj) {
            if (error) {
                callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: {} });
            } else {
                callback({ httpCode: 200, statusCode: '1050', result: resObj.result });
            }
        });
    },
    // --- End setEndUseFeedback:
    // --- Begin End User Delete Feddback
    endUserDeleteFeedback: function(bookingCode, tokenDecodedData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var feedbackDeleteObj = {
          isDeleted: true,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedBy: tokenDecodedData.ua,
          updatedOn: currentUTC.currentUTCDateTimeString
        };
        EU_FeedbackDAO.endUserDeleteFeedback(bookingCode, feedbackDeleteObj, tokenDecodedData, function(resObj) {
          callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
      }, 
}