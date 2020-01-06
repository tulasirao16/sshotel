/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var logger = require('../lib/logger');
var utils = require('../lib/util');
var AD_HostPropertyLocationServices = require('../services/AD-HostPropertyLocationServices');
var commonService = require('../services/CommonService');

// --- Begin: AD-HostPropertyLocationsController
module.exports.controller = function (app, passport) {
  // -- Begin: /api/v1/ad/host/property/location/:locationID/:propertyId
  app.put('/api/v1/ad/host/property/location/:locationID/:propertyId', function (req, res, next) {
    var bodyValidation = propertylocationUpdateBodyValidation(req.body);
    if (req.headers.token && bodyValidation && req.params.locationID && req.params.propertyId) {
      commonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostPropertyLocationServices.updateADPropertyLocationsData(req.body, req.params.locationID, req.params.propertyId, tokenDecodedData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostPropertyLocationsController.js at put API -' +
            '/api/v1/ad/host/property/location/:locationID/:propertyId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostPropertyLocationsController.js at put API -' +
            '/api/v1/ad/host/property/location/:locationID/:propertyId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostPropertyLocationsController.js at put API -' +
        '/api/v1/ad/host/property/location/:locationID/:propertyId: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
}
// -- End: /api/v1/ad/host/property/location/:locationID/:propertyId 

/**
* @param {object} reqBodyObj object
* @return {boolean} boolean
*/
function propertylocationUpdateBodyValidation(reqBodyObj) {
  if (reqBodyObj.contactPerson && reqBodyObj.mobileNumber && reqBodyObj.email && reqBodyObj.address && reqBodyObj.area && reqBodyObj.city && reqBodyObj.state
    && reqBodyObj.zip && reqBodyObj.latitude && reqBodyObj.longitude && reqBodyObj.locationStatus) {
    return true;
  } else
    return false;
}
