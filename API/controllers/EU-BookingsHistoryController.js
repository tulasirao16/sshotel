/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var CommonService = require('../services/CommonService');
var EU_BookingsService = require('../services/EU-BookingsHistoryService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function(app, passport) {
    //Begin End User Bookings Controller
    app.get('/api/v1/eu/user/bookings/:dataType/:searchString?', function(req, res, next) {
        var searchString = req.params.searchString;
        if(!req.params.searchString || req.params.searchString == 'undefined') {
          searchString = '';
        }
        if(req.headers.token && req.params.dataType) {
            CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
                
            if(tokenDecodedData && !tokenDecodedData.expStatus) {
                EU_BookingsService.getEndUsersBookings(req.params.dataType, searchString, tokenDecodedData.decodedTokenData, function(resObj) {
                    utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                });
            } 
            else if(tokenDecodedData && tokenDecodedData.expStatus) {
              logger.error('There was an Error in controllers/EU-BookingsController.js at get API -',
              ' /api/v1/eu/user/bookings:dataType?: Token expired');
              utils.sendResponse(res, 400, '9995', {});
            } else {
              logger.error('There was an Error in controllers/EU-BookingsController.js at get API -',
              ' /api/v1/eu/user/bookings:dataType?: Token decode failed');
              utils.sendResponse(res, 400, '9996', {});
            }
          });
        } else {
          logger.error('There was an Error in controllers/EU-BookingsController.js at get API -',
          ' /api/v1/eu/user/bookings:dataType?: Missing Mandatory Fields');
          utils.sendResponse(res, 400, '9998', {});
        } 
    });
    

    app.get('/api/v1/eu/bookings/:activePage/:status/:searchString?', function (req, res, next) {
      var pageNum = parseInt(req.params.activePage);
      var searchString = req.params.searchString;
      if(!req.params.searchString || req.params.searchString == 'undefined') {
          searchString = '';
      }
      if (req.headers.token && req.params.status && pageNum) {
        CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            EU_BookingsService.getEUBookings(pageNum, req.params.status, searchString, tokenDecodedData.decodedTokenData, function(resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/EU-BookingHistoryController.js at get API -' +
              '/api/v1/eu/bookings/:activePage/:status/:searchString?: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/EU-BookingHistoryController.js at get API -' +
              '/api/v1/eu/bookings/:activePage/:status/:searchString?: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/EU-BookingHistoryController.js at get API -' +
          '/api/v1/eu/bookings/:activePage/:status/:searchString?: Missing Mandatory Fields');
        utils.sendResponse(res, 400, '9998', {});
      }
    });

    app.put('/api/v1/eu/user/cancel/booking/:bookingID/:checkInDate/:spServiceProviderId', function(req, res, next) {
      if(req.headers.token && req.params.bookingID && req.params.checkInDate && req.params.spServiceProviderId) {
          CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
          if(tokenDecodedData && !tokenDecodedData.expStatus) {
              EU_BookingsService.cancelEndUsersBookings(req.params.bookingID, req.params.checkInDate, req.params.spServiceProviderId, tokenDecodedData.decodedTokenData, function(resObj) {
                  utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
          } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/EU-BookingsController.js at put API -',
            ' /api/v1/eu/user/cancel/bookings/:bookingID:checkInDate/:spServiceProviderId: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/EU-BookingsController.js at put API -',
            ' /api/v1/eu/user/cancel/bookings/:checkInDate/:spServiceProviderId:bookingID: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/EU-BookingsController.js at put API -',
        ' /api/v1/eu/user/cancel/bookings/:bookingID:checkInDate/:spServiceProviderId: Missing Mandatory Fields');
        utils.sendResponse(res, 400, '9998', {});
      } 
  });

  app.get('/api/v1/eu/booking/:recordId', function(req, res, next) {
    if(req.headers.token && req.params.recordId) {
        CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
            EU_BookingsService.getEndUserBookingData(req.params.recordId, tokenDecodedData.decodedTokenData, function(resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } 
        else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-BookingsController.js at get API -',
          ' /api/v1/eu/booking/:recordId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/EU-BookingsController.js at get API -',
          ' /api/v1/eu/booking/:recordId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-BookingsController.js at get API -',
      ' /api/v1/eu/booking/:recordId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    } 
});

}