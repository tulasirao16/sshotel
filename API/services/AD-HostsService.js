/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var moment = require('moment');
var randomNumber = require('random-number');
var CommonService = require('./CommonService');
var AD_HostsDAO = require('../daos/AD-HostsDAO');

// --- Begin: AD-HostsService
module.exports = {
  // --- Begin getADHostsListingDataBySearch: Code to get Service Provider data
  getADHostsListingDataBySearch: function (pageNum, searchString, callback) {
    AD_HostsDAO.getADHostsListingDataBySearch(pageNum, searchString, function (resObj) {
      callback(resObj);
    });
  },
  //--- End getADHostsListingDataBySearch: Code to get Service Provider data

  // --- Begin getADHostsListingData: Code to get Service Provider data
  getADHostsListingData: function (pageNum, searchString, callback) {
    AD_HostsDAO.getADHostsListingData(pageNum, searchString, function (resObj) {
      callback(resObj);
    });
  },
  //--- End getADHostsListingData: Code to get Service Provider data

  // --- Begin getADHostsDataByID: Code to get Service Provider data
  getADHostsDataByID: function (hostid, callback) {
    AD_HostsDAO.getADHostsDataByID(hostid,function (resObj) {
      callback(resObj);
    });
  },
  //--- End getADHostsDataByID: Code to get Service Provider data

  // --- Begin: updateADHostStatusChange:
  updateADHostStatusChange: function(hostId, status, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateHostsObj = {
      status: status,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
    AD_HostsDAO.updateADHostStatusChange(hostId, updateHostsObj, decodedTokenData, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  }, 
  // --- END: updateADHostStatusChange:

  // --- Begin: updateADHostProfileData
  updateADHostProfileData: function (recordID, reqObj, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = setADHostProfileObj(reqObj, tokenDecodedData, currentUTC);
    var query = {
        _id: recordID,
        isDeleted: false
    };
    AD_HostsDAO.updateADHostProfileData(query, updateObj, tokenDecodedData, function (resObj) {
      callback(resObj);
    });
  }
  // --- End: updateADHostProfileData
}
// --- END: AD-HostsService


/**
* @param {object} reqObj object
* @param {object} tokenDecodedData object
* @param {object} currentUTC object
* @return {object}
*/

function setADHostProfileObj(reqObj, tokenDecodedData, currentUTC) {
  var updateSPDataObj = {
      serviceProvider: reqObj.serviceProvider,
      contactPerson: reqObj.contactPerson,
      contactNumber: reqObj.contactNumber,
      contactEmail: reqObj.contactEmail,
      contactAddress: reqObj.contactAddress,
      area: reqObj.area,
      landmark: reqObj.landmark ? reqObj.landmark : '',
      appPercentage: reqObj.appPercentage,
      zip: reqObj.zip,
      city: reqObj.city,
      state: reqObj.state,
      status:reqObj.userStatus,
      updatedBy: tokenDecodedData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
  };
  return updateSPDataObj;
}