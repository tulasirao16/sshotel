/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var SP_PropertiesDAO = require('../daos/SP-PropertiesDAO');
var SP_PropertyInfoService = require('../services/SP-PropertyInfoService');
var SP_PropertyInfoDAO = require('../daos/SP-PropertyInfoDAO');
var SP_BlockedDatesService = require('../services/SP-BlockedDatesService');
var CommonService = require('../services/CommonService');
var SP_Property = require('../models/SP-Properties');
var SP_Locations = require('../models/SP-Locations');
var SP_PropertyDocs = require('../models/SP-PropertyDocs');

module.exports = {
  // -- Begin : getSpProperties
  getSpProperties: function (pageNumber, searchString, tokendecodedData, callback) {
    SP_PropertiesDAO.getSpProperties(pageNumber, searchString, tokendecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // -- End : getSpProperties

  // -- Begin : createSPProperty
  createSPProperty: function (reqBody, propertyID, files, tokendecodedData, callback) {
    reqBody.spLocationObj = JSON.parse(reqBody.spLocationObj);
    reqBody.propertyInfo = JSON.parse(reqBody.propertyInfo);
    reqBody.blockedObj = JSON.parse(reqBody.blockedObj);
    var currentUTC = CommonService.currentUTCObj();
    
    setSPPropertyLocationData(reqBody.spLocationObj, tokendecodedData, currentUTC, function (pLoResObj) {
      if (pLoResObj.statusCode == '0000') {
        setSPPropertyData(reqBody, pLoResObj.result._id, propertyID, files, tokendecodedData, currentUTC, function (pResObj) {
          if (pResObj.statusCode == '0000') {
            reqBody.propertyInfo.spLocationId = pResObj.result.spLocationId;
            reqBody.propertyInfo.spLocationObj = pResObj.result.spLocationObj;
            reqBody.propertyInfo.propertyId = pResObj.result._id;
            reqBody.propertyInfo.nearestAreas = pResObj.result.nearestAreas;
            // reqBody.propertyInfo.firstInfo = 'first';
            if (files.length > 0) {
              setpropertyDocs(pResObj.result, 1, reqBody.fileType, files, tokendecodedData, currentUTC);
            }
            if (reqBody.blockedObj.blockingType) {
              reqBody.blockedObj.propertyID = pResObj.result._id;
              reqBody.blockedObj.spLocationId = pResObj.result.spLocationId;
              reqBody.blockedObj.spServiceProviderId = pResObj.result.spServiceProviderId;
              SP_BlockedDatesService.createSPPropertyBlockedDates(reqBody.blockedObj, tokendecodedData, function (resObj) {
              });
            }
            SP_PropertyInfoService.createPropertyInfo(reqBody.propertyInfo, tokendecodedData, function (pInfoObj) {
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
  // -- End : createSPProperty

  // -- Begin : getSPPropertyDocs
  getSPPropertyDocs: function (propertyID, tokenDecodedData, callback) {
    SP_PropertiesDAO.getSPPropertyDocs(propertyID, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // -- End : getSPPropertyDocs

  updateSPProperty: function (propertyID, reqObj, files, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var upObj = {
      propertyTitle: reqObj.propertyTitle,
      aboutProperty: reqObj.aboutProperty,
      propertyType: reqObj.propertyType,
      nearestAreas: JSON.parse(reqObj.nearestAreas),
      updatedBy: tokenDecodedData.ua,
      updatedById: tokenDecodedData.iss,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    if (files.length > 0) {
      var ptyData = {
        spServiceProviderId: tokenDecodedData.uspid,
        spServiceProvider: tokenDecodedData.usp,
        spLocationId: reqObj.spLocationId,
        _id: propertyID,
      };
      setpropertyDocs(ptyData, (parseInt(reqObj.imagesCount) + 1), reqObj.fileType, files, tokenDecodedData, currentUTC);
    }
    SP_PropertiesDAO.updateSPProperty(propertyID, reqObj, upObj, tokenDecodedData, function (upObj) {
      callback({ httpCode: upObj.httpCode, statusCode: upObj.statusCode, result: upObj.result });
    });
  },

  updateSPPropertyStatusChange: function (propertyID, status, tokendecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    if (status == 'Inactive') {
      var query = {
        'spServiceProviderId': tokendecodedData.uspid,
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
          SP_PropertiesDAO.spPropertyStatusChange(propertyID, updateObj, tokendecodedData, function (resObj) {
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
      SP_PropertiesDAO.spPropertyStatusChange(propertyID, updateObj, tokendecodedData, function (resObj) {
        callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
      })
    }
  },
  deleteSPPropertyDocs: function(reqObj, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      isDeleted: true,
      updatedBy: tokenDecodedData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    }
    SP_PropertiesDAO.deleteSPPropertyDocs(reqObj, updateObj, tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  getSPLocationsData: function (tokendecodedData, callback) {
    SP_PropertiesDAO.getSPLocationsData(tokendecodedData, function (resObj) {
     callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  updateSPPropertyLocationUpdate: function(propertyid, reqObj, tokenDecodedData, callback) {
    var locationObj = {
      spLocationObj: {
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
    };
    SP_PropertiesDAO.updateSPPropertyLocationUpdate(propertyid, locationObj, reqObj._id, tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    })
  },
  getSPPropertyData: function (recordId, tokendecodedData, callback) {
    SP_PropertiesDAO.getSPPropertyData(recordId, tokendecodedData, function (resObj) {
     callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
}

/**
 * 
 * @param {object} reqBody 
 * @param {tokenDecodedData} tokenDecodedData 
 * @param {object} currentUTC 
 */
function setSPPropertyLocationData(reqObj, tokenDecodedData, currentUTC, callback) {
  if(reqObj._id) {
    callback({httpCode: '200', statusCode: '0000', result: {_id: reqObj._id} });
  } else {
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
  SP_PropertiesDAO.createSPLocationsData(locationData, tokenDecodedData, function (lResObj) {
    callback(lResObj);
  });
}
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
    spServiceProviderId: tokenDecodedData.uspid,
    spServiceProvider: tokenDecodedData.usp,
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
  SP_PropertiesDAO.createSPProperty(propertyData, tokenDecodedData, function (ptyResObj) {
    callback(ptyResObj);
  });
}

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
    SP_PropertiesDAO.createSPPropertyDocs(ptyDocs, tokenDecodedData, function (resObj) {});
  });
}