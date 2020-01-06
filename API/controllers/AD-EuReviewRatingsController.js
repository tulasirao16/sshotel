/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var CommonService = require('../services/CommonService');
var AD_EuReviewRatingsService = require('../services/AD-EuReviewRatingsService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// BEGIN : AD-EuReviewRatingsController
module.exports.controller = function (app, passport) {

    // BEGIN GET API : '/api/v1/ad/eu/review/ratings/list/:userId/:activePage/:searchString?' 
    app.get('/api/v1/ad/eu/review/ratings/list/:userId/:activePage/:searchString?', function (req, res, next) {
        var pageNumber = parseInt(req.params.activePage);
        var searchString = req.params.searchString ? req.params.searchString : '';
        if (req.headers.token && req.params.userId && pageNumber) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_EuReviewRatingsService.getEuReviewRatings(req.params.userId, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-EuReviewRatingsController.js at get API -'+
                        '/api/v1/ad/eu/review/ratings/list/:userId/:activePage/:searchString?: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                }
                else {
                    logger.error('There was an Un-known Error in controllers/AD-EuReviewRatingsController.js at get API -'+
                        ' /api/v1/ad/eu/review/ratings/list/:userId/:activePage/:searchString?: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-EuReviewRatingsController.js at get API -'+
                ' /api/v1/ad/eu/review/ratings/list/:userId/:activePage/:searchString?: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }

    });
    // END GET API : '/api/v1/ad/eu/review/ratings/list/:userId/:activePage/:searchString?'

    // BEGIN PUT API :'/api/v1/ad/eu/review/ratings/active/status/:recordID'
    app.put('/api/v1/ad/eu/review/ratings/active/status/:recordID', function (req, res, callback) {
        if (req.headers.token && req.params.recordID && req.body.status) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_EuReviewRatingsService.euReviewRatingsActiveStatus(req.params.recordID, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-EuReviewRatingsController.js at put API -' +
                        '/api/v1/ad/eu/review/ratings/active/status/:recordID: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/AD-EuReviewRatingsController.js at put API -' +
                        '/api/v1/ad/eu/review/ratings/active/status/:recordID: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-EuReviewRatingsController.js at put API -' +
                '/api/v1/ad/eu/review/ratings/active/status/:recordID: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    //END PUT API : '/api/v1/ad/eu/review/ratings/active/status/:recordID'

    //Begin /api/v1/ad/eu/user/host/ratings/:bookingId
    app.get('/api/v1/ad/eu/user/host/ratings/:bookingId', function (req, res, next) {
        var bookingId = req.params.bookingId;
        if (req.headers.token && req.params.bookingId) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_EuReviewRatingsService.getADEndUsersHostRatings(bookingId, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                }
                else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-EuReviewRatingsController.js at get API -'+
                        ' /api/v1/ad/eu/user/host/ratings/:bookingId: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/AD-EuReviewRatingsController.js at get API -'+
                        '/api/v1/ad/eu/user/host/ratings/:bookingId: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-EuReviewRatingsController.js at put API -' +
                '/api/v1/ad/eu/user/host/ratings/:bookingId: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    //End /api/v1/ad/eu/user/host/ratings/:bookingId


    //Begin '/api/v1/ad/eu/user/ratings
    app.post('/api/v1/ad/eu/user/ratings', function (req, res, next) {
        var bodyValidation = ADEUBodyValidation(req.body);
        if (bodyValidation && req.headers.token) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_EuReviewRatingsService.setADEndUserReviews(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-EuReviewRatingsController.js at post API -' +
                        ' /api/v1/ad/eu/user/ratings: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Un-known Error in controllers/AD-EuReviewRatingsController.js at post API -' +
                        ' /api/v1/ad/eu/user/ratings: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-EuReviewRatingsController.js, at post API -' +
                '/api/v1/ad/eu/user/ratings: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    //END '/api/v1/ad/eu/user/ratings

    // BEGIN GET API : '/api/v1/ad/host/user/ratings/update/:bookingId
    app.put('/api/v1/ad/eu/user/ratings/update/:bookingId', function (req, res, next) {
        var bodyValidation = ReviewBodyValidation(req.body);
        if (req.params.bookingId && bodyValidation && req.headers.token != 'undefined') {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_EuReviewRatingsService.ADEUUsersReviewRatingData(req.params.bookingId, req.body,
                        tokenDecodedData.decodedTokenData, function (resObj) {
                            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                        });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-HostRateController.js.js at put API -' +
                        '/api/v1/ad/eu/user/ratings/update/:bookingId: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Un-known Error in controllers/AD-HostRateController.js.js at put API -' +
                        '/api/v1/ad/eu/user/ratings/update/:bookingId: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-HostRateControllerjs.js at put API -' +
                '/api/v1/ad/eu/user/ratings/update/:bookingId: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    //END GET API : '/api/v1/ad/eu/user/ratings/update/:bookingId'

}
// END : AD-EuReviewRatingsController

/**
* @param {object} reqBodyObj object
* @return {boolean} boolean
*/
function ADEUBodyValidation(reqBodyObj) {
    if (reqBodyObj.euName && reqBodyObj.spServiceProviderId && reqBodyObj.spServiceProvider
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
function ReviewBodyValidation(reqBodyObj) {
    if (reqBodyObj.rating && reqBodyObj.reviewHeadline && reqBodyObj.reviewComments) {
        return true;
    } else
        return false;
}
