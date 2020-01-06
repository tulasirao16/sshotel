/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var SP_PropertyInfoServicesService = require('../services/SP-PropertyInfoServicesService');
var SP_UsersService = require('../services/SP-UsersService');

module.exports.controller = function (app, passport) {

  // --- Begin '/api/v1/sp/propertyinfo/services'
  app.put('/api/v1/sp/propertyinfo/services', function(req, res, next) {
    if(req.body._id && req.body.serviceType && req.body.serviceStatus && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertyInfoServicesService.updateSPPropertyInfoServicesData(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-PropertyInfoServicesController.js at delete API -' +
            ' /api/v1/sp/propertyinfo/services: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/SP-PropertyInfoServicesController.js at delete API -' +
            ' api/v1/sp/favorites/delete: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/SP-PropertyInfoServicesController.js at delete API -' +
        '/api/v1/sp/propertyinfo/services: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/propertyinfo/services'

  // --- Begin '/api/v1/sp/propertyinfo/services/Available/:recordID'
  app.put('/api/v1/sp/propertyinfo/services/Available/:recordID', function(req, res, next) {
    if(req.params.recordID && req.headers.token && req.body.servicesAvailable && req.body.propertyInfoId) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertyInfoServicesService.updateSPPIServiceStatusAvailable(req.params.recordID, req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-PropertyInfoServicesController.js at delete API -' +
            ' /api/v1/sp/propertyinfo/services/Available/:recordID: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/SP-PropertyInfoServicesController.js at delete API -' +
            ' /api/v1/sp/propertyinfo/services/Available/:recordID: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/SP-PropertyInfoServicesController.js at delete API -' +
        '/api/v1/sp/propertyinfo/services/Available/:recordID: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/propertyinfo/services/Available/:recordID'

  // --- Begin '/api/v1/sp/propertyinfo/services/Unavailable/:recordID'
  app.put('/api/v1/sp/propertyinfo/services/Unavailable/:recordID', function(req, res, next) {
    if(req.params.recordID && req.headers.token && req.body.servicesAvailable && req.body.propertyInfoId) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertyInfoServicesService.updateSPPIServiceStatusUnavailable(req.params.recordID, req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-PropertyInfoServicesController.js at delete API -' +
            ' /api/v1/sp/propertyinfo/services/Unavailable/:recordID: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/SP-PropertyInfoServicesController.js at delete API -' +
            ' /api/v1/sp/propertyinfo/services/Unavailable/:recordID: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/SP-PropertyInfoServicesController.js at delete API -' +
        '/api/v1/sp/propertyinfo/services/Unavailable/:recordID: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/propertyinfo/services/Unavailable/:recordID'
};

