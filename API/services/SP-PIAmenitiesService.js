/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var commonService = require('./CommonService');
var SP_PIAmenitiesDAO = require('../daos/SP-PIAmenitiesDAO');

module.exports = {
// Begin -- getPropertyInfoAmenitiesList: Code to get property amenities
  getPropertyInfoAmenitiesList: function (propertyId, propertyInfoId, tokendecodeddata, searchString, callback) {
    SP_PIAmenitiesDAO.getPropertyInfoAmenitiesList(propertyId, propertyInfoId, tokendecodeddata, searchString, function (error, resObj) {
      if (error) {
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
        callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
        callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
    });
  },
// End -- getPropertyInfoAmenitiesList: Code to get property amenities  

  // --- Begin: updateSPPropertyInfoAmenityData
  updateSPPropertyInfoAmenityData: function(reqBody, decodedTokenData, callback) {
    var currentUTC = commonService.currentUTCObj();
    var updateAmenityObj = {
      amenityCharge: reqBody.amenityType == 'Free' ? '0' : reqBody.amenityCharge,
      amenityType: reqBody.amenityType,
      amenityStatus: reqBody.amenityStatus,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
    SP_PIAmenitiesDAO.updateSPPropertyInfoAmenityData(reqBody, decodedTokenData, updateAmenityObj, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: updateSPPropertyInfoAmenityData

  // --- Begin: updateSPPropertyInfoAmenityStatus: Code to update Amenity Status
    updateSPPropertyInfoAmenityStatus: function(reqBody, decodedTokenData, callback) {
      var currentUTC = commonService.currentUTCObj();
      var updateAmenityStatusObj = {
        amenityStatus: reqBody.amenityStatus,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedBy: decodedTokenData.ua,
        updatedOn: currentUTC.currentUTCDateTimeString,
      };
      SP_PIAmenitiesDAO.updateSPPropertyInfoAmenityStatus(reqBody, decodedTokenData, updateAmenityStatusObj, function(resObj) {
          callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
        });
    },
  // --- End: updateSPPropertyInfoAmenityStatus: Code to update Amenity Status
}