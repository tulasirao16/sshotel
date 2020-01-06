/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var SP_LocationsService = require('../services/SP-LocationsService');
var commonService = require('../services/CommonService');

// --- Begin: SP-ServiceLocationsController
module.exports.controller = function (app, passport) {
    // ----- Begin :/api/sp/services/locations'

    app.get('/api/sp/services/locations/:activePage/:searchString?', function (req, res, next) {
        var pageNumber = parseInt(req.params.activePage);
        var searchString = req.params.searchString;
        if (!req.params.searchString || req.params.searchString == 'undefined') {
            searchString = '';
        }
        if (req.headers.token && pageNumber) {
            commonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    SP_LocationsService.getSPServiceLocationsData(pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/SP-LocationsController.js at get API -',
                        ' /api/sp/services/locations/:activePage:searchString?: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/SP-LocationsController.js at get API -',
                        ' /api/sp/services/locations/:activePage:searchString?: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/SP-LocationsController.js, at get API -',
                ' /api/sp/services/locations:activePage/:searchString?: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });

    // ----- End :/api/sp/locations'

    // --- Begin '/api/sp/locations/create'
    app.post('/api/sp/locations/create', function (req, res, next) {
        var bodyValidation = locationBodyValidation(req.body);
        if (bodyValidation && req.headers.token && req.headers.token != 'undefined') {
            commonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    SP_LocationsService.postSPLocationsData(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/SP-LocationsController.js at post API -',
                        ' /api/sp/locations/create: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/SP-LocationsController.js at post API -',
                        ' /api/sp/locations/create: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/SP-LocationsController.js, at post API -',
                ' /api/sp/locations/create: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // --- End '/api/sp/locations/create'

    // --- Begin '/api/sp/locations/edit'
    app.put('/api/sp/locations/edit', function (req, res, next) {
        var bodyValidation = locationUpdateBodyValidation(req.body);
        if (bodyValidation && req.headers.token) {
            commonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    SP_LocationsService.updateSPLocationsData(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/SP-LocationsController.js at put API -' +
                        ' /api/sp/locations/edit: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/SP-LocationsController.js at put API -' +
                        ' /api/sp/locations/edit: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/SP-LocationsController.js at put API -' +
                '/api/sp/locations/edit: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // --- End '/api/sp/locations/edit'

    // --- Begin '/api/sp/locations/Activate/:recordID'
    app.put('/api/sp/locations/Activate/:recordID', function (req, res, next) {
        if (req.params.recordID && req.headers.token) {
            commonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    SP_LocationsService.activateSPLocationsData(req.params.recordID, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/SP-LocationsController.js at put API -' +
                        ' /api/sp/locations/Activate/:recordID: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/SP-LocationsController.js at put API -' +
                        ' /api/sp/locations/Activate/:recordID: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/SP-LocationsController.js at put API -' +
                '/api/sp/locations/active/:recordID: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // --- End '/api/sp/locations/active/:recordID'

    // --- Begin '/api/sp/locations/Inactivate/:recordID'
    app.put('/api/sp/locations/Inactivate/:recordID', function (req, res, next) {
        if (req.params.recordID && req.headers.token) {
            commonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    SP_LocationsService.inActivateSPLocationsData(req.params.recordID, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/SP-LocationsController.js at put API -' +
                        ' /api/sp/locations/Inactivate/:recordID: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/SP-LocationsController.js at put API -' +
                        ' /api/sp/locations/Inactivate/:recordID: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/SP-LocationsController.js at put API -' +
                '/api/sp/locations/Inactivate/:recordID: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // --- End '/api/sp/locations/Inactivate/:recordID'

};

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function locationBodyValidation(reqBodyObj) {
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
function locationUpdateBodyValidation(reqBodyObj) {
    if (reqBodyObj._id && reqBodyObj.contactPerson && reqBodyObj.mobileNumber && reqBodyObj.email && reqBodyObj.address && reqBodyObj.area && reqBodyObj.city && reqBodyObj.state
        && reqBodyObj.zip && reqBodyObj.latitude && reqBodyObj.longitude && reqBodyObj.locationStatus) {
        return true;
    } else
        return false;
}
 // --- End: SP-ServiceLocationsController