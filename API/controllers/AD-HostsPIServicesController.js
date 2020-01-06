/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var AD_HostsPIServicesService = require('../services/AD-HostsPIServicesService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

//---Begin:AD-HostsPIServicesController
module.exports.controller = function (app, passport) {
  // -- Begin: /api/v1/ad/hosts/property/info/services/:propertyInfoId/:searchString? - Code to get Property Info Services
  app.get('/api/v1/ad/hosts/property/info/services/:propertyInfoId/:searchString?', function (req, res, next) {
    var searchString = req.params.searchString == 'undefined' || !req.params.searchString ? '' : req.params.searchString;
    if (req.headers.token && req.params.propertyInfoId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
            AD_HostsPIServicesService.getADHostsPropertyInfoServicesList(req.params.propertyInfoId, searchString, function (resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPIServiceController.js at get API -' +
          '/api/v1/ad/hosts/property/info/services/:propertyInfoId/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPIServiceController.js at get API -' +
          '/api/v1/ad/hosts/property/info/services/:propertyInfoId/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPIServiceController.js at get API -' +
      '/api/v1/ad/hosts/property/info/services/:propertyInfoId/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End: /api/v1/ad/hosts/property/info/services/:propertyInfoId/:searchString? - Code to get Property Info Services  
  
  // --- Begin: '/api/v1/ad/hosts/property/info/services/status' - Code to Update Property Info Service Status
  app.put('/api/v1/ad/hosts/property/info/services/status', function(req, res, next) {  
    if(req.body._id && req.body.serviceStatus && req.body.propertyInfoId && req.headers.token) {
       CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPIServicesService.updateADHostsPropertyInfoServiceStatus(req.body, tokenDecodedData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPIServicesController.js at put API -' +
          '/api/v1/ad/hosts/property/info/services/status: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPIServicesController.js at put API -' +
          '/api/v1/ad/hosts/property/info/services/status: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPIServicesController.js at put API -' +
      '/api/v1/ad/hosts/property/info/services/status: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: '/api/v1/ad/hosts/property/info/services/status' - Code to Update Property Info Service Status

  // --- Begin: '/api/v1/ad/hosts/property/info/services/update/:recordID'
  app.put('/api/v1/ad/hosts/property/info/services/update/:recordID', function(req, res, next){
    if(req.params.recordID && req.body.serviceStatus && req.body.serviceType &&  req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPIServicesService.updateADHostsPropertyInfoServiceRecordID(req.body, req.params.recordID,tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPIServicesController.js at put API -' +
          '/api/v1/ad/hosts/property/info/services/update/:recordID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPIServicesController.js at put API -' +
          '/api/v1/ad/hosts/property/info/services/update/:recordID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPIServicesController.js at put API -' +
      '/api/v1/ad/hosts/property/info/services/update/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- Begin: '/api/v1/ad/hosts/property/info/services/update/:recordID'
}
//---END:AD-HostsPIServicesController