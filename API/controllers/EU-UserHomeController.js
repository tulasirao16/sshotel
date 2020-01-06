/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var geolite2 = require('geolite2');
var maxmind = require('maxmind');

var logger = require('../lib/logger');
var utils = require('../lib/util');
var EU_UserHomeService = require('../services/EU-UserHomeService');
var CommonService = require('../services/CommonService');

module.exports.controller = function(app, passport) {
  // --- Begin '/api/v1/eu/home/sps': Code to get User Home Screen Data
  app.post('/api/v1/eu/home/sps', function(req, res, next) {
    if(req.headers.token && req.headers.token != 'null') {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserHomeService.getUserServiceProvidersData(req.body, req.body.activePage, 'withToken', tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserHomeController.js at post API - /api/v1/eu/home/sps: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/EU-UserHomeController.js at post API - /api/v1/eu/home/sps: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      EU_UserHomeService.getUserServiceProvidersData(req.body, req.body.activePage,'withOutToken', {}, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    }
  });
  // --- End '/api/v1/eu/home/sps': Code to get User Home Screen Data

  // --- Begin '/api/v1/eu/home/sps/:dataType': Code to get User Home Screen Data By Nearest Area
  app.post('/api/v1/eu/home/sps/from/nearestarea', function(req, res, next) {
    if (req.body.activePage &&  req.body.area) {
      EU_UserHomeService.getUserHomeDataByNearestArea(req.body, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserHomeController.js, at post API -',
      '/api/v1/eu/home/sps/nearestarea/:area: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/eu/home/sps/nearestarea/:area': Code to get User Home Screen Data By Nearest Area

  // --- Begin '/api/v1/eu/home/sps/:dataType': Code to get User Home Screen Data By dataType
  app.post('/api/v1/eu/home/sps/:dataType', function(req, res, next) {
    if (req.body.activePage && req.params.dataType ) {
      EU_UserHomeService.getUserHomeDataBydataType(req.body, req.params.dataType, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserHomeController.js, at post API -',
      '/api/v1/eu/home/sps/:dataType: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/eu/home/sps/:dataType': Code to get User Home Screen Data By dataType

  // --- Begin '/api/v1/eu/home/sps/mapview/coordinates': Code to get User Home Screen Data By dataType
  app.post('/api/v1/eu/home/sps/mapview/coordinates', function(req, res, next) {
    if (req.body.area && req.body.city && req.body.state ) {
      EU_UserHomeService.getUserMapViewDataByLocation(req.body, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserHomeController.js, at post API -',
      '/api/v1/eu/home/sps/mapview/coordinates: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/eu/home/sps/mapview/coordinates': Code to get User Home Screen Data By dataType
  
  app.post('/api/v1/eu/home/compare/host', function(req, res, next) {
    if (req.body.compareIDS) {
      EU_UserHomeService.getUserHomeCompareHosts(req.body.compareIDS, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserHomeController.js, at post API -',
      '/api/v1/eu/home/compare/host: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.post('/api/v1/whatsapp/message/sent/response', function(req, res, next) {
    console.log('API RES:');
    utils.sendResponse(res, 400, '9998', {});
  });
}
