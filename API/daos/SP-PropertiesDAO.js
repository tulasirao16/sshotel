/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var SP_Properties = require('../models/SP-Properties');
var SP_PropertyDocs = require('../models/SP-PropertyDocs');
var SP_PropertyChildAmenities = require('../models/SP-PropertyChildAmenities');
var SP_PropertyChildRules = require('../models/SP-PropertyChildRules');
var SP_PropertyChildServices = require('../models/SP-PropertyChildServices');
var SP_NotificationsDAO = require('./SP-NotificationsDAO');
var SP_PropertyInfo = require('../models/SP-PropertyInfo');
var SP_Locations = require('../models/SP-Locations');
var EU_Favourites = require('../models/EU-Favourites');
var CommonService = require('../services/CommonService');

module.exports = {
  // -- Begin : getSpProperties
  getSpProperties: function (pageNumber, searchString, tokendecodedData, callback) {
    var query = {
      'spServiceProviderId': tokendecodedData.uspid,
      'isDeleted': false,
      '$or': [
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'propertyTitle': { $regex: searchString, $options: 'i' } },
        { 'propertyType': { $regex: searchString, $options: 'i' } },
        // { 'propertyCapacity': { $regex: searchString, $options: 'i' } },
        { 'spLocationObj.area': { $regex: searchString, $options: 'i' } },
        // { 'numRooms': { $regex: searchString, $options: 'i' } },
        // { 'activeNumRooms': { $regex: searchString, $options: 'i' } },
        // { 'singleBedsCount': { $regex: searchString, $options: 'i' } },
        // { 'doubleBedsCount': { $regex: searchString, $options: 'i' } },
        // { 'privateBathRooms': { $regex: searchString, $options: 'i' } }
      ]
    };
    SP_Properties.find(query)
    .populate('spLocationId')
    .skip((pageNumber - 1) * 20)
    .limit(20)
    .exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/getSpProperties.js at getSpProperties', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        SP_Properties.countDocuments(query).
          exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Error occured in daos/getSpProperties.js at getSpProperties countDocument', errorCount);
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
  // -- End : getSpProperties

  // -- Begin : getSPPropertyDocs
  getSPPropertyDocs: function (propertyID, tokenDecodedData, callback) {
    var query = {
      'spServiceProviderId': tokenDecodedData.uspid,
      'propertyId': propertyID,
      'isDeleted': false
    };
    SP_PropertyDocs.find(query).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertiesDAO.js at getSPPropertyDocs', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // -- End : getSPPropertyDocs

  createSPLocationsData: function (locationData, tokenDecodedData, callback) {
    locationData.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertiesDAO.js at createSPLocationsData', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionSPLocations, id: resObj._id, value: resObj.city }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  createSPProperty: function (propertyData, tokenDecodedData, callback) {
    propertyData.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertiesDAO.js at createSPProperty', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        if(tokenDecodedData) {
          var ntyObj = {
            spId: tokenDecodedData.uspid,
            sp: tokenDecodedData.usp,
            spUserId: tokenDecodedData.iss,
            spName: tokenDecodedData.un
          };
          let notificationObj = {title: 'Welcome To AM to PM', titleBody: 'You have added new Property' };
          let ntyptyData = {recordId: resObj._id, type: 'Property', contact: tokenDecodedData.umn}
          SP_NotificationsDAO.setSupplierNotificationTokenData(ntyObj, tokenDecodedData, ntyptyData, notificationObj, resObj.spLocationObj ? resObj.spLocationObj.mobileNumber : '', function(notifyResObj) {});
        }
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionSPProperties, id: resObj._id, value: resObj.propertyTitle }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  createSPPropertyDocs: function (ptyDocs, tokenDecodedData, callback) {
    ptyDocs.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertiesDAO.js at createSPPropertyDocs', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionSPPropertyDocs, id: resObj._id, value: resObj.imageName }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  updateSPProperty: function (propertyID, reqBody, updateObj, tokenDecodedData, callback) {
    var query = {
      '_id': propertyID,
      'spServiceProviderId': tokenDecodedData.uspid,
      'isDeleted': false
    };
    SP_Properties.findOneAndUpdate(query, { $set: updateObj }, {new: true}, function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertiesDAO.js at updateSPProperty', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPProperties, id: resObj._id, value: resObj.propertyTitle }, updateObj);
        SP_PropertyInfo.updateMany({'propertyId': propertyID, 'isDeleted': false}, {$set: {nearestAreas: resObj.nearestAreas}}, function(upError, upResObj) {
          AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPPropertyInfos, id: resObj._id, value: 'PropertyID:' + resObj.propertyTitle }, {nearestAreas: resObj.nearestAreas});
        });
        if(reqBody.oldPropertyTitle !== reqBody.propertyTitle) {
          SP_PropertyInfo.updateMany({'propertyId': propertyID, 'isDeleted': false}, {$set: {'propertyTitle': updateObj.propertyTitle}}, function(upError, upResObj) {
            AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPPropertyInfos, id: resObj._id, value: 'PropertyID:' + resObj.propertyTitle }, {'propertyTitle': updateObj.propertyTitle});
          });
          SP_PropertyChildAmenities.updateMany({'propertyId': propertyID, 'isDeleted': false}, {$set: {'propertyTitle': updateObj.propertyTitle}}, function(upError, upResObj) {
            AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPPropertyChildAmenities, id: resObj._id, value: 'PropertyID:' + resObj.propertyTitle }, {'propertyTitle': updateObj.propertyTitle});
          });
          SP_PropertyChildServices.updateMany({'propertyId': propertyID, 'isDeleted': false}, {$set: {'propertyTitle': updateObj.propertyTitle}}, function(upError, upResObj) {
            AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPPropertyChildServicesSchema, id: resObj._id, value: 'PropertyID:' + resObj.propertyTitle }, {'propertyTitle': updateObj.propertyTitle});
          });
          SP_PropertyChildRules.updateMany({'propertyId': propertyID, 'isDeleted': false}, {$set: {'propertyTitle': updateObj.propertyTitle}}, function(upError, upResObj) {
            AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPPropertyChildRules, id: resObj._id, value: 'PropertyID:' + resObj.propertyTitle }, {'propertyTitle': updateObj.propertyTitle});
          });
        }

        SP_PropertyDocs.findOne({'propertyId': propertyID, 'imagePath': resObj.imagePath, 'isDeleted': false},function(dError, dResObj) {
          if (dError) {
            logger.error('There was an Error occured in daos/SP-PropertiesDAO.js at updateSPProperty', dError);
          } else if(dResObj && dResObj._id) {
          } else {
            SP_PropertyDocs.findOne({'propertyId': propertyID, 'isDeleted': false}, function(iError, iResObj) {
              if (iError) {
                logger.error('There was an Error occured in daos/SP-PropertiesDAO.js at updateSPProperty', iError);
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
                    logger.error('There was an Error occured in daos/SP-PropertiesDAO.js at updateSPProperty', pError);
                  }
                  AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPProperties, id: resObj._id, value: resObj.propertyTitle }, upData);
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

  spPropertyStatusChange: function (propertyID, updateObj, tokenDecodedData, callback) {
    var query = {
      '_id': propertyID,
      'spServiceProviderId': tokenDecodedData.uspid,
      'isDeleted': false
    };
    SP_Properties.findOneAndUpdate(query, { $set: updateObj }, {new: true}, function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertiesDAO.js at spPropertyStatusChange', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        if(tokenDecodedData) {
          var ntyObj = {
            spId: tokenDecodedData.uspid,
            sp: tokenDecodedData.usp,
            spUserId: tokenDecodedData.iss,
            spName: tokenDecodedData.un
          };
          let notificationObj = {title: 'Welcome To AM to PM', titleBody: 'You have' + ' ' + resObj.status + ' ' + 'the' + ' ' + resObj.propertyTitle };
          let ntyptyData = {recordId: resObj._id, type: 'Property', contact: tokenDecodedData.umn};
          SP_NotificationsDAO.setSupplierNotificationTokenData(ntyObj, tokenDecodedData, ntyptyData, notificationObj, resObj.spLocationObj ? resObj.spLocationObj.mobileNumber : '', function(notifyResObj) {});
        }
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPProperties, id: resObj._id, value: resObj.propertyTitle }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },

  deleteSPPropertyDocs: function (reqObj, updateObj, tokendecodedData, callback) {
    var query = {
      '_id': {'$in': reqObj.imageIDs},
      'spServiceProviderId': tokendecodedData.uspid,
      'isDeleted': false
    };
    SP_PropertyDocs.updateMany(query, { $set: updateObj }, function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertiesDAO.js at deleteSPPropertyDocs', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.nModified >= 1) {
        AuditingInfoDAO.spAuditing(tokendecodedData, 'Update Many', {name: config.collectionSPPropertyDocs, id: reqObj.propertyID, value: 'Property ID'}, updateObj);
        SP_PropertyDocs.findOne({'propertyId': reqObj.propertyID, 'imagePath': reqObj.imagePath, 'isDeleted': false}, function(dError, dResObj) {
          if (dError) {
            logger.error('There was an Error occured in daos/SP-PropertiesDAO.js at deleteSPPropertyDocs', dError);
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          } else if(dResObj && dResObj._id) {
            callback({ httpCode: 200, statusCode: '0000', result: resObj });
          } else {
            SP_PropertyDocs.findOne({'propertyId': reqObj.propertyID, 'isDeleted': false, 'fileType': 'Image'}, function(iError, iResObj) {
              if (iError) {
                logger.error('There was an Error occured in daos/SP-PropertiesDAO.js at deleteSPPropertyDocs', iError);
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
                  AuditingInfoDAO.spAuditing(tokendecodedData, 'Update', {name: config.collectionSPProperties, id: reqObj.propertyID, value: 'Property Image' }, upData);
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
                  AuditingInfoDAO.spAuditing(tokendecodedData, 'Update', {name: config.collectionSPProperties, id: reqObj.propertyID, value: 'Property Image' }, upData);
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

  getSPLocationsData: function (tokendecodedData, callback) {
    var query = {
        'spServiceProviderId': tokendecodedData.uspid,
        locationStatus: 'Active',
        isDeleted: false
    };
    SP_Locations
    .find(query)
    .populate('spServiceProviderId')
    .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
        if (error) {
            logger.error('There was an Un-known Error occured in daos/SP_PropertiesDAO.js, at getSPLocationsData:', error);
            callback({httpCode: 500, statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
            callback({httpCode: 200, statusCode: '0000', result: resultArray})
        } else {
            callback({httpCode: 400, statusCode: '9997', result: {} });
        }
    });
  },

  updateSPPropertyLocationUpdate: function(propertyId, locationObj, locatioId, tokenDecodedData, callback) {
    SP_Properties.findOneAndUpdate({'_id': propertyId, 'spServiceProviderId': tokenDecodedData.uspid, 'isDeleted': false}, 
    {'$set': locationObj}, {new: true})
    .populate('spLocationId')
    .exec(function(error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP_PropertiesDAO.js, at updateSPPropertyLocationUpdate:', error);
        callback({httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPProperties, id: resObj._id, value: resObj.propertyTitle }, locationObj);
        SP_Properties.updateMany({spLocationId: locatioId, spServiceProviderId: tokenDecodedData.uspid}, {$set: locationObj}).exec(function(err, propResObj) {
          AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPProperties, id: locatioId, value: 'Location ID' }, locationObj);
        });
        SP_PropertyInfo.updateMany({spLocationId: locatioId, spServiceProviderId: tokenDecodedData.uspid}, {$set: locationObj}).exec(function(err, infoResObj) {
          AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPPropertyInfos, id: locatioId, value: 'Location ID' }, locationObj);
        });
        SP_Locations.updateOne({_id: locatioId, spServiceProviderId: tokenDecodedData.uspid}, {$set: locationObj.spLocationObj}).exec(function(err, locResObj) {
          AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPLocations, id: locatioId, value: locationObj.spLocationObj.city }, locationObj.spLocationObj);
        });
        EU_Favourites.updateMany({spLocationId: locatioId, spServiceProviderId: tokenDecodedData.uspid}, {$set: locationObj}).exec(function(err, favResObj) {
          AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update Many', {name: config.collectionEndUserFavourites, id: locatioId, value: 'Location ID' }, locationObj);
        });
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({httpCode: 400, statusCode: '9997', result: {} });
      }
    })
  },

  getSPPropertyData: function(recordId, tokenDecodedData, callback) {
    let query = {
      '_id': recordId,
      'spServiceProviderId': tokenDecodedData.uspid,
     'isDeleted': false
    };
    SP_Properties.findOne(query)
    .populate('spLocationId')
    .exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP_PropertiesDAO.js, at getSPPropertyData:', error)
        callback({httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        callback({httpCode: 200, statusCode: '0000', result: resObj})
      } else {
        callback({httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  }
}