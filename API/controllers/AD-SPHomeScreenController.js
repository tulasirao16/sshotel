
/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var AD_SPHomeScreenService = require('../services/AD-SPHomeScreenService');
var CommonService = require('../services/CommonService');

// --- Begin: AD-HomeScreenController
module.exports.controller = function (app, passport) {
  // ----- Begin: /api/v1/ad/serviceprovider/homescreen/user/counts'
  app.get('/api/v1/ad/serviceprovider/homescreen/user/counts/:hostId', function (req, res, next) {
    if (req.headers.token && req.params.hostId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_SPHomeScreenService.getSPHomeScreenUsersCount(req.params.hostId, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-SPHomeScreenController.js at get API -' +
            '/api/v1/ad/serviceprovider/homescreen/user/counts: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-SPHomeScreenController.js at get API -' +
            '/api/v1/ad/serviceprovider/homescreen/user/counts: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-SPHomeScreenController.js, at get API -' +
        '/api/v1/ad/serviceprovider/homescreen/user/counts: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End: /api/v1/ad/serviceprovider/homescreen/user/counts'

  // ----- Begin: /api/v1/ad/serviceprovider/homescreen/booking/amounts/list/:hostId/:bookingAmountStatus/:activePage/:searchString?'
  app.get('/api/v1/ad/serviceprovider/homescreen/booking/amounts/list/:hostId/:bookingAmountStatus/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    if (req.headers.token && pageNumber && req.params.hostId && req.params.bookingAmountStatus) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_SPHomeScreenService.getSPBookingsAmountsList(req.params.hostId, req.params.bookingAmountStatus, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-SPHomeScreenController.js at get API -' +
            '/api/v1/ad/serviceprovider/homescreen/booking/amounts/list/:hostId/:bookingAmountStatus/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-SPHomeScreenController.js at get API -' +
            '/api/v1/ad/serviceprovider/homescreen/booking/amounts/list/:hostId/:bookingAmountStatus/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-SPHomeScreenController.js, at get API -' +
        '/api/v1/ad/serviceprovider/homescreen/booking/amounts/list/:hostId/:bookingAmountStatus/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End: /api/v1/ad/serviceprovider/homescreen/booking/amounts/list/:hostId/:bookingAmountStatus/:activePage/:searchString

}