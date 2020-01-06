/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var SP_Properties = require('../models/SP-Properties');
var SP_NotificationsDAO = require('../daos/SP-NotificationsDAO');
var SP_Locations = require('../models/SP-Locations');
var SP_PropertyDocs = require('../models/SP-PropertyDocs');
var SP_PropertyInfo = require('../models/SP-PropertyInfo');
var SP_PropertyChildAmenities = require('../models/SP-PropertyChildAmenities');
var SP_PropertyChildServices = require('../models/SP-PropertyChildServices');
var SP_PropertyChildRules = require('../models/SP-PropertyChildRules');

// --- Begining of AD-HostsPropertiesDAO
module.exports = {
  // --- Begin getADHostsSPDataByID:
  getADHostsSPDataByID: function (pageNum, SPID, searchString, callback) {
    if (SPID === 'null') {
      var query = {
        'isDeleted': false,
        '$or': [
          { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
          { 'propertyTitle': { $regex: searchString, $options: 'i' } },
          { 'propertyType': { $regex: searchString, $options: 'i' } },
          { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
          { 'spLocationObj.city': { $regex: searchString, $options: 'i' } },
        ]
      }
    } else {
    var query = {
      'spServiceProviderId': SPID,
      'isDeleted': false,
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'propertyTitle': { $regex: searchString, $options: 'i' } },
        { 'propertyType': { $regex: searchString, $options: 'i' } },
        { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
        { 'spLocationObj.city': { $regex: searchString, $options: 'i' } },
      ]
    }
  }
    SP_Properties.find(query)
      .populate('spLocationId')
      .skip((pageNum - 1) * 20)
      .limit(20)
      .exec(function (error, resObj) {
        if (error) {
          logger.error('There was an Error occured in daos/AD-HostsPropertiesDAO at getADHostsSPDataByID'+ error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj.length > 0) {
          SP_Properties.countDocuments(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Error occured in daos/AD-HostsPropertiesDAO at getADHostsSPDataByID countDocument'+ errorCount);
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount, propertiesList: resObj };
              callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            } else {
              callback({ httpCode: 400, statusCode: '9997', result: {} });
            }
          });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },
  // -- End : getADHostsSPDataByID

  // --- Begin getADHostspropertyDataByID:
  getADHostspropertyDataByID: function (propertyID, callback) {
    var query = {
      '_id': propertyID,
      'isDeleted': false,
    }
    SP_Properties.findOne(query).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPropertiesDAO.js at getADHostspropertyDataByID,'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // --- End  getADHostspropertyDataByID:
  
  // Begin: ADHostsPropertyInfoStatusChange:
  updateADHostsPropertyStatusChange: function(propertyID, updateObj, tokendecodedData, callback) {
    var query = {
      '_id': propertyID,
      'isDeleted': false
    };
    SP_Properties.findOneAndUpdate(query, {$set: updateObj}, {new: true}, function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPropertiesDAO.js: updateADHostsPropertyStatusChange,'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokendecodedData, 'Update', {name: config.collectionSPProperties, id: resObj._id, value: resObj.propertyTitle }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // End: ADHostsPropertyInfoStatusChange:

  // ---Begin: updateADHostsProperty:
  updateADHostsProperty: function (propertyID, reqBody, updateObj, tokenDecodedData, callback) {
    var query = {
      '_id': propertyID,
      'isDeleted': false
    };
    SP_Properties.findOneAndUpdate(query, { $set: updateObj }, {new: true}, function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPropertiesDAO.js at updateADHostsProperty'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPProperties, id: resObj._id, value: resObj.propertyTitle }, updateObj);
        SP_PropertyInfo.updateMany({'propertyId': propertyID, 'isDeleted': false}, {$set: {nearestAreas: resObj.nearestAreas}}, function(upError, upResObj) {
          AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPPropertyInfos, id: resObj._id, value: 'PropertyID:' + resObj.propertyTitle }, {nearestAreas: resObj.nearestAreas});
        });
        if(reqBody.oldPropertyTitle !== reqBody.propertyTitle) {
          SP_PropertyInfo.updateMany({'propertyId': propertyID, 'isDeleted': false}, {$set: {'propertyTitle': updateObj.propertyTitle}}, function(upError, upResObj) {
            AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPPropertyInfos, id: resObj._id, value: 'PropertyID:' + resObj.propertyTitle }, {'propertyTitle': updateObj.propertyTitle});
          });
          SP_PropertyChildAmenities.updateMany({'propertyId': propertyID, 'isDeleted': false}, {$set: {'propertyTitle': updateObj.propertyTitle}}, function(upError, upResObj) {
            AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPPropertyChildAmenities, id: resObj._id, value: 'PropertyID:' + resObj.propertyTitle }, {'propertyTitle': updateObj.propertyTitle});
          });
          SP_PropertyChildServices.updateMany({'propertyId': propertyID, 'isDeleted': false}, {$set: {'propertyTitle': updateObj.propertyTitle}}, function(upError, upResObj) {
            AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPPropertyChildServicesSchema, id: resObj._id, value: 'PropertyID:' + resObj.propertyTitle }, {'propertyTitle': updateObj.propertyTitle});
          });
          SP_PropertyChildRules.updateMany({'propertyId': propertyID, 'isDeleted': false}, {$set: {'propertyTitle': updateObj.propertyTitle}}, function(upError, upResObj) {
            AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPPropertyChildRules, id: resObj._id, value: 'PropertyID:' + resObj.propertyTitle }, {'propertyTitle': updateObj.propertyTitle});
          });
        }
        SP_PropertyDocs.findOne({'propertyId': propertyID, 'imagePath': resObj.imagePath, 'isDeleted': false},function(dError, dResObj) {
          if (dError) {
            logger.error('There was an Error occured in daos/AD-HostsPropertiesDAO.js at updateADHostsProperty'+  dError);
          } else if(dResObj && dResObj._id) {
          } else {
            SP_PropertyDocs.findOne({'propertyId': propertyID, 'isDeleted': false}, function(iError, iResObj) {
              if (iError) {
                logger.error('There was an Error occured in daos/AD-HostsPropertiesDAO.js at updateADHostsProperty'+ iError);
              } else if(iResObj && iResObj._id) {
                var currentUTC = CommonService.currentUTCObj();
                var upData = {
                  'imageOriginalName': iResObj.imageOriginalName,
                  'imageName': iResObj.imageName,
                  'imagePath': iResObj.imagePath,
                  'updatedBy': tokenDecodedData.ua,
                  'updatedById': tokenDecodedData.iss,
                  'updatedAt': currentUTC.currentUTCDateTimeNumber,
                  'updatedOn': currentUTC.currentUTCDateTimeString
                };
                SP_Properties.updateOne({'_id': propertyID, 'isDeleted': false}, {$set: upData}, function(pError, pResObj) {
                  if (pError) {
                    logger.error('There was an Error occured in daos/AD-HostsPropertiesDAO.js at updateADHostsProperty'+ pError);
                  }
                  AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPProperties, id: resObj._id, value: resObj.propertyTitle }, upData);
                });
              }
            });
          }
        });
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // ---END: updateADHostsProperty:

  // ---Begin: createSPPropertyDocs:
  createSPPropertyDocs: function (ptyDocs, tokenDecodedData, callback) {
    ptyDocs.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPropertiesDAO.js at createSPPropertyDocs'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', {name: config.collectionSPPropertyDocs, id: resObj._id, value: resObj.imageName }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
 // ---END: createSPPropertyDocs: 

  // ---Begin: createADHostsProperty:
  createADHostsProperty: function (propertyData, tokenDecodedData, callback) {
    propertyData.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPropertiesDAO.js at createADHostsProperty' +  error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        if(tokenDecodedData) {
          var ntyObj = {
            spId: resObj.spServiceProviderId,
            sp: resObj.spServiceProvider,
            spUserId: resObj._id,
            spName: resObj.name
          };
          let notificationObj = {title: 'Welcome To AM to PM', titleBody: 'You have added new Property' };
          let ntyptyData = {recordId: resObj._id, type: 'Property', contact: tokenDecodedData.umn}
          SP_NotificationsDAO.setSupplierNotificationTokenData(ntyObj, tokenDecodedData, ntyptyData, notificationObj, resObj.mobileNumber, function(notifyResObj) {});
        }
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', {name: config.collectionSPProperties, id: resObj._id, value: resObj.propertyTitle }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // ---END: createADHostsProperty:

  // --- Begin getADHostspropertyLocationsData:
  getADHostspropertyLocationsData: function (spid, callback) {
    var query = {
      'spServiceProviderId': spid,
      'isDeleted': false,
    }
    SP_Locations.find(query).populate('spServiceProviderId').sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
        if (error) {
            logger.error('There was an Un-known Error occured in daos/AD-HostsPropertiesDAO.js, at getADHostspropertyLocationsData:' + error);
            callback({httpCode: 500, statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
            callback({httpCode: 200, statusCode: '0000', result: resultArray})
        } else {
            callback({httpCode: 400, statusCode: '9997', result: {} });
        }
    });
  },
  // --- End  getADHostspropertyLocationsData:

  // Begin: deleteADHostPropertyDocs
  deleteADHostPropertyDocs: function (reqObj, updateObj, tokendecodedData, callback) {
    var query = {
      '_id': {'$in': reqObj.imageIDs},
      'propertyId': reqObj.propertyID,
      'isDeleted': false
    };
    SP_PropertyDocs.updateMany(query, { $set: updateObj }, function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPropertiesDAO.js at deleteADHostPropertyDocs' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.nModified >= 1) {
        AuditingInfoDAO.adAuditing(tokendecodedData, 'Update Many', {name: config.collectionSPPropertyDocs, id: reqObj.propertyID, value: 'Property ID'}, updateObj);
        SP_PropertyDocs.findOne({'propertyId': reqObj.propertyID, 'imagePath': reqObj.imagePath, 'isDeleted': false}, function(dError, dResObj) {
          if (dError) {
            logger.error('There was an Error occured in daos/AD-HostsPropertiesDAO.js at deleteADHostPropertyDocs', dError);
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          } else if(dResObj && dResObj._id) {
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          } else {
            SP_PropertyDocs.findOne({'propertyId': reqObj.propertyID, 'isDeleted': false}, function(iError, iResObj) {
              if (iError) {
                logger.error('There was an Error occured in daos/AD-HostsPropertiesDAO.js at deleteADHostPropertyDocs' + iError);
              } else if(iResObj && iResObj._id) {
                var upData = {
                  'imageOriginalName': iResObj.imageOriginalName,
                  'imageName': iResObj.imageName,
                  'imagePath': iResObj.imagePath,
                  'updatedBy': tokendecodedData.ua,
                  'updatedById': tokendecodedData.iss,
                  'updatedAt': updateObj.updatedAt,
                  'updatedOn': updateObj.updatedOn
                };
                SP_Properties.updateOne({'_id': reqObj.propertyID, 'isDeleted': false}, {$set: upData}, function(pError, pResObj) {
                  AuditingInfoDAO.adAuditing(tokendecodedData, 'Update', {name: config.collectionSPProperties, id: reqObj.propertyID, value: 'Property Image' }, upData);
                });
              } else {
                var upData = {
                  'imageOriginalName': '',
                  'imageName': '',
                  'imagePath': '',
                  'updatedBy': tokendecodedData.ua,
                  'updatedById': tokendecodedData.iss,
                  'updatedAt': updateObj.updatedAt,
                  'updatedOn': updateObj.updatedOn
                };
                SP_Properties.update({'_id': reqObj.propertyID, 'isDeleted': false}, {$set: upData}, function(pError, pResObj) {
                  AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPProperties, id: reqObj.propertyID, value: 'Property Image' }, upData);
                });
              }
            });
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          }
        });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // End: deleteADHostPropertyDocs
}
// --- END: AD-HostsPropertiesDAO