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


module.exports = {
  // --- Begin getSPFavouriteUsers:
  getSPFavouriteUsers: function(pageNum, searchString, decodedTokenData, callback) {
    var query = {
      'spServiceProviderId': decodedTokenData.uspid,
      'isDeleted': false,
      '$or': [
        {euName: {$regex: searchString, $options: 'i'}},
        {notes: {$regex: searchString, $options: 'i'}},
        {spServiceProvider: {$regex: searchString, $options: 'i'}}
      ]
    };
    EU_Favourites.find(query)
    .populate('euUserId')
    .populate('spPropertyId')
    .sort({'createdAt': -1})
    .skip((pageNum - 1) * 20)
    .limit(20)
    .exec(function(error, resultArray) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP_UserFavouriteDAO.js, at getFavourites:', error);
        callback(error, {statusCode: '9999', result: {}});
      } else if(resultArray && resultArray.length > 0) {
        EU_Favourites.countDocuments(query).exec(function(errorCount, resultCount) {
          if(errorCount) {
              logger.error('There was an Un-known Error occured in daos/SP_UserFavouriteDAO.js, at getFavourites:', errorCount);
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
  // --- End getSPFavouriteUsers:

  // --- Begin unfavouriteUserFromFavourite:
  unfavouriteUserFromFavourite: function(body, decodedTokenData, deletefavObj, callback) {
    EU_Favourites.findOneAndUpdate({_id: body.recordID, isDeleted: false }, {$set: deletefavObj}, {new: true}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP_UserFavouriteDAO.js,',
        ' at unfavouriteUserFromFavourite:', error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj.spPropertyId) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserFavourites, id: resObj._id, value: resObj.spPropertyTitle }, deletefavObj);
        EU_Users.findOne({'_id' : body.userID}).exec(function(err, data) {
          if(err) {
            logger.error('There was an Un-known Error occured inresObjresObj daos/EU-EU_UserFavouriteDAO.js, at unfavouriteUserFromFavourite:', err);
            callback({httpCode: 400,statusCode: '9999', result: {}});
          } else if(data && data._id) {
              let favArray =  data.preferences.favouriteProperties;
              let index = favArray.findIndex(x => x == body.spPropertyId);
              favArray.splice(index, 1);
              var favProperties = {'preferences.favouriteProperties': favArray};
              EU_Users.findOneAndUpdate({'_id' : body.userID}, {$set: favProperties}, {new: true}).exec(function(err, data) {
                AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserUsers, id: data._id, value: data.userAccount }, favProperties);
                callback({httpCode: 200, statusCode: '0000', result: resObj});
              });
          } else {
              callback({httpCode: 400,statusCode: '9997', result: {}});
          }
        });
      } else {
        callback({httpCode: 400, statusCode: '9991', result: {}});
      }
    });
  },
  // --- End unfavouriteUserFromFavourite:

  // --- Begin setUserAsFavourite:
  setUserAsFavourite: function(body, decodedTokenData, setfavObj, callback) {
    EU_Favourites.findOneAndUpdate({_id: body.recordID, isDeleted: false }, {$set: setfavObj}, {new: true}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP_UserFavouriteDAO.js,',
        ' at deleteUserFromFavourite:', error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj.spPropertyId) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserFavourites, id: resObj._id, value: resObj.spPropertyTitle }, setfavObj);
        EU_Users.findOne({'_id' : body.userID}).exec(function(err, data) {
          if(err) {
            logger.error('There was an Un-known Error occured inresObjresObj daos/EU-EU_UserFavouriteDAO.js, at setUserAsFavourite:', err);
            callback({httpCode: 400, statusCode: '9999', result: {}});
          } else if(data && data._id) {
              EU_Users.findOneAndUpdate({'_id' : body.userID}, { $push: { 'preferences.favouriteProperties': body.spPropertyId}}, {new: true}).exec(function(err, data) {
                AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserUsers, id: data._id, value: data.userAccount }, {'preferences.favouriteProperties': data.preferences.favouriteProperties});
                callback({httpCode: 200, statusCode: '0000', result: resObj});
              });
          } else {
              callback({httpCode: 400,statusCode: '9997', result: {}});
          }
        });
      } else {
        callback({httpCode: 400, statusCode: '9991', result: {}});
      }
    });
  },
  // --- End setUserAsFavourite:


  // --- Begin deleteUserFromFavourite:
  deleteUserFromFavourite: function(body, decodedTokenData, setfavObj, callback) {
    EU_Favourites.findOneAndUpdate({_id: body.recordID, isDeleted: false }, {$set: setfavObj}, {new: true}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP_UserFavouriteDAO.js,',
        ' at deleteUserFromFavourite:', error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj.spPropertyId) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserFavourites, id: resObj._id, value: resObj.spPropertyTitle }, setfavObj);
        EU_Users.findOne({'_id' : body.userID}).exec(function(err, data) {
          if(err) {
            logger.error('There was an Un-known Error occured inresObjresObj daos/EU-EU_UserFavouriteDAO.js, at deleteUserFromFavourite:', err);
            callback({httpCode: 400,statusCode: '9999', result: {}});
          } else if(data && data._id) {
              let favArray =  data.preferences.favouriteProperties;
              let index = favArray.findIndex(x => x == body.spPropertyId);
              favArray.splice(index, 1);
              var favProperties = {'preferences.favouriteProperties': favArray};
              EU_Users.findOneAndUpdate({'_id' : body.userID}, {$set: favProperties}, {new: true}).exec(function(err, data) {
                AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', { name: config.collectionEndUserUsers, id: data._id, value: data.userAccount }, favProperties);
                callback({httpCode: 200, statusCode: '0000', result: resObj});
              });
          } else {
              callback({httpCode: 400, statusCode: '9997', result: {}});
          }
        });
      } else {
        callback({httpCode: 400, statusCode: '9991', result: {}});
      }
    });
  },
  // --- End setUserAsFavourite:
}