/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */
var geolite2 = require('geolite2');
var maxmind = require('maxmind');
var CommonService = require('./CommonService');
var logger = require('../lib/logger');
var AD_Tickets = require('../models/AD-Tickets');
var SP_SupportDAO = require('../daos/SP-SupportDAO');


// --- Begin: SP-SupportService
module.exports = {
  getSPSupportData: function(pageNum, searchString,tokenDecodedData, callback) {
    SP_SupportDAO.getSPSupportData(pageNum, searchString,tokenDecodedData, function(resObj) {
        callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },

  createSPSupportData : function(reqBody, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var currentUTCNumString = currentUTC.currentUTCDateTimeNumber.toString();
    let supportObj = {
      spServiceProviderId: tokenDecodedData.uspid,
      spServiceProvider: tokenDecodedData.usp,
      spUserId: tokenDecodedData.iss,
      spName: tokenDecodedData.un,
      ticketTitle: reqBody.ticketTitle,
      ticketTag: reqBody.ticketTag,
      reqMobileNumber: reqBody.reqMobileNumber,
      reqEmail: reqBody.reqEmail,
      ticketDescription: reqBody.ticketDescription,
      ticketStatus: 'New',
      assignStatus: 'Unassigned',
      ticketGroup: 'Host Service',
      ticketPriority: 'Medium',
      ticketNumType: reqBody.ticketNumType,
      createdBy: tokenDecodedData.ua,
      createdAt: currentUTC.currentUTCDateTimeNumber,
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
    var spSupportObj = new AD_Tickets(supportObj);
    SP_SupportDAO.createSPSupportData(spSupportObj, reqBody, tokenDecodedData, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  }
};
// --- End: SP-SupportService
