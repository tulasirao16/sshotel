/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var EU_NotificationsDAO = require('../daos/EU-NotificationsDAO');

module.exports = {
  getEndUserNotifications: function (tokenDecodedData, callback) {
    EU_NotificationsDAO.getEndUserNotifications(tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  getEndUserNotificationsUnReadCount: function (tokenDecodedData, callback) {
    EU_NotificationsDAO.getEndUserNotificationsUnReadCount(tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  updateEndUserNotificationUnReadToRead: function (tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      status: 'Read',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: 'superadmin',
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    EU_NotificationsDAO.updateEndUserNotificationUnReadToRead(updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  endUserDeleteNotifications: function (notifyIDs, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: 'superadmin',
      updatedOn: currentUTC.currentUTCDateTimeString,
      isDeleted: true
    };
    EU_NotificationsDAO.endUserDeleteNotifications(notifyIDs, updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  }
};