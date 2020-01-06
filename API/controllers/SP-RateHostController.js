/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var CommonService = require('../services/CommonService');
var SP_RateHostService = require('../services/SP-RateHostService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function (app, passport) {
    app.get('/api/v1/sp/user/host/ratings/:byDateType/:activePage/:searchString?', function (req, res, next) {
        var pageNum = parseInt(req.params.activePage);
        var searchString = req.params.searchString;
        if (!req.params.searchString || req.params.searchString == 'undefined') {
            searchString = '';
        }
        if (req.headers.token && req.params.byDateType && pageNum) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    SP_RateHostService.getSPUsersHostRatings(pageNum, searchString, req.params.byDateType, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                }
                else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/SP-RateHostController.js at get API -' +
                        ' /api/v1/sp/user/host/ratings/:activePage/:searchString?: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/SP-RateHostController.js at get API -' +
                        '  /api/v1/sp/user/host/ratings/:activePage/:searchString?: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/SP-RateHostController.js.js at put API -',
            ' /api/v1/sp/user/host/ratings/:activePage/:searchString?: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    app.put('/api/v1/sp/user/host/ratings/status/:reviewId/:reviewStatus', function(req, res, next) {
        if(req.params.reviewId && req.params.reviewStatus && req.headers.token != 'undefined') {
            CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
            if(tokenDecodedData && !tokenDecodedData.expStatus) {
                SP_RateHostService.spUsersReviewRatingData(req.params.reviewId,req.params.reviewStatus,
              tokenDecodedData.decodedTokenData, function(resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
            } else if(tokenDecodedData && tokenDecodedData.expStatus) {
              logger.error('There was an Error in controllers/SP-RateHostController.js.js at put API -',
              ' /api/v1/sp/user/host/ratings/status: Token expired');
              utils.sendResponse(res, 400, '9995', {});
            } else {
              logger.error('There was an Un-known Error in controllers/SP-RateHostController.js.js at put API -',
              ' /api/v1/sp/user/host/ratings/status: Token decode failed');
              utils.sendResponse(res, 400, '9996', {});
            }
          });
        } else {
          logger.error('There was an Error in controllers/SP-RateHostController.js.js at put API -',
          ' /api/v1/sp/user/host/ratings/status: Missing mandatory fields data');
          utils.sendResponse(res, 400, '9998', {});
        }
      });

}

