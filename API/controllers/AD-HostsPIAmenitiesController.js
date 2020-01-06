/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var AD_HostsPIAmenitiesService = require('../services/AD-HostsPIAmenitiesService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

//---Begin:AD-HostsPIAmentiesController
module.exports.controller = function (app, passport) {
  // -- Begin: /api/v1/ad/hosts/property/info/amenities/:propertyInfoId/:searchString? - Code to get property amenities    
  app.get('/api/v1/ad/hosts/property/info/amenities/:propertyInfoId/:searchString?', function (req, res, next) {
    var searchString = req.params.searchString == 'undefined' || !req.params.searchString ? '':req.params.searchString ;
    if (req.headers.token && req.params.propertyInfoId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPIAmenitiesService.getADHostsPropertyInfoAmenitiesList(req.params.propertyInfoId, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPIAmentiesController.js at get API -' +
          '/api/v1/ad/hosts/property/info/amenities/:propertyInfoId/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPIAmentiesController.js at get API -' +
          '/api/v1/ad/hosts/property/info/amenities/:propertyInfoId/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPIAmentiesController.js at get API -' +
      '/api/v1/ad/hosts/property/info/amenities/:propertyInfoId/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End: /api/v1/ad/hosts/property/info/amenities/:propertyInfoId/:searchString? - Code to get property amenities

  // --- Begin: '/api/v1/ad/hosts/property/info/amenities/status'
  app.put('/api/v1/ad/hosts/property/info/amenities/status', function(req, res, next) {  
    if(req.body._id && req.body.amenityStatus && req.headers.token) {
       CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPIAmenitiesService.updateADHostsPropertyInfoAmenityStatus(req.body, tokenDecodedData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPIAmentiesController.js at put API -' +
          ' /api/v1/ad/hosts/property/info/amenities/status: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPIAmentiesController.js at put API -' +
          ' /api/v1/ad/hosts/property/info/amenities/status: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPIAmentiesController.js at put API -' +
      '/api/v1/ad/hosts/property/info/amenities/status: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: '/api/v1/ad/hosts/property/info/amenities/status'

  // --- Begin: '/api/v1/ad/hosts/property/info/amenities/update/:recordID'
  app.put('/api/v1/ad/hosts/property/info/amenities/update/:recordID', function(req, res, next){
    if(req.params.recordID && req.body.amenityStatus && req.body.amenityType &&  req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPIAmenitiesService.updateADHostsPropertyInfoAmenityRecordID(req.body, req.params.recordID,tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPIAmentiesController.js at put API -' +
          '/api/v1/ad/hosts/property/info/amenities/update/:recordID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPIAmentiesController.js at put API -' +
          '/api/v1/ad/hosts/property/info/amenities/update/:recordID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPIAmentiesController.js at put API -' +
      '/api/v1/ad/hosts/property/info/amenities/update/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- Begin: '/api/v1/ad/hosts/property/info/amenities/update/:recordID'
}
//---END: AD-HostsPIAmentiesController