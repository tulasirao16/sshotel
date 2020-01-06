/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var CommonService = require('./CommonService');
var AD_EndUserDAO = require('../daos/AD-EndUserDAO');
var EU_Users = require('../models/EU-Users');
var moment = require('moment');
// --- Begin: AD-EndUserService
module.exports = {
  // --- Begin getADEndUserListDataBySearch: 
  getADEndUserListDataBySearch: function (pageNum, searchString, callback) {
    AD_EndUserDAO.getADEndUserListDataBySearch(pageNum, searchString, function (resObj) {
      callback(resObj);
    });
  },
  //--- End getADEndUserListDataBySearch: 

  // --- Begin getADEndUserListingData:
  getADEndUserListingData: function (pageNum, searchString, tokenDecodedData, callback) {
    AD_EndUserDAO.getADEndUserListingData(pageNum, searchString, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  //--- End getADEndUserListingData: 

  // --- Begin: updateADEndUserStatus
  updateADEndUserStatus: function (recordID, reqBody, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var upObj = {
      userStatus: reqBody.status,
      updatedBy: tokenDecodedData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_EndUserDAO.updateADEndUserStatus(upObj, recordID, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // --- End: updateADEndUserStatus

  // --- Begin postADEndUserData:
  postADEndUserData: function (reqBody, tokenDecodedData, callback) {
    var stringArray = reqBody.firstName.split(' ');
    var displayName = stringArray[0];
    var name = reqBody.firstName + reqBody.lastName;
    var euFullName = name.replace(/\s/g, '');
    var currentUTC = CommonService.currentUTCObj();
    CommonService.saltGeneration(config.saltSize, function (saltValue) {
      CommonService.passwordEncryption(reqBody.password, saltValue, function (passwordObj) {
        var userAccount = moment().format('YY') + CommonService.orderSecureCodeGeneration(1, '012345678943210') + CommonService.orderSecureCodeGeneration(2, euFullName.toUpperCase()) + moment().format('MM') + CommonService.orderSecureCodeGeneration(3, '9876501234567894321');
        var userObj = {
          displayName: displayName,
          firstName: reqBody.firstName,
          lastName: reqBody.lastName ? reqBody.lastName : '',
          name: reqBody.firstName + (reqBody.lastName ? (' ' + reqBody.lastName) : ''),
          dob: reqBody.dob ? reqBody.dob : '',
          dobNumber: reqBody.dob ? moment(reqBody.dob, 'YYYY-MM-DD').valueOf() : 0,
          area: reqBody.area ? reqBody.area : '',
          city: reqBody.city ? reqBody.city : '',
          state: reqBody.state ? reqBody.state : '',
          zip: reqBody.pinCode ? reqBody.pinCode : '',
          country: reqBody.country ? reqBody.country : '',
          landMark: reqBody.landMark ? reqBody.landMark : '',
          address: reqBody.address,
          deviceNotifyToken: reqBody.deviceNotifyToken ? reqBody.deviceNotifyToken : '',
          userAccount: userAccount,
          mobileNumber: reqBody.mobileNumber,
          alternateContactNumber: reqBody.alternateContactNumber ? reqBody.alternateContactNumber : '',
          mbnVerifyStatus: 'Open',
          email: reqBody.email,
          alternateEmail: reqBody.alternateEmail ? reqBody.alternateEmail : '',
          emailVerifyStatus: 'Open',
          password: passwordObj.passwordHash,
          passwordSalt: passwordObj.salt,
          userRole: 'Customer',
          userStatus: reqBody.userStatus,
          signupType: 'Local',

          isDeleted: false,
          createdAt: currentUTC.currentUTCDateTimeNumber,
          createdBy: tokenDecodedData.ua,
          createdOn: currentUTC.currentUTCDateTimeString,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedBy: tokenDecodedData.ua,
          updatedOn: currentUTC.currentUTCDateTimeString
        };
        var userData = new EU_Users(userObj);
        AD_EndUserDAO.postADEndUserData(userData, tokenDecodedData, function (resObj) {
          callback(resObj);
        });
      });
    });
  },
  //--- End postADEndUserData: 
  getADEUDashboardScreenBookingsCount: function (tokendecodedData,recordID, callback) {
    var utcMoment = moment.utc();
    var istMoment = utcMoment.add(5, 'hours'). add(30, 'minutes');
    var endStartDate = istMoment.endOf('day');
    var endStartTime = endStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    var endUTCDateTimeNumber = moment(endStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
    var userStartDate = istMoment.startOf('day');
    var userStartTime = userStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    var startUTCDateTimeNumber = moment(userStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
    var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
  var startUTCDateTimeNumber1 = moment(currentTime, 'YYYY-MM-DD HH:mm:ss').valueOf()
    var resultObj = {};
    AD_EndUserDAO.getADEUDashboardScreenBookingsCount(recordID, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
                if (resObj.statusCode === '0000') {
                    resultObj['bookingsCount'] = resObj.result;
                } else {
                    resultObj['bookingsCount'] = [];
                }
                AD_EndUserDAO.getADEUHomeScreenExpiredCount(recordID, startUTCDateTimeNumber1, tokendecodedData, function (error, resObj) {
                  if (resObj.statusCode === '0000') {
                      resultObj['expiredCount'] = resObj.result;
                  } else {
                      resultObj['expiredCount'] = [];
                  }
                  AD_EndUserDAO.getADEUBookingAccounts(recordID, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
                    if (resObj.statusCode === '0000') {
                        resultObj['bookingsAmount'] = resObj.result;
                    } else {
                        resultObj['bookingsAmount'] = [];
                    }
                    AD_EndUserDAO.getADEUBookingRefundAccounts(recordID, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
                      if (resObj.statusCode === '0000') {
                          resultObj['RefundAmount'] = resObj.result;
                      } else {
                          resultObj['RefundAmount'] = [];
                      }
                      AD_EndUserDAO.getADEUMessagesCounts(recordID, tokendecodedData, function (error, resObj) {
                        if (resObj.statusCode === '0000') {
                            resultObj['messagesCount'] = resObj.result;
                        } else {
                            resultObj['messagesCount'] = [];
                        }
                        AD_EndUserDAO.getADEUReviewCounts(recordID, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
                            if (resObj.statusCode === '0000') {
                                resultObj['reviewsCount'] = resObj.result;
                            } else {
                                resultObj['reviewsCount'] = [];
                            }
                            AD_EndUserDAO.getADEUNotificationsCounts(recordID, tokendecodedData, function (error, resObj) {
                                        if (resObj.statusCode === '0000') {
                                            resultObj['notificationsUnreadCount'] = resObj.result;
                                        } else {
                                            resultObj['notificationsUnreadCount'] = [];
                                        }
                
                                    if ((resultObj.checkInsCount && resultObj.checkInsCount.length) || (resultObj.checkOutsCount && resultObj.checkOutsCount.length) || (resultObj.bookingsCount && resultObj.bookingsCount.length) || (resultObj.bookingsAmount && resultObj.bookingsAmount.length) || (resultObj.messagesCount && resultObj.messagesCount.length) || (resultObj.reviewsCount && resultObj.reviewsCount.length) || (resultObj.propertysCount && resultObj.propertysCount.length) || (resultObj.blockedDatesCount && resultObj.blockedDatesCount.length) || (resultObj.notificationsUnreadCount && resultObj.notificationsUnreadCount.length)) {
                                        callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                                    } else {
                                        callback({ httpCode: 400, statusCode: '9997', result: resultObj });
                                    }
                                });
                              });
                            });
                          });
                        });
                      });
                    });
},
 // --- Begin getSPBookingsCountBookingsList:
 getADEUBookingsCountBookingsList: function (pageNumber, userId, searchString, tokendecodedData, callback) {
  var utcMoment = moment.utc();
  var istMoment = utcMoment.add(5, 'hours'). add(30, 'minutes');
  var userStartDate = istMoment.startOf('day');
  var userStartTime = userStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  var startUTCDateTimeNumber = moment(userStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
  AD_EndUserDAO.getADEUBookingsCountBookingsList(pageNumber, userId, searchString, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
      if (error) {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
          callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
  });
},
// --- End getSPBookingsCountBookingsList:
 // --- Begin getSPBookingsCountCancelledList:
 getADEUBookingsCountCancelledList: function (pageNumber, userId, searchString, tokendecodedData, callback) {
  var utcMoment = moment.utc();
  var istMoment = utcMoment.add(5, 'hours'). add(30, 'minutes');
  var userStartDate = istMoment.startOf('day');
  var userStartTime = userStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  
  var startUTCDateTimeNumber = moment(userStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
  AD_EndUserDAO.getADEUBookingsCountCancelledList(pageNumber, userId, searchString, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
      if (error) {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
          callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
  });
},
getADEUBookingsCountExpiredList: function (pageNumber, userId, searchString, tokendecodedData, callback) {
  var utcMoment = moment.utc();
  var istMoment = utcMoment.add(5, 'hours'). add(30, 'minutes');
  var userStartDate = istMoment.startOf('day');
  var userStartTime = userStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
  var startUTCDateTimeNumber = moment(currentTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
  AD_EndUserDAO.getADEUBookingsCountExpiredList(pageNumber, userId, searchString, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
      if (error) {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
          callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
  });
},
getADEUBookingsCounttotalAmountList: function (pageNumber, userId, searchString, tokendecodedData, callback) {
  var utcMoment = moment.utc();
  var istMoment = utcMoment.add(5, 'hours'). add(30, 'minutes');
  var userStartDate = istMoment.startOf('day');
  var userStartTime = userStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
  var startUTCDateTimeNumber = moment(currentTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
  AD_EndUserDAO.getADEUBookingsCounttotalAmountList(pageNumber, userId, searchString, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
      if (error) {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
          callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
  });
},
getADEUBookingsCountSpentAmountList: function (pageNumber, userId, searchString, tokendecodedData, callback) {
  var utcMoment = moment.utc();
  var istMoment = utcMoment.add(5, 'hours'). add(30, 'minutes');
  var userStartDate = istMoment.startOf('day');
  var userStartTime = userStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
  var startUTCDateTimeNumber = moment(currentTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
  AD_EndUserDAO.getADEUBookingsCountSpentAmountList(pageNumber, userId, searchString, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
      if (error) {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
          callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
  });
},

}
// --- End: AD-EndUserService