/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var SP_PropertyChildServices = require('../models/SP-PropertyChildServices');
var SP_PropertyInfo = require('../models/SP-PropertyInfo');

// --- Begining of SP-PropertyInfoServicesDAO
module.exports = {

  // --- Begin updateSPUserData:
  updateSPPropertyInfoServicesData: function(body, decodedTokenData, updateServiceObj, callback) {
    SP_PropertyChildServices.findOneAndUpdate({_id: body._id, isDeleted: false}, {$set: updateServiceObj}, {new: true}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-PropertyInfoServicesDAO.js,'+
        ' at updateSPUserData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyChildServicesSchema, id: resObj._id, value: resObj.serviceName }, updateServiceObj);
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({httpCode: 400, statusCode: '9992', result: {}});
      }
    });
  },
  // --- End updateSPUserData:

  // --- Begin updateSPPIServiceStatusAvailable:
  updateSPPIServiceStatusAvailable: function(recordID, decodedTokenData, updateServiceObj, reqBody, currentUTC, callback) {
    SP_PropertyChildServices.findOneAndUpdate({_id: recordID, isDeleted: false }, {$set: updateServiceObj}, {new: true}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-PropertyInfoServicesDAO.js,'+
        ' at updateSPPIServiceStatusAvailable:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyChildServicesSchema, id: resObj._id, value: resObj.serviceName }, updateServiceObj);
        var updateObj = {
          services: reqBody.servicesAvailable,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedBy: decodedTokenData.ua,
          updatedOn: currentUTC.currentUTCDateTimeString,
        };
        SP_PropertyInfo.updateOne({'_id': reqBody.propertyInfoId, 'isDeleted': false}, {$set: updateObj}, function(upError, upResObj) {
          if(upError) {
            logger.error('There was an Un-known Error occured in daos/SP-PropertyInfoServicesDAO.js,'+
            ' at updateSPPIServiceStatusAvailable:', upError);
          } else if(upResObj && upResObj.nModified == 1) {
            AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyInfos, id: reqBody.propertyInfoId, value: 'Property Info' }, updateObj);
          } else {
            logger.error('updated failed info services daos/SP-PropertyInfoServicesDAO.js, at updateSPPIServiceStatusAvailable:');
          }
        });
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({httpCode: 400, statusCode: '9992', result: {}});
      }
    });
  },
  // --- End updateSPPIServiceStatusAvailable:

  // --- Begin updateSPPIServiceStatusUnavailable:
  updateSPPIServiceStatusUnavailable: function(recordID, decodedTokenData, updateServiceObj, reqBody, currentUTC, callback) {
    SP_PropertyChildServices.findOneAndUpdate({_id: recordID, isDeleted: false }, {$set: updateServiceObj},  {new: true}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-PropertyInfoServicesDAO.js,'+
        ' at updateSPPIServiceStatusUnavailable:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyChildServicesSchema, id: resObj._id, value: resObj.serviceName }, updateServiceObj);
        var updateObj = {
          services: reqBody.servicesAvailable,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedBy: decodedTokenData.ua,
          updatedOn: currentUTC.currentUTCDateTimeString,
        };
        SP_PropertyInfo.updateOne({'_id': reqBody.propertyInfoId, 'isDeleted': false}, {$set: updateObj}, function(upError, upResObj) {
          if(upError) {
            logger.error('There was an Un-known Error occured in daos/SP-PropertyInfoServicesDAO.js,'+
            ' at updateSPPIServiceStatusUnavailable:', upError);
          } else if(upResObj && upResObj.nModified == 1) {
            AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyInfos, id: reqBody.propertyInfoId, value: 'Property Info' }, updateObj);
          } else {
            logger.error('updated failed info services daos/SP-PropertyInfoServicesDAO.js, at updateSPPIServiceStatusUnavailable:');
          }
        });
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({httpCode: 400, statusCode: '9992', result: {}});
      }
    });
  },
  // --- End updateSPPIServiceStatusUnavailable:
};
// --- End of SP-PropertyInfoServicesDAO
