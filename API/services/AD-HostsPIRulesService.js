/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var commonService = require('./CommonService');
var AD_HostsPIRulesDAO = require('../daos/AD-HostsPIRulesDAO');

//---Begin: AD-HostsPIRulesService
module.exports = {
  // Begin -- getADHostsPropertyInfoRulesList: Code to get property Info Rules
  getADHostsPropertyInfoRulesList: function (reqparams, searchString, callback) {
    AD_HostsPIRulesDAO.getADHostsPropertyInfoRulesList(reqparams, searchString, function (error,resObj) {
      if (error) {
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
        callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
        callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
    });
  },
  // End -- getADHostsPropertyInfoRulesList: Code to get property Info Rules

  //-- Begin: updateADHostsPropertyInfoGuestRulesNotes: Code to update property info GuestRulesNotes
  updateADHostsPropertyInfoGuestRulesNotes:function(reqBody, guestRulesNotes, decodedTokenData, callback) {
      var currentUTC = commonService.currentUTCObj();
      var updateguestRulesNotesObj = {
        guestRulesNotes: guestRulesNotes,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedBy: decodedTokenData.ua,
        updatedOn: currentUTC.currentUTCDateTimeString,
        };
    AD_HostsPIRulesDAO.updateADHostsPropertyInfoGuestRulesNotes(reqBody, decodedTokenData, updateguestRulesNotesObj, function(resObj) {
      callback(resObj);
    });
  },
  //-- End: updateADHostsPropertyInfoGuestRulesNotes: Code to update property info GuestRulesNotes

 //-- Begin: updateADHostsPropertyInfoGuestRules: Code to update property info rules
  updateADHostsPropertyInfoGuestRules:function(reqBody, decodedTokenData, callback) {
      var currentUTC = commonService.currentUTCObj();
      var updateguestRulesNotesObj = {
        ruleStatus: reqBody.ruleStatus,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedBy: decodedTokenData.ua,
        updatedOn: currentUTC.currentUTCDateTimeString,
        };
    AD_HostsPIRulesDAO.updateADHostsPropertyInfoGuestRules(reqBody, decodedTokenData, updateguestRulesNotesObj, function(resObj) {
      callback(resObj);
    });
  },
//-- Begin: updateADHostsPropertyInfoGuestRules: Code to update property info rules
}
//---END: AD-HostsPIRulesService