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
var AD_HostsServiceLocationsDAO = require('../daos/AD-HostsServiceLocationsDAO');
var SP_Locations = require('../models/SP-Locations');

// --- Begin: AD-HostUsersService
module.exports = {
  // --- Begin getADHostsServiceLocationsDat:
  getADHostServiceLocationsData: function (hostId, pageNum, searchString, tokenDecodedData, callback) {
    AD_HostsServiceLocationsDAO.getADHostServiceLocationsData(hostId, pageNum, searchString, tokenDecodedData, function (resObj) {
      callback(resObj);
    });
  },
  //--- End getADHostsServiceLocationsData:

  // --- Begin: updateADHostServiceLocationsStatus
  updateADHostServiceLocationsStatus: function (locationId, reqBody, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var upObj = {
      locationStatus: reqBody.status,
      updatedBy: tokenDecodedData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_HostsServiceLocationsDAO.updateADHostServiceLocationsStatus(upObj, locationId, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // --- End: updateADHostServiceLocationsStatus

  // --- Begin: updateADHostServiceLocationsData
  updateADHostServiceLocationsData: function (reqObj, locationId, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = updateADHostServiceLocationData(reqObj, locationId, tokenDecodedData, currentUTC);
    var query = {
      _id: locationId,
      // spServiceProviderId:spServiceProviderId,
      // spServiceProvider: updateObj.spServiceProvider,
      isDeleted: false
    };
    var spLocationObj = {
      contactPerson: reqObj.contactPerson,
      mobileNumber: reqObj.mobileNumber,
      alternateMobileNumber: reqObj.alternateMobileNumber ? reqObj.alternateMobileNumber : '',
      email: reqObj.email,
      address: reqObj.address,
      landmark: reqObj.landmark ? reqObj.landmark : '',
      area: reqObj.area,
      areaLocality: reqObj.areaLocality ? reqObj.areaLocality : '',
      zip: reqObj.zip,
      city: reqObj.city,
      state: reqObj.state,
      country: reqObj.country,
      latitude: reqObj.latitude,
      longitude: reqObj.longitude,
    }
    AD_HostsServiceLocationsDAO.updateADHostServiceLocationsData(query, updateObj, spLocationObj, tokenDecodedData, function (resObj) {
      // if(reqObj.propertyID) {
      //     var ptylocObj = {
      //      spLocationObj: {
      //          contactPerson: reqObj.contactPerson,
      //          mobileNumber: reqObj.mobileNumber,
      //          alternateMobileNumber: reqObj.alternateMobileNumber ? reqObj.alternateMobileNumber : '',
      //          email: reqObj.email,
      //          address: reqObj.address,
      //          landmark: reqObj.landmark ? reqObj.landmark : '',
      //          area: reqObj.area,
      //          areaLocality: reqObj.areaLocality ? reqObj.areaLocality : '',
      //          zip: reqObj.zip,
      //          city: reqObj.city,
      //          state: reqObj.state,
      //          country: reqObj.country,
      //          latitude: reqObj.latitude,
      //          longitude: reqObj.longitude,
      //      }
      //     };
      //     SP_LocationsDAO.updateLocationInProperty(reqObj.propertyID, ptylocObj, tokenDecodedData, function(ptyObj) {
      //         callback({ httpCode: ptyObj.httpCode, statusCode: ptyObj.statusCode, result: ptyObj.result });
      //     });
      // } else {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
      // }
    });
  },
  // --- End: updateADHostServiceLocationsData

  // --- Begin: postADHostServiceLocationsData
  postADHostServiceLocationsData: function (reqObj, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var locationObj = {
      spServiceProviderId: reqObj.spServiceProviderId,
      spServiceProvider: reqObj.spServiceProvider,
      contactPerson: reqObj.contactPerson,
      mobileNumber: reqObj.mobileNumber,
      alternateMobileNumber: reqObj.alternateMobileNumber ? reqObj.alternateMobileNumber : '',
      email: reqObj.email,
      address: reqObj.address,
      landmark: reqObj.landmark ? reqObj.landmark : '',
      area: reqObj.area,
      zip: reqObj.zip,
      city: reqObj.city,
      state: reqObj.state,
      country: reqObj.country,
      latitude: reqObj.latitude,
      longitude: reqObj.longitude,
      locationStatus: reqObj.locationStatus,
      createdBy: tokenDecodedData.ua,
      updatedBy: tokenDecodedData.ua,
      createdAt: currentUTC.currentUTCDateTimeNumber,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    var locationData = new SP_Locations(locationObj);
    AD_HostsServiceLocationsDAO.postADHostServiceLocationsData(locationData, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // --- End: postADHostServiceLocationsData
}

/**
* @param {object} reqObj object
* @param {object} tokenDecodedData object
* @param {object} currentUTC object
* @return {object}
*/
function updateADHostServiceLocationData(reqObj, locationId, tokenDecodedData, currentUTC) {
  var updateLocationObj = {
    contactPerson: reqObj.contactPerson,
    mobileNumber: reqObj.mobileNumber,
    alternateMobileNumber: reqObj.alternateMobileNumber ? reqObj.alternateMobileNumber : '',
    email: reqObj.email,
    address: reqObj.address,
    landmark: reqObj.landmark ? reqObj.landmark : '',
    area: reqObj.area,
    zip: reqObj.zip,
    city: reqObj.city,
    state: reqObj.state,
    country: reqObj.country,
    latitude: reqObj.latitude,
    longitude: reqObj.longitude,
    locationStatus: reqObj.locationStatus,
    updatedBy: tokenDecodedData.ua,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  return updateLocationObj;
}