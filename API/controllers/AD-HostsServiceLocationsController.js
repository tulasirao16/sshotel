/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var AD_HostsServiceLocationsService = require('../services/AD-HostsServiceLocationsService');
var CommonService = require('../services/CommonService');

// --- Begin: AD-HostsServiceLocationsController
module.exports.controller = function (app, passport) {
    // ----- Begin :/api/v1/ad/hosts/service/locations/:hostId/:activePage/:searchString?
    app.get('/api/v1/ad/hosts/service/locations/:hostId/:activePage/:searchString?', function (req, res, next) {
        var pageNumber = parseInt(req.params.activePage);
        var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
        if (req.headers.token && pageNumber && req.params.hostId) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_HostsServiceLocationsService.getADHostServiceLocationsData(req.params.hostId, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-HostsServiceLocationsController.js at get API -' +
                        '/api/v1/ad/hosts/service/locations/:hostId/:activePage/:searchString?: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/AD-HostsServiceLocationsController.js at get API -' +
                        '/api/v1/ad/hosts/service/locations/:hostId/:activePage/:searchString?: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllersAD-HostsServiceLocationsController.js, at get API -' +
                '/api/v1/ad/hosts/service/locations/:hostId/:activePage/:searchString?: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // ----- End :/api/v1/ad/hosts/service/locations/:hostId/:activePage/:searchString?

    // --- Begin /api/v1/ad/hosts/service/location/status/update/:locationId'
    app.put('/api/v1/ad/hosts/service/location/status/update/:locationId', function (req, res, callback) {
        if (req.headers.token && req.params.locationId && req.body.status) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_HostsServiceLocationsService.updateADHostServiceLocationsStatus(req.params.locationId, req.body, tokenDecodedData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-HostsServiceLocationsController.js at put API -' +
                        '/api/v1/ad/hosts/service/location/status/update/:locationId: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/AD-HostsServiceLocationsController.js at put API -' +
                        '/api/v1/ad/hosts/service/location/status/update/:locationId: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-HostsServiceLocationsController.js at put API -' +
                '/api/v1/ad/hosts/service/location/status/update/:locationId: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // --- End /api/v1/ad/hosts/service/location/status/update/:locationId'

    // --- Begin '/api/v1/ad/hosts/service/location/:locationId'
    app.put('/api/v1/ad/hosts/service/location/:locationId', function (req, res, next) {
        var bodyValidation = locationUpdateBodyValidation(req.body);
        if (bodyValidation && req.params.locationId && req.headers.token) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_HostsServiceLocationsService.updateADHostServiceLocationsData(req.body, req.params.locationId, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-HostsServiceLocationsController.js at put API -' +
                        ' /api/v1/ad/hosts/service/location/:locationId: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/AD-HostsServiceLocationsController.js at put API -' +
                        ' /api/v1/ad/hosts/service/location/:locationId: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-HostsServiceLocationsController.js at put API -' +
                '/api/v1/ad/hosts/service/location/:locationId: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // --- End '/api/v1/ad/hosts/service/location/:locationId'

    // --- Begin '/api/v1/ad/hosts/service/location/create'
    app.post('/api/v1/ad/hosts/service/location/create', function (req, res, next) {
        var bodyValidation = locationBodyValidation(req.body);
        if (bodyValidation && req.headers.token && req.headers.token != 'undefined') {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_HostsServiceLocationsService.postADHostServiceLocationsData(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-HostsServiceLocationsController.js at post API -',
                        ' /api/v1/ad/hosts/service/location/create: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/AD-HostsServiceLocationsController.js at post API -',
                        ' /api/v1/ad/hosts/service/location/create: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-HostsServiceLocationsController.js, at post API -',
                '/api/v1/ad/hosts/service/location/create: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // --- End '/api/v1/ad/hosts/service/location/create'
}
// --- End: AD-HostsServiceLocationsController

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function locationUpdateBodyValidation(reqBodyObj) {
    if (reqBodyObj.contactPerson && reqBodyObj.mobileNumber && reqBodyObj.email && reqBodyObj.address && reqBodyObj.area && reqBodyObj.city && reqBodyObj.state
        && reqBodyObj.zip && reqBodyObj.latitude && reqBodyObj.longitude && reqBodyObj.locationStatus) {
        return true;
    } else
        return false;
}

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function locationBodyValidation(reqBodyObj) {
    if (reqBodyObj.spServiceProviderId && reqBodyObj.spServiceProvider && reqBodyObj.contactPerson && reqBodyObj.mobileNumber && reqBodyObj.email && reqBodyObj.address && reqBodyObj.area && reqBodyObj.city && reqBodyObj.state
        && reqBodyObj.zip && reqBodyObj.latitude && reqBodyObj.longitude && reqBodyObj.locationStatus) {
        return true;
    } else
        return false;
}
