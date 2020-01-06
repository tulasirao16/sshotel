/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var Feedback = require('../models/Feedback');


module.exports = {
    //  Begin -- EU-Feedback DAO
    getEndUsersFeedback: function (searchString, tokendecodeddata, callback) {
        var query = {
            'euUserId': tokendecodeddata.iss,
            'isDeleted': false,
            '$or': [
                { feedbackType: { $regex: searchString, $options: 'i' } },
                { feedbackTitle: { $regex: searchString, $options: 'i' } },
                { feedbackMessage: { $regex: searchString, $options: 'i' } },
                { feedbackOtherType: { $regex: searchString, $options: 'i' } },
                { spServiceProvider: { $regex: searchString, $options: 'i' } }
            ]
        }
        Feedback.find(query).exec(function (error, data) {
            if (error) {
                logger.error('There was an Error occured in daos/getEndUserFeedbackDAO.js,'
                    , error);
                callback(error, { httpCode: 500, statusCode: '9999', result: {} });
            } else if (data && data.length > 0) {
                callback(error, { httpCode: 200, statusCode: '0000', result: data });
            } else {
                callback(error, { httpCode: 400, statusCode: '9997', result: {} });
            }
        });
    },
    //  End -- EU-Feedback DAO
    // Begin -- End User Bookings Feedback by bookingcode
    getEndUsersHostRatingsRecord: function (bookingCode, tokendecodeddata, callback) {
        var query = {
            'euUserId': tokendecodeddata.iss,
            'bookingCode': bookingCode,
            'isDeleted': false,
        }
        Feedback.find(query).exec(function (error, data) {
            if (error) {
                logger.error('There was an Error occured in daos/getEndUserFeedbackDAO.js,'
                    , error);
                callback(error, { httpCode: 500, statusCode: '9999', result: {} });
            } else if (data && data.length > 0) {
                callback(error, { httpCode: 200, statusCode: '0000', result: data });
            } else {
                callback(error, { httpCode: 400, statusCode: '9997', result: {} });
            }
        });
    },
    // End -- End User Bookings Feedback by bookingcode
        //Begin --- updateCustomerFeedback
        updateCustomerFeedback: function(customerUpdateFeedbackObj, bookingCode, callback) {
            var query = {bookingCode: bookingCode, isDeleted: false};
            Feedback.update(query, {$set: customerUpdateFeedbackObj}, function(error, resObj) {
                if(error) {
                    if(error.name == 'MongoError' && error.code === 11000) {
                        callback({httpCode: 400, statusCode: '9900', result: {}});
                    } else {
                        logger.error('There was an Un-known Error occured in daos/putEndUserFeedbackDAO.js,',
                        ' at updateCustomerReviews:', error);
                        callback({httpCode: 500, statusCode: '9999', result: {}});
                    }
                } else if(resObj.nModified == 1) {
                    callback({httpCode: 200, statusCode: '1051', result: resObj});
                } else {
                    callback({httpCode: 400, statusCode: '9992', result: {}});
                }
            });
        },
         //End --- updateCustomerFeedback
         //Begin -- setEndUseFeedback
         setEndUseFeedback: function(FeedbackObj, callback) {
            FeedbackObj.save(function(error, resObj) {
            if(error) {
                if(error.name === 'MongoError' && error.code === 11000) {
                    logger.error('There was an Uniqueness Error occured in daos/postEndUserFeedbackDAO.js,',
                    ' at setCustomersReviews:', error);
                    callback(error, {httpCode: 400, statusCode: '9900', result: {}});
                } else {
                    logger.error('There was an Un-known Error occured in daos/postEndUserFeedbackDAO.js,',
                    ' at setCustomersReviews:', error);
                    callback(error, {httpCode: 500, statusCode: '9999', result: {}});
                }
            } else {
                callback(error, {statusCode: '1050', result: resObj});
            }
        });
    },
    // End -- setEndUseFeedback
    // Begin -- End User Feedback delete
    endUserDeleteFeedback: function(bookingCode, feedbackDeleteObj, tokenDecodedData, callback) {
        Feedback.updateMany({ 'euUserId': tokenDecodedData.iss, 'bookingCode': {'$in': bookingCode}, 'isDeleted': false }, { $set: feedbackDeleteObj })
      .exec(function(error, resObj) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/EU-FeedbackDAO.js,',
            ' at endUserDeleteFeedback of Feedback query:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj.nModified == 1) {
          callback({ httpCode: 200, statusCode: '0000', result: resObj });
        } else {
          callback({ httpCode: 400, statusCode: '9994', result: {} });
        }
      });
  },
}