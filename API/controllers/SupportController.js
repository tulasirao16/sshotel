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
var SupportService = require('../services/SupportService');
var uuid = require('node-uuid');

module.exports.controller = function (app, passport) {


    // Begin api/v1/support/without/login

    app.post('/api/v1/support/without/login', function (req, res, next) {
        if (req.body.ticketTitle && req.body.ticketTag && req.body.reqMobileNumber && req.body.name && req.body.ticketDescription) {
            SupportService.createSupportData(req.body, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } else {
            logger.error('There was an Error in controllers/SupportController.js at post API -' +
                '/api/v1/support/without/login: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });

    // --- End api/v1/support/without/login

}
