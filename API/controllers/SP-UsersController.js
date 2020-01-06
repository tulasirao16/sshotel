/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var SP_UsersService = require('../services/SP-UsersService');

module.exports.controller = function(app, passport) {

  // --- Begin '/api/v1/sp/users/list/:activePage/:searchString?'
  app.get('/api/v1/sp/users/list/:activePage/:searchString?', function(req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if(!req.params.searchString || req.params.searchString == 'undefined') {
        searchString = '';
    }
    if(req.headers.token && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UsersService.getSPUsersListingData(pageNum, searchString, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UsersController.js at get API -' +
          '/api/v1/sp/users/list/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-UsersController.js at get API -' +
          '/api/v1/sp/users/list/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UsersController.js at get API -' +
      '/api/v1/sp/users/list/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/users/list/:activePage/:searchString?'

  app.post('/api/v1/sp/user/create', function(req, res, next) {
    var bodyValidation = spUserBodyValidation(req.body);
    if(bodyValidation && req.headers.token && req.body.password) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UsersService.postSPUserData(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UsersController.js at post API -'+
            ' /api/v1/sp/user/create: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/SP-UsersController.js at post API -'+
            ' /api/v1/sp/user/create: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UsersController.js at post API -'+
        ' /api/v1/sp/user/create: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.post('/api/v1/sp/user/create/uniqueness/verification', function(req, res, next) {
    if(req.headers.token && req.body.mobileNumber && req.body.email) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UsersService.verifyUniqueness(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UsersController.js at post API -'+
            ' /api/v1/sp/user/create/uniqueness/verification: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/SP-UsersController.js at post API -'+
            ' /api/v1/sp/user/create/uniqueness/verification: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UsersController.js at post API -'+
        ' /api/v1/sp/user/create/uniqueness/verification: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // --- Begin '/api/v1/sp/user/edit'
  app.put('/api/v1/sp/user/edit', function(req, res, next) {
    var bodyValidation = spUserBodyValidation(req.body);
    if(req.body._id && bodyValidation && req.body.displayName && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UsersService.updateSPUserData(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-UsersController.js at put API -' +
            ' /api/v1/sp/user/edit: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/SP-UsersController.js at put API -' +
            ' api/v1/sp/favorites/delete: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/SP-UsersController.js at put API -' +
        '/api/v1/sp/user/edit: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/user/edit'

  // --- Begin '/api/v1/sp/user/activate/:recordID'
  app.put('/api/v1/sp/user/activate/:recordID', function(req, res, next) {
    if(req.params.recordID && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UsersService.activateSPUserData(req.params.recordID, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-UsersController.js at put API -' +
            ' /api/v1/sp/user/activate/:recordID: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/SP-UsersController.js at put API -' +
            ' /api/v1/sp/user/activate/:recordID: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/SP-UsersController.js at put API -' +
        '/api/v1/sp/user/activate/:recordID: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/user/activate/:recordID'

  // --- Begin '/api/v1/sp/user/inactivate/:recordID'
  app.put('/api/v1/sp/user/inactivate/:recordID', function(req, res, next) {
    if(req.params.recordID && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UsersService.inActivateSPUserData(req.params.recordID, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-UsersController.js at delete API -' +
            ' /api/v1/sp/user/inactivate/:recordID: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/SP-UsersController.js at delete API -' +
            ' /api/v1/sp/user/inactivate/:recordID: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/SP-UsersController.js at delete API -' +
        '/api/v1/sp/user/inactivate/:recordID: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/user/inactivate/:recordID'

  // --- Begin '/api/v1/sp/user/delete'
  app.post('/api/v1/sp/user/delete', function(req, res, next) {
    if(req.body._id && req.body.mobileNumber &&  req.body.email &&  req.body.userAccount && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UsersService.deleteSPUserData(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-UsersController.js at post API -' +
            '/api/v1/sp/user/delete: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/SP-UsersController.js at post API -' +
            '/api/v1/sp/user/delete: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UsersController.js at post API -' +
      '/api/v1/sp/user/delete: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/user/delete'

  app.get('/api/v1/sp/user/:recordId', function(req, res, callback) {
    if(req.headers.token && req.params.recordId) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UsersService.getSPUserData(req.params.recordId, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UsersController.js at get API -' +
          '/api/v1/sp/user/:recordId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-UsersController.js at get API -' +
          '/api/v1/sp/user/:recordId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UsersController.js at get API -' +
      '/api/v1/sp/user/:recordId: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // -- Begin: api/v1/sp/new/user/set/password
  app.put('/api/v1/sp/new/user/set/password', function (req, res, next) {
    var tokendecryptGeneration = CommonService.decrypt(req.body.token);
    if (req.body.password && tokendecryptGeneration) {
      CommonService.tokenExpireValidation(tokendecryptGeneration, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UsersService.updateSpPassword(req.body.password, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UsersController.js at put API -' +
            '/api/v1/sp/new/user/set/password: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/SP-UsersController.js at put API -' +
            '/api/v1/sp/new/user/set/password: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UsersController.js, at put API -'+
        '/api/v1/sp/new/user/set/password: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End: api/v1/sp/new/user/set/password

};


/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function spUserBodyValidation(reqBodyObj) {
  if(reqBodyObj.firstName && reqBodyObj.address && reqBodyObj.mobileNumber && reqBodyObj.email
    && reqBodyObj.userRole && reqBodyObj.userStatus) {
    return true;
  } else
    return false;
}

