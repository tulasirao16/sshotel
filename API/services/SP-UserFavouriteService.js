/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
var CommonService = require('./CommonService');
var SP_UserFavouriteDAO = require('../daos/SP_UserFavouriteDAO');
var EU_Favourites = require('../models/EU-Favourites');


// --- Begin:  ServiceProvider Favourite  Users
module.exports = { 
  // --- Begin: getSPFavouriteUsers
  getSPFavouriteUsers: function(pageNum, searchString, decodedTokenData, callback) {
    SP_UserFavouriteDAO.getSPFavouriteUsers(pageNum, searchString, decodedTokenData, function(error, resObj) {
      if (error) {
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj.statusCode === '0000') {
          callback({httpCode: 200, statusCode: resObj.statusCode, result: resObj.result});
      } else {
          callback({httpCode: 400, statusCode: resObj.statusCode, result: resObj.result});
      }
    });
  },
  // --- End: getSPFavouriteUsers

  // --- Begin: unfavouriteUserFromFavourite
  unfavouriteUserFromFavourite: function(body, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var deletefavObj = {
      status: 'Unfavourite',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    SP_UserFavouriteDAO.unfavouriteUserFromFavourite(body, decodedTokenData, deletefavObj, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: unfavouriteUserFromFavourite

  // --- Begin: setUserAsFavourite
  setUserAsFavourite: function(body, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var setfavObj = {
      status: 'Favourite',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    SP_UserFavouriteDAO.setUserAsFavourite(body, decodedTokenData, setfavObj, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: setUserAsFavourite

  // --- Begin: deleteUserFromFavourite
  deleteUserFromFavourite: function(body, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var deletefavObj = {
      isDeleted: true,
      euUserId: body.userID + '-' + currentUTC.currentUTCDateTimeNumber,
      spServiceProviderId: decodedTokenData.uspid._id + '-' + currentUTC.currentUTCDateTimeNumber,
      spPropertyId: body.spPropertyId + '-' + currentUTC.currentUTCDateTimeNumber,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    SP_UserFavouriteDAO.deleteUserFromFavourite(body, decodedTokenData, deletefavObj, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: deleteUserFromFavourite
}
// --- End: ServiceProvider Favourite  Users