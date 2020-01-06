/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var CommonService = require('../services/CommonService');
var AD_HostsReviewRatingsService = require('../services/AD-HostsReviewRatingsService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// BEGIN : AD-HostsReviewRatingsController
module.exports.controller = function (app, passport) {

  // BEGIN GET API : '/api/v1/ad/hosts/review/ratings/list/:hostId/:activePage/:searchString?' 
  app.get('/api/v1/ad/hosts/review/ratings/list/:hostId/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString ? req.params.searchString : '';
    if (req.headers.token && req.params.hostId && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsReviewRatingsService.getHostsReviewRatings(req.params.hostId, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsReviewRatingsController.js at get API -'+
            '/api/v1/ad/hosts/review/ratings/list/:hostId/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        }
        else {
          logger.error('There was an Un-known Error in controllers/AD-HostsReviewRatingsController.js at get API -'+
            ' /api/v1/ad/hosts/review/ratings/list/:hostId/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsReviewRatingsController.js at get API -'+
        ' /api/v1/ad/hosts/review/ratings/list/:hostId/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }

  });
  // END GET API : '/api/v1/ad/hosts/review/ratings/list/:hostId/:activePage/:searchString?'

  // BEGIN PUT API :'/api/v1/ad/hosts/review/ratings/active/status/:recordID'
  app.put('/api/v1/ad/hosts/review/ratings/active/status/:recordID', function (req, res, callback) {
    if (req.headers.token && req.params.recordID && req.body.status) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsReviewRatingsService.hostsReviewRatingsActiveStatus(req.params.recordID, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsReviewRatingsController.js at put API -' +
            '/api/v1/ad/hosts/review/ratings/active/status/:recordID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsReviewRatingsController.js at put API -' +
            '/api/v1/ad/hosts/review/ratings/active/status/:recordID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsReviewRatingsController.js at put API -' +
        '/api/v1/ad/hosts/review/ratings/active/status/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  //END PUT API : '/api/v1/ad/hosts/review/ratings/active/status/:recordID'

  // BEGIN GET API : '/api/v1/ad/host/user/ratings/update/:reviewId
  app.put('/api/v1/ad/host/user/ratings/update/:reviewId', function(req, res, next) {
    var bodyValidation = ReviewBodyValidation(req.body);
    if(req.params.reviewId && bodyValidation&&  req.headers.token != 'undefined') {
        CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
            AD_HostsReviewRatingsService.ADHostUsersReviewRatingData(req.params.reviewId, req.body,
        tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
        });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
        logger.error('There was an Error in controllers/AD-HostRateController.js.js at put API -'+
        '/api/v1/ad/host/user/ratings/update/:reviewId: Token expired');
        utils.sendResponse(res, 400, '9995', {});
        } else {
        logger.error('There was an Un-known Error in controllers/AD-HostRateController.js.js at put API -'+
        '/api/v1/ad/host/user/ratings/update/:reviewId: Token decode failed');
        utils.sendResponse(res, 400, '9996', {});
        }
    });
    } else {
    logger.error('There was an Error in controllers/AD-HostRateControllerjs.js at put API -'+
    '/api/v1/ad/host/user/ratings/update/:reviewId: Missing mandatory fields data');
    utils.sendResponse(res, 400, '9998', {});
    }
});
// END GET API : '/api/v1/ad/host/user/ratings/update/:reviewId'
}

// END : AD-HostsReviewRatingsController

/**
* @param {object} reqBodyObj object
* @return {boolean} boolean
*/
function ReviewBodyValidation(reqBodyObj) {
  if(reqBodyObj.rating && reqBodyObj.reviewHeadline && reqBodyObj.reviewComments) {
      return true;
  } else
      return false;
}