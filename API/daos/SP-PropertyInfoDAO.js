/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var SP_PropertyInfo = require('../models/SP-PropertyInfo');
var SP_Properties = require('../models/SP-Properties');
var SP_PropertyChildRules = require('../models/SP-PropertyChildRules');
var SP_PropertyPrices = require('../models/SP-PropertyPrices');
var SP_PropertyChildServices = require('../models/SP-PropertyChildServices');
var EU_Bookings = require('../models/EU-Bookings');
var async = require('async');

module.exports = {
  // -- Begin : getSpPropertyInfos
  getSpPropertyInfos: function (propertyID, callback) {
    var query = {
      'propertyId': propertyID,
      'isDeleted': false
    };
    SP_PropertyInfo.find(query)
    .populate('propertyId')
    .exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js at getSpPropertyInfos', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // -- End : getSpPropertyInfos

  // Begin -- getPropertyInfoPricingList: Code to get property Info Pricing Data
  getPropertyInfoPricingList: function (tokendecodeddata, searchString, callback) {
    var query = {
      'spServiceProviderId': tokendecodeddata.uspid,
      'isDeleted': false,
      '$or': [
        {'spLocationObj.area': {$regex: searchString, $options: 'i'}},
        {'rentType': {$regex: searchString, $options: 'i'}},
        {'roomType': {$regex: searchString, $options: 'i'}},
        {'pricing.billingType': {$regex: searchString, $options: 'i'}},
    ]
    }
    SP_PropertyInfo.find(query).populate('propertyId').exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js at find query: getPropertyInfoPricingList,'
          , error);
        callback(error, { httpCode: 500, statusCode: '9999', result: {} });
      } else if (data && data.length > 0) {
        callback(error, { httpCode: 200, statusCode: '0000', result: data });
      } else {
        callback(error, { httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },  
  // End -- getPropertyInfoPricingList: Code to get property Info Pricing Data

  // Begin -- getPropertyInfoGuestRulesList:
  getPropertyInfoGuestRulesList: function (propertyID, propertyInfoId, tokendecodeddata, callback) {
    var query = {
      'spServiceProviderId': tokendecodeddata.uspid,
      'propertyId': propertyID,
      'propertyInfoId': propertyInfoId,
      'isDeleted': false
    }
    SP_PropertyChildRules.find(query).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js at find query: getPropertyInfoGuestRulesList,', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // End -- getPropertyInfoGuestRulesList: 

  // Begin -- getPropertyInfoPrice:
  getPropertyInfoPrice: function (propertyID, propertyInfoId, tokendecodeddata, callback) {
    var query = {
      'spServiceProviderId': tokendecodeddata.uspid,
      'propertyId': propertyID,
      'propertyInfoId': propertyInfoId,
      'isDeleted': false
    }
    SP_PropertyPrices.find(query).exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js at find query: getPropertyInfoPrice,', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // End -- getPropertyInfoPrice: 

  // Begin -- getPropertyInfoServices:
  getPropertyInfoServices: function (propertyID, propertyInfoId, tokendecodeddata, callback) {
    var query = {
      'spServiceProviderId': tokendecodeddata.uspid,
      'propertyId': propertyID,
      'propertyInfoId': propertyInfoId,
      'isDeleted': false
    }
    SP_PropertyChildServices.find(query).populate('propertyId').exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js at find query: getPropertyInfoServices,', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // End -- getPropertyInfoServices: 

  // Begin -- createPropertyInfo:
  createPropertyInfo: function(InfoObj, tokenDecodedData, callback) {
    setSpPropertyInfoData(InfoObj, tokenDecodedData, function(saveObj) {
      if(saveObj.statusCode == '0000' && InfoObj.pricing.isDefaultBasePrice && InfoObj.pricing.isDefaultMinBasePrice) {
        setSpPropertyInfoPrice(saveObj.result._id, InfoObj.propertyId, tokenDecodedData, function(resObj) {
        });
      } else if(saveObj.statusCode == '0000' && InfoObj.pricing.isDefaultBasePrice){
        updateSetSpPropertyInfoBasePrice(saveObj.result._id, InfoObj.propertyId, tokenDecodedData, function(saveBaseObj){
        });
      } else if(saveObj.statusCode == '0000' && InfoObj.pricing.isDefaultMinBasePrice){
        updateSetSpPropertyInfoMinBasePrice(saveObj.result._id, InfoObj.propertyId, tokenDecodedData, function(saveMinBaseObj){
        });
      }
      callback(saveObj);
    });
  },
   // End -- createPropertyInfo

  // Begin -- setGuestRuleData
  setGuestRuleData: function(ruleGuestObj, tokenDecodedData, callback) {
    ruleGuestObj.save(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: setGuestRuleData,', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionSPPropertyChildRules, id: resObj._id, value: resObj.ruleName }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  },
  // End -- setGuestRuleData

  // Begin -- setInfoAmenityData
  setInfoAmenityData: function(amtyObj, tokenDecodedData, callback) {
    amtyObj.save(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: setInfoAmenityData,', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionSPPropertyChildAmenities, id: resObj._id, value: resObj.amenityName }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  },
  // End -- setInfoAmenityData

  // Begin -- setInfoPaidServicesData
  setInfoPaidServicesData: function(serviceObj, tokenDecodedData, callback) {
    serviceObj.save(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: setInfoPaidServicesData,', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionSPPropertyChildServicesSchema, id: resObj._id, value: resObj.serviceName }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  },
  // End -- setInfoPaidServicesData

  // Begin: updatePropertyInfoPricing
  updatePropertyInfoPricing: function(propertyInfoId, propertyId, upPricingObj, tokenDecodedData, callback) {
    updatePropertyInfoPricing(propertyInfoId, upPricingObj, tokenDecodedData, function(updateObj) {
      if(updateObj.statusCode == '0000' && upPricingObj.pricing.isDefaultBasePrice && upPricingObj.pricing.isDefaultMinBasePrice) {
        setSpPropertyInfoPrice(propertyInfoId, propertyId, tokenDecodedData, function(resObj) {
        });
      } else if(updateObj.statusCode == '0000' && upPricingObj.pricing.isDefaultBasePrice){
        updateSetSpPropertyInfoBasePrice(propertyInfoId, propertyId, tokenDecodedData, function(saveBaseObj){
        });
      } else if(updateObj.statusCode == '0000' && upPricingObj.pricing.isDefaultMinBasePrice){
        updateSetSpPropertyInfoMinBasePrice(propertyInfoId, propertyId, tokenDecodedData, function(saveMinBaseObj){
        });
      }
      callback(updateObj);
    });
  },
  // End: updatePropertyInfoPricing

  isBookingsAvailable: function(query, callback) {
    EU_Bookings.find(query, function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: isBookingsAvailable,', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  spPropertyInfoStatusChange: function(InfoID, tokendecodedData, updateObj, callback) {
    var query = {
      '_id': InfoID,
      'spServiceProviderId': tokendecodedData.uspid,
      'isDeleted': false
    };
    SP_PropertyInfo.findOneAndUpdate(query, {$set: updateObj}, {new: true}, function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: spPropertyInfoStatusChange,', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokendecodedData, 'Update', {name: config.collectionSPPropertyInfos, id: resObj._id, value: resObj.propertyTitle }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },

  updateAmenitiesInPropertyInfo: function(InfoID, tokendecodedData, updateObj, callback) {
    var query = {
      '_id': InfoID,
      'spServiceProviderId': tokendecodedData.uspid,
      'isDeleted': false
    };
    SP_PropertyInfo.updateOne(query, {$set: updateObj}, function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: updateAmenitiesInPropertyInfo,', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.nModified == 1) {
        AuditingInfoDAO.spAuditing(tokendecodedData, 'Update', {name: config.collectionSPPropertyInfos, id: InfoID, value: 'Property Info ID' }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },

  // Begin: updatePropertyInfo
  updatePropertyInfo: function(propertyInfoObj, query, counts, tokenDecodedData, callback) {
    SP_PropertyInfo.findOneAndUpdate(query, {$set: propertyInfoObj}, {new: true})
    .populate('propertyId')
    .exec(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: updatePropertyInfo,' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPPropertyInfos, id: resObj._id, value: resObj.propertyTitle }, propertyInfoObj);
        var query = {'_id': resObj.propertyId, 'spServiceProviderId': resObj.spServiceProviderId, 'isDeleted': false};
        SP_Properties.findOne(query, function(ptyError, ptyResObj) {
          if (ptyError) {
            logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: createPropertyInfo get property data,' + ptyError);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if (ptyResObj && ptyResObj._id) {
            var updateObj = {
              'propertyCapacity': parseInt(ptyResObj.propertyCapacity) + parseInt(counts.membersCapacity),
              'numRooms': parseInt(ptyResObj.numRooms) + parseInt(counts.roomsCount),
              'activeNumRooms': parseInt(ptyResObj.activeNumRooms) + parseInt(counts.activeNumRooms),
              'inactiveNumRooms': parseInt(ptyResObj.inactiveNumRooms) + parseInt(counts.inactiveNumRooms),
              'onHoldNumRooms': parseInt(ptyResObj.onHoldNumRooms) + parseInt(counts.onHoldNumRooms),
              'singleBedsCount': parseInt(ptyResObj.singleBedsCount) + parseInt(counts.singleBedsCount),
              'doubleBedsCount': parseInt(ptyResObj.doubleBedsCount) + parseInt(counts.doubleBedsCount),
              'privateBathRooms': parseInt(ptyResObj.privateBathRooms) + parseInt(counts.privateBathRooms),
              'kitchensCount': parseInt(ptyResObj.kitchensCount) + parseInt(counts.kitchensCount),
              'hallsCount': parseInt(ptyResObj.hallsCount) + parseInt(counts.hallsCount),
              'acsCount': parseInt(ptyResObj.acsCount) + parseInt(counts.acsCount)
            };
            SP_Properties.update(query, {$set: updateObj}, function(upError, upResObj) {
              if (upError) {
                logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: createPropertyInfo property counts update,' + upError);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
              } else if (upResObj && upResObj.nModified) {
                AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPProperties, id: resObj.propertyId, value: resObj.propertyTitle }, updateObj);
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
              } else {
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
              }
            });
          } else {
            callback({ httpCode: 400, statusCode: '9997', result: {}});
          }
        });
        // callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  }
  // Begin: updatePropertyInfo
}


  /**
   * @param {object} InfoObj 
   * @param {Function} callback 
   */

  function setSpPropertyInfoData(InfoObj, tokenDecodedData, callback) {
    InfoObj.save(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: createPropertyInfo,' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionSPPropertyInfos, id: resObj._id, value: resObj.propertyTitle }, resObj);
        var query = {'_id': resObj.propertyId, 'spServiceProviderId': resObj.spServiceProviderId, 'isDeleted': false};
        SP_Properties.findOne(query, function(ptyError, ptyResObj) {
          if (ptyError) {
            logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: createPropertyInfo get property data,' + ptyError);
          } else if (ptyResObj && ptyResObj._id) {
            var updateObj = {
              'propertyCapacity': parseInt(ptyResObj.propertyCapacity) + (parseInt(resObj.activeRoomsCount) * parseInt(resObj.membersCapacity)),
              'numRooms': parseInt(ptyResObj.numRooms) + parseInt(resObj.roomsCount),
              'activeNumRooms': parseInt(ptyResObj.activeNumRooms) + parseInt(resObj.activeRoomsCount),
              'inactiveNumRooms': parseInt(ptyResObj.inactiveNumRooms) + parseInt(resObj.inactiveRoomsCount),
              'onHoldNumRooms': parseInt(ptyResObj.onHoldNumRooms) + parseInt(resObj.onHoldRoomsCount),
              'singleBedsCount': parseInt(ptyResObj.singleBedsCount) + parseInt(resObj.singleBedsCount),
              'doubleBedsCount': parseInt(ptyResObj.doubleBedsCount) + parseInt(resObj.doubleBedsCount),
              'privateBathRooms': parseInt(ptyResObj.privateBathRooms) + parseInt(resObj.privateBathRooms),
              'kitchensCount': parseInt(ptyResObj.kitchensCount) + parseInt(resObj.kitchensCount),
              'hallsCount': parseInt(ptyResObj.hallsCount) + parseInt(resObj.hallsCount),
              'acsCount': parseInt(ptyResObj.acsCount) + parseInt(resObj.acsCount)
            };
            SP_Properties.updateOne(query, {$set: updateObj}, {new:true},function(upError, upResObj) {
              if (upError) {
                logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: createPropertyInfo property counts update,' + upError);
              } else if (upResObj && upResObj.nModified) {
                AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPProperties, id: resObj.propertyId, value: resObj.propertyTitle }, updateObj);
              }
            });
          }
        });
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  }


  function updatePropertyInfoPricing(propertyInfoId, upPricingObj, tokendecodedData, callback) {
    SP_PropertyInfo.findOneAndUpdate({_id: propertyInfoId}, {$set: upPricingObj}, {new: true}).exec(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: updatePropertyInfoPricing,' +  error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokendecodedData, 'Update', {name: config.collectionSPPropertyInfos, id: resObj._id, value: resObj.propertyTitle }, upPricingObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  }


  function setSpPropertyInfoPrice(propertyInfoId, propertyId, tokenDecodedData, callback) {
    var query = {
      '_id': {'$nin': propertyInfoId},
      'propertyId': propertyId,
      'isDeleted': false,
      $or: [ { 'pricing.isDefaultMinBasePrice': true }, { 'pricing.isDefaultBasePrice': true } ]
    };
    SP_PropertyInfo.updateMany(query, {$set: {'pricing.isDefaultBasePrice': false, 'pricing.isDefaultMinBasePrice': false }}, function(upError, upResObj) {
      if(upError) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: setSpPropertyInfoPrice,' + upError);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(upResObj && upResObj.nModified >= 1) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update Many', {name: config.collectionSPPropertyInfos, id: JSON.stringify(query), value: 'Property Info Pricing: ' + upResObj.nModified  }, {'pricing.isDefaultBasePrice': false, 'pricing.isDefaultMinBasePrice': false});
        callback({ httpCode: 200, statusCode: '0000', result: upResObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  }


  /**
   * @param {object} upPricingObj 
   * @param {Function} callback 
   */

  function updateSetSpPropertyInfoBasePrice(propertyInfoId, propertyId, tokenDecodedData, callback){
    var query = {
      '_id': {'$nin': propertyInfoId},
      'propertyId': propertyId,
      'pricing.isDefaultBasePrice': true,
      'isDeleted': false
    };
    SP_PropertyInfo.findOneAndUpdate(query, {$set: {'pricing.isDefaultBasePrice': false}}, {new: true}, function(upBaseError, upBaseResObj) {
      if(upBaseError) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: updateSetSpPropertyInfoBasePrice,'+ upBaseError);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(upBaseResObj && upBaseResObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPPropertyInfos, id: upBaseResObj._id, value: upBaseResObj.propertyTitle }, {'pricing.isDefaultBasePrice': false});
        callback({ httpCode: 200, statusCode: '0000', result: upBaseResObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  }


  /**
   * @param {object} upPricingObj 
   * @param {Function} callback 
   */

  function updateSetSpPropertyInfoMinBasePrice(propertyInfoId, propertyId, tokenDecodedData, callback){
    var query = {
      '_id': {'$nin': propertyInfoId},
      'propertyId': propertyId,
      'pricing.isDefaultMinBasePrice': true,
      'isDeleted': false
    };
    SP_PropertyInfo.findOneAndUpdate(query, {$set: {'pricing.isDefaultMinBasePrice': false}}, {new: true}, function(upMinBError, upMinBResObj) {
      if(upMinBError) {
        logger.error('There was an Error occured in daos/SP-PropertyInfoDAO.js: createPropertyInfo,' + upMinBError);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(upMinBResObj && upMinBResObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPPropertyInfos, id: upMinBResObj._id, value: upMinBResObj.propertyTitle }, {'pricing.isDefaultMinBasePrice': false});
        callback({ httpCode: '200', statusCode: '0000', result: upMinBResObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  }

