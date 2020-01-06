/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var SP_PIGuestRulesService = require('../services/SP-PIGuestRulesService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function (app, passport) {
  // -- Begin /api/v1/sp/property/info/guest/rules/:propertyId/:propertyInfoId/:searchString? - Code to get property guest rules  
  app.get('/api/v1/sp/property/info/guest/rules/:propertyId/:propertyInfoId/:searchString?', function (req, res, next) {
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && req.params.propertyId && req.params.propertyInfoId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PIGuestRulesService.getPropertyInfoGuestRulesList(req.params.propertyId, req.params.propertyInfoId, tokenDecodedData.decodedTokenData, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PIGuestRulesController.js at get API -',
            ' /api/v1/sp/property/info/guest/rules/:propertyId/:propertyInfoId/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PIGuestRulesController.js at get API -',
            ' /api/v1/sp/property/info/guest/rules/:propertyId/:propertyInfoId/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    }
  });
  // -- End /api/v1/sp/property/info/guest/rules/:propertyId/:propertyInfoId/:searchString? - Code to get property guest rules  
  // --- Begin '/api/v1/sp/propertyinfo/guestrulesnotes'
  app.put('/api/v1/sp/propertyinfo/guestrulesnotes', function(req, res, next) {
    var guestRulesNotes = req.body.guestRulesNotes;
    if (!req.body.guestRulesNotes || req.body.guestRulesNotes == 'undefined') {
      guestRulesNotes = '';
    }
    if(req.body.propertyId && req.body.propertyInfoId  && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PIGuestRulesService.updateSPPropertyInfoGuestRulesNotes(req.body, guestRulesNotes, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-PIGuestRulesController.js at put API -' +
            ' /api/v1/sp/propertyinfo/guestrulesnotes: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/SP-PIGuestRulesController.js at put API -' +
            ' /api/v1/sp/propertyinfo/guestrulesnotes: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/SP-PIGuestRulesController.js at put API -' +
        '/api/v1/sp/propertyinfo/guestrulesnotes: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/propertyinfo/guestrulesnotes'
}