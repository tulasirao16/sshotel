/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var commonService = require('../services/CommonService');
var AD_HostPropertyLocationDAO = require('../daos/AD-HostPropertyLocationDAO');
var SP_Locations = require('../models/SP-Locations');


// --- Begin: AD_HostPropertyLocationsService
module.exports = {
    updateADPropertyLocationsData: function (reqObj, locationID, propertyId, tokenDecodedData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var updateObj = updateADPropertyLocationData(reqObj, tokenDecodedData, currentUTC);
        var query = {
            _id: locationID,
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
        AD_HostPropertyLocationDAO.updateADPropertyLocationsData(query, updateObj, spLocationObj, propertyId, tokenDecodedData, function (resObj) {
               callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });

        });
    },
}
/**
* @param {object} reqObj object
* @param {object} tokenDecodedData object
* @param {object} currentUTC object
* @return {object}
*/
function updateADPropertyLocationData(reqObj, tokenDecodedData, currentUTC) {
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
// --- End: AD_HostPropertyLocationsService
}
