/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var CommonService = require('../services/CommonService');
var EU_RateHostService = require('../services/EU-RateHostService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function(app, passport) {
    //Begin End User Rate Host Controller
    app.get('/api/v1/eu/user/host/ratings/:bookingCode', function(req, res, next) {
        var bookingCode = req.params.bookingCode;
        if(req.headers.token && req.params.bookingCode) {
            CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
            if(tokenDecodedData && !tokenDecodedData.expStatus) {
                EU_RateHostService.getEndUsersHostRatings( bookingCode, tokenDecodedData.decodedTokenData, function(resObj) {
                    utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                });
            } 
            else if(tokenDecodedData && tokenDecodedData.expStatus) {
              logger.error('There was an Error in controllers/EU-BookingsRatingsController.js at get API -',
              ' /api/v1/eu/user/bookings/raitngs:searchString?: Token expired');
              utils.sendResponse(res, 400, '9995', {});
            } else {
              logger.error('There was an Error in controllers/EU-BookingsRatingsController.js at get API -',
              '  /api/v1/eu/user/bookings/raitngs:searchString?: Token decode failed');
              utils.sendResponse(res, 400, '9996', {});
            }
          });
        } 
    });

    //Begin End User Rate Your Host Post

    app.post('/api/v1/eu/user/host/ratings', function(req, res, next) {
        var bodyValidation = EUBodyValidation(req.body);
        if(bodyValidation && req.headers.token) {
            CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
                if(tokenDecodedData && !tokenDecodedData.expStatus) {
                    EU_RateHostService.setEndUserReviews(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if(tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/EU-RateHost Controller.js at post API -',
                    ' /api/v1/eu/user/host/raitngs: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Un-known Error in controllers/EU-RateHost Controller.js at post API -',
                    ' /api/v1/eu/user/host/raitngs: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/EU-RateHost Controller.js, at post API -',
            '/api/v1/eu/user/host/raitngs: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    //Begin End User Rate Your Host Post
    app.put('/api/v1/eu/user/host/update/ratings', function(req, res, next) {
        var bodyValidation = customerReviewBodyValidation(req.body);
        if(bodyValidation && req.body.bookingCode && req.headers.token) {
            CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
                if(tokenDecodedData && !tokenDecodedData.expStatus) {
                    EU_RateHostService.updateCustomerReviews(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if(tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/EU-RateHost Controller.js at put API -',
                    ' /api/v1/eu/user/host/raitngs: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Un-known Error in controllers/EU-RateHost Controller.js at put API -',
                    ' /api/v1/eu/user/host/raitngs: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/EU-RateHost Controller.js, at put API -',
            ' /api/v1/eu/user/host/raitngs: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
}

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function EUBodyValidation(reqBodyObj) {
    if(reqBodyObj.euName && reqBodyObj.spServiceProviderId && reqBodyObj.spServiceProvider 
       && reqBodyObj.spLocationId && reqBodyObj.bookingCode && reqBodyObj.rating && reqBodyObj.reviewHeadline
       && reqBodyObj.reviewComments && reqBodyObj.spPropertyId && reqBodyObj.spPropertyInfoId) {
        return true;
    } else
        return false;
}

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function customerReviewBodyValidation(reqBodyObj) {
    if(reqBodyObj.rating && reqBodyObj.reviewHeadline && reqBodyObj.reviewComments && reqBodyObj.bookingCode) {
        return true;
    } else
        return false;
}