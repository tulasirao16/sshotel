/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var CommonService = require('../services/CommonService');
var SP_PropertyInfoService = require('../services/SP-PropertyInfoService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function (app, passport) {
  // -- Begin : /api/v1/sp/service/property/info/:propertyID
    app.get('/api/v1/sp/service/property/info/:propertyID', function (req, res, next) {
      if (req.headers.token && req.params.propertyID) {
        CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            SP_PropertyInfoService.getSpPropertyInfos(req.params.propertyID, function (resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          }
          else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -' +
              ' /api/v1/sp/service/property/info/:propertyID: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -' +
              '  /api/v1/sp/service/property/info/:propertyID: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else if (req.params.propertyID) {
        SP_PropertyInfoService.getSpPropertyInfos(req.params.propertyID, function (resObj) {
          utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
        });
      } else {
        logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -' +
          '  /api/v1/sp/service/property/info/:propertyID: Missing Mandatory Fields');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
  // -- End : /api/v1/sp/service/property/info/:propertyID

  // -- Begin : /api/v1/sp/property/info/pricing/:searchString?
  app.get('/api/v1/sp/property/info/pricing/:searchString?', function (req, res, next) {
    var searchString = req.params.searchString;
    if(!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertyInfoService.getPropertyInfoPricingList(tokenDecodedData.decodedTokenData, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -',
            '/api/v1/sp/property/info/pricing/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -',
            ' /api/v1/sp/property/info/pricing/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    }
  });

  // -- Begin : /api/v1/sp/property/info/guestrules/:propertyId/:propertyInfoId
  app.get('/api/v1/sp/property/info/guestrules/:propertyId/:propertyInfoId', function (req, res, next) {
    if (req.headers.token && req.params.propertyId && req.params.propertyInfoId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertyInfoService.getPropertyInfoGuestRulesList(req.params.propertyId, req.params.propertyInfoId, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -'+
            '/api/v1/sp/property/info/guestrules/:propertyId/:propertyInfoId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -'+
            ' /api/v1/sp/property/info/guestrules/:propertyId/:propertyInfoId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -' +
        '  /api/v1/sp/property/info/guestrules/:propertyId/:propertyInfoId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/property/info/guestrules/:propertyId/:propertyInfoId

  // -- Begin : /api/v1/sp/property/info/pricing/:propertyId/:propertyInfoId
  app.get('/api/v1/sp/property/info/pricing/:propertyId/:propertyInfoId', function (req, res, next) {
    if (req.headers.token && req.params.propertyId && req.params.propertyInfoId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertyInfoService.getPropertyInfoPrice(req.params.propertyId, req.params.propertyInfoId, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -'+
            '/api/v1/sp/property/info/pricing/:propertyId/:propertyInfoId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -'+
            ' /api/v1/sp/property/info/pricing/:propertyId/:propertyInfoId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -' +
        ' /api/v1/sp/property/info/pricing/:propertyId/:propertyInfoId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // -- Begin : /api/v1/sp/property/info/services/:propertyId/:propertyInfoId
  app.get('/api/v1/sp/property/info/services/:propertyId/:propertyInfoId', function (req, res, next) {
    if (req.headers.token && req.params.propertyId && req.params.propertyInfoId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertyInfoService.getPropertyInfoServices(req.params.propertyId, req.params.propertyInfoId, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -'+
            '/api/v1/sp/property/info/services/:propertyId/:propertyInfoId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -'+
            ' /api/v1/sp/property/info/services/:propertyId/:propertyInfoId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-PropertyInfoController.js at get API -' +
        ' /api/v1/sp/property/info/services/:propertyId/:propertyInfoId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // -- Begin : /api/v1/sp/property/info/create
  app.post('/api/v1/sp/property/info/create', function (req, res, next) {
    var bodyValidation = createInfoBodyValidation(req.body);
    if (req.headers.token && bodyValidation) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertyInfoService.createPropertyInfo(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at post API -'+
            '/api/v1/sp/property/info/create: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at post API -'+
            ' /api/v1/sp/property/info/create: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-PropertyInfoController.js at post API -' +
        ' /api/v1/sp/property/info/create: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/property/info/create

  // -- Begin : /api/v1/sp/property/info/update/:propertyId/:propertyInfoId
  app.put('/api/v1/sp/property/info/update/:propertyId/:propertyInfoId', function (req, res, next) {
    var bodyValidation = updateInfoBodyValidation(req.body);
    if (req.headers.token && req.params.propertyId && req.params.propertyInfoId &&  bodyValidation) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertyInfoService.updatePropertyInfo(req.body, req.params.propertyId, req.params.propertyInfoId, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at put API -'+
            '/api/v1/sp/property/info/update/:propertyId/:propertyInfoId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at put API -'+
            ' /api/v1/sp/property/info/update/:propertyId/:propertyInfoId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-PropertyInfoController.js at put API -' +
        ' /api/v1/sp/property/info/update/:propertyId/:propertyInfoId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/property/info/update/:propertyId/:propertyInfoId

  // -- Begin : /api/v1/sp/property/info/pricing/update/:propertyInfoId
  app.put('/api/v1/sp/property/info/pricing/update/:propertyInfoId/:propertyId', function (req, res, next) {
    var bodyValidation = updateInfoPricingBodyValidation(req.body);
    if (req.headers.token && req.params.propertyInfoId && bodyValidation) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertyInfoService.updatePropertyInfoPricing(req.params.propertyInfoId, req.params.propertyId, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at put API -'+
            '/api/v1/sp/property/info/pricing/update/:propertyInfoId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at put API -'+
            ' /api/v1/sp/property/info/pricing/update/:propertyInfoId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-PropertyInfoController.js at put API -' +
        ' /api/v1/sp/property/info/pricing/update/:propertyInfoId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/property/info/pricing/update/:propertyInfoId  

    // -- Begin : /api/v1/sp/property/info/status/change/:propertyInfoId
    app.put('/api/v1/sp/property/info/status/change/:propertyInfoId/:status', function (req, res, next) {
    if (req.headers.token && req.params.propertyInfoId && req.params.status) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertyInfoService.spPropertyInfoStatusChange(req.params.propertyInfoId, req.params.status, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at put API -'+
            '/api/v1/sp/property/info/status/change/:propertyInfoId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at put API -'+
            ' /api/v1/sp/property/info/status/change/:propertyInfoId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-PropertyInfoController.js at put API -' +
        ' /api/v1/sp/property/info/status/change/:propertyInfoId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/property/info/status/change/:propertyInfoId    

  // -- Begin : /api/v1/sp/property/info/amenities/update/:propertyInfoId
  app.put('/api/v1/sp/property/info/amenities/update/:propertyInfoId', function (req, res, next) {
    if (req.headers.token && req.params.propertyInfoId && req.body.avaliableData && req.body.type) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertyInfoService.updateAmenitiesInPropertyInfo(req.params.propertyInfoId, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at put API -'+
            '/api/v1/sp/property/info/amenities/update/:propertyInfoId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertyInfoController.js at put API -'+
            ' /api/v1/sp/property/info/amenities/update/:propertyInfoId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-PropertyInfoController.js at put API -' +
        ' /api/v1/sp/property/info/amenities/update/:propertyInfoId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/property/info/amenities/update/:propertyInfoId    

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

function updateInfoBodyValidation(reqBody) {
  if(reqBody.rentType && reqBody.roomType && reqBody.roomCategory && reqBody.membersCapacity && reqBody.childsCapacity
    && reqBody.roomsCount && reqBody.activeRoomsCount && reqBody.status) {
      return true;
    } else {
      return false;
    }
}

/**
 * @param {object} reqBody object
 */

function updateInfoPricingBodyValidation(reqBody) {
  if(reqBody.pricing.fullRefundCancelTime && reqBody.pricing.refundCancelTime && reqBody.pricing.refundCancelPercentage && reqBody.pricing.basePrice && reqBody.pricing.minBasePrice && reqBody.pricing.minBasePrice2 && 
    reqBody.pricing.minBasePrice3 && reqBody.pricing.minBasePrice4 && reqBody.pricing.weekEndBasePrice && reqBody.pricing.weekEndMinBasePrice && reqBody.pricing.weekEndMinBasePrice2 &&
    reqBody.pricing.weekEndMinBasePrice3 && reqBody.pricing.weekEndMinBasePrice4 && reqBody.pricing.spAmount) {
      return true;
    } else {
      return false;
    }
}

