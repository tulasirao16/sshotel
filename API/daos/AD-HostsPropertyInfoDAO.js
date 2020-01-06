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
var SP_PropertyInfo = require('../models/SP-PropertyInfo');
SP_Properties = require('../models/SP-Properties')
var EU_Bookings = require('../models/EU-Bookings');

// --- Begin: AD-HostsPropertyInfoDAO
module.exports = {
  // --- Begin getADHostsPropertyInfoDataByID:
  getADHostsPropertyInfoDataByID: function (propertyID, callback) {
    var query = {
      'propertyId': propertyID,
      'isDeleted': false,
    };
    SP_PropertyInfo.find(query).exec(function (error, resObj) {
    
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js at getADHostsPropertyInfoDataByID'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // -- End : getADHostsPropertyInfoDataByID

  // --- Begin  updateADHostsPropertyInfos: To update Property Infos View
  updateADHostsPropertyInfos: function(propertyInfoObj, query, counts, tokenDecodedData, callback) {
    SP_PropertyInfo.findOneAndUpdate(query, {$set: propertyInfoObj}, {new: true})
    .populate('propertyId')
    .exec(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: updateADHostsPropertyInfos,' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPPropertyInfos, id: resObj._id, value: resObj.propertyTitle }, propertyInfoObj);
        var query = {'_id': resObj.propertyId, 'spServiceProviderId': resObj.spServiceProviderId, 'isDeleted': false};
        SP_Properties.findOne(query, function(ptyError, ptyResObj) {
          if (ptyError) {
            logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: createPropertyInfo get property data,' + ptyError);
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
                logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: createPropertyInfo property counts update,' + upError);
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
  },
  //END: updateADHostsPropertyInfos: To update Property Infos View

  isBookingsAvailable: function(query, callback) {
    EU_Bookings.find(query, function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: isBookingsAvailable,'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },

  // Begin: ADHostsPropertyInfoStatusChange:
  ADHostsPropertyInfoStatusChange: function(InfoID, tokendecodedData, updateObj, callback) {
    var query = {
      '_id': InfoID,
      // 'spServiceProviderId': tokendecodedData.uspid,
      'isDeleted': false
    };
    SP_PropertyInfo.findOneAndUpdate(query, {$set: updateObj}, {new: true}, function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: ADHostsPropertyInfoStatusChange,'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokendecodedData, 'Update', {name: config.collectionSPPropertyInfos, id: resObj._id, value: resObj.propertyTitle }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // End: ADHostsPropertyInfoStatusChange:

  // Begin : createADHostsPropertyInfo:
  createADHostsPropertyInfo: function(InfoObj, tokenDecodedData, callback) {
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
  // End: createADHostsPropertyInfo
  
  // Begin -- setGuestRuleData
  setGuestRuleData: function(ruleGuestObj, tokenDecodedData, callback) {
    ruleGuestObj.save(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: setGuestRuleData,'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', {name: config.collectionSPPropertyChildRules, id: resObj._id, value: resObj.ruleName }, resObj);
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
        logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: setInfoAmenityData,'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', {name: config.collectionSPPropertyChildAmenities, id: resObj._id, value: resObj.amenityName }, resObj);
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
        logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: setInfoPaidServicesData,'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', {name: config.collectionSPPropertyChildServicesSchema, id: resObj._id, value: resObj.serviceName }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  },
  // End -- setInfoPaidServicesData

  // Begin: updateADHostsPropertyInfoPricing:
  updateADHostsPropertyInfoPricing: function(propertyInfoId, propertyId, upPricingObj, tokenDecodedData, callback) {
    updatePropertyInfoPricing(propertyInfoId, upPricingObj, tokenDecodedData, function(updateObj) {
      if(updateObj.statusCode == '0000' && upPricingObj.isDefaultBasePrice && upPricingObj.isDefaultMinBasePrice) {
        setSpPropertyInfoPrice(propertyInfoId, propertyId, tokenDecodedData, function(resObj) {
        });
      } else if(updateObj.statusCode == '0000' && upPricingObj.isDefaultBasePrice){
        updateSetSpPropertyInfoBasePrice(propertyInfoId, propertyId, tokenDecodedData, function(saveBaseObj){
        });
      } else if(updateObj.statusCode == '0000' && upPricingObj.isDefaultMinBasePrice){
        updateSetSpPropertyInfoMinBasePrice(propertyInfoId, propertyId, tokenDecodedData, function(saveMinBaseObj){
        });
      }
      callback(updateObj);
    });
  },
}
// --- END: AD-HostsPropertyInfoDAO


/**
 * @param {object} InfoObj 
 * @param {object} tokenDecodedData 
 * @param {Function} callback 
*/

function setSpPropertyInfoData(InfoObj, tokenDecodedData, callback) {
  InfoObj.save(function(error, resObj) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: createADHostsPropertyInfo,'+ error);
      callback({ httpCode: 500, statusCode: '9999', result: {} });
    } else if (resObj && resObj._id) {
      AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', {name: config.collectionSPPropertyInfos, id: resObj._id, value: resObj.propertyTitle }, resObj);
      var query = {'_id': resObj.propertyId, 'spServiceProviderId': resObj.spServiceProviderId, 'isDeleted': false};
      SP_Properties.findOne(query, function(ptyError, ptyResObj) {
        if (ptyError) {
          logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: createADHostsPropertyInfo get property data,'+ ptyError);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
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
          SP_Properties.updateOne(query, {$set: updateObj}, function(upError, upResObj) {
            if (upError) {
              logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: createADHostsPropertyInfo property counts update,'+ upError);
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (upResObj && upResObj.nModified) {
              AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPProperties, id: resObj.propertyId, value: resObj.propertyTitle }, updateObj);
              callback({ httpCode: 200, statusCode: '0000', result: resObj });
            } else {
              callback({ httpCode: 200, statusCode: '0000', result: resObj });
            }
          });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {}});
        }
      });
    } else {
      callback({ httpCode: 400, statusCode: '9993', result: {} });
    }
  });
}

  /**
   * @param {object} propertyInfoId 
   * @param {object} propertyId 
   * @param {object} tokenDecodedData 
   * @param {Function} callback 
  */

function setSpPropertyInfoPrice(propertyInfoId, propertyId, tokenDecodedData, callback) {
  var query = {
    '_id': {'$nin': propertyInfoId},
    'propertyId': propertyId,
    'isDeleted': false,
    $or: [ { 'pricing.isDefaultMinBasePrice': true }, { 'pricing.isDefaultBasePrice': true } ]
  };
  SP_PropertyInfo.updateMany(query, {$set: {'pricing.isDefaultBasePrice': false, 'pricing.isDefaultMinBasePrice': false }}, function(upError, upResObj) {
    if(upError) {
      logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: setSpPropertyInfoPrice,' + upError);
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
 * @param {object} propertyInfoId 
 * @param {object} propertyId 
 * @param {object} tokenDecodedData 
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
      logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: updateSetSpPropertyInfoBasePrice,'+ upBaseError);
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
 * @param {object} propertyInfoId 
 * @param {object} propertyId 
 * @param {object} tokenDecodedData 
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
      logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: createPropertyInfo,' + upMinBError);
      callback({ httpCode: 500, statusCode: '9999', result: {} });
    } else if(upMinBResObj && upMinBResObj._id) {
      AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionSPPropertyInfos, id: upMinBResObj._id, value: upMinBResObj.propertyTitle }, {'pricing.isDefaultMinBasePrice': false});
      callback({ httpCode: '200', statusCode: '0000', result: upMinBResObj });
    } else {
      callback({ httpCode: 400, statusCode: '9993', result: {} });
    }
  });
}

/**
 * @param {object} propertyInfoId 
 * @param {object} upPricingObj 
 * @param {object} tokenDecodedData 
 * @param {Function} callback 
*/

function updatePropertyInfoPricing(propertyInfoId, upPricingObj, tokendecodedData, callback) {
  SP_PropertyInfo.findOneAndUpdate({_id: propertyInfoId}, {$set: {pricing: upPricingObj}}, {new: true}).exec(function(error, resObj) {
    if (error) {
      logger.error('There was an Error occured in daos/AD-HostsPropertyInfoDAO.js: updatePropertyInfoPricing,' +  error);
      callback({ httpCode: 500, statusCode: '9999', result: {} });
    } else if (resObj && resObj._id) {
      AuditingInfoDAO.spAuditing(tokendecodedData, 'Update', {name: config.collectionSPPropertyInfos, id: resObj._id, value: resObj.propertyTitle }, upPricingObj);
      callback({ httpCode: 200, statusCode: '0000', result: resObj });
    } else {
      callback({ httpCode: 400, statusCode: '9992', result: {} });
    }
  });
}