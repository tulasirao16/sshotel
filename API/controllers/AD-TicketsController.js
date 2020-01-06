/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var AD_TicketsService = require('../services/AD-TicketsService');

/** Begin: AD-TicketsController */
module.exports.controller = function (app, passport) {
  app.get('/api/v1/ad/tickets/dashboard/:byDateType', function(req, res, next) {
    if (req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_TicketsService.getADTicketsData(tokenDecodedData.decodedTokenData, req.params.byDateType, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-TicketsController.js at get API -'+
            '/api/v1/ad/tickets/count: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-TicketsController.js at get API -'+
            ' /api/v1/ad/tickets/count: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-TicketsController.js at get API -'+
        ' /api/v1/ad/tickets/count: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v1/ad/tickets/:activePage/:searchString?', function(req, res, next) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if(req.headers.token && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_TicketsService.getADTicketsGetData(pageNum, searchString,tokenDecodedData.decodedTokenData, function(resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/AD-TicketsController.js at get API -',
            '/api/v1/ad/tickets/:activePage/:searchString?: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/AD-TicketsController.js at get API -',
            ' /api/v1/ad/tickets/:activePage/:searchString?: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/AD-TicketsController.js at get API -',
        ' /api/v1/ad/tickets/:activePage/:searchString?: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.post('/api/v1/ad/ticket/create', function (req, res, next) {
    var bodyValidation = adCreateTicketBodyValidation(req.body);
    if (req.headers.token && bodyValidation ){
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_TicketsService.postADCreateTicketData(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-UsersController.js at post API -' +
            '/api/v1/ad/ticket/create: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-UsersController.js at post API -' +
            '/api/v1/ad/ticket/create: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-UsersController.js at post API -' +
        '/api/v1/ad/ticket/create: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });


  app.get('/api/v1/ad/tickets/user/details/:mobileNumber/:userType', function(req, res, next) {
    if(req.headers.token && req.params.mobileNumber && req.params.userType) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_TicketsService.getADTicketsUserDetails(req.params.mobileNumber, req.params.userType, tokenDecodedData.decodedTokenData, function(resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/AD-TicketsController.js at get API -',
            '/api/v1/ad/tickets/user/details/:mobileNumber/:userType: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/AD-TicketsController.js at get API -',
            '/api/v1/ad/tickets/user/details/:mobileNumber/:userType: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/AD-TicketsController.js at get API -',
        '/api/v1/ad/tickets/user/details/:mobileNumber/:userType: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.put('/api/v1/ad/tickets/update/:recordID', function (req, res, next) {
    if (req.params.recordID && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_TicketsService.putADTicketUpdate(req.params.recordID, req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-TicketsController.js at put API -' +
            ' /api/v1/ad/tickets/update/:recordID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-TicketsController.js at put API -' +
            ' /api/v1/ad/tickets/update/:recordID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-TicketsController.js at put API -' +
        '/api/v1/ad/tickets/update/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
}
/** End: AD-TicketsController */



/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function adCreateTicketBodyValidation(reqBodyObj) {
  if (reqBodyObj.reqMobileNumber && reqBodyObj.assignStatus && reqBodyObj.ticketTitle && reqBodyObj.ticketDescription && reqBodyObj.ticketNumberType
    && reqBodyObj.ticketGroup && reqBodyObj.ticketTag && reqBodyObj.ticketPriority && reqBodyObj.ticketStatus) {
    return true;
  } else {
    return false;
  }
}

