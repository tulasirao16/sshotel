/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
// var CommonService = require('../services/CommonService');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var EU_PopularAreasService = require('../services/EU-PopularAreasService');

module.exports.controller = function(app, passport) {
    
    // --- Begin of POST: '/api/v1/eu/user/popular/areas/incity'
    app.post('/api/v1/eu/user/popular/areas/incity', function(req, res, next) {
        if(req.body.city && req.body.state) {
            EU_PopularAreasService.popularAreasInCity(req.body, res, function(resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } else {
            logger.error('There was an Error in controllers/EU-PopularAreasController.js, at post API -',
                ' /api/v1/eu/user/popular/areas/incity: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // --- End of POST: '/api/v1/eu/user/popular/areas/incity'
}
