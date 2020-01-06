/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var SP_HomeScreenService = require('../services/SP-HomeScreenService');
var commonService = require('../services/CommonService');

// --- Begin: SP-HomeScreenController
module.exports.controller = function (app, passport) {

    app.get('/api/v1/sp/dashboard/counts/:byDateType', function(req, res, next) {
      if (req.headers.token) {
        commonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            SP_HomeScreenService.getSPDashboardCounts(tokenDecodedData.decodedTokenData, req.params.byDateType, function(resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -'+
              '/api/v1/sp/dashboard/counts/:byDateType: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Un-known Error in controllers/SP-HomeScreenController.js at get API -'+
              ' /api/v1/sp/dashboard/counts/:byDateType: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -'+
          ' /api/v1/sp/dashboard/counts/:byDateType: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
      }
    });

    // ----- Begin :/api/sp/homescreen/checkins/counts/bookings/list/:byDateType:activePage/:searchString?'
    app.get('/api/sp/homescreen/checkins/counts/bookings/list/:byDateType/:activePage/:searchString?', function (req, res, next) {
      var pageNumber = parseInt(req.params.activePage);
      var searchString = req.params.searchString;
      if (!req.params.searchString || req.params.searchString == 'undefined') {
          searchString = '';
      }
      if (req.headers.token && req.params.byDateType && pageNumber) {
        commonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            SP_HomeScreenService.getSPCheckInBookingsList(req.params.byDateType, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -'+
                '/api/sp/homescreen/checkins/counts/bookings/list/:byDateType/:activePage/:searchString?: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -'+
                '/api/sp/homescreen/checkins/counts/bookings/list/:byDateType/:activePage/:searchString?: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/SP-HomeScreenController.js, at get API -'+
            '/api/sp/homescreen/checkins/counts/bookings/list/:byDateType/:activePage/:searchString?: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
    // ----- End :/api/sp/homescreen/checkins/counts/bookings/list/:byDateType/:activePage/:searchString?'


    // ----- Begin :/api/sp/homescreen/checkouts/counts/bookings/list/:byDateType/:activePage/:searchString?'
    app.get('/api/sp/homescreen/checkouts/counts/bookings/list/:byDateType/:activePage/:searchString?', function (req, res, next) {
      var pageNumber = parseInt(req.params.activePage);
      var searchString = req.params.searchString;
      if (!req.params.searchString || req.params.searchString == 'undefined') {
          searchString = '';
      }
      if (req.headers.token && req.params.byDateType && pageNumber) {
        commonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            SP_HomeScreenService.getSPCheckOutBookingsList(req.params.byDateType, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -',
                '/api/sp/homescreen/checkouts/counts/bookings/list/:byDateType/:activePage/:searchString?: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -',
                '/api/sp/homescreen/checkouts/counts/bookings/list/:byDateType/:activePage/:searchString?: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/SP-HomeScreenController.js, at get API -',
            '/api/sp/homescreen/checkouts/counts/bookings/list/:byDateType/:activePage/:searchString?: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
    // ----- End :/api/sp/homescreen/checkouts/counts/bookings/list/:byDateType/:activePage/:searchString?'


    // ----- Begin :/api/sp/homescreen/booking/counts/bookings/list/:activePage/:searchString?'
    app.get('/api/sp/homescreen/booking/counts/bookings/list/:byDateType/:activePage/:searchString?', function (req, res, next) {
      var pageNumber = parseInt(req.params.activePage);
      var searchString = req.params.searchString;
      if (!req.params.searchString || req.params.searchString == 'undefined') {
          searchString = '';
      }
      if (req.headers.token && req.params.byDateType && pageNumber) {
        commonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            SP_HomeScreenService.getSPBookingsCountBookingsList(req.params.byDateType, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -',
                '/api/sp/homescreen/booking/counts/bookings/list/:byDateType/:activePage/:searchString?: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -',
                '/api/sp/homescreen/booking/counts/bookings/list/:byDateType/:activePage/:searchString?: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/SP-HomeScreenController.js, at get API -',
            '/api/sp/homescreen/booking/counts/bookings/list/:byDateType/:activePage/:searchString?: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
    // ----- End :/api/sp/homescreen/booking/counts/bookings/list/:byDateType/:activePage/:searchString?'


    // ----- Begin :/api/sp/homescreen/booking/counts/cancelled/list/:byDateType/:activePage/:searchString?'
    app.get('/api/sp/homescreen/booking/counts/cancelled/list/:byDateType/:activePage/:searchString?', function (req, res, next) {
      var pageNumber = parseInt(req.params.activePage);
      var searchString = req.params.searchString;
      if (!req.params.searchString || req.params.searchString == 'undefined') {
          searchString = '';
      }
      if (req.headers.token && req.params.byDateType && pageNumber) {
        commonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            SP_HomeScreenService.getSPBookingsCountCancelledList(req.params.byDateType, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -',
                '/api/sp/homescreen/booking/counts/cancelled/list/:byDateType/:activePage/:searchString?: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -',
                '/api/sp/homescreen/booking/counts/cancelled/list/:byDateType/:activePage/:searchString?: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/SP-HomeScreenController.js, at get API -',
            '/api/sp/homescreen/booking/counts/cancelled/list/:byDateType/:activePage/:searchString?: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
    // ----- End :/api/sp/homescreen/booking/counts/cancelled/list/:byDateType/:activePage/:searchString?'


    // ----- Begin :/api/sp/homescreen/booking/amounts/list/:byDateType/:activePage/:searchString?'
    app.get('/api/sp/homescreen/booking/amounts/list/:byDateType/:activePage/:searchString?', function (req, res, next) {
      var pageNumber = parseInt(req.params.activePage);
      var searchString = req.params.searchString;
      if (!req.params.searchString || req.params.searchString == 'undefined') {
          searchString = '';
      }
      if (req.headers.token && req.params.byDateType && pageNumber) {
        commonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            SP_HomeScreenService.getSPBookingsAmountsList(req.params.byDateType, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -',
                '/api/sp/homescreen/booking/amounts/list/:byDateType/:activePage/:searchString?: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -',
                '/api/sp/homescreen/booking/amounts/list/:byDateType/:activePage/:searchString?: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/SP-HomeScreenController.js, at get API -',
            '/api/sp/homescreen/booking/amounts/list/:byDateType/:activePage/:searchString?: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
    // ----- End :/api/sp/homescreen/booking/amounts/list/:byDateType/:activePage/:searchString?'

    // ----- Begin :/api/sp/homescreen/blockedDates/list/:byDateType/:activePage/:searchString?'
    app.get('/api/sp/homescreen/blockedDates/list/:byDateType/:activePage/:searchString?', function (req, res, next) {
      var pageNumber = parseInt(req.params.activePage);
      var searchString = req.params.searchString;
      if (!req.params.searchString || req.params.searchString == 'undefined') {
          searchString = '';
      }
      if (req.headers.token && req.params.byDateType && pageNumber) {
        commonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            SP_HomeScreenService.getSPHomeScreenBlockedDatesList(req.params.byDateType, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -',
                '/api/sp/homescreen/blockedDates/list/:byDateType/:activePage/:searchString?: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/SP-HomeScreenController.js at get API -',
                '/api/sp/homescreen/blockedDates/list/:byDateType/:activePage/:searchString?: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/SP-HomeScreenController.js, at get API -',
            '/api/sp/homescreen/blockedDates/list/:byDateType/:activePage/:searchString?: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
    // ----- End :api/sp/homescreen/blockedDates/list/:byDateType/:activePage/:searchString?'
};
// --- End: SP-HomeScreenController