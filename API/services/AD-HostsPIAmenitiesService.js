/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var commonService = require('./CommonService');
var AD_HostsPIAmenitiesDAO = require('../daos/AD-HostsPIAmenitiesDAO');

//---Begin: AD-HostsPIAmenitiesService
module.exports = {
  // Begin -- getADHostsPropertyInfoAmenitiesList: Code to get property amenities
  getADHostsPropertyInfoAmenitiesList: function (propertyInfoId, searchString, callback) {
    AD_HostsPIAmenitiesDAO.getADHostsPropertyInfoAmenitiesList(propertyInfoId, searchString, function (error,resObj) {
      if (error) {
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
        callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
        callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
    });
  },
  // End -- getADHostsPropertyInfoAmenitiesList: Code to get property amenities  

  // --- Begin: updateADHostsPropertyInfoAmenityStatus: Code to update Amenity Status
  updateADHostsPropertyInfoAmenityStatus: function(reqBody, decodedTokenData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var updateAmenityStatusObj = {
          amenityStatus: reqBody.amenityStatus,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedBy: decodedTokenData.ua,
          updatedOn: currentUTC.currentUTCDateTimeString,
          };
    AD_HostsPIAmenitiesDAO.updateADHostsPropertyInfoAmenityStatus(reqBody, decodedTokenData, updateAmenityStatusObj, function(resObj) {
      callback(resObj);
    });
  },
  // --- End: updateADHostsPropertyInfoAmenityStatus: Code to update Amenity Status

  // --- Begin: updateADHostsPropertyInfoAmenityRecordID: Code to update Amenity RecordID
  updateADHostsPropertyInfoAmenityRecordID: function(reqBody, recordID, decodedTokenData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var updateAmenityStatusObj = {
          amenityStatus: reqBody.amenityStatus,
          amenityType:reqBody.amenityType,
          amenityCharge: reqBody.amenityType == 'Free' ? '0' : reqBody.amenityCharge,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedBy: decodedTokenData.ua,
          updatedOn: currentUTC.currentUTCDateTimeString,
        };
    AD_HostsPIAmenitiesDAO.updateADHostsPropertyInfoAmenityRecordID(recordID, decodedTokenData, updateAmenityStatusObj, function(resObj) {
      callback(resObj);
    });
  },
  // --- End: updateADHostsPropertyInfoAmenityRecordID: Code to update Amenity RecordID
}
//---END: AD-HostsPIAmenitiesService