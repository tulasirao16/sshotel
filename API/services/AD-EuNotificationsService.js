/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var moment = require('moment');
var CommonService = require('./CommonService');
var AD_EuNotificationsDAO = require('../daos/AD-EuNotificationsDAO');
// var SP_Properties = require('../models/SP-Properties');
// var SP_Users = require('../models/SP-Users');

// BEGIN : AD-EuNotificationsService
module.exports = {
  // BEGIN : getEuNotifications
  getEuNotifications: function (userId, pageNumber, searchString, tokenDecodedData, callback) {
    AD_EuNotificationsDAO.getEuNotifications(userId, pageNumber, searchString, tokenDecodedData, function (resObj) {
      callback(resObj);
    });
  },
  // END : getEuNotifications

  // BEGIN : euNotificationsReadStatus    
  euNotificationsReadStatus: function (recordID, reqBody, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      status: reqBody.status,
      updatedBy: tokenDecodedData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_EuNotificationsDAO.euNotificationsReadStatus(updateObj, recordID, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // END : euNotificationsReadStatus

  // BEGIN : euNotificationsDelete
  euNotificationsDelete: function (recordID, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
      isDeleted: true
    };
    AD_EuNotificationsDAO.euNotificationsDelete(recordID, updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // END : euNotificationsDelete 
}
// END : AD-EuNotificationsService