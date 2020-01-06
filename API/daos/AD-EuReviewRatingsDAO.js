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
var SP_Properties = require('../models/SP-Properties');
var SP_PropertyInfo = require('../models/SP-PropertyInfo');

// BEGIN : AD-EuReviewRatingsDAO
module.exports = {

    // BEGIN : getEuReviewRatings   

    getEuReviewRatings: function (userId, pageNumber, searchString, tokenDecodedData, callback) {
        var query = {
            'euUserId': userId,
            'isDeleted': false,
            '$or': [
                { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
                { 'reviewHeadline': { $regex: searchString, $options: 'i' } },
                { 'bookingCode': { $regex: searchString, $options: 'i' } },
            ]
        }
        EU_ReviewRatings.find(query)
            .sort({ 'createdAt': -1 })
            .populate('euPropertyId')
            .populate('spLocationId')
            .skip((pageNumber - 1) * 30)
            .limit(30).exec(function (error, resObj) {
                if (error) {
                    logger.error('There was an Un-known Error occured in daos/AD-EuReviewRatingsDAO.js,',
                        ' at getEuReviewRatings of euReviewRatings query:', error);
                    callback({ httpCode: 500, statusCode: '9999', result: {} });
                } else if (resObj && resObj.length > 0) {
                    EU_ReviewRatings.countDocuments(query).
                        exec(function (errorCount, resultCount) {
                            if (errorCount) {
                                logger.error('There was an Un-known Error occured in daos/AD-EuReviewRatingsDAO.js, at getEuReviewRatings of countDocuments:', errorCount);
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
    // END : getEuReviewRatings

    // BEGIN : euReviewRatingsActiveStatus   
    euReviewRatingsActiveStatus: function (updateObj, recordID, tokenDecodedData, callback) {
        var query = { _id: recordID, isDeleted: false };
        EU_ReviewRatings.findOneAndUpdate(query, { $set: updateObj }, { new: true }, function (error, resObj) {
            if (error) {
                logger.error('There was an Un-konwn Error occured in daos/AD-EuReviewRatingsDAO.js, at updateADEuReviewRatingsActiveStatus:' + error);
                callback({ httpCode: 400, statusCode: '9900', result: {} });
            } else if (resObj && resObj._id) {
                AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', { name: config.collectionEUReviewRatings, id: resObj._id, value: 'Admin Eu ReviewRatings Active status' }, updateObj);
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9992', result: {} });
            }
        });
    },

    // END : euReviewRatingsActiveStatus  

    //Begin getADEndUsersHostRatings
    getADEndUsersHostRatings: function (bookingId, tokendecodeddata, callback) {
        var query = { bookingId: bookingId, isDeleted: false };
        EU_ReviewRatings.findOne(query).
            exec(function (error, data) {
                if (error) {
                    logger.error('There was an Error occured in daos/AD-EuReviewRatingsDAO.js,' + error);
                    callback(error, { httpCode: 500, statusCode: '9999', result: {} });
                } else if (data && data._id) {
                    callback(error, { httpCode: 200, statusCode: '0000', result: data });
                } else {
                    callback(error, { httpCode: 400, statusCode: '9997', result: {} });
                }
            });
    },
    // END :getADEndUsersHostRatings

    //Begin ----setADEndUserReviews
    setADEndUserReviews: function (EU_ReviewRatingsObj, decodedTokenData, callback) {
        EU_ReviewRatingsObj.save(function (error, resObj) {
            if (error) {
                if (error.name === 'MongoError' && error.code === 11000) {
                    logger.error('There was an Uniqueness Error occured in daos/AD-EuReviewRatingsDAO.js, at setCustomersReviews:' + error);
                    callback(error, { httpCode: 400, statusCode: '9900', result: {} });
                } else {
                    logger.error('There was an Un-known Error occured in daos/AD-EuReviewRatingsDAO.js, at setCustomersReviews:' + error);
                    callback(error, { httpCode: 500, statusCode: '9999', result: {} });
                }
            } else {
                AuditingInfoDAO.adAuditing(decodedTokenData, 'Create', { name: config.collectionEndUserReviewRatings, id: resObj._id, value: resObj.bookingCode }, resObj);
                callback(error, { statusCode: '1050', result: resObj });
            }
        });
    },
    //END----setADEndUserReviews

    // Begin -- setSpPropertyInfoRating
    setSpPropertyInfoRating: function (spPropertyInfoId, decodedTokenData) {
        EU_ReviewRatings.aggregate([
            { $match: { isDeleted: false, spPropertyInfoId: spPropertyInfoId } },
            {
                $group: {
                    _id: spPropertyInfoId,
                    avgRating: { $avg: '$rating' },
                }
            }
        ]).exec(function (error, data) {
            if (data && data.length > 0) {
                var query = { _id: spPropertyInfoId, isDeleted: false };
                SP_PropertyInfo.findOneAndUpdate(query, { $set: { rating: data[0].avgRating } }, { new: true }, function (err, resObj) {
                    if (err) {
                        logger.error('There was an Error occured in daos/AD-EuReviewRatingsDAO - setSpPropertyInfoRating at SP_PropertyInfo Update:'+ err);
                    } else {
                        AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', { name: config.collectionSPPropertyInfos, id: spPropertyInfoId, value: resObj.roomType }, { rating: data[0].avgRating });
                    }
                });
            } else {
                logger.error('There was an Error occured in daos/AD-EuReviewRatingsDAO - setSpPropertyInfoRating at EU_ReviewRatings aggregate:'+ error);
            }
        });
    },
    //END--- setSpPropertyInfoRating

    // Begin -- setSpPropertyRating
    setSpPropertyRating: function (spPropertyId, decodedTokenData) {
        EU_ReviewRatings.aggregate([
            { $match: { isDeleted: false, spPropertyId: spPropertyId } },
            {
                $group: {
                    _id: spPropertyId,
                    avgRating: { $avg: '$rating' },
                }
            }
        ]).exec(function (error, data) {
            if (data && data.length > 0) {
                var query = { _id: spPropertyId, isDeleted: false };
                SP_Properties.findOneAndUpdate(query, { $set: { rating: data[0].avgRating } }, { new: true }, function (err, resObj) {
                    if (err) {
                        logger.error('There was an Error occured in daos/AD-EuReviewRatingsDAO - setSpPropertyRating at SP_Properties Update:'+ err);
                    } else {
                        AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', { name: config.collectionADUsers, id: spPropertyId, value: resObj.propertyTitle }, { rating: data[0].avgRating });
                    }
                });
            } else {
                logger.error('There was an Error occured in daos/AD-EuReviewRatingsDAO - setSpPropertyRating at EU_ReviewRatings aggregate:'+ error);
            }
        });
    },
    //END----  setSpPropertyRating

    //Begin --- ADEUUsersReviewRatingData
    ADEUUsersReviewRatingData: function (bookingId, UpdateReviewObj, tokenDecodedData, callback) {
        var query = { bookingId: bookingId, isDeleted: false };
        EU_ReviewRatings.findOneAndUpdate(query, { $set: UpdateReviewObj }, { new: true }, function (error, resObj) {
            if (error) {
                if (error.name == 'MongoError' && error.code === 11000) {
                    callback({ httpCode: 400, statusCode: '9900', result: {} });
                } else {
                    logger.error('There was an Un-known Error occured in daos/AD-EuReviewRatingsDAO.js,'+
                        ' at ADEUUsersReviewRatingData:', error);
                    callback({ httpCode: 500, statusCode: '9999', result: {} });
                }
            } else if (resObj && resObj._id) {
                AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', { name: config.collectionADUsers, id: resObj._id, value: resObj.bookingId }, UpdateReviewObj);
                callback({ httpCode: 200, statusCode: '1051', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9992', result: {} });
            }
        });
    },
    //End --- ADEUUsersReviewRatingData
}
// END : AD-EuReviewRatingsDAO
