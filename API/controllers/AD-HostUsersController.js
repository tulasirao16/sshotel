/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var AD_HostUsersService = require('../services/AD-HostUsersService');

module.exports.controller = function (app, passport) {
  // --- Begin '/api/v1/ad/hosts/users/list/:hostId/:activePage/:searchString?'
  app.get('/api/v1/ad/host/users/list/:hostId/:activePage/:searchString?', function (req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    if (req.headers.token && pageNum && req.params.hostId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostUsersService.getADHostUsersListingData(req.params.hostId, pageNum, searchString, tokenDecodedData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostUsersController.js at get API -' +
            '/api/v1/ad/host/users/list/:hostId/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostUsersController.js at get API -' +
            '/api/v1/ad/host/users/list/:hostId/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostUsersController.js at get API -' +
        '/api/v1/ad/host/users/list/:hostId/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/hosts/users/list/:hostId/:activePage/:searchString?'

  // --- Begin '/api/v1/ad/hosts/user/changepassword/:userID'
  app.put('/api/v1/ad/hosts/user/changepassword/:userID', function (req, res, callback) {
    var newPassword = req.body.newPassword;
    var userID = req.params.userID
    if (req.headers.token && userID && newPassword) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostUsersService.updateADHostUsersChangePassword(userID, newPassword, tokenDecodedData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostUsersController.js at put API -' +
            '/api/v1/ad/hosts/user/changepassword/:userID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostUsersController.js at put API -' +
            '/api/v1/ad/hosts/user/changepassword/:userID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostUsersController.js at put API -' +
        '/api/v1/ad/hosts/user/changepassword/:userID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- Begin '/api/v1/ad/hosts/user/changepassword/:userID'

  // --- Begin '/api/v1/ad/hosts/user/edit'
  app.put('/api/v1/ad/hosts/user/edit', function (req, res, next) {
    var bodyValidation = ADHostUserBodyValidation(req.body);
    if (req.body._id && bodyValidation && req.body.displayName && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostUsersService.updateADHostUserData(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostUsersController.js at put API -' +
            ' /api/v1/ad/hosts/user/edit: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostUsersController.js at put API -' +
            ' /api/v1/ad/hosts/user/edit: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostUsersController.js at put API -' +
        '/api/v1/ad/hosts/user/edit: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/hosts/user/edit'

  // --- Begin '/api/v1/ad/hosts/user/create'
  app.post('/api/v1/ad/hosts/user/create', function (req, res, next) {
    var bodyValidation = ADHostUserBodyValidation(req.body);
    if (bodyValidation && req.headers.token && req.body.password) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostUsersService.postADHostUserData(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostUsersController.js at post API -' +
            ' /api/v1/ad/hosts/user/create: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-HostUsersController.js at post API -' +
            ' /api/v1/ad/hosts/user/create: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostUsersController.js at post API -' +
        '/api/v1/ad/hosts/user/create: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/hosts/user/create'

  // --- Begin /api/v1/ad/hosts/user/status/update/:recordId'
  app.put('/api/v1/ad/hosts/user/status/update/:recordId', function (req, res, callback) {
    if (req.headers.token && req.params.recordId && req.body.status) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostUsersService.updateADHostUserStatus(req.params.recordId, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostUsersController.js at put API -' +
            '/api/v1/ad/hosts/user/status/update/:recordId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostUsersController.js at put API -' +
            '/api/v1/ad/hosts/user/status/update/:recordId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostUsersController.js at put API -' +
        '/api/v1/ad/hosts/user/status/update/:recordId: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End /api/v1/ad/hosts/user/status/update/:recordId:

  // --- Begin '/api/v1/ad/hosts/user/delete'
  app.post('/api/v1/ad/hosts/user/delete', function (req, res, next) {
    if (req.body._id && req.body.mobileNumber && req.body.email && req.body.userAccount && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostUsersService.deleteADHostUserData(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostUsersController.js at post API -' +
            '/api/v1/ad/hosts/user/delete: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostUsersController.js at post API -' +
            '/api/v1/ad/hosts/user/delete: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostUsersController.js at post API -' +
        '/api/v1/ad/hosts/user/delete: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/hosts/user/delete'

  // BEGIN GET API : '/api/v1/ad/host/users/notifications/:hostId/:activePage/:userId?/:searchString?'
  app.get('/api/v1/ad/host/users/notifications/:hostId/:activePage/:userId?/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    var userId = !req.params.userId || req.params.userId == 'undefined' ? '' : req.params.userId
    if (req.headers.token && pageNumber && req.params.hostId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostUsersService.getHostUserNotifications(req.params.hostId, pageNumber, userId, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostUsersController.js at get API -'+
            '/api/v1/ad/host/users/notifications/:hostId/:activePage/:userId?/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        }
        else {
          logger.error('There was an Un-known Error in controllers/AD-HostUsersController.js at get API -'+
            '/api/v1/ad/host/users/notifications/:hostId/:activePage/:userId?/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostUsersController.js at get API -'+
        '/api/v1/ad/host/users/notifications/:hostId/:activePage/:userId?/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // END GET API : '/api/v1/ad/host/users/notifications/:hostId/:activePage/:userId?/:searchString?'

  app.post('/api/v1/ad/sp/user/create', function(req, res, next) {
    var bodyValidation = adSPUserBodyValidation(req.body);
    if(bodyValidation && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostUsersService.postADSPUserData(req.body, tokenDecodedData.decodedTokenData, res, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostUsersController.js at post API -'+
            ' /api/v1/ad/sp/user/create: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-HostUsersController.js at post API -'+
            ' /api/v1/ad/sp/user/create: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostUsersController.js at post API -'+
        ' /api/v1/ad/sp/user/create: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

}
/**
* @param {object} reqBodyObj object
* @return {boolean} boolean
*/
function ADHostUserBodyValidation(reqBodyObj) {
  if (reqBodyObj.firstName && reqBodyObj.address && reqBodyObj.mobileNumber && reqBodyObj.email
    && reqBodyObj.userRole && reqBodyObj.userStatus) {
    return true;
  } else
    return false;
}

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function adSPUserBodyValidation(reqBodyObj) {
  if(reqBodyObj.spServiceProviderId && reqBodyObj.spServiceProvider && reqBodyObj.firstName && reqBodyObj.name
    && reqBodyObj.city && reqBodyObj.address && reqBodyObj.mobileNumber && reqBodyObj.email && reqBodyObj.spPercentage) {
    return true;
  } else
    return false;
}
