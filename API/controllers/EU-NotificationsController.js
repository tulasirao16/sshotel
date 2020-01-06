/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var EU_NotificationsService = require('../services/EU-NotificationsService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function (app, passport) {
  // Begin -- /api/v1/eu/user/notices
  app.get('/api/v1/eu/user/notices', function (req, res, next) {
    if (req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_NotificationsService.getEndUserNotifications(tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-NotificationsController.js at get API -' +
            '/api/v1/eu/user/notices: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/EU-NotificationsController.js at get API -' +
            ' /api/v1/eu/user/notices: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-NotificationsController.js at get API -' +
        ' /api/v1/eu/user/notices: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // End -- /api/v1/eu/user/notices

  app.get('/api/v1/eu/user/notices/unread/count', function (req, res, next) {
    if (req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_NotificationsService.getEndUserNotificationsUnReadCount(tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-NotificationsController.js at get API -' +
            '/api/v1/eu/user/notices/unread/count: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/EU-NotificationsController.js at get API -' +
            ' /api/v1/eu/user/notices/unread/count: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-NotificationsController.js at get API -' +
        ' /api/v1/eu/user/notices/unread/count: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // Begin -- /api/v1/eu/user/notice/read
  app.put('/api/v1/eu/user/notice/read', function (req, res, next) {
    if (req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_NotificationsService.updateEndUserNotificationUnReadToRead(tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-NotificationsController.js at put API -' +
            '/api/v1/eu/user/notice/read: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/EU-NotificationsController.js at put API -' +
            ' /api/v1/eu/user/notice/read: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-NotificationsController.js at put API -' +
        ' /api/v1/eu/user/notice/read: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // End -- /api/v1/eu/user/notice/read

  app.put('/api/v1/eu/user/notice/delete', function (req, res, next) {
    if (req.body.notifyIDs && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_NotificationsService.endUserDeleteNotifications(req.body.notifyIDs, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-NotificationsController.js at delete API -',
            ' /api/v1/eu/user/notice/delete: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-NotificationsController.js at delete API -',
            '/api/v1/eu/user/notice/delete: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-NotificationsController.js at delete API -',
        ' /api/v1/eu/user/notice/delete: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
}