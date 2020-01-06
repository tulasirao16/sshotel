/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var SP_NotificationsService = require('../services/SP-NotificationsService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function (app, passport) {

    // Begin -- /api/v1/sp/notification/:activePage
    app.get('/api/v1/sp/notification/:activePage/:searchString?', function (req, res, next) {
        var pageNumber = parseInt(req.params.activePage);
        var searchString = req.params.searchString;
        if (!req.params.searchString || req.params.searchString == 'undefined') {
            searchString = '';
        }
        if (req.headers.token && pageNumber) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    SP_NotificationsService.getSPNotifications(pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/SP-NotificationsController.js at get API -' +
                        '/api/v1/sp/notification/:activePage/:searchString? Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/SP-NotificationsController.js at get API -' +
                        ' /api/v1/sp/notification/:activePage/:searchString? Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/SP-NotificationsController.js at get API -' +
                ' /api/v1/sp/notification/:activePage/:searchString? Missing Mandatory Fields');
            utils.sendResponse(res, 400, '9998', {});
        }
    });

    app.get('/api/v1/sp/unread/notification/count', function (req, res, next) {
        if (req.headers.token) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    SP_NotificationsService.getSPNotificationsUnReadCount(tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/SP-NotificationsController.js at get API -' +
                        '/api/v1/sp/notification/unread/count: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/SP-NotificationsController.js at get API -' +
                        ' /api/v1/sp/notification/unread/count: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/SP-NotificationsController.js at get API -' +
                ' /api/v1/sp/notification/unread/count: Missing Mandatory Fields');
            utils.sendResponse(res, 400, '9998', {});
        }
    });

    app.put('/api/v1/sp/notification/unread/to/read', function (req, res, next) {
        if (req.headers.token) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    SP_NotificationsService.updateSPNotificationUnReadToRead(tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/SP-NotificationsController.js at get API -' +
                        '/api/v1/sp/notification/unread/to/read: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/SP-NotificationsController.js at get API -' +
                        ' /api/v1/sp/notification/unread/to/read: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/SP-NotificationsController.js at get API -' +
                ' /api/v1/sp/notification/unread/to/read: Missing Mandatory Fields');
            utils.sendResponse(res, 400, '9998', {});
        }
    });

    app.put('/api/v1/sp/notification/delete', function (req, res, next) {
        if (req.body.notifyIDs && req.headers.token) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    SP_NotificationsService.serviceProviderDeleteNotification(req.body.notifyIDs, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/SP-NotificationsController.js at delete API -',
                        ' /api/v1/sp/notification/delete: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Un-known Error in controllers/Sp-NotificationsController.js at delete API -',
                        ' /api/v1/sp/notification/delete: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/Sp-NotificationsController.js at delete API -',
                ' /api/v1/sp/notification/delete: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });

    // End -- /api/v1/sp/notification/:activePage/:searchString?

}