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
var EU_Notifications = require('../models/EU-Notifications');
var SP_NotificationsDAO = require('./SP-NotificationsDAO');
var sendSMS = require('../config/sendSMS');

var SP_PropertyChildAmenities = require('../models/SP-PropertyChildAmenities');
var SP_PropertyChildServices = require('../models/SP-PropertyChildServices');
var EU_Bookings = require('../models/EU-Bookings');
var SP_Properties = require('../models/SP-Properties');
var SP_PropertyInfo = require('../models/SP-PropertyInfo');
var SP_propertyDocs = require('../models/SP-PropertyDocs');
var SP_Users = require('../models/SP-Users');
// var EU_Users = require('../models/EU-Users');

module.exports = {
  postEndUserBooking: function(bookingObj, tokenDecodedData, callback) {
    var bookData = new EU_Bookings(bookingObj);
    bookData.save(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-BookingsDAO.js', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        // if(tokenDecodedData) {
        let notificationObj = {
          title: 'Room ' + resObj.bookingStatus,
          // titleBody: 'Hi ' + resObj.euName + ', You have a booking on ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle + '.\n' + 'Booking Code : ' + resObj.bookingCode + '.\n' + 'Contact : ' + resObj.spLocationObj.mobileNumber 
          titleBody: 'Hi ' + resObj.euName + ', ' + 'You have a booking on ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle
        }
        setEndUserBookingNotificationTokenData(resObj, tokenDecodedData, {recordId: resObj._id, type: 'Booking', spContact: resObj.spLocationObj ? resObj.spLocationObj.mobileNumber : '', bookingCode: resObj.bookingCode ? resObj.bookingCode : ''  }, notificationObj, bookingObj && bookingObj.euMobileNumber ? bookingObj.euMobileNumber : '');
        SP_Properties.findOne({'_id': resObj.spPropertyId, 'isDeleted': false}, { 'createdById': 1 }, function(pError, pResObj) {
          if (pError) {
            logger.error('There was an Error occured in daos/EU-BookingsDAO.js at SP_Properties', pError);
          } else if(pResObj && pResObj.createdById) {
            var query = {
              '_id': pResObj.createdById,
              'userStatus': 'Active',
              'isDeleted': false
            };
            SP_Users.findOne(query, function(spError, spResObj) {
              if (spError) {
                logger.error('There was an Error occured in daos/EU-BookingsDAO.js at SP_Users error', spError);
              } else if (spResObj._id) {
                var ntyObj = {
                  spId: spResObj.spServiceProviderId,
                  sp: spResObj.spServiceProvider,
                  spUserId: spResObj._id,
                  spName: spResObj.name
                };
                // let notificationObj = {title: 'New Booking', titleBody: 'You have a Booking at' + ' ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle + '.\n' + 'Booking Code : ' + resObj.bookingCode + '.\n' + 'Booking Contact : ' + resObj.euMobileNumber }
                let notificationObj = {title: 'New Booking', titleBody: 'You have a Booking at' + ' ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle  }
                let ntyUserData = {recordId: resObj._id, type: 'Booking', contact: resObj.euMobileNumber,  bookingCode: resObj.bookingCode}
                SP_NotificationsDAO.setSupplierNotificationTokenData(ntyObj, spResObj, ntyUserData, notificationObj, resObj.spLocationObj ? resObj.spLocationObj.mobileNumber : '', function(notifyResObj) {});
              } else {
                logger.error('There was an Error occured in daos/EU-BookingsDAO.js at SP_Users');
              }
            });
          } else {
            logger.error('There was an Error occured in daos/EU-BookingsDAO.js at get SP_Properties');
          }
        });
        // }
        var bookingObj = resObj;
        var decObj = {
          paymentMode: resObj.paymentMode ? CommonService.decrypt(resObj.paymentMode) : '',
          paymentModeCode: resObj.paymentModeCode ? CommonService.decrypt(resObj.paymentModeCode) : '',
          paymentStatus: resObj.paymentStatus,
          paymentUrl: resObj.paymentUrl ? CommonService.decrypt(resObj.paymentUrl) : '',
          paymentCode: resObj.paymentCode ? CommonService.decrypt(resObj.paymentCode) : '',
          euMobileNumber: resObj.euMobileNumber,
          euEmail: resObj.euEmail ? CommonService.decrypt(resObj.euEmail) : '',
        };
        var resultObj = JSON.parse((JSON.stringify(bookingObj) + JSON.stringify(decObj)).replace(/}{/g, ','));

        AuditingInfoDAO.euAuditing(tokenDecodedData, 'Create', { name: config.collectionEndUserBookings, id: resultObj._id, value: resultObj.bookingCode }, resultObj);
        callback({httpCode: 200, statusCode: '0000', result: resultObj});
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  getPropertyInfo: function(propertyInfoId, callback) {
    SP_PropertyInfo.findOne({ '_id': propertyInfoId, 'isDeleted': false }, function(error, resObj) {
      callback(resObj)
     })
  },
  getSpPropertyAmenities: function(propertyId, callback) {
    var query = {
      'propertyInfoId': propertyId,
      'amenityStatus': 'Available',
      'isDeleted': false
    };
    SP_PropertyChildAmenities.find(query)
    .sort({'amenityOrder': 1})
    .exec(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-BookingsDAO.js', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else {
        SP_PropertyChildServices.find({ 'propertyInfoId': propertyId, 'serviceStatus': 'Available', 'isDeleted': false }, { 'serviceName': 1, 'serviceCharge': 1 }, function(sError, sResObj) {
          if (sError) {
            logger.error('There was an Error occured in daos/EU-BookingsDAO.js', sError);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else {
            var resultObj = {amenitiesData: resObj, servicesData: sResObj};
            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
          }
        });
      }
    });
  },
  getSpPropertyServices: function(propertyId, callback) {
    SP_PropertyChildServices.find({ 'propertyInfoId': propertyId, 'isDeleted': false }, { 'serviceName': 1, 'serviceCharge': 1 }, function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-BookingsDAO.js', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  getSpRoomsCount: function(reqObj, callback) {
    var utcMoment = moment.utc(reqObj.checkInDate);
    var checkIn = moment(utcMoment, 'YYYY-MM-DD HH:mm').valueOf();
    var checkInAdd = moment(utcMoment, 'YYYY-MM-DD').add(1, 'days').valueOf();
    var utcMoment1 = moment.utc(reqObj.checkOutDate);
    var checkOut = moment(utcMoment1, 'YYYY-MM-DD HH:mm').valueOf()
    var checkOutSub = moment(utcMoment1, 'YYYY-MM-DD').subtract(1, 'days').valueOf();
    var query = {
      'spPropertyInfoId': reqObj.spPropertyInfoId,
      'spServiceProviderId': reqObj.spServiceProviderId,
      'bookingStatus': {$nin: ['Cancelled', 'Completed']},
      '$or': [
        {'checkInDateNumber': {'$gte': checkIn, '$lte': checkOut}},
        {'checkOutDateNumber': {'$gte': checkIn, '$lte': checkOut}}
      ],
      'isDeleted': false
    };
    var query1 = {
      '_id': reqObj.spPropertyInfoId,
      'spServiceProviderId': reqObj.spServiceProviderId,
    };
    EU_Bookings.aggregate([
        { 
          $match: query 
        },
      {$group: {
        _id: null,
        count: {$sum: '$noOfRooms'}
      }}
    ]).exec(function(error, count) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-BookingsDAO.js', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else {
        SP_PropertyInfo.find(query1, { 'activeRoomsCount': 1 }, function(error, resObj) {
          if (error) {
            logger.error('There was an Error occured in daos/getSpPropertyServices.js', error);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if (resObj && resObj.length > 0) {
            var resultObj = { bookingCount: count && count.length > 0 ? count[0].count : 0, activeRoomsCount: resObj[0].activeRoomsCount };
            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
          } else {
            callback({ httpCode: 400, statusCode: '9997', result: {} });
          }
        });
      }
    });
  },

  getSpPropertyDocs: function(propertyId, callback) {
    SP_propertyDocs.find({ 'propertyId': propertyId, 'isDeleted': false }, { 'imagePath': 1, 'fileType': 1 }, function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-BookingsDAO.js', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },

  sendReminderNotificationBeforeDayToEndUser: function(dayQuery, callback) {
    EU_Bookings.find(dayQuery).populate('euUserId')
    .exec(function(dayError, dayResObj) {
      if (dayError) {
        logger.error('There was an Error occured in daos/EU-BookingsDAO.js at sendReminderNotificationBeforeDayToEndUser', dayError);
      } else if(dayResObj && dayResObj.length > 0) {
        setEndUserNotificationTokenData(dayResObj);
      } else {
        logger.error('No data found at daos/EU-BookingsDAO.js at sendReminderNotificationBeforeDayToEndUser');
      }
    });
  },

  sendReminderNotificationBeforeWeekToEndUser: function(weekQuery, callback) {
    EU_Bookings.find(weekQuery).populate('euUserId')
    .exec(function(weekError, weekResObj) {
      if (weekError) {
        logger.error('There was an Error occured in daos/EU-BookingsDAO.js at sendReminderNotificationBeforeWeekToEndUser', weekError);
      } else if(weekResObj && weekResObj.length > 0) {
        setEndUserNotificationTokenData(weekResObj);
      } else {
        logger.error('No data found at daos/EU-BookingsDAO.js at sendReminderNotificationBeforeWeekToEndUser');
      }
    });
  }

}

function setEndUserBookingNotificationTokenData(item, tokenDecodedData, ntyBody, notificationObj, euMobileNumber) {
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
  userNotifObj.save(function(error, resObj) {
    AuditingInfoDAO.euAuditing(tokenDecodedData, 'Create', { name: config.collectionEndUserNotifications, id: resObj._id, value: resObj.notificationTitle }, resObj);
    // if(euMobileNumber) {
    //   sendSMS.sendSMS(euMobileNumber, notificationObj.titleBody, function(smsError, smsRes) {
    //     if(smsError) {
    //       logger.error('There was an Un-known Error in DAO/EU-BookingsDAO.js at setEndUserBookingNotificationTokenData - sendSMS:', smsError);
    //     }
    //   });
    //   sendSMS.sendWhatsApp(euMobileNumber, notificationObj.titleBody, function(waResObj) {
    //     EU_Notifications.updateOne({_id: resObj._id}, {$set: {notifWhatsAppRes: waResObj}}, function(error, data) {});
    //   });
    // }
  });
  if(tokenDecodedData && tokenDecodedData.nt && tokenDecodedData.uprf.allowNotifications) {
    CommonService.pushNotification(tokenDecodedData.nt, notificationObj.title, notificationObj.titleBody);
  }
}

/**
 * @param {object} bookingData object
*/
function setEndUserNotificationTokenData(bookingData) {
  var currentUTC = CommonService.currentUTCObj();
  bookingData.forEach(item => {
    let notificationObj = {
      title: 'Reminder',
      // titleBody: 'Hi ' + item.euName + ' You have a booking on ' + moment(item.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(item.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + item.spPropertyTitle + '.\n' + 'Booking Code: ' + item.bookingCode + '.\n' + 'Contact : ' + item.spLocationObj.mobileNumber 
      titleBody: 'Hi ' + item.euName + ', ' + ' You have a booking on ' + moment(item.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(item.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + item.spPropertyTitle 
    }
    var ntyBody = {recordId: item._id, type: 'Booking', spContact: item.spLocationObj ? item.spLocationObj.mobileNumber : '', BookingCode: item.bookingCode ? item.bookingCode : '' }
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
    userNotifObj.save(function(error, resObj){
      AuditingInfoDAO.euAuditing({iss: item.euUserId, ua: item.createdBy, un: item.euName}, 'Create', { name: config.collectionEndUserNotifications, id: resObj._id, value: resObj.notificationTitle }, resObj);
    });
    if(item.euUserId && item.euUserId.deviceNotifyToken && item.euUserId.preferences.allowNotifications) {
      CommonService.pushNotification(item.euUserId.deviceNotifyToken, notificationObj.title, notificationObj.titleBody);
    }
  });  
}