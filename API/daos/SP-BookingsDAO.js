/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var moment = require('moment');
var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var SP_NotificationsDAO = require('./SP-NotificationsDAO');
var CommonService = require('../services/CommonService');

var EU_Bookings = require('../models/EU-Bookings');
var SP_Users = require('../models/SP-Users');
var EU_Users = require('../models/EU-Users');
var EU_Notifications = require('../models/EU-Notifications');
var sendSMS = require('../config/sendSMS');
var SP_Properties = require('../models/SP-Properties');
var SP_Properties_Info = require('../models/SP-PropertyInfo');

// --- Begining of SP-BookingsDAO
module.exports = {
  // --- Begin getServiceProviderBookings:
  getServiceProviderBookings: function (pageNum, status, searchString, tokenDecodedData, callback) {
    var currentDay = moment().format("YYYY-MM-DD");
    var currentDayNumber = moment(currentDay).valueOf();
    switch(status){
      case 'all':
        var query = {
          'spServiceProviderId': tokenDecodedData.uspid,
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
      case 'Booked':
        var query = {
          'spServiceProviderId': tokenDecodedData.uspid,
          'isDeleted': false,
          '$and': [
            {'$or': [
              { 'checkInDateNumber': { '$gte': currentDayNumber } },
              { 'checkInDateNumber': { '$lte': currentDayNumber }, 'checkOutDateNumber': { '$gte': currentDayNumber } }
            ]},
            {'$or': [
              { 'euName': { $regex: searchString, $options: 'i' } },
              { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
              { 'bookingCode': { $regex: searchString, $options: 'i' } },
              { 'bookingStatus': { $regex: searchString, $options: 'i' } },
              { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
              { 'euEmail': { $regex: searchString, $options: 'i' } },
              { 'spLocationObj.area': { $regex: searchString, $options: 'i' } }
            ]}
          ]
        };
        break;
      case 'Completed':
        var query = {
          'spServiceProviderId': tokenDecodedData.uspid,
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
    .skip((pageNum - 1) * 10).limit(10)
    .populate('spPropertyId').populate('euUserId').populate('spPropertyInfoId')
    // .sort(status == 'all' ? { 'createdAt': -1 } : status == 'Booked' ? { 'checkInDateNumber': 1 } : { 'checkInDateNumber': -1 })
    .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP-BookingsDAO.js, at getServiceProviderBookings:', error);
        callback(error, { statusCode: '9999', result: {} });
      } else if (resultArray && resultArray.length > 0) {
        if (status == 'all') {
          var countQuery = {
            'spServiceProviderId': tokenDecodedData.uspid,
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
          }
        } else {
          var countQuery = {
            'spServiceProviderId': tokenDecodedData.uspid,
            // 'bookingStatus': status,
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
          }
        }
        var bookingArray = [];
        resultArray.forEach(function (bookObj) {
          var userObj = bookObj.euUserId;
          var decUserObj = {
            mobileNumber: !bookObj.euUserId.mobileNumber.includes('@') ? bookObj.euUserId.mobileNumber : '',
            email: bookObj.euUserId.email.includes('@') ? bookObj.euUserId.email : '',
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
        EU_Bookings.countDocuments(query).exec(function (errorCount, resultCount) {
          if (errorCount) {
            logger.error('There was an Un-known Error occured in daos/SP-UsersDAO.js, at getSPUsersListingData:', errorCount);
            var resultObj = { totalDocs: resultCount, bookingData: bookingArray };
            callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
          } else if (resultCount) {
            var resultObj = { totalDocs: resultCount, bookingData: bookingArray };
            callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
          } else {
            var resultObj = { totalDocs: resultCount, bookingData: bookingArray };
            callback(error, { httpCode: 200, statusCode: '0000', result: resultObj });
          }
        });
      } else {
        callback(error, { statusCode: '9997', result: {} });
      }
    });
  },
  // --- End getServiceProviderBookings:

  // --- Begin getBookingByRecordID:
  getBookingByRecordID: function (recordID, decodedTokenData, callback) {
    var query = {
      '_id': recordID,
      'isDeleted': false,
    };
    EU_Bookings.find(query)
    // .populate('serviceProviderObj')
    .exec(function (error, resultArray) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/EU_UserFavouriteDAO.js, at getBookingByRecordID:', error);
        callback(error, { statusCode: '9999', result: {} });
      } else if (resultArray && resultArray.length > 0) {
        callback(error, { statusCode: '0000', result: resultArray });
      } else {
        callback(error, { statusCode: '9997', result: {} });
      }
    });
  },
  // --- End getBookingByRecordID:


  // --- Begin getPropertiesToCreateBooking:
  getPropertiesToCreateBooking: function (query, pageNum, searchString, decodedTokenData, callback) {
    var limitCount = config.recordsCount;
    SP_Properties.find({spServiceProviderId: decodedTokenData.uspid}, {'_id': 1}).exec(function(pError, pResObj) {
      if(pError) {
        logger.error('There was an un-known Error occured in daos/EU-BookingsDAO.js, at getPropertiesToCreateBooking:', pError);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if(pResObj && pResObj.length > 0) {
        var sppIds = [];
        pResObj.forEach(function (item) {
            sppIds.push(item);
        });
        var pid = {'propertyId': { '$in': sppIds }};
        var query1 = JSON.parse((JSON.stringify(query) + JSON.stringify(pid)).replace(/}{/g, ','));
        SP_Properties_Info.find(query1).skip((pageNum - 1) * limitCount).
        populate('propertyId').
        limit(limitCount).exec(function(error, data) {
          if(error) {
            logger.error('There was an un-known Error occured in daos/EU-BookingsDAO.js, at getPropertiesToCreateBooking:', error);
            callback({httpCode: 500, statusCode: '9999', result: {}});
          } else if(data && data.length > 0) {
            SP_Properties_Info.countDocuments(query1).exec(function(errorCount, resultCount) {
              if(errorCount) {
                logger.error('There was an Un-known Error occured in daos/EU-BookingsDAO.js, at getPropertiesToCreateBooking:', errorCount);
                var resultObj = {totalDocs: data.length, homeData: data};
                callback(errorCount, { statusCode: '0000', result: resultObj });
              } else if(resultCount) {
                var resultObj = {totalDocs: resultCount, homeData: data};
                callback(errorCount, { statusCode: '0000', result: resultObj });
              } else {
                var resultObj = {totalDocs: data.length, homeData: data};
                callback(error, { statusCode: '0000', result: resultObj });
              }
            });
          } else {
            callback({httpCode: 400, statusCode: '9997', result: {}});
          }
        });
      } else {
        callback({httpCode: 400, statusCode: '9997', result: {}});
      }
    });
  },
  // --- End getPropertiesToCreateBooking:

 // --- Begin postEndUserBooking:
  postEndUserBooking: function(bookingObj, tokenDecodedData, callback) {
    var bookData = new EU_Bookings(bookingObj);
    bookData.save(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-BookingsDAO.js', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionEndUserBookings, id: resObj._id, value: resObj.bookingCode }, resObj);
        EU_Users.find({'_id': resObj.euUserId, 'isDeleted': false}, function(uError, uResObj) {
          if (error) {
            logger.error('There was an Error occured in daos/SP-BookingsDAO.js', uError);
          } else if(uResObj && uResObj[0]._id) {
            let notificationObj = {
              title: 'Room ' + resObj.bookingStatus,
              // titleBody: 'Hi ' + resObj.euName + ' You have a booking on ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle + '.\n' + 'Booking Code : ' + resObj.bookingCode + '.\n' + 'Contact : ' + resObj.spLocationObj.mobileNumber 
              titleBody: 'Hi ' + resObj.euName + ', '  + ' You have a booking on ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle 
            };
            let ntyUserObj = {recordId: resObj._id, type: 'Booking', spContact: resObj.spLocationObj ? resObj.spLocationObj.mobileNumber : '', bookingCode: resObj.bookingCode ? resObj.bookingCode : ''  }
            setEndUserBookingNotificationTokenData(resObj, uResObj, ntyUserObj, notificationObj, bookingObj && bookingObj.euMobileNumber ? bookingObj.euMobileNumber : '');
          } else {
            logger.error('No User found for send notification in daos/SP-BookingsDAO.js at postEndUserBooking');
          }
        });
        if(tokenDecodedData) {
          var ntyObj = {
            spId: tokenDecodedData.uspid,
            sp: tokenDecodedData.usp,
            spUserId: tokenDecodedData.iss,
            spName: tokenDecodedData.un
          };
          // let notificationObj = {title: 'Booked', titleBody: 'You have a Booking at' + ' ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle + '.\n' + 'Booking Code : ' + resObj.bookingCode + '.\n' + 'Booking Contact : ' + resObj.euMobileNumber }
          let notificationObj = {title: 'Booked', titleBody: 'You have a Booking at' + ' ' + moment(resObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resObj.spPropertyTitle }
          let ntyUserData = {recordId: resObj._id, type: 'Booking', contact: resObj.euMobileNumber, bookingCode: resObj.bookingCode }
          SP_NotificationsDAO.setSupplierNotificationTokenData(ntyObj, tokenDecodedData, ntyUserData, notificationObj, resObj.spLocationObj ? resObj.spLocationObj.mobileNumber : '', function(notifyResObj) {});
        }
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End postEndUserBooking:

   // --- Begin postEndUserBookingLifeCycle:
   postEndUserBookingLifeCycle: function(bookingLifeCycleObj, bookingCode, tokenDecodedData, callback) {
    bookingLifeCycleObj.save(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-BookingsDAO.js', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionEndUserBookingLifeCycle, id: resObj._id, value: bookingCode }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End postEndUserBookingLifeCycle:

  getSPBookingData: function(recordId, tokenDecodedData, callback) {
    let query = {
      '_id': recordId,
      'spServiceProviderId': tokenDecodedData.uspid,
      'isDeleted': false
    }
    EU_Bookings.findOne(query)
    .populate('spPropertyId')
    .populate('euUserId')
    .populate('spPropertyInfoId')
    .exec(function(error, data) {
      if(error) {
        logger.error('There was an Error occured in daos/SP-BookingsDAO.js at getSPBookingData', error);
        callback({ httpCode: 500, statusCode: '9999', result: {}});
      } else if(data && data._id) {
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
        callback({ httpCode: 200, statusCode: '0000', result: resultObj});
      } else {
        callback({httpCode: 400, statusCode: '9997', result: {}});
      }
    });
  },

   // --- Begin postNewUser:
   postNewUser: function(userData, tokenDecodedData, callback) {
    userData.save(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-BookingsDAO.js', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionEndUserUsers, id: resObj._id, value: resObj.userAccount }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End postNewUser:

    // --- Begin confirmCancelBooking Booking:
  confirmCancelBooking: function(reqBody, cancelBookingObj, tokenDecodedData, callback) {
    EU_Bookings.findOneAndUpdate({'_id': reqBody.bookingId, 'isDeleted': false}, {$set: cancelBookingObj}, {new: true}, function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-BookingsDAO.js', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        if(tokenDecodedData) {
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
            if (error) {
              logger.error('There was an Error occured in daos/SP-BookingsDAO.js at confirmCancelBooking', uError);
            } else if(uResObj && uResObj[0]._id) {
              let notificationObj = {
                title: 'Booking Cancelled',
                // titleBody: 'Hi ' + resultObj.euName + 'Your booking has beeen cancelled at' + resultObj.spPropertyTitle + ' from ' +  moment(resultObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resultObj.checkOutDate).format('MMM DD, YYYY h:mm A') + '.\n' + 'Booking Code : ' + resultObj.bookingCode + '.\n' + 'Contact : ' + resultObj.spLocationObj.mobileNumber 
                titleBody: 'Hi ' + resultObj.euName + ', ' + 'Your booking has been Cancelled at' + resultObj.spPropertyTitle + ' from ' +  moment(resultObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resultObj.checkOutDate).format('MMM DD, YYYY h:mm A') 
              };
              let ntyUserObj = {recordId: resultObj._id, type: 'Booking', spContact: resultObj.spLocationObj ? resultObj.spLocationObj.mobileNumber : '', bookingCode: resObj.bookingCode ? resObj.bookingCode : ''  }  
              setEndUserBookingNotificationTokenData(resultObj, uResObj, ntyUserObj, notificationObj, tokenDecodedData.umn ? tokenDecodedData.umn : '');
            } else {
              logger.error('No User found for send notification in daos/SP-BookingsDAO.js at confirmCancelBooking');
            }
          });
          if(tokenDecodedData) {
            var ntyObj = {
              spId: tokenDecodedData.uspid,
              sp: tokenDecodedData.usp,
              spUserId: tokenDecodedData.iss,
              spName: tokenDecodedData.un
            };
            // let notificationObj = {title: 'Booking Cancelled', titleBody: 'Cancelled Booking at' + ' ' + moment(resultObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resultObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resultObj.spPropertyTitle + '.\n' + 'Booking Code : ' + resultObj.bookingCode + '.\n' + 'Booking Contact : ' + resultObj.euMobileNumber}
            let notificationObj = {title: 'Booking Cancelled', titleBody: 'Cancelled Booking at' + ' ' + moment(resultObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resultObj.checkOutDate).format('MMM DD, YYYY h:mm A') + ' at ' + resultObj.spPropertyTitle }
            let ntyUserData = {recordId: resultObj._id, type: 'Booking', contact: resultObj.euMobileNumber, bookingCode: resObj.bookingCode }
            SP_NotificationsDAO.setSupplierNotificationTokenData(ntyObj, tokenDecodedData, ntyUserData, notificationObj, resultObj.spLocationObj ? resultObj.spLocationObj.mobileNumber : '', function(notifyResObj) {});
          }
        }
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionEndUserBookings, id: resObj._id, value: resObj.bookingCode }, cancelBookingObj);
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
            logger.error('There was an Error occured in daos/EU-BookingsDAO.js' + error);
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
                logger.error('There was an Error occured in daos/SP-BookingsDAO.js at putEndUserBookingData'+ uError);
              } else if(uResObj && uResObj[0]._id) {
                let notificationObj = {
                  title: 'Room ' + resultObj.bookingStatus,
                  // titleBody: 'Hi ' + resultObj.euName + 'You Updated the booking details for ' + resultObj.spPropertyTitle + ' from ' +  moment(resultObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resultObj.checkOutDate).format('MMM DD, YYYY h:mm A') + '.\n' + 'Booking Code : ' + resultObj.bookingCode + '.\n' + 'Contact : ' + resultObj.spLocationObj.mobileNumber 
                  titleBody: 'Hi ' + resultObj.euName + ', ' + 'You Updated the booking details for ' + resultObj.spPropertyTitle + ' from ' +  moment(resultObj.checkInDate).format('MMM DD, YYYY h:mm A') + ' to ' + moment(resultObj.checkOutDate).format('MMM DD, YYYY h:mm A') 
                };
                let ntyUserObj = {recordId: resultObj._id, type: 'Booking', spContact: resultObj.spLocationObj ? resultObj.spLocationObj.mobileNumber : '', bookingCode: resultObj.bookingCode ? resultObj.bookingCode : ''  }  
                setEndUserBookingNotificationTokenData(resultObj, uResObj, ntyUserObj, notificationObj, tokenDecodedData.umn ? tokenDecodedData.umn : '' );
              } else {
                logger.error('No User found for send notification in daos/SP-BookingsDAO.js at putEndUserBookingData');
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

    // --- Begin getSpPropertyInfo:  
    getSpPropertyInfo:function(bookingId, callback) {
      var query = {
          '_id': bookingId,
          'isDeleted': false,    
      };
      EU_Bookings.findOne(query)
      .populate('spPropertyInfoId')
      .exec(function(error, data) {
      if(error) {
        logger.error('There was an Error occured in daos/EU-BookingsDAO.js.js,', error);
        callback(error,{ httpCode: 500, statusCode: '9999', result: {}});
      } else if(data) {
        callback(error, { httpCode: 200, statusCode: '0000', result: data});
      } else {
        callback(error, {httpCode: 400, statusCode: '9997', result: {}});
      }
    });
    // --- End getSpPropertyInfo:  
  },
};
// --- End of SP-BookingsDAO

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
    userNotifObj.save(function(err, resObj){
      AuditingInfoDAO.spAuditing({iss: item.euUserId, ua: item.createdBy, un: item.euName}, 'Create', {name: config.collectionEndUserNotifications, id: resObj._id, value: resObj.notificationTitle }, resObj);
      // if(euMobileNumber) {
      //   sendSMS.sendSMS(euMobileNumber, notificationObj.titleBody, function(smsError, smsRes) {
      //     if(smsError) {
      //       logger.error('There was an Un-known Error in DAO/SP-BookingsDAO.js at setEndUserBookingNotificationTokenData - sendSMS:', smsError);
      //     }
      //   });
      //   sendSMS.sendWhatsApp(euMobileNumber, notificationObj.titleBody, function(waResObj) {
      //     EU_Notifications.updateOne({_id: resObj._id}, {$set: {notifWhatsAppRes: waResObj}}, function(error, data) {});
      //   });
      // }
    });
    if(userData && userData[0].deviceNotifyToken && userData[0].preferences.allowNotifications) {
      CommonService.pushNotification(userData[0].deviceNotifyToken, notificationObj.title, notificationObj.titleBody);
    }
}

