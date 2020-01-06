/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var EU_Bookings = require('../models/EU-Bookings');
var EU_Users = require('../models/EU-Users');
var config = require('config');
var moment = require('moment');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var SP_NotificationsDAO = require('./SP-NotificationsDAO');
var EU_Notifications = require('../models/EU-Notifications');
var SP_Users = require('../models/SP-Users');

// --- Begin: AD-HostBookingsDAO
module.exports = {

  // --- Begin getSpPropertyInfo:  
  getSpPropertyInfo: function (bookingId, callback) {
    var query = {
      '_id': bookingId,
      'isDeleted': false,
    };
    EU_Bookings.findOne(query)
      .populate('spPropertyInfoId')
      .exec(function (error, data) {
        if (error) {
          logger.error('There was an Error occured in daos/AD-HostBookingsDAO.js,', error);
          callback(error, { httpCode: 500, statusCode: '9999', result: {} });
        } else if (data) {
          callback(error, { httpCode: 200, statusCode: '0000', result: data });
        } else {
          callback(error, { httpCode: 400, statusCode: '9997', result: {} });
        }
      });
    // --- End getSpPropertyInfo:  
  },
  // --- Begin confirmCancelBooking Booking:
  confirmCancelBooking: function (reqBody, cancelBookingObj, tokenDecodedData, callback) {
    EU_Bookings.findOneAndUpdate({ '_id': reqBody.bookingId, 'isDeleted': false }, { $set: cancelBookingObj }, { new: true }, function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostBookingsDAO.js at confirmCancelBooking:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        if (tokenDecodedData) {
          var spBookingObj = resObj;
          var decObj = {
            euMobileNumber: resObj.euMobileNumber,
            paymentStatus: resObj.paymentStatus,
            euEmail: resObj.euEmail ? CommonService.decrypt(resObj.euEmail) : '',
            paymentMode: resObj.paymentMode ? CommonService.decrypt(resObj.paymentMode) : '',
            paymentModeCode: resObj.paymentModeCode ? CommonService.decrypt(resObj.paymentModeCode) : '',
            paymentUrl: resObj.paymentUrl ? CommonService.decrypt(resObj.paymentUrl) : '',
            paymentCode: resObj.paymentCode ? CommonService.decrypt(resObj.paymentCode) : ''
          };
          var resultObj = JSON.parse((JSON.stringify(spBookingObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
          EU_Users.find({ '_id': resultObj.euUserId, 'isDeleted': false }, function (uError, uResObj) {
            if (error) {
              logger.error('There was an Error occured in daos/AD-HostBookingsDAO.js at confirmCancelBooking', uError);
            } else if (uResObj && uResObj[0]._id) {
              let notificationObj = {
                title: 'Booking Cancelled',
                titleBody: 'Hi ' + resultObj.euName + 'Your booking has beeen cancelled at' + resultObj.spPropertyTitle + ' from ' + moment(resultObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resultObj.checkOutDate).format('MMM DD, YYYY h:mm A') + '.\n' + 'Booking Code : ' + resultObj.bookingCode + '.\n' + 'Contact : ' + resultObj.spLocationObj.mobileNumber
              };
              let ntyUserObj = { recordId: resultObj._id, type: 'Booking', spContact: resultObj.spLocationObj ? resultObj.spLocationObj.mobileNumber : '' }
              setEndUserBookingNotificationTokenData(resultObj, uResObj, ntyUserObj, notificationObj, tokenDecodedData.umn ? tokenDecodedData.umn : '');
            } else {
              logger.error('No User found for send notification in daos/AD-HostBookingsDAO.js at confirmCancelBooking');
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
        }
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserBookings, id: resObj._id, value: resObj.bookingCode }, cancelBookingObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End confirmCancelBooking Booking:

  // --- Begin putEndUserBookingData:
  putEndUserBookingData: function(reqBody, putBookingObj, tokenDecodedData, callback) {
    EU_Bookings.findOneAndUpdate({'bookingCode': reqBody.bookingCode, 'isDeleted': false}, {$set: putBookingObj}, {new: true}, function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostBookingsDAO.js at putEndUserBookingData: ' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        var spBookingObj = resObj;
        var decObj = {
          euMobileNumber: resObj.euMobileNumber,
          paymentStatus: resObj.paymentStatus,
          euEmail: resObj.euEmail ? CommonService.decrypt(resObj.euEmail) : '',
          paymentMode: resObj.paymentMode ? CommonService.decrypt(resObj.paymentMode) : '',
          paymentModeCode: resObj.paymentModeCode ? CommonService.decrypt(resObj.paymentModeCode) : '',
          paymentUrl: resObj.paymentUrl ? CommonService.decrypt(resObj.paymentUrl) : '',
          paymentCode: resObj.paymentCode ? CommonService.decrypt(resObj.paymentCode) : ''
        };
        var resultObj = JSON.parse((JSON.stringify(spBookingObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
        EU_Users.find({'_id': resultObj.euUserId, 'isDeleted': false}, function(uError, uResObj) {
          if (uError) {
            logger.error('There was an Error occured in daos/AD-HostBookingsDAO.js at putEndUserBookingData'+ uError);
          } else if(uResObj && uResObj[0]._id) {
            let notificationObj = {
              title: 'Room ' + resultObj.bookingStatus,
              // titleBody: 'Hi ' + resultObj.euName + 'You Updated the booking details for ' + resultObj.spPropertyTitle + ' from ' +  moment(resultObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resultObj.checkOutDate).format('MMM DD, YYYY h:mm A') + '.\n' + 'Booking Code : ' + resultObj.bookingCode + '.\n' + 'Contact : ' + resultObj.spLocationObj.mobileNumber 
              titleBody: 'Hi ' + resultObj.euName + ', ' + 'You Updated the booking details for ' + resultObj.spPropertyTitle + ' from ' +  moment(resultObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resultObj.checkOutDate).format('MMM DD, YYYY h:mm A') 
            };
            let ntyUserObj = {recordId: resultObj._id, type: 'Booking', spContact: resultObj.spLocationObj ? resultObj.spLocationObj.mobileNumber : '', bookingCode: resultObj.bookingCode ? resultObj.bookingCode : ''  }  
            setEndUserBookingNotificationTokenData(resultObj, uResObj, ntyUserObj, notificationObj, tokenDecodedData.umn ? tokenDecodedData.umn : '' );
          } else {
            logger.error('No User found for send notification in daos/AD-HostBookingsDAO.js at putEndUserBookingData');
          }
        });
        if(tokenDecodedData) {
          var ntyObj = {
            spId: tokenDecodedData.uspid,
            sp: tokenDecodedData.usp,
            spUserId: tokenDecodedData.iss,
            spName: tokenDecodedData.un
          };
          // let notificationObj = {title: 'Booking' + ' ' + resultObj.bookingStatus, titleBody: 'You Updated the booking details for ' + resultObj.spPropertyTitle + ' from ' +  moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + '.\n' + 'Booking Code : ' + resObj.bookingCode + '.\n' + 'Booking Contact : ' + resObj.euMobileNumber }
          let notificationObj = {title: 'Booking' + ' ' + resultObj.bookingStatus, titleBody: 'You Updated the booking details for ' + resultObj.spPropertyTitle + ' from ' +  moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') }
          let ntyUserData = {recordId: resultObj._id, type: 'Booking', contact: resultObj.euMobileNumber, bookingCode: resultObj.bookingCode }
          SP_NotificationsDAO.setSupplierNotificationTokenData(ntyObj, tokenDecodedData, ntyUserData, notificationObj, resultObj.spLocationObj ? resultObj.spLocationObj.mobileNumber : '', function(notifyResObj) {});
        }
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionEndUserBookings, id: resObj._id, value: resObj.bookingCode }, putBookingObj);
        callback({ httpCode: 200, statusCode: '0000', result: resultObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End putEndUserBookingData:  
  // --- Begin postEndUserBookingLifeCycle:
  postEndUserBookingLifeCycle: function (bookingLifeCycleObj, bookingCode, tokenDecodedData, callback) {
    bookingLifeCycleObj.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostBookingsDAO.js', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', { name: config.collectionEndUserBookingLifeCycle, id: resObj._id, value: bookingCode }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End postEndUserBookingLifeCycle:

  // --- Begin: getADBookingData
  getADBookingData: function (recordId, tokenDecodedData, callback) {
    let query = {
      '_id': recordId,
      'spServiceProviderId': tokenDecodedData.uspid,
      'isDeleted': false
    }
    EU_Bookings.findOne(query)
      .populate('spPropertyId')
      .populate('euUserId')
      .populate('spPropertyInfoId')
      .exec(function (error, data) {
        if (error) {
          logger.error('There was an Error occured in daos/AD-HostBookingsDAO.js at getADBookingData', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (data && data._id) {
          var bookingObj = data;
          var decObj = {
            euMobileNumber: data.euMobileNumber,
            euEmail: data.euEmail ? CommonService.decrypt(data.euEmail) : '',
            paymentMode: data.alternateContactNumber ? CommonService.decrypt(data.paymentMode) : '',
            paymentModeCode: data.alternateEmail ? CommonService.decrypt(data.paymentModeCode) : '',
            paymentStatus: data.paymentStatus,
            paymentUrl: data.paymentUrl ? CommonService.decrypt(data.paymentUrl) : '',
            paymentCode: data.paymentCode ? CommonService.decrypt(data.paymentCode) : ''
          };
          var resultObj = JSON.parse((JSON.stringify(bookingObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
          callback({ httpCode: 200, statusCode: '0000', result: resultObj });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },
  // --- End: getADBookingData

  // Begin: getADHostBookingsList
  getADHostBookingsList: function (spid,recordId, pageNumber, searchString, tokendecodedData, callback) {
    var query = {
      spServiceProviderId: spid,
      isDeleted: false,
      bookingStatus: { "$nin": ['Cancelled'] },
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'bookingCode': { $regex: searchString, $options: 'i' } },
        { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
        { 'euName': { $regex: searchString, $options: 'i' } },
        { 'euEmail': { $regex: searchString, $options: 'i' } }
      ]
    };
    EU_Bookings.find(query)
      .populate('spPropertyId')
      .populate('spPropertyInfoId')
      .populate('euUserId')
      .skip((pageNumber - 1) * 10)
      .limit(10)
      .exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-HostBookingsDAO.js, at getADHostBookingsList:' + error);
          callback(error, { statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
          var bookingArray = [];
          resultArray.forEach(function (bookObj) {
            var userObj = bookObj.euUserId;
            var decUserObj = {
              mobileNumber: bookObj.euUserId.mobileNumber,
              email: bookObj.euUserId.email,
              alternateContactNumber: bookObj.euUserId.alternateContactNumber ? CommonService.decrypt(bookObj.euUserId.alternateContactNumber) : '',
              alternateEmail: bookObj.euUserId.alternateEmail ? CommonService.decrypt(bookObj.euUserId.alternateEmail) : '',
            };
            var modifiedUserObj = JSON.parse((JSON.stringify(userObj) + JSON.stringify(decUserObj)).replace(/}{/g, ','))
            var bookingObj = bookObj;
            var decObj = {
              euMobileNumber: bookObj.euMobileNumber,
              paymentStatus: bookObj.paymentStatus,
              euEmail: bookObj.euEmail ? CommonService.decrypt(bookObj.euEmail) : '',
              paymentMode: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
              paymentModeCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
              paymentUrl: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
              paymentCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
              euUserId: modifiedUserObj
            };
            var resultObj = JSON.parse((JSON.stringify(bookingObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
            bookingArray.push(resultObj)
          });
          EU_Bookings.find(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD-HostBookingsDAO.js, at getADHostBookingsList:', errorCount);
              var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
              callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount.length, bookingsData: bookingArray };
              callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
            } else {
              var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
              callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
            }
          });
        } else {
          callback(error, { httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },
  // End: getADHostBookingsList

  // Begin: getADHostBookings
  getADHostBookings: function (spid, recordId, pageNumber, searchString, tokendecodedData, callback) {
    var query = {
      spPropertyId: recordId,
      spServiceProviderId: spid,
      isDeleted: false,
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'bookingCode': { $regex: searchString, $options: 'i' } },
        { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
        { 'euName': { $regex: searchString, $options: 'i' } },
        { 'euEmail': { $regex: searchString, $options: 'i' } },
        { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
        { 'bookingStatus': { $regex: searchString, $options: 'i' } }
      ]
    };
    EU_Bookings.find(query)
      .populate('spPropertyId')
      .populate('spServiceProviderId')
      .populate('spPropertyInfoId')
      .populate('euUserId')
      .skip((pageNumber - 1) * 10)
      .limit(10)
      .sort({ 'createdAt': -1 })
      .exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-HostBookingsDAO.js, at getADHostBookings:' + error);
          callback(error, { statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
          var bookingArray = [];
          resultArray.forEach(function (bookObj) {
            var userObj = bookObj.euUserId;
            var decUserObj = {
              mobileNumber: bookObj.euUserId.mobileNumber,
              email: bookObj.euUserId.email,
              alternateContactNumber: bookObj.euUserId.alternateContactNumber ? CommonService.decrypt(bookObj.euUserId.alternateContactNumber) : '',
              alternateEmail: bookObj.euUserId.alternateEmail ? CommonService.decrypt(bookObj.euUserId.alternateEmail) : '',
            };
            var modifiedUserObj = JSON.parse((JSON.stringify(userObj) + JSON.stringify(decUserObj)).replace(/}{/g, ','))
            var bookingObj = bookObj;
            var decObj = {
              euMobileNumber: bookObj.euMobileNumber,
              paymentStatus: bookObj.paymentStatus,
              euEmail: bookObj.euEmail ? CommonService.decrypt(bookObj.euEmail) : '',
              paymentMode: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
              paymentModeCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
              paymentUrl: bookObj.paymentMode ? CommonService.decrypt(bookObj.paymentMode) : '',
              paymentCode: bookObj.paymentModeCode ? CommonService.decrypt(bookObj.paymentModeCode) : '',
              euUserId: modifiedUserObj
            };
            var resultObj = JSON.parse((JSON.stringify(bookingObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
            bookingArray.push(resultObj)
          });
          EU_Bookings.find(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD-HostBookingsDAO.js, at getADHostBookings:', errorCount);
              var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
              callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount.length, bookingsData: bookingArray };
              callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
            } else {
              var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
              callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
            }
          });
        } else {
          callback(error, { httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  }
  // End: getADHostBookings

}
// --- End: AD-HostBookingsDAO

/**
 * 
 * @param {object} item 
 * @param {object} tokenDecodedData 
 * @param {object} ntyUserObj
 * @param {object} notificationObj 
 */
function setEndUserBookingNotificationTokenData(item, userData, ntyUserObj, notificationObj, euMobileNumber) {
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
    //   if(euMobileNumber) {
    //     sendSMS.sendSMS(euMobileNumber, notificationObj.titleBody, function(smsError, smsRes) {
    //   if(smsError) {
    //       logger.error('There was an Un-known Error in DAO/AD-HostBookingsDAO.js at setEndUserBookingNotificationTokenData - sendSMS:', smsError);
    //   }
    // });
    // }
  });
  if (userData && userData[0].deviceNotifyToken && userData[0].preferences.allowNotifications) {
    CommonService.pushNotification(userData[0].deviceNotifyToken, notificationObj.title, notificationObj.titleBody);
  }
}

