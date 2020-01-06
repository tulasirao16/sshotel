/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var moment = require('moment');
var CommonService = require('../services/CommonService');
var AD_HostsNotificationsDAO = require('../daos/AD-HostsNotificationsDAO');
// var SP_Properties = require('../models/SP-Properties');
// var SP_Users = require('../models/SP-Users');

// BEGIN : AD-HostsNotificationsService
module.exports = {
  // BEGIN : getHostsNotifications
  getHostsNotifications: function (hostId, pageNumber, searchString, tokenDecodedData, callback) {
    AD_HostsNotificationsDAO.getHostsNotifications(hostId, pageNumber, searchString, tokenDecodedData, function (resObj) {
      callback(resObj);
    });
  },
  // END : getHostsNotifications

  // BEGIN : hostsNotificationsDelete
  hostsNotificationsDelete: function (recordID, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
      isDeleted: true
    };
    AD_HostsNotificationsDAO.hostsNotificationsDelete(recordID, updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // END : hostsNotificationsDelete 

  // BEGIN : hostsNotificationsReadStatus    
  hostsNotificationsReadStatus: function (recordID, reqBody, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      status: reqBody.status,
      updatedBy: tokenDecodedData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_HostsNotificationsDAO.hostsNotificationsReadStatus(updateObj, recordID, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // END : hostsNotificationsReadStatus

}
// BEGIN : AD-HostsNotificationsService
