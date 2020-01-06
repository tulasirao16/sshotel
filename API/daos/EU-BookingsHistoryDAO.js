/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var moment = require('moment');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var SP_NotificationsService = require('../services/SP-NotificationsService')
var EU_Bookings = require('../models/EU-Bookings');
var EU_Notifications = require('../models/EU-Notifications');
var SpPropertyInfo = require('../models/SP-PropertyInfo');
var sendSMS = require('../config/sendSMS');

module.exports = {
    //Begin EU-Bookings DAO
  getEndUsersBookings:function(dataType, searchString, tokendecodeddata, callback) {
    var currentDay = moment().format('YYYY-MM-DD');
    var currentDayNumber = moment(currentDay).valueOf();
    switch(dataType) {
      case 'all' : 
        var query = {
          'euUserId': tokendecodeddata.iss,
          'isDeleted': false,
          '$or': [
            { 'spServiceProvider': {$regex: searchString, $options: 'i'}},
            { 'spPropertyTitle': { $regex: searchString, $options: 'i' }},
            { 'bookingStatus': { $regex: searchString, $options: 'i' }}
          ]
        };
        break;
      case 'Booked':
        var query = {
          'euUserId': tokendecodeddata.iss,
          'isDeleted': false,
          '$and': [{'$or': [
              { 'checkInDateNumber': { '$gte': currentDayNumber } },
              { 'checkInDateNumber': { '$lte': currentDayNumber }, 'checkOutDateNumber': { '$gte': currentDayNumber } }
            ]},
            {'$or': [
              {'spServiceProvider': {$regex: searchString, $options: 'i'}},
              { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
              { 'bookingStatus': { $regex: searchString, $options: 'i' } }
            ]}
          ]
        };
        break;
      case 'Completed':
        var query = {
          'euUserId': tokendecodeddata.iss,
          'isDeleted': false,
          'checkOutDateNumber': { '$lt': currentDayNumber },
          '$or': [
            { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
            { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
            { 'bookingStatus': { $regex: searchString, $options: 'i' } }
          ]
        };
        break;
    }
    EU_Bookings.find(query).populate('spPropertyInfoId').populate('spPropertyId')
    .sort({'createdAt': -1}).exec(function(error, data) {
      if(error) {
        logger.error('There was an Error occured in daos/EU-BookingsHistoryDAO.js, at getEndUsersBookings:'+ error);
        callback(error,{ httpCode: 500, statusCode: '9999', result: {}});
      } else if(data && data.length > 0) {
        callback(error, { httpCode: 200, statusCode: '0000', result: data});
      } else {
        callback(error, {httpCode: 400, statusCode: '9997', result: {}});
      }
    });
  },
  getEUBookings: function (pageNum, status, searchString, tokenDecodedData, callback) {
    var currentDay = moment().format('YYYY-MM-DD');
    var currentDayNumber = moment(currentDay).valueOf();
    switch (status) {
      case 'all':
        var query = {
          'euUserId': tokenDecodedData.iss,
          'isDeleted': false,
          '$or': [
            { 'euName': { $regex: searchString, $options: 'i' } },
            { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
            { 'bookingCode': { $regex: searchString, $options: 'i' } },
            { 'bookingStatus': { $regex: searchString, $options: 'i' } },
            { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
            { 'euEmail': { $regex: searchString, $options: 'i' } },
            { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
            { 'spLocationObj.city': { $regex: searchString, $options: 'i' } },
            { 'checkInDate': { $regex: searchString, $options: 'i' } },
            { 'checkOutDate': { $regex: searchString, $options: 'i' } }
          ]
        };
        break;
      case 'Booked':
        var query = {
          'euUserId': tokenDecodedData.iss,
          'isDeleted': false,
          '$and': [
            {
              '$or': [
                { 'checkInDateNumber': { '$gte': currentDayNumber } },
                { 'checkInDateNumber': { '$lte': currentDayNumber }, 'checkOutDateNumber': { '$gte': currentDayNumber } }
              ]
            },
            {
              '$or': [
                { 'euName': { $regex: searchString, $options: 'i' } },
                { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
                { 'bookingCode': { $regex: searchString, $options: 'i' } },
                { 'bookingStatus': { $regex: searchString, $options: 'i' } },
                { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
                { 'euEmail': { $regex: searchString, $options: 'i' } },
                { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
                { 'spLocationObj.city': { $regex: searchString, $options: 'i' } },
                { 'checkInDate': { $regex: searchString, $options: 'i' } },
                { 'checkOutDate': { $regex: searchString, $options: 'i' } }
              ]
            }
          ]
        };
        break;
      case 'Completed':
        var query = {
          'euUserId': tokenDecodedData.iss,
          'isDeleted': false,
          'checkOutDateNumber': { '$lt': currentDayNumber },
          '$or': [
            { 'euName': { $regex: searchString, $options: 'i' } },
            { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
            { 'bookingCode': { $regex: searchString, $options: 'i' } },
            { 'bookingStatus': { $regex: searchString, $options: 'i' } },
            { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
            { 'euEmail': { $regex: searchString, $options: 'i' } },
            { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
            { 'spLocationObj.city': { $regex: searchString, $options: 'i' } },
            { 'checkInDate': { $regex: searchString, $options: 'i' } },
            { 'checkOutDate': { $regex: searchString, $options: 'i' } }
          ]
        };
        break;
    }
    EU_Bookings.find(query).populate('spPropertyInfoId')
    .skip((pageNum - 1) * 10).limit(10)
    .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/EU-BookingsHistoryDAO.js, at getEUBookings:' + error);
        callback(error, { statusCode: '9999', result: {} });
      } else if (resultArray && resultArray.length > 0) {
        // if (status == 'all') {
        //   var countQuery = {
        //     'euUserId': tokenDecodedData.iss,
        //     'isDeleted': false,
        //   }
        // } else if (status == 'Booked') {
        //   var countQuery = {
        //     'euUserId': tokenDecodedData.iss,
        //     'isDeleted': false,
        //     '$and': [{
        //       '$or': [
        //         { 'checkInDateNumber': { '$gte': currentDayNumber } },
        //         { 'checkInDateNumber': { '$lte': currentDayNumber }, 'checkOutDateNumber': { '$gte': currentDayNumber } }
        //       ]
        //     }]
        //   }
        // } else {
        //   var countQuery = {
        //     'euUserId': tokenDecodedData.iss,
        //     'isDeleted': false,
        //     'checkOutDateNumber': { '$lt': currentDayNumber }
        //   }
        // }
        EU_Bookings.countDocuments(query).exec(function (errorCount, resultCount) {
          if (errorCount) {
            logger.error('There was an Un-known Error occured in daos/EU-BookingsHistoryDAO.js, at getEUBookings - countDocuments:' + errorCount);
            var resultObj = { totalDocs: resultArray.length, bookingData: resultArray };
            callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
          } else if (resultCount) {
            var resultObj = { totalDocs: resultCount, bookingData: resultArray };
            callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
          } else {
            var resultObj = { totalDocs: resultArray.length, bookingData: resultArray };
            callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
          }
        });
      } else {
        callback(error, { statusCode: '9997', result: {} });
      }
    });
  },
  getEndUserBookingData: function (recordId, tokenDecodedData, callback) {
    let query = {
      '_id': recordId,
      'euUserId': tokenDecodedData.iss,
      'isDeleted': false
    }
    EU_Bookings.findOne(query).populate('spPropertyInfoId').populate('spPropertyId').exec(function (error, data) {
      if (error) {
        logger.error('There was an Un-Error occured in daos/EU-BookingsHistoryDAO.js at getEndUserBookingData' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (data && data._id) {
        callback({ httpCode: 200, statusCode: '0000', result: data });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  cancelEndUsersBookings: function (bookingID, tokendecodeddata, upcancelObj, callback) {
    EU_Bookings.findOneAndUpdate({ 'bookingCode': bookingID, 'euUserId': tokendecodeddata.iss }, { $set: upcancelObj },
    { new: true }).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-Error occured in daos/EU-BookingsHistoryDAO.js at cancelEndUsersBookings:'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.euAuditing(tokendecodeddata, 'Update', { name: config.collectionEndUserBookings, id: resObj._id, value: resObj.bookingCode }, upcancelObj);
        let notificationObj = {
          title: 'Booking Cancelled',
          // titleBody: 'Hi ' + resObj.euName + '.Your booking has beeen cancelled at ' + resObj.spPropertyTitle + ' from ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + '.\n' + 'Booking Code : ' + resObj.bookingCode + '.\n' + 'Contact : ' + resObj.spLocationObj.mobileNumber
          titleBody: 'Hi ' + resObj.euName + ', ' + 'Your booking has been Cancelled at ' + resObj.spPropertyTitle + ' from ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A')
        }
        setEndUserBookingNotificationTokenData(resObj, tokendecodeddata, { recordId: resObj._id, type: 'Booking', spContact: resObj.spLocationObj ? resObj.spLocationObj.mobileNumber : '', bookingCode: resObj.bookingCode ? resObj.bookingCode : '' }, notificationObj);
        SP_NotificationsService.sendSPNotificationForBooking(resObj, 'bookingCancel', function (nObj) { })
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  getSpPropertyInfo: function (spServiceProviderId, callback) {
    var query = {
      'spServiceProviderId': spServiceProviderId,
      'isDeleted': false,
    };
    SpPropertyInfo.findOne(query, { 'pricing': 1 }).exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-BookingsHistoryDAO.js at getSpPropertyInfo:' + error);
        callback(error, { httpCode: 500, statusCode: '9999', result: {} });
      } else if (data) {
        callback(error, { httpCode: 200, statusCode: '0000', result: data });
      } else {
        callback(error, { httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  getBookinData: function (bookingID, tokendecodeddata, callback) {
    var query = {
      'euUserId': tokendecodeddata.iss,
      'bookingCode': bookingID,
      'isDeleted': false,
    }
    EU_Bookings.findOne(query).exec(function (error, data) {
      if (error) {
        logger.error('There was an Un-Error occured in daos/EU-BookingsHistoryDAO.js at getBookinData:'
          , error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (data) {
        callback({ httpCode: 200, statusCode: '0000', result: data });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  }
}

function setEndUserBookingNotificationTokenData(item, tokenDecodedData, ntyBody, notificationObj) {
  var currentUTC = CommonService.currentUTCObj();
  var userNotifObj = new EU_Notifications({
    euUserId: item.euUserId,
    euName: item.euName,
    notificationTitle: notificationObj.title,
    notificationMessage: notificationObj.titleBody,
    notificationBody: ntyBody,
    status: 'Unread',
    isDeleted: false,
    createdBy: item.createdBy,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedBy: item.updatedBy,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedOn: currentUTC.currentUTCDateTimeString
  });
  userNotifObj.save(function (error, resObj) {
    AuditingInfoDAO.euAuditing(tokenDecodedData, 'Create', { name: config.collectionEndUserNotifications, id: resObj._id, value: resObj.notificationTitle }, resObj);
    // if(tokendecodeddata.umn) {
    //   sendSMS.sendSMS(tokendecodeddata.umn, notificationObj.titleBody, function(smsError, smsRes) {
    //     if(smsError) {
    //       logger.error('There was an Un-known Error in DAO/EU-BookingsHistoryDAO.js at setEndUserBookingNotificationTokenData - sendSMS:', smsError);
    //     }
    //   });
    //   sendSMS.sendWhatsApp(tokendecodeddata.umn, notificationObj.titleBody, function(waResObj) {
    //     EU_Notifications.updateOne({_id: resObj._id}, {$set: {notifWhatsAppRes: waResObj}}, function(error, data) {});
    //   });
    // }
  });
  if (tokenDecodedData && tokenDecodedData.nt && tokenDecodedData.uprf.allowNotifications) {
    CommonService.pushNotification(tokenDecodedData.nt, notificationObj.title, notificationObj.titleBody);
  }
}
