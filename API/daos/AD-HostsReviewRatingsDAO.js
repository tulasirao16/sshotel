/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var moment = require('moment');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var EU_ReviewRatings = require('../models/EU-ReviewRatings');

// BEGIN : AD-HostsReviewRatingsDAO
module.exports = {

    // BEGIN : getHostsReviewRatings   

    getHostsReviewRatings: function (hostId, pageNumber, searchString, tokenDecodedData, callback) {
        var utcMoment = moment.utc();
        var istMoment = utcMoment.add(5, 'hours').add(30, 'minutes');
        var endStartDate = istMoment.endOf('day');
        var endStartTime = endStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        var endUTCDateTimeNumber = moment(endStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
        var userStartDate = istMoment.startOf('day');
        var userStartTime = userStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        var startUTCDateTimeNumber = moment(userStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
        if (hostId === 'null') {
            var query = {
                'isDeleted': false, createdAt: { $gte: startUTCDateTimeNumber },
                '$or': [
                    { 'euName': { $regex: searchString, $options: 'i' } },
                    { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
                    { 'reviewHeadline': { $regex: searchString, $options: 'i' } },
                    { 'bookingCode': { $regex: searchString, $options: 'i' } }
                ]
            }
        } else {
        var query = {
            'spServiceProviderId': hostId,
            'isDeleted': false,
            '$or': [
                { 'euName': { $regex: searchString, $options: 'i' } },
                { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
                { 'reviewHeadline': { $regex: searchString, $options: 'i' } },
                { 'bookingCode': { $regex: searchString, $options: 'i' } }
            ]
        }
    }
        EU_ReviewRatings.find(query)
            .sort({ 'createdAt': -1 })
            .populate('spPropertyId')
            .populate('spLocationId')
            .skip((pageNumber - 1) * 30)
            .limit(30).exec(function (error, resObj) {
                if (error) {
                    logger.error('There was an Un-known Error occured in daos/AD-HostsReviewRatingsDAO.js,'+
                        ' at getHostsReviewRatings of hostsReviewRatings query:', error);
                    callback({ httpCode: 500, statusCode: '9999', result: {} });
                } else if (resObj && resObj.length > 0) {
                    EU_ReviewRatings.countDocuments(query).
                        exec(function (errorCount, resultCount) {
                            if (errorCount) {
                                logger.error('There was an Un-known Error occured in daos/AD-HostsReviewRatingsDAO.js, at getHostsReviewRatings of countDocuments:'+ errorCount);
                                callback({ httpCode: 500, statusCode: '9999', result: {} });
                            } else if (resultCount) {
                                var resultObj = { totalDocs: resultCount, reviewsData: resObj };
                                callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                            } else {
                                callback({ httpCode: 400, statusCode: '9997', result: {} });
                            }
                        });
                } else {
                    callback({ httpCode: 400, statusCode: '9997', result: {} });
                }
            });
    },
    // END : getHostsReviewRatings

    // BEGIN : hostsReviewRatingsActiveStatus   
    hostsReviewRatingsActiveStatus: function (updateObj, recordID, tokenDecodedData, callback) {
        var query = { _id: recordID, isDeleted: false };
        EU_ReviewRatings.findOneAndUpdate(query, { $set: updateObj }, { new: true }, function (error, resObj) {
            if (error) {
                logger.error('There was an Un-konwn Error occured in daos/AD-HostsReviewRatingsDAO.js, at updateADHostsReviewRatingsActiveStatus:' + error);
                callback({ httpCode: 400, statusCode: '9900', result: {} });
            } else if (resObj && resObj._id) {
                AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', { name: config.collectionHostsReviewRatings, id: resObj._id, value: 'Admin Hosts ReviewRatings Active status' }, updateObj);
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9992', result: {} });
            }
        });
    },

    // END : hostsReviewRatingsActiveStatus  

    // BEGIN : ADHostUsersReviewRatingData   
    ADHostUsersReviewRatingData: function(reviewId, UpdateReviewObj, tokenDecodedData, callback) {
        var query = {
            '_id': reviewId,
            'isDeleted': false
        };
        EU_ReviewRatings.findOneAndUpdate(query, {$set: UpdateReviewObj}, {new: true})
        .exec(function(error, resObj) {
          if (error) {
            logger.error('There was an Un-known Error occured in daos/AD-HostrateDAO.js, at ADHostUsersReviewRatingData,' +
            'at ADHostUsersReviewRatingData', error);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if (resObj) {
            AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionEndUserReviewRatings, id: resObj._id, value: resObj.reviewHeadline }, UpdateReviewObj);
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          } else {
            callback({ httpCode: 400, statusCode: '9994', result: {} });
          }
        });
    },
    // END : ADHostUsersReviewRatingData
}

// END : AD-HostsReviewRatingsDAO