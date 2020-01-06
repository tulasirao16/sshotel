/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var CommonService = require('../services/CommonService');
var EU_BookingsRatingsService = require('../services/EU-BookingsRatingsService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function(app, passport) {
    //Begin End User Bookings Ratings Controller
    app.get('/api/v1/eu/user/ratings/bookings/:searchString?', function(req, res, next) {
        var searchString = req.params.searchString;
        if(!req.params.searchString || req.params.searchString == 'undefined') {
          searchString = '';
        }
        if(req.headers.token) {
            CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
            if(tokenDecodedData && !tokenDecodedData.expStatus) {
                EU_BookingsRatingsService.getEndUsersBookingsRatings( searchString, tokenDecodedData.decodedTokenData, function(resObj) {
                    utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                });
            } 
            else if(tokenDecodedData && tokenDecodedData.expStatus) {
              logger.error('There was an Error in controllers/EU-BookingsRatingsController.js at get API -',
              ' /api/v1/eu/user/bookings/raitngs:searchString?: Token expired');
              utils.sendResponse(res, 400, '9995', {});
            } else {
              logger.error('There was an Error in controllers/EU-BookingsRatingsController.js at get API -',
              '  /api/v1/eu/user/bookings/raitngs:searchString?: Token decode failed');
              utils.sendResponse(res, 400, '9996', {});
            }
          });
        } else {
          logger.error('There was an Error in controllers/EU-BookingsRatingsController.js at get API -',
          '  /api/v1/eu/user/bookings/raitngs:searchString?: Missing Mandatory Fields');
          utils.sendResponse(res, 400, '9998', {});
        }
        
    });
}