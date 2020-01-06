/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');

var CommonService = require('../services/CommonService');
var AD_UsersService = require('../services/AD-UsersService');

//.....Begin:AD-UsersController...
module.exports.controller = function (app, passport) {

  //Begin:AD-User Create '/api/v1/ad/user/create' API.........
  app.post('/api/v1/ad/user/create', function (req, res, next) {
    var bodyValidation = adUserBodyValidation(req.body);
    if (bodyValidation && req.headers.token && req.body.password) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_UsersService.postADUserData(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-UsersController.js at post API -' +
            ' /api/v1/ad/user/create: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-UsersController.js at post API -' +
            ' /api/v1/ad/user/create: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-UsersController.js at post API -' +
        ' /api/v1/ad/user/create: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  //......End:AD-User Create'/api/v1/ad/user/create' API...........

  // --- Begin: '/api/v1/ad/users/list/:activePage/:searchString?'
  app.get('/api/v1/ad/users/list/:activePage/:searchString?', function (req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    if (req.headers.token && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_UsersService.getADUsersListingData(pageNum, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-UsersController.js at get API -' +
            '/api/v1/ad/users/list/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-UsersController.js at get API -' +
            '/api/v1/ad/users/list/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-UsersController.js at get API -' +
        '/api/v1/ad/users/list/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: '/api/v1/ad/users/list/:activePage/:searchString?'


  // --- Begin: 'api/v1/ad/fortickets/users/list'
  app.get('/api/v1/ad/fortickets/users/list', function (req, res, callback) {
    if (req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_UsersService.getADUsersListDataForTickets(tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-UsersController.js at get API -' +
            '/api/v1/ad/fortickets/users/list: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-UsersController.js at get API -' +
            '/api/v1/ad/fortickets/users/list: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-UsersController.js at get API -' +
        '/api/v1/ad/fortickets/users/list: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: 'api/v1/ad/fortickets/users/list'

  //.......Begin: '/api/v1/ad/user/view/:recordID'....
  app.get('/api/v1/ad/user/view/:recordID', function (req, res, callback) {
    if (req.headers.token && req.params.recordID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_UsersService.getADUserDataByRecordId(req.params.recordID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-UsersController.js at get API -' +
            '/api/v1/ad/user/view/:recordID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-UsersController.js at get API -' +
            '/api/v1/ad/user/view/:recordID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-UsersController.js at get API -' +
        '/api/v1/ad/user/view/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  //............End:'/api/v1/ad/user/view/:recordID'..........

  // --- Begin '/api/v1/ad/user/changepassword/:userID' API
  app.put('/api/v1/ad/user/changepassword/:userID', function (req, res, callback) {
    var newPassword = req.body.newPassword;
    var userID = req.params.userID
    if (req.headers.token && userID && newPassword) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_UsersService.updateADUsersPassword(userID, newPassword, tokenDecodedData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-UsersController.js at put API -' +
            '/api/v1/ad/user/changepassword/:userID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-UsersController.js at put API -' +
            '/api/v1/ad/user/changepassword/:userID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-UsersController.js at put API -',
        '/api/v1/ad/user/changepassword/:userID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: '/api/v1/ad/user/changepassword/:userID' API

  // --- Begin '/api/v1/ad/user/edit'
  app.put('/api/v1/ad/user/edit', function (req, res, next) {
    var bodyValidation = adUserBodyValidation(req.body);
    if (req.body._id && bodyValidation && req.body.displayName && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_UsersService.updateADUserData(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-UsersController.js at put API -' +
            ' /api/v1/ad/user/edit: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-UsersController.js at put API -' +
            ' api/v1/ad/favorites/delete: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-UsersController.js at put API -' +
        '/api/v1/ad/user/edit: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/user/edit


  // --- Begin '/api/v1/ad/user/activate/:recordID'
  app.put('/api/v1/ad/user/activate/:recordID', function (req, res, next) {
    if (req.params.recordID && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_UsersService.activateADUserData(req.params.recordID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-UsersController.js at put API -' +
            ' /api/v1/ad/user/activate/:recordID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-UsersController.js at put API -' +
            ' /api/v1/ad/user/activate/:recordID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-UsersController.js at put API -' +
        '/api/v1/ad/user/activate/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/user/activate/:recordID'

  // --- Begin '/api/v1/ad/user/inactivate/:recordID'
  app.put('/api/v1/ad/user/inactivate/:recordID', function (req, res, next) {
    if (req.params.recordID && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_UsersService.inActivateADUserData(req.params.recordID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-UsersController.js at put API -' +
            ' /api/v1/ad/user/inactivate/:recordID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-UsersController.js at put API -' +
            ' /api/v1/ad/user/inactivate/:recordID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-UsersController.js at put API -' +
        '/api/v1/ad/user/inactivate/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/user/inactivate/:recordID'

}
//...........End: AD-UsersController.....

function adUserBodyValidation(reqBodyObj) {
  if (reqBodyObj.firstName && reqBodyObj.address && reqBodyObj.mobileNumber && reqBodyObj.email
    && reqBodyObj.userRole && reqBodyObj.userStatus) {
    return true;
  } else
    return false;
}