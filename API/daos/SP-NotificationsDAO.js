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
var SP_Notifications = require('../models/SP-Notifications');
var sendSMS = require('../config/sendSMS');

module.exports = {
  getSPNotifications: function (pageNumber, searchString, tokenDecodedData, callback) {
    var query = {
      'spUserId': tokenDecodedData.iss,
      'isDeleted': false,
      '$or': [
        { 'notificationTitle': { $regex: searchString, $options: 'i' } },
        { 'notificationMessage': { $regex: searchString, $options: 'i' } }
      ]
    };
    SP_Notifications.find(query)
    .populate('spUserId')
    .sort({'createdAt': -1})
    .skip((pageNumber - 1) * 10)
    .limit(10)
    .exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-NotificationsDAO.js at getSPNotifications', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        SP_Notifications.countDocuments(query).
          exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/SP-NotificationsDAO.js, at getSPNotifications:', errorCount);
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount, notificationsData: resObj };
              callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            } else {
              callback({ httpCode: 400, statusCode: '9997', result: {} });
            }
          });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },

  getSPNotificationsUnReadCount: function (tokenDecodedData, callback) {
    SP_Notifications.countDocuments({ 'spUserId': tokenDecodedData.iss, 'status': 'Unread', 'isDeleted': false }).
      exec(function (errorCount, resultCount) {
        if (errorCount) {
          logger.error('There was an Un-known Error occured in daos/SP-NotificationsDAO.js, at getSPNotificationsUnReadCount:', errorCount);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resultCount) {
          callback({ httpCode: 200, statusCode: '0000', result: resultCount });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },
  updateSPNotificationUnReadToRead: function (updateObj, tokenDecodedData, callback) {
    var query = {
      'spUserId': tokenDecodedData.iss,
      'status': 'Unread',
      'isDeleted': false
    };
    SP_Notifications.updateMany(query, { $set: updateObj }, function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-NotificationsDAO.js at updateSPNotificationUnReadToRead', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.nModified >= 1) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPNotifications, id: tokenDecodedData.iss, value: 'SP UserID: '+tokenDecodedData.ua }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  serviceProviderDeleteNotification: function (notifyIDs, updateObj, tokenDecodedData, callback) {
    var query = {
      'spUserId': tokenDecodedData.iss,
      '_id': { '$in': notifyIDs },
      'isDeleted': false
    };
    SP_Notifications.updateMany(query, { $set: updateObj }, function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-NotificationsDAO.js at serviceProviderDeleteNotification', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.nModified >= 1) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPNotifications, id: tokenDecodedData.iss, value: 'SP UserID: '+tokenDecodedData.ua }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  setSupplierNotificationTokenData: function (resNotifyObj, spResObj, ntyUserData, notificationObj, mobileNumber, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var supNotifObj = new SP_Notifications({
      spUserId: resNotifyObj.spUserId,
      spName: resNotifyObj.spName,
      spServiceProvider: resNotifyObj.sp,
      spServiceProviderId: resNotifyObj.spId,
      notificationTitle: notificationObj.title,
      notificationMessage: notificationObj.titleBody,
      notificationBody: ntyUserData,
      status: 'Unread',
      isDeleted: false,
      createdAt: currentUTC.currentUTCDateTimeNumber,
      createdBy: 'superadmin',
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: 'superadmin',
      updatedOn: currentUTC.currentUTCDateTimeString
    });
    supNotifObj.save(function (err, resObj) {
      AuditingInfoDAO.spAuditing({}, 'Create', {name: config.collectionSPNotifications, id: resObj._id, value: resObj.notificationTitle }, resObj);
      // if(mobileNumber) {
      //   sendSMS.sendSMS(mobileNumber, notificationObj.titleBody, function(smsError, smsRes) {
      //     if(smsError) {
      //       logger.error('There was an Un-known Error in DAO/SP-NotificationsDAO.js at setSupplierNotificationTokenData - sendSMS:', smsError);
      //     }
      //   });
      //   sendSMS.sendWhatsApp(mobileNumber, notificationObj.titleBody, function(waResObj) {
      //     SP_Notifications.updateOne({_id: resObj._id}, {$set: {notifWhatsAppRes: waResObj}}, function(error, data) {});
      //   });
      // }
    });
    if(spResObj && (spResObj.deviceNotifyToken || spResObj && spResObj.nt) && (spResObj.preferences && spResObj.preferences.allowNotifications || spResObj.uprf.allowNotifications)) {
      CommonService.pushNotification(spResObj.deviceNotifyToken ? spResObj.deviceNotifyToken : spResObj.nt, notificationObj.title, notificationObj.titleBody);
    }
  }
}