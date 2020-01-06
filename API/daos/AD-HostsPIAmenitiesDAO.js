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

// ---Begin:AD-HostsPIAmenitiesDAO
module.exports = {
  // Begin -- getADHostsPropertyInfoAmenitiesList: Code to get Property Info amenities
  getADHostsPropertyInfoAmenitiesList: function (propertyInfoId, searchString, callback) {
    var query = {
      'propertyInfoId': propertyInfoId,
      'isDeleted': false,
      '$or': [
        { amenityName: { $regex: searchString, $options: 'i' } }
      ]
    };
    SP_PropertyChildAmenities.find(query).sort({ 'amenityOrder': 1 }).populate('propertyId').exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPIAmenitiesDAO.js at find query: getADHostsPropertyInfoAmenitiesList,'+ error);
        callback(error, { httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback(error, { httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback(error, { httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // End -- getADHostsPropertyInfoAmenitiesList: Code to get Property Info amenities

  // --- Begin updateADHostsPropertyInfoAmenityStatus: Code to update Property Info Amenity Status
  updateADHostsPropertyInfoAmenityStatus: function (body, decodedTokenData, updateAmenityStatusObj, callback) {
    SP_PropertyChildAmenities.findOneAndUpdate( { _id: body._id, isDeleted: false }, { $set: updateAmenityStatusObj },
    { new: true }).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-HostsPIAmenitiesDAO.js,' +
        ' at updateADHostsPropertyInfoAmenityStatus:'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyChildAmenities, id: resObj._id, value: resObj.amenityName }, updateAmenityStatusObj);
          var currentUTC = CommonService.currentUTCObj();
          var upObj = {
            amenities: body.availableAmenities,
            updatedBy: decodedTokenData.ua,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedOn: currentUTC.currentUTCDateTimeString
        };
        SP_PropertyInfo.update({'_id': body.propertyInfoId, 'isDeleted': false},{$set: upObj}, function(upError, upResObj) {
          if (upError) {
            logger.error('There was an Un-known Error occured in daos/AD-HostsPIAmenitiesDAO.js,' +
            ' at updateADHostsPropertyInfoAmenityStatus: update Amenities in Info :', upError);
            callback({ httpCode: 500, statusCode: '9999', result: {} });  
          } else if(upResObj && upResObj.nModified == 1){
            AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyInfos, id: body.propertyInfoId, value: 'Property Info' }, upObj);
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          } else {
            logger.error('There was an Un-known Error occured in daos/AD-HostsPIAmenitiesDAO.js,' +
            ' at updateADHostsPropertyInfoAmenityStatus: update Amenities in Info Failed');
            callback({ httpCode: 400, statusCode: '9992', result: {} });
          }
        });
      } else {
        logger.error('There was an Un-known Error occured in daos/AD-HostsPIAmenitiesDAO.js,' +
        ' at updateADHostsPropertyInfoAmenityStatus: update Amenities in Info Failed');
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- END: updateADHostsPropertyInfoAmenityStatus: Code to update Property Info Amenity Status

  // --- Begin: updateADHostsPropertyInfoAmenityRecordID:
  updateADHostsPropertyInfoAmenityRecordID: function (recordID, decodedTokenData, updateAmenityObj, callback) {
    SP_PropertyChildAmenities.findOneAndUpdate( { _id: recordID, isDeleted: false }, { $set: updateAmenityObj },
    { new: true }).populate('propertyId').exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-HostsPIAmenitiesDAO.js, at updateADHostsPropertyInfoAmenityRecordID:'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyChildAmenities, id: resObj._id, value: resObj.amenityName }, updateAmenityObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End: updateADHostsPropertyInfoAmenityRecordID:
}
// ---END: AD-HostsPIAmenitiesDAO