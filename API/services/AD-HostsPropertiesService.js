/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var moment = require('moment');
var CommonService = require('./CommonService');
var AD_HostsPropertiesDAO = require('../daos/AD-HostsPropertiesDAO');
var SP_PropertyInfoDAO = require('../daos/SP-PropertyInfoDAO');
var SP_PropertyDocs = require('../models/SP-PropertyDocs');
var AD_HostsPropertyInfoService = require('../services/AD-HostsPropertyInfoService');
var AD_HostBlockedDatesService = require('../services/AD-HostBlockedDatesService');
var SP_Property = require('../models/SP-Properties');
var AD_HostsServiceLocationsService = require('../services/AD-HostsServiceLocationsService');

// --- Begin: AD-HostsPropertiesService
module.exports = {
  // --- Begin getADHostsSPDataByID: Code get Service Provider Properties data
  getADHostsSPDataByID: function (pageNum, SPID, searchString, callback) {
    AD_HostsPropertiesDAO.getADHostsSPDataByID(pageNum, SPID, searchString, function (resObj) {
      callback(resObj);
    });
  },
  //--- End getADHostsSPDataByID: Code get Service Provider Properties data

  // --- Begin getADHostspropertyDataByID: Code to get Service Provider Hosts Property data
  getADHostspropertyDataByID: function (propertyID, callback) {
    AD_HostsPropertiesDAO.getADHostspropertyDataByID(propertyID,function (resObj) {
      callback(resObj);
    });
  },
  //--- End getADHostspropertyDataByID: Code to get Service Provider Hosts Property data:

  // --- Begin getADHostBookingsList:
  getADHostBookingsList: function (id, pageNumber, searchString, tokendecodedData, callback) {
    var utcMoment = moment.utc();
    var istMoment = utcMoment.add(5, 'hours'). add(30, 'minutes');
    var userStartDate = istMoment.startOf('day');
    var userStartTime = userStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    var startUTCDateTimeNumber = moment(userStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
    AD_HostsPropertiesDAO.getADHostBookingsList(id, pageNumber, searchString, startUTCDateTimeNumber, tokendecodedData, function (error, resObj) {
        if (error) {
            callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj.statusCode === '0000') {
            callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
        } else {
            callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
        }
    });
  },
// --- End getADHostBookingsList:

  // --- Begin  updateADHostsPropertyStatusChange:
  updateADHostsPropertyStatusChange: function (propertyID, status, tokendecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    if (status == 'Inactive') {
        var query = {
          'spPropertyId': propertyID,
          'bookingStatus': { '$in': 'Booked' },
          'isDeleted': false
        };
        SP_PropertyInfoDAO.isBookingsAvailable(query, function (resObj) {
          if (resObj.statusCode == '9997') {
              var updateObj = {
                status: status,
                updatedBy: tokendecodedData.ua,
                updatedById: tokendecodedData.iss,
                updatedAt: currentUTC.currentUTCDateTimeNumber,
                updatedOn: currentUTC.currentUTCDateTimeString
              };
            AD_HostsPropertiesDAO.updateADHostsPropertyStatusChange(propertyID, updateObj, tokendecodedData, function (resObj) {
              callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
            })
          } else if (resObj.statusCode == '0000') {
            callback({ httpCode: 400, statusCode: '1016', result: {} });
          } else {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
          }
        });
    } else {
        var updateObj = {
          status: status,
          updatedBy: tokendecodedData.ua,
          updatedById: tokendecodedData.iss,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedOn: currentUTC.currentUTCDateTimeString
        };
      AD_HostsPropertiesDAO.updateADHostsPropertyStatusChange(propertyID, updateObj, tokendecodedData, function (resObj) {
        callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
      })
    }
  },
  //--- End pdateADHostsPropertyStatusChange: 
 
  // --- Begin  updateADHostsProperty:
  updateADHostsProperty: function (propertyID, reqObj, files, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var upObj = {
      propertyTitle: reqObj.propertyTitle,
      aboutProperty: reqObj.aboutProperty,
      propertyType: reqObj.propertyType,
      // nearestAreas: JSON.parse(reqObj.nearestAreas),
      updatedBy: tokenDecodedData.ua,
      updatedById: tokenDecodedData.iss,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    if (files.length > 0) {
      var ptyData = {
        spServiceProviderId: reqObj.spServiceProviderId,
        spServiceProvider: reqObj.spServiceProvider,
        spLocationId: reqObj.spLocationId,
        _id: propertyID,
      };
      setpropertyDocs(ptyData, (parseInt(reqObj.imagesCount) + 1), reqObj.fileType, files, tokenDecodedData, currentUTC);
    }
    AD_HostsPropertiesDAO.updateADHostsProperty(propertyID, reqObj, upObj, tokenDecodedData, function (upObj) {
      callback({ httpCode: upObj.httpCode, statusCode: upObj.statusCode, result: upObj.result });
    });
  },
  // --- END:  updateADHostsProperty:

  // -- Begin : createADHostsProperty
  createADHostsProperty: function (reqBody, propertyID, files, tokendecodedData, callback) {
    reqBody.spLocationObj = JSON.parse(reqBody.spLocationObj);
    reqBody.spLocationObj.spServiceProviderId = reqBody.spServiceProviderId;
    reqBody.spLocationObj.spServiceProvider = reqBody.spServiceProvider;
    reqBody.propertyInfo = JSON.parse(reqBody.propertyInfo);
    reqBody.blockedObj = JSON.parse(reqBody.blockedObj);
    reqBody.blockedObj.spServiceProvider = reqBody.spServiceProvider;
    var currentUTC = CommonService.currentUTCObj();
    AD_HostsServiceLocationsService.postADHostServiceLocationsData(reqBody.spLocationObj, tokendecodedData,  function (pLoResObj) {
      if (pLoResObj.statusCode == '0000') {
        setSPPropertyData(reqBody, pLoResObj.result._id, propertyID, files, tokendecodedData, currentUTC, function (pResObj) {
          if (pResObj.statusCode == '0000') {
            reqBody.propertyInfo.spLocationId = pResObj.result.spLocationId;
            reqBody.propertyInfo.spLocationObj = pResObj.result.spLocationObj;
            reqBody.propertyInfo.propertyId = pResObj.result._id;
            reqBody.propertyInfo.nearestAreas = pResObj.result.nearestAreas;
            if (files.length > 0) {
              setpropertyDocs(pResObj.result, 1, reqBody.fileType, files, tokendecodedData, currentUTC);
            }
            if (reqBody.blockedObj.blockingType) {
              reqBody.blockedObj.propertyID = pResObj.result._id;
              reqBody.blockedObj.spLocationId = pResObj.result.spLocationId;
              reqBody.blockedObj.spServiceProviderId = pResObj.result.spServiceProviderId;
              AD_HostBlockedDatesService.createADHostPropertyBlockedDates(reqBody.blockedObj, tokendecodedData, function (resObj) {
              });
            }
            AD_HostsPropertyInfoService.createADHostsPropertyInfo(reqBody.propertyInfo, tokendecodedData, function (pInfoObj) {
              if (pInfoObj.statusCode == '0000') {
                callback({ httpCode: pInfoObj.httpCode, statusCode: pInfoObj.statusCode, result: pInfoObj.result });
              } else {
                callback({ httpCode: 400, statusCode: '1015', result: {} });
              }
            });
          } else {
            callback({ httpCode: 400, statusCode: '1015', result: {} });
          }
        });
      } else {
        callback({ httpCode: 400, statusCode: '1015', result: {} });
      }
    });
  },
  // -- End : createADHostsProperty

  // --- Begin getADHostspropertyLocationsData: 
  getADHostspropertyLocationsData: function (spid, callback) {
    AD_HostsPropertiesDAO.getADHostspropertyLocationsData(spid, function (resObj) {
      callback(resObj);
    });
  },
  //--- End getADHostspropertyLocationsData: 

  deleteADHostPropertyDocs: function(reqObj, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      isDeleted: true,
      updatedBy: tokenDecodedData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    }
    AD_HostsPropertiesDAO.deleteADHostPropertyDocs(reqObj, updateObj, tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
}
// --- END: AD-HostsPropertiesService




/**
 * 
 * @param {object} ptyData 
 * @param {Array} files 
 * @param {object} currentUTC 
 */

function setpropertyDocs(ptyData, count, fileType, files, tokenDecodedData, currentUTC) {
  let fLength = files.length
  files.forEach((element, i) => {
    var ptyDocsObj = {
      spServiceProviderId: ptyData.spServiceProviderId,
      spServiceProvider: ptyData.spServiceProvider,
      spLocationId: ptyData.spLocationId,
      propertyId: ptyData._id,
      fileType: (fileType && files[i].mimetype.split('/')[0] == 'video') ? 'Video' : 'Image',
      imageOriginalName: element.originalname,
      imageName: element.filename,
      imagePath: element.path,
      imageOrder: i + count,
      isDeleted: false,
      createdBy: tokenDecodedData.ua,
      updatedBy: tokenDecodedData.ua,
      createdAt: currentUTC.currentUTCDateTimeNumber,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    var ptyDocs = new SP_PropertyDocs(ptyDocsObj);
    AD_HostsPropertiesDAO.createSPPropertyDocs(ptyDocs, tokenDecodedData, function (resObj) {});
  });
}


/**
 * 
 * @param {object} reqObj 
 * @param {string} locationID 
 * @param {object} tokenDecodedData 
 * @param {object} currentUTC 
 * @param {} callback 
 */

function setSPPropertyData(reqObj, locationID, propertyID, files, tokenDecodedData, currentUTC, callback) {
  originalname = files[0].originalname
  originalname = files[0].originalname
  var propertyObj = {
    _id: propertyID,
    name: reqObj.propertyTitle,
    spServiceProviderId: reqObj.spServiceProviderId,
    spServiceProvider: reqObj.spServiceProvider,
    spLocationId: locationID,
    spLocationObj: {
      contactPerson: reqObj.spLocationObj.contactPerson,
      mobileNumber: reqObj.spLocationObj.mobileNumber,
      alternateMobileNumber: reqObj.spLocationObj.alternateMobileNumber ? reqObj.spLocationObj.alternateMobileNumber : '',
      email: reqObj.spLocationObj.email,
      address: reqObj.spLocationObj.address,
      landmark: reqObj.spLocationObj.landmark ? reqObj.spLocationObj.landmark : '',
      area: reqObj.spLocationObj.area,
      areaLocality: reqObj.spLocationObj.areaLocality ? reqObj.spLocationObj.areaLocality : '',
      zip: reqObj.spLocationObj.zip,
      city: reqObj.spLocationObj.city,
      state: reqObj.spLocationObj.state,
      country: reqObj.spLocationObj.country,
      latitude: reqObj.spLocationObj.latitude,
      longitude: reqObj.spLocationObj.longitude,
    },
    imageOriginalName: files[0].originalname,
    imageName: files[0].filename,
    imagePath: files[0].path,
    propertyTitle: reqObj.propertyTitle,
    aboutProperty: reqObj.aboutProperty,
    propertyType: reqObj.propertyType,
    nearestAreas: JSON.parse(reqObj.nearestAreas),
    propertyCapacity: 0,
    numFloors: 0,
    numRooms: 0,
    activeNumRooms: 0,
    inactiveNumRooms: 0,
    onHoldNumRooms: 0,
    status: reqObj.status,
    singleBedsCount: 0,
    doubleBedsCount: 0,
    kingBedsCount: 0,
    queenBedsCount: 0,
    bunkBedsCount: 0,
    privateBathRooms: 0,
    commonBathRooms: 0,
    kitchensCount: 0,
    hallsCount: 0,
    sofasCount: 0,
    chairsCount: 0,
    teapoiesCount: 0,
    fansCount: 0,
    acsCount: 0,
    isDeleted: false,
    createdBy: tokenDecodedData.ua,
    createdById: tokenDecodedData.iss,
    updatedBy: tokenDecodedData.ua,
    updatedById: tokenDecodedData.iss,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  var propertyData = new SP_Property(propertyObj);
  AD_HostsPropertiesDAO.createADHostsProperty(propertyData, tokenDecodedData, function (ptyResObj) {
    callback(ptyResObj);
  });
}
