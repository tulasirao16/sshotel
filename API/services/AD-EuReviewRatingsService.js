/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
var CommonService = require('./CommonService');
var AD_EuReviewRatingsDAO = require('../daos/AD-EuReviewRatingsDAO');
var EU_ReviewRatings = require('../models/EU-ReviewRatings');
var moment = require('moment');

// BEGIN : AD-HostsReviewRatingsService 
module.exports = {

    // BEGIN : getEuReviewRatings  
    getEuReviewRatings: function (userId, pageNumber, searchString, tokenDecodedData, callback) {
        AD_EuReviewRatingsDAO.getEuReviewRatings(userId, pageNumber, searchString, tokenDecodedData, function (resObj) {
            callback(resObj);
        });
    },
    // END : getEuReviewRatings 

    // BEGIN : euReviewRatingsActiveStatus    
    euReviewRatingsActiveStatus: function (recordID, reqBody, tokenDecodedData, callback) {
        var currentUTC = CommonService.currentUTCObj();
        var updateObj = {
            reviewStatus: reqBody.status,
            updatedBy: tokenDecodedData.ua,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        };
        AD_EuReviewRatingsDAO.euReviewRatingsActiveStatus(updateObj, recordID, tokenDecodedData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    // END : euReviewRatingsActiveStatus

    // BEGIN : getADEndUsersHostRatings    
    getADEndUsersHostRatings: function (bookingId, tokendecodeddata, callback) {
        AD_EuReviewRatingsDAO.getADEndUsersHostRatings(bookingId, tokendecodeddata, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // END : getADEndUsersHostRatings

    // --- Begin setADEndUserReviews:
    setADEndUserReviews: function (reqObj, tokenDecodedData, callback) {
        var currentUTC = CommonService.currentUTCObj();
        var EU_ReviewRatingsObj = new EU_ReviewRatings();
        EU_ReviewRatingsObj.euUserId = reqObj.euUserId;
        EU_ReviewRatingsObj.euName = reqObj.euName;
        EU_ReviewRatingsObj.spServiceProviderId = reqObj.spServiceProviderId;
        EU_ReviewRatingsObj.spServiceProvider = reqObj.spServiceProvider;
        EU_ReviewRatingsObj.spLocationId = reqObj.spLocationId;
        EU_ReviewRatingsObj.bookingId = reqObj.bookingId;
        EU_ReviewRatingsObj.bookingCode = reqObj.bookingCode;
        EU_ReviewRatingsObj.spPropertyId = reqObj.spPropertyId;
        EU_ReviewRatingsObj.spPropertyInfoId = reqObj.spPropertyInfoId;
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
        AD_EuReviewRatingsDAO.setADEndUserReviews(EU_ReviewRatingsObj, tokenDecodedData, function (error, resObj) {
            if (resObj.result._id) {
                AD_EuReviewRatingsDAO.setSpPropertyInfoRating(resObj.result.spPropertyInfoId, tokenDecodedData);
                AD_EuReviewRatingsDAO.setSpPropertyRating(resObj.result.spPropertyId, tokenDecodedData);
                callback({ httpCode: 200, statusCode: '1050', result: resObj.result });
            } else {
                callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: {} });
            }
        });
    },
    // --- End setADEndUserReviews:
    // --- BEGIN:  ADEUUsersReviewRatingData
    ADEUUsersReviewRatingData: function (bookingId, reqObj, tokenDecodedData, callback) {
        var currentUTC = CommonService.currentUTCObj();
        var UpdateReviewObj = {
            rating: reqObj.rating,
            reviewHeadline: reqObj.reviewHeadline,
            reviewComments: reqObj.reviewComments,
            updatedBy: tokenDecodedData.ua,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        };
        AD_EuReviewRatingsDAO.ADEUUsersReviewRatingData(bookingId, UpdateReviewObj, tokenDecodedData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    }
    // --- End:  ADEUUsersReviewRatingData
}

// End : AD-HostsReviewRatingsServices