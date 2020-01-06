/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var AD_EndUsersSupportService = require('../services/AD-EndUsersSupportService');

// BEGIN:  AD_EndUsersSupportController
module.exports.controller = function (app, passport) {
  // Begin '/api/v1/ad/eu/support/:euUserId/:activePage/:searchString?
  app.get('/api/v1/ad/eu/support/:euUserId/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString == 'undefined' || !req.params.searchString ? '' : req.params.searchString;
    if (req.headers.token && req.params.euUserId && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUsersSupportService.getADEUSupportList(req.params.euUserId, pageNumber, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUsersSupportController.js at get API -'+
            '/api/v1/ad/eu/support/:euUserId/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        }
        else {
          logger.error('There was an Un-known Error in controllers/AD-EndUsersSupportController.js at get API -'+
            '/api/v1/ad/eu/support/:euUserId/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUsersSupportController.js at get API -'+
        '/api/v1/ad/eu/support/:euUserId/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // Begin '/api/v1/ad/eu/support/:euUserId/:activePage/:searchString?

  // Begin '/api/v1/ad/eu/support/create
  app.post('/api/v1/ad/eu/support/create', function (req, res, next) {
    var bodyValidation = adEUSupportBodyValidation(req.body);
    if (req.headers.token && bodyValidation) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUsersSupportService.postADEUSupportData(req.body, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUsersSupportController.js at post API -'+
            '/api/v1/ad/eu/support/create: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-EndUsersSupportController.js at post API -'+
            '/api/v1/ad/eu/support/create: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUsersSupportController.js at post API -'+
        '/api/v1/ad/eu/support/create: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // End '/api/v1/ad/eu/support/create

  // Begin '/api/v1/ad/eu/support/update/:supportId
  app.put('/api/v1/ad/eu/support/update/:supportId', function (req, res, next) {
    if (req.headers.token && req.params.supportId && req.body.ticketTitle && req.body.ticketDescription && req.body.ticketTag) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUsersSupportService.putADEUSupportUpdate(req.params.supportId, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUsersSupportController.js at put API -'+
            '/api/v1/ad/eu/support/update/:supportId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUsersSupportController.js at put API -'+
            '/api/v1/ad/eu/support/update/:supportId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUsersSupportController.js at put API -'+
        '/api/v1/ad/eu/support/update/:supportId: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // End '/api/v1/ad/eu/support/update/:supportId'

  // BEGIN  : '/api/v1/ad/eu/support/delete/:supportId
  app.put('/api/v1/ad/eu/support/delete/:supportId', function (req, res, next) {
    if (req.params.supportId && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUsersSupportService.adEUSupportDelete(req.params.supportId,
            tokenDecodedData.decodedTokenData, function (resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUsersSupportController.js at delete API -'+
            '/api/v1/ad/eu/support/delete/:supportId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-EndUsersSupportController.js at delete API -'+
            '/api/v1/ad/eu/support/delete/:supportId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUsersSupportController.js at delete API -'+
        '/api/v1/ad/eu/support/delete/:supportId: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // END  : '/api/v1/ad/eu/support/delete/:supportId'

}
// End:  AD_EndUsersSupportController


/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function adEUSupportBodyValidation(reqBodyObj) {
  if (reqBodyObj.reqEmail && reqBodyObj.reqMobileNumber && reqBodyObj.ticketNumType && reqBodyObj.euUserId && reqBodyObj.euName && reqBodyObj.ticketTitle && reqBodyObj.ticketDescription
    && reqBodyObj.ticketTag) {
    return true;
  } else {
    return false;
  }
}


