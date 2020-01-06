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
var SP_ServiceProviders = require('../models/SP-ServiceProviders');
var SP_Users = require('../models/SP-Users');

// --- Begin: AD-HostsDAO
module.exports = {
  // --- Begin getADHostsListingDataBySearch
  getADHostsListingDataBySearch: function (pageNum, searchString, callback) {
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
        { 'status': { $regex: searchString, $options: 'i' } },
      ]
    };
    SP_ServiceProviders.find(query)
      .skip((pageNum - 1) * 20)
      .limit(20)
      .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-HostsDAO.js, at getADHostsListingDataBySearch:' + error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
           SP_ServiceProviders.countDocuments(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD-HostsDAO.js, at  getADHostsListingDataBySearch:' + errorCount);
              var resultObj = { totalDocs: resultArray.length, userData: resultArray };
              callback({ httpCode: 200, statusCode: '9999', result: resultObj });
            } else if (resultCount && resultCount.length > 0) {
              var resultObj = { totalDocs: resultCount, userData: resultArray };
              callback({ httpCode: 200, statusCode: '0000', result: resultCount });
            } else {
              var resultObj = { totalDocs: resultArray.length, userData: resultArray };
              callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            }
           });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },
  // --- End  getADHostsListingDataBySearch:

  // --- Begin getADHostsListingData:
  getADHostsListingData: function (pageNum, searchString, callback) {
    var query = {
      'isDeleted': false,
      '$or': [
        { 'serviceProvider': { $regex: searchString, $options: 'i' } },
        { 'contactPerson': { $regex: searchString, $options: 'i' } },
        { 'contactNumber': { $regex: searchString, $options: 'i' } },
        { 'contactEmail': { $regex: searchString, $options: 'i' } },
        { 'mobileNumber': { $regex: searchString, $options: 'i' } },
        { 'area': { $regex: searchString, $options: 'i' } },
        { 'zip': { $regex: searchString, $options: 'i' } },
        { 'city': { $regex: searchString, $options: 'i' } },
        { 'status': { $regex: searchString, $options: 'i' } },
      ]
    };
    SP_ServiceProviders.find(query)
      .skip((pageNum - 1) * 20)
      .limit(20)
      .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-HostsDAO.js, at getADHostsListingData:'+ error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
          SP_ServiceProviders.countDocuments(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
                logger.error('There was an Un-known Error occured in daos/AD-HostsDAO.js, at  getADHostsListingData:'+ errorCount);
                var resultObj = { totalDocs: resultArray.length, userData: resultArray };
                callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            } else if (resultCount && resultCount > 0) {
                var resultObj = { totalDocs: resultCount, userData: resultArray };
                callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            } else {
                var resultObj = { totalDocs: resultArray.length, userData: resultArray };
                callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            }
          });
        } else {
            callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },
  // --- End  getADHostsListingData:

  // --- Begin getADHostId:
  getADHostsDataByID: function (hostId, callback) {
    var query = { 
      '_id': hostId,
    }
    SP_ServiceProviders.findOne(query).exec(function (error, resObj) {
        if (error) {
           logger.error('There was an Un-known Error occured in daos/AD-HostsDAO.js, at  getADHostsDataByID:'+ error);
           callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj._id) {
           callback({ httpCode: 200, statusCode: '0000', result: resObj });
        } else {
           callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
    });
  },
  // --- End  getADHostsDataByID:

  // --- Begin updateADHostStatusChange:
  updateADHostStatusChange: function (hostId, updateObj, tokenDecodedData, callback) {
    var query = { _id: hostId, isDeleted: false };
    SP_ServiceProviders.findOneAndUpdate(query, { $set: updateObj }, { new: true }, function (error, data) {
      if (error) {
        logger.error('There was an Un-konwn Error occured in daos/AD-HostsDAO.js, at updateADHostStatusChange:' + error);
        callback({ httpCode: 400, statusCode: '9900', result: {} });
      } else if (data && data._id) {
        if(data.status == 'Inactive') {
          SP_Users.updateMany({spServiceProviderId: hostId},{'userStatus' : 'Inactive' }, { new: true }).exec(function (error, upSPDataObj) {
            if (error) {
              logger.error('There was an Un-konwn Error occured in daos/AD-HostsDAO.js, at updateADHostStatusChange:' + error);
              callback({ httpCode: 400, statusCode: '9900', result: {} });
            } else {
              AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPServiceProviders, id: data._id, value: data.serviceProvider },upSPDataObj);
              callback({ httpCode: 200, statusCode: '0000', result: data });
            }
          });
        } else {  
          AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPServiceProviders, id: data._id, value: data.serviceProvider }, updateObj);
          callback({ httpCode: 200, statusCode: '0000', result: data });
        }
      } else {
          callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },  
  // --- End: updateADHostStatusChange:

  // --- Begin: updateADHostProfileData:
  updateADHostProfileData: function (query, updateSPDataObj, tokenDecodedData, callback) {
    SP_ServiceProviders.findOneAndUpdate(query, { $set: updateSPDataObj }, { new: true }, function (error, data) {
      if (error) {
          logger.error('There was an Un-konwn Error occured in daos/AD-HostsDAO.js, at updateADHostProfileData:' + error);
          callback({ httpCode: 400, statusCode: '9900', result: {} });
      } else if (data && data._id) {
          AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPServiceProviders, id: data._id, value: data.serviceProvider }, updateSPDataObj);
          callback({ httpCode: 200, statusCode: '0000', result: data });
      } else {
          callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  }
  // --- End: updateADHostProfileData:
}
// --- END: AD-HostsDAO