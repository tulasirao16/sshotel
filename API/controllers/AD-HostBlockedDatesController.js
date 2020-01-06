/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var cron = require('node-cron');
var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var AD_HostBlockedDatesService = require('../services/AD-HostBlockedDatesService');

// --- Begin: AD-HostBlockedDatesController
module.exports.controller = function (app, passport) {
  // -- Begin : /api/v1/ad/host/property/blocked/dates/:propertyID 
app.get('/api/v1/ad/host/property/blocked/dates/:propertyID', function (req, res, next) {
    if (req.headers.token && req.params.propertyID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostBlockedDatesService.getHostPropertyBlockedDates(req.params.propertyID, tokenDecodedData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at get API -' +
            ' /api/v1/ad/host/property/blocked/dates/:propertyID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at get API -' +
            ' /api/v1/ad/host/property/blocked/dates/:propertyID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at get API -' +
        '  /api/v1/ad/host/property/blocked/dates/:propertyID: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/ad/host/property/blocked/dates/:propertyID 

  // -- Begin :  /api/v1/ad/host/property/delete/blocked/dates/:blockedID 
  app.delete('/api/v1/ad/host/property/delete/blocked/dates/:blockedID', function (req, res, next) {
    if (req.headers.token && req.params.blockedID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostBlockedDatesService.deleteHostPropertyBlockedDates(req.params.blockedID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at delete API -' +
            ' /api/v1/ad/host/property/delete/blocked/dates/:blockedID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at delete API -' +
            ' /api/v1/ad/host/property/delete/blocked/dates/:blockedID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at get delete -' +
        '  /api/v1/ad/host/property/delete/blocked/dates/:blockedID: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End :   /api/v1/ad/host/property/delete/blocked/dates/:blockedID

  // -- Begin: /api/v1/ad/host/property/past/blocked/dates/:propertyID
   app.get('/api/v1/ad/host/property/past/blocked/dates/:propertyID', function (req, res, next) {
    if (req.headers.token && req.params.propertyID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostBlockedDatesService.getHostPropertyPastBlockedDates(req.params.propertyID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at get API -' +
            ' /api/v1/ad/host/property/past/blocked/dates/:propertyID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at get API -' +
            ' /api/v1/ad/host/property/past/blocked/dates/:propertyID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at get API -' +
        '/api/v1/ad/host/property/past/blocked/dates/:propertyID: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/ad/host/property/past/blocked/dates/:propertyID

  // -- Begin : /api/v1/ad/host/property/blocked/dates/create 
  app.post('/api/v1/ad/host/property/blocked/dates/create', function (req, res, next) {
    var blocking = blockingType(req.body)
    var Randomblocking = blockingType(req.body)
    if (req.headers.token && req.body.blockingType === 'Continuous Blocking' ? blocking : req.body.blockingType) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostBlockedDatesService.createADHostPropertyBlockedDates(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at post API -' +
            '/api/v1/ad/host/property/blocked/dates/create: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at post API -' +
            '/api/v1/ad/host/property/blocked/dates/create: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at post API -' +
        '/api/v1/ad/host/property/blocked/dates/create: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/ad/host/property/blocked/dates/create

  // -- Begin : /api/v1/ad/host/property/blocked/dates/update/:blockingID
  app.put('/api/v1/ad/host/property/blocked/dates/update/:blockingID', function (req, res, next) {
    if (req.headers.token && req.params.blockingID &&  req.body.propertyID && req.body.blockingType && req.body.blockingFromDate && req.body.blockingToDate) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostBlockedDatesService.updateHostPropertyBlockedDates(req.body, req.params.blockingID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at put API -' +
            '/api/v1/ad/host/property/blocked/dates/update/:blockingID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at put API -' +
            '/api/v1/ad/host/property/blocked/dates/update/:blockingID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostBlockedDatesController.js at put API -' +
        '/api/v1/ad/host/property/blocked/dates/update/:blockingID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/ad/host/property/blocked/dates/update/:blockingID
}
// --- Ending: AD-HostBlockedDatesController


  /**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function blockingType(reqBodyObj) {
  if ( reqBodyObj.spServiceProviderId && reqBodyObj.spServiceProvider && reqBodyObj.spLocationId && reqBodyObj.propertyID
      && reqBodyObj.blockingType && reqBodyObj.blockingFromDate && reqBodyObj.blockingToDate ) {
      return true;
  } else
      return false;
}
