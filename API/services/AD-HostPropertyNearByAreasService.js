/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var AD_HostPropertyNearByAreasDAO = require('../daos/AD-HostPropertyNearByAreasDAO');
var SP_BlockedDatesService = require('./SP-BlockedDatesService');
var CommonService = require('./CommonService');
var SP_Property = require('../models/SP-Properties');
var SP_Locations = require('../models/SP-Locations');
var SP_PropertyDocs = require('../models/SP-PropertyDocs');
module.exports = {
  // --- Begin updateADHostPropertyNearByAreasData:
  updateADHostPropertyNearByAreasData: function (propertyID,reqbody,tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
      var upObj = {
        nearestAreas: reqbody.nearbyareas,
        updatedBy: tokenDecodedData.ua,
        updatedById: tokenDecodedData.iss,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
    AD_HostPropertyNearByAreasDAO.updateADHostPropertyNearByAreasData(upObj, propertyID, tokenDecodedData, function (resObj) {
        callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // --- Ending  updateADHostPropertyNearByAreasData:
}