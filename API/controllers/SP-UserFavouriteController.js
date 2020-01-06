/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var SP_UserFavouriteService = require('../services/SP-UserFavouriteService');

module.exports.controller = function (app, passport) {

  // --- Begin '/api/v1/sp/user/eu/favourites/:activePage/:searchString?'
  app.get('/api/v1/sp/user/eu/favourites/:activePage/:searchString?', function(req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if(!req.params.searchString || req.params.searchString == 'undefined') {
        searchString = '';
    }
    if(req.headers.token && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserFavouriteService.getSPFavouriteUsers(pageNum, searchString, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UserFavouriteController.js at get API -' +
          '/api/v1/sp/user/eu/favourites/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-UserFavouriteController.js at get API -' +
          '/api/v1/sp/user/eu/favourites/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserFavouriteController.js at get API -' +
      '/api/v1/sp/user/eu/favourites/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/user/eu/favourites/:activePage/:searchString?'

  // --- Begin '/api/v1/sp/users/unfavourite'
  app.put('/api/v1/sp/users/unfavourite', function(req, res, next) {
    if(req.headers.token && req.body.recordID && req.body.userID && req.body.spPropertyId) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserFavouriteService.unfavouriteUserFromFavourite(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP_UserFavouriteController.js at put API -' +
            ' /api/v1/sp/users/unfavourite: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/SP_UserFavouriteController.js at put API -' +
            '/api/v1/sp/users/unfavourite: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/SP_UserFavouriteController.js at put API -' +
        '/api/v1/sp/users/unfavourite: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/users/unfavourite'

  // --- Begin '/api/v1/sp/users/favourite'
  app.put('/api/v1/sp/users/favourite', function(req, res, next) {
    if(req.headers.token && req.body.recordID && req.body.userID && req.body.spPropertyId) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserFavouriteService.setUserAsFavourite(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP_UserFavouriteController.js at put API -' +
            '/api/v1/sp/users/favourite: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/SP_UserFavouriteController.js at put API -' +
            '/api/v1/sp/users/favourite: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/SP_UserFavouriteController.js at put API -' +
        '/api/v1/sp/users/favourite: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/users/favourite'

  // --- Begin '/api/v1/sp/favourite/users/delete'
  app.put('/api/v1/sp/favourite/users/delete', function(req, res, next) {
    if(req.headers.token && req.body.recordID && req.body.userID && req.body.spPropertyId) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserFavouriteService.deleteUserFromFavourite(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP_UserFavouriteController.js at put API -' +
            '/api/v1/sp/favourite/users/delete: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/SP_UserFavouriteController.js at put API -' +
            '/api/v1/sp/favourite/users/delete: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/SP_UserFavouriteController.js at put API -' +
        '/api/v1/sp/favourite/users/delete: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/favourite/users/delete'
};


