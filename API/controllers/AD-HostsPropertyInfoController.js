/* Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written by Hari <hari@ngstek.com>, Jan 2018
*/
var CommonService = require('../services/CommonService');
var AD_HostsPropertyInfoService = require('../services/AD-HostsPropertyInfoService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Begin: AD-HostsPropertyInfoController
module.exports.controller = function (app, passport) {
  // -- Begin : /api/v1/ad/hosts/property/info/:propertyID
  app.get('/api/v1/ad/hosts/property/info/:propertyID', function (req, res, next) {
    if (req.headers.token && req.params.propertyID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPropertyInfoService.getADHostsPropertyInfoDataByID(req.params.propertyID, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPropertyInfoController.js at get API -' +
            ' /api/v1/ad/hosts/property/info/:propertyID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPropertyInfoController.js at get API -' +
            '  /api/v1/ad/hosts/property/info/:propertyID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPropertyInfoController.js at get API -' +
        '  /api/v1/ad/hosts/property/info/:propertyID: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/ad/hosts/property/info/:propertyID

  // -- Begin : /api/v1/ad/hosts/property/info/propertyinfo/update/:propertyID/:propertyinfoID
  app.put('/api/v1/ad/hosts/property/info/propertyinfo/update/:propertyID/:propertyinfoID',function(req, res, next){
    var bodyValidation = updateInfoBodyValidation(req.body);
    if(req.params.propertyID && req.params.propertyinfoID &&  req.headers.token && bodyValidation) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPropertyInfoService.updateADHostsPropertyInfos(req.body, req.params.propertyinfoID, req.params.propertyID, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPropertyInfoController.js at put API -' +
          '/api/v1/ad/hosts/property/info/propertyinfo/update/:propertyID/:propertyinfoID Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPropertyInfoController.js at put API -' +
          '/api/v1/ad/hosts/property/info/propertyinfo/update/:propertyID/:propertyinfoID Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPropertyInfoController.js at put API -' +
      '/api/v1/ad/hosts/property/info/propertyinfo/update/:propertyID/:propertyinfoID Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- END : /api/v1/ad/hosts/property/info/propertyinfo/update/:propertyID/:propertyinfoID

  // -- Begin : /api/v1/ad/hosts/property/info/status/change/:propertyInfoId/:status
  app.put('/api/v1/ad/hosts/property/info/status/change/:propertyInfoId/:status', function (req, res, next) {
    if (req.headers.token && req.params.propertyInfoId && req.params.status) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPropertyInfoService.ADHostsPropertyInfoStatusChange(req.params.propertyInfoId, req.params.status, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPropertyInfoController.js at put API -'+
            '/api/v1/ad/hosts/property/info/status/change/:propertyInfoId/:status: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPropertyInfoController.js at put API -'+
            ' /api/v1/ad/hosts/property/info/status/change/:propertyInfoId/:status: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPropertyInfoController.js at put API -' +
        '/api/v1/ad/hosts/property/info/status/change/:propertyInfoId/:status: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/ad/hosts/property/info/status/change/:propertyInfoId/:status

  // -- Begin : /api/v1/ad/hosts/property/info/propertyinfo/create
  app.post('/api/v1/ad/hosts/property/info/propertyinfo/create', function (req, res, next) { 
    var bodyValidation = createInfoBodyValidation(req.body);
      if (req.headers.token && bodyValidation) {
        CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {    
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPropertyInfoService.createADHostsPropertyInfo(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-PropertyInfoController.js at post API -'+
            '/api/v1/ad/hosts/property/info/propertyinfo/create: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-PropertyInfoController.js at post API -'+
            '/api/v1/ad/hosts/property/info/propertyinfo/create: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-PropertyInfoController.js at post API -' +
        '/api/v1/ad/hosts/property/info/propertyinfo/create: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/ad/hosts/property/info/propertyinfo/create

  // -- Begin : /api/v1/ad/hosts/property/info/pricing/update/:propertyInfoId/:propertyId
  app.put('/api/v1/ad/hosts/property/info/pricing/update/:propertyInfoId/:propertyId', function (req, res, next) {
    var bodyValidation = updatePricingBodyValidation(req.body); 
    if (req.headers.token && req.params.propertyInfoId && bodyValidation) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPropertyInfoService.updateADHostsPropertyInfoPricing(req.params.propertyInfoId, req.params.propertyId, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPropertyInfoController.js at put API -'+
            '/api/v1/ad/hosts/property/info/pricing/update/:propertyInfoId/:propertyId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPropertyInfoController.js at put API -'+
            '/api/v1/ad/hosts/property/info/pricing/update/:propertyInfoId/:propertyId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPropertyInfoController.js at put API -' +
        '/api/v1/ad/hosts/property/info/pricing/update/:propertyInfoId/:propertyId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End: /api/v1/ad/hosts/property/info/pricing/update/:propertyInfoId/:propertyId
}
// --- END: AD-HostsPropertyInfoController




/**
 * @param {object} reqBody object
 */

function updateInfoBodyValidation(reqBody) {
  if(reqBody.rentType && reqBody.roomType && reqBody.roomCategory && reqBody.membersCapacity && reqBody.childsCapacity
    && reqBody.roomsCount && reqBody.activeRoomsCount) {
      return true;
    } else {
      return false;
    }
}



/**
 * @param {object} reqBody object
 */

function createInfoBodyValidation(reqBody) {
  if(reqBody.rentType && reqBody.roomType && reqBody.roomCategory && reqBody.membersCapacity && reqBody.childsCapacity
    && reqBody.roomsCount && reqBody.activeRoomsCount && reqBody.pricing.appPercentage && reqBody.pricing.appPgPercentage && reqBody.pricing.fullRefundCancelTime && 
    reqBody.pricing.refundCancelTime && reqBody.pricing.refundCancelPercentage && reqBody.pricing.basePrice && reqBody.pricing.minBasePrice && reqBody.pricing.minBasePrice2 && 
    reqBody.pricing.minBasePrice3 && reqBody.pricing.minBasePrice4 && reqBody.pricing.weekEndBasePrice && reqBody.pricing.weekEndMinBasePrice && reqBody.pricing.weekEndMinBasePrice2 &&
   reqBody.pricing.weekEndMinBasePrice3 && reqBody.pricing.weekEndMinBasePrice4) {
      return true;
    } else {
      return false;
    }
}



/**
 * @param {object} reqBody object
 */

function updatePricingBodyValidation(reqBody) {
  if(reqBody.pricing.appPercentage && reqBody.pricing.appPgPercentage && reqBody.pricing.fullRefundCancelTime && 
    reqBody.pricing.refundCancelTime && reqBody.pricing.refundCancelPercentage && reqBody.pricing.basePrice && reqBody.pricing.minBasePrice && reqBody.pricing.minBasePrice2 && 
    reqBody.pricing.minBasePrice3 && reqBody.pricing.minBasePrice4 && reqBody.pricing.weekEndBasePrice && reqBody.pricing.weekEndMinBasePrice && reqBody.pricing.weekEndMinBasePrice2 &&
   reqBody.pricing.weekEndMinBasePrice3 && reqBody.pricing.weekEndMinBasePrice4) {
      return true;
    } else {
      return false;
    }
}