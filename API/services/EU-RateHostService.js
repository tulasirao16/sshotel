/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
var commonService = require('./CommonService');
var EU_RateHostDAO = require('../daos/EU-RateHostDAO');
var EU_ReviewRatings = require('../models/EU-ReviewRatings');

// --- Begin:  EndUsers Bookings  Service
module.exports = { 

    getEndUsersHostRatings:function(bookingCode, tokendecodeddata, callback) {
        // console.log('bookingCode==services', bookingCode)
        EU_RateHostDAO.getEndUsersHostRatings(bookingCode, tokendecodeddata, function(error, resObj) {
            if (error) {
                callback({httpCode: 500, statusCode: '9999', result: {}});
            } else if(resObj.statusCode === '0000') {
                callback({httpCode: 200, statusCode: resObj.statusCode, result: resObj.result});
            } else {
                callback({httpCode: 400, statusCode: resObj.statusCode, result: resObj.result});
            }
        });
    },
    // --- Begin setEndUserReviews:
    setEndUserReviews: function(reqObj, tokenDecodedData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var EU_ReviewRatingsObj = new EU_ReviewRatings();
        EU_ReviewRatingsObj.euUserId = tokenDecodedData.iss;
        EU_ReviewRatingsObj.euName = reqObj.euName;
        EU_ReviewRatingsObj.spServiceProviderId = reqObj.spServiceProviderId;
        EU_ReviewRatingsObj.spServiceProvider = reqObj.spServiceProvider;
        EU_ReviewRatingsObj.spLocationId = reqObj.spLocationId;
        EU_ReviewRatingsObj.bookingId = reqObj.bookingId;
        EU_ReviewRatingsObj.bookingCode = reqObj.bookingCode;
        EU_ReviewRatingsObj.spPropertyId= reqObj.spPropertyId;
        EU_ReviewRatingsObj.spPropertyInfoId= reqObj.spPropertyInfoId;
        EU_ReviewRatingsObj.rating = reqObj.rating;
        EU_ReviewRatingsObj.reviewHeadline = reqObj.reviewHeadline;
        EU_ReviewRatingsObj.reviewComments = reqObj.reviewComments;
        EU_ReviewRatingsObj.reviewStatus = 'Active';
        EU_ReviewRatingsObj.isDeleted = false;
        EU_ReviewRatingsObj.createdBy = tokenDecodedData.ua;
        EU_ReviewRatingsObj.createdAt = currentUTC.currentUTCDateTimeNumber;
        EU_ReviewRatingsObj.createdOn = currentUTC.currentUTCDateTimeString;
        EU_ReviewRatingsObj.updatedBy = tokenDecodedData.ua;
        EU_ReviewRatingsObj.updatedAt = currentUTC.currentUTCDateTimeNumber;
        EU_ReviewRatingsObj.updatedOn = currentUTC.currentUTCDateTimeString;

        EU_RateHostDAO.setEndUserReviews(EU_ReviewRatingsObj, tokenDecodedData, function(error, resObj) {
            if(resObj.result._id) {
                EU_RateHostDAO.setSpPropertyInfoRating(resObj.result.spPropertyInfoId, tokenDecodedData);
                EU_RateHostDAO.setSpPropertyRating(resObj.result.spPropertyId, tokenDecodedData);
                callback({httpCode: 200, statusCode: '1050', result: resObj.result});
            }else {
                callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: {}});
            }
        });
    },
    // --- End setEndUserReviews:

    // --- start updateCustomerReviews
    updateCustomerReviews: function(reqObj, tokenDecodedData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var customerUpdateReviewObj = {
          rating: reqObj.rating,
          reviewHeadline: reqObj.reviewHeadline,
          reviewComments: reqObj.reviewComments,
          updatedBy: tokenDecodedData.ua,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedOn: currentUTC.currentUTCDateTimeString
        };
        EU_RateHostDAO.updateCustomerReviews(customerUpdateReviewObj, reqObj.bookingCode, tokenDecodedData, function(resObj) {
            callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
        });
    }
}
