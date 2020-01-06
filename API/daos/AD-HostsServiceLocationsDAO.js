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

// --- Begin: AD-HostsServiceLocationsDAO
module.exports = {

  // Begin: getADHostsServiceLocationsData
  getADHostServiceLocationsData: function ( hostId, pageNumber, searchString, tokenDecodedData, callback) {
    var query = {
      spServiceProviderId: hostId,
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
    SP_Locations.find(query)
    .skip((pageNumber - 1) * 10)
    .limit(10)
    .sort({ 'createdAt': -1 }).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD_HostServiceLocationsDAO.js, at getServiceLocations:', error);
        callback(error, { statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        SP_Locations.countDocuments(query).exec(function (errorCount, resultCount) {
          if (errorCount) {
            logger.error('There was an Error occured in daos/getADHostServiceLocationsData.js at getADHostServiceLocationsData countDocument', errorCount);
            callback(errorCount, { statusCode: '9999', result: {} });
          } else if (resultCount) {
            var resultObj = { totalDocs: resultCount, locationsList: resObj };
            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
              } else {
                callback({ httpCode: 400, statusCode: '9997', result: {} });
              }
            });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // End: getADHostsServiceLocationsData

  // --- Begin updateADHostServiceLocationsStatus:
  updateADHostServiceLocationsStatus: function (upObj, locationId, tokenDecodedData, callback) {
    var query = { _id: locationId, isDeleted: false };
    SP_Locations.findOneAndUpdate(query, { $set: upObj }, { new: true }, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-konwn Error occured in daos/AD_HostServiceLocationsDAO.js, at updateADHostServiceLocationsStatus:'+ error);
        callback({ httpCode: 400, statusCode: '9900', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserUsers, id: resObj._id, value: resObj.userAccount }, upObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End updateADHostServiceLocationsStatus:

  // --- Begin updateADHostServiceLocationsData:
  updateADHostServiceLocationsData: function (query, updateObj, spLocationObj, tokenDecodedData, callback) {
    SP_Locations.findOneAndUpdate(query, { $set: updateObj }, {new: true}, function (error, resObj) {
      if (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
          logger.error('There was an Uniqueness Error occured in daos/AD_HostServiceLocationsDAO.js,'+
            ' at updateSPLocationsData:'+ error);
          callback({ httpCode: 400, statusCode: '9900', result: {} });
        } else {
          logger.error('There was an Un-known Error occured in daos/AD_HostServiceLocationsDAO.js,'+
            ' at updateSPLocationsData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } else if (resObj && resObj._id) {   
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPLocations, id: query._id, value: updateObj.city }, updateObj);
        SP_Properties.updateMany({spLocationId: query._id}, { $set:  {spLocationObj: updateObj}  }, function (err, resLo) { 
        SP_PropertyInfo.updateMany({spLocationId: query._id}, { $set:  {spLocationObj: updateObj}  }, function (err, resLo) {
        })
        })
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End updateADHostServiceLocationsData:

  // Begin: postADHostServiceLocationsData
  postADHostServiceLocationsData: function (locationData, tokenDecodedData, callback) {
    locationData.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD_HostServiceLocationsDAO.js,',
        ' at postADHostServiceLocationsData:'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', {name: config.collectionSPLocations, id: resObj._id, value: resObj.city }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // End: postADHostServiceLocationsData
}
// --- Begin: AD-HostsServiceLocationsDAO
