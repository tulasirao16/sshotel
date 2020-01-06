/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var SP_PropertyChildRules = require('../models/SP-PropertyChildRules');
var SP_PropertyInfo = require('../models/SP-PropertyInfo');

module.exports = {
  // Begin -- getPropertyInfoGuestRulesList: Code to get property amenities
  getPropertyInfoGuestRulesList: function (propertyId, propertyInfoId, tokendecodeddata, searchString, callback) {
    var query = {
      'spServiceProviderId': tokendecodeddata.uspid,
      'propertyId': propertyId,
      'propertyInfoId': propertyInfoId,
      'isDeleted': false,
      '$or': [
        { ruleName: { $regex: searchString, $options: 'i' } }
      ]
    };
    SP_PropertyChildRules.find(query).sort({ 'ruleOrder': 1 })
    .populate('propertyInfoId')
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PIGuestRulesDAO.js at find query: getPropertyInfoGuestRulesList,'
          , error);
        callback(error, { httpCode: 500, statusCode: '9999', result: {} });
      } else if (data && data.length > 0) {
        callback(error, { httpCode: 200, statusCode: '0000', result: data });
      } else {
        callback(error, { httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // End -- getPropertyInfoGuestRulesList: Code to get property amenities
  // --- Begin updateSPPropertyInfoGuestRulesNotesData:
  updateSPPropertyInfoGuestRulesNotesData: function (body, decodedTokenData, updateGuestRulesNotes, callback) {
    SP_PropertyInfo.findOneAndUpdate( { _id: body.propertyInfoId, propertyId:body.propertyId, isDeleted: false }, { $set: updateGuestRulesNotes },  { new: true })
    .exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP-PIGuestRulesDAO.js,' +
          ' at updateSPPropertyInfoGuestRulesNotesData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyInfos, id: resObj._id, value: resObj.propertyTitle }, updateGuestRulesNotes);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End updateSPPropertyInfoGuestRulesNotesData:
  // --- Begin setGuestRuleData: Code to update rules status
  setGuestRuleData: function (ID, body, updateGuestRulesStatus, decodedTokenData, callback) {
    SP_PropertyChildRules.findOneAndUpdate( { _id: ID, isDeleted: false }, { $set: updateGuestRulesStatus }, 
    { new: true }).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP-PIGuestRulesDAO.js,' +
          ' at setGuestRuleData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPPropertyChildRules, id: resObj._id, value: resObj.ruleName }, updateGuestRulesStatus);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  }
  // --- End setGuestRuleData: Code to update rules status
}