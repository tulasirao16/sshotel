/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
var CommonService = require('./CommonService');
var AD_HostsReviewRatingsDAO = require('../daos/AD-HostsReviewRatingsDAO');
var EU_ReviewRatings = require('../models/EU-ReviewRatings');
var moment = require('moment');

// BEGIN : AD-HostsReviewRatingsService 
module.exports = {

    // BEGIN : getHostsReviewRatings  
    getHostsReviewRatings: function (hostId, pageNumber, searchString, tokenDecodedData, callback) {
        AD_HostsReviewRatingsDAO.getHostsReviewRatings(hostId, pageNumber, searchString, tokenDecodedData, function (resObj) {
            callback(resObj);
        });
    },
    // END : getHostsReviewRatings

    // BEGIN : hostsReviewRatingsActiveStatus    
    hostsReviewRatingsActiveStatus: function (recordID, reqBody, tokenDecodedData, callback) {
        var currentUTC = CommonService.currentUTCObj();
        var updateObj = {
            reviewStatus: reqBody.status,
            updatedBy: tokenDecodedData.ua,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        };
        AD_HostsReviewRatingsDAO.hostsReviewRatingsActiveStatus(updateObj, recordID, tokenDecodedData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    // END : hostsReviewRatingsActiveStatus  

    // --- BEGIN:  ADHostUsersReviewRatingData
    ADHostUsersReviewRatingData: function(reviewId,  reqObj, tokenDecodedData, callback) {
        var currentUTC = CommonService.currentUTCObj();
        var UpdateReviewObj = {
            rating: reqObj.rating,
            reviewHeadline: reqObj.reviewHeadline,
            reviewComments: reqObj.reviewComments,
            updatedBy: tokenDecodedData.ua,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        };
        AD_HostsReviewRatingsDAO.ADHostUsersReviewRatingData(reviewId, UpdateReviewObj, tokenDecodedData, function(resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    }
    // --- End:  ADHostUsersReviewRatingData
}

// BEGIN : AD-HostsReviewRatingsService  