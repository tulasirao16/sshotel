/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var multer = require('multer');
var fs = require('fs');
var rimraf = require('rimraf');
var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var EU_UserSupportService = require('../services/EU-UserSupportService');
var uuid = require('node-uuid');

module.exports.controller = function (app, passport) {

    app.get('/api/v1/eu/support/:activePage/:searchString?', function (req, res, next) {
        var pageNum = parseInt(req.params.activePage);
        var searchString = req.params.searchString;
        if (!req.params.searchString || req.params.searchString == 'undefined') {
            searchString = '';
        }
        if (req.headers.token && pageNum) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    EU_UserSupportService.getEUSupportData(pageNum, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/EU-UserSupportController.js at get API -',
                        '/api/v1/eu/support/:activePage/:searchString?: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/EU-UserSupportController.js at get API -',
                        ' /api/v1/eu/support/:activePage/:searchString?: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/EU-UserSupportController.js at get API -',
                ' /api/v1/eu/support/:activePage/:searchString?: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });

    // --- Begin '/api/v1/eu/support/create'
    app.post('/api/v1/eu/support/create', function (req, res, next) {
        if (req.body.ticketTitle && req.body.ticketTag && req.body.reqMobileNumber && req.body.ticketDescription && req.headers.token) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    EU_UserSupportService.createEUSupportData(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/EU-UserSupportController.js at post API -' +
                        ' /api/v1/eu/support/create: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/EU-UserSupportController.js at post API -' +
                        ' /api/v1/eu/support/create: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/EU-UserSupportController.js at post API -' +
                '/api/v1/eu/support/create: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // --- End '/api/v1/eu/support/create'

}
