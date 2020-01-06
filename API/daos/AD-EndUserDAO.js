/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var EU_Users = require('../models/EU-Users');
var EU_NotificationsDAO = require('../daos/EU-NotificationsDAO');
var EU_Bookings = require('../models/EU-Bookings');
var EU_Messages = require('../models/EU-Messages')
var EU_ReviewRatings = require('../models/EU-ReviewRatings')
var EU_Notifications = require('../models/EU-Notifications')
// --- Begin: AD-EndUserDAO
module.exports = {
  // --- Begin getADEndUserListDataBySearch
  getADEndUserListDataBySearch: function (pageNum, searchString, callback) {
    var query = {
      'isDeleted': false,
      '$or': [
        { 'displayName': { $regex: searchString, $options: 'i' } },
        { 'firstName': { $regex: searchString, $options: 'i' } },
        { 'lastName': { $regex: searchString, $options: 'i' } },
        { 'name': { $regex: searchString, $options: 'i' } },
        { 'dob': { $regex: searchString, $options: 'i' } },
        { 'area': { $regex: searchString, $options: 'i' } },
        { 'zip': { $regex: searchString, $options: 'i' } },
        { 'city': { $regex: searchString, $options: 'i' } },
        { 'userAccount': { $regex: searchString, $options: 'i' } },
        { 'mobileNumber': { $regex: searchString, $options: 'i' } },
        { 'email': { $regex: searchString, $options: 'i' } },
        { 'userStatus': { $regex: searchString, $options: 'i' } },
      ]
    };
    EU_Users.find(query)
      .skip((pageNum - 1) * 20)
      .limit(20)
      .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getADEndUserListDataBySearch:'+ error);
          callback({ httpCode: 500, statusCode: '9999', result: [] });
        } else if (resultArray && resultArray.length > 0) {
          var userArray = [];
          resultArray.forEach(function (userObj) {
            var adUserObj = userObj;
            var decObj = {
              mobileNumber: userObj.mobileNumber,
              email: userObj.email,
              alternateContactNumber: userObj.alternateContactNumber ? CommonService.decrypt(userObj.alternateContactNumber) : '',
              alternateEmail: userObj.alternateEmail ? CommonService.decrypt(userObj.alternateEmail) : '',
            };
            var resultObj = JSON.parse((JSON.stringify(adUserObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
            userArray.push(resultObj)
          });
          EU_Users.countDocuments(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getADEndUserListDataBySearch:'+ errorCount);
              var resultObj = { totalDocs: userArray.length, userData: userArray };
              callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount, userData: userArray };
              callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            } else {
              var resultObj = { totalDocs: userArray.length, userData: userArray };
              callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            }
          });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: [] });
        }
      });
  },
  // --- End  getADEndUserListDataBySearch

  // --- Begin getADEndUserListingData:
  getADEndUserListingData: function(pageNum, searchString, tokenDecodedData, callback) {
    var query = {
      'isDeleted': false,
      '$or': [
        { 'displayName': { $regex: searchString, $options: 'i' } },
        { 'firstName': { $regex: searchString, $options: 'i' } },
        { 'lastName': { $regex: searchString, $options: 'i' } },
        { 'name': { $regex: searchString, $options: 'i' } },
        { 'dob': { $regex: searchString, $options: 'i' } },
        { 'area': { $regex: searchString, $options: 'i' } },
        { 'zip': { $regex: searchString, $options: 'i' } },
        { 'city': { $regex: searchString, $options: 'i' } },
        { 'userAccount': { $regex: searchString, $options: 'i' } },
        { 'mobileNumber': { $regex: searchString, $options: 'i' } },
        { 'email': { $regex: searchString, $options: 'i' } },
        { 'userStatus': { $regex: searchString, $options: 'i' } },
      ]
    };
    EU_Users.find(query)
    .skip((pageNum - 1) * 20)
    .limit(20)
    .sort({ 'createdAt': -1 }).exec(function(error, resultArray) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getADEndUserListingData:'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resultArray && resultArray.length > 0) {
        var userArray = [];
        resultArray.forEach(function (userObj) {
          var adUserObj = userObj;
          var decObj = {
            mobileNumber: userObj.mobileNumber,
            email: userObj.email,
            alternateContactNumber: userObj.alternateContactNumber ? CommonService.decrypt(userObj.alternateContactNumber) : '',
            alternateEmail: userObj.alternateEmail ? CommonService.decrypt(userObj.alternateEmail) : '',
          };
          var resultObj = JSON.parse((JSON.stringify(adUserObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
          userArray.push(resultObj)
        });
        EU_Users.countDocuments(query).exec(function(errorCount, resultCount) {
          if(errorCount) {
            logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getADEndUserListingData:'+ errorCount);
            var resultObj = { totalDocs: userArray.length, userData: userArray };
            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
          } else if(resultCount) {
            var resultObj = { totalDocs: resultCount, userData: userArray };
            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
          } else {
            var resultObj = { totalDocs: userArray.length, userData: userArray };
            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
          }
        });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // --- End getADEndUserListingData:

  // --- Begin updateADEndUserStatus:
  updateADEndUserStatus: function (upObj, recordID, tokenDecodedData, callback) {
    var query = { _id: recordID, isDeleted: false };
    EU_Users.findOneAndUpdate(query, { $set: upObj }, { new: true }, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-konwn Error occured in daos/AD-EndUserDAO.js, at updateADEndUserStatus:'+ error);
        callback({ httpCode: 400, statusCode: '9900', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserUsers, id: resObj._id, value: resObj.userAccount }, upObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End updateADEndUserStatus:

 // --- Begin postADEndUserData: 
 postADEndUserData: function (userData, tokenDecodedData, callback) {
  userData.save(function (error, resObj) {
    if (error) {
      if (error.errmsg.indexOf('mobileNumber_1') > 0) {
        logger.error('There was an Uniqueness(mobileNumber) Error occured in daos/AD-EndUserDAO.js,'+
          ' at postADEndUserData:'+ error);
        callback({ httpCode: 400, statusCode: '9989', result: {} });
      } else if (error.errmsg.indexOf('email_1') > 0) {
        logger.error('There was an Uniqueness(email) Error occured in daos/AD-EndUserDAO.js,'+
          ' at postADEndUserData:'+ error);
        callback({ httpCode: 400, statusCode: '9988', result: {} });
      } else if (error.errmsg.indexOf('userAccount_1') > 0) {
        logger.error('There was an Uniqueness(userAccount) Error occured in daos/AD-EndUserDAO.js,'+
          ' at postADEndUserData:'+ error);
        callback({ httpCode: 400, statusCode: '9987', result: {} });
      } else {
        logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js,'+
          ' at postADEndUserData:'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    } else if (resObj && resObj._id) {
      var decObj = {
        mobileNumber: resObj.mobileNumber,
        email: resObj.email,
        alternateContactNumber: resObj.alternateContactNumber ? CommonService.decrypt(resObj.alternateContactNumber) : '',
        alternateEmail: resObj.alternateEmail ? CommonService.decrypt(resObj.alternateEmail) : ''
      }
      var resultObj = JSON.parse((JSON.stringify(resObj) + JSON.stringify(decObj)).replace(/}{/g, ','));
      AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', { name: config.collectionEndUserUsers, id: resObj._id, value: resObj.userAccount }, resObj);
      callback({ httpCode: 200, statusCode: '0000', result: resultObj });
    } else {
      callback({ httpCode: 400, statusCode: '9992', result: {} });
    }
  });
},
// --- End postADEndUserData:
// Begin: getSPHomeScreenBookingsCount
getADEUDashboardScreenBookingsCount: function (recordID,startUTCDateTimeNumber, tokendecodedData, callback) {
  EU_Bookings.aggregate([
     {
       $match: {
      euUserId: recordID, isDeleted: false
       }
     },
     {
       $group: {
         _id: '$bookingStatus',
         myCount: { $sum: 1 }
       }
     }
   ]).exec(function(error, bookingsData) {
     
     if (error) {
       logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPHomeScreenBookingsCount:', error);
       callback(error, { statusCode: '9999', result: [] });
     } else if (bookingsData && bookingsData.length > 0) {
       callback(error, {statusCode: '0000', result: bookingsData});
       
     } else {
       callback(error, {statusCode: '9997', result: []});
     }
   });
 },
 getADEUHomeScreenExpiredCount: function (recordID,startUTCDateTimeNumber1, tokendecodedData, callback) {
   EU_Bookings.aggregate([
      {
        $match: {
       euUserId: recordID, isDeleted: false,
       bookingStatus: { "$nin": ['Checked-In','Checked-Out','Cancelled','Completed']},
       'checkOutDateNumber': { '$lte': startUTCDateTimeNumber1 }
        }
      },
      {
        $group: {
          _id: '$bookingStatus',
          myCount: { $sum: 1 }
        }
      }
    ]).exec(function(error, bookingsData) {
      
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPHomeScreenBookingsCount:', error);
        callback(error, { statusCode: '9999', result: [] });
      } else if (bookingsData && bookingsData.length > 0) {
        callback(error, {statusCode: '0000', result: bookingsData});
        
      } else {
        callback(error, {statusCode: '9997', result: []});
      }
    });
  },
  getADEUBookingAccounts: function (recordID, startUTCDateTimeNumber, tokendecodedData, callback) {
   EU_Bookings.aggregate([
     {
       $match: {
         euUserId: recordID, isDeleted: false,
       }
     },
     {
       $group: {
         _id: '$bookingStatus',
         total: { $sum: "$totalPrice" },
       }
     }
   ]).exec(function(error, amountsData) {
     if (error) {
       logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPBookingAccounts:', error);
       callback(error, { statusCode: '9999', result: [] });
     } else if (amountsData && amountsData.length > 0) {
       callback(error, {statusCode: '0000', result: amountsData});
     } else {
       callback(error, {statusCode: '9997', result: []});
     }
   });
 },
 getADEUBookingRefundAccounts: function (recordID, startUTCDateTimeNumber, tokendecodedData, callback) {
   EU_Bookings.aggregate([
     {
       $match: {
         euUserId: recordID, isDeleted: false,
         bookingStatus: 'Cancelled',
       }
     },
     {
       $group: {
         _id: '$bookingStatus',
         total: { $sum: "$totalPrice" },
       }
     }
   ]).exec(function(error, amountsData) {
     if (error) {
       logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPBookingAccounts:', error);
       callback(error, { statusCode: '9999', result: [] });
     } else if (amountsData && amountsData.length > 0) {
       callback(error, {statusCode: '0000', result: amountsData});
     } else {
       callback(error, {statusCode: '9997', result: []});
     }
   });
 },
 
 
 // Begin: getSPBookingsCountBookingsList
 getADEUBookingsCountBookingsList: function (pageNumber, userId, searchString, startUTCDateTimeNumber, tokendecodedData, callback) {
   var query = { 
     euUserId: userId, 
     isDeleted: false, 
     //bookingStatus: { "$nin": ['Cancelled','Completed']},
     '$or': [
      { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
      { 'bookingCode': { $regex: searchString, $options: 'i' } },
      { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
      { 'euEmail': { $regex: searchString, $options: 'i' } },
      { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
      { 'spLocationObj.city': { $regex: searchString, $options: 'i' } },
      { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
      { 'bookingStatus': { $regex: searchString, $options: 'i' } }
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
       logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPBookingsCountBookingsList:', error);
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
           logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPBookingsCountBookingsList:', errorCount);
           var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
           callback(error, {statusCode: '0000', result: resultObj });
         } else if (resultCount) {
           var resultObj = { totalDocs: resultCount.length, bookingsData: bookingArray };
           callback(error, { statusCode: '0000', result: resultObj });
          } else {
           var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
           callback(error, { statusCode: '0000', result: resultObj });
         }
       });
     } else {
       callback(error, { statusCode: '9997', result: {} });
     }
   });
 },
 
 // End: getSPBookingsCountBookingsList
 getADEUBookingsCountCancelledList: function (pageNumber, userId, searchString, startUTCDateTimeNumber, tokendecodedData, callback) {
   var query = {
     euUserId: userId, 
     isDeleted: false, 
     bookingStatus: 'Cancelled',
     '$or': [
       { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
       { 'bookingCode': { $regex: searchString, $options: 'i' } },
       { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
       { 'euEmail': { $regex: searchString, $options: 'i' } },
       { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
       { 'spLocationObj.city': { $regex: searchString, $options: 'i' } },
       { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
       { 'bookingStatus': { $regex: searchString, $options: 'i' } }
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
       logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPBookingsCountCancelledList:', error);
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
           logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPBookingsCountCancelledList:', errorCount);
           var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
           callback(error, {statusCode: '0000', result: resultObj });
         } else if (resultCount) {
           var resultObj = { totalDocs: resultCount.length, bookingsData: bookingArray };
           callback(error, { statusCode: '0000', result: resultObj });
         } else {
           var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
           callback(error, { statusCode: '0000', result: resultObj });
         }
       });
     } else {
       callback(error, { statusCode: '9997', result: {} });
     }
   });
 },
 // End: getSPBookingsCountCancelledList
 // End: getSPBookingsCountBookingsList
 getADEUBookingsCountExpiredList: function (pageNumber, userId, searchString, startUTCDateTimeNumber, tokendecodedData, callback) {
   var query = {
     euUserId: userId, 
     isDeleted: false, 
     'checkOutDateNumber': { '$lte': startUTCDateTimeNumber },
     
     '$or': [
      { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
      { 'bookingCode': { $regex: searchString, $options: 'i' } },
      { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
      { 'euEmail': { $regex: searchString, $options: 'i' } },
      { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
      { 'spLocationObj.city': { $regex: searchString, $options: 'i' } },
      { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
      { 'bookingStatus': { $regex: searchString, $options: 'i' } }
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
       logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPBookingsCountCancelledList:', error);
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
           logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPBookingsCountCancelledList:', errorCount);
           var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
           callback(error, {statusCode: '0000', result: resultObj });
         } else if (resultCount) {
           var resultObj = { totalDocs: resultCount.length, bookingsData: bookingArray };
           callback(error, { statusCode: '0000', result: resultObj });
         } else {
           var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
           callback(error, { statusCode: '0000', result: resultObj });
         }
       });
     } else {
       callback(error, { statusCode: '9997', result: {} });
     }
   });
 },
 getADEUBookingsCounttotalAmountList: function (pageNumber, userId, searchString, startUTCDateTimeNumber, tokendecodedData, callback) {
   var query = {
     euUserId: userId, 
     isDeleted: false, 
     '$or': [
      { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
      { 'bookingCode': { $regex: searchString, $options: 'i' } },
      { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
      { 'euEmail': { $regex: searchString, $options: 'i' } },
      { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
      { 'spLocationObj.city': { $regex: searchString, $options: 'i' } },
      { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
      { 'bookingStatus': { $regex: searchString, $options: 'i' } }
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
       logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPBookingsCountCancelledList:', error);
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
           logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPBookingsCountCancelledList:', errorCount);
           var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
           callback(error, {statusCode: '0000', result: resultObj });
         } else if (resultCount) {
           var resultObj = { totalDocs: resultCount.length, bookingsData: bookingArray };
           callback(error, { statusCode: '0000', result: resultObj });
         } else {
           var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
           callback(error, { statusCode: '0000', result: resultObj });
         }
       });
     } else {
       callback(error, { statusCode: '9997', result: {} });
     }
   });
 },
 getADEUBookingsCountSpentAmountList: function (pageNumber, userId, searchString, startUTCDateTimeNumber, tokendecodedData, callback) {
   var query = {
     euUserId: userId, 
     isDeleted: false, 
     bookingStatus: { "$nin": ['Cancelled']},
     '$or': [
      { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
      { 'bookingCode': { $regex: searchString, $options: 'i' } },
      { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
      { 'euEmail': { $regex: searchString, $options: 'i' } },
      { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
      { 'spLocationObj.city': { $regex: searchString, $options: 'i' } },
      { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
      { 'bookingStatus': { $regex: searchString, $options: 'i' } }
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
       logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPBookingsCountCancelledList:', error);
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
           logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPBookingsCountCancelledList:', errorCount);
           var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
           callback(error, {statusCode: '0000', result: resultObj });
         } else if (resultCount) {
           var resultObj = { totalDocs: resultCount.length, bookingsData: bookingArray };
           callback(error, { statusCode: '0000', result: resultObj });
         } else {
           var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
           callback(error, { statusCode: '0000', result: resultObj });
         }
       });
     } else {
       callback(error, { statusCode: '9997', result: {} });
     }
   });
 },
 
 // Begin: getSPMessagesCounts
 getADEUMessagesCounts: function (recordID,tokendecodedData, callback) {
   EU_Messages.aggregate([
     {
       $match: {
         euUserId: recordID, isDeleted: false, 
         //spReadStatus: 'Unread',
       }
     },
     {
       $group: {
         _id: null,
         count: { $sum: 1 },
       }
     }
   ]).exec(function(error, messagesData) {
     if (error) {
       logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPMessagesCounts:', error);
       callback(error, { statusCode: '9999', result: [] });
     } else if (messagesData && messagesData.length > 0) {
       callback(error, {statusCode: '0000', result: messagesData});
     } else {
       callback(error, {statusCode: '9997', result: []});
     }
   });
 },
 // End: getSPMessagesCounts
 // Begin: getSPReviewCounts
 getADEUReviewCounts: function (recordID, startUTCDateTimeNumber, tokendecodedData, callback) {
   EU_ReviewRatings.aggregate([
     {
       $match: {
         euUserId: recordID, isDeleted: false, 
         //createdAt: {$gte: startUTCDateTimeNumber},
       }
     },
     {
       $group: {
         _id: null,
         count: { $sum: 1 },
       }
     }
   ]).exec(function(error, reviewsData) {
     if (error) {
       logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPReviewCounts:', error);
       callback(error, { statusCode: '9999', result: [] });
     } else if (reviewsData && reviewsData.length > 0) {
       callback(error, {statusCode: '0000', result: reviewsData});
     } else {
       callback(error, {statusCode: '9997', result: []});
     }
   });
 },
 // End: getSPReviewCounts
 // Begin: getSPNotificationsCounts
 getADEUNotificationsCounts: function (recordID, tokendecodedData, callback) {
   EU_Notifications.aggregate([
     {
       $match: {
         euUserId: recordID, isDeleted: false, 
         //status: 'Unread',
       }
     },
     {
       $group: {
         _id: null,
         count: { $sum: 1 },
       }
     }
   ]).exec(function(error, notificationsData) {
     if (error) {
       logger.error('There was an Un-known Error occured in daos/AD-EndUserDAO.js, at getSPNotificationsCounts:', error);
       callback(error, { statusCode: '9999', result: [] });
     } else if (notificationsData && notificationsData.length > 0) {
       callback(error, {statusCode: '0000', result: notificationsData});
     } else {
       callback(error, {statusCode: '9997', result: []});
     }
   });
 },
 // End: getSPNotificationsCounts 

}
// --- End: AD-EndUserDAO