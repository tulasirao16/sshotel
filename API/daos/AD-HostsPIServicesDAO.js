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
var SP_PropertyChildServices = require('../models/SP-PropertyChildServices');
var SP_PropertyInfo = require('../models/SP-PropertyInfo');

// ---Begin:AD-HostsPIServicesDAO
module.exports = {
  // Begin -- getADHostsPropertyInfoServicesList: Code to get Property Info Services
  getADHostsPropertyInfoServicesList: function (propertyInfoId, searchString, callback) {
    var query = {
      'propertyInfoId': propertyInfoId,
      'isDeleted': false,
      '$or': [
        { serviceName: { $regex: searchString, $options: 'i' } }
      ]
    };
    SP_PropertyChildServices.find(query).sort({ 'serviceOrder': 1 }).populate('propertyId').exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPIServicesDAO.js at find query: getADHostsPropertyInfoServicesList,'+ error);
        callback(error, { httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback(error, { httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback(error, { httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // End -- getADHostsPropertyInfoServicesList: Code to get Property Info Services

  // --- Begin  updateADHostsPropertyInfoServiceStatus: Code to update Property Info Service Status
  updateADHostsPropertyInfoServiceStatus: function (body, decodedTokenData, updateServicesStatusObj, callback) {
    SP_PropertyChildServices.findOneAndUpdate( { _id: body._id, isDeleted: false }, { $set: updateServicesStatusObj },
    { new: true }).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-HostsPIServicesDAO.js, at updateADHostsPropertyInfoServiceStatus:' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyChildServicesSchema, id: resObj._id, value: resObj.serviceName }, updateServicesStatusObj);
        var currentUTC = CommonService.currentUTCObj();
        var upObj = {
          services: body.servicesAvailable,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedBy: decodedTokenData.ua,
          updatedOn: currentUTC.currentUTCDateTimeString,
        };
        SP_PropertyInfo.update({'_id': body.propertyInfoId, 'isDeleted': false},{$set: upObj}, function(upError, upResObj) {
          if (upError) {
            logger.error('There was an Un-known Error occured in daos/AD-HostsPIServicesDAO.js, at updateADHostsPropertyInfoServiceStatus: update Services in Info :' + upError);
            callback({ httpCode: 500, statusCode: '9999', result: {} });  
          } else if(upResObj && upResObj.nModified == 1){
            AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyInfos, id: body.propertyInfoId, value: 'Property Info' }, upObj);
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          } else {
            logger.error('There was an Un-known Error occured in daos/AD-HostsPIServicesDAO.js, at updateADHostsPropertyInfoServiceStatus: update Services in Info Failed');
            callback({ httpCode: 400, statusCode: '9992', result: {} });
          }
        });
      } else {
        logger.error('There was an Un-known Error occured in daos/AD-HostsPIServicesDAO.js, at updateADHostsPropertyInfoServiceStatus: update Services in Info Failed');
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End: updateADHostsPropertyInfoServiceStatus: Code to update Property Info Service Status

  // --- Begin updateADHostsPropertyInfoServiceRecordID:
  updateADHostsPropertyInfoServiceRecordID: function (recordID, decodedTokenData, updateAmenityObj, callback) {
    SP_PropertyChildServices.findOneAndUpdate( { _id: recordID, isDeleted: false }, { $set: updateAmenityObj },
    { new: true }).populate('propertyId').exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-HostsPIServicesDAO.js, at updateADHostsPropertyInfoServiceRecordID:'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyChildServicesSchema, id: resObj._id, value: resObj.amenityName }, updateAmenityObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End updateADHostsPropertyInfoServiceRecordID:
}
//---End: AD-HostsPIServicesDAO