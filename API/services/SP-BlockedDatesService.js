/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var SP_NotificationsDAO = require('../daos/SP-NotificationsDAO');
var SP_PropertyBlockings = require('../models/SP-PropertyBlockings');
var SP_BlockedDatesDAO = require('../daos/SP-BlockedDatesDAO');
var SP_Users = require('../models/SP-Users');
var moment = require('moment');

module.exports = {
  // -- Begin : createSPPropertyBlockedDates
  createSPPropertyBlockedDates: function (reqObj, tokenDecodedData, callback) {
    if (reqObj.blockingType == 'Continuous Blocking') {
      var fromDate = moment.utc(reqObj.blockingFromDate).format('YYYY-MM-DD');
      var fromNumber = moment(fromDate, 'YYYY-MM-DD').valueOf();
      var toDate = moment.utc(reqObj.blockingToDate).format('YYYY-MM-DD');
      var toNumber = moment(toDate, 'YYYY-MM-DD').valueOf();
      var query = {
        'spServiceProviderId': reqObj.spServiceProviderId,
        'spPropertyId': reqObj.propertyID,
        '$or': [
          { 'checkInDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
          { 'checkOutDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
          { '$and': [{ 'checkInDateNumber': { '$lte': fromNumber } }, { 'checkOutDateNumber': { '$gte': toNumber } }] }
        ],
        'bookingStatus': { '$nin': ['Completed', 'Cancelled'] },
        'isDeleted': false
      };
      var query1 = {
        'spServiceProviderId': reqObj.spServiceProviderId,
        'propertyId': reqObj.propertyID,
        '$or': [
          { 'blockingFromDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
          { 'blockingToDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
          { '$and': [{ 'blockingFromDateNumber': { '$lte': fromNumber } }, { 'blockingToDateNumber': { '$gte': toNumber } }] }
        ],
        'isDeleted': false
      };
      SP_BlockedDatesDAO.checkBlockedDatesIsAvailable(query1, function (avResObj) {
        if (avResObj.statusCode == '9997') {
          SP_BlockedDatesDAO.checkBlockedDatesInBookings(query, function (resObj) {
            if (resObj.statusCode == '0000') {
              callback({ httpCode: 200, statusCode: '1011', result: {} });
            } else if (resObj.statusCode == '9997') {
              var currentUTC = CommonService.currentUTCObj();
              var blObj = setPropertyBlockedContinueDates(reqObj, tokenDecodedData, currentUTC);
              var blockingData = new SP_PropertyBlockings(blObj);
              SP_BlockedDatesDAO.createSPPropertyBlockedDates(blockingData, tokenDecodedData, function (blResObj) {
                callback({ httpCode: blResObj.httpCode, statusCode: blResObj.statusCode, result: blResObj.result });
              });
            } else {
              callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
            }
          });
        } else {
          callback({ httpCode: avResObj.httpCode, statusCode: avResObj.statusCode, result: avResObj });
        }
      });
    } else {
      var currentUTC = CommonService.currentUTCObj();
      var dates = [];
      setPropertyBlockedRandomDates(0, reqObj, reqObj.dateArray, tokenDecodedData, currentUTC, dates, function (ranResObj) {
        // callback({ httpCode: ranResObj.httpCode, statusCode: ranResObj.statusCode, result: {} });
        if (ranResObj.statusCode == '1013') {
          callback({ httpCode: ranResObj.httpCode, statusCode: ranResObj.statusCode, result: dates });
        } else if(ranResObj.statusCode == '1011') {
          callback({ httpCode: ranResObj.httpCode, statusCode: ranResObj.statusCode, result: {} });
        } else {
          callback({ httpCode: '200', statusCode: '0000', result: dates });
        }
      });
    }
  },
  // -- End : createSPPropertyBlockedDates

  // -- Begin : getPropertyBlockedDates
  getPropertyBlockedDates: function (propertyID, tokenDecodedData, callback) {
    SP_BlockedDatesDAO.getPropertyBlockedDates(propertyID, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // -- End : getPropertyBlockedDates

  // -- Begin : getPropertyPastBlockedDates
  getPropertyPastBlockedDates: function (propertyID, tokenDecodedData, callback) {
    SP_BlockedDatesDAO.getPropertyPastBlockedDates(propertyID, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // -- End : getPropertyPastBlockedDates

  // -- Begin : deletePropertyBlockedDates
  deletePropertyBlockedDates: function (blockedID, tokenDecodedData, callback) {
    const currentUTC = CommonService.currentUTCObj();
    var upObj = {
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: 'superadmin',
      updatedOn: currentUTC.currentUTCDateTimeString,
      isDeleted: true
    };
    SP_BlockedDatesDAO.deletePropertyBlockedDates(blockedID, upObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // -- End : deletePropertyBlockedDates

  // -- Begin : updateSPPropertyBlockedDates
  updateSPPropertyBlockedDates: function (reqObj, blockingID, tokenDecodedData, callback) {
    var fromDate = moment.utc(reqObj.blockingFromDate).format('YYYY-MM-DD');
    //  var dayNext = moment(fromDate).add(1, 'days');
    var fromNumber = moment(fromDate, 'YYYY-MM-DD').valueOf();
    // var dayNextNumber = moment(dayNext, 'YYYY-MM-DD').valueOf();
    var toDate = moment.utc(reqObj.blockingToDate).format('YYYY-MM-DD');
    var toNumber = moment(toDate, 'YYYY-MM-DD').valueOf();
    if (reqObj.blockingType == 'Continuous Blocking') {
      var query = {
        'spServiceProviderId': reqObj.spServiceProviderId,
        'spPropertyId': reqObj.propertyID,
        '$or': [
          { 'checkInDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
          { 'checkOutDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
          { '$and': [{ 'checkInDateNumber': { '$lte': fromNumber } }, { 'checkOutDateNumber': { '$gte': toNumber } }] }
        ],
        'bookingStatus': { '$nin': ['Completed', 'Cancelled'] },
        'isDeleted': false
      };
      var query1 = {
        'spServiceProviderId': reqObj.spServiceProviderId,
        'propertyId': reqObj.propertyID,
        '_id': { '$nin': blockingID },
        '$or': [
          { 'blockingFromDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
          { 'blockingToDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
          { '$and': [{ 'blockingFromDateNumber': { '$lte': fromNumber } }, { 'blockingToDateNumber': { '$gte': toNumber } }] }
        ],
        'isDeleted': false
      };
      SP_BlockedDatesDAO.checkBlockedDatesIsAvailable(query1, function (resObj) {
        if (resObj.statusCode == '9997') {
          SP_BlockedDatesDAO.checkBlockedDatesInBookings(query, function (resObj) {
            if (resObj.statusCode == '9997') {
              updateSpPropertyBlockingData(reqObj, blockingID, tokenDecodedData, function (upResObj) {
                callback({ httpCode: upResObj.httpCode, statusCode: upResObj.statusCode, result: upResObj.result });
              });
            } else if(resObj.statusCode == '0000') {
               callback({ httpCode: 200, statusCode: '1011', result: {} });
            } else {
              callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
            }
          });
        } else {
          callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        }
      });
    } else {
      var query = {
        'spServiceProviderId': reqObj.spServiceProviderId,
        'spPropertyId': reqObj.propertyID,
        '$or': [
          { 'checkInDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
          { 'checkOutDateNumber': { '$gte': fromNumber, '$lte': fromNumber } },
          { '$and': [{ 'checkInDateNumber': { '$lte': fromNumber } }, { 'checkOutDateNumber': { '$gte': fromNumber } }] }
        ],
        'bookingStatus': { '$nin': ['Completed', 'Cancelled'] },
        'isDeleted': false
      };
      // var query1 = {
      //   'spServiceProviderId': reqObj.spServiceProviderId,
      //   'propertyId': reqObj.propertyID,
      //   '_id': { '$nin': blockingID },
      //   '$or': [
      //     { 'blockingFromDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
      //     { 'blockingToDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
      //     { '$and': [{ 'blockingFromDateNumber': { '$lte': fromNumber } }, { 'blockingToDateNumber': { '$gte': toNumber } }] }
      //   ],
      //   'isDeleted': false
      // };
      var query1 = {
        'spServiceProviderId': reqObj.spServiceProviderId,
        'propertyId': reqObj.propertyID,
        '_id': { '$nin': blockingID },
        '$or': [
          { 'blockingFromDateNumber': { '$gte': fromNumber, '$lte': fromNumber } },
          { 'blockingToDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
          { '$and': [{ 'blockingFromDateNumber': { '$lte': fromNumber } }, { 'blockingToDateNumber': { '$gte': fromNumber } }] }
        ],
        'isDeleted': false
      };
      SP_BlockedDatesDAO.checkBlockedDatesIsAvailable(query1, function (resObj) {
        if (resObj.statusCode == '9997') {
          SP_BlockedDatesDAO.checkBlockedDatesInBookings(query, function (bkResObj) {
            if (bkResObj.statusCode == '9997') {
              updateSpPropertyBlockingData(reqObj, blockingID, tokenDecodedData, function (upResObj) {
                callback({ httpCode: upResObj.httpCode, statusCode: upResObj.statusCode, result: upResObj.result });
              });
            } else if(bkResObj.statusCode == '0000') {
              callback({ httpCode: 200, statusCode: '1011', result: {} });
            } else {
              callback({ httpCode: bkResObj.httpCode, statusCode: bkResObj.statusCode, result: bkResObj.result });
            }
          });
        } else {
          callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        }
      });
    }
  },
  // -- End : updateSPPropertyBlockedDates

  getBlockedDatesNotifications: function(callback) {
    var utcMoment = moment.utc().format('YYYY-MM-DD');
    var today = moment(utcMoment, 'YYYY-MM-DD').valueOf();
    var addDays = moment(utcMoment).add(3, 'days').valueOf();
    var query = {
      '$or': [
        { 'blockingFromDateNumber': { '$gte': today, '$lte': addDays } },
        { 'blockingToDateNumber': { '$gte': today, '$lte': addDays } },
        { '$and': [{ 'blockingFromDateNumber': { '$lte': today } }, { 'blockingToDateNumber': { '$gte': addDays } }] }
      ],
    };
    SP_BlockedDatesDAO.getBlockedDates(query, function(resObj) {
      if(resObj.statusCode == '0000') {
        resObj.result.forEach(item => {
          SP_Properties.find({ '_id': item.propertyId, 'isDeleted': false }, function (pError, pResObj) {
            if (pError) {
              logger.error('There was an Error occured in daos/SP_BlockedDatesService.js at get SP_Properties query', pError);
            } else if (pResObj && pResObj.createdById) {
              var query1 = {
                '_id': pResObj.createdById,
                'userStatus': 'Active',
                // 'userType': 'Owner',
                'isDeleted': false
              };
              SP_Users.findOne(query1, function (spError, spResObj) {
                if (spError) {
                  logger.error('There was an Error occured in daos/SP_Users.js', spError);
                } else if (spResObj && spResObj._id) {
                  var ntyObj = {
                    spId: spResObj.spServiceProviderId,
                    sp: spResObj.spServiceProvider,
                    spUserId: spResObj._id,
                    spName: spResObj.name
                  };
                  let notificationObj = {title: 'Welcome To AM to PM', titleBody: 'You have Blocked ' +  pResObj.propertyTitle + ' from ' + item.blockingFromDate + '  to ' + item.blockingToDate }
                  let ntyUserData = {recordId: item.propertyId, type: 'Property', contact: spResObj.mobileNumber }

                  SP_NotificationsDAO.setSupplierNotificationTokenData(ntyObj, spResObj, ntyUserData, notificationObj, spResObj.mobileNumber, function (notifyResObj) { });
                } else {
                  logger.error('No User availabel in daos/SP_BlockedDatesDAO.js at get SP_Users query');
                }
              });
            } else {
              logger.error('No property availabel in daos/SP_BlockedDatesDAO.js at get SP_Properties query createdById not found');
            }
          });
        });
      } else {
        logger.error('no blocked dates available daos/SP_BlockedDatesDAO.js at getBlockedDatesNotifications');
      }
    });
  } 
};

var setPropertyBlockedRandomDates = function (i, reqObj, dateArray, tokenDecodedData, currentUTC, dates, callback) {
  if (i < dateArray.length) {
    var date = moment.utc(dateArray[i]).format('YYYY-MM-DD');
    var dateNumber = moment(date, 'YYYY-MM-DD').valueOf();

    var query = {
      'spServiceProviderId': reqObj.spServiceProviderId,
      'spPropertyId': reqObj.propertyID,
      '$or': [
        { 'checkInDateNumber': { '$gte': dateNumber, '$lte': dateNumber } },
        { 'checkOutDateNumber': { '$gte': dateNumber, '$lte': dateNumber } },
        { '$and': [{ 'checkInDateNumber': { '$lte': dateNumber } }, { 'checkOutDateNumber': { '$gte': dateNumber } }] }
      ],
      'bookingStatus': { '$nin': ['Completed', 'Cancelled'] },
      'isDeleted': false
    };
    var query1 = {
      'spServiceProviderId': reqObj.spServiceProviderId,
      'propertyId': reqObj.propertyID,
      // '$or': [
      //   { 'blockingFromDateNumber': { '$gte': dateNumber, '$lt': dayNextNumber }},
      //   { 'blockingToDateNumber': { '$gte': dateNumber, '$lt': dayNextNumber } },
      //   { '$and': [{ 'blockingFromDateNumber': { '$lte': dateNumber } }, { 'blockingToDateNumber': { '$gte': dateNumber } }] }
      // ],
      '$or': [
        { 'blockingFromDateNumber': { '$gte': dateNumber, '$lte': dateNumber } },
        { 'blockingToDateNumber': { '$gte': dateNumber, '$lte': dateNumber } },
        { '$and': [{ 'blockingFromDateNumber': { '$lte': dateNumber } }, { 'blockingToDateNumber': { '$gte': dateNumber } }] }
      ],
      'isDeleted': false
    };
    SP_BlockedDatesDAO.checkBlockedDatesIsAvailable(query1, function (AvResObj) {
      if (AvResObj.statusCode == '9997') {
        SP_BlockedDatesDAO.checkBlockedDatesInBookings(query, function (resObj) {
          if (resObj.statusCode == '0000') {
            dates.push(dateArray[i]);
            setPropertyBlockedRandomDates(i + 1, reqObj, dateArray, tokenDecodedData, currentUTC, dates, callback);
            callback({ httpCode: 200, statusCode: '1011', result: resObj });
          } else if (resObj.statusCode == '9997') {
            var dateObj = setBlockingRandomData(reqObj, dateArray[i], tokenDecodedData, currentUTC);
            var randomObj = new SP_PropertyBlockings(dateObj);
            SP_BlockedDatesDAO.createSPPropertyBlockedDates(randomObj, tokenDecodedData, function (reResObj) {
              //  callback({httpCode: reResObj.httpCode, statusCode: reResObj.statusCode, result: reResObj.result});
              setPropertyBlockedRandomDates(i + 1, reqObj, dateArray, tokenDecodedData, currentUTC, dates, callback);
            });
          } else {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
          }
        });
      } else {
        callback({ httpCode: AvResObj.httpCode, statusCode: AvResObj.statusCode, result: AvResObj.result });
      }
    });
  } else {
    callback(true);
  }
};

/**
 * @param {object} reqObj 
 * @param {object} tokenDecodedData 
 * @param {object} currentUTC 
 */

function setPropertyBlockedContinueDates(reqObj, tokenDecodedData, currentUTC) {
  var fromDate = moment.utc(reqObj.blockingFromDate).format('YYYY-MM-DD');
  var toDate = moment.utc(reqObj.blockingToDate).format('YYYY-MM-DD');
  var blockObj = {
    spServiceProviderId: tokenDecodedData.uspid,
    spServiceProvider: tokenDecodedData.usp,
    spLocationId: reqObj.spLocationId,
    propertyId: reqObj.propertyID,
    blockingType: reqObj.blockingType,
    blockingFromDate: fromDate,
    blockingFromDateNumber: moment(fromDate, 'YYYY-MM-DD').valueOf(),
    blockingToDate: toDate,
    blockingToDateNumber: moment(toDate, 'YYYY-MM-DD').valueOf(),
    blockingDateStatus: 'Active',
    isDeleted: false,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdBy: 'superadmin',
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedBy: 'superadmin',
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  return blockObj;
}

/**
 * @param {object} reqObj 
 * @param {string} dateValue 
 * @param {object} tokenDecodedData 
 * @param {object} currentUTC 
 */

function setBlockingRandomData(reqObj, dateValue, tokenDecodedData, currentUTC) {
  var fromDate = moment.utc(dateValue).format('YYYY-MM-DD');
  var blockObj = {
    spServiceProviderId: tokenDecodedData.uspid,
    spServiceProvider: tokenDecodedData.usp,
    spLocationId: reqObj.spLocationId,
    propertyId: reqObj.propertyID,
    blockingType: reqObj.blockingType,
    blockingFromDate: dateValue,
    blockingToDate: dateValue,
    blockingFromDateNumber: moment(fromDate, 'YYYY-MM-DD').valueOf(),
    blockingToDateNumber: moment(fromDate, 'YYYY-MM-DD').valueOf(),
    blockingDateStatus: 'Active',
    isDeleted: false,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdBy: 'superadmin',
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedBy: 'superadmin',
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  return blockObj;
}

/**
 * 
 * @param {object} reqObj 
 * @param {string} blockingID 
 * @param {object} tokenDecodedData 
 * @param {funtion} callback 
 */
function updateSpPropertyBlockingData(reqObj, blockingID, tokenDecodedData, callback) {
  var currentUTC = CommonService.currentUTCObj();
  var fromDate = moment.utc(reqObj.blockingFromDate).format('YYYY-MM-DD');
  var toDate = moment.utc(reqObj.blockingToDate).format('YYYY-MM-DD');
  var updateObj = {
    blockingType: reqObj.blockingType,
    blockingFromDate: reqObj.blockingFromDate,
    blockingToDate: reqObj.blockingToDate,
    blockingFromDateNumber: moment(fromDate, 'YYYY-MM-DD').valueOf(),
    blockingToDateNumber: moment(toDate, 'YYYY-MM-DD').valueOf(),
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedBy: 'superadmin',
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  SP_BlockedDatesDAO.updateSPPropertyBlockedDates(blockingID, tokenDecodedData, updateObj, function (resObj) {
    callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
  });

}