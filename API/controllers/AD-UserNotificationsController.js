/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var AD_UserNotificationsService = require('../services/AD-UserNotificationsService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// BEGIN : AD-UserNotificationsController
module.exports.controller = function (app, passport) {

    // BEGIN GET API : '/api/v1/ad/user/notifications/:userId/:activePage/:searchString?'
    app.get('/api/v1/ad/user/notifications/:userId/:activePage/:searchString?', function (req, res, next) {
        var pageNumber = parseInt(req.params.activePage);
        var searchString = req.params.searchString ? req.params.searchString : '';
        if (req.headers.token && req.params.userId && pageNumber) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_UserNotificationsService.getUserNotifications(req.params.userId, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-UserNotificationsController.js at get API -',
                        '/api/v1/ad/user/notifications/:userId/:activePage/:searchString?: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                }
                else {
                    logger.error('There was an Un-known Error in controllers/AD-UserNotificationsController.js at get API -',
                        ' /api/v1/ad/user/notifications/:userId/:activePage/:searchString?: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-UserNotificationsController.js at get API -',
                ' /api/v1/ad/user/notifications/:userId/:activePage/:searchString?: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }

    });
    // END GET API : '/api/v1/ad/user/notifications/:userId/:activePage/:searchString?'

    // BEGIN PUT API : '/api/v1/ad/user/notifications/read/status/:recordID'
    app.put('/api/v1/ad/user/notifications/read/status/:recordID', function (req, res, callback) {
        if (req.headers.token && req.params.recordID && req.body.status) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_UserNotificationsService.userNotificationsReadStatus(req.params.recordID, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-UserNotificationsController.js at put API -' +
                        '/api/v1/ad/user/notifications/read/status/:recordID: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/AD-UserNotificationsController.js at put API -' +
                        '/api/v1/ad/user/notifications/read/status/:recordID: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-UserNotificationsController.js at put API -' +
                '/api/v1/ad/user/notifications/read/status/:recordID: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    //END PUT API : '/api/v1/ad/user/notifications/read/status/:recordID'

    // BEGIN PUT API : '/api/v1/ad/user/notifications/delete/:recordID'
    app.put('/api/v1/ad/user/notifications/delete/:recordID', function (req, res, next) {
        if (req.params.recordID && req.headers.token) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_UserNotificationsService.userNotificationsDelete(req.params.recordID,
                        tokenDecodedData.decodedTokenData, function (resObj) {
                            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                        });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-UserNotificationsController.js at delete API -',
                        '/api/v1/ad/user/notifications/delete/:recordID: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Un-known Error in controllers/AD-UserNotificationsController.js at delete API -',
                        '/api/v1/ad/user/notifications/delete/:recordID: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-UserNotificationsController.js at delete API -',
                '/api/v1/ad/user/notifications/delete/:recordID: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // END PUT API : '/api/v1/ad/user/notifications/delete/:recordID'
}
// END : AD-UserNotificationsController