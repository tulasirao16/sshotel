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
var EU_Bookings = require('../models/EU-Bookings');
var SP_NotificationsDAO = require('./SP-NotificationsDAO');
var EU_Users = require('../models/EU-Users');
var SP_Users = require('../models/SP-Users');
var EU_Notifications = require('../models/EU-Notifications');
var SP_Notifications = require('../models/SP-Notifications');

// --- Begin: AD-EndUsersBookingsHistoryDAO
module.exports = {
  // --- Begin:getADEUBookings
  getADEUBookings: function (pageNum, euUserId, bhType, searchString, callback) {
    var currentDay = moment().format('YYYY-MM-DD');
    var currentDayNumber = moment(currentDay).valueOf();
    var query = {}
    switch (bhType) {
      case 'all':
        query = {
          'euUserId': euUserId,
          'isDeleted': false,
          '$or': [
            { 'euName': { $regex: searchString, $options: 'i' } },
            { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
            { 'bookingCode': { $regex: searchString, $options: 'i' } },
            { 'bookingStatus': { $regex: searchString, $options: 'i' } },
            { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
            { 'euEmail': { $regex: searchString, $options: 'i' } },
            { 'spLocationObj.area': { $regex: searchString, $options: 'i' } }
          ]
        };
        break;
      case 'upcoming':
        query = {
          'euUserId': euUserId,
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
                { 'spLocationObj.area': { $regex: searchString, $options: 'i' } }
              ]
            }
          ]
        };
        break;
      case 'past':
        query = {
          'euUserId': euUserId,
          'isDeleted': false,
          'checkOutDateNumber': { '$lt': currentDayNumber },
          '$or': [
            { 'euName': { $regex: searchString, $options: 'i' } },
            { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
            { 'bookingCode': { $regex: searchString, $options: 'i' } },
            { 'bookingStatus': { $regex: searchString, $options: 'i' } },
            { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
            { 'euEmail': { $regex: searchString, $options: 'i' } },
            { 'spLocationObj.area': { $regex: searchString, $options: 'i' } }
          ]
        };
        break;
    }
    EU_Bookings.find(query)
    .populate('spPropertyInfoId')
    .populate('spPropertyId')
    .populate('euUserId')
      .skip((pageNum - 1) * 10).limit(10)
      .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-EndUsersBookingsHistoryDAO.js, at getADEUBookings:'+error);
          callback(error, { statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
          var bookingArray = [];
          resultArray.forEach(function (userObj) {
              var adUserObj = userObj;
              var euUserId = userObj.euUserId;
              var euUserDec = {
                  mobileNumber: userObj.euUserId.mobileNumber,
                  email: userObj.euUserId.email && userObj.euUserId.email.includes('@') ? userObj.euUserId.email : ''
              }
              var euUserIdObj = JSON.parse((JSON.stringify(euUserId) + JSON.stringify(euUserDec)).replace(/}{/g, ','))
              var decObj = {
                  euMobileNumber: userObj.euMobileNumber,
                  paymentMode: userObj.paymentMode ? CommonService.decrypt(userObj.paymentMode) : '',
                  paymentModeCode: userObj.paymentModeCode ? CommonService.decrypt(userObj.paymentModeCode) : '',
                  paymentStatus: userObj.paymentStatus,
                  euEmail: userObj.euEmail ? CommonService.decrypt(userObj.euEmail) : '',
                  paymentUrl: userObj.paymentUrl ? CommonService.decrypt(userObj.paymentUrl) : '',
                  paymentCode: userObj.paymentCode ? CommonService.decrypt(userObj.paymentCode) : ''                        
              };
              var resultObj = JSON.parse((JSON.stringify(adUserObj) + JSON.stringify(decObj) + JSON.stringify({euUserId: euUserIdObj})).replace(/}{/g, ','))
            bookingArray.push(resultObj)
          });
          EU_Bookings.countDocuments(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD-EndUsersBookingsHistoryDAO.js, at getADEUBookings - countDocuments:'+errorCount);
              var resultObj = { totalDocs: resultArray.length, bookingData: bookingArray };
              callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount, bookingData: bookingArray };
              callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
            } else {
              var resultObj = { totalDocs: resultArray.length, bookingData: bookingArray };
              callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
            }
          });
        } else {
          callback(error, { statusCode: '9997', result: {} });
        }
      });
  },
  // --- End:getADEUBookings

  // --- Begin putADEndUserBookingData:
  putADEndUserBookingData: function (reqBody, recordId, putBookingObj, tokenDecodedData, callback) {
    EU_Bookings.findOneAndUpdate({ '_id': recordId, 'bookingCode': reqBody.bookingCode, 'isDeleted': false, }, { $set: putBookingObj }, { new: true }).populate("spServiceProviderId").exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-EndUsersBookingsHistoryDAO.js'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        var adEuBookingObj = resObj;
        var decObj = {
          euMobileNumber: resObj.euMobileNumber,
          paymentStatus: resObj.paymentStatus,
          euEmail: resObj.euEmail ? CommonService.decrypt(resObj.euEmail) : '',
          paymentMode: resObj.paymentMode ? CommonService.decrypt(resObj.paymentMode) : '',
          paymentModeCode: resObj.paymentModeCode ? CommonService.decrypt(resObj.paymentModeCode) : '',
          paymentUrl: resObj.paymentUrl ? CommonService.decrypt(resObj.paymentUrl) : '',
          paymentCode: resObj.paymentCode ? CommonService.decrypt(resObj.paymentCode) : ''
        };
        var resultObj = JSON.parse((JSON.stringify(adEuBookingObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
        EU_Users.find({ '_id': resultObj.euUserId, 'isDeleted': false }, function (uError, uResObj) {
          if (uError) {
            logger.error('There was an Error occured in daos/AD-EndUsersBookingsHistoryDAO.js at putADEndUserBookingData'+uError);
          } else if (uResObj && uResObj[0]._id) {
            let notificationObj = {
              title: 'Room ' + resultObj.bookingStatus,
              titleBody: 'Hi ' + resultObj.euName + 'You Updated the booking details for ' + resultObj.spPropertyTitle + ' from ' + moment(resultObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resultObj.checkOutDate).format('MMM DD, YYYY h:mm A') + '.\n' + 'Booking Code : ' + resultObj.bookingCode + '.\n' + 'Contact : ' + resultObj.spLocationObj.mobileNumber
            };
            let ntyUserObj = { recordId: resultObj._id, type: 'Booking', spContact: resultObj.spLocationObj ? resultObj.spLocationObj.mobileNumber : '' }
            setEndUserBookingNotificationTokenData(resultObj, uResObj, ntyUserObj, notificationObj, tokenDecodedData.umn ? tokenDecodedData.umn : '');
          } else {
            logger.error('No User found for send notification in daos/AD-EndUsersBookingsHistoryDAO.js at putADEndUserBookingData');
          }
        });
        SP_Users.findOne({ 'spServiceProviderId': resultObj.spServiceProviderId, userType: 'Owner', 'isDeleted': false }, function (spError, spResObj) {
          if (spError) {
            logger.error('There was an Error occured in daos/AD-EndUsersBookingsHistoryDAO.js at putADEndUserBookingData' + spError);
          } else if (spResObj && spResObj._id) {
            var ntyObj = {
              spId: spResObj.spServiceProviderId,
              sp: spResObj.spServiceProvider,
              spUserId: spResObj._id,
              spName: spResObj.name
            };
            let notificationObj = { title: 'Booking' + ' ' + resultObj.bookingStatus, titleBody: 'You Updated the booking details for ' + resultObj.spPropertyTitle + ' from ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + '.\n' + 'Booking Code : ' + resObj.bookingCode + '.\n' + 'Booking Contact : ' + resObj.euMobileNumber }
            let ntyUserData = { recordId: resultObj._id, type: 'Booking', contact: resultObj.euMobileNumber }
            SP_NotificationsDAO.setSupplierNotificationTokenData(ntyObj, spResObj, ntyUserData, notificationObj, resObj.spLocationObj ? resObj.spLocationObj.mobileNumber : '', function (notifyResObj) { });
          } else {
            logger.error('No User found for send notification in daos/AD-EndUsersBookingsHistoryDAO.js at putADEndUserBookingData');
          }
        });
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserBookings, id: resObj.recordId, value: resObj.bookingCode }, putBookingObj);
        callback({ httpCode: 200, statusCode: '0000', result: resultObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End putADEndUserBookingData: 

  // --- Begin postADEndUserBookingLifeCycle:
  postADEndUserBookingLifeCycle: function (bookingLifeCycleObj, bookingCode, tokenDecodedData, callback) {
    bookingLifeCycleObj.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-EndUsersBookingsHistoryDAO.js at postADEndUserBookingLifeCycle' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', { name: config.collectionEndUserBookingLifeCycle, id: resObj._id, value: bookingCode }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End postADEndUserBookingLifeCycle: 
}

// --- End: AD-EndUsersBookingsHistoryDAO


/**
 * 
 * @param {object} item 
 * @param {object} userData 
 * @param {object} ntyUserObj
 * @param {object} notificationObj 
 */
function setEndUserBookingNotificationTokenData(item, userData, ntyUserObj, notificationObj) {
  var currentUTC = CommonService.currentUTCObj();
  var userNotifObj = new EU_Notifications({
    euUserId: item.euUserId,
    euName: item.euName,
    notificationTitle: notificationObj.title,
    notificationMessage: notificationObj.titleBody,
    notificationBody: ntyUserObj,
    status: 'Unread',
    isDeleted: false,
    createdBy: item.createdBy,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedBy: item.updatedBy,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedOn: currentUTC.currentUTCDateTimeString
  });
  userNotifObj.save(function (err, resObj) {
    AuditingInfoDAO.adAuditing({ iss: item.euUserId, ua: item.createdBy, un: item.euName }, 'Create', { name: config.collectionEndUserNotifications, id: resObj._id, value: resObj.notificationTitle }, resObj);
  });
  if (userData && userData[0].deviceNotifyToken && userData[0].preferences.allowNotifications) {
    CommonService.pushNotification(userData[0].deviceNotifyToken, notificationObj.title, notificationObj.titleBody);
  }
}
