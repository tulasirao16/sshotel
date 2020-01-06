/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var CommonService = require('../services/CommonService');
var EU_UserFavouriteService = require('../services/EU-UserFavouriteService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function(app, passport) {
   // --- Begin '/api/v1/eu/user/sps/favourites/:activePage/:searchString?'
  app.get('/api/v1/eu/user/sps/favourites/:activePage/:searchString?', function(req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if(!req.params.searchString || req.params.searchString == 'undefined') {
        searchString = '';
    }
    if(req.headers.token && pageNum) {
        CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserFavouriteService.getFavorites(pageNum, searchString, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU_UserFavouriteController.js at get API -' +
          ' /api/v1/eu/user/sps/favourites/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/EU_UserFavouriteController.js at get API -' +
          ' /api/v1/eu/user/sps/favourites/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU_UserFavouriteController.js at get API -' +
      '/api/v1/eu/user/sps/favourites/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/eu/user/sps/favourites/:activePage/:searchString?'

  // --- Begin '/api/v1/eu/user/home/sps/favourites/:activePage'
  app.post('/api/v1/eu/user/home/sps/favourites/:activePage', function(req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    if(req.headers.token && pageNum && req.body.state && req.body.city && req.body.area) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserFavouriteService.getFavoritesAndHomeScreenData(req.body, pageNum, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU_UserFavouriteController.js at get API -' +
          ' /api/v1/eu/user/home/sps/favourites/:activePage: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/EU_UserFavouriteController.js at get API -' +
          ' /api/v1/eu/user/home/sps/favourites/:activePage: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU_UserFavouriteController.js at get API -' +
      '/api/v1/eu/user/home/sps/favourites/:activePage: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/eu/user/home/sps/favourites/:activePage'

   // --- Begin '/api/v1/eu/user/sps/favourite/byrecordid/:id'
   app.get('/api/v1/eu/user/sps/favourite/byrecordid/:id', function(req, res, callback) {
    if(req.headers.token && req.params.id) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserFavouriteService.getFavoriteByRecordID(req.params.id, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU_UserFavouriteController.js at get API -' +
          ' /api/v1/eu/user/sps/favourite/byrecordid/:id: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/EU_UserFavouriteController.js at get API -' +
          ' /api/v1/eu/user/sps/favourite/byrecordid/:id: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU_UserFavouriteController.js at get API -' +
      '/api/v1/eu/user/sps/favourite/byrecordid/:id: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/eu/user/sps/favourite/byrecordid/:id'


  // --- Begin '/api/v1/eu/favorites'
  app.post('/api/v1/eu/favorites', function(req, res, next) {
    var postFavouriteBody = postFavouriteBodyValidation(req.body);
    if(req.headers.token && postFavouriteBody) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserFavouriteService.setServiceProviderAsFavorite(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU_UserFavouriteController.js at post API -' +
          ' /api/v1/eu/favorites: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/EU_UserFavouriteController.js at post API -' +
          ' /api/v1/eu/favorites: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/EU_UserFavouriteController.js at post API -' +
        '/api/v1/eu/favorites: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/eu/favorites/'

  // --- Begin '/api/v1/eu/favorites/delete'
  app.put('/api/v1/eu/favorites/delete', function(req, res, next) {
    if(req.body.spID && req.headers.token && req.body.spPropertyId) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserFavouriteService.deleteServiceProviderFromFavorite(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/EU_UserFavouriteController.js at delete API -' +
            ' /api/v1/eu/favorites/delete: Token expired');
            utils.sendResponse(res, 400, '9995', {});
        } else {
            logger.error('There was an Error in controllers/EU_UserFavouriteController.js at delete API -' +
            ' api/v1/eu/favorites/delete: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
        logger.error('There was an Error in controllers/EU_UserFavouriteController.js at delete API -' +
        '/api/v1/eu/favorites/delete: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/eu/favorites/delete'


   // --- Begin '/api/v1/eu/user/favourite/default/propertyinfo/:propertyid'
   app.get('/api/v1/eu/user/favourite/default/propertyinfo/:propertyid', function(req, res, callback) {
    if(req.headers.token && req.params.propertyid) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserFavouriteService.getFavoriteDefaultPropertyInfo(req.params.propertyid, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU_UserFavouriteController.js at get API -' +
          ' /api/v1/eu/user/favourite/default/propertyinfo/:propertyid: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/EU_UserFavouriteController.js at get API -' +
          ' /api/v1/eu/user/favourite/default/propertyinfo/:propertyid: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU_UserFavouriteController.js at get API -' +
      '/api/v1/eu/user/favourite/default/propertyinfo/:propertyid: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/eu/user/favourite/default/propertyinfo/:propertyid'

};

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function postFavouriteBodyValidation(reqBodyObj) {
  if (reqBodyObj.customer && reqBodyObj.serviceProviderID && reqBodyObj.serviceProvider && reqBodyObj.spPropertyTitle && reqBodyObj.spPropertyId &&
    reqBodyObj.spLocationId && reqBodyObj.contactPerson && reqBodyObj.mobileNumber &&
    reqBodyObj.email && reqBodyObj.address && reqBodyObj.area &&
    reqBodyObj.zip && reqBodyObj.city && reqBodyObj.state && reqBodyObj.latitude && reqBodyObj.longitude) {
    return true;
  } else {
    return false;
  }
}
