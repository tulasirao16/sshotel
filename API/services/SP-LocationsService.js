/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
var commonService = require('../services/CommonService');
var SP_LocationsDAO = require('../daos/SP-LocationsDAO');
var SP_Locations = require('../models/SP-Locations');


// --- Begin: SP_ServiceLocationsService
module.exports = {

    // --- Begin getSPServiceLocations:
    getSPServiceLocationsData: function (pageNumber, searchString, tokendecodedData, callback) {
        SP_LocationsDAO.getSPServiceLocationsData(pageNumber, searchString, tokendecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },
    // --- End getSPServiceLocations:

    // --- Begin: postSPLocationsData
    postSPLocationsData: function (reqObj, tokenDecodedData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var locationObj = {
            spServiceProviderId: tokenDecodedData.uspid,
            spServiceProvider: tokenDecodedData.usp,
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
        SP_LocationsDAO.postSPLocationsData(locationData, tokenDecodedData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    // --- End: postSPLocationsData

    // --- Begin: updateSPLocationsData
    updateSPLocationsData: function (reqObj, tokenDecodedData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var updateObj = updateSPLocationData(reqObj, tokenDecodedData, currentUTC);
        var query = {
            _id: updateObj._id,
            spServiceProviderId: updateObj.spServiceProviderId,
            spServiceProvider: updateObj.spServiceProvider,
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
        SP_LocationsDAO.updateSPLocationsData(query, updateObj, spLocationObj, tokenDecodedData, function (resObj) {
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
    // --- End: postSPLocationsData

    // --- Begin: activateSPLocationsData
    activateSPLocationsData: function (recordID, decodedTokenData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var updateLocationObj = {
            locationStatus: 'Active',
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedBy: decodedTokenData.ua,
            updatedOn: currentUTC.currentUTCDateTimeString,
        };
        SP_LocationsDAO.activateSPLocationsData(recordID, updateLocationObj, decodedTokenData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    },
    // --- End: activateSPLocationsData

    // --- Begin: inActivateSPLocationsData
    inActivateSPLocationsData: function (recordID, decodedTokenData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var updateLocationObj = {
            locationStatus: 'Inactive',
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedBy: decodedTokenData.ua,
            updatedOn: currentUTC.currentUTCDateTimeString,
        };
        SP_LocationsDAO.inActivateSPLocationsData(recordID, updateLocationObj, decodedTokenData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
    }
    // --- End: inActivateSPLocationsData
}

/**
* @param {object} reqObj object
* @param {object} tokenDecodedData object
* @param {object} currentUTC object
* @return {object}
*/
function updateSPLocationData(reqObj, tokenDecodedData, currentUTC) {
    var updateLocationObj = {
        spServiceProviderId: tokenDecodedData.uspid,
        spServiceProvider: tokenDecodedData.usp,
        _id: reqObj._id,
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

    // --- End getSPLocations:
