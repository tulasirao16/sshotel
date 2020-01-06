/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var AD_HostPropertyNearByAreasService = require('../services/AD-HostPropertyNearByAreasService');

module.exports.controller = function (app, passport) {
    // -- Begin : /api/v1/ad/hosts/property/NearByAreas/update/:propertyID
    app.put('/api/v1/ad/hosts/property/NearByAreas/update/:propertyID', function (req, res,callback) {
        if (req.headers.token && req.params.propertyID && req.body.nearbyareas ) {  
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if(tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_HostPropertyNearByAreasService.updateADHostPropertyNearByAreasData(req.params.propertyID, req.body, tokenDecodedData, function (resObj) {
                       utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-HostPropertyNearByAreasController.js at put API -' +
                       '/api/v1/ad/hosts/property/NearByAreas/update/:propertyID: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/AD-HostPropertyNearByAreasController.js at put API -' +
                        '/api/v1/ad/hosts/property/NearByAreas/update/:propertyID: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-HostPropertyNearByAreasController.js at put API -' +
                '/api/v1/ad/hosts/property/NearByAreas/update/:propertyID: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
      // -- end : /api/v1/ad/hosts/property/NearByAreas/update/:propertyID
}