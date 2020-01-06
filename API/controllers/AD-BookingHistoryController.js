/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var AD_BookingHistoryService = require('../services/AD-BookingHistoryService');

// --- Begin: AD-BookingHistoryController
module.exports.controller = function (app, passport) {
  // --- Begin '/api/v1/ad/booking/history/list/:activePage/:searchString?'
  app.get('/api/v1/ad/booking/history/list/:activePage/:searchString?', function (req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = req.params.searchString == 'undefined' || !req.params.searchString ? '' : req.params.searchString;
    if (req.headers.token && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_BookingHistoryService.getADbookingSearch(tokenDecodedData.decodedTokenData, pageNum, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-BookingHistoryController.js at get API -' +
            '/api/v1/ad/booking/history/list/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-BookingHistoryController.js at get API -' +
            '/api/v1/ad/booking/history/list/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-BookingHistoryController.js at get API -' +
        '/api/v1/ad/booking/history/list/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/booking/history/list/:activePage/:searchString?'

  // --- Begin '/api/v1/ad/booking/history/bysearch/:activePage/:searchString'
  app.get('/api/v1/ad/booking/history/bysearch/:activePage/:searchString', function (req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = (req.params.searchString === 'undefined') || (!req.params.searchString) ? '' : req.params.searchString;
    if (req.headers.token && pageNum && searchString) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_BookingHistoryService.getADbookingSearch(tokenDecodedData.decodedTokenData, pageNum, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-BookingHistoryController.js at get API -' +
            '/api/v1/ad/booking/history/bysearch/:activePage/:searchString: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-BookingHistoryController.js at get API -' +
            '/api/v1/ad/booking/history/bysearch/:activePage/:searchString: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-BookingHistoryController.js at get API -' +
        '/api/v1/ad/booking/history/bysearch/:activePage/:searchString: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/booking/history/:activePage/:searchString?'
}
// --- End: AD-BookingHistoryController
