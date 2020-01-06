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

module.exports = {
  // --- Begin getFavourites:
  getFavourites: function(pageNum, searchString, decodedTokenData, callback) {
    var query = {
      'euUserId': decodedTokenData.iss,
      'isDeleted': false,
      'status': 'Favourite',
      '$or': [
        {spPropertyTitle: {$regex: searchString, $options: 'i'}}
      ]
    };
    EU_Favourites.find(query)
    .populate('spPropertyId')
    .skip((pageNum - 1) * 10)
    .limit(10)
    .exec(function(error, resultArray) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU_UserFavouriteDAO.js, at getFavourites:', error);
        callback(error, {statusCode: '9999', result: {}});
      } else if(resultArray && resultArray.length > 0) {
        EU_Favourites.countDocuments(query).exec(function(errorCount, resultCount) {
          if(errorCount) {
              logger.error('There was an Un-known Error occured in daos/EU_UserFavouriteDAO.js, at getFavourites:', errorCount);
              callback(errorCount, {statusCode: '9999', result: {}});
          } else if(resultCount) {
              var resultObj = {totalDocs: resultCount, myfavs: resultArray};
              callback(errorCount, {statusCode: '0000', result: resultObj});
          }else {
              callback(errorCount, {statusCode: '9997', result: {}});
          }
        });
      } else {
          callback(error, {statusCode: '9997', result: {}});
      }
    });
  },
  // --- End getFavourites:


  // --- Begin getFavoritesAndHomeScreenData:
  getFavoritesAndHomeScreenData: function(body, pageNum, decodedTokenData, callback) {
    var query = {
      'euUserId': decodedTokenData.iss,
      'isDeleted': false,
      'status': 'Favourite',
      'spLocationObj.area': body.area,
      'spLocationObj.city': body.city,
      'spLocationObj.state': body.state
    };
    EU_Favourites.find(query)
    .populate('spPropertyInfoId')
    .exec(function(error, resultArray) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU_UserFavouriteDAO.js, at getFavoritesAndHomeScreenData:', error);
        callback(error, {statusCode: '9999', result: {}});
      } else if(resultArray && resultArray.length > 0) {
        var favArray = [];
        if (pageNum <= 1) {
          for (var i = 0; i < resultArray.length; i++) {
             favArray.push(resultArray[i].spPropertyInfoId._id);
           }
        }
        var queryObj = {
          'spLocationObj.area': body.area,
          'spLocationObj.city': body.city,
          'spLocationObj.state': body.state,
          '_id':  {$nin: favArray}
        };
         SP_Properties_Info.find(queryObj)
         .skip((pageNum - 1) * 10)
         .limit(10)
         .exec(function(error, data) {
             if(error) {
                 logger.error('There was an Error occured in daos/EU-EU_UserFavouriteDAO.js,',
                     ' at getUserHomeDataBydataType:', error);
                 callback(error, {statusCode: '9999', result: {}});
             } else if(data && data.length > 0) {
                 SP_Properties_Info.countDocuments(queryObj).exec(function(errorCount, resultCount) {
                     if(errorCount) {
                         logger.error('There was an Un-known Error occured in daos/EU-EU_UserFavouriteDAO.js, at getFavoritesAndHomeScreenData:', errorCount);
                         callback(errorCount, {statusCode: '9999', result: {}});
                     } else if(resultCount) {
                         var resultObj = {totalDocs: resultCount, homedata: data, favData: resultArray};
                         callback(errorCount, {statusCode: '0000', result: resultObj});
                     }else {
                         callback(errorCount, {statusCode: '9997', result: {}});
                     }
                 });
             } else {
                 callback(error, {statusCode: '9997', result: {}});
             }
         });
      } else {
        var spPropertyInfoqueryObj = {
          'spLocationObj.area': body.area,
          'spLocationObj.city': body.city,
          'spLocationObj.state': body.state,
          'isDeleted': false
        }
        SP_Properties_Info.find(spPropertyInfoqueryObj)
        .skip((pageNum - 1) * 10)
        .limit(10)
        .exec(function(error, data) {
            if(error) {
              logger.error('There was an Error occured in daos/EU-EU_UserFavouriteDAO.js,',
                  ' at getUserHomeDataBydataType:', error);
              callback(error, {statusCode: '9999', result: {}});
            } else if(data && data.length > 0) {
                SP_Properties_Info.countDocuments(spPropertyInfoqueryObj).exec(function(errorCount, resultCount) {
                    if(errorCount) {
                        logger.error('There was an Un-known Error occured in daos/EU-EU_UserFavouriteDAO.js, at getFavoritesAndHomeScreenData:', errorCount);
                        callback(errorCount, {statusCode: '9999', result: {}});
                    } else if(resultCount) {
                        var resultObj = {totalDocs: resultCount, homedata: data, favData: resultArray};
                        callback(errorCount, {statusCode: '0000', result: resultObj});
                    }else {
                        callback(errorCount, {statusCode: '9997', result: {}});
                    }
                });
            } else {
                callback(error, {statusCode: '9997', result: {}});
            }
        });
      }
    });
  },
  // --- End getFavoritesAndHomeScreenData:

  // --- Begin getFavoriteByRecordID:
  getFavoriteByRecordID: function(recordID, decodedTokenData, callback) {
    var query = {
      '_id': recordID,
      'isDeleted': false,
    };
    EU_Favourites.find(query)
    // .populate('serviceProviderObj')
    .exec(function(error, resultArray) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU_UserFavouriteDAO.js, at getFavoriteByRecordID:', error);
        callback(error, {statusCode: '9999', result: {}});
      } else if(resultArray && resultArray.length > 0) {
        callback(error, {statusCode: '0000', result: resultArray});
      } else {
          callback(error, {statusCode: '9997', result: {}});
      }
    });
  },
  // --- End getFavoriteByRecordID:


  // --- Begin: setServiceProviderAsFavorite
  setServiceProviderAsFavorite: function(favouritesObj, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var query = {
      'euUserId': decodedTokenData.iss,
      'spServiceProviderId': favouritesObj.spServiceProviderId,
      'spPropertyId': favouritesObj.spPropertyId
    };
    EU_Favourites.find(query).exec(function(error, resultArray) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU_UserFavouriteDAO.js, at getFavoriteByRecordID:', error);
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
            logger.error('There was an Un-known Error occured in daos/EU_UserFavouriteDAO.js, at setServiceProviderAsFavorite:', err);
            callback({httpCode: 500, statusCode: '9999', result: {}});
          } else if(resultObj && resultObj._id) {
            AuditingInfoDAO.euAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserFavourites, id: resultObj._id, value: resultObj.spPropertyTitle }, updateObj);
            EU_Users.findOneAndUpdate({'_id' : decodedTokenData.iss}, { $push: { 'preferences.favouriteProperties': favouritesObj.spPropertyId}}, {new: true}).exec(function(error, userData) {
              AuditingInfoDAO.euAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserUsers, id: decodedTokenData.iss, value: decodedTokenData.un }, { 'preferences.favouriteProperties': favouritesObj.spPropertyId });
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
                logger.error('There was an Uniqueness Error occured in daos/EU-UserFavouriteDAO.js,',
                ' at setServiceProviderAsFavorite:', err);
                callback({httpCode: 400, statusCode: '9850', result: {}});
              } else {
                logger.error('There was an Un-Known Error occured in daos/EU-UserFavouriteDAO.js,',
                ' at setServiceProviderAsFavorite:', err);
                callback({httpCode: 500, statusCode: '9999', result: {}});
              }
            } else if(data && data._id) {
              AuditingInfoDAO.euAuditing(decodedTokenData, 'Create', { name: config.collectionEndUserFavourites, id: data._id, value: data.spPropertyTitle }, data);
              EU_Users.findOneAndUpdate({'_id' : decodedTokenData.iss}, { $push: { 'preferences.favouriteProperties': data.spPropertyId}}, {new: true}).exec(function(error, userData) {
                AuditingInfoDAO.euAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserUsers, id: decodedTokenData.iss, value: decodedTokenData.un }, {'preferences.favouriteProperties': data.spPropertyId});
                callback({httpCode: 200, statusCode: '0000', result: data});
              });
            } else {
              callback({httpCode: 400, statusCode: '9993', result: {}});
            }
        });
      }
    });
   
  },
  // --- End: setServiceProviderAsFavorite

  // --- Begin deleteServiceProviderFromFavorite:
  deleteServiceProviderFromFavorite: function(body, decodedTokenData, deletefavObj, callback) {
    EU_Favourites.findOneAndUpdate({euUserId: decodedTokenData.iss, spServiceProviderId: body.spID, spPropertyId: body.spPropertyId, isDeleted: false }, {$set: deletefavObj}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU_UserFavouriteDAO.js,',
        ' at deleteServiceProviderFromFavorite:', error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj.spPropertyId) {
        AuditingInfoDAO.euAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserFavourites, id: resObj._id, value: resObj.spPropertyTitle }, deletefavObj);
        EU_Users.findOne({'_id' : decodedTokenData.iss}).exec(function(err, data) {
          if(err) {
            logger.error('There was an Un-known Error occured in daos/EU-EU_UserFavouriteDAO.js, at deleteServiceProviderFromFavorite:', err);
            callback(errorCount, {statusCode: '9999', result: {}});
          } else if(data && data._id) {
            let favArray =  data.preferences.favouriteProperties;
            let index = favArray.findIndex(x => x == body.spPropertyId);
            favArray.splice(index, 1);
            var favProperties = {'preferences.favouriteProperties': favArray};
            EU_Users.findOneAndUpdate({'_id' : decodedTokenData.iss}, {$set: favProperties}, {new: true}).exec(function(err, data) {
              AuditingInfoDAO.euAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserUsers, id: decodedTokenData.iss, value: decodedTokenData.un }, favProperties);
              callback({httpCode: 200, statusCode: '0000', result: resObj});
            });
          } else {
            callback(errorCount, {statusCode: '9997', result: {}});
          }
        });
      } else {
        callback({httpCode: 400, statusCode: '9991', result: {}});
      }
    });
  },
  // --- End deleteServiceProviderFromFavorite:

  // --- Begin getFavoriteDefaultPropertyInfo:
  getFavoriteDefaultPropertyInfo: function(propertyID, decodedTokenData, callback) {
    var query = {
      'propertyId': propertyID,
      'pricing.isDefaultBasePrice': true,
      'isDeleted': false,
    };
    SP_Properties_Info.findOne(query)
    // .populate('serviceProviderObj')
    .exec(function(error, result) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU_UserFavouriteDAO.js, at getFavoriteByRecordID:', error);
        callback(error, {statusCode: '9999', result: {}});
      } else if(result && result._id) {
        callback(error, {statusCode: '0000', result: result});
      } else {
          callback(error, {statusCode: '9997', result: {}});
      }
    });
  },
  // --- End getFavoriteDefaultPropertyInfo:
}