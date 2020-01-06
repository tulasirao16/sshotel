/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var EU_BookingsService = require('../services/EU-BookingsService');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var cron = require('node-cron');

module.exports.controller = function(app, passport) {
  // Begin - End User Bookings Controller
  app.post('/api/v1/eu/booking/sp', function(req, res, next) {
    var postbookingBody = bookingBodyValidation(req.body);
    if (postbookingBody && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_BookingsService.postEndUserBooking(req.body, tokenDecodedData.decodedTokenData, res, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-BookingsController.js at post API -' +
            '/api/v1/eu/booking/sp: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/EU-BookingsController.js at post API -' +
            ' /api/v1/eu/booking/sp: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-BookingsController.js at post API -' +
        ' /api/v1/eu/booking/sp: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v1/eu/booking/sppty/amenities/:propertyId', function (req, res, next) {
    if (req.params.propertyId) {
      EU_BookingsService.getSpPropertyAmenities(req.params.propertyId, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-BookingsController.js at get API -' +
        ' /api/v1/eu/booking/sppty/amenities/:propertyId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  app.get('/api/v1/eu/booking/sppty/services/:propertyId', function (req, res, next) {
    if (req.params.propertyId) {
      EU_BookingsService.getSpPropertyServices(req.params.propertyId, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-BookingsController.js at get API -' +
        ' /api/v1/eu/booking/sppty/amenities/:propertyId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  app.post('/api/v1/eu/booking/sppty/available/count', function(req, res, next) {
    if (req.body.noOfRooms && req.body.checkInDate && req.body.checkOutDate && req.body.spPropertyInfoId && req.body.spServiceProviderId) {
      EU_BookingsService.getSpRoomsCount(req.body, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-BookingsController.js at post API -' +
        '/api/v1/eu/booking/sppty/available/count: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/sp/property/docs/:propertyId', function(req, res, next) {
    if (req.params.propertyId) {
      EU_BookingsService.getSpPropertyDocs(req.params.propertyId, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-BookingsController.js at post API -' +
        '/api/v1/eu/booking/sppty/available/count: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // Notification for Booking Before Day
  // cron.schedule('0 0 0 * * *', function() {
  //   EU_BookingsService.sendReminderNotificationBeforeDayToEndUser(function(resObj) {
  //   });
  // });

  // Notification for Booking Before Week
  // cron.schedule('0 0 0 * * *', function() {
  //   EU_BookingsService.sendReminderNotificationBeforeWeekToEndUser(function(resObj) {
  //   });
  // });
};

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function bookingBodyValidation(reqBodyObj) {
  if (reqBodyObj.contactEuNumber && reqBodyObj.area && reqBodyObj.city && reqBodyObj.state
     && reqBodyObj.latitude && reqBodyObj.longitude && reqBodyObj.zip && reqBodyObj.spServiceProviderId
    && reqBodyObj.spServiceProvider && reqBodyObj.spLocationId && reqBodyObj.contactPerson && reqBodyObj.mobileNumber
    && reqBodyObj.spemail && reqBodyObj.address && reqBodyObj.checkInDate && reqBodyObj.checkOutDate
    && reqBodyObj.spPropertyId && reqBodyObj.spPropertyTitle && reqBodyObj.spPropertyType && reqBodyObj.spPropertyInfoId
    && reqBodyObj.totalPrice) {
    return true;
  } else {
    return false;
  }
}