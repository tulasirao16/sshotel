/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var moment = require('moment');
var CommonService = require('../services/CommonService');
var SP_NotificationsDAO = require('../daos/SP-NotificationsDAO');
var SP_Properties = require('../models/SP-Properties');
var SP_Users = require('../models/SP-Users');


module.exports = {
  getSPNotifications: function (pageNumber, searchString, tokenDecodedData, callback) {
    SP_NotificationsDAO.getSPNotifications(pageNumber, searchString, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  getSPNotificationsUnReadCount: function (tokenDecodedData, callback) {
    SP_NotificationsDAO.getSPNotificationsUnReadCount(tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  updateSPNotificationUnReadToRead: function (tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      status: 'Read',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: 'superadmin',
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    SP_NotificationsDAO.updateSPNotificationUnReadToRead(updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  serviceProviderDeleteNotification: function (notifyIDs, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: 'superadmin',
      updatedOn: currentUTC.currentUTCDateTimeString,
      isDeleted: true
    };
    SP_NotificationsDAO.serviceProviderDeleteNotification(notifyIDs, updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  sendSPNotificationForBooking: function(resObj, type, callback) {
    SP_Properties.findOne({'_id': resObj.spPropertyId, 'isDeleted': false}, { 'createdById': 1 }, function(pError, pResObj) {
      if (pError) {
        logger.error('There was an Error occured in daos/SP-NotificationsService.js at SP_Properties', pError);
      } else if(pResObj && pResObj.createdById) {
        var query = {
          '_id': pResObj.createdById,
          'userStatus': 'Active',
          'isDeleted': false
        };
        SP_Users.findOne(query, function(spError, spResObj) {
          if (spError) {
            logger.error('There was an Error occured in daos/SP-NotificationsService.js at SP_Users error', spError);
          } else if (spResObj) {
            var ntyObj = {
              spId: spResObj._id,
              name: spResObj.name
            };
            let notificationObj = {};
            if(type === 'success') {
              // notificationObj = {title: 'Booking Payment Confirmed', titleBody: 'You have a Booking at' + ' ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle + '.\n' + 'Booking Code : ' + resObj.bookingCode + '.\n' + 'Booking Contact : ' + resObj.euMobileNumber }
              notificationObj = {title: 'Booking Payment Confirmed', titleBody: 'You have a Booking at' + ' ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle }
            } else if(type === 'fail') {
              // notificationObj = {title: 'Booking Payment Failed', titleBody: 'You have a Booking at' + ' ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle + '.\n' + 'Booking Code : ' + resObj.bookingCode + '.\n' + 'Booking Contact : ' + resObj.euMobileNumber }
              notificationObj = {title: 'Booking Payment Failed', titleBody: 'You have a Booking at' + ' ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle }
            }  else {
              // notificationObj = {title: 'Booking Cancelled', titleBody: 'Cancelled Booking at' + ' ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle + '.\n' + 'Booking Code : ' + resObj.bookingCode + '.\n' + 'Booking Contact : ' + resObj.euMobileNumber }
              notificationObj = {title: 'Booking Cancelled', titleBody: 'Cancelled Booking at' + ' ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle }
            }
            let ntyUserData = {recordId: resObj._id, type: 'Booking', contact: resObj.euMobileNumber, bookingCode: resObj.bookingCode }
            SP_NotificationsDAO.setSupplierNotificationTokenData(ntyObj, spResObj, ntyUserData, notificationObj, spResObj.mobileNumber, function(notifyResObj) {});
          } else {
            logger.error('There was an Error occured in daos/SP-NotificationsService.js at SP_Users');
          }
        });
      } else {
        logger.error('There was an Error occured in daos/SP-NotificationsService.js at get SP_Properties');
      }
    })
  }
};