/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var AD_HostsNotificationsService = require('../services/AD-HostsNotificationsService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// BEGIN : AD-HostsNotificationsController
module.exports.controller = function (app, passport) {

  // BEGIN GET API : '/api/v1/ad/hosts/notifications/:hostId/:activePage/:searchString?'
  app.get('/api/v1/ad/hosts/notifications/:hostId/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString ? req.params.searchString : '';
    if (req.headers.token && req.params.hostId && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsNotificationsService.getHostsNotifications(req.params.hostId, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsNotificationsController.js at get API -',
            '/api/v1/ad/hosts/notifications/:hostId/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        }
        else {
          logger.error('There was an Un-known Error in controllers/AD-HostsNotificationsController.js at get API -',
            ' /api/v1/ad/hosts/notifications/:hostId/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsNotificationsController.js at get API -',
        ' /api/v1/ad/hosts/notifications/:hostId/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }

  });
  // END GET API : '/api/v1/ad/hosts/notifications/:hostId/:activePage/:searchString?'

  // BEGIN PUT API : '/api/v1/ad/hosts/notifications/delete/:recordID'
  app.put('/api/v1/ad/hosts/notifications/delete/:recordID', function (req, res, next) {
    if (req.params.recordID && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsNotificationsService.hostsNotificationsDelete(req.params.recordID,
            tokenDecodedData.decodedTokenData, function (resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsNotificationsController.js at delete API -',
            '/api/v1/ad/hosts/notifications/delete/:recordID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-HostsNotificationsController.js at delete API -',
            '/api/v1/ad/hosts/notifications/delete/:recordID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsNotificationsController.js at delete API -',
        '/api/v1/ad/hosts/notifications/delete/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // END PUT API : '/api/v1/ad/hosts/notifications/delete/:recordID'

  // BEGIN PUT API : '/api/v1/ad/hosts/notifications/read/status/:recordID'
  app.put('/api/v1/ad/hosts/notifications/read/status/:recordID', function (req, res, callback) {
    if (req.headers.token && req.params.recordID && req.body.status) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsNotificationsService.hostsNotificationsReadStatus(req.params.recordID, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsNotificationsController.js at put API -' +
            '/api/v1/ad/hosts/notifications/read/status/:recordID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsNotificationsController.js at put API -' +
            '/api/v1/ad/hosts/notifications/read/status/:recordID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsNotificationsController.js at put API -' +
        '/api/v1/ad/hosts/notifications/read/status/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  //END PUT API : '/api/v1/ad/hosts/notifications/read/status/:recordID'

}
// END : AD-HostsNotificationsController