/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var EU_Notifications = require('../models/EU-Notifications');

module.exports = {
  getEndUserNotifications: function (tokenDecodedData, callback) {
    EU_Notifications.find({ 'euUserId': tokenDecodedData.iss, 'isDeleted': false })
    .sort({'createdAt': -1}).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-NotificationsDAO.js at getEndUserNotifications', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },

  getEndUserNotificationsUnReadCount: function (tokenDecodedData, callback) {
    EU_Notifications.countDocuments({ 'euUserId': tokenDecodedData.iss, 'status': 'Unread', 'isDeleted': false }).
    exec(function (errorCount, resultCount) {
      if (errorCount) {
        logger.error('There was an Un-known Error occured in daos/EU-NotificationsDAO.js, at getEndUserNotificationsUnReadCount:', errorCount);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resultCount) {
        callback({ httpCode: 200, statusCode: '0000', result: resultCount });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  updateEndUserNotificationUnReadToRead: function (updateObj, tokenDecodedData, callback) {
    var query = {
      'euUserId': tokenDecodedData.iss,
      'status': 'Unread',
      'isDeleted': false
    };
    EU_Notifications.updateMany(query, { $set: updateObj }, function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-NotificationsDAO.js at updateEndUserNotificationUnReadToRead', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.nModified >= 1) {
        AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update Many', { name: config.collectionEndUserNotifications, id: tokenDecodedData.iss, value: 'UserID - Notifications Count: ' + resObj.nModified }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  endUserDeleteNotifications: function (notifyIDs, updateObj, tokenDecodedData, callback) {
    var query = {
      'euUserId': tokenDecodedData.iss,
      '_id': { '$in': notifyIDs },
      'isDeleted': false
    };
    EU_Notifications.updateMany(query, { $set: updateObj }, function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-NotificationsDAO.js at endUserDeleteNotifications', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.nModified >= 1) {
        updateObj['delIDs'] = notifyIDs
        AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update Many', { name: config.collectionEndUserNotifications, id: tokenDecodedData.iss, value: 'UserID - Notifications Count: ' + resObj.nModified }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  }

}