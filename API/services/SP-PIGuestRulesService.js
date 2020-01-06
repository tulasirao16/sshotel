/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var commonService = require('./CommonService');
var SP_PIGuestRulesDAO = require('../daos/SP-PIGuestRulesDAO');

module.exports = {
  // Begin -- getPropertyInfoGuestRulesList: Code to get property guest rules
  getPropertyInfoGuestRulesList: function (propertyId, propertyInfoId, tokendecodeddata, searchString, callback) {
    SP_PIGuestRulesDAO.getPropertyInfoGuestRulesList(propertyId, propertyInfoId, tokendecodeddata, searchString, function (error, resObj) {
      if (error) {
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
        callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
        callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
    });
  },
  // End -- getPropertyInfoGuestRulesList: Code to get property guest rules
  // --- Begin: updateSPPropertyInfoGuestRulesNotes
  updateSPPropertyInfoGuestRulesNotes: function(reqBody, guestRulesNotes, decodedTokenData, callback) {
    var currentUTC = commonService.currentUTCObj();
    var updateGuestRulesNotes = {
      guestRulesNotes: guestRulesNotes,
      guestRules: reqBody.guestRulesAvaliable,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
    if(reqBody.updatedGuestRulesArray && reqBody.updatedGuestRulesArray.length > 0) {
      recursiveGuestRulesData(0, reqBody, reqBody.updatedGuestRulesArray, decodedTokenData, function(resObj) {
        if( resObj == true ) {
          SP_PIGuestRulesDAO.updateSPPropertyInfoGuestRulesNotesData(reqBody, decodedTokenData, updateGuestRulesNotes, function(resObj) {
            callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
          });
        }
      })
    }
    else {
      SP_PIGuestRulesDAO.updateSPPropertyInfoGuestRulesNotesData(reqBody, decodedTokenData, updateGuestRulesNotes, function(resObj) {
        callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
      });
    }
    },
  // --- End: updateSPPropertyInfoGuestRulesNotes
}

// Begin: function for updating Guest rules Status 
var recursiveGuestRulesData = function(i, reqBody, guestRules, decodedTokenData, callback) {
  if( i < guestRules.length) {
    var ruleObj = setPropertyInfoRule( guestRules[i], decodedTokenData);
    SP_PIGuestRulesDAO.setGuestRuleData(guestRules[i]._id, reqBody, ruleObj, decodedTokenData, function(reResObj) {
      recursiveGuestRulesData(i+1, reqBody,  guestRules, decodedTokenData, callback);
      });
  } else {
      callback(true);
  }
};
// End: function for updating Guest rules Status


/**
 * @param {object} guestRule 
 */

function setPropertyInfoRule(guestRule, decodedTokenData) {
  var currentUTC = commonService.currentUTCObj();
  var ruleObj = {
    ruleStatus: guestRule.ruleStatus,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedBy: decodedTokenData.ua,
    updatedOn: currentUTC.currentUTCDateTimeString,
  };
  return ruleObj;
}