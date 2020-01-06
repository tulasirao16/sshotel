/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var commonService = require('../services/CommonService');
var SP_Locations = require('../models/SP-Locations');
var SP_Properties = require('../models/SP-Properties');
var SP_PropertyInfo = require('../models/SP-PropertyInfo');
var EU_Favourites = require('../models/EU-Favourites');

// --- Begining of AD_HostPropertyLocationsDAO
module.exports = {
  // --- Begin updateSPLocationsData:
  updateADPropertyLocationsData: function (query, updateObj, spLocationObj, propertyId, tokenDecodedData, callback) { 
    SP_Locations.findOneAndUpdate(query, { $set: updateObj }, {new: true}, function (error, resObj) {
      if (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
          logger.error('There was an Uniqueness Error occured in daos/AD_HostPropertyLocationsDAO.js,' + 
            ' at updateSPLocationsData:' + error);
          callback({ httpCode: 400, statusCode: '9900', result: {} });
        } else {
          logger.error('There was an Un-known Error occured in daos/AD_HostPropertyLocationsDAO.js,' + 
            ' at updateSPLocationsData:' + error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } else if (resObj && resObj._id) {
          AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPLocations, id: query._id, value: updateObj.city }, updateObj);
          SP_Properties.updateMany({spLocationId: query._id,}, {$set: {spLocationObj: spLocationObj}}).exec(function(err, propResObj) {
           SP_Properties.findOne({'_id': propertyId, 'spLocationId': resObj._id } , function (error, spPropResObj) {
           callback({ httpCode: 200, statusCode: '0000', result: spPropResObj});
          });
        });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End updateSPLocationsData:
}