/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var SP_Locations = require('../models/SP-Locations');
var SP_Properties = require('../models/SP-Properties');
var SP_PropertyInfo = require('../models/SP-PropertyInfo');
var EU_Favourites = require('../models/EU-Favourites');

// --- Begining of SP_LocationsDAO
module.exports = {

  // Begin: getSPServiceLocationsData
  getSPServiceLocationsData: function (pageNumber, searchString, tokendecodedData, callback) {
    var query = {
      'spServiceProviderId': tokendecodedData.uspid,
      'isDeleted': false,
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'contactPerson': { $regex: searchString, $options: 'i' } },
        { 'mobileNumber': { $regex: searchString, $options: 'i' } },
        { 'locationStatus': { $regex: searchString, $options: 'i' } },
        { 'email': { $regex: searchString, $options: 'i' } },
        { 'area': { $regex: searchString, $options: 'i' } },
        { 'city': { $regex: searchString, $options: 'i' } },
        { 'state': { $regex: searchString, $options: 'i' } },
        { 'zip': { $regex: searchString, $options: 'i' } }
      ]
    };
    SP_Locations.find(query).populate('spServiceProviderId')
    .skip((pageNumber - 1) * 10).limit(10)
    .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP_LocationsDAO.js, at getServiceLocations:', error);
        callback(error, { statusCode: '9999', result: {} });
      } else if (resultArray && resultArray.length > 0) {
        SP_Locations.countDocuments(query).exec(function (errorCount, resultCount) {
          if (errorCount) {
            logger.error('There was an Error occured in daos/getSPServiceLocationsData.js at getSPServiceLocationsData countDocument', errorCount);
            callback(errorCount, { statusCode: '9999', result: {} });
          } else if (resultCount) {
            var resultObj = { totalDocs: resultCount, locationsList: resultArray };
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
  // End: getSPLocations

  // Begin: postSPLocationsData
  postSPLocationsData: function (locationData, tokenDecodedData, callback) {
    locationData.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP_LocationsDAO.js,',
        ' at postSPLocationsData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionSPLocations, id: resObj._id, value: resObj.city }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // End: postSPLocationsData

  // --- Begin updateSPLocationsData:
  updateSPLocationsData: function (query, updateObj, spLocationObj, tokenDecodedData, callback) {
    SP_Locations.findOneAndUpdate(query, { $set: updateObj }, {new: true}, function (error, data) {
      if (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
          logger.error('There was an Uniqueness Error occured in daos/SP_LocationsDAO.js,',
            ' at updateSPLocationsData:', error);
          callback({ httpCode: 400, statusCode: '9900', result: {} });
        } else {
          logger.error('There was an Un-known Error occured in daos/SP_LocationsDAO.js,',
            ' at updateSPLocationsData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } else if (data && data._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPLocations, id: query._id, value: updateObj.city }, updateObj);
        SP_Properties.updateMany({spLocationId: query._id, spServiceProviderId: query.spServiceProviderId}, {$set: {spLocationObj: spLocationObj}}).exec(function(err, propResObj) {});
        SP_PropertyInfo.updateMany({spLocationId: query._id, spServiceProviderId: query.spServiceProviderId}, {$set: {spLocationObj: spLocationObj}}).exec(function(err, infoResObj) {});
        EU_Favourites.updateMany({spLocationId: query._id, spServiceProviderId: query.spServiceProviderId}, {$set: {spLocationObj: spLocationObj}}).exec(function(err, favResObj) {});
        callback({ httpCode: 200, statusCode: '0000', result: data });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End updateSPLocationsData:

  updateLocationInProperty: function(propertyID, ptylocObj, tokendecodedData, callback) {
    var query = {
      '_id': propertyID,
      'spServiceProviderId': tokendecodedData.uspid,
      'isDeleted': false,
    };
    SP_Properties.findOneAndUpdate(query, {$set: ptylocObj}, {new: true})
    .populate('spLocationId')
    .exec(function(error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP_LocationsDAO.js,' +
         ' at updateLocationInProperty:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPProperties, id: resObj._id, value: resObj.propertyTitle }, ptylocObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },

  // --- Begin activateSPLocationsData:
  activateSPLocationsData: function (recordID, updateLocationObj, decodedTokenData, callback) {
    SP_Locations.findOneAndUpdate({ _id: recordID, isDeleted: false }, { $set: updateLocationObj }, { new: true }, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP_LocationsDAO.js,' +
          ' at activateSPLocationsData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPLocations, id: resObj._id, value: resObj.city }, updateLocationObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End activateSPLocationsData:

  // --- Begin inActivateSPLocationsData:
  inActivateSPLocationsData: function (recordID, updateLocationObj, decodedTokenData, callback) {
    SP_Properties.findOne({spLocationId: '_id', status : 'Active', isDeleted: false}, function(error, data) {
      if (error) {
      logger.error('There was an Un-konwn Error occured in daos/SP-LocationsDAO.js,',
        ' at inActivateSPLocationsData:', error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if (data && data._id) {
        callback({ httpCode: 400, statusCode: '9001', result: resObj });
      } else {    
        SP_Locations.findOneAndUpdate({ _id: recordID, isDeleted: false }, { $set: updateLocationObj }, { new: true }, function (error, resObj) {
          if (error) {
            logger.error('There was an Un-known Error occured in daos/SP_LocationsDAO.js,' +
              ' at inActivateSPLocationsData:', error);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if (resObj && resObj.spServiceProviderId) {
            AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPLocations, id: resObj._id, value: resObj.city }, updateLocationObj);
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          } else {
            callback({ httpCode: 400, statusCode: '9992', result: {} });
          }
        });
      }
    });
  },
  // --- End inActivateSPLocationsData:
}




