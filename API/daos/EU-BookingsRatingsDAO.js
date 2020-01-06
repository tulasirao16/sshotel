/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var EU_BookingsReviewRatings = require('../models/EU-ReviewRatings');

module.exports = {
  //Begin EU-Bookings Ratings DAO
  getEndUsersBookingsRatings:function(searchString, tokendecodeddata, callback) {
    var query = {
      'euUserId': tokendecodeddata.iss,
      'isDeleted': false,
      '$or': [
        {spServiceProvider: {$regex: searchString, $options: 'i'}},
        {bookingCode: {$regex: searchString, $options: 'i'}},
        {reviewHeadline: {$regex: searchString, $options: 'i'}},
        {reviewComments: {$regex: searchString, $options: 'i'}},
        {euName: {$regex: searchString, $options: 'i'}}
      ]
    }
    EU_BookingsReviewRatings.find(query)
    .populate('spLocationId')
    .populate('spPropertyInfoId')
    .populate('euUserId', { euUserId: 1, userIconPath: 1})
    .sort({'createdAt': -1 })
    .exec(function(error, data) {
      if(error) {
        logger.error('There was an Error occured in daos/EU-BookingsRatingsDAO.js, getEndUsersBookingsRatings:' + error);
        callback(error,{ httpCode: 500, statusCode: '9999', result: {}});
      } else if(data && data.length > 0) {
        callback(error, { httpCode: 200, statusCode: '0000', result: data});
      } else {
        callback(error, {httpCode: 400, statusCode: '9997', result: {}});
      }
    });
  },
}