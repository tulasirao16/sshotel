/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var EU_Bookings = require('../models/EU-Bookings');
var EU_Favourites = require('../models/EU-Favourites');
var EU_Users = require('../models/EU-Users');
var SP_Properties_Info = require('../models/SP-PropertyInfo');
var CommonService = require('../services/CommonService');

     // --- Begin AD-EndUsersFavouritesDAO:
module.exports = {
  // --- Begin getADEndUserFavorites:
  getADEndUserFavorites: function (pageNum, searchString, decodedTokenData, callback) {
    var query = {
      'isDeleted': false,
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
        { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
        { 'spLocationObj.city': { $regex: searchString, $options: 'i' } },
      ]
    };
    EU_Favourites.find(query)
      .populate('spPropertyId')
      .skip((pageNum - 1) * 10)
      .limit(10)
      .exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-EndUsersFavouritesDAO.js, at getADEndUserFavorites:'+ error);
          callback(error, { statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
          EU_Favourites.countDocuments(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD-EndUsersFavouritesDAO.js, at getADEndUserFavorites:'+ errorCount);
              callback(errorCount, { statusCode: '9999', result: {} });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount, eufavs: resultArray };
              callback(errorCount, { statusCode: '0000', result: resultObj });
            } else {
              callback(errorCount, { statusCode: '9997', result: {} });
            }
          });
        } else {
          callback(error, { statusCode: '9997', result: {} });
        }
      });
  },
  // --- End getADEndUserFavorites:

  // --- Begin getADEndUserIdFavorites:
  getADEndUserIdFavorites: function (pageNum, euUserId, searchString, decodedTokenData, callback) {
    var query = {
      'euUserId': euUserId,
      'isDeleted': false,
      '$or': [
        { spPropertyTitle: { $regex: searchString, $options: 'i' } },
        { spServiceProvider: { $regex: searchString, $options: 'i' } },
        { status: { $regex: searchString, $options: 'i' } }
      ]
    };
    EU_Favourites.find(query)
      .populate('spPropertyId')
      .populate('spPropertyInfoId')
      .populate('euUserId')
      .skip((pageNum - 1) * 10)
      .limit(10)
      .exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-EndUsersFavouritesDAO.js, at getADEndUserIdFavorites:'+ error);
          callback(error, { statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
          EU_Favourites.countDocuments(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD-EndUsersFavouritesDAO.js, at getADEndUserIdFavorites:'+ errorCount);
              callback(errorCount, { statusCode: '9999', result: {} });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount, eufavs: resultArray };
              callback(errorCount, { statusCode: '0000', result: resultObj });
            } else {
              callback(errorCount, { statusCode: '9997', result: {} });
            }
          });
        } else {
          callback(error, { statusCode: '9997', result: {} });
        }
      });
  },
  // --- End getADEndUserIdFavorites:

   // --- Begin updateADEndUserfavouritesStatus:
   updateADEndUserfavouritesStatus: function (upObj, recordID, tokenDecodedData, callback) {
    var query = { _id: recordID, isDeleted: false };
    EU_Favourites.findOneAndUpdate(query, { $set: upObj }, { new: true }, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-konwn Error occured in daos/AD-EndUsersFavouritesDAO.js, at updateADEndUserfavouritesStatus:'+ error);
        callback({ httpCode: 400, statusCode: '9900', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserFavourites, id: resObj._id, value: resObj.userAccount }, upObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
   // --- End updateADEndUserfavouritesStatus:

   // --- Begin: setFavorite
   setFavorite: function(favouritesObj, decodedTokenData, euUserId, callback) {
  var currentUTC = CommonService.currentUTCObj();
    var query = {
      'euUserId': euUserId,
      'spServiceProviderId': favouritesObj.spServiceProviderId,
      'spPropertyId': favouritesObj.spPropertyId
    };
    EU_Favourites.find(query).exec(function(error, resultArray) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/AD-EndUsersFavouritesDAO.js, at getFavoriteByRecordID:', error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if(resultArray && resultArray.length > 0) {
        var updateObj = {
          status: 'Favourite',
          isDeleted: false,
          updatedBy: decodedTokenData.ua,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedOn: currentUTC.currentUTCDateTimeString
        }
        EU_Favourites.findOneAndUpdate(query, {$set: updateObj}, {new: true}).exec(function(err, resultObj) {
          if(err) {
            logger.error('There was an Un-known Error occured in daos/AD-EndUsersFavouritesDAO.js, at setServiceProviderAsFavorite:', err);
            callback({httpCode: 500, statusCode: '9999', result: {}});
          } else if(resultObj && resultObj._id) {
            AuditingInfoDAO.euAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserFavourites, id: resultObj._id, value: resultObj.spPropertyTitle }, updateObj);
            EU_Users.findOneAndUpdate({'_id' : decodedTokenData.iss}, { $push: { 'preferences.favouriteProperties': favouritesObj.spPropertyId}}, {new: true}).exec(function(error, userData) {
              AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserUsers, id: decodedTokenData.iss, value: decodedTokenData.un }, { 'preferences.favouriteProperties': favouritesObj.spPropertyId });
            });
            callback({httpCode: 200, statusCode: '0000', result: resultObj});
          } else {
            callback({httpCode: 400, statusCode: '9993', result: {}});
          }
        });
      } else {
        favouritesObj.save( function(err, data) {
          if(err) {
            if(err.name === 'MongoError' && err.code === 11000) {
              logger.error('There was an Uniqueness Error occured in daos/AD-EndUserFavouriteDAO.js,',
              ' at setServiceProviderAsFavorite:', err);
              callback({httpCode: 400, statusCode: '9850', result: {}});
            } else {
              logger.error('There was an Un-Known Error occured in daos/AD-EndUserFavouriteDAO.js,',
              ' at setServiceProviderAsFavorite:', err);
              callback({httpCode: 500, statusCode: '9999', result: {}});
            }
          } else if(data && data._id) {
            AuditingInfoDAO.euAuditing(decodedTokenData, 'Create', { name: config.collectionEndUserFavourites, id: data._id, value: data.spPropertyTitle }, data);
            EU_Users.findOneAndUpdate({'_id' : decodedTokenData.iss}, { $push: { 'preferences.favouriteProperties': data.spPropertyId}}, {new: true}).exec(function(error, userData) {
              AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserUsers, id: decodedTokenData.iss, value: decodedTokenData.un }, {'preferences.favouriteProperties': data.spPropertyId});
              callback({httpCode: 200, statusCode: '0000', result: data});
            });
          } else {
            callback({httpCode: 400, statusCode: '9993', result: {}});
          }
        });
      }
    });   
  },
  // --- End: setFavorite
  // --- Begin ServiceProviderUnfavorite:
  ServiceProviderUnfavorite: function(id, body, deletefavObj, callback) {
    var query = {
      spServiceProviderId: id,
      // euUserId: body.euUserId,
      status: 'Favourite',
      spPropertyId: body.spPropertyId,
      spServiceProviderId: body.spID,
      isDeleted: false
    }
    EU_Favourites.findOneAndUpdate(query, {$set: deletefavObj}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/AD-EndUsersFavouritesDAO.js,',
        ' at ServiceProviderUnfavorite:', error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj.spPropertyId) {
        AuditingInfoDAO.adAuditing('Update', { name: config.collectionEndUserFavourites, id: resObj._id, value: resObj.spPropertyTitle }, deletefavObj);
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({httpCode: 400, statusCode: '9992', result: {}});
      }
    });
  },
  // --- End ServiceProviderUnfavorite:
}
     // --- End AD-EndUsersFavouritesDAO: