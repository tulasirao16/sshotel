/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var EU_ReviewRatings = require('../models/EU-ReviewRatings');

module.exports = {
    //Begin SpRateyour DAO
    getSPUsersHostRatings: function (pageNum, query, callback) {
        EU_ReviewRatings.find(query).skip((pageNum - 1) * 10).limit(10)
        .sort({ 'status': 1, 'createdAt': -1 }).populate("spLocationId")
        .exec(function (error, resultArray) {
            if (error) {
                logger.error('There was an Un-known Error occured in daos/SP-RateHostDAO.js, at getSPUsersHostRatings:', error);
                callback(error, { statusCode: '9999', result: {} });
            } else if (resultArray && resultArray.length > 0) {
                EU_ReviewRatings.countDocuments(query).exec(function (errorCount, resultCount) {
                    if (errorCount) {
                        logger.error('There was an Un-known Error occured in daos/SP-RateHostDAO.js, at getSPUsersHostRatings:', errorCount);
                        callback(errorCount, { statusCode: '9999', result: {} });
                    } else if (resultCount) {
                        var resultObj = { totalDocs: resultCount, myreviews: resultArray };
                        callback(errorCount, { statusCode: '0000', result: resultObj });
                    } else {
                        callback(errorCount, { statusCode: '9997', result: {} });
                    }
                });
            } else {
                callback(error, { statusCode: '9997', result: {} });
            }
        });
    },
    spUsersReviewRatingData: function(reviewId, updateObj, tokenDecodedData, callback) {
        var query = {
            '_id': reviewId,
            'spServiceProviderId': tokenDecodedData.uspid,
            'isDeleted': false
        };
        EU_ReviewRatings.findOneAndUpdate(query, {$set: updateObj}, {new: true})
        .exec(function(error, resObj) {
          if (error) {
            logger.error('There was an Un-known Error occured in daos/SP-RateHostDAO.js, at spUsersReviewRatingData,' +
            'at spUsersReviewRatingData', error);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if (resObj) {
            AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionEndUserReviewRatings, id: resObj._id, value: resObj.reviewHeadline }, updateObj);
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          } else {
            callback({ httpCode: 400, statusCode: '9994', result: {} });
          }
        });
    },

}