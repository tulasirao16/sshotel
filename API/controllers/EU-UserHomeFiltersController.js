/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var EU_UserHomeFiltersService = require('../services/EU-UserHomeFiltersService');

module.exports.controller = function(app, passport) {
     // --- Begin '/api/v1/eu/home/enduser/byfilter'
  app.post('/api/v1/eu/home/enduser/byfilter', function(req, res, next) {
    var pageNumber = parseInt(req.body.activePage);
    if(pageNumber && req.body.area && req.body.city && req.body.state && req.body.BHK && req.body.adult ) {
        EU_UserHomeFiltersService.getEndUserHomeFilterByData(req.body, pageNumber, function (resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserHomeFiltersController.js at post API -'+
      ' /api/v1/eu/home/enduser/byfilter: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    } 
  });
  //--- End '/api/v1/eu/home/enduser/byfilter'

  // --- Begin '/api/v1/eu/home/enduser/room/byfilter'
  app.post('/api/v1/eu/home/enduser/room/byfilter', function (req, res, next) {
    var pageNumber = parseInt(req.body.activePage);
    if (pageNumber && req.body.area && req.body.city && req.body.state && req.body.BHK && req.body.adult && req.body.roomType) {
      EU_UserHomeFiltersService.getEndUserHomeFilterRoomByData(req.body, pageNumber, function (resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserHomeFiltersController.js at post API -' +
        ' /api/v1/eu/home/enduser/room/byfilter: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
//--- End /api/v1/eu/home/enduser/room/byfilter'

  // --- Begin '/api/v1/eu/map/enduser/byfilter'
  app.post('/api/v1/eu/map/enduser/byfilter', function(req, res, next) {
    if(req.body.area && req.body.city && req.body.state && req.body.guests) {
        EU_UserHomeFiltersService.getEndUserMapFilterByData(req.body, function (resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserHomeFiltersController.js at post API -'+
      ' /api/v1/eu/map/enduser/byfilter: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    } 
  });
  //--- End '/api/v1/eu/map/enduser/byfilter'

  // --- Begin '/api/v1/eu/home/enduser/bysort'
  app.post('/api/v1/eu/home/enduser/bysort', function(req, res, next) {
    var pageNumber = parseInt(req.body.activePage);
    if(pageNumber && req.body.area && req.body.city && req.body.state && req.body.adult && req.body.BHK) {
        EU_UserHomeFiltersService.getEndUserHomeSortByData(req.body, pageNumber, function (resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserHomeFiltersController.js at post API -'+
      ' /api/v1/eu/home/enduser/bysort: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    } 
  });
  //--- End '/api/v1/eu/home/enduser/bysort'

  app.post('/api/v1/eu/home/sps/byfilter/bysort', function(req, res, next) {
    var pageNumber = parseInt(req.body.activePage);
    if(pageNumber && req.body.area && req.body.city && req.body.state && req.body.adult && 
       req.body.BHK && req.body.lowCost && req.body.highCost) {
        EU_UserHomeFiltersService.getEndUserHomeFilterByGroup(req.body, pageNumber, function (resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserHomeFiltersController.js at post API -'+
      ' /api/v1/eu/home/sps/byfilter/bysort: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    } 
  });
};


