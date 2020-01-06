/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var async = require('async');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var AD_Users = require('../models/AD-Users');
var EU_Bookings = require('../models/EU-Bookings')
var EU_Messages = require('../models/EU-Messages');
var EU_ReviewRatings = require('../models/EU-ReviewRatings');
var SP_Properties = require('../models/SP-Properties');
var SP_PropertyBlockings = require('../models/SP-PropertyBlockings');
var SP_Notifications = require('../models/SP-Notifications');
var EU_Users = require('../models/EU-Users');
var SP_Users = require('../models/SP-Users');
var SP_ServiceProviders = require('../models/SP-ServiceProviders')

// --- Begining of AD_HomeScreenDAO
module.exports = {

  // Begin: getADHomeScreenUsersCount
  getADHomeScreenUsersCount: function (tokendecodedData, query, callback) {
    var CheckInCount = {}, adUsersByStatusCount = {}, adUsersBookingStatusCount = {}, CheckOutCount = {}, BookingsAmount = {},
      MessagesCount = {}, NotificationsCount = {}, ReviewsCount = {}, PropertiesCount = {}, BlockingDatesCount = {}, AdminEndUsersCounts = {},
      AdminHostUsersCounts = {},AdminBookingCounts = {},AdminAppTotaAmountCounts = {},AdminSPTotalAmountCounts = {}
    async.parallel([
      function (callback) {
        getADUsersCheckInCount(query.getADUsersCheckInCountQuery, function (resObj1) {
          CheckInCount = resObj1;
          callback(null, CheckInCount);
        });
      },
      function (callback) {
        getADUsersCheckOutCount(query.getADUsersCheckOutCountQuery, function (resObj2) {
          CheckOutCount = resObj2;
          callback(null, CheckOutCount);
        });
      },
      function (callback) {
        getADUsersBookingStatusCounts(query.getADUsersBookingStatusCountsQuery, function (resObj3) {
          adUsersBookingStatusCount = resObj3;
          callback(null, adUsersBookingStatusCount);
        });
      },
      function (callback) {
        getADUsersByStatusCounts(query.getADUsersByStatusCountsQuery, function (resObj4) {
          adUsersByStatusCount = resObj4;
          callback(null, adUsersByStatusCount);
        });
      },
      function (callback) {
        getADUsersBookingAccounts(query.getADUsersBookingAccountsQuery, function (resObj5) {
          BookingsAmount = resObj5;
          callback(null, BookingsAmount);
        });
      },
      function (callback) {
        getADUsersReviewsCounts(query.getADUsersReviewsCountsQuery, function (resObj6) {
          ReviewsCount = resObj6;
          callback(null, ReviewsCount);
        });
      },
      function (callback) {
        getADUsersMessagesCounts(query.getADUsersMessagesCountsQuery, function (resObj7) {
          MessagesCount = resObj7;
          callback(null, MessagesCount);
        });
      },
      function (callback) {
        getADUsersNotificationsCounts(query.getADUsersNotificationsCountsQuery, function (resObj8) {
          NotificationsCount = resObj8;
          callback(null, NotificationsCount);
        });
      },
      function (callback) {
        getADUsersPropertiesCounts(query.getADUsersPropertiesCountsQuery, function (resObj9) {
          PropertiesCount = resObj9;
          callback(null, PropertiesCount);
        });
      },
      function (callback) {
        getADUserBlockingDatesCount(query.getADUserBlockingDatesCountQuery, function (resObj10) {
          BlockingDatesCount = resObj10
          callback(null, BlockingDatesCount);
        });
      },
      function (callback) {
        getADEndUsersCounts(query.getADEndUsersCountsQuery, function (resObj11) {
          AdminEndUsersCounts = resObj11
          callback(null, AdminEndUsersCounts);
        });
      },
      function (callback) {
        getADHostUsersCounts(query.getADHostUsersCountsQuery, function (resObj12) {
          AdminHostUsersCounts = resObj12
          callback(null, AdminHostUsersCounts);
        });
      },
      function (callback) {
        getADBookingsCounts(query.getADHostUsersCountsQuery, function (resObj13) {
          AdminBookingCounts = resObj13
          callback(null, AdminBookingCounts);
        });
      },
      function (callback) {
        getADAppTotalAmountCounts(query.getADHostUsersCountsQuery, function (resObj14) {
          AdminAppTotaAmountCounts = resObj14
          callback(null, AdminAppTotaAmountCounts);
        });
      },
      function (callback) {
        getADSPTotalAmountCounts(query.getADHostUsersCountsQuery, function (resObj15) {
          AdminSPTotalAmountCounts = resObj15
          callback(null, AdminSPTotalAmountCounts);
        });
      },

    ], function (err, result) {
      if (err) {
        logger.error('There was an Un-known Error occured in daos/AD-HomeScreenDAO.js,' +
          ' at AD-HomeScreenDAO:', err);
      }
      var fResObj = {
        CheckInCount: CheckInCount, CheckOutCount: CheckOutCount, adUsersByStatusCount: adUsersByStatusCount, adUsersBookingStatusCount: adUsersBookingStatusCount
        , BookingsAmount: BookingsAmount, MessagesCount: MessagesCount, NotificationsCount: NotificationsCount, ReviewsCount: ReviewsCount, PropertiesCount: PropertiesCount,
        BlockingDatesCount: BlockingDatesCount, AdminHostUsersCounts: AdminHostUsersCounts, AdminEndUsersCounts: AdminEndUsersCounts, AdminBookingCounts:AdminBookingCounts,
        AdminAppTotaAmountCounts:AdminAppTotaAmountCounts,AdminSPTotalAmountCounts:AdminSPTotalAmountCounts
      };
      callback({ httpCode: 200, statusCode: '0000', result: fResObj });
    });
  },

  // End: getADHomeScreenUsersCount

  // Begin: getADHomeScreenUsersListByStatus
  getADHomeScreenUsersCountByStatus: function (pageNum, status, tokendecodedData, searchString, callback) {
    var query = {
      'isDeleted': false,
      '$or': [
        { 'name': { $regex: searchString, $options: 'i' } },
        { 'firstName': { $regex: searchString, $options: 'i' } },
        { 'lastName': { $regex: searchString, $options: 'i' } },
        { 'email': { $regex: searchString, $options: 'i' } },
        { 'mobileNumber': { $regex: searchString, $options: 'i' } },
        { 'displayName': { $regex: searchString, $options: 'i' } },
        { 'userAccount': { $regex: searchString, $options: 'i' } },
        { 'userStatus': { $regex: searchString, $options: 'i' } },
        { 'userRole': { $regex: searchString, $options: 'i' } },
        { 'email': { $regex: searchString, $options: 'i' } }
      ],
      userStatus: status,
      isDeleted: false
    };
    var resultArray = []
    AD_Users.find(query)
      .skip((pageNum - 1) * 10)
      .limit(10)
      .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-HomeScreenDAO.js, at getADHomeScreenUsersCount:'+ error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
          AD_Users.countDocuments(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD-HomeScreenDAO.js, at getADHomeScreenUsersCount:'+ errorCount);
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount, userData: resultArray };
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
  // End: getADHomeScreenUsersListByStatus

  // Begin: getADHomeScreenHostUsersCountByStatus
  getADHomeScreenHostUsersCountByStatus: function (pageNum, status, tokendecodedData, searchString, callback) {
    var query = {
      '$or': [
        { 'serviceProvider': { $regex: searchString, $options: 'i' } },
        { 'contactPerson': { $regex: searchString, $options: 'i' } },
        { 'contactNumber': { $regex: searchString, $options: 'i' } },
        { 'contactEmail': { $regex: searchString, $options: 'i' } },
        { 'mobileNumber': { $regex: searchString, $options: 'i' } },
        { 'area': { $regex: searchString, $options: 'i' } },
        { 'zip': { $regex: searchString, $options: 'i' } },
        { 'city': { $regex: searchString, $options: 'i' } },
        { 'Status': { $regex: searchString, $options: 'i' } },
      ],
      status: status,
      'isDeleted': false
    };
    var resultArray = []
    SP_ServiceProviders.find(query)
      .skip((pageNum - 1) * 20)
      .limit(20)
      .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-HomeScreenDAO.js, at getADHomeScreenUsersCount:'+ error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
          SP_ServiceProviders.countDocuments(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD-HomeScreenDAO.js, at getADHomeScreenUsersCount:'+ errorCount);
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount, userData: resultArray };
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
  // End: getADHomeScreenHostUsersCountByStatus

  // --- Begin getADHostsPropertiesByStatus:
  getADHomeScreenHostsPropertiesByStatus: function (pageNum, Status, searchString, callback) {

    var query = {
      'status': Status,
      'isDeleted': false,
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'propertyTitle': { $regex: searchString, $options: 'i' } },
        { 'propertyType': { $regex: searchString, $options: 'i' } },
        { 'spLocationObj.area': { $regex: searchString, $options: 'i' } }
      ]
    }

    SP_Properties.find(query)
      .populate('spLocationId')
      .skip((pageNum - 1) * 20)
      .limit(20)
      .exec(function (error, resObj) {
        if (error) {
          logger.error('There was an Error occured in daos/AD-HomeScreenDAO at getADHostsPropertiesByStatus' + error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj.length > 0) {
          SP_Properties.countDocuments(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Error occured in daos/AD-HomeScreenDAO at getADHostsPropertiesByStatus countDocument' + errorCount);
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount, propertiesList: resObj };
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
  // -- End : getADHostsPropertiesByStatus

  // Begin: getADCheckInBookingsList
  getADCheckInBookingsList: function (pageNumber, searchString, startUTCDateTimeNumber, endUTCDateTimeNumber, tokendecodedData, callback) {
    var query = {
      isDeleted: false,
      '$and': [
        {
          '$or': [
            {
              '$and': [
                {
                  'checkInDateNumber': { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber },
                  'bookingStatus': ['Checked-In', 'Booked', 'Confirmed'],
                }
              ]
            },
            {
              '$and': [
                {
                  'updatedAt': { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber },
                  'bookingStatus': 'Checked-In'
                }
              ]
            }
          ]
        },
        {
          '$or': [
            { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
            { 'bookingCode': { $regex: searchString, $options: 'i' } },
            { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
            { 'euEmail': { $regex: searchString, $options: 'i' } },
            {'spPropertyTitle': { $regex: searchString, $options: 'i' }  },
            {'spLocationObj.area': { $regex: searchString, $options: 'i' } },
            { 'euName': { $regex: searchString, $options: 'i' } },
            { 'bookingStatus': { $regex: searchString, $options: 'i' } },
          ]
        }
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
          logger.error('There was an Un-known Error occured in daos/AD_HomeScreenDAO.js, at getADCheckInBookingsList:'+ error);
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
          EU_Bookings.find(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD-UsersDAO.js, at getADCheckInBookingsList:'+ errorCount);
              var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
              callback(error, { statusCode: '0000', result: resultObj });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount.length, bookingsData: bookingArray };
              callback(error, { statusCode: '0000', result: resultObj });
            }
          });
        } else {
          callback(error, { statusCode: '9997', result: {} });
        }
      });
  },
  // End: getADCheckInBookingsList


  // Begin: getADCheckOutBookingsList
  getADCheckOutBookingsList: function (pageNumber, searchString, startUTCDateTimeNumber, endUTCDateTimeNumber, tokendecodedData, callback) {
    var query = {
      isDeleted: false,
      '$and': [
        {
          '$or': [
            {
              '$and': [
                {
                  'checkOutDateNumber': { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber },
                  'bookingStatus': ['Checked-In', 'Checked-Out'],
                }
              ]
            },
            {
              '$and': [
                {
                  'updatedAt': { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber },
                  'bookingStatus': 'Checked-Out'
                }
              ]
            }
          ]
        },
        {
          '$or': [
            { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
            { 'bookingCode': { $regex: searchString, $options: 'i' } },
            { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
            { 'euEmail': { $regex: searchString, $options: 'i' } },
            {'spPropertyTitle': { $regex: searchString, $options: 'i' }  },
            {'spLocationObj.area': { $regex: searchString, $options: 'i' } },
            { 'euName': { $regex: searchString, $options: 'i' } },
          ]
        }
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
          logger.error('There was an Un-known Error occured in daos/AD_HomeScreenDAO.js, at getADCheckOutBookingsList:', error);
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
          EU_Bookings.find(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD_HomeScreenDAO.js, at getADCheckOutBookingsList:', errorCount);
              var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
              callback(error, { statusCode: '0000', result: resultObj });
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
  // End: getADCheckOutBookingsList

  // Begin: getADBookingsAmountsList
  getADBookingsAmountsList: function (pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, callback) {
    var query = {
      isDeleted: false,
      createdAt: { $gte: startUTCDateTimeNumber },
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'bookingCode': { $regex: searchString, $options: 'i' } },
        { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
        { 'euEmail': { $regex: searchString, $options: 'i' } },
        {'spPropertyTitle': { $regex: searchString, $options: 'i' }  },
        {'spLocationObj.area': { $regex: searchString, $options: 'i' } },
        { 'euName': { $regex: searchString, $options: 'i' } },
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
          logger.error('There was an Un-known Error occured in daos/AD_HomeScreenDAO.js, at getADBookingsAmountsList:'+ error);
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
          EU_Bookings.find(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD_HomeScreenDAO.js, at getADBookingsAmountsList:'+ errorCount);
              var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
              callback(error, { statusCode: '0000', result: resultObj });
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
  // End: getADBookingsAmountsList

  // Begin: getADBookingsCountBookingsList
  getADBookingsCountBookingsList: function (pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, callback) {
    var query = {
      isDeleted: false,
      createdAt: { $gte: startUTCDateTimeNumber },
      bookingStatus: { "$nin": ['Cancelled'] },
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'bookingCode': { $regex: searchString, $options: 'i' } },
        { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
        { 'euEmail': { $regex: searchString, $options: 'i' } },
        {'spPropertyTitle': { $regex: searchString, $options: 'i' }  },
        {'spLocationObj.area': { $regex: searchString, $options: 'i' } },
        { 'euName': { $regex: searchString, $options: 'i' } },
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
          logger.error('There was an Un-known Error occured in daos/AD-HomeScreenDAO.js, at getSPBookingsCountBookingsList:'+ error);
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
          EU_Bookings.find(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD-HomeScreenDAO.js, at getSPBookingsCountBookingsList:'+ errorCount);
              var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
              callback(error, { statusCode: '0000', result: resultObj });
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
  // End: getADBookingsCountBookingsList

  // Begin: getADBookingsCountCancelledList
  getADBookingsCountCancelledList: function (pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, callback) {
    var query = {
      isDeleted: false,
      updatedAt: { $gte: startUTCDateTimeNumber },
      bookingStatus: 'Cancelled',
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'bookingCode': { $regex: searchString, $options: 'i' } },
        { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
        { 'euEmail': { $regex: searchString, $options: 'i' } },
        {'spPropertyTitle': { $regex: searchString, $options: 'i' }  },
        {'spLocationObj.area': { $regex: searchString, $options: 'i' } },
        { 'euName': { $regex: searchString, $options: 'i' } },
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
          logger.error('There was an Un-known Error occured in daos/AD_HomeScreenDAO.js, at getADBookingsCountCancelledList:'+ error);
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
          EU_Bookings.find(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD_HomeScreenDAO.js, at getADBookingsCountCancelledList:'+ errorCount);
              var resultObj = { totalDocs: bookingArray.length, bookingsData: bookingArray };
              callback(error, { statusCode: '0000', result: resultObj });
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
  // End: getADBookingsCountCancelledList

  // Begin: getADHomeScreenBlockedDatesList
  getADHomeScreenBlockedDatesList: function (pageNumber, searchString, startUTCDateTimeNumber, endUTCDateTimeNumber, tokendecodedData, callback) {
    var query = {
      'isDeleted': false,
      '$and': [
        {
          '$or': [
            { 'blockingFromDateNumber': { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber } },
            { 'blockingToDateNumber': { $gte: startUTCDateTimeNumber, $lte: endUTCDateTimeNumber } },
            { 'blockingFromDateNumber': { $lte: startUTCDateTimeNumber }, blockingToDateNumber: { $gte: endUTCDateTimeNumber } }
          ]
        },
        { '$or': [
          { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
          { 'blockingFromDate': { $regex: searchString, $options: 'i' } },
          { 'blockingToDate': { $regex: searchString, $options: 'i' } },
          { 'spPropertyTitle': { $regex: searchString, $options: 'i' }  },
          { 'area': { $regex: searchString, $options: 'i' } },
          { 'blockingType': { $regex: searchString, $options: 'i' } },
        ] }
      ]
    };
    SP_PropertyBlockings.find(query)
      .skip((pageNumber - 1) * 10)
      .limit(10)
      .exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD_HomeScreenDAO.js, at getADHomeScreenBlockedDatesList:'+ error);
          callback(error, { statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
          SP_PropertyBlockings.find(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD_HomeScreenDAO.js, at getADHomeScreenBlockedDatesList:'+ errorCount);
              var resultObj = { totalDocs: resultArray.length, blockedDatesData: resultArray };
              callback(error, { statusCode: '0000', result: resultObj });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount.length, blockedDatesData: resultArray };
              callback(error, { statusCode: '0000', result: resultObj });
            } else {
              var resultObj = { totalDocs: resultArray.length, blockedDatesData: resultArray };
              callback(error, { statusCode: '0000', result: resultObj });
            }
          });
        } else {
          callback(error, { statusCode: '9997', result: {} });
        }
      });
  },
  // End: getADHomeScreenBlockedDatesList

}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getADUsersCheckInCount(query, callback) {
  EU_Bookings.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$bookingStatus',
        count: { $sum: 1 }
      }
    }
  ])
    .exec(function (error, userData) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (userData && userData.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: userData });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getADUsersCheckOutCount(query, callback) {
  EU_Bookings.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$bookingStatus',
        count: { $sum: 1 }
      }
    }
  ])
    .exec(function (error, userData) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (userData && userData.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: userData });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}

/**
 * @param {object} query object
 * @return {function} callback
 */
function getADUsersBookingStatusCounts(query, callback) {
  EU_Bookings.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$bookingStatus',
        count: { $sum: 1 }
      }
    }
  ])
    .exec(function (error, userData) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (userData && userData.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: userData });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}

/**
 * @param {object} query object
 * @return {function} callback
 */
function getADUsersByStatusCounts(query, callback) {
  AD_Users.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$userStatus',
        count: { $sum: 1 }
      }
    }
  ])
    .exec(function (error, userData) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (userData && userData.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: userData });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getADUserBlockingDatesCount(query, callback) {
  SP_PropertyBlockings.aggregate([
    {
      $match: query
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      }
    }
  ]).exec(function (error, blockedDatesData) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
      callback({ httpCode: 500, statusCode: '9999', result: [] });
    } else if (blockedDatesData && blockedDatesData.length > 0) {
      callback({ httpCode: 200, statusCode: '0000', result: blockedDatesData });
    } else {
      callback({ httpCode: 400, statusCode: '9997', result: [] });
    }
  });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getADUsersBookingAccounts(query, callback) {
  EU_Bookings.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$bookingStatus',
        total: { $sum: "$spAmount" },
      }
    }
  ]).exec(function (error, amountsData) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
      callback({ httpCode: 500, statusCode: '9999', result: [] });
    } else if (amountsData && amountsData.length > 0) {
      callback({ httpCode: 200, statusCode: '0000', result: amountsData });
    } else {
      callback({ httpCode: 400, statusCode: '9997', result: [] });
    }
  });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getADUsersReviewsCounts(query, callback) {
  EU_ReviewRatings.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      }
    }
  ]).exec(function (error, reviewsData) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
      callback({ httpCode: 500, statusCode: '9999', result: [] });
    } else if (reviewsData && reviewsData.length > 0) {
      callback({ httpCode: 200, statusCode: '0000', result: reviewsData });
    } else {
      callback({ httpCode: 400, statusCode: '9997', result: [] });
    }
  });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getADUsersMessagesCounts(query, callback) {
  EU_Messages.aggregate([
    {
      $match: query
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      }
    }
  ]).exec(function (error, messagesData) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
      callback({ httpCode: 500, statusCode: '9999', result: [] });
    } else if (messagesData && messagesData.length > 0) {
      callback({ httpCode: 200, statusCode: '0000', result: messagesData });
    } else {
      callback({ httpCode: 400, statusCode: '9997', result: [] });
    }
  });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getADUsersNotificationsCounts(query, callback) {
  SP_Notifications.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      }
    }
  ]).exec(function (error, notificationsData) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
      callback({ httpCode: 500, statusCode: '9999', result: [] });
    } else if (notificationsData && notificationsData.length > 0) {
      callback({ httpCode: 200, statusCode: '0000', result: notificationsData });
    } else {
      callback({ httpCode: 400, statusCode: '9997', result: [] });
    }
  });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getADUsersPropertiesCounts(query, callback) {
  SP_Properties.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      }
    }
  ]).exec(function (error, propertysData) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
      callback({ httpCode: 500, statusCode: '9999', result: [] });
    } else if (propertysData && propertysData.length > 0) {
      callback({ httpCode: 200, statusCode: '0000', result: propertysData });
    } else {
      callback({ httpCode: 400, statusCode: '9997', result: [] });
    }
  });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getADHostUsersCounts(query, callback) {
  SP_ServiceProviders.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ])
    .exec(function (error, userData) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (userData && userData.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: userData });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getADEndUsersCounts(query, callback) {
  EU_Users.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$userStatus',
        count: { $sum: 1 }
      }
    }
  ])
    .exec(function (error, userData) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (userData && userData.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: userData });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}
// .............................count pupose only.....................................
/**
 * @param {object} query object
 * @return {function} callback
 */
function getADBookingsCounts(query, callback) {
  EU_Bookings.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      }
    }
  ]).exec(function (error, BookingCountsData) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
      callback({ httpCode: 500, statusCode: '9999', result: [] });
    } else if (BookingCountsData && BookingCountsData.length > 0) {
      callback({ httpCode: 200, statusCode: '0000', result: BookingCountsData });
    } else {
      callback({ httpCode: 400, statusCode: '9997', result: [] });
    }
  });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getADAppTotalAmountCounts(query, callback) {
  EU_Bookings.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        total: { $sum: "$appTotalAmount" },
      }
    }
  ]).exec(function (error, amountsData) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
      callback({ httpCode: 500, statusCode: '9999', result: [] });
    } else if (amountsData && amountsData.length > 0) {
      callback({ httpCode: 200, statusCode: '0000', result: amountsData });
    } else {
      callback({ httpCode: 400, statusCode: '9997', result: [] });
    }
  });
}
/**
 * @param {object} query object
 * @return {function} callback
 */
function getADSPTotalAmountCounts(query, callback) {
  EU_Bookings.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        total: { $sum: "$spTotalAmount" },
      }
    }
  ]).exec(function (error, amountsData) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-HomeScreenDAO.js' + error);
      callback({ httpCode: 500, statusCode: '9999', result: [] });
    } else if (amountsData && amountsData.length > 0) {
      callback({ httpCode: 200, statusCode: '0000', result: amountsData });
    } else {
      callback({ httpCode: 400, statusCode: '9997', result: [] });
    }
  });
}
