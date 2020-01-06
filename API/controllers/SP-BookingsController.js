/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var SP_BookingsService = require('../services/SP-BookingsService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function(app, passport) {
// -- Begin -- /api/v1/sp/bookings/:status/:searchString? -- Code: To get SP Bookings  
  app.get('/api/v1/sp/bookings/:activePage/:status/:searchString?', function (req, res, next) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if(!req.params.searchString || req.params.searchString == 'undefined') {
        searchString = '';
    }
    if (req.headers.token && req.params.status && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_BookingsService.getServiceProviderBookings(pageNum, req.params.status, searchString, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-BookingsController.js at get API -' +
            '/api/v1/sp/bookings/:status/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-BookingsController.js at get API -' +
            '/api/v1/sp/bookings/:status/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-BookingsController.js at get API -' +
        ' /api/v1/sp/bookings/:status/:searchString?: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
 // -- End -- /api/v1/sp/bookings/:status/:searchString? -- Code: To get SP Bookings 
  // --- Begin '/api/v1/sp/service/booking/:id'
  app.get('/api/v1/sp/service/booking/:id', function(req, res, callback) {
    if(req.headers.token && req.params.id) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_BookingsService.getBookingByRecordID(req.params.id, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-BookingsController.js at get API -' +
          '/api/v1/sp/service/booking/:id: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-BookingsController.js at get API -' +
          '/api/v1/sp/service/booking/:id: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-BookingsController.js at get API -' +
      '/api/v1/sp/service/booking/:id: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/service/booking/:id'

  // Begin - SP User Bookings Controller
    app.post('/api/v1/sp/eu/booking/sp', function(req, res, next) {
      var postbookingBody = bookingBodyValidation(req.body);
      if (postbookingBody && req.headers.token) {
        CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            SP_BookingsService.postEndUserBooking(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-BookingsController.js at post API -' +
              '/api/v1/sp/eu/booking/sp: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/SP-BookingsController.js at post API -' +
              '/api/v1/sp/eu/booking/sp: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/SP-BookingsController.js at post API -' +
          '/api/v1/sp/eu/booking/sp: Missing Mandatory Fields');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
  // End - SP User Bookings Controller



  // -- Begin : /api/v1/sp/create/bookings/properties/:hostsBy/:activePage/:searchString? 
  app.get('/api/v1/sp/create/bookings/properties/:hostsBy/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && req.params.hostsBy && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_BookingsService.getPropertiesToCreateBooking(req.params.hostsBy, pageNumber, searchString, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-BookingsController.js at get API -' +
            '/api/v1/sp/create/bookings/properties/:hostsBy/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-BookingsController.js at get API -' +
            '/api/v1/sp/create/bookings/properties/:hostsBy/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-BookingsController.js at get API -' +
        '/api/v1/sp/create/bookings/properties/:hostsBy/:activePage/:searchString?: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/create/bookings/properties/:hostsBy/:activePage/:searchString?

  // Begin - /api/v1/sp/eu/cancel/booking/:bookingId/:checkInDate
    app.get('/api/v1/sp/eu/cancel/booking/:bookingId/:checkInDate', function(req, res, next) {
      if (req.params.bookingId && req.params.checkInDate && req.headers.token) {
        CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            SP_BookingsService.getRefundAmountBooking(req.params.bookingId, req.params.checkInDate, tokenDecodedData.decodedTokenData, function(resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-BookingsController.js at post API -' +
              '/api/v1/sp/eu/cancel/booking/:bookingId/:checkInDate: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/SP-BookingsController.js at post API -' +
              ' /api/v1/sp/eu/cancel/booking/:bookingId/:checkInDate: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/SP-BookingsController.js at post API -' +
          ' /api/v1/sp/eu/cancel/booking/:bookingId/:checkInDate: Missing Mandatory Fields');
        utils.sendResponse(res, 400, '9998', {});
      }
    })    

  // End - /api/v1/sp/eu/cancel/booking/:bookingId/:checkInDate


  // Begin - /api/v1/sp/eu/confirm/cancel/booking
  app.put('/api/v1/sp/eu/confirm/cancel/booking', function(req, res, next) {
    if (req.body.bookingId && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_BookingsService.confirmCancelBooking(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-BookingsController.js at post API -' +
            '/api/v1/sp/eu/confirm/cancel/booking: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-BookingsController.js at post API -' +
            ' /api/v1/sp/eu/confirm/cancel/booking: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-BookingsController.js at post API -' +
        ' /api/v1/sp/eu/confirm/cancel/booking: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  })    

// End - /api/v1/sp/eu/confirm/cancel/booking


    // Begin - /api/v1/sp/eu/update/booking/sp
    app.put('/api/v1/sp/eu/update/booking/sp', function(req, res, next) {
      var putbookingBody = bookingPutBodyValidation(req.body);
      if (putbookingBody && req.headers.token) {
        CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            SP_BookingsService.putEndUserBooking(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-BookingsController.js at post API -' +
              '/api/v1/sp/eu/update/booking/sp: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/SP-BookingsController.js at post API -' +
              ' /api/v1/sp/eu/update/booking/sp: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/SP-BookingsController.js at post API -' +
          ' /api/v1/sp/eu/update/booking/sp: Missing Mandatory Fields');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
  // End - /api/v1/sp/eu/update/booking/sp  

  app.get('/api/v1/sp/booking/:recordId', function(req, res, next) {
    if(req.headers.token && req.params.recordId) {
        CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_BookingsService.getSPBookingData(req.params.recordId, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } 
        else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-BookingsController.js at get API -',
          ' /api/v1/sp/booking/:recordId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-BookingsController.js at get API -',
          ' /api/v1/sp/booking/:recordId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-BookingsController.js at get API -',
      ' /api/v1/sp/booking/:recordId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    } 
});
};



/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function bookingBodyValidation(reqBodyObj) {
  if (reqBodyObj.name && reqBodyObj.contactEuNumber && reqBodyObj.area && reqBodyObj.city && reqBodyObj.state
    && reqBodyObj.latitude && reqBodyObj.longitude && reqBodyObj.zip && reqBodyObj.spServiceProviderId
    && reqBodyObj.spServiceProvider && reqBodyObj.spLocationId && reqBodyObj.contactPerson && reqBodyObj.mobileNumber
    && reqBodyObj.spemail && reqBodyObj.address && reqBodyObj.checkInDate && reqBodyObj.checkOutDate
    && reqBodyObj.spPropertyId && reqBodyObj.spPropertyTitle && reqBodyObj.spPropertyType && reqBodyObj.spPropertyInfoId
    && reqBodyObj.totalPrice && reqBodyObj.noOfRooms && reqBodyObj.noOfAdults && reqBodyObj.noOfChilds && reqBodyObj.euEmail && reqBodyObj.bookingType) {
    return true;
  } else {
    return false;
  }
}

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