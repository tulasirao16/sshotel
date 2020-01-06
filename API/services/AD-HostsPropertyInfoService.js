/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var moment = require('moment');
var randomNumber = require('random-number');
var CommonService = require('./CommonService');
var AD_HostsPropertyInfoDAO = require('../daos/AD-HostsPropertyInfoDAO');
var SP_PropertyInfo = require('../models/SP-PropertyInfo')
var SP_PropertyChildRules = require('../models/SP-PropertyChildRules');
var SP_PropertyChildAmenities = require('../models/SP-PropertyChildAmenities');
var SP_PropertyChildServices = require('../models/SP-PropertyChildServices');
var async = require('async');

//---Begin AD-HostsPropertyInfoService
module.exports = {
  // -- Begin : getADHostsPropertyInfoDataByID
  getADHostsPropertyInfoDataByID: function (propertyID, callback) {
    AD_HostsPropertyInfoDAO.getADHostsPropertyInfoDataByID( propertyID, function (resObj) {
      callback(resObj);
    });
  },
  // -- End : getADHostsPropertyInfoDataByID

  // -- Begin : updateADHostsPropertyInfos: To update Property Infos View
  updateADHostsPropertyInfos: function(reqObj,  propertyInfoId, propertyId, tokendecodedData, callback) {
      var currentUTC = CommonService.currentUTCObj();
      var query = {
        _id: propertyInfoId,
        propertyId: propertyId,
        // spServiceProviderId: tokendecodedData.uspid,
        isDeleted: false
      };
      var propertyInfoObj = updatePropertyInfoData(reqObj, currentUTC);
    AD_HostsPropertyInfoDAO.updateADHostsPropertyInfos(propertyInfoObj, query, reqObj.counts, tokendecodedData, function(resObj) {
      callback(resObj);
      
    });
  },
  // -- End : updateADHostsPropertyInfos: To update Property Infos View

  // -- Begin : ADHostsPropertyInfoStatusChange: To update Property Infos status
  ADHostsPropertyInfoStatusChange: function(infoID, status, tokendecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    if(status == 'Inactive') {
    var query = {
      'spPropertyInfoId': infoID,
      'bookingStatus': {'$in': 'Booked'},
      'isDeleted': false
    };
    AD_HostsPropertyInfoDAO.isBookingsAvailable(query, function(resObj) {
      if(resObj.statusCode == '9997') {
        var updateObj = {
          status: status,
          updatedBy: 'superadmin',
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedOn: currentUTC.currentUTCDateTimeString
        };
        AD_HostsPropertyInfoDAO.ADHostsPropertyInfoStatusChange(infoID, tokendecodedData, updateObj, function(resObj) {
          callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
        })
      } else if(resObj.statusCode == '0000') {
        callback({httpCode: 400, statusCode: '1015', result: {}});
      } else {
        callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
      }
    });
    } else {
      var updateObj = {
        status: status,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      AD_HostsPropertyInfoDAO.ADHostsPropertyInfoStatusChange(infoID, tokendecodedData, updateObj, function(resObj) {
        callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
      })
    }
  },
  //---END: AD-ADHostsPropertyInfoStatusChange

  // -- Begin :createADHostsPropertyInfo
  createADHostsPropertyInfo: function(reqObj, tokendecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    calculation(reqObj, function (calculationData) {
      var propertyInfoObj = setPropertyInfoData(reqObj, calculationData, currentUTC);
      var InfoObj = new SP_PropertyInfo(propertyInfoObj);
      AD_HostsPropertyInfoDAO.createADHostsPropertyInfo(InfoObj, tokendecodedData, function(resObj) {
        if(resObj.statusCode == '0000') {
          if(reqObj.guestRules) {
          recursiveGuestRules(0, resObj.result, reqObj.guestRules, tokendecodedData, function(pGuestRls) {
          });
        }
        if(reqObj.amenities) {
          recursiveInfoAmenities(0, resObj.result, reqObj.amenities, tokendecodedData, function(pAmty) {
          });
        }
        if(reqObj.paidServices) {
          recursiveInfoPaidServices(0, resObj.result, reqObj.paidServices, tokendecodedData, function(pSer) {
          });
        }
        callback(resObj);
        } else {
          callback(resObj);
        }
      });
    });
  },
  // -- End : createADHostsPropertyInfo 

  // -- Begin : updateADHostsPropertyInfoPricing: 
  updateADHostsPropertyInfoPricing: function(propertyInfoId, propertyId, reqObj, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    calculation(reqObj, function(calculationData) {
      var UpPricing = setPropertyInfoPricing(reqObj, calculationData, currentUTC);
      AD_HostsPropertyInfoDAO.updateADHostsPropertyInfoPricing(propertyInfoId, propertyId, UpPricing, tokenDecodedData, function(resObj) {
        callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
      });
    });
  },
  // -- End : updateADHostsPropertyInfoPricing:
}
//---END: AD-HostsPropertyInfoService



function updatePropertyInfoData (reqObj, currentUTC) {
  var infoUpObj = {
      rentType: reqObj.rentType,
      roomCategory: reqObj.roomCategory,
      roomType: reqObj.roomType,
      membersCapacity: reqObj.membersCapacity,
      childsCapacity: reqObj.childsCapacity,
      roomsName: reqObj.roomsName ? reqObj.roomsName : '',
      roomsCount: reqObj.roomsCount,
      activeRoomsCount: reqObj.activeRoomsCount,
      onHoldRoomsCount: reqObj.onHoldRoomsCount ? reqObj.onHoldRoomsCount : 0,
      status: reqObj.status,
      isDefault: reqObj.isDefault,
      inactiveRoomsCount: reqObj.inactiveRoomsCount ? reqObj.inactiveRoomsCount : 0,
      singleBedsCount: reqObj.singleBedsCount ? reqObj.singleBedsCount : 0,
      doubleBedsCount: reqObj.doubleBedsCount ? reqObj.doubleBedsCount : 0,
      privateBathRooms: reqObj.privateBathRooms ? reqObj.privateBathRooms : 0,
      kitchensCount: reqObj.kitchensCount ? reqObj.kitchensCount : 0,
      hallsCount: reqObj.hallsCount ? reqObj.hallsCount : 0,
      acsCount: reqObj.acsCount ? reqObj.acsCount : 0,
      // amenities: reqObj.amenitiesAvailable ? reqObj.amenitiesAvailable : [],
      // guestFreedomNotes: reqObj.guestFreedomNotes ? reqObj.guestFreedomNotes : '',
      updatedBy: 'superadmin',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
  };
  return infoUpObj;
}



var recursiveGuestRules = function(i, resObj, guestRules, tokenDecodedData, callback) {
  if( i < guestRules.length) {
      var ruleObj = setPropertyInfoRule(resObj, guestRules[i]);
      var ruleGuestObj = new SP_PropertyChildRules(ruleObj);
      AD_HostsPropertyInfoDAO.setGuestRuleData(ruleGuestObj, tokenDecodedData, function(reResObj) {
        recursiveGuestRules(i+1, resObj, guestRules, tokenDecodedData, callback);
      });
  } else {
      callback(true);
  }
};

var recursiveInfoAmenities = function(i, resObj, amenities, tokendecodedData, callback) {
  if( i < amenities.length) {
    var amObj = setPropertyInfoAmenityData(resObj, amenities[i]);
    var amtyObj = new SP_PropertyChildAmenities(amObj);
    AD_HostsPropertyInfoDAO.setInfoAmenityData(amtyObj, tokendecodedData, function(reResObj) {
      recursiveInfoAmenities(i+1, resObj, amenities, tokendecodedData, callback);
    });
  } else {
    callback(true);
  }
};

var recursiveInfoPaidServices = function(i, resObj, paidServices, tokendecodedData, callback) {
  if( i < paidServices.length) {
    var serObj = setPropertyInfoPaidServicesData(resObj, paidServices[i]);
    var serviceObj = new SP_PropertyChildServices(serObj);
    AD_HostsPropertyInfoDAO.setInfoPaidServicesData(serviceObj, tokendecodedData, function(reResObj) {
      recursiveInfoPaidServices(i+1, resObj, paidServices, tokendecodedData, callback);
    });
  } else {
    callback(true);
  }
};



/**
 * @param {object} resData 
 * @param {object} guestRule 
 */

function setPropertyInfoRule(resData, guestRule) {
  var ruleObj = {
    spServiceProviderId: resData.spServiceProviderId,
    spServiceProvider: resData.spServiceProvider,
    spLocationId: resData.spLocationId,
    propertyId: resData.propertyId,
    propertyTitle: resData.propertyTitle,
    propertyType: resData.propertyType,
    propertyInfoId: resData._id,
    ruleId: guestRule.ruleId,
    ruleName: guestRule.ruleName,
    ruleOrder: guestRule.ruleOrder,
    ruleStatus: guestRule.ruleStatus,
    ruleIconPath: guestRule.ruleIconPath,
    isDeleted: false,
    createdBy: resData.createdBy,
    createdAt: resData.createdAt,
    createdOn: resData.createdOn,
    updatedBy: resData.updatedBy,
    updatedAt: resData.updatedAt,
    updatedOn: resData.updatedOn
  };
  return ruleObj;
}

/**
 * @param {object} resData 
 * @param {object} amenitiesData 
 */

function setPropertyInfoAmenityData (resData, amenitiesData) {
  var amtyObj = {
    spServiceProviderId: resData.spServiceProviderId,
    spServiceProvider: resData.spServiceProvider,
    spLocationId: resData.spLocationId,
    propertyId: resData.propertyId,
    propertyTitle: resData.propertyTitle,
    propertyType: resData.propertyType,
    propertyInfoId: resData._id,
    amenityId: amenitiesData.amenityId,
    amenityName: amenitiesData.name,
    amenityType: amenitiesData.type,
    amenityIconPath: amenitiesData.amenityIconPath,
    amenityCharge: amenitiesData.price,
    amenityOrder: amenitiesData.amenityOrder,
    amenityStatus : amenitiesData.status,
    isDeleted: false,
    createdBy: resData.createdBy,
    createdAt: resData.createdAt,
    createdOn: resData.createdOn,
    updatedBy: resData.updatedBy,
    updatedAt: resData.updatedAt,
    updatedOn: resData.updatedOn
  };
  return amtyObj;
}

/**
 * @param {object} resData 
 * @param {object} paidServices 
 */

function setPropertyInfoPaidServicesData(resData, paidServices) {
  var pdSvObj = {
    spServiceProviderId: resData.spServiceProviderId,
    spServiceProvider: resData.spServiceProvider,
    spLocationId: resData.spLocationId,
    propertyId: resData.propertyId,
    propertyTitle: resData.propertyTitle,
    propertyType: resData.propertyType,
    propertyInfoId: resData._id,
    serviceId: paidServices.serviceId,
    serviceName: paidServices.serviceName,
    serviceType: paidServices.serviceType,
    serviceIconPath: paidServices.serviceIconPath,
    serviceCharge: paidServices.serviceCharge,
    serviceOrder: paidServices.serviceOrder,
    serviceStatus : paidServices.serviceStatus,
    isDeleted: false,
    createdBy: resData.createdBy,
    createdAt: resData.createdAt,
    createdOn: resData.createdOn,
    updatedBy: resData.updatedBy,
    updatedAt: resData.updatedAt,
    updatedOn: resData.updatedOn
  };
  return pdSvObj;
}


/**
 * @param {object} reqObj 
 * @param {object} callback
 */

function calculation(reqObj, callback) {
  var hrsPrice = {}, discountHrsPrice = {}, cgstHrsPrice = {}, sgstHrsPrice = {}, appChargesHrs = {},
  pgChargesHrs = {}, totalHrsPrice = {}, spAmountHrs = {}, finalAppCharges = {}
  async.series([
    function(callback) {
      hrsPrice = {
        //calculation of minBasePrice 6 Hours to per Hour Price Week Days
        minBaseHrsPrice : Math.ceil(reqObj.pricing.minBasePrice / 6),
        minBaseHrsPrice2 : Math.ceil((reqObj.pricing.minBasePrice2 - reqObj.pricing.minBasePrice) / 6),
        minBaseHrsPrice3 : Math.ceil((reqObj.pricing.minBasePrice3 - reqObj.pricing.minBasePrice2) / 6),
        minBaseHrsPrice4 : Math.ceil((reqObj.pricing.minBasePrice4 - reqObj.pricing.minBasePrice3) / 6),
        //calculation of minBasePrice 6 Hours to 1 hour Price Week End Days
        weekEndMinBaseHrsPrice:  Math.ceil(reqObj.pricing.weekEndMinBasePrice / 6),
        weekEndMinBaseHrsPrice2:  Math.ceil((reqObj.pricing.weekEndMinBasePrice2 - reqObj.pricing.weekEndMinBasePrice) / 6),
        weekEndMinBaseHrsPrice3:  Math.ceil((reqObj.pricing.weekEndMinBasePrice3 - reqObj.pricing.weekEndMinBasePrice2) / 6),
        weekEndMinBaseHrsPrice4:  Math.ceil((reqObj.pricing.weekEndMinBasePrice4 - reqObj.pricing.weekEndMinBasePrice3) / 6)
      };
      callback(null, hrsPrice);
    },
    function(callback) {
      discountHrsPrice = {
        // minBasePriceDiscounts Week Days per Hour
        // adm = After Discount Amount
        admMinBaseHrsPrice:  hrsPrice.minBaseHrsPrice - (Math.floor((hrsPrice.minBaseHrsPrice) * (reqObj.pricing.basePriceDiscount / 100))),
        admMinBaseHrsPrice2 : hrsPrice.minBaseHrsPrice2 - (Math.floor((hrsPrice.minBaseHrsPrice2) * (reqObj.pricing.basePriceDiscount / 100))),
        admMinBaseHrsPrice3 : hrsPrice.minBaseHrsPrice3 - (Math.floor((hrsPrice.minBaseHrsPrice3) * (reqObj.pricing.basePriceDiscount / 100))),
        admMinBaseHrsPrice4 : hrsPrice.minBaseHrsPrice4 - (Math.floor((hrsPrice.minBaseHrsPrice4) * (reqObj.pricing.basePriceDiscount / 100))),
        // minBasePriceDiscounts Week End Days per Hour
        admWeekEndMinBaseHrsPrice : hrsPrice.weekEndMinBaseHrsPrice - (Math.floor((hrsPrice.weekEndMinBaseHrsPrice) * (reqObj.pricing.weekEndBasePriceDiscount / 100))),
        admWeekEndMinBaseHrsPrice2 : hrsPrice.weekEndMinBaseHrsPrice2 - (Math.floor((hrsPrice.weekEndMinBaseHrsPrice2) * (reqObj.pricing.weekEndBasePriceDiscount / 100))),
        admWeekEndMinBaseHrsPrice3 : hrsPrice.weekEndMinBaseHrsPrice3 - (Math.floor((hrsPrice.weekEndMinBaseHrsPrice3) *(reqObj.pricing.weekEndBasePriceDiscount / 100))),
        admWeekEndMinBaseHrsPrice4 : hrsPrice.weekEndMinBaseHrsPrice4 - (Math.floor((hrsPrice.weekEndMinBaseHrsPrice4) * (reqObj.pricing.weekEndBasePriceDiscount / 100)))
      };
      callback(null, discountHrsPrice);
    },
    function(callback) {
      cgstHrsPrice = {
        //With  Discount Week Days per Hour
        cgstAmountMinBaseHrsPrice:  Math.ceil(reqObj.pricing.cgstPercentage * discountHrsPrice.admMinBaseHrsPrice / 100),
        cgstAmountMinBaseHrsPrice2:  Math.ceil(reqObj.pricing.cgstPercentage * discountHrsPrice.admMinBaseHrsPrice2 / 100),
        cgstAmountMinBaseHrsPrice3:  Math.ceil(reqObj.pricing.cgstPercentage * discountHrsPrice.admMinBaseHrsPrice3 / 100),
        cgstAmountMinBaseHrsPrice4:  Math.ceil(reqObj.pricing.cgstPercentage * discountHrsPrice.admMinBaseHrsPrice4 / 100),
        //With  Discount Week End Days per Hour
        cgstAmountWeekEndMinBaseHrsPrice:  Math.ceil(reqObj.pricing.cgstPercentage * discountHrsPrice.admWeekEndMinBaseHrsPrice / 100),
        cgstAmountWeekEndMinBaseHrsPrice2:  Math.ceil(reqObj.pricing.cgstPercentage * discountHrsPrice.admWeekEndMinBaseHrsPrice2 / 100),
        cgstAmountWeekEndMinBaseHrsPrice3:  Math.ceil(reqObj.pricing.cgstPercentage * discountHrsPrice.admWeekEndMinBaseHrsPrice3 / 100),
        cgstAmountWeekEndMinBaseHrsPrice4:  Math.ceil(reqObj.pricing.cgstPercentage * discountHrsPrice.admWeekEndMinBaseHrsPrice4 / 100),
        //With Out Discount Week Days per Hour
        cgstAmountWdMinBaseHrsPrice:  Math.ceil(reqObj.pricing.cgstPercentage * hrsPrice.minBaseHrsPrice / 100),
        cgstAmountWdMinBaseHrsPrice2:  Math.ceil(reqObj.pricing.cgstPercentage * hrsPrice.minBaseHrsPrice2 / 100),
        cgstAmountWdMinBaseHrsPrice3:  Math.ceil(reqObj.pricing.cgstPercentage * hrsPrice.minBaseHrsPrice3 / 100),
        cgstAmountWdMinBaseHrsPrice4:  Math.ceil(reqObj.pricing.cgstPercentage * hrsPrice.minBaseHrsPrice4 / 100),
        //With Out Discount Week End Days per Hour
        cgstAmountWdWeekEndMinBaseHrsPrice:  Math.ceil(reqObj.pricing.cgstPercentage * hrsPrice.weekEndMinBaseHrsPrice / 100),
        cgstAmountWdWeekEndMinBaseHrsPrice2:  Math.ceil(reqObj.pricing.cgstPercentage * hrsPrice.weekEndMinBaseHrsPrice2 / 100),
        cgstAmountWdWeekEndMinBaseHrsPrice3:  Math.ceil(reqObj.pricing.cgstPercentage * hrsPrice.weekEndMinBaseHrsPrice3 / 100),
        cgstAmountWdWeekEndMinBaseHrsPrice4:  Math.ceil(reqObj.pricing.cgstPercentage * hrsPrice.weekEndMinBaseHrsPrice4 / 100)
      };
      callback(null, cgstHrsPrice);
    },
    function(callback) {
      sgstHrsPrice = {
        //With  Discount Week Days per Hour
        sgstAmountMinBaseHrsPrice:  Math.ceil(reqObj.pricing.sgstPercentage * discountHrsPrice.admMinBaseHrsPrice / 100),
        sgstAmountMinBaseHrsPrice2:  Math.ceil(reqObj.pricing.sgstPercentage * discountHrsPrice.admMinBaseHrsPrice2 / 100),
        sgstAmountMinBaseHrsPrice3:  Math.ceil(reqObj.pricing.sgstPercentage * discountHrsPrice.admMinBaseHrsPrice3 / 100),
        sgstAmountMinBaseHrsPrice4:  Math.ceil(reqObj.pricing.sgstPercentage * discountHrsPrice.admMinBaseHrsPrice4 / 100),
        //With  Discount Week End Days Hour
        sgstAmountWeekEndMinBaseHrsPrice:  Math.ceil(reqObj.pricing.sgstPercentage * discountHrsPrice.admWeekEndMinBaseHrsPrice / 100),
        sgstAmountWeekEndMinBaseHrsPrice2:  Math.ceil(reqObj.pricing.sgstPercentage * discountHrsPrice.admWeekEndMinBaseHrsPrice2 / 100),
        sgstAmountWeekEndMinBaseHrsPrice3:  Math.ceil(reqObj.pricing.sgstPercentage * discountHrsPrice.admWeekEndMinBaseHrsPrice3 / 100),
        sgstAmountWeekEndMinBaseHrsPrice4:  Math.ceil(reqObj.pricing.sgstPercentage * discountHrsPrice.admWeekEndMinBaseHrsPrice4 / 100),
   
       //With Out Discount Week Days Hour
       sgstAmountWdMinBaseHrsPrice:  Math.ceil(reqObj.pricing.sgstPercentage * hrsPrice.minBaseHrsPrice / 100),
       sgstAmountWdMinBaseHrsPrice2:  Math.ceil(reqObj.pricing.sgstPercentage * hrsPrice.minBaseHrsPrice2 / 100),
       sgstAmountWdMinBaseHrsPrice3:  Math.ceil(reqObj.pricing.sgstPercentage * hrsPrice.minBaseHrsPrice3 / 100),
       sgstAmountWdMinBaseHrsPrice4:  Math.ceil(reqObj.pricing.sgstPercentage * hrsPrice.minBaseHrsPrice4 / 100),
       //With Out Discount Week End Days Hour
       sgstAmountWdWeekEndMinBaseHrsPrice:  Math.ceil(reqObj.pricing.sgstPercentage * hrsPrice.weekEndMinBaseHrsPrice / 100),
       sgstAmountWdWeekEndMinBaseHrsPrice2:  Math.ceil(reqObj.pricing.sgstPercentage * hrsPrice.weekEndMinBaseHrsPrice2 / 100),
       sgstAmountWdWeekEndMinBaseHrsPrice3:  Math.ceil(reqObj.pricing.sgstPercentage * hrsPrice.weekEndMinBaseHrsPrice3 / 100),
       sgstAmountWdWeekEndMinBaseHrsPrice4:  Math.ceil(reqObj.pricing.sgstPercentage * hrsPrice.weekEndMinBaseHrsPrice4 / 100)
      };
      callback(null, sgstHrsPrice);
    },
    function(callback) {
      appChargesHrs = {
        // Week days app Charges  per Hour
        appChargesMinBaseHrsPrice :  Math.ceil(reqObj.pricing.appPercentage * hrsPrice.minBaseHrsPrice / 100),
        appChargesMinBaseHrsPrice2 :  Math.ceil(reqObj.pricing.appPercentage * hrsPrice.minBaseHrsPrice2 / 100),
        appChargesMinBaseHrsPrice3 :  Math.ceil(reqObj.pricing.appPercentage * hrsPrice.minBaseHrsPrice3 / 100),
        appChargesMinBaseHrsPrice4 :  Math.ceil(reqObj.pricing.appPercentage * hrsPrice.minBaseHrsPrice4 / 100),
        // Week  End days app Charges  per Hour
        appChargesWeekEndMinBaseHrsPrice :  Math.ceil(reqObj.pricing.appPercentage * hrsPrice.weekEndMinBaseHrsPrice / 100),
        appChargesWeekEndMinBaseHrsPrice2 :  Math.ceil(reqObj.pricing.appPercentage * hrsPrice.weekEndMinBaseHrsPrice2 / 100),
        appChargesWeekEndMinBaseHrsPrice3 :  Math.ceil(reqObj.pricing.appPercentage * hrsPrice.weekEndMinBaseHrsPrice3 / 100),
        appChargesWeekEndMinBaseHrsPrice4 :  Math.ceil(reqObj.pricing.appPercentage * hrsPrice.weekEndMinBaseHrsPrice4 / 100)
      };
      callback(null, appChargesHrs);
    },
    function(callback) {
      pgChargesHrs = {
        // pgChargesHrs = (discountHrsPrice + cgstHrsPrice + sgstHrsPrice + appChargesHrs) * appPgPercentage/100;
        //pg = Payment Get Way Charges Per Hour
        // Week Days pg Charges per hour
        pgChargesMinBaseHrsPrice : Math.ceil((discountHrsPrice.admMinBaseHrsPrice + cgstHrsPrice.cgstAmountMinBaseHrsPrice + sgstHrsPrice.sgstAmountMinBaseHrsPrice + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesMinBaseHrsPrice) * reqObj.pricing.appPgPercentage / 100),
        pgChargesMinBaseHrsPrice2 : Math.ceil((discountHrsPrice.admMinBaseHrsPrice2 + cgstHrsPrice.cgstAmountMinBaseHrsPrice2 + sgstHrsPrice.sgstAmountMinBaseHrsPrice2 + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesMinBaseHrsPrice2) * reqObj.pricing.appPgPercentage / 100),
        pgChargesMinBaseHrsPrice3 : Math.ceil((discountHrsPrice.admMinBaseHrsPrice3 + cgstHrsPrice.cgstAmountMinBaseHrsPrice3 + sgstHrsPrice.sgstAmountMinBaseHrsPrice3 + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesMinBaseHrsPrice3) * reqObj.pricing.appPgPercentage / 100),
        pgChargesMinBaseHrsPrice4 : Math.ceil((discountHrsPrice.admMinBaseHrsPrice4 + cgstHrsPrice.cgstAmountMinBaseHrsPrice4 + sgstHrsPrice.sgstAmountMinBaseHrsPrice4 + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesMinBaseHrsPrice4) * reqObj.pricing.appPgPercentage / 100),
        // pg Charges per hour Week End Days
        pgChargesWeekEndMinBaseHrsPrice : Math.ceil((discountHrsPrice.admWeekEndMinBaseHrsPrice + cgstHrsPrice.cgstAmountWeekEndMinBaseHrsPrice + sgstHrsPrice.sgstAmountWeekEndMinBaseHrsPrice + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesWeekEndMinBaseHrsPrice) * reqObj.pricing.appPgPercentage / 100),
        pgChargesWeekEndMinBaseHrsPrice2 : Math.ceil((discountHrsPrice.admWeekEndMinBaseHrsPrice2 + cgstHrsPrice.cgstAmountWeekEndMinBaseHrsPrice2 + sgstHrsPrice.sgstAmountWeekEndMinBaseHrsPrice2 + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesWeekEndMinBaseHrsPrice2) * reqObj.pricing.appPgPercentage / 100),
        pgChargesWeekEndMinBaseHrsPrice3 : Math.ceil((discountHrsPrice.admWeekEndMinBaseHrsPrice3 + cgstHrsPrice.cgstAmountWeekEndMinBaseHrsPrice3 + sgstHrsPrice.sgstAmountWeekEndMinBaseHrsPrice3 + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesWeekEndMinBaseHrsPrice3) * reqObj.pricing.appPgPercentage / 100),
        pgChargesWeekEndMinBaseHrsPrice4 : Math.ceil((discountHrsPrice.admWeekEndMinBaseHrsPrice4 + cgstHrsPrice.cgstAmountWeekEndMinBaseHrsPrice4 + sgstHrsPrice.sgstAmountWeekEndMinBaseHrsPrice4 + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesWeekEndMinBaseHrsPrice4) * reqObj.pricing.appPgPercentage / 100),
       // with out Discount Pg Charges
        // pgChargesHrs = (hrsPrice + cgstHrsPrice + sgstHrsPrice + appChargesHrs) * appPgPercentage/100;
        // Week Days  With out Discount pg Charges per hour
        pgChargesWdMinBaseHrsPrice : Math.ceil((hrsPrice.minBaseHrsPrice + cgstHrsPrice.cgstAmountWdMinBaseHrsPrice + sgstHrsPrice.sgstAmountWdMinBaseHrsPrice + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesMinBaseHrsPrice) * reqObj.pricing.appPgPercentage / 100),
        pgChargesWdMinBaseHrsPrice2 : Math.ceil((hrsPrice.minBaseHrsPrice2 + cgstHrsPrice.cgstAmountWdMinBaseHrsPrice2 + sgstHrsPrice.sgstAmountWdMinBaseHrsPrice2 + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesMinBaseHrsPrice2) * reqObj.pricing.appPgPercentage / 100),
        pgChargesWdMinBaseHrsPrice3 : Math.ceil((hrsPrice.minBaseHrsPrice3 + cgstHrsPrice.cgstAmountWdMinBaseHrsPrice3 + sgstHrsPrice.sgstAmountWdMinBaseHrsPrice3 + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesMinBaseHrsPrice3) * reqObj.pricing.appPgPercentage / 100),
        pgChargesWdMinBaseHrsPrice4 : Math.ceil((hrsPrice.minBaseHrsPrice4 + cgstHrsPrice.cgstAmountWdMinBaseHrsPrice4 + sgstHrsPrice.sgstAmountWdMinBaseHrsPrice4 + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesMinBaseHrsPrice4) * reqObj.pricing.appPgPercentage / 100),
        // Week End Days  With out Discount pg Charges per hour
        pgChargesWdWeekEndMinBaseHrsPrice : Math.ceil((hrsPrice.weekEndMinBaseHrsPrice + cgstHrsPrice.cgstAmountWdWeekEndMinBaseHrsPrice + sgstHrsPrice.sgstAmountWdWeekEndMinBaseHrsPrice + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesWeekEndMinBaseHrsPrice) * reqObj.pricing.appPgPercentage / 100),
        pgChargesWdWeekEndMinBaseHrsPrice2 : Math.ceil((hrsPrice.weekEndMinBaseHrsPrice2 + cgstHrsPrice.cgstAmountWdWeekEndMinBaseHrsPrice2 + sgstHrsPrice.sgstAmountWdWeekEndMinBaseHrsPrice2 + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesWeekEndMinBaseHrsPrice2) * reqObj.pricing.appPgPercentage / 100),
        pgChargesWdWeekEndMinBaseHrsPrice3 : Math.ceil((hrsPrice.weekEndMinBaseHrsPrice3 + cgstHrsPrice.cgstAmountWdWeekEndMinBaseHrsPrice3 + sgstHrsPrice.sgstAmountWdWeekEndMinBaseHrsPrice3 + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesWeekEndMinBaseHrsPrice3) * reqObj.pricing.appPgPercentage / 100),
        pgChargesWdWeekEndMinBaseHrsPrice4 : Math.ceil((hrsPrice.weekEndMinBaseHrsPrice4 + cgstHrsPrice.cgstAmountWdWeekEndMinBaseHrsPrice4 + sgstHrsPrice.sgstAmountWdWeekEndMinBaseHrsPrice4 + reqObj.pricing.serviceCharges + reqObj.pricing.otherCharges + appChargesHrs.appChargesWeekEndMinBaseHrsPrice4) * reqObj.pricing.appPgPercentage / 100) 
      };
      callback(null, pgChargesHrs);
    },
    function(callback) {
      totalHrsPrice = {
        // With Discount Total Amount
        // totalHrsPrice = (discountHrsPrice + cgstHrsPrice + sgstHrsPrice + appChargesHrs + pgChargesHrs)
        // Week Days pg Charges per hour
        totalAmountMinBaseHrsPrice : discountHrsPrice.admMinBaseHrsPrice + cgstHrsPrice.cgstAmountMinBaseHrsPrice + sgstHrsPrice.sgstAmountMinBaseHrsPrice + appChargesHrs.appChargesMinBaseHrsPrice + pgChargesHrs.pgChargesMinBaseHrsPrice,
        totalAmountMinBaseHrsPrice2 : discountHrsPrice.admMinBaseHrsPrice2 + cgstHrsPrice.cgstAmountMinBaseHrsPrice2 + sgstHrsPrice.sgstAmountMinBaseHrsPrice2 + appChargesHrs.appChargesMinBaseHrsPrice2 + pgChargesHrs.pgChargesMinBaseHrsPrice2,
        totalAmountMinBaseHrsPrice3 : discountHrsPrice.admMinBaseHrsPrice3 + cgstHrsPrice.cgstAmountMinBaseHrsPrice3 + sgstHrsPrice.sgstAmountMinBaseHrsPrice3 + appChargesHrs.appChargesMinBaseHrsPrice3 + pgChargesHrs.pgChargesMinBaseHrsPrice3,
        totalAmountMinBaseHrsPrice4 : discountHrsPrice.admMinBaseHrsPrice4 + cgstHrsPrice.cgstAmountMinBaseHrsPrice4 + sgstHrsPrice.sgstAmountMinBaseHrsPrice4 + appChargesHrs.appChargesMinBaseHrsPrice4 + pgChargesHrs.pgChargesMinBaseHrsPrice4,
        // Week End Days Total Amount per hour 
        totalAmountWeekEndMinBaseHrsPrice : discountHrsPrice.admWeekEndMinBaseHrsPrice + cgstHrsPrice.cgstAmountWeekEndMinBaseHrsPrice + sgstHrsPrice.sgstAmountWeekEndMinBaseHrsPrice + appChargesHrs.appChargesWeekEndMinBaseHrsPrice + pgChargesHrs.pgChargesWeekEndMinBaseHrsPrice,
        totalAmountWeekEndMinBaseHrsPrice2 : discountHrsPrice.admWeekEndMinBaseHrsPrice2 + cgstHrsPrice.cgstAmountWeekEndMinBaseHrsPrice2 + sgstHrsPrice.sgstAmountWeekEndMinBaseHrsPrice2 + appChargesHrs.appChargesWeekEndMinBaseHrsPrice2 + pgChargesHrs.pgChargesWeekEndMinBaseHrsPrice2,
        totalAmountWeekEndMinBaseHrsPrice3 : discountHrsPrice.admWeekEndMinBaseHrsPrice3 + cgstHrsPrice.cgstAmountWeekEndMinBaseHrsPrice3 + sgstHrsPrice.sgstAmountWeekEndMinBaseHrsPrice3 + appChargesHrs.appChargesWeekEndMinBaseHrsPrice3 + pgChargesHrs.pgChargesWeekEndMinBaseHrsPrice3,
        totalAmountWeekEndMinBaseHrsPrice4 : discountHrsPrice.admWeekEndMinBaseHrsPrice4 + cgstHrsPrice.cgstAmountWeekEndMinBaseHrsPrice4 + sgstHrsPrice.sgstAmountWeekEndMinBaseHrsPrice4 + appChargesHrs.appChargesWeekEndMinBaseHrsPrice4 + pgChargesHrs.pgChargesWeekEndMinBaseHrsPrice4,
        // with out Discount Total Amount
        // totalHrsPrice = (cgstHrsPrice + sgstHrsPrice + appChargesHrs + pgChargesHrs)
        // Week Days  With out Discount Total Amount per hour
        totalAmountWdMinBaseHrsPrice : hrsPrice.minBaseHrsPrice + cgstHrsPrice.cgstAmountWdMinBaseHrsPrice + sgstHrsPrice.sgstAmountWdMinBaseHrsPrice + appChargesHrs.appChargesMinBaseHrsPrice + pgChargesHrs.pgChargesWdMinBaseHrsPrice,
        totalAmountWdMinBaseHrsPrice2 : hrsPrice.minBaseHrsPrice2 + cgstHrsPrice.cgstAmountWdMinBaseHrsPrice2 + sgstHrsPrice.sgstAmountWdMinBaseHrsPrice2 + appChargesHrs.appChargesMinBaseHrsPrice2 + pgChargesHrs.pgChargesWdMinBaseHrsPrice2,
        totalAmountWdMinBaseHrsPrice3 : hrsPrice.minBaseHrsPrice3 + cgstHrsPrice.cgstAmountWdMinBaseHrsPrice3 + sgstHrsPrice.sgstAmountWdMinBaseHrsPrice3 + appChargesHrs.appChargesMinBaseHrsPrice3 + pgChargesHrs.pgChargesWdMinBaseHrsPrice3,
        totalAmountWdMinBaseHrsPrice4 : hrsPrice.minBaseHrsPrice4 + cgstHrsPrice.cgstAmountWdMinBaseHrsPrice4 + sgstHrsPrice.sgstAmountWdMinBaseHrsPrice4 + appChargesHrs.appChargesMinBaseHrsPrice4 + pgChargesHrs.pgChargesWdMinBaseHrsPrice4,
        // Week End Days  With out Discount Total Amount per hour
        totalAmountWdWeekEndMinBaseHrsPrice : hrsPrice.weekEndMinBaseHrsPrice + cgstHrsPrice.cgstAmountWdWeekEndMinBaseHrsPrice + sgstHrsPrice.sgstAmountWdWeekEndMinBaseHrsPrice + appChargesHrs.appChargesWeekEndMinBaseHrsPrice + pgChargesHrs.pgChargesWdWeekEndMinBaseHrsPrice,
        totalAmountWdWeekEndMinBaseHrsPrice2 : hrsPrice.weekEndMinBaseHrsPrice2 + cgstHrsPrice.cgstAmountWdWeekEndMinBaseHrsPrice2 + sgstHrsPrice.sgstAmountWdWeekEndMinBaseHrsPrice2 + appChargesHrs.appChargesWeekEndMinBaseHrsPrice2 + pgChargesHrs.pgChargesWdWeekEndMinBaseHrsPrice2,
        totalAmountWdWeekEndMinBaseHrsPrice3 : hrsPrice.weekEndMinBaseHrsPrice3 + cgstHrsPrice.cgstAmountWdWeekEndMinBaseHrsPrice3 + sgstHrsPrice.sgstAmountWdWeekEndMinBaseHrsPrice3 + appChargesHrs.appChargesWeekEndMinBaseHrsPrice3 + pgChargesHrs.pgChargesWdWeekEndMinBaseHrsPrice3,
        totalAmountWdWeekEndMinBaseHrsPrice4 : hrsPrice.weekEndMinBaseHrsPrice4 + cgstHrsPrice.cgstAmountWdWeekEndMinBaseHrsPrice4 + sgstHrsPrice.sgstAmountWdWeekEndMinBaseHrsPrice4 + appChargesHrs.appChargesWeekEndMinBaseHrsPrice4 + pgChargesHrs.pgChargesWdWeekEndMinBaseHrsPrice4
      };
      callback(null, totalHrsPrice);
    },
    function(callback) {
      spAmountHrs = {
        // spAmountHrs = totalHrsPrice - pgChargesHrs - appChargesHrs
        // With Discount 
        //  spAmount Week Days  Per 
        spAmountMinBaseHrsPrice : Math.floor((reqObj.pricing.minBaseSpAmount - reqObj.pricing.serviceCharges - reqObj.pricing.otherCharges)/6),
        spAmountMinBaseHrsPrice2 : Math.floor(reqObj.pricing.minBaseSpAmount2/6 - reqObj.pricing.minBaseSpAmount/6),
        spAmountMinBaseHrsPrice3 : Math.floor(reqObj.pricing.minBaseSpAmount3/6 - reqObj.pricing.minBaseSpAmount2/6),
        spAmountMinBaseHrsPrice4 : Math.floor(reqObj.pricing.minBaseSpAmount4/6 - reqObj.pricing.minBaseSpAmount3/6),
        spAmountweekEndMinBaseHrsPrice: Math.floor((reqObj.pricing.weekEndMinBaseSpAmount - reqObj.pricing.serviceCharges - reqObj.pricing.otherCharges)/6),
        spAmountweekEndMinBaseHrsPrice2: Math.floor(reqObj.pricing.weekEndMinBaseSpAmount2/6 - reqObj.pricing.weekEndMinBaseSpAmount/6),
        spAmountweekEndMinBaseHrsPrice3: Math.floor(reqObj.pricing.weekEndMinBaseSpAmount3/6 - reqObj.pricing.weekEndMinBaseSpAmount2/6),
        spAmountweekEndMinBaseHrsPrice4: Math.floor(reqObj.pricing.weekEndMinBaseSpAmount4/6 - reqObj.pricing.weekEndMinBaseSpAmount3/6),
      };
      callback(null, spAmountHrs);
    },
    function(callback) {
      finalAppCharges = {                                                                                                                                                                                              
        // Week Days 
        fACMinBaseHrsPrice: totalHrsPrice.totalAmountMinBaseHrsPrice - pgChargesHrs.pgChargesMinBaseHrsPrice - spAmountHrs.spAmountMinBaseHrsPrice,
        fACMinBaseHrsPrice2 : totalHrsPrice.totalAmountMinBaseHrsPrice2 - pgChargesHrs.pgChargesMinBaseHrsPrice2 - spAmountHrs.spAmountMinBaseHrsPrice2,
        fACMinBaseHrsPrice3 : totalHrsPrice.totalAmountMinBaseHrsPrice3 - pgChargesHrs.pgChargesMinBaseHrsPrice3 - spAmountHrs.spAmountMinBaseHrsPrice3, 
        fACMinBaseHrsPrice4 : totalHrsPrice.totalAmountMinBaseHrsPrice4 - pgChargesHrs.pgChargesMinBaseHrsPrice4 - spAmountHrs.spAmountMinBaseHrsPrice4,
       //Week End Days Per hour
        fACWeekEndMinBaseHrsPrice : totalHrsPrice.totalAmountWeekEndMinBaseHrsPrice - pgChargesHrs.pgChargesWeekEndMinBaseHrsPrice - spAmountHrs.spAmountweekEndMinBaseHrsPrice,
        fACWeekEndMinBaseHrsPrice2 : totalHrsPrice.totalAmountWeekEndMinBaseHrsPrice2 - pgChargesHrs.pgChargesWeekEndMinBaseHrsPrice2 - spAmountHrs.spAmountweekEndMinBaseHrsPrice2,
        fACWeekEndMinBaseHrsPrice3 : totalHrsPrice.totalAmountWeekEndMinBaseHrsPrice3 - pgChargesHrs.pgChargesWeekEndMinBaseHrsPrice3 - spAmountHrs.spAmountweekEndMinBaseHrsPrice3,
        fACWeekEndMinBaseHrsPrice4 : totalHrsPrice.totalAmountWeekEndMinBaseHrsPrice4 - pgChargesHrs.pgChargesWeekEndMinBaseHrsPrice4 - spAmountHrs.spAmountweekEndMinBaseHrsPrice4  
      };
      callback(null, finalAppCharges);
    }
  ], function (err, result) {
    if(err) {}
    var startTime = moment(reqObj.pricing.checkInTime, 'hh:mm: A');
    var endTime = moment(reqObj.pricing.checkOutTime, 'hh:mm: A');
    var duration = moment.duration(endTime.diff(startTime));
    var hours = duration.asHours();
    // var hours = endTime.diff(startTime, 'hours');
    var durationTime = hours > 0 ? hours : hours + 24;

    callback( {hrsPrice: hrsPrice, discountHrsPrice: discountHrsPrice, cgstHrsPrice: cgstHrsPrice, sgstHrsPrice: sgstHrsPrice, appChargesHrs: appChargesHrs,
      pgChargesHrs: pgChargesHrs, totalHrsPrice: totalHrsPrice, spAmountHrs: spAmountHrs, finalAppCharges: finalAppCharges, durationTime: durationTime });
  });
}


/**
 * @param {object} reqObj 
 * @param {object} tokendecodedData 
 * @param {object} currentUTC 
 * @param {object} calculationData 
 * @param {object} callback
 */

function setPropertyInfoData (reqObj, calculationData, currentUTC) {
  var infoObj = {
    spServiceProviderId: reqObj.spServiceProviderId,
    spServiceProvider: reqObj.spServiceProvider,
      spLocationId: reqObj.spLocationId,
      spLocationObj: {
        contactPerson: reqObj.spLocationObj.contactPerson,
        mobileNumber: reqObj.spLocationObj.mobileNumber,
        alternateMobileNumber: reqObj.spLocationObj.alternateMobileNumber ? reqObj.spLocationObj.alternateMobileNumber : '',
        email: reqObj.spLocationObj.email,
        address: reqObj.spLocationObj.address,
        landmark: reqObj.landmark ? reqObj.landmark : '',
        area: reqObj.spLocationObj.area,
        areaLocality: reqObj.spLocationObj.areaLocality ? reqObj.spLocationObj.areaLocality : '',
        zip: reqObj.spLocationObj.zip,
        city: reqObj.spLocationObj.city,
        state: reqObj.spLocationObj.state,
        country: reqObj.spLocationObj.country,
        latitude: reqObj.spLocationObj.latitude,
        longitude: reqObj.spLocationObj.longitude
      },
      propertyId: reqObj.propertyId,
      propertyTitle: reqObj.propertyTitle,
      propertyType: reqObj.propertyType,
      rentType: reqObj.rentType,
      roomCategory: reqObj.roomCategory,
      roomType: reqObj.roomType,
      membersCapacity: reqObj.membersCapacity,
      childsCapacity: reqObj.childsCapacity,
      roomsName: reqObj.roomsName ? reqObj.roomsName : '',
      roomsCount: reqObj.roomsCount,
      activeRoomsCount: reqObj.activeRoomsCount,
      onHoldRoomsCount: reqObj.onHoldRoomsCount ? reqObj.onHoldRoomsCount : 0,
      status: reqObj.status,
      inactiveRoomsCount: reqObj.inactiveRoomsCount ? reqObj.inactiveRoomsCount : 0,
      singleBedsCount: reqObj.singleBedsCount ? reqObj.singleBedsCount : 0,
      doubleBedsCount: reqObj.doubleBedsCount ? reqObj.doubleBedsCount : 0,
      privateBathRooms: reqObj.privateBathRooms ? reqObj.privateBathRooms : 0,
      kitchensCount: reqObj.kitchensCount ? reqObj.kitchensCount : 0,
      hallsCount: reqObj.hallsCount ? reqObj.hallsCount : 0,
      acsCount: reqObj.acsCount ? reqObj.acsCount : 0,
      pricing: {
        minBasePriceUnit: reqObj.pricing.minBasePriceUnit, 
        minBasePriceUnitValue: reqObj.pricing.minBasePriceUnitValue, 
        minBasePrice: reqObj.pricing.minBasePrice,
        minBasePrice2: reqObj.pricing.minBasePrice2,
        minBasePrice3: reqObj.pricing.minBasePrice3,
        minBasePrice4: reqObj.pricing.minBasePrice4,
        minBasePriceDiscount: reqObj.pricing.minBasePriceDiscount,
        weekEndMinBasePrice: reqObj.pricing.weekEndMinBasePrice,
        weekEndMinBasePrice2: reqObj.pricing.weekEndMinBasePrice2,
        weekEndMinBasePrice3: reqObj.pricing.weekEndMinBasePrice3,
        weekEndMinBasePrice4: reqObj.pricing.weekEndMinBasePrice4,
        billingType: reqObj.pricing.billingType, 
        basePrice: reqObj.pricing.basePrice,
        basePriceDiscount: reqObj.pricing.basePriceDiscount,
        weekEndBasePrice: reqObj.pricing.weekEndBasePrice,
        weekEndBasePriceDiscount: reqObj.pricing.weekEndBasePriceDiscount,
        serviceCharges: reqObj.pricing.serviceCharges,
        otherCharges: reqObj.pricing.otherCharges,
        currency: reqObj.pricing.currency, 
        checkInCredentials: reqObj.pricing.checkInCredentials, 
        checkInTime: reqObj.pricing.checkInTime,
        checkOutTime: reqObj.pricing.checkOutTime,
        durationTimeHrs: calculationData.durationTime,
        fullRefundCancelTime: reqObj.pricing.fullRefundCancelTime,
        refundCancelTime: reqObj.pricing.refundCancelTime,
        refundCancelPercentage: reqObj.pricing.refundCancelPercentage,
        cgstPercentage: reqObj.pricing.cgstPercentage, 
        sgstPercentage: reqObj.pricing.sgstPercentage,
        appPercentage: reqObj.pricing.appPercentage,
        appCharges: reqObj.pricing.appCharges,
        weekEndAppCharges: reqObj.pricing.weekEndAppCharges,
        minBaseAppCharges: reqObj.pricing.minBaseAppCharges,
        minBaseAppCharges2: reqObj.pricing.minBaseAppCharges2,
        minBaseAppCharges3: reqObj.pricing.minBaseAppCharges3,
        minBaseAppCharges4: reqObj.pricing.minBaseAppCharges4,
        weekEndMinBaseAppCharges: reqObj.pricing.weekEndMinBaseAppCharges,
        weekEndMinBaseAppCharges2: reqObj.pricing.weekEndMinBaseAppCharges2,
        weekEndMinBaseAppCharges3: reqObj.pricing.weekEndMinBaseAppCharges3,
        weekEndMinBaseAppCharges4: reqObj.pricing.weekEndMinBaseAppCharges4,
        appPgPercentage: reqObj.pricing.appPgPercentage,
        spAmount: reqObj.pricing.spAmount, 
        weekEndSpAmount: reqObj.pricing.weekEndSpAmount,
        minBaseSpAmount: reqObj.pricing.minBaseSpAmount,
        minBaseSpAmount2: reqObj.pricing.minBaseSpAmount2,
        minBaseSpAmount3: reqObj.pricing.minBaseSpAmount3,
        minBaseSpAmount4: reqObj.pricing.minBaseSpAmount4,
        weekEndMinBaseSpAmount: reqObj.pricing.weekEndMinBaseSpAmount,
        weekEndMinBaseSpAmount2: reqObj.pricing.weekEndMinBaseSpAmount2,
        weekEndMinBaseSpAmount3: reqObj.pricing.weekEndMinBaseSpAmount3,
        weekEndMinBaseSpAmount4: reqObj.pricing.weekEndMinBaseSpAmount4,
        totalPrice: reqObj.pricing.totalPrice,
        weekEndTotalPrice: reqObj.pricing.weekEndTotalPrice,
        minBaseTotalPrice: reqObj.pricing.minBaseTotalPrice,
        minBaseTotalPrice2: reqObj.pricing.minBaseTotalPrice2,
        minBaseTotalPrice3: reqObj.pricing.minBaseTotalPrice3,
        minBaseTotalPrice4: reqObj.pricing.minBaseTotalPrice4,
        weekEndMinBaseTotalPrice: reqObj.pricing.weekEndMinBaseTotalPrice,
        weekEndMinBaseTotalPrice2: reqObj.pricing.weekEndMinBaseTotalPrice2,
        weekEndMinBaseTotalPrice3: reqObj.pricing.weekEndMinBaseTotalPrice3,
        weekEndMinBaseTotalPrice4: reqObj.pricing.weekEndMinBaseTotalPrice4,
        grandTotalPrice: reqObj.pricing.spAmount + reqObj.pricing.appCharges, 
        weekEndGrandTotalPrice:  reqObj.pricing.weekEndSpAmount + reqObj.pricing.weekEndAppCharges,
        minBaseGrandTotalPrice: reqObj.pricing.minBaseSpAmount + reqObj.pricing.minBaseAppCharges,
        minBaseGrandTotalPrice2: reqObj.pricing.minBaseSpAmount2 + reqObj.pricing.minBaseAppCharges2,
        minBaseGrandTotalPrice3: reqObj.pricing.minBaseSpAmount3 + reqObj.pricing.minBaseAppCharges3,
        minBaseGrandTotalPrice4: reqObj.pricing.minBaseSpAmount4 + reqObj.pricing.minBaseAppCharges4,
        weekEndMinBaseGrandTotalPrice: reqObj.pricing.weekEndMinBaseSpAmount + reqObj.pricing.weekEndMinBaseAppCharges,
        weekEndMinBaseGrandTotalPrice2: reqObj.pricing.weekEndMinBaseSpAmount2 + reqObj.pricing.weekEndMinBaseAppCharges2,
        weekEndMinBaseGrandTotalPrice3: reqObj.pricing.weekEndMinBaseSpAmount3 + reqObj.pricing.weekEndMinBaseAppCharges3,
        weekEndMinBaseGrandTotalPrice4: reqObj.pricing.weekEndMinBaseSpAmount4 + reqObj.pricing.weekEndMinBaseAppCharges4,
        wdTotalPrice: reqObj.pricing.wdTotalPrice,// without Discount 
        weekEndWdTotalPrice: reqObj.pricing.weekEndWdTotalPrice,
        minBaseWdTotalPrice: reqObj.pricing.minBaseWdTotalPrice,
        minBaseWdTotalPrice2: reqObj.pricing.minBaseWdTotalPrice2,
        minBaseWdTotalPrice3: reqObj.pricing.minBaseWdTotalPrice3,
        minBaseWdTotalPrice4: reqObj.pricing.minBaseWdTotalPrice4,
        weekEndMinBaseWdTotalPrice: reqObj.pricing.weekEndMinBaseWdTotalPrice,
        weekEndMinBaseWdTotalPrice2: reqObj.pricing.weekEndMinBaseWdTotalPrice2,
        weekEndMinBaseWdTotalPrice3: reqObj.pricing.weekEndMinBaseWdTotalPrice3,
        weekEndMinBaseWdTotalPrice4: reqObj.pricing.weekEndMinBaseWdTotalPrice4,
        //sp Amount Hrs
        minBaseHrsSpAmount: calculationData.spAmountHrs.spAmountMinBaseHrsPrice,
        minBaseHrsSpAmount2: calculationData.spAmountHrs.spAmountMinBaseHrsPrice2,
        minBaseHrsSpAmount3: calculationData.spAmountHrs.spAmountMinBaseHrsPrice3,
        minBaseHrsSpAmount4: calculationData.spAmountHrs.spAmountMinBaseHrsPrice4,
        weekEndMinBaseHrsSpAmount: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice,
        weekEndMinBaseHrsSpAmount2: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice2,
        weekEndMinBaseHrsSpAmount3: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice3,
        weekEndMinBaseHrsSpAmount4: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice4,
        //Total hours Price with Discount
        minBaseHrsTotalPrice: calculationData.totalHrsPrice.totalAmountMinBaseHrsPrice,
        minBaseHrsTotalPrice2: calculationData.totalHrsPrice.totalAmountMinBaseHrsPrice2,
        minBaseHrsTotalPrice3: calculationData.totalHrsPrice.totalAmountMinBaseHrsPrice3,
        minBaseHrsTotalPrice4: calculationData.totalHrsPrice.totalAmountMinBaseHrsPrice4,
        weekEndMinBaseHrsTotalPrice: calculationData.totalHrsPrice.totalAmountWeekEndMinBaseHrsPrice,
        weekEndMinBaseHrsTotalPrice2: calculationData.totalHrsPrice.totalAmountWeekEndMinBaseHrsPrice2,
        weekEndMinBaseHrsTotalPrice3: calculationData.totalHrsPrice.totalAmountWeekEndMinBaseHrsPrice3,
        weekEndMinBaseHrsTotalPrice4: calculationData.totalHrsPrice.totalAmountWeekEndMinBaseHrsPrice4,
        //Total Hours Price With Out Discount
        minBaseHrsWdTotalPrice: calculationData.totalHrsPrice.totalAmountWdMinBaseHrsPrice,
        minBaseHrsWdTotalPrice2: calculationData.totalHrsPrice.totalAmountWdMinBaseHrsPrice2,
        minBaseHrsWdTotalPrice3: calculationData.totalHrsPrice.totalAmountWdMinBaseHrsPrice3,
        minBaseHrsWdTotalPrice4:  calculationData.totalHrsPrice.totalAmountWdMinBaseHrsPrice4,
        weekEndMinBaseHrsWdTotalPrice: calculationData.totalHrsPrice.totalAmountWdWeekEndMinBaseHrsPrice,
        weekEndMinBaseHrsWdTotalPrice2: calculationData.totalHrsPrice.totalAmountWdWeekEndMinBaseHrsPrice2,
        weekEndMinBaseHrsWdTotalPrice3:  calculationData.totalHrsPrice.totalAmountWdWeekEndMinBaseHrsPrice3,
        weekEndMinBaseHrsWdTotalPrice4: calculationData.totalHrsPrice.totalAmountWdWeekEndMinBaseHrsPrice4,
        // Grant Total With Discount
        minBaseHrsGrandTotalPrice: calculationData.spAmountHrs.spAmountMinBaseHrsPrice + calculationData.appChargesHrs.appChargesMinBaseHrsPrice,
        minBaseHrsGrandTotalPrice2: calculationData.spAmountHrs.spAmountMinBaseHrsPrice2 + calculationData.appChargesHrs.appChargesMinBaseHrsPrice2,
        minBaseHrsGrandTotalPrice3: calculationData.spAmountHrs.spAmountMinBaseHrsPrice3 + calculationData.appChargesHrs.appChargesMinBaseHrsPrice3,
        minBaseHrsGrandTotalPrice4: calculationData.spAmountHrs.spAmountMinBaseHrsPrice4 + calculationData.appChargesHrs.appChargesMinBaseHrsPrice4,
        weekEndMinBaseHrsGrandTotalPrice: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice + calculationData.appChargesHrs.appChargesWeekEndMinBaseHrsPrice,
        weekEndMinBaseHrsGrandTotalPrice2: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice2 + calculationData.appChargesHrs.appChargesWeekEndMinBaseHrsPrice2,
        weekEndMinBaseHrsGrandTotalPrice3: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice3 + calculationData.appChargesHrs.appChargesWeekEndMinBaseHrsPrice3,
        weekEndMinBaseHrsGrandTotalPrice4: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice4 + calculationData.appChargesHrs.appChargesWeekEndMinBaseHrsPrice4,
        // App Charges Hours
        minBaseHrsAppCharges: calculationData.finalAppCharges.fACMinBaseHrsPrice,
        minBaseHrsAppCharges2: calculationData.finalAppCharges.fACMinBaseHrsPrice2,
        minBaseHrsAppCharges3: calculationData.finalAppCharges.fACMinBaseHrsPrice3,
        minBaseHrsAppCharges4: calculationData.finalAppCharges.fACMinBaseHrsPrice4,
        weekEndMinBaseHrsAppCharges: calculationData.finalAppCharges.fACWeekEndMinBaseHrsPrice,
        weekEndMinBaseHrsAppCharges2: calculationData.finalAppCharges.fACWeekEndMinBaseHrsPrice2,
        weekEndMinBaseHrsAppCharges3: calculationData.finalAppCharges.fACWeekEndMinBaseHrsPrice3,
        weekEndMinBaseHrsAppCharges4: calculationData.finalAppCharges.fACWeekEndMinBaseHrsPrice4,

        isDefaultBasePrice: reqObj.pricing.isDefaultBasePrice,
        isDefaultMinBasePrice: reqObj.pricing.isDefaultMinBasePrice,
        isMidnightCheckOutAllowed: reqObj.pricing.isMidnightCheckOutAllowed
    },
      amenities: reqObj.amenitiesAvailable ? reqObj.amenitiesAvailable : [],
      services: reqObj.servicesAvailable ? reqObj.servicesAvailable : [],
      guestRules: reqObj.guestRulesAvaliable ? reqObj.guestRulesAvaliable : [],
      nearestAreas: reqObj.nearestAreas ? reqObj.nearestAreas : [],
      guestRulesNotes: reqObj.guestRuleNote ? reqObj.guestRuleNote : '',
      isDefault: reqObj.isDefault,
      isDeleted: false,
      createdBy: 'superadmin',
      createdAt: currentUTC.currentUTCDateTimeNumber,
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedBy: 'superadmin',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
  };
  return infoObj;
}


/**
 * @param {object} reqObj 
 * @param {object} currentUTC 
 * @param {object} calculationData 
 * @param {object} callback
 */

function setPropertyInfoPricing (reqObj, calculationData, currentUTC) {
  var UpPricing = {
    minBasePriceUnit:reqObj.pricing.minBasePriceUnit, 
    minBasePriceUnitValue: reqObj.pricing.minBasePriceUnitValue, 
    minBasePrice: reqObj.pricing.minBasePrice,
    minBasePrice2: reqObj.pricing.minBasePrice2,
    minBasePrice3: reqObj.pricing.minBasePrice3,
    minBasePrice4: reqObj.pricing.minBasePrice4,
    minBasePriceDiscount: reqObj.pricing.minBasePriceDiscount,
    weekEndMinBasePrice: reqObj.pricing.weekEndMinBasePrice,
    weekEndMinBasePrice2: reqObj.pricing.weekEndMinBasePrice2,
    weekEndMinBasePrice3: reqObj.pricing.weekEndMinBasePrice3,
    weekEndMinBasePrice4: reqObj.pricing.weekEndMinBasePrice4,
    billingType: reqObj.pricing.billingType, 
    basePrice: reqObj.pricing.basePrice,
    basePriceDiscount: reqObj.pricing.basePriceDiscount,
    weekEndBasePrice: reqObj.pricing.weekEndBasePrice,
    weekEndBasePriceDiscount: reqObj.pricing.weekEndBasePriceDiscount,
    serviceCharges: reqObj.pricing.serviceCharges,
    otherCharges: reqObj.pricing.otherCharges,
    currency: reqObj.pricing.currency, 
    checkInCredentials: reqObj.pricing.checkInCredentials, 
    checkInTime: reqObj.pricing.checkInTime,
    checkOutTime: reqObj.pricing.checkOutTime,
    durationTimeHrs: calculationData.durationTime,
    fullRefundCancelTime: reqObj.pricing.fullRefundCancelTime,
    refundCancelTime: reqObj.pricing.refundCancelTime,
    refundCancelPercentage: reqObj.pricing.refundCancelPercentage,
    cgstPercentage: reqObj.pricing.cgstPercentage, 
    sgstPercentage: reqObj.pricing.sgstPercentage,
    appPercentage: reqObj.pricing.appPercentage,
    appCharges: reqObj.pricing.appCharges,
    weekEndAppCharges: reqObj.pricing.weekEndAppCharges,
    minBaseAppCharges: reqObj.pricing.minBaseAppCharges,
    minBaseAppCharges2: reqObj.pricing.minBaseAppCharges2,
    minBaseAppCharges3: reqObj.pricing.minBaseAppCharges3,
    minBaseAppCharges4: reqObj.pricing.minBaseAppCharges4,
    weekEndMinBaseAppCharges: reqObj.pricing.weekEndMinBaseAppCharges,
    weekEndMinBaseAppCharges2: reqObj.pricing.weekEndMinBaseAppCharges2,
    weekEndMinBaseAppCharges3: reqObj.pricing.weekEndMinBaseAppCharges3,
    weekEndMinBaseAppCharges4: reqObj.pricing.weekEndMinBaseAppCharges4,
    appPgPercentage: reqObj.pricing.appPgPercentage,
    spAmount: reqObj.pricing.spAmount, 
    weekEndSpAmount: reqObj.pricing.weekEndSpAmount,
    minBaseSpAmount: reqObj.pricing.minBaseSpAmount,
    minBaseSpAmount2: reqObj.pricing.minBaseSpAmount2,
    minBaseSpAmount3: reqObj.pricing.minBaseSpAmount3,
    minBaseSpAmount4: reqObj.pricing.minBaseSpAmount4,
    weekEndMinBaseSpAmount: reqObj.pricing.weekEndMinBaseSpAmount,
    weekEndMinBaseSpAmount2: reqObj.pricing.weekEndMinBaseSpAmount2,
    weekEndMinBaseSpAmount3: reqObj.pricing.weekEndMinBaseSpAmount3,
    weekEndMinBaseSpAmount4: reqObj.pricing.weekEndMinBaseSpAmount4,
    totalPrice: reqObj.pricing.totalPrice,
    weekEndTotalPrice: reqObj.pricing.weekEndTotalPrice,
    minBaseTotalPrice: reqObj.pricing.minBaseTotalPrice,
    minBaseTotalPrice2: reqObj.pricing.minBaseTotalPrice2,
    minBaseTotalPrice3: reqObj.pricing.minBaseTotalPrice3,
    minBaseTotalPrice4: reqObj.pricing.minBaseTotalPrice4,
    weekEndMinBaseTotalPrice: reqObj.pricing.weekEndMinBaseTotalPrice,
    weekEndMinBaseTotalPrice2: reqObj.pricing.weekEndMinBaseTotalPrice2,
    weekEndMinBaseTotalPrice3: reqObj.pricing.weekEndMinBaseTotalPrice3,
    weekEndMinBaseTotalPrice4: reqObj.pricing.weekEndMinBaseTotalPrice4,
    grandTotalPrice: reqObj.pricing.spAmount + reqObj.pricing.appCharges, 
    weekEndGrandTotalPrice:  reqObj.pricing.weekEndSpAmount + reqObj.pricing.weekEndAppCharges,
    minBaseGrandTotalPrice: reqObj.pricing.minBaseSpAmount + reqObj.pricing.minBaseAppCharges,
    minBaseGrandTotalPrice2: reqObj.pricing.minBaseSpAmount2 + reqObj.pricing.minBaseAppCharges2,
    minBaseGrandTotalPrice3: reqObj.pricing.minBaseSpAmount3 + reqObj.pricing.minBaseAppCharges3,
    minBaseGrandTotalPrice4: reqObj.pricing.minBaseSpAmount4 + reqObj.pricing.minBaseAppCharges4,
    weekEndMinBaseGrandTotalPrice: reqObj.pricing.weekEndMinBaseSpAmount + reqObj.pricing.weekEndMinBaseAppCharges,
    weekEndMinBaseGrandTotalPrice2: reqObj.pricing.weekEndMinBaseSpAmount2 + reqObj.pricing.weekEndMinBaseAppCharges2,
    weekEndMinBaseGrandTotalPrice3: reqObj.pricing.weekEndMinBaseSpAmount3 + reqObj.pricing.weekEndMinBaseAppCharges3,
    weekEndMinBaseGrandTotalPrice4: reqObj.pricing.weekEndMinBaseSpAmount4 + reqObj.pricing.weekEndMinBaseAppCharges4,
    wdTotalPrice: reqObj.pricing.wdTotalPrice,// without Discount 
    weekEndWdTotalPrice: reqObj.pricing.weekEndWdTotalPrice,
    minBaseWdTotalPrice: reqObj.pricing.minBaseWdTotalPrice,
    minBaseWdTotalPrice2: reqObj.pricing.minBaseWdTotalPrice2,
    minBaseWdTotalPrice3: reqObj.pricing.minBaseWdTotalPrice3,
    minBaseWdTotalPrice4: reqObj.pricing.minBaseWdTotalPrice4,
    weekEndMinBaseWdTotalPrice: reqObj.pricing.weekEndMinBaseWdTotalPrice,
    weekEndMinBaseWdTotalPrice2: reqObj.pricing.weekEndMinBaseWdTotalPrice2,
    weekEndMinBaseWdTotalPrice3: reqObj.pricing.weekEndMinBaseWdTotalPrice3,
    weekEndMinBaseWdTotalPrice4: reqObj.pricing.weekEndMinBaseWdTotalPrice4,
    //sp Amount Hrs
    minBaseHrsSpAmount: calculationData.spAmountHrs.spAmountMinBaseHrsPrice,
    minBaseHrsSpAmount2: calculationData.spAmountHrs.spAmountMinBaseHrsPrice2,
    minBaseHrsSpAmount3: calculationData.spAmountHrs.spAmountMinBaseHrsPrice3,
    minBaseHrsSpAmount4: calculationData.spAmountHrs.spAmountMinBaseHrsPrice4,
    weekEndMinBaseHrsSpAmount: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice,
    weekEndMinBaseHrsSpAmount2: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice2,
    weekEndMinBaseHrsSpAmount3: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice3,
    weekEndMinBaseHrsSpAmount4: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice4,
    //Total hours Price with Discount
    minBaseHrsTotalPrice: calculationData.totalHrsPrice.totalAmountMinBaseHrsPrice,
    minBaseHrsTotalPrice2: calculationData.totalHrsPrice.totalAmountMinBaseHrsPrice2,
    minBaseHrsTotalPrice3: calculationData.totalHrsPrice.totalAmountMinBaseHrsPrice3,
    minBaseHrsTotalPrice4: calculationData.totalHrsPrice.totalAmountMinBaseHrsPrice4,
    weekEndMinBaseHrsTotalPrice: calculationData.totalHrsPrice.totalAmountWeekEndMinBaseHrsPrice,
    weekEndMinBaseHrsTotalPrice2: calculationData.totalHrsPrice.totalAmountWeekEndMinBaseHrsPrice2,
    weekEndMinBaseHrsTotalPrice3: calculationData.totalHrsPrice.totalAmountWeekEndMinBaseHrsPrice3,
    weekEndMinBaseHrsTotalPrice4: calculationData.totalHrsPrice.totalAmountWeekEndMinBaseHrsPrice4,
    //Total Hours Price With Out Discount
    minBaseHrsWdTotalPrice: calculationData.totalHrsPrice.totalAmountWdMinBaseHrsPrice,
    minBaseHrsWdTotalPrice2: calculationData.totalHrsPrice.totalAmountWdMinBaseHrsPrice2,
    minBaseHrsWdTotalPrice3: calculationData.totalHrsPrice.totalAmountWdMinBaseHrsPrice3,
    minBaseHrsWdTotalPrice4:  calculationData.totalHrsPrice.totalAmountWdMinBaseHrsPrice4,
    weekEndMinBaseHrsWdTotalPrice: calculationData.totalHrsPrice.totalAmountWdWeekEndMinBaseHrsPrice,
    weekEndMinBaseHrsWdTotalPrice2: calculationData.totalHrsPrice.totalAmountWdWeekEndMinBaseHrsPrice2,
    weekEndMinBaseHrsWdTotalPrice3:  calculationData.totalHrsPrice.totalAmountWdWeekEndMinBaseHrsPrice3,
    weekEndMinBaseHrsWdTotalPrice4: calculationData.totalHrsPrice.totalAmountWdWeekEndMinBaseHrsPrice4,
    // Grant Total With Discount
    minBaseHrsGrandTotalPrice: calculationData.spAmountHrs.spAmountMinBaseHrsPrice + calculationData.appChargesHrs.appChargesMinBaseHrsPrice,
    minBaseHrsGrandTotalPrice2: calculationData.spAmountHrs.spAmountMinBaseHrsPrice2 + calculationData.appChargesHrs.appChargesMinBaseHrsPrice2,
    minBaseHrsGrandTotalPrice3: calculationData.spAmountHrs.spAmountMinBaseHrsPrice3 + calculationData.appChargesHrs.appChargesMinBaseHrsPrice3,
    minBaseHrsGrandTotalPrice4: calculationData.spAmountHrs.spAmountMinBaseHrsPrice4 + calculationData.appChargesHrs.appChargesMinBaseHrsPrice4,
    weekEndMinBaseHrsGrandTotalPrice: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice + calculationData.appChargesHrs.appChargesWeekEndMinBaseHrsPrice,
    weekEndMinBaseHrsGrandTotalPrice2: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice2 + calculationData.appChargesHrs.appChargesWeekEndMinBaseHrsPrice2,
    weekEndMinBaseHrsGrandTotalPrice3: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice3 + calculationData.appChargesHrs.appChargesWeekEndMinBaseHrsPrice3,
    weekEndMinBaseHrsGrandTotalPrice4: calculationData.spAmountHrs.spAmountweekEndMinBaseHrsPrice4 + calculationData.appChargesHrs.appChargesWeekEndMinBaseHrsPrice4,
    // App Charges Hours
    minBaseHrsAppCharges: calculationData.finalAppCharges.fACMinBaseHrsPrice,
    minBaseHrsAppCharges2: calculationData.finalAppCharges.fACMinBaseHrsPrice2,
    minBaseHrsAppCharges3: calculationData.finalAppCharges.fACMinBaseHrsPrice3,
    minBaseHrsAppCharges4: calculationData.finalAppCharges.fACMinBaseHrsPrice4,
    weekEndMinBaseHrsAppCharges: calculationData.finalAppCharges.fACWeekEndMinBaseHrsPrice,
    weekEndMinBaseHrsAppCharges2: calculationData.finalAppCharges.fACWeekEndMinBaseHrsPrice2,
    weekEndMinBaseHrsAppCharges3: calculationData.finalAppCharges.fACWeekEndMinBaseHrsPrice3,
    weekEndMinBaseHrsAppCharges4: calculationData.finalAppCharges.fACWeekEndMinBaseHrsPrice4,

    isDefaultBasePrice: reqObj.pricing.isDefaultBasePrice,
    isDefaultMinBasePrice: reqObj.pricing.isDefaultMinBasePrice,
    isMidnightCheckOutAllowed: reqObj.pricing.isMidnightCheckOutAllowed,

    updatedBy: 'superadmin',
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedOn: currentUTC.currentUTCDateTimeString
  }
  return UpPricing;
}