/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var EU_BookingPayments = require('../models/EU-BookingPayments');
var EU_Bookings = require('../models/EU-Bookings');
var CommonService = require('../services/CommonService');

// --- Begin of EU-BookingsPaymentsDAO
module.exports = {
  getBookingPayments: function(bookingID, grandTotal, callback) {
    var query = {
      'bookingId': bookingID,
      'paymentStatus': {'$ne': 'Success'},
      'isDeleted': false
    };
    EU_BookingPayments.findOne(query).exec(function(error, data) {
      if (error) {
        logger.error('There was an Un-Known Error occured in daos/EU-BookingsPaymentsDAO.js'+
          ' at getBookingPayments:', error);
        callback(error, {});
      } else if (data && data._id) {
        EU_BookingPayments.deleteOne({_id: data._id}, function(err, delData) {
          if (err) {
            logger.error('There was an Un-Known Error occured in daos/EU-BookingsPaymentsDAO.js'+
            ' at getBookingPayments - deleteOne:', err);
            callback(err, data);
          } else {
            callback(error, {});
          }
        });
      } else {
        callback(error, data);
      }
    });
  },

  updateBookingPayments: function(reqObj, bookingPaymentID, decodedTokenData, callback) {
    var updateObj = setUpdateBookingPaymentsData(reqObj);
    EU_BookingPayments.updateOne({_id: bookingPaymentID}, {$set: updateObj.bookingPaymentObj}, function(error, data) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/EU-BookingsPaymentsDAO.js,'+
          ' at updateBookingPayments:', error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if (data.nModified == 1) {
        AuditingInfoDAO.euAuditing({iss: decodedTokenData.iss, un: reqObj.contactPerson, ua: decodedTokenData.ua}, 'Update', { name: config.collectionEndUserBookingPayments, id: bookingPaymentID, value: 'Booking Payment' }, updateObj.bookingPaymentObj);
        EU_Bookings.updateOne({_id: reqObj.bookingInfo._id}, {$set: updateObj.bookingObj}, function(bookingError, bookingResObj) {
          AuditingInfoDAO.euAuditing({iss: decodedTokenData.iss, un: reqObj.contactPerson, ua: decodedTokenData.ua}, 'Update', { name: config.collectionEndUserBookings, id: reqObj.bookingInfo._id, value: 'Booking' }, updateObj.bookingObj);
        });
        callback({httpCode: 200, statusCode: '0000', result: {}});
      } else {
        callback({httpCode: 400, statusCode: '9993', result: {}});
      }
    });
  },

  setBookingPayments: function(custPaymentObj, custBookingObj, decodedTokenData, callback) {
    var bookingPaymentObj = new EU_BookingPayments(custPaymentObj);
    bookingPaymentObj.save(function(err, data) {
      if (err) {
        logger.error('There was an Un-Known Error occured in daos/EU-BookingsPaymentsDAO.js'+
          ' at setBookingPayments:', err);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if (data && data._id) {
        AuditingInfoDAO.euAuditing({iss: decodedTokenData.iss, un: custBookingObj.euName, ua: decodedTokenData.ua}, 'Create', { name: config.collectionEndUserBookingPayments, id: data._id, value: 'Booking Payment' }, custPaymentObj);
        var uiInfo = { uiData: JSON.parse(data.uiData), uiAuthObj: JSON.parse(data.uiAuthObj ? CommonService.decrypt(data.uiAuthObj) : null)};
        data.uiData = undefined;
        data.uiAuthObj = undefined;
        var resultObj = JSON.parse((JSON.stringify(data) + JSON.stringify(uiInfo)).replace(/}{/g, ','));
        EU_Bookings.updateOne({_id: data.bookingId}, {$set: custBookingObj}, function(error, bookingResObj) {
          AuditingInfoDAO.euAuditing({iss: decodedTokenData.iss, un: custBookingObj.euName, ua: decodedTokenData.ua}, 'Update', { name: config.collectionEndUserBookings, id: data.bookingId, value: 'Booking' }, custBookingObj);
        });
        callback({httpCode: 200, statusCode: '0000', result: resultObj});
      } else {
        callback({httpCode: 400, statusCode: '9993', result: {}});
      }
    });
  },

  updateCustomerBookingPaymentData: function(recordId, updateBookingObj, encryptedPaymentId, callback) {
    EU_BookingPayments.updateOne({txnID: recordId, paymentCode: encryptedPaymentId},
    {$set: updateBookingObj.bookingPaymentsObj}, function(bookingPayError, bookingPayData) {
      AuditingInfoDAO.euAuditing({iss: 'SAID01', un: 'Super Admin', ua: 'superadmin'}, 'Update', { name: config.collectionEndUserBookingPayments, id: recordId, value: 'Booking Payment TxnID' }, updateBookingObj.bookingPaymentsObj);
    });
    var bookingID = recordId.split('TXNID')[0];
    EU_Bookings.findOneAndUpdate({_id: bookingID}, {$set: updateBookingObj.bookingObj}, {new: true})
    // .populate('euUserId')
    .exec(function(error, bookingData) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/EU-BookingsPaymentsDAO.js, at updateCustomerBookingPaymentData:'+ error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if (bookingData && bookingData.bookingStatus == 'Booked') {
        AuditingInfoDAO.euAuditing({iss: 'SAID01', un: 'Super Admin', ua: 'superadmin'}, 'Update', { name: config.collectionEndUserBookings, id: bookingID, value: 'Booking' }, updateBookingObj.bookingObj);
        callback({httpCode: 200, statusCode: '0000', result: bookingData});
      } else {
        logger.error('There was an Error occured in daos/EU-BookingsPaymentsDAO.js, at updateCustomerBookingPaymentData: Booking Confirm Failed');
        callback({httpCode: 400, statusCode: '9992', result: {}});
      }
    });
  },

  bookingPaymentFailed: function(recordId, bookingObj, bookingPaymentsObj, callback) {
    EU_BookingPayments.updateOne({txnID: recordId}, {$set: bookingPaymentsObj}, function(bookingPayError, bookingPayData) {
      AuditingInfoDAO.euAuditing({iss: 'SAID01', un: 'Super Admin', ua: 'superadmin'}, 'Update', { name: config.collectionEndUserBookingPayments, id: recordId, value: 'Booking Payment TxnID' }, bookingPaymentsObj);
    });
    var bookingID = recordId.split('TXNID')[0];
    EU_Bookings.findOneAndUpdate({_id: bookingID}, {$set: bookingObj}, {new: true})
    .exec(function(error, bookingData) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/EU-BookingsPaymentsDAO.js, at bookingPaymentFailed:'+ error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if (bookingData && bookingData.bookingStatus == 'Booked') {
        AuditingInfoDAO.euAuditing({iss: 'SAID01', un: 'Super Admin', ua: 'superadmin'}, 'Update', { name: config.collectionEndUserBookings, id: bookingID, value: 'Booking' }, bookingObj);
        callback({httpCode: 200, statusCode: '0000', result: bookingData});
      } else {
        logger.error('There was an Error occured in daos/EU-BookingsPaymentsDAO.js, at bookingPaymentFailed: Booking Confirm Failed');
        callback({httpCode: 400, statusCode: '9992', result: {}});
      }
    });
  },

  mobilePaymentSetup: function(paymentTxnID, updatePaymentObj, callback) {
    var query = {txnID: paymentTxnID, isDeleted: false};
    EU_BookingPayments.findOne(query).populate('bookingId').exec(function(error, data) {
      if(error) {
        logger.error('There was an Un-Known Error occured in daos/EU-BookingsPaymentsDAO.js',
        ' at mobilePaymentSetup - findOne:', error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if(data && data._id) {
        var bookingObj = data.bookingId
        var decBookingObj = {
          euMobileNumber: data.bookingId.euMobileNumber,
          euEmail: data.bookingId.euEmail ? CommonService.decrypt(data.bookingId.euEmail) : '',
        };
        var modifiedBookingObj = JSON.parse((JSON.stringify(bookingObj) + JSON.stringify(decBookingObj)).replace(/}{/g, ','))
        var bookingPaymentObj = data;
        var decObj = {
          paymentUrl: data.paymentUrl,
          paymentCode: data.paymentModeCode ? CommonService.decrypt(data.paymentModeCode) : '',
          euEmail: data.euEmail ? CommonService.decrypt(data.euEmail) : '',
          euPhone: data.euPhone ? CommonService.decrypt(data.euPhone) : '',
          uiAuthObj: data.uiAuthObj ? JSON.parse(CommonService.decrypt(data.uiAuthObj)) : '',
          uiData: data.uiData,
          bookingId: modifiedBookingObj
        };
        var resultObj = JSON.parse((JSON.stringify(bookingPaymentObj) + JSON.stringify(decObj)).replace(/}{/g, ','));
        EU_BookingPayments.updateOne({_id: data._id}, {$set: updatePaymentObj}, function(paymentError, paymentResObj) {
          if(paymentError) {
            logger.error('There was an Un-Known Error occured in daos/EU-BookingsPaymentsDAO.js',
            ' at mobilePaymentSetup - update:', paymentError);
            callback({httpCode: 500, statusCode: '9999', result: {}});
          } else if(paymentResObj.nModified == 1) {
            AuditingInfoDAO.euAuditing({iss: 'SAID01', un: 'Super Admin', ua: 'superadmin'}, 'Update', { name: config.collectionEndUserBookingPayments, id: data._id, value: 'Booking Payment' }, updatePaymentObj);
            callback({httpCode: 200, statusCode: '0000', result: resultObj});
          } else {
            callback({httpCode: 400, statusCode: '9997', result: resultObj});
          }
        });
      } else {
        callback({httpCode: 400, statusCode: '9997', result: resultObj});
      }
    });
  },

  getPaymentSetup: function(paymentTxnID, callback) {
    EU_BookingPayments.findOne({'txnID': paymentTxnID, 'isDeleted': false})
    .populate('bookingId').exec(function(error, bookingPayments) {
      if (error) {
        logger.error('There was an Un-Known Error occured in daos/EU-BookingsPaymentsDAO.js',
          ' at getPaymentSetup:', error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if (bookingPayments && bookingPayments._id) {
        var bookingObj = bookingPayments.bookingId;
        var decBookingObj = {
          paymentMode: bookingPayments.bookingId.paymentMode ? CommonService.decrypt(bookingPayments.bookingId.paymentMode) : '',
          paymentModeCode: bookingPayments.bookingId.paymentModeCode ? CommonService.decrypt(bookingPayments.bookingId.paymentModeCode) : '',
          paymentStatus: bookingPayments.bookingId.paymentStatus,
          paymentUrl: bookingPayments.bookingId.paymentUrl ? CommonService.decrypt(bookingPayments.bookingId.paymentUrl) : '',
          paymentCode: bookingPayments.bookingId.paymentCode ? CommonService.decrypt(bookingPayments.bookingId.paymentCode) : '',
          euMobileNumber: bookingPayments.bookingId.euMobileNumber,
          euEmail: bookingPayments.bookingId.euEmail ? CommonService.decrypt(bookingPayments.bookingId.euEmail) : '',
        };
        var modifiedBookingObj = JSON.parse((JSON.stringify(bookingObj) + JSON.stringify(decBookingObj)).replace(/}{/g, ','))
        var bookingPaymentObj = bookingPayments;
        var decObj = {
          paymentUrl: bookingPayments.paymentUrl,
          paymentCode: bookingPayments.paymentModeCode ? CommonService.decrypt(bookingPayments.paymentModeCode) : '',
          paymentResMode: bookingPayments.paymentResMode ? CommonService.decrypt(bookingPayments.paymentResMode) : '',
          paymentResModeCode: bookingPayments.paymentResModeCode ? CommonService.decrypt(bookingPayments.paymentResModeCode) : '',
          paymentMode: bookingPayments.paymentMode ? CommonService.decrypt(bookingPayments.paymentMode) : '',
          euEmail: bookingPayments.euEmail ? CommonService.decrypt(bookingPayments.euEmail) : '',
          euPhone: bookingPayments.euPhone ? CommonService.decrypt(bookingPayments.euPhone) : '',
          uiAuthObj: bookingPayments.uiAuthObj ? JSON.parse(CommonService.decrypt(bookingPayments.uiAuthObj)) : '',
          uiData: bookingPayments.uiData,
          bookingId: modifiedBookingObj
        };
        var resultObj = JSON.parse((JSON.stringify(bookingPaymentObj) + JSON.stringify(decObj)).replace(/}{/g, ','));
        callback({httpCode: 200, statusCode: '0000', result: resultObj});
      } else {
        callback({httpCode: 400, statusCode: '9997', result: {}});
      }
    });
  },

  getBookingPaymentData: function(paymentResHash, callback) {
    EU_BookingPayments.findOne({'paymentResHash': paymentResHash, 'isDeleted': false})
    .populate('bookingId').exec(function(error, bookingPayments) {
      if (error) {
        logger.error('There was an Un-Known Error occured in daos/EU-BookingsPaymentsDAO.js',
          ' at getBookingPaymentData:', error);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if (bookingPayments && bookingPayments._id) {
        var bookingObj = bookingPayments.bookingId;
        var decBookingObj = {
          paymentMode: bookingPayments.bookingId.paymentMode ? CommonService.decrypt(bookingPayments.bookingId.paymentMode) : '',
          paymentModeCode: bookingPayments.bookingId.paymentModeCode ? CommonService.decrypt(bookingPayments.bookingId.paymentModeCode) : '',
          paymentStatus: bookingPayments.bookingId.paymentStatus,
          paymentUrl: bookingPayments.bookingId.paymentUrl ? CommonService.decrypt(bookingPayments.bookingId.paymentUrl) : '',
          paymentCode: bookingPayments.bookingId.paymentCode ? CommonService.decrypt(bookingPayments.bookingId.paymentCode) : '',
          euMobileNumber: bookingPayments.bookingId.euMobileNumber,
          euEmail: bookingPayments.bookingId.euEmail ? CommonService.decrypt(bookingPayments.bookingId.euEmail) : '',
        };
        var modifiedBookingObj = JSON.parse((JSON.stringify(bookingObj) + JSON.stringify(decBookingObj)).replace(/}{/g, ','))
        var bookingPaymentObj = bookingPayments;
        var decObj = {
          paymentUrl: bookingPayments.paymentUrl,
          paymentCode: bookingPayments.paymentModeCode ? CommonService.decrypt(bookingPayments.paymentModeCode) : '',
          paymentResMode: bookingPayments.paymentResMode ? CommonService.decrypt(bookingPayments.paymentResMode) : '',
          paymentResModeCode: bookingPayments.paymentResModeCode ? CommonService.decrypt(bookingPayments.paymentResModeCode) : '',
          paymentMode: bookingPayments.paymentMode ? CommonService.decrypt(bookingPayments.paymentMode) : '',
          euEmail: bookingPayments.euEmail ? CommonService.decrypt(bookingPayments.euEmail) : '',
          euPhone: bookingPayments.euPhone ? CommonService.decrypt(bookingPayments.euPhone) : '',
          uiAuthObj: bookingPayments.uiAuthObj ? JSON.parse(CommonService.decrypt(bookingPayments.uiAuthObj)) : '',
          uiData: bookingPayments.uiData,
          bookingId: modifiedBookingObj
        };
        var resultObj = JSON.parse((JSON.stringify(bookingPaymentObj) + JSON.stringify(decObj)).replace(/}{/g, ','));

        callback({httpCode: 200, statusCode: '0000', result: resultObj});
      } else {
        callback({httpCode: 400, statusCode: '9997', result: {}});
      }
    });
  },
  
  getEUBooking: function(bookingId, callback) {
    EU_Bookings.findOne({'_id': bookingId}).exec(function(error, bookingInfo) {
      if (error) {
        logger.error('There was an Un-Known Error occured in daos/EU-BookingsPaymentsDAO.js',
        ' at getEUBooking:', error);
      callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if (bookingInfo && bookingInfo._id) {
        callback(bookingInfo)
      } else {
        callback({httpCode: 400, statusCode: '9997', result: {}});
      }
    })
  },
  deleteEndUsersPayment: function (bookingId, paymentId, tokenDecodedData, callback) {
    EU_BookingPayments.findOneAndUpdate({'_id': paymentId, 'paymentStatus': 'Pending'}, { $set: {'isDeleted': true} }, {new: true}).exec(function(err, payResObj) {
      if (err) {
        logger.error('There was an Un-Known Error occured in daos/EU-BookingsPaymentsDAO.js of EU_BookingPayments',
        ' at deleteEndUsersPayment:', err);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if (payResObj && payResObj._id) {
        EU_Bookings.findOneAndUpdate({'_id': bookingId}, { $set: {'isDeleted': true} }, {new: true}).exec(function(error, resObj) {
          if(error) {
            logger.error('There was an Un-Known Error occured in daos/EU-BookingsPaymentsDAO.js EU_Bookings',
            ' at deleteEndUsersPayment:', error);
            callback({httpCode: 500, statusCode: '9999', result: {}});
          } else if(resObj && resObj._id) {
            callback({httpCode: 200, statusCode: '0000', result: resObj});
          } else {
            callback({httpCode: 400, statusCode: '9997', result: {}});
          }
        });
      } else {
        callback({httpCode: 400, statusCode: '9997', result: {}});
      }
    })
  }
}

/**
 * @param {object} reqObj object
 * @return {object}
 */
function setUpdateBookingPaymentsData(reqObj) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      bookingPaymentObj: {
        uiToken: reqObj.token ? reqObj.token : null,
        uiAuthObj: reqObj.authObj ? reqObj.authObj : null,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      },
      bookingObj: {
        euName: reqObj.contactPerson,
        euMobileNumber: reqObj.contactNumber,
        //  customerEmail: reqObj.contactEmail ? reqObj.contactEmail : null,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      }
    };
    return updateObj;
  }
  