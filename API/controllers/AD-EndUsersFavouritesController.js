/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var AD_EndUsersFavouritesService = require('../services/AD-EndUsersFavouritesService');

// --- Begin AD-EndUserFavouritesController
module.exports.controller = function (app, passport) {
  // --- Begin '/api/v1/ad/eu/user/favourites/hosts/:activePage/:searchString?'
  app.get('/api/v1/ad/eu/user/favourites/hosts/:activePage/:searchString?', function (req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = req.params.searchString == 'undefined' || !req.params.searchString ? '' : req.params.searchString;
    if (req.headers.token && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUsersFavouritesService.getADEndUserFavorites(pageNum, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUsersFavouritesController.js at get API -' +
            '/api/v1/ad/eu/user/favourites/hosts/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUsersFavouritesController.js at get API -' +
            '/api/v1/ad/eu/user/favourites/hosts/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUsersFavouritesController.js at get API -' +
        '/api/v1/ad/eu/user/favourites/hosts/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/eu/user/favourites/hosts/:activePage/:searchString?'

  // --- Begin '/api/v1/ad/eu/user/favourites/hosts/byuserid/:euUserId/:activePage/:searchString?'
  app.get('/api/v1/ad/eu/user/favourites/hosts/byuserid/:euUserId/:activePage/:searchString?', function (req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = req.params.searchString == 'undefined' || !req.params.searchString ? '' : req.params.searchString;
    if (req.headers.token && pageNum && req.params.euUserId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUsersFavouritesService.getADEndUserIdFavorites(pageNum, req.params.euUserId, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUsersFavouritesController.js at get API -' +
            '/api/v1/ad/eu/user/favourites/hosts/byuserid/:euUserId/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUsersFavouritesController.js at get API -' +
            '/api/v1/ad/eu/user/favourites/hosts/byuserid/:euUserId/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUsersFavouritesController.js at get API -' +
        '/api/v1/ad/eu/user/favourites/hosts/byuserid/:euUserId/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/eu/user/favourites/hosts/byuserid/:euUserId/:activePage/:searchString?'

  // --- Begin '/api/v1/ad/eu/user/favourites/status/update/:recordID'
  app.put('/api/v1/ad/eu/user/favourites/status/update/:recordID', function (req, res, callback) {
    if (req.headers.token && req.params.recordID && req.body.status) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUsersFavouritesService.updateADEndUserfavouritesStatus(req.params.recordID, req.body, tokenDecodedData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUsersFavouritesController.js at put API -' +
            '/api/v1/ad/eu/user/favourites/status/update/:recordID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUsersFavouritesController.js at put API -' +
            '/api/v1/ad/eu/user/favourites/status/update/:recordID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUsersFavouritesController.js at put API -' +
        '/api/v1/ad/eu/user/favourites/status/update/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/eu/user/favourites/status/update/:recordID'
  // --- Begin '/api/v1/ad/eu/favorites/:euUserId/'
  app.post('/api/v1/ad/eu/favorites/:euUserId', function (req, res, next) {
    var postFavouriteBody = postFavouriteBodyValidation(req.body);
    if (req.headers.token && postFavouriteBody && req.params.euUserId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUsersFavouritesService.setFavorite(req.body, tokenDecodedData.decodedTokenData, req.params.euUserId, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUsersFavouritesController.js at post API -' +
            ' /api/v1/ad/eu/favorites: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUsersFavouritesController.js at post API -' +
            ' /api/v1/ad/eu/favorites: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUsersFavouritesController.js at post API -' +
        '/api/v1/ad/eu/favorites: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/eu/favorites'
  // --- Begin '/api/v1/ad/eu/unfavorite/:id'
  app.put('/api/v1/ad/eu/unfavorite/:id', function (req, res, next) {
    if (req.body.spID && req.body.spPropertyId && req.params.id) {
      AD_EndUsersFavouritesService.ServiceProviderUnfavorite(req.params.id, req.body, function (resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });      
    } else {
      logger.error('There was an Error in controllers/AD-EndUsersFavouritesController.js at delete API -' +
        '/api/v1/ad/eu/favorites/delete: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/eu/unfavorite/:id'
}
// --- End AD-EndUserFavouritesController

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
