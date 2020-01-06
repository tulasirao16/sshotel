/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var AD_ServiceProviderSupportService = require('../services/AD-ServiceProviderSupportService');

// BEGIN: AD-ServiceProviderSupportController
module.exports.controller = function (app, passport) {
  // Begin '/api/v1/ad/host/support/:hostId/:activePage/:searchString?
  app.get('/api/v1/ad/host/support/:hostId/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString == 'undefined' || !req.params.searchString ? '' : req.params.searchString;
    if (req.headers.token && req.params.hostId && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_ServiceProviderSupportService.getADHostSupportList(req.params.hostId, pageNumber, searchString,  function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-ServiceProviderSupportController.js at get API -'+
            '/api/v1/ad/host/support/:hostId/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        }
        else {
          logger.error('There was an Un-known Error in controllers/AD-ServiceProviderSupportController.js at get API -' +
            '/api/v1/ad/host/support/:hostId/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-ServiceProviderSupportController.js at get API -'+
        '/api/v1/ad/host/support/:hostId/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // End '/api/v1/ad/host/support/:hostId/:activePage/:searchString?

  // Begin '/api/v1/ad/host/support/create
  app.post('/api/v1/ad/host/support/create', function (req, res, next) {
    var bodyValidation = adCreateHostSupportBodyValidation(req.body);
    if (req.headers.token && bodyValidation) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_ServiceProviderSupportService.postADCreateHostSupportData(req.body, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-ServiceProviderSupportController.js at post API -'+
            '/api/v1/ad/host/support/create: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-ServiceProviderSupportController.js at post API -' +
            '/api/v1/ad/host/support/create: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-ServiceProviderSupportController.js at post API -'+
        '/api/v1/ad/host/support/create: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // End '/api/v1/ad/host/support/create

  // Begin '/api/v1/ad/host/support/update/:supportId
  app.put('/api/v1/ad/host/support/update/:supportId', function (req, res, next) {
    if ( req.headers.token && req.params.supportId && req.body.ticketTitle && req.body.ticketDescription && req.body.ticketTag) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_ServiceProviderSupportService.putADHostSupportUpdate(req.params.supportId, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-ServiceProviderSupportController.js at put API -'+
            '/api/v1/ad/host/support/update/:supportId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-ServiceProviderSupportController.js at put API -'+
            '/api/v1/ad/host/support/update/:supportId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-ServiceProviderSupportController.js at put API -'+
        '/api/v1/ad/host/support/update/:supportId: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // End '/api/v1/ad/host/support/update/:supportId

  // BEGIN  : '/api/v1/ad/host/support/delete/:supportId
  app.put('/api/v1/ad/host/support/delete/:supportId', function (req, res, next) {
    if (req.params.supportId && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_ServiceProviderSupportService.adSPHostSupportDelete(req.params.supportId,
            tokenDecodedData.decodedTokenData, function (resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-ServiceProviderSupportController.js at delete API -'+
            '/api/v1/ad/host/support/delete/:supportId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-ServiceProviderSupportController.js at delete API -'+
            '/api/v1/ad/host/support/delete/:supportId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-ServiceProviderSupportController.js at delete API -'+
        '/api/v1/ad/host/support/delete/:supportId: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // END  : '/api/v1/ad/host/support/delete/:supportId'
}

// End: AD-ServiceProviderSupportController

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function adCreateHostSupportBodyValidation(reqBodyObj){
if (reqBodyObj.reqEmail && reqBodyObj.reqMobileNumber && reqBodyObj.spServiceProviderId  && reqBodyObj.spServiceProvider && reqBodyObj.ticketTitle && reqBodyObj.ticketDescription && reqBodyObj.ticketNumType
  && reqBodyObj.ticketTag) {
  return true;
} else {
  return false;
}
}


