/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var AD_HostsService = require('../services/AD-HostsService');

// --- Begin: AD-HostsController
module.exports.controller = function (app, passport) {
  // --- Begin '/api/v1/ad/hosts/bysearch/:activePage/:searchString'
  app.get('/api/v1/ad/hosts/bysearch/:activePage/:searchString', function (req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
     if (req.headers.token && req.params.searchString && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
           AD_HostsService.getADHostsListingDataBySearch(pageNum, req.params.searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
           });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsController.js at get API -' +
            '/api/v1/ad/hosts/bysearch/:activePage/:searchString: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsController.js at get API -' +
            '/api/v1/ad/hosts/bysearch/:activePage/:searchString: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
          }
      });
     }  else {
        logger.error('There was an Error in controllers/AD-HostsController.js at get API -' +
        '/api/v1/ad/hosts/bysearch/:activePage/:searchString: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
        }
  });
  // --- End '/api/v1/ad/hosts/bysearch/:activePage/:searchString'

  // --- Begin '/api/v1/ad/hosts/list/:activePage/:searchString?'
  app.get('/api/v1/ad/hosts/list/:activePage/:searchString?', function (req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = req.params.searchString == 'undefined' || !req.params.searchString ? '':req.params.searchString ;
    if (req.headers.token && pageNum) {
       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
           AD_HostsService.getADHostsListingData(pageNum, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
           });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsController.js at get API -' +
            '/api/v1/ad/hosts/list/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/AD-HostsController.js at get API -' +
            '/api/v1/ad/hosts/list/:activePage/:searchString?: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
       });
    } else {
      logger.error('There was an Error in controllers/AD-HostsController.js at get API -' +
        '/api/v1/ad/hosts/list/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
      }
  });
  // --- End '/api/v1/ad/hosts/list/:activePage/:searchString?'

  // --- Begin '/api/v1/ad/hosts/:hostid'
  app.get('/api/v1/ad/hosts/:hostid', function (req, res, callback) {
    if (req.headers.token && req.params.hostid) {
       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
           AD_HostsService.getADHostsDataByID(req.params.hostid, function (resObj) {
           utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
           });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsController.js at get API -' +
            '/api/v1/ad/hosts/:hostid: Token expired');
          utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/AD-HostsController.js at get API -' +
            '/api/v1/ad/hosts/:hostid: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
       });
    } else {
      logger.error('There was an Error in controllers/AD-HostsController.js at get API -' +
        '/api/v1/ad/hosts/:hostid: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
      }
  });
  // --- End '/api/v1/ad/hosts/:hostid':

  // -- Begin : /api/v1/ad/hosts/status/change/:hostID/:status:
  app.put('/api/v1/ad/hosts/status/change/:hostId/:status', function (req, res, next) {
    if (req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsService.updateADHostStatusChange(req.params.hostId, req.params.status, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsController.js at put API -' +
            '/api/v1/ad/hosts/status/change/:hostID/:status: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsController.js at put API -' +
            '/api/v1/ad/hosts/status/change/:hostID/:status: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsController.js at put API -' +
        '/api/v1/ad/hosts/status/change/:hostID/:status: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/ad/hosts/status/change/:hostID/:status:

  // --- Begin: '/api/v1/ad/host/profile/update/:recordID'
  app.put('/api/v1/ad/host/profile/update/:recordID', function (req, res, next) {
      var bodyValidation = spUpdateBodyValidation(req.body);
    if (bodyValidation && req.headers.token && req.params.recordID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            AD_HostsService.updateADHostProfileData(req.params.recordID, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/AD-HostsController.js at put API -' +
              '/api/v1/ad/host/profile/update/:recordID: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/AD-HostsController.js at put API -' +
              '/api/v1/ad/host/profile/update/:recordID: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsController.js at put API -' +
        '/api/v1/ad/host/profile/update/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
 // --- End: /api/v1/ad/host/profile/update/:recordID  
}
// --- END: AD-HostsController


/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function spUpdateBodyValidation(reqBodyObj) {
  if (reqBodyObj.contactPerson && reqBodyObj.contactNumber && reqBodyObj.contactEmail && reqBodyObj.contactAddress && reqBodyObj.city 
      && reqBodyObj.serviceProvider) {
      return true;
  } else
      return false;
}