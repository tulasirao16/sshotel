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


module.exports = {
  //Begin EU-Bookings Ratings DAO
  getEndUsersHostRatings: function (bookingCode, tokendecodeddata, callback) {
    var query = {
      'euUserId': tokendecodeddata.iss,
      'bookingCode': bookingCode,
      'isDeleted': false,
    }
    EU_ReviewRatings.find(query)
    .populate('bookingId')
    .populate('spLocationId')
    .populate('spPropertyInfoId')
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/getEndUserBookingsRatingsDAO.js,' + error);
        callback(error, { httpCode: 500, statusCode: '9999', result: {} });
      } else if (data && data.length > 0) {
        // console.log('data', data)
        callback(error, { httpCode: 200, statusCode: '0000', result: data });
      } else {
        callback(error, { httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },

  //Begin End USer Post Rating
  setEndUserReviews: function (EU_ReviewRatingsObj, decodedTokenData, callback) {
    EU_ReviewRatingsObj.save(function (error, resObj) {
      if (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
          logger.error('There was an Uniqueness Error occured in daos/EU-RateHostDAO.js, at setCustomersReviews:' + error);
          callback(error, { httpCode: 400, statusCode: '9900', result: {} });
        } else {
          logger.error('There was an Un-known Error occured in daos/RateHostDAO.js, at setCustomersReviews:' + error);
          callback(error, { httpCode: 500, statusCode: '9999', result: {} });
        }
      } else {
        AuditingInfoDAO.euAuditing(decodedTokenData, 'Create', { name: config.collectionEndUserReviewRatings, id: resObj._id, value: resObj.bookingCode }, resObj);
        callback(error, { statusCode: '1050', result: resObj });
      }
    });
  },
  //Begin --- updateCustomerReviews
  updateCustomerReviews: function (customerUpdateReviewObj, bookingCode, decodedTokenData, callback) {
    var query = { bookingCode: bookingCode, isDeleted: false };
    EU_ReviewRatings.findOneAndUpdate(query, { $set: customerUpdateReviewObj }, {new: true}, function (error, resObj) {
      if (error) {
        if (error.name == 'MongoError' && error.code === 11000) {
          callback({ httpCode: 400, statusCode: '9900', result: {} });
        } else {
          logger.error('There was an Un-known Error occured in daos/EU-RateHostDAO.js,',
            ' at updateCustomerReviews:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.euAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserReviewRatings, id: resObj._id, value: resObj.bookingCode }, customerUpdateReviewObj);
        callback({ httpCode: 200, statusCode: '1051', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  //End --- updateCustomerReviews
  // Begin -- getspServiceProviderId: Code to get service provider rating
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
        SP_PropertyInfo.findOneAndUpdate(query, { $set: { rating: data[0].avgRating } }, {new: true}, function (err, resObj) {
          if (err) {
            logger.error('There was an Error occured in daos/EU-RateHostDAO - setSpPropertyInfoRating at SP_PropertyInfo Update:', err);
          } else {
            AuditingInfoDAO.euAuditing(decodedTokenData, 'Update', { name: config.collectionSPPropertyInfos, id: spPropertyInfoId, value: resObj.roomType }, { rating: data[0].avgRating });
          }
        });
      } else {
        logger.error('There was an Error occured in daos/EU-RateHostDAO - setSpPropertyInfoRating at EU_ReviewRatings aggregate:', error);
      }
    });
  },

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
        SP_Properties.findOneAndUpdate(query, { $set: { rating: data[0].avgRating } }, {new: true}, function (err, resObj) {
          if (err) {
            logger.error('There was an Error occured in daos/EU-RateHostDAO - setSpPropertyRating at SP_Properties Update:', err);
          } else {
            AuditingInfoDAO.euAuditing(decodedTokenData, 'Update', { name: config.collectionSPProperties, id: spPropertyId, value: resObj.propertyTitle }, { rating: data[0].avgRating });
          }
        });
      } else {
        logger.error('There was an Error occured in daos/EU-RateHostDAO - setSpPropertyRating at EU_ReviewRatings aggregate:', error);
      }
    });
  },
}