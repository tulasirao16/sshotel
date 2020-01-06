/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
var CommonService = require('./CommonService');
// var EU_UserFavouriteDAO = require('../daos/EU_UserFavouriteDAO');
var EU_Favourites = require('../models/EU-Favourites');
var AD_EndUsersFavouritesDAO = require('../daos/AD-EndUsersFavouritesDAO');

   // --- Begin:AD-EndUsersFavouritesService
module.exports = {
  // --- Begin: getADEndUserFavorites
  getADEndUserFavorites: function (pageNum, searchString, decodedTokenData, callback) {
    AD_EndUsersFavouritesDAO.getADEndUserFavorites(pageNum, searchString, decodedTokenData, function (error, resObj) {
      if (error) {
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
        callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
        callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
    });
  },
  // --- End: getADEndUserFavorites

  // --- Begin: getADEndUserIdFavorites
  getADEndUserIdFavorites: function (pageNum, euUserId, searchString, decodedTokenData, callback) {
    AD_EndUsersFavouritesDAO.getADEndUserIdFavorites(pageNum, euUserId, searchString, decodedTokenData, function (error, resObj) {
      if (error) {
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
        callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
        callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
    });
  },
  // --- End: getADEndUserIdFavorites

  // --- Begin: updateADEndUserfavouritesStatus
  updateADEndUserfavouritesStatus: function (recordID, reqBody, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var upObj = {
      status: reqBody.status,
      updatedBy: tokenDecodedData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_EndUsersFavouritesDAO.updateADEndUserfavouritesStatus(upObj, recordID, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // --- End: updateADEndUserfavouritesStatus

  // --- Begin: setFavorite
setFavorite: function(reqObj,decodedTokenData, euUserId, callback) {
  var currentUTC = CommonService.currentUTCObj();
  var favObj = {
      euUserId: euUserId,
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
  AD_EndUsersFavouritesDAO.setFavorite(favouritesObj, decodedTokenData, euUserId,function(resObj) {
    callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
  });
},
// --- End: setFavorite
  
  // --- Begin: ServiceProviderUnfavorite
  ServiceProviderUnfavorite: function(id, body, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var deletefavObj = {
      status: 'Unfavourite',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_EndUsersFavouritesDAO.ServiceProviderUnfavorite(id, body, deletefavObj, function(resObj) {
    callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: ServiceProviderUnfavorite

}

   // --- End:AD-EndUsersFavouritesService