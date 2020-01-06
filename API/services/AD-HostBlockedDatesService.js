/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var CommonService = require('../services/CommonService');
var SP_NotificationsDAO = require('../daos/SP-NotificationsDAO');
var SP_PropertyBlockings = require('../models/SP-PropertyBlockings');
var AD_HostBlockedDatesDAO = require('../daos/AD-HostBlockedDatesDAO');
var SP_Users = require('../models/SP-Users');
var moment = require('moment');

// --- Begin: AD-HostBlockedDatesService
module.exports = {
  // -- Begin : getHostPropertyBlockedDates
  getHostPropertyBlockedDates: function (propertyID, tokenDecodedData, callback) {
    AD_HostBlockedDatesDAO.getHostPropertyBlockedDates(propertyID, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // -- End : getHostPropertyBlockedDates

  // -- Begin : deleteHostPropertyBlockedDates
  deleteHostPropertyBlockedDates: function (blockedID, tokenDecodedData, callback) {
    const currentUTC = CommonService.currentUTCObj();
    var upObj = {
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: 'superadmin',
      updatedOn: currentUTC.currentUTCDateTimeString,
      isDeleted: true
    };
    AD_HostBlockedDatesDAO.deleteHostPropertyBlockedDates(blockedID, upObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // -- End : deleteHostPropertyBlockedDates

  // -- Begin : getHostPropertyPastBlockedDates
  getHostPropertyPastBlockedDates: function (propertyID, tokenDecodedData, callback) {
    AD_HostBlockedDatesDAO.getHostPropertyPastBlockedDates(propertyID, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // -- End : getHostPropertyPastBlockedDates

  // -- Begin : createADHostPropertyBlockedDates
  createADHostPropertyBlockedDates: function (reqObj, tokenDecodedData, callback) {
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
      AD_HostBlockedDatesDAO.checkBlockedDatesIsAvailable(query1, function (resObj) {
        if (resObj.statusCode == '9997') {
          AD_HostBlockedDatesDAO.checkBlockedDatesInBookings(query, function (resObj) {
            if (resObj.statusCode == '0000') {
              callback({ httpCode: 200, statusCode: '1011', result: {} });
            } else if (resObj.statusCode == '9997') {
              var currentUTC = CommonService.currentUTCObj();
              var blObj = setPropertyBlockedContinueDates(reqObj, currentUTC);
              var blockingData = new SP_PropertyBlockings(blObj);
              AD_HostBlockedDatesDAO.createADHostPropertyBlockedDates(blockingData, tokenDecodedData, function (resObj) {
                callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
              });
            } else {
              callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
            }
          });
        } else {
          callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj });
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
  // -- End : createADHostPropertyBlockedDates

  // -- Begin : updateHostPropertyBlockedDates
  updateHostPropertyBlockedDates: function (reqObj, blockingID, tokenDecodedData, callback) {
    var fromDate = moment.utc(reqObj.blockingFromDate).format('YYYY-MM-DD');
    //  var dayNext = moment(fromDate).add(1, 'days');
    var fromNumber = moment(fromDate, 'YYYY-MM-DD').valueOf();
    // var dayNextNumber = moment(dayNext, 'YYYY-MM-DD').valueOf();
    var toDate = moment.utc(reqObj.blockingToDate).format('YYYY-MM-DD');
    var toNumber = moment(toDate, 'YYYY-MM-DD').valueOf();
    if (reqObj.blockingType == 'Continuous Blocking') {
      var query = {
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
        'propertyId': reqObj.propertyID,
        '_id': { '$nin': blockingID },
        '$or': [
          { 'blockingFromDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
          { 'blockingToDateNumber': { '$gte': fromNumber, '$lte': toNumber } },
          { '$and': [{ 'blockingFromDateNumber': { '$lte': fromNumber } }, { 'blockingToDateNumber': { '$gte': toNumber } }] }
        ],
        'isDeleted': false
      };
      AD_HostBlockedDatesDAO.checkBlockedDatesIsAvailable(query1, function (resObj) {
        if (resObj.statusCode == '9997') {
          AD_HostBlockedDatesDAO.checkBlockedDatesInBookings(query, function (resObj) {
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
      AD_HostBlockedDatesDAO.checkBlockedDatesIsAvailable(query1, function (resObj) {
        if (resObj.statusCode == '9997') {
          AD_HostBlockedDatesDAO.checkBlockedDatesInBookings(query, function (bkResObj) {
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
  // -- End : updateHostPropertyBlockedDates
}
// --- Ending: AD-HostBlockedDatesService

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
      '$or': [
        { 'blockingFromDateNumber': { '$gte': dateNumber, '$lte': dateNumber } },
        { 'blockingToDateNumber': { '$gte': dateNumber, '$lte': dateNumber } },
        { '$and': [{ 'blockingFromDateNumber': { '$lte': dateNumber } }, { 'blockingToDateNumber': { '$gte': dateNumber } }] }
      ],
      'isDeleted': false
    };
    AD_HostBlockedDatesDAO.checkBlockedDatesIsAvailable(query1, function (resObj) {
      if (resObj.statusCode == '9997') {
        AD_HostBlockedDatesDAO.checkBlockedDatesInBookings(query, function (resObj) {
          if (resObj.statusCode == '0000') {
            dates.push(dateArray[i]);
            setPropertyBlockedRandomDates(i + 1, reqObj, dateArray, tokenDecodedData, currentUTC, dates, callback);
            callback({ httpCode: 200, statusCode: '1011', result: resObj });
          } else if (resObj.statusCode == '9997') {
            var dateObj = setBlockingRandomData(reqObj, dateArray[i], currentUTC);
            var randomObj = new SP_PropertyBlockings(dateObj);
            AD_HostBlockedDatesDAO.createADHostPropertyBlockedDates(randomObj, tokenDecodedData, function (resObj) {
              callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
              setPropertyBlockedRandomDates(i + 1, reqObj, dateArray, tokenDecodedData, currentUTC, dates, callback);
            });
          } else {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
          }
        });
      } else {
        callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
      }
    });
  } else {
    callback(true);
  }
};

/**
 * @param {object} reqObj 
 * @param {string} dateValue 
 * @param {object} currentUTC 
 */

function setBlockingRandomData(reqObj, dateValue, currentUTC) {
  var fromDate = moment.utc(dateValue).format('YYYY-MM-DD');
  var blockObj = {
    spServiceProviderId: reqObj.spServiceProviderId,
    spServiceProvider: reqObj.spServiceProvider,
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
 * @param {object} reqObj 
 * @param {object} currentUTC 
 */

function setPropertyBlockedContinueDates(reqObj, currentUTC) {
  var fromDate = moment.utc(reqObj.blockingFromDate).format('YYYY-MM-DD');
  var toDate = moment.utc(reqObj.blockingToDate).format('YYYY-MM-DD');
  var blockObj = {
    spServiceProviderId: reqObj.spServiceProviderId,
    spServiceProvider: reqObj.spServiceProvider,
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
  AD_HostBlockedDatesDAO.updateHostPropertyBlockedDates(blockingID, tokenDecodedData, updateObj, function (resObj) {
    callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
  });
}