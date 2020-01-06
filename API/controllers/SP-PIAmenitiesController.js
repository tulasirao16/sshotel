/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var SP_PIAmenitiesService = require('../services/SP-PIAmenitiesService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function (app, passport) {
// -- Begin /api/v1/sp/property/info/amenities/:propertyInfoId - Code to get property amenities    
  app.get('/api/v1/sp/property/info/amenities/:propertyId/:propertyInfoId/:searchString?', function (req, res, next) {
    var searchString = req.params.searchString;
    if(!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && req.params.propertyId && req.params.propertyInfoId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
            SP_PIAmenitiesService.getPropertyInfoAmenitiesList(req.params.propertyId, req.params.propertyInfoId, tokenDecodedData.decodedTokenData, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PIAmenitiesController.js at get API -',
            ' /api/v1/sp/property/info/amenities: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PIAmenitiesController.js at get API -',
            ' /api/v1/sp/property/info/amenities: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    }
  });
// -- End /api/v1/sp/property/info/amenities/:propertyInfoId - Code to get property amenities

// --- Begin '/api/v1/sp/propertyinfo/amenity'
  app.put('/api/v1/sp/propertyinfo/amenity', function(req, res, next) {
    if(req.body._id && req.body.amenityStatus && req.body.amenityType && req.body.amenityCharge &&  req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PIAmenitiesService.updateSPPropertyInfoAmenityData(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-PIAmenitiesController.js at put API -' +
            ' /api/v1/sp/propertyinfo/amenity: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/SP-PIAmenitiesController.js at put API -' +
            ' /api/v1/sp/propertyinfo/amenity: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/SP-PIAmenitiesController.js at put API -' +
        '/api/v1/sp/propertyinfo/amenity: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
// --- End '/api/v1/sp/propertyinfo/amenity'

  // --- Begin '/api/v1/sp/propertyinfo/amenities/status'
  app.put('/api/v1/sp/propertyinfo/amenities/status', function(req, res, next) {
    if(req.body._id && req.body.amenityStatus && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PIAmenitiesService.updateSPPropertyInfoAmenityStatus(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-PIAmenitiesController.js at put API -' +
            ' /api/v1/sp/propertyinfo/amenities/status: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/SP-PIAmenitiesController.js at put API -' +
            ' /api/v1/sp/propertyinfo/amenities/status: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/SP-PIAmenitiesController.js at put API -' +
        '/api/v1/sp/propertyinfo/amenities/status: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/propertyinfo/amenities/status'
}