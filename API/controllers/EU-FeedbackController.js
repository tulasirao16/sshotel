/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var CommonService = require('../services/CommonService');
var EU_FeedbackService = require('../services/EU-FeedbackService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function(app, passport) {
    //Begin End User Bookings Feedback Controller
    app.get('/api/v1/eu/user/feedback/:searchString?', function(req, res, next) {
        var searchString = req.params.searchString;
        if(!req.params.searchString || req.params.searchString == 'undefined') {
          searchString = '';
        }
        if(req.headers.token) {
            CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
            if(tokenDecodedData && !tokenDecodedData.expStatus) {
                EU_FeedbackService.getEndUsersFeedback( searchString, tokenDecodedData.decodedTokenData, function(resObj) {
                    utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                });
            } 
            else if(tokenDecodedData && tokenDecodedData.expStatus) {
              logger.error('There was an Error in controllers/EU-FeedbackController.js at get API -',
              ' /api/v1/eu/user/feedback/:searchString?: Token expired');
              utils.sendResponse(res, 400, '9995', {});
            } else {
              logger.error('There was an Error in controllers/EU-FeedbackController.js at get API -',
              ' /api/v1/eu/user/feedback/:searchString?: Token decode failed');
              utils.sendResponse(res, 400, '9996', {});
            }
          });
        } else {
          logger.error('There was an Error in controllers/EU-FeedbackController.js at get API -',
          ' /api/v1/eu/user/feedback/:searchString?: Missing Mandatory Fields');
          utils.sendResponse(res, 400, '9998', {});
        }
        
    });
    // End End User Bookings Feedback Controller 
    // Begin ---End User Bookings Feedback by bookingcode
    app.get('/api/v1/eu/user/record/feedback/:bookingCode', function(req, res, next) {

      var bookingCode = req.params.bookingCode;
      if(req.headers.token && req.params.bookingCode) {
          CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
          if(tokenDecodedData && !tokenDecodedData.expStatus) {
            EU_FeedbackService.getEndUsersHostRatingsRecord( bookingCode, tokenDecodedData.decodedTokenData, function(resObj) {
                  utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
          } 
          else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/EU-FeedbackController.js at get API -',
            ' /api/v1/eu/user/record/feedback/:bookingCode: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/EU-FeedbackController.js at get API -',
            ' /api/v1/eu/user/record/feedback/:bookingCode: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } 
  });
   // End ---End User Bookings Feedback by bookingcode
   // Begin -- End User Bookings Feedback Put
   app.put('/api/v1/eu/user/update/feedback', function(req, res, next) {
    var bodyValidation = customerFeedbackBodyValidation(req.body);
    if(bodyValidation && req.body.bookingCode && req.headers.token) {
        CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
            if(tokenDecodedData && !tokenDecodedData.expStatus) {
              EU_FeedbackService.updateCustomerFeedback(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
                    utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                });
            } else if(tokenDecodedData && tokenDecodedData.expStatus) {
                logger.error('There was an Error in controllers/EU-FeedbackController.js at put API -',
                ' /api/v1/eu/user/feedback: Token expired');
                utils.sendResponse(res, 400, '9995', {});
            } else {
                logger.error('There was an Un-known Error in controllers/EU-FeedbackController.js at put API -',
                ' /api/v1/eu/user/feedback: Token decode failed');
                utils.sendResponse(res, 400, '9996', {});
            }
        });
    } else {
        logger.error('There was an Error in controllers/EU-FeedbackController.js, at put API -',
        '/api/v1/eu/user/feedback: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
});
// End -- End User Bookings Feedback Put
// Begin -- End User Bookings Feedback Post
app.post('/api/v1/eu/user/feedback', function(req, res, next) {
  var bodyValidation = EuFeedbackBodyValidation(req.body);
  if(bodyValidation && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
          if(tokenDecodedData && !tokenDecodedData.expStatus) {
            EU_FeedbackService.setEndUseFeedback(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
                  utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
          } else if(tokenDecodedData && tokenDecodedData.expStatus) {
              logger.error('There was an Error in controllers/EU-FeedbackController.js at post API -',
              ' /api/v1/eu/user/feedback: Token expired');
              utils.sendResponse(res, 400, '9995', {});
          } else {
              logger.error('There was an Un-known Error in controllers/EU-FeedbackController.js at post API -',
              ' /api/v1/eu/user/feedback: Token decode failed');
              utils.sendResponse(res, 400, '9996', {});
          }
      });
  } else {
      logger.error('There was an Error in controllers/EU-FeedbackController.js, at post API -',
      '/api/v1/eu/user/feedback: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
  }
});
// End -- End User Bookings Feedback Post
// Begin -- End User Feedback delete
app.delete('/api/v1/eu/user/delete/feedback', function(req, res, next) {
    if (req.body.bookingCode && req.headers.token) {
       CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
         if (tokenDecodedData && !tokenDecodedData.expStatus) {
            EU_FeedbackService.endUserDeleteFeedback(req.body.bookingCode, tokenDecodedData.decodedTokenData, function(resObj) {
             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
           });
         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
           logger.error('There was an Error in controllers/EU-FeedbackController.js at delete API -',
             ' /api/v1/eu/user/delete/feedback: Token expired');
           utils.sendResponse(res, 400, '9995', {});
         } else {
           logger.error('There was an Un-known Error in controllers/EU-FeedbackController.js at delete API -',
             ' /api/v1/eu/user/delete/feedback: Token decode failed');
           utils.sendResponse(res, 400, '9996', {});
         }
       });
     } else {
       logger.error('There was an Error in controllers/EU-FeedbackController.js at delete API -',
         ' /api/v1/eu/user/delete/feedback: Missing mandatory fields data');
       utils.sendResponse(res, 400, '9998', {});
     }
   });
}

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function customerFeedbackBodyValidation(reqBodyObj) {
  if(reqBodyObj.feedbackType && reqBodyObj.feedbackTitle && reqBodyObj.feedbackMessage && reqBodyObj.bookingCode) {
      return true;
  } else
      return false;
}

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function EuFeedbackBodyValidation(reqBodyObj) {
  if(reqBodyObj.spServiceProviderId && reqBodyObj.spServiceProvider 
     && reqBodyObj.bookingCode && reqBodyObj.feedbackType && reqBodyObj.feedbackTitle
     && reqBodyObj.feedbackMessage) {
      return true;
  } else
      return false;
}