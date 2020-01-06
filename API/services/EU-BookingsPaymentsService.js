/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var payumoney = require('payumoney-node');
var moment = require('moment');
var logger = require('../lib/logger');
var SP_Properties = require('../models/SP-Properties');
var SP_Users = require('../models/SP-Users');
var SP_NotificationsService = require('./SP-NotificationsService')
var SP_NotificationsDAO = require('../daos/SP-NotificationsDAO');

payumoney.setKeys(config.payuTestKey, config.payuTestSalt, config.payuTestAuthHeader);
// payumoney.setKeys(config.payuProdKey, config.payuProdSalt, config.payuProdAuthHeader);
payumoney.isProdMode(false);

var EU_BookingsPaymentsDAO = require('../daos/EU-BookingsPaymentsDAO');
var commonService = require('../services/CommonService');
var EU_Notifications = require('../models/EU-Notifications');


// START: EU-BookingsPaymentsService
module.exports = {
  makePayment: function(reqObj, email, paymentType, decodedTokenData, callback) {
    var currentUTC = commonService.currentUTCObj();
    EU_BookingsPaymentsDAO.getBookingPayments(reqObj.bookingInfo._id, reqObj.bookingInfo.grandTotal,
    function(paymentError, opObj) {
      if (paymentError) {
        logger.error('There was an Un-Known Error occured in services/EU-BookingsPaymentsService.js,',
        ' at makePayment - getBookingPayments:', paymentError);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if (opObj && opObj._id) {
        EU_BookingsPaymentsDAO.updateBookingPayments(reqObj, opObj._id, decodedTokenData, function(cpData) {
          if (cpData.statusCode == '0000') {
            callback({httpCode: 200, statusCode: '0000', result: {'paymentURL': opObj.paymentUrl, 'paymentTxnID': opObj.txnID}});
          } else {
            callback({httpCode: cpData.httpCode, statusCode: cpData.statusCode, result: cpData.result});
          }
        });
      } else {
        EU_BookingsPaymentsDAO.getEUBooking(reqObj.bookingInfo._id , function(EUResObj) {
          if (EUResObj && EUResObj._id) {
            setMakePayment(reqObj, email, currentUTC, paymentType, decodedTokenData, EUResObj, function(resObj) {
              callback(resObj);
            });
          } else {
            callback({httpCode: 400, statusCode: '9997', result: {}})
          }
        })    
        // setMakePayment(reqObj, email, currentUTC, paymentType, decodedTokenData, function(resObj) {
        //   callback(resObj);
        // });
      }
    });
  },

  mobilePaymentSetup: function(paymentTxnID, mobileAppUri, callback) {
    var currentUTC = commonService.currentUTCObj();
    var updatePaymentObj = {
      mobileAppUri: mobileAppUri,
      updatedBy: 'superadmin',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    EU_BookingsPaymentsDAO.mobilePaymentSetup(paymentTxnID, updatePaymentObj, function(resObj) {
      callback(resObj);
    });
  },

  updateCustomerBookingPaymentData: function(reqObj, callback) {
    var currentUTC = commonService.currentUTCObj();
    var updateBookingObj = {
      bookingObj: {
        paymentModeCode: reqObj.mode,
        paymentMode: reqObj.mode == 'CC' ? 'Credit Card' : reqObj.mode == 'DC' ?
          'Debit Card' : reqObj.mode == 'NB' ? 'Netbanking' : reqObj.mode,
        paymentHash: reqObj.hash,
        paymentGatewayStatus: reqObj.status,
        // paymentResponse: reqObj,
        paymentStatus: 'Paid',
        bookingStatus: 'Booked',
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      },
      bookingPaymentsObj: {
        paymentStatus: 'Success',
        paymentResModeCode: reqObj.mode,
        paymentResMode: reqObj.mode == 'CC' ? 'Credit Card' : reqObj.mode == 'DC' ?
          'Debit Card' : reqObj.mode == 'NB' ? 'Netbanking' : reqObj.mode,
        paymentResHash: reqObj.hash,
        paymentResGatewayStatus: reqObj.status,
        paymentResponse: reqObj,
        paymentResStatus: 'Paid',
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      }
    };
    EU_BookingsPaymentsDAO.updateCustomerBookingPaymentData(reqObj.txnid, updateBookingObj,
    reqObj.encryptedPaymentId, function(resObj) {
      if(resObj.statusCode == '0000' && resObj.result.euUserId) {
        let notificationObj = {
          title: 'Booking Payment',
          // titleBody: 'Hi ' + resObj.result.euName + '.Your Payment for Booking at ' + resObj.result.spPropertyTitle + ' on ' +  moment(resObj.result.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.result.checkOutDate).format('MMM DD, YYYY h:mm A')  + ' has been successfully' + '.\n' + 'Booking Code : ' + resObj.result.bookingCode + '.\n' + 'Contact : ' + resObj.result.spLocationObj.mobileNumber
          titleBody: 'Hi ' + resObj.result.euName + ', Your Payment for Booking at ' + resObj.result.spPropertyTitle + ' on ' +  moment(resObj.result.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.result.checkOutDate).format('MMM DD, YYYY h:mm A')  + ' has been successfully'
        }
        let ntyBody = {recordId: resObj.result._id, type: 'Booking', spContact: resObj.result.spLocationObj ? resObj.result.spLocationObj.mobileNumber : '', bookingCode: resObj.result.bookingCode ? resObj.result.bookingCode : ''  }
        setEndUserNotificationTokenData(resObj.result, resObj.result.euUserId, ntyBody, notificationObj);
        if(resObj.result.spPropertyId) {
          SP_NotificationsService.sendSPNotificationForBooking(resObj.result, 'success', function(nObj) {});
        }
      }
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },

  bookingPaymentFailed: function(reqObj, callback) {
    var currentUTC = commonService.currentUTCObj();
    bookingPaymentsObj = {
      paymentStatus: 'Failed',
      paymentResModeCode: reqObj.mode,
      paymentResMode: reqObj.mode == 'CC' ? 'Credit Card' : reqObj.mode == 'DC' ?
        'Debit Card' : reqObj.mode == 'NB' ? 'Netbanking' : reqObj.mode,
      paymentResHash: reqObj.hash,
      paymentResGatewayStatus: reqObj.status,
      paymentResponse: reqObj,
      paymentResStatus: 'Pending',
      updatedBy: 'superadmin',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    bookingObj = {
      paymentModeCode: reqObj.mode,
      paymentMode: reqObj.mode == 'CC' ? 'Credit Card' : reqObj.mode == 'DC' ?
        'Debit Card' : reqObj.mode == 'NB' ? 'Netbanking' : reqObj.mode,
      paymentHash: reqObj.hash,
      paymentGatewayStatus: reqObj.status,
      updatedBy: 'superadmin',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };

    EU_BookingsPaymentsDAO.bookingPaymentFailed(reqObj.txnid, bookingObj, bookingPaymentsObj, function(resObj) {
      if(resObj.statusCode == '0000' && resObj.result.euUserId) {
        let notificationObj = {
          title: 'Booking Payment',
          // titleBody: 'Hi ' + resObj.result.euName + '.Your Payment for Booking at ' + resObj.result.spPropertyTitle + ' on ' +  moment(resObj.result.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.result.checkOutDate).format('MMM DD, YYYY h:mm A')  + ' has been successfully. Booking Code: ' + resObj.result.bookingCode + '. Contact: ' + resObj.result.spLocationObj.mobileNumber 
          titleBody: 'Hi ' + resObj.result.euName + ', Your Payment for Booking at ' + resObj.result.spPropertyTitle + ' on ' +  moment(resObj.result.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.result.checkOutDate).format('MMM DD, YYYY h:mm A')  + ' has been failed.'
        } 
        let ntyBody = {recordId: resObj.result._id, type: 'Booking', spContact: resObj.result.spLocationObj ? resObj.result.spLocationObj.mobileNumber : '', bookingCode: resObj.bookingCode ? resObj.bookingCode : '' }
        setEndUserNotificationTokenData(resObj.result, resObj.result.euUserId, ntyBody, notificationObj);
        if(resObj.result.spPropertyId) {
          SP_NotificationsService.sendSPNotificationForBooking(resObj.result, 'fail', function(nObj) {});
        }
      }
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  getPaymentSetup: function(paymentTxnID, callback) {
    EU_BookingsPaymentsDAO.getPaymentSetup(paymentTxnID, function(resObj) {
      callback(resObj);
    });
  },
  getBookingPaymentData: function(paymentResHash, callback) {
    EU_BookingsPaymentsDAO.getBookingPaymentData(paymentResHash, function(resObj) {
      callback(resObj);
    });
  },

  deleteEndUsersPayment: function(bookingId, paymentId, tokenDecodedData, callback) {
    EU_BookingsPaymentsDAO.deleteEndUsersPayment(bookingId, paymentId, tokenDecodedData, function(resObj) {
      callback(resObj);
    });
  }
};
  /**
 * @param {object} reqObj object
 * @param {string} email string
 * @param {object} currentUTC object
 * @param {string} paymentType string
 * @param {function} callback
 */
function setMakePayment(reqObj, email, currentUTC, paymentType, decodedTokenData, EUResObj, callback) {
    var currentUTCNumString = currentUTC.currentUTCDateTimeNumber.toString();
    // var amountsObj = commonService.orderAmountsSetup(reqObj.bookingInfo.grandTotal);
    var paymentData = {
      productinfo: reqObj.bookingInfo.spPropertyTitle + ' - ' + reqObj.bookingInfo.spPropertyType,
      txnid: reqObj.bookingInfo._id + 'TXNID' +
        currentUTCNumString.substring(0, currentUTCNumString.length - 3),
      amount: EUResObj.totalPrice,
      email: email ? email : config.paymentsEmail,
      phone: reqObj.bookingInfo.euMobileNumber,
      lastname: currentUTCNumString,
      firstname: reqObj.bookingInfo.euName,
      surl: paymentType == 'Mobile App' ? config.apiDomain + 'api/mobile/endusers/booking/paymentgateway/status'
        : config.apiDomain + 'api/endusers/booking/paymentgateway/status',
      furl: paymentType == 'Mobile App' ? config.apiDomain + 'api/mobile/endusers/booking/paymentgateway/status'
        : config.apiDomain + 'api/endusers/booking/paymentgateway/status'
    };
    payumoney.makePayment(paymentData, function(error, response) {
      if (error) {
        logger.error('There was an Un-Known Error occured in services/EU-BookingsPaymentsService.js,',
          ' at makePayment:', error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if (response) {
        var custObj = setBookingPaymentData(reqObj, email, paymentData, response, currentUTC, EUResObj);
        EU_BookingsPaymentsDAO.setBookingPayments(custObj.custPaymentObj, custObj.custBookingObj, decodedTokenData, function(cpData) {
          if (cpData.statusCode == '0000') {
            callback({httpCode: 200, statusCode: '0000', result: {'paymentURL': response, 'paymentTxnID': cpData.result.txnID}});
          } else {
            callback({httpCode: cpData.httpCode, statusCode: cpData.statusCode, result: cpData.result});
          }
        });
      } else {
        callback({httpCode: 400, statusCode: '9993', result: {}});
      }
    });
  }
  
  /**
  * @param {object} reqObj object
  * @param {string} email string
  * @param {object} paymentData object
  * @param {object} EUResObj object
  * @param {string} paymentURL string
  * @param {object} currentUTC object
  * @return {object} custPaymentObj
  */

  function setBookingPaymentData(reqObj, email, paymentData, paymentURL, currentUTC, EUResObj) {
    var paymentURLArray = paymentURL.split('/');
    reqObj.bookingInfo.euEmail = email;
    var custObj = {
      custPaymentObj: {
        bookingId: EUResObj._id,
        spServiceProviderId: EUResObj.spServiceProviderId,
        uiToken: reqObj.token ? reqObj.token : null,
        uiAuthObj: reqObj.authObj ? JSON.stringify(reqObj.authObj) : null,
        uiData: reqObj.authObj ? JSON.stringify(reqObj.authObj) : null,
        paymentData: paymentData,
        paymentUrl: paymentURL,
        paymentCode: paymentURLArray[paymentURLArray.length - 1],
        paymentStatus: 'Pending',
  
        txnID: paymentData.txnid,
        totalAmount: EUResObj.totalPrice,
        amount: EUResObj.grandTotal,
        spTotalAmount: EUResObj.spTotalAmount,
        appTotalAmount: EUResObj.appTotalAmount,
        // additionalCharges: '0',
  
        isDeleted: false,
        createdBy: 'superadmin',
        updatedBy: 'superadmin',
        createdAt: currentUTC.currentUTCDateTimeNumber,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedOn: currentUTC.currentUTCDateTimeString
      },
      custBookingObj: {
        // serviceProviderAmount: amountsObj.supplierAmount,
        paymentUrl: paymentURL,
        paymentCode: paymentURLArray[paymentURLArray.length - 1],
        euName: reqObj.contactPerson,
        euMobileNumber: reqObj.contactNumber,
        euEmail: email ? email : null,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      }
    };
    return custObj;
  }

/**
 * @param {object} bookingData object
 * @param {string} deviceToken object
 * @param {string} ntyBody object
 * @param {object} notificationObj object
 */
function setEndUserNotificationTokenData(bookingData, userData, ntyBody, notificationObj) {
  var userNotifObj = new EU_Notifications({
    euUserId: bookingData.euUserId,
    euName: bookingData.euName,
    notificationTitle: notificationObj.title,
    notificationMessage: notificationObj.titleBody,
    notificationBody: ntyBody,
    status: 'Unread',
    isDeleted: false,
    createdBy: bookingData.updatedBy,
    createdAt: bookingData.updatedAt,
    createdOn: bookingData.updatedOn,
    updatedBy: bookingData.updatedBy,
    updatedAt: bookingData.updatedAt,
    updatedOn: bookingData.updatedOn
  });
  userNotifObj.save(function(error, resObj){});
  if (userData && userData.deviceNotifyToken && userData.preferences.allowNotifications) {
    commonService.pushNotification(userData.deviceNotifyToken, notificationObj.title, notificationObj.titleBody);
  }
}
