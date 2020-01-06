/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var moment = require('moment');
var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var EU_Bookings = require('../models/EU-Bookings');
var SP_PropertyBlockings = require('../models/SP-PropertyBlockings');
var logger = require('../lib/logger');

module.exports = {
  // -- Begin : checkBlockedDatesInBookings
  checkBlockedDatesInBookings: function (query, callback) {
    EU_Bookings.find(query, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-konwn Error occured in daos/SP-BlockedDatesDAO.js,' +
          ' at checkBlockedDatesInBookings:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // -- End : checkBlockedDatesInBookings

  // -- Begin : checkBlockedDatesIsAvailable
  checkBlockedDatesIsAvailable: function (query1, callback) {
    SP_PropertyBlockings.find(query1, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-konwn Error occured in daos/SP-BlockedDatesDAO.js,' +
          ' at checkBlockedDatesIsAvailable:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '1013', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // -- End : checkBlockedDatesIsAvailable

  // -- Begin : createSPPropertyBlockedDates
  createSPPropertyBlockedDates: function (blockingData, tokenDecodedData, callback) {
    blockingData.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-konwn Error occured in daos/SP-BlockedDatesDAO.js,' +
          ' at createSPPropertyBlockedDates:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionSPPropertyBlockedDates, id: resObj._id, value: resObj.blockingType }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  },
  // -- End : createSPPropertyBlockedDates

  // -- Begin : getPropertyBlockedDates
  getPropertyBlockedDates: function (propertyID, tokendecodedData, callback) {
    var utcMoment = moment.utc().format('YYYY-MM-DD');
    var currentValue = moment(utcMoment, 'YYYY-MM-DD').valueOf();
    var query = {
      'spServiceProviderId': tokendecodedData.uspid,
      'propertyId': propertyID,
      'isDeleted': false,
      '$or': [
        { 'blockingFromDateNumber': { '$gte': currentValue } },
        {
          '$and': [
            { 'blockingFromDateNumber': { '$lte': currentValue } },
            { 'blockingToDateNumber': { '$gte': currentValue } }
          ]
        }
      ]
    };
    SP_PropertyBlockings.find(query)
    .sort({ 'blockingFromDateNumber': 1 })
    .populate('propertyId')
    .exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-BlockedDatesDAO.js at getPropertyBlockedDates', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // -- End : getPropertyBlockedDates

  // -- Begin : getPropertyPastBlockedDates
  getPropertyPastBlockedDates: function (propertyID, tokendecodedData, callback) {
    var utcMoment = moment.utc().format('YYYY-MM-DD');
    var currentValue = moment(utcMoment, 'YYYY-MM-DD').valueOf();
    var query = {
      'spServiceProviderId': tokendecodedData.uspid,
      'propertyId': propertyID,
      'isDeleted': false,
      'blockingToDateNumber': { '$lt': currentValue },
    };
    SP_PropertyBlockings.find(query)
    .sort({ 'blockingFromDateNumber': -1 })
    .populate('propertyId')
    .exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-BlockedDatesDAO.js at getPropertyPastBlockedDates', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // -- End : getPropertyPastBlockedDates

  // -- Begin : deletePropertyBlockedDates
  deletePropertyBlockedDates: function (blockedID, upObj, tokendecodedData, callback) {
    var query = {
      '_id': blockedID,
      'spServiceProviderId': tokendecodedData.uspid,
      'isDeleted': false
    };
    SP_PropertyBlockings.findOneAndUpdate(query, { $set: upObj }, function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-BlockedDatesDAO.js at deletePropertyBlockedDates', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokendecodedData, 'Update', {name: config.collectionSPPropertyBlockedDates, id: resObj._id, value: resObj.blockingType }, upObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // -- End : deletePropertyBlockedDates

  // -- Begin : updateSPPropertyBlockedDates
  updateSPPropertyBlockedDates: function (blockingID, tokendecodedData, updateObj, callback) {
    var query = {
      '_id': blockingID,
      'spServiceProviderId': tokendecodedData.uspid,
      'isDeleted': false
    };
    SP_PropertyBlockings.findOneAndUpdate(query, { $set: updateObj }, { new: true }, function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-BlockedDatesDAO.js at updateSPPropertyBlockedDates', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokendecodedData, 'Update', {name: config.collectionSPPropertyBlockedDates, id: resObj._id, value: resObj.blockingType }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // -- End : updateSPPropertyBlockedDates
  
  getBlockedDates: function(query, callback) {
    SP_PropertyBlockings.find(query, function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-BlockedDatesDAO.js at getBlockedDates', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  }
};
