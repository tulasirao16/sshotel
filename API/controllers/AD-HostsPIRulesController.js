/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var AD_HostsPIRulesService = require('../services/AD-HostsPIRulesService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

//---Begin:AD-HostsPIRulesController
module.exports.controller = function (app, passport) {
  // -- Begin:/api/v1/ad/hosts/property/info/rules/:propertyInfoId/:propertyId/:searchString? - Code to get property Info Rules
  app.get('/api/v1/ad/hosts/property/info/rules/:propertyInfoId/:propertyId/:searchString?', function (req, res, next) {
    var searchString = req.params.searchString == 'undefined' || !req.params.searchString ?  '': req.params.searchString;
    if (req.headers.token && req.params.propertyId && req.params.propertyInfoId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPIRulesService.getADHostsPropertyInfoRulesList(req.params, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPIRulesController.js at get API -' +
          '/api/v1/ad/hosts/property/info/rules/:propertyInfoId/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPIRulesController.js at get API -' +
          '/api/v1/ad/hosts/property/info/rules/:propertyInfoId/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPIRulesController.js at get API -' +
      '/api/v1/ad/hosts/property/info/rules/:propertyInfoId/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End:/api/v1/ad/hosts/property/info/rules/:propertyInfoId/:searchString? - Code to get property Info Rules 
 
  // --- Begin '/api/v1/ad/hosts/property/info/rules/guestrulesnotes' - Code to update property Info guestrulesnotes
  app.put('/api/v1/ad/hosts/property/info/rules/guestrulesnotes', function(req, res, next) {
    var guestRulesNotes = req.body.guestRulesNotes == 'undefined' || !req.body.guestRulesNotes ? '' : req.body.guestRulesNotes;
    if(req.body.propertyId && req.body._id  && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPIRulesService.updateADHostsPropertyInfoGuestRulesNotes(req.body, guestRulesNotes, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPIRulesController.js at put API -' +
          ' /api/v1/ad/hosts/property/info/rules/guestrulesnotes: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPIRulesController.js at put API -' +
          ' /api/v1/ad/hosts/property/info/rules/guestrulesnotes: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPIRulesController.js at put API -' +
      '/api/v1/ad/hosts/property/info/rules/guestrulesnotes: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/hosts/property/info/rules/guestrulesnotes' - Code to update property info guestrulesnotes

  //--- Begin '/api/v1/ad/hosts/property/info/rules/status' - code to update property info guestrules status
  app.put('/api/v1/ad/hosts/property/info/rules/status', function(req, res, next ) { 
    if( req.body.propertyInfoId && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPIRulesService.updateADHostsPropertyInfoGuestRules(req.body, tokenDecodedData, function(resObj){
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPIRulesController.js at put API -' +
          ' /api/v1/ad/hosts/property/info/rules/guestrulesnotes: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPIRulesController.js at put API -' +
          ' /api/v1/ad/hosts/property/info/rules/guestrulesnotes: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPIRulesController.js at put API -' +
      '/api/v1/ad/hosts/property/info/rules/guestrulesnotes: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
   }
 }); 
}
//---END:AD-HostsPIRulesController