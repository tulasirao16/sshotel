/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
var CommonService = require('./CommonService');
var EU_UserFavouriteDAO = require('../daos/EU_UserFavouriteDAO');
var EU_Favourites = require('../models/EU-Favourites');


// --- Begin:  EndUsers Bookings  Service
module.exports = { 
  // --- Begin: getFavorites
  getFavorites: function(pageNum, searchString, decodedTokenData, callback) {
    EU_UserFavouriteDAO.getFavourites(pageNum, searchString, decodedTokenData, function(error, resObj) {
      if (error) {
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj.statusCode === '0000') {
          callback({httpCode: 200, statusCode: resObj.statusCode, result: resObj.result});
      } else {
          callback({httpCode: 400, statusCode: resObj.statusCode, result: resObj.result});
      }
    });
  },
  // --- End: getFavorites

  // --- Begin: getFavoritesAndHomeScreenData
  getFavoritesAndHomeScreenData: function(body, pageNum,  decodedTokenData, callback) {
    EU_UserFavouriteDAO.getFavoritesAndHomeScreenData(body, pageNum,  decodedTokenData, function(error, resObj) {
      if (error) {
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj.statusCode === '0000') {
          callback({httpCode: 200, statusCode: resObj.statusCode, result: resObj.result});
      } else {
          callback({httpCode: 400, statusCode: resObj.statusCode, result: resObj.result});
      }
    });
  },
  // --- End: getFavoritesAndHomeScreenData

  // --- Begin: getFavoriteByRecordID
  getFavoriteByRecordID: function(recordID, decodedTokenData, callback) {
    EU_UserFavouriteDAO.getFavoriteByRecordID(recordID, decodedTokenData, function(error, resObj) {
        if (error) {
        callback({httpCode: 500, statusCode: '9999', result: {}});
        } else if(resObj.statusCode === '0000') {
            callback({httpCode: 200, statusCode: resObj.statusCode, result: resObj.result});
        } else {
            callback({httpCode: 400, statusCode: resObj.statusCode, result: resObj.result});
        }
    });
  },
  // --- End: getFavoriteByRecordID 

  // --- Begin: setServiceProviderAsFavorite
  setServiceProviderAsFavorite: function(reqObj, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();

    var favObj = {
        euUserId: decodedTokenData.iss,
        euName: reqObj.customer,
        spServiceProviderId: reqObj.serviceProviderID,
        spServiceProvider: reqObj.serviceProvider,
        spPropertyTitle: reqObj.spPropertyTitle,
        spPropertyId: reqObj.spPropertyId,
        spLocationId:  reqObj.spLocationId,
        spLocationObj: {
          contactPerson: reqObj.contactPerson,
          mobileNumber: reqObj.mobileNumber,
          alternateMobileNumber: reqObj.alternateMobileNumber ? reqObj.alternateMobileNumber : '',
          email: reqObj.email,
          address: reqObj.address,
          landmark: reqObj.landmark ? reqObj.landmark: '',
          area: reqObj.area,
          areaLocality: reqObj.areaLocality ? reqObj.areaLocality: '',
          zip: reqObj.zip,
          city: reqObj.city,
          state: reqObj.state,
          country: reqObj.country,
          latitude: reqObj.latitude,
          longitude: reqObj.longitude
        },
        status: 'Favourite',
        notes: reqObj.notes ? reqObj.notes : '',
        createdBy: decodedTokenData.ua,
        createdAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedBy: decodedTokenData.ua,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
    };
    var favouritesObj = new EU_Favourites(favObj);
    EU_UserFavouriteDAO.setServiceProviderAsFavorite(favouritesObj, decodedTokenData, function(resObj) {
        callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: setServiceProviderAsFavorite

  // --- Begin: deleteServiceProviderFromFavorite
  deleteServiceProviderFromFavorite: function(body, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var deletefavObj = {
      status: 'Unfavourite',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    EU_UserFavouriteDAO.deleteServiceProviderFromFavorite(body, decodedTokenData, deletefavObj, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: deleteServiceProviderFromFavorite

  // --- Begin: getFavoriteDefaultPropertyInfo
  getFavoriteDefaultPropertyInfo: function(propertyID, decodedTokenData, callback) {
    EU_UserFavouriteDAO.getFavoriteDefaultPropertyInfo(propertyID, decodedTokenData, function(error, resObj) {
        if (error) {
        callback({httpCode: 500, statusCode: '9999', result: {}});
        } else if(resObj.statusCode === '0000') {
            callback({httpCode: 200, statusCode: resObj.statusCode, result: resObj.result});
        } else {
            callback({httpCode: 400, statusCode: resObj.statusCode, result: resObj.result});
        }
    });
  },
  // --- End: getFavoriteDefaultPropertyInfo 
}