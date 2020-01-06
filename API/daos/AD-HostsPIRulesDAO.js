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
var SP_PropertyChildRules = require('../models/SP-PropertyChildRules');
var SP_PropertyInfo = require('../models/SP-PropertyInfo');

// ---Begin:AD-HostsPIRulesDAO
module.exports = {
  // Begin -- getADHostsPropertyInfoRulesList: Code to get property Info Rules
  getADHostsPropertyInfoRulesList: function (reqparams, searchString, callback) {
    var query = {
      'propertyId': reqparams.propertyId,
      'propertyInfoId': reqparams.propertyInfoId,
      'isDeleted': false,
      '$or': [
        { ruleName: { $regex: searchString, $options: 'i' } }
      ]
    };
    SP_PropertyChildRules.find(query).sort({ 'ruleOrder': 1 })
    .populate('propertyInfoId')
    SP_PropertyChildRules.find(query).sort({ 'ruleOrder': 1 }).populate('propertyInfoId').exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPIRulesDAO.js at find query: getADHostsPropertyInfoRulesList,'+ error);
        callback(error, { httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback(error, { httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback(error, { httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // End -- getADHostsPropertyInfoRulesList: Code to get property Info Rules 

  // --- Begin: updateADHostsPropertyInfoGuestRulesNotes: Code to update Property Info GuestRulesNotes 
  updateADHostsPropertyInfoGuestRulesNotes: function (body, decodedTokenData, updateGuestRulesNotes, callback) {
    SP_PropertyInfo.findOneAndUpdate( { _id: body._id, propertyId: body.propertyId,  isDeleted: false }, { $set: updateGuestRulesNotes }).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-HostsPIRulesDAO.js, at updaupdateADHostsPropertyInfoGuestRulesNotes:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyInfos, id: resObj._id, value: 'Property Info' }, updateGuestRulesNotes);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        logger.error('There was an Un-known Error occured in daos/AD-HostsPIRulesDAO.js, at updateADHostsPropertyInfoGuestRulesNotes:Property in Info GuestRulesNotes Failed');
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- END: updateADHostsPropertyInfoGuestRulesNotes: Code to update Property Info GuestRulesNotes 

  // --- Begin updateADHostsPropertyInfoGuestRules:  Code to update Property Info Rules Status
  updateADHostsPropertyInfoGuestRules: function (body, decodedTokenData, updateGuestRulesNotes, callback) {
    SP_PropertyChildRules.findOneAndUpdate( { _id: body._id, propertyInfoId: body.propertyInfoId,  isDeleted: false }, { $set: updateGuestRulesNotes}, { new: true }).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-HostsPIRulesDAO.js, at updateADHostsPropertyInfoGuestRules:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyChildRules, id: resObj._id, value: 'Property Info' }, updateGuestRulesNotes);
          var currentUTC = CommonService.currentUTCObj();
          var upObj = {
            rules: body.rulesActive,
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedBy: decodedTokenData.ua,
            updatedOn: currentUTC.currentUTCDateTimeString,
          };
          SP_PropertyInfo.update({'_id': body.propertyInfoId, 'isDeleted': false},{$set: upObj}, function(upError, upResObj) {
          if (upError) {
            logger.error('There was an Un-known Error occured in daos/AD-HostsPIRulesDAO.js, at updateADHostsPropertyInfoGuestRules: update Property in Info Rules :' + upError);
            callback({ httpCode: 500, statusCode: '9999', result: {} });  
          } else if(upResObj && upResObj.nModified == 1){
            AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyChildRules, id: body._id, value: 'Property Info' }, upObj);
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          } else {
            logger.error('There was an Un-known Error occured in daos/AD-HostsPIRulesDAO.js, at updateADHostsPropertyInfoGuestRules: update Property in Info Rules Failed');
            callback({ httpCode: 400, statusCode: '9992', result: {} });
          }
        });
      } else {
        logger.error('There was an Un-known Error occured in daos/AD-HostsPIRulesDAO.js, at updateADHostsPropertyInfoGuestRules: update Property in Info Rules Failed');
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- END: updateADHostsPropertyInfoGuestRulesNotes: Code to update Property Info Rules Status 
  }
// ---END:AD-HostsPIRulesDAO