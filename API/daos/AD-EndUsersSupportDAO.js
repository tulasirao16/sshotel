/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var logger = require('../lib/logger');
var AD_Tickets = require('../models/AD-Tickets');
var AuditingInfoDAO = require('./AuditingInfoDAO');

// BEGIN : AD-EndUsersSupportDAO
module.exports = {
  // Begin : getADEUSupportList   
  getADEUSupportList: function (euUserId, pageNumber, searchString, callback) {
    var query = {
      'euUserId': euUserId,
      'isDeleted': false,
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'reqMobileNumber': { $regex: searchString, $options: 'i' } },
        { 'reqEmail': { $regex: searchString, $options: 'i' } },
        { 'spName': { $regex: searchString, $options: 'i' } },
        { 'ticketTitle': { $regex: searchString, $options: 'i' } },
        { 'assignStatus': { $regex: searchString, $options: 'i' } },
        { 'ticketDescription': { $regex: searchString, $options: 'i' } },
        { 'ticketNumType': { $regex: searchString, $options: 'i' } },
        { 'ticketNumber': { $regex: searchString, $options: 'i' } },
        { 'ticketGroup': { $regex: searchString, $options: 'i' } },
        { 'ticketTag': { $regex: searchString, $options: 'i' } },
        { 'ticketPriority': { $regex: searchString, $options: 'i' } },
        { 'ticketStatus': { $regex: searchString, $options: 'i' } }
      ]
    }
    AD_Tickets.find(query)
      .sort({ 'createdAt': -1 })
      .populate('spUserId')
      .skip((pageNumber - 1) * 20)
      .limit(20).exec(function (error, resObj) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-EndUsersSupportDAO.js,'+
            ' at getADEUSupportList  of getADEUSupportList query:'+ error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj.length > 0) {
          AD_Tickets.countDocuments(query).
            exec(function (errorCount, resultCount) {
              if (errorCount) {
                logger.error('There was an Un-known Error occured in daos/AD-EndUsersSupportDAO.js, at getADEUSupportList of countDocuments:' + errorCount);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
              } else if (resultCount) {
                var resultObj = { totalDocs: resultCount, ticketsData: resObj };
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
  // END : getADEUSupportList

  // Begin : postADEUSupportData
  postADEUSupportData: function (adEUSupportObj,  callback) {
    var adEUSupportData = new AD_Tickets(adEUSupportObj);
    adEUSupportData.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-EndUsersSupportDAO.js at postADEUSupportData'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // End : postADEUSupportData

  // Begin : postADEUSupportLifeCycle
  postADEUSupportLifeCycle: function (ADEULifeCycleObj, callback) {
    ADEULifeCycleObj.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-EndUsersSupportDAO.js at postADEUSupportLifeCycle'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // End : postADEUSupportLifeCycle

  // Begin : putADEUSupportUpdate
  putADEUSupportUpdate: function (supportId, updateUserObj, callback) {
    AD_Tickets.findOneAndUpdate({ _id: supportId, isDeleted: false }, { $set: updateUserObj }, { new: true }, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-EndUsersSupportDAO.js,'+
          ' at putADEUSupportUpdate:' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // End : putADEUSupportUpdate


  // Begin : putADEUSupportLifeCycle
  putADEUSupportLifeCycle: function (ADEULifeCycleObj, callback) {
    ADEULifeCycleObj.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-EndUsersSupportDAO.js at putADEUSupportLifeCycle '+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // End : putADEUSupportLifeCycle

  // Begin : adEUSupportDelete
  adEUSupportDelete: function (supportId, updateObj, tokenDecodedData, callback) {
    var query = {
      '_id': supportId,
      'isDeleted': false
    };
    AD_Tickets.findOneAndUpdate(query, { $set: updateObj }, function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-EndUsersSupportDAO.js at adEUSupportDelete'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update Many', { name: config.collectionADTickets, id: resObj._id, value: 'Admin Service Provider Delete' }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // End : adEUSupportDelete 
}
// End : AD-EndUsersSupportDAO