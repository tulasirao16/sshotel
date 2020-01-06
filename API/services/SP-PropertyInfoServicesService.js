/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */
var config = require('config');
var randomNumber = require('random-number');
var CommonService = require('./CommonService');
var SP_PropertyInfoServicesDAO = require('../daos/SP-PropertyInfoServicesDAO');
var SP_Users = require('../models/SP-Users');


module.exports = {

  // --- Begin: updateSPPropertyInfoServicesData
  updateSPPropertyInfoServicesData: function(reqBody, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateServiceObj = {
      serviceCharge: reqBody.serviceCharge ? reqBody.serviceCharge : '0',
      serviceType: reqBody.serviceType,
      serviceStatus: reqBody.serviceStatus,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
    SP_PropertyInfoServicesDAO.updateSPPropertyInfoServicesData(reqBody, decodedTokenData, updateServiceObj, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: updateSPPropertyInfoServicesData


  // --- Begin: updateSPPIServiceStatusAvailable
  updateSPPIServiceStatusAvailable: function(recordID, reqBody, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateServiceObj = {
      serviceStatus: 'Available',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
    SP_PropertyInfoServicesDAO.updateSPPIServiceStatusAvailable(recordID, decodedTokenData, updateServiceObj, reqBody, currentUTC, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: updateSPPIServiceStatusAvailable

  // --- Begin: updateSPPIServiceStatusUnavailable
  updateSPPIServiceStatusUnavailable: function(recordID, reqBody, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateServiceObj = {
      serviceStatus: 'Unavailable',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: decodedTokenData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
    };
    SP_PropertyInfoServicesDAO.updateSPPIServiceStatusUnavailable(recordID, decodedTokenData, updateServiceObj, reqBody, currentUTC, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End: updateSPPIServiceStatusUnavailable

};
