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
var SP_BlockedDatesService = require('../services/SP-BlockedDatesService');

module.exports.controller = function (app, passport) {

  // -- Begin : /api/sp/property/blocked/dates/create 
  app.post('/api/sp/property/blocked/dates/create', function (req, res, next) {
    if (req.headers.token && req.body.blockingType) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_BlockedDatesService.createSPPropertyBlockedDates(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-BlockedDatesController.js at post API -' +
            '/api/sp/property/blocked/dates/create: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-BlockedDatesController.js at post API -' +
            ' /api/sp/property/blocked/dates/create: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-BlockedDatesController.js at post API -' +
        ' /api/sp/property/blocked/dates/create: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/sp/property/blocked/dates/create

  // -- Begin : /api/v1/sp/service/property/blocked/dates/:propertyID 
  app.get('/api/v1/sp/service/property/blocked/dates/:propertyID', function (req, res, next) {
    if (req.headers.token && req.params.propertyID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_BlockedDatesService.getPropertyBlockedDates(req.params.propertyID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-BlockedDatesController.js at get API -' +
            ' /api/v1/sp/service/property/blocked/dates/:propertyID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-BlockedDatesController.js at get API -' +
            ' /api/v1/sp/service/property/blocked/dates/:propertyID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-BlockedDatesController.js at get API -' +
        '  /api/v1/sp/service/property/blocked/dates/:propertyID: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/service/property/blocked/dates/:propertyID

  // -- Begin : /api/v1/sp/service/property/past/blocked/dates/:propertyID 
  app.get('/api/v1/sp/service/property/past/blocked/dates/:propertyID', function (req, res, next) {
    if (req.headers.token && req.params.propertyID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_BlockedDatesService.getPropertyPastBlockedDates(req.params.propertyID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-BlockedDatesController.js at get API -' +
            ' /api/v1/sp/service/property/past/blocked/dates/:propertyID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-BlockedDatesController.js at get API -' +
            ' /api/v1/sp/service/property/past/blocked/dates/:propertyID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-BlockedDatesController.js at get API -' +
        '/api/v1/sp/service/property/past/blocked/dates/:propertyID: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/service/property/past/blocked/dates/:propertyID

  // -- Begin : /api/v1/sp/service/property/delete/blocked/date/:blockedID 
  app.delete('/api/v1/sp/service/property/delete/blocked/date/:blockedID', function (req, res, next) {
    if (req.headers.token && req.params.blockedID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_BlockedDatesService.deletePropertyBlockedDates(req.params.blockedID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-BlockedDatesController.js at delete API -' +
            ' /api/v1/sp/service/property/delete/blocked/date/:blockedID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-BlockedDatesController.js at delete API -' +
            ' /api/v1/sp/service/property/delete/blocked/date/:blockedID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-BlockedDatesController.js at get delete -' +
        '  /api/v1/sp/service/property/delete/blocked/date/:blockedID: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/service/property/delete/blocked/date/:blockedID

  // -- Begin : /api/sp/property/blocked/dates/update/:blockingID
  app.put('/api/sp/property/blocked/dates/update/:blockingID', function (req, res, next) {
    if (req.headers.token && req.params.blockingID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_BlockedDatesService.updateSPPropertyBlockedDates(req.body, req.params.blockingID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-BlockedDatesController.js at put API -' +
            '/api/sp/property/blocked/dates/update/:blockingID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-BlockedDatesController.js at put API -' +
            ' /api/sp/property/blocked/dates/update/:blockingID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-BlockedDatesController.js at put API -' +
        ' /api/sp/property/blocked/dates/update/:blockingID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/sp/property/blocked/dates/update/:blockingID

    //   cron.schedule('0 0 0 * * *', function() {
    //     SP_BlockedDatesService.getBlockedDatesNotifications(function(resObj) {
    //     });
    // });
}
