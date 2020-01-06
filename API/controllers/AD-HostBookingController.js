/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var AD_HostBookingsService = require('../services/AD-HostBookingsService');

// --- Begin: AD-HostsBookingsController
module.exports.controller = function (app, passport) {

  // Begin - /api/v1/ad/eu/cancel/booking/:bookingId/:checkInDate
  app.get('/api/v1/ad/cancel/booking/:bookingId/:checkInDate', function(req, res, next) {
    if (req.params.bookingId && req.params.checkInDate && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostBookingsService.getRefundAmountBooking(req.params.bookingId, req.params.checkInDate, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsBookingsController.js at post API -' +
            '/api/v1/ad/eu/cancel/booking/:bookingId/:checkInDate: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsBookingsController.js at post API -' +
            ' /api/v1/ad/eu/cancel/booking/:bookingId/:checkInDate: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsBookingsController.js at post API -' +
        ' /api/v1/ad/eu/cancel/booking/:bookingId/:checkInDate: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  })    

// End - /api/v1/ad/eu/cancel/booking/:bookingId/:checkInDate

// Begin - /api/v1/ad/eu/confirm/cancel/booking
app.put('/api/v1/ad/confirm/cancel/booking', function(req, res, next) {
  if (req.body.bookingId && req.headers.token) {
    CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
      if (tokenDecodedData && !tokenDecodedData.expStatus) {
        AD_HostBookingsService.confirmCancelBooking(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
          utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
        });
      } else if (tokenDecodedData && tokenDecodedData.expStatus) {
        logger.error('There was an Error in controllers/AD-HostsBookingsController.js at post API -' +
          '/api/v1/ad/eu/confirm/cancel/booking: Token expired');
        utils.sendResponse(res, 400, '9995', {});
      } else {
        logger.error('There was an Error in controllers/AD-HostsBookingsController.js at post API -' +
          ' /api/v1/ad/eu/confirm/cancel/booking: Token decode failed');
        utils.sendResponse(res, 400, '9996', {});
      }
    });
  } else {
    logger.error('There was an Error in controllers/AD-HostsBookingsController.js at post API -' +
      ' /api/v1/ad/eu/confirm/cancel/booking: Missing Mandatory Fields');
    utils.sendResponse(res, 400, '9998', {});
  }
})    

// End - /api/v1/ad/eu/confirm/cancel/booking
  

    // Begin - /api/v1/ad/eu/update/booking/sp
    app.put('/api/v1/ad/update/booking/sp', function(req, res, next) {
        var putbookingBody = bookingPutBodyValidation(req.body);
        if (putbookingBody && req.headers.token) {
          CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
            if (tokenDecodedData && !tokenDecodedData.expStatus) {
            AD_HostBookingsService.putEndUserBooking(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
            } else if (tokenDecodedData && tokenDecodedData.expStatus) {
              logger.error('There was an Error in controllers/AD-HostsBookingsController.js at post API -' +
                '/api/v1/ad/eu/update/booking/sp: Token expired');
              utils.sendResponse(res, 400, '9995', {});
            } else {
              logger.error('There was an Error in controllers/AD-HostsBookingsController.js at post API -' +
                ' /api/v1/ad/eu/update/booking/sp: Token decode failed');
              utils.sendResponse(res, 400, '9996', {});
            }
          });
        } else {
          logger.error('There was an Error in controllers/AD-HostsBookingsController.js at post API -' +
            ' /api/v1/ad/eu/update/booking/sp: Missing Mandatory Fields');
          utils.sendResponse(res, 400, '9998', {});
        }
      });
    // End - /api/v1/ad/eu/update/booking/sp

    // Begin - /api/v1/ad/booking/:recordId
    app.get('/api/v1/ad/booking/:recordId', function(req, res, next) {
      if(req.headers.token && req.params.recordId) {
          CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
          if(tokenDecodedData && !tokenDecodedData.expStatus) {
            AD_HostBookingsService.getADBookingData(req.params.recordId, tokenDecodedData.decodedTokenData, function(resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
          } 
          else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/ AD-HostsBookingsController.js at get API -',
            ' /api/v1/ad/booking/:recordId: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/ AD-HostsBookingsController.js at get API -',
            ' /api/v1/ad/booking/:recordId: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/ AD-HostsBookingsController.js at get API -',
        ' /api/v1/ad/booking/:recordId: Missing Mandatory Fields');
        utils.sendResponse(res, 400, '9998', {});
      } 
  });
    // End - /api/v1/ad/booking/:recordId

  // ----- Begin :/api/v1/ad/hosts/property/booking/counts/bookings/list/:activePage/:searchString?'
  app.get('/api/v1/ad/hosts/property/bookings/list/:spid/:activePage/:searchString?/', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    if (req.headers.token && pageNumber && req.params.spid) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostBookingsService.getADHostBookingsList(req.params.spid, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsBookingsController.js at get API -',
              '/api/v1/ad/hosts/property/bookings/list/:id/:activePage/:searchString?/: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsBookingsController.js at get API -',
              '/api/v1/ad/hosts/property/bookings/list/:id/:activePage/:searchString?/: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsBookingsController.js, at get API -',
          '/api/v1/ad/hosts/property/bookings/list/:id/:activePage/:searchString?/: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End :/api/v1/ad/hosts/property/bookings/list/:id/:activePage/:searchString?/'

  // ----- Begin :/api/v1/ad/hosts/property/bookings/list/byId/:spid/:recordId/:activePage/:searchString?
  app.get('/api/v1/ad/hosts/property/bookings/list/byId/:spid/:recordId/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    if (req.headers.token && pageNumber && req.params.spid && req.params.recordId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostBookingsService.getADHostBookings(req.params.spid, req.params.recordId, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsBookingsController.js at get API -' +
              '/api/v1/ad/hosts/property/bookings/list/byId/:spid/:recordId/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsBookingsController.js at get API -' +
              '/api/v1/ad/hosts/property/bookings/list/byId/:spid/:recordId/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsBookingsController.js, at get API -' +
          '/api/v1/ad/hosts/property/bookings/list/byId/:spid/:recordId/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End :/api/v1/ad/hosts/property/bookings/list/byId/:spid/:recordId/:activePage/:searchString?
}

// --- End: AD-HostsBookingsController

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function bookingPutBodyValidation(reqBodyObj) {
    if (reqBodyObj.bookingCode && reqBodyObj.euName && reqBodyObj.euMobileNumber && reqBodyObj.noOfAdults && reqBodyObj.noOfChilds
      && reqBodyObj.noOfRooms && reqBodyObj.totalDays && reqBodyObj.checkInDate && reqBodyObj.checkOutDate && reqBodyObj.bookingStatus
      && reqBodyObj.paymentMode && reqBodyObj.totalPrice && reqBodyObj.paymentStatus && reqBodyObj.bookingType) {
      return true;
    } else {
      return false;
    }
  }