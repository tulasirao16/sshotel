/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var commonService = require('./CommonService');
var AD_HostsPIServicesDAO = require('../daos/AD-HostsPIServicesDAO');

//---Begin: AD-HostsPIServicesService
module.exports = {
  // Begin -- getADHostsPropertyInfoServicesList: Code to get property Info Service
  getADHostsPropertyInfoServicesList: function (propertyInfoId, searchString, callback) {
    AD_HostsPIServicesDAO.getADHostsPropertyInfoServicesList(propertyInfoId, searchString, function (error,resObj) {
      if (error) {
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
        callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
        callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
    });
  },
  // End -- getADHostsPropertyInfoServicesList: Code to get property Info Service

  // --- Begin: updateADHostsPropertyInfoServiceStatus: Code to update Property Info Service Status
  updateADHostsPropertyInfoServiceStatus: function(reqBody, decodedTokenData, callback) {
    var currentUTC = commonService.currentUTCObj();
    var updateserviceStatusObj = {
      serviceStatus: reqBody.serviceStatus,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
    AD_HostsPIServicesDAO.updateADHostsPropertyInfoServiceStatus(reqBody, decodedTokenData, updateserviceStatusObj, function(resObj) {
      callback(resObj);
    });
  },
  // --- End: updateADHostsPropertyInfoServiceStatus: Code to update Property Info Service Status  
  
  // --- Begin: updateADHostsPropertyInfoServiceRecordID: Code to update Amenity RecordID
  updateADHostsPropertyInfoServiceRecordID: function(reqBody, recordID, decodedTokenData, callback) {
      var currentUTC = commonService.currentUTCObj();
      var updateAmenityStatusObj = {
        serviceStatus: reqBody.serviceStatus,
        serviceType:reqBody.serviceType,
        serviceCharge: reqBody.serviceType == 'Free' ? '0' : reqBody.serviceCharge,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedBy: decodedTokenData.ua,
        updatedOn: currentUTC.currentUTCDateTimeString,
      };
    AD_HostsPIServicesDAO.updateADHostsPropertyInfoServiceRecordID(recordID, decodedTokenData, updateAmenityStatusObj, function(resObj) {
      callback(resObj);
    });
  },
  // --- End: updateADHostsPropertyInfoServiceRecordID: Code to update Amenity RecordID
}
//--- END: AD-HostsPIServicesService