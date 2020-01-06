/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var SP_PropertyChildAmenities = require('../models/SP-PropertyChildAmenities');
var SP_PropertyInfo = require('../models/SP-PropertyInfo');

module.exports = {
  // Begin -- getPropertyInfoAmenitiesList: Code to get property amenities
  getPropertyInfoAmenitiesList: function (propertyId, propertyInfoId, tokendecodeddata, searchString, callback) {
    var query = {
      'spServiceProviderId': tokendecodeddata.uspid,
      'propertyId': propertyId,
      'propertyInfoId': propertyInfoId,
      'isDeleted': false,
      '$or': [
        { amenityName: { $regex: searchString, $options: 'i' } }
      ]
    };
    SP_PropertyChildAmenities.find(query).sort({ 'amenityOrder': 1 }).populate('propertyId').exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PIAmenitiesDAO.js at find query: getPropertyInfoAmenitiesList,'
          , error);
        callback(error, { httpCode: 500, statusCode: '9999', result: {} });
      } else if (data && data.length > 0) {
        callback(error, { httpCode: 200, statusCode: '0000', result: data });
      } else {
        callback(error, { httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // End -- getPropertyInfoAmenitiesList: Code to get property amenities

  // --- Begin updateSPPropertyInfoAmenityData:
  updateSPPropertyInfoAmenityData: function (body, decodedTokenData, updateAmenityObj, callback) {
    SP_PropertyChildAmenities.findOneAndUpdate( { _id: body._id, isDeleted: false }, { $set: updateAmenityObj },
    { new: true }).populate('propertyId').exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP-PIAmenitiesDAO.js,' +
          ' at updateSPPropertyInfoAmenityData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyChildAmenities, id: resObj._id, value: resObj.amenityName }, updateAmenityObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End updateSPPropertyInfoAmenityData:

  // --- Begin updateSPPropertyInfoAmenityStatus: Code to update Amenity Status
    updateSPPropertyInfoAmenityStatus: function (body, decodedTokenData, updateAmenityStatusObj, callback) {
      SP_PropertyChildAmenities.findOneAndUpdate( { _id: body._id, isDeleted: false }, { $set: updateAmenityStatusObj },
      { new: true }).exec(function (error, resObj) {
          if (error) {
            logger.error('There was an Un-known Error occured in daos/SP-PIAmenitiesDAO.js,' +
              ' at updateSPPropertyInfoAmenityStatus:', error);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if (resObj && resObj._id) {
            AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyChildAmenities, id: resObj._id, value: resObj.amenityName }, updateAmenityStatusObj);
            var currentUTC = CommonService.currentUTCObj();
            var upObj = {
              amenities: body.availableAmenities,
              updatedBy: decodedTokenData.ua,
              updatedAt: currentUTC.currentUTCDateTimeNumber,
              updatedOn: currentUTC.currentUTCDateTimeString
            };
            SP_PropertyInfo.update({'_id': body.propertyInfoId, 'isDeleted': false},{$set: upObj}, function(upError, upResObj) {
              if (upError) {
                logger.error('There was an Un-known Error occured in daos/SP-PIAmenitiesDAO.js,' +
                  ' at updateSPPropertyInfoAmenityStatus update Amenities in Info :', upError);
                 callback({ httpCode: 500, statusCode: '9999', result: {} });  
              } else if(upResObj && upResObj.nModified == 1){
                AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyInfos, id: body.propertyInfoId, value: 'Property Info' }, upObj);
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
              } else {
                logger.error('There was an Un-known Error occured in daos/SP-PIAmenitiesDAO.js,' +
                ' at updateSPPropertyInfoAmenityStatus update Amenities in Info Failed');
                callback({ httpCode: 400, statusCode: '9992', result: {} });
              }
            });
          } 
        });
    },
  // --- End updateSPPropertyInfoAmenityStatus: Code to update Amenity Status
}