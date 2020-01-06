/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var geolite2 = require('geolite2');
var maxmind = require('maxmind');
// const iplocation = require('iplocation').default;

var CommonService = require('./CommonService');
var logger = require('../lib/logger');
var EU_UserHomeDAO = require('../daos/EU-UserHomeDAO');

// --- Begin: EU-UserHomeService
module.exports = {
  // --- Begin getUserServiceProvidersData: Code to get User Home Screen Data
  getUserServiceProvidersData: function(reqBody, activePage, loginStatus, decodedTokenData, callback) {
    switch(reqBody.dataType) {
      case 'default':
        getDefaultData(reqBody, activePage, loginStatus, decodedTokenData, function(resObj) {
          callback(resObj);
        });
        break;
      case 'byLocation':
        getSpsDataByLocation(reqBody, activePage, loginStatus, decodedTokenData, function(resObj) {
          callback(resObj);
        });
        break;
      default:
        getDefaultData(reqBody, activePage, loginStatus, decodedTokenData, function(resObj) {
          callback(resObj);
        });
        break;
    }
  },
  // --- End getUserServiceProvidersData: Code to get User Home Screen Data

  // --- Begin getUserHomeDataBydataType: Code to get User Home Screen Data By dataType
  getUserHomeDataBydataType: function(body, dataType, callback) {
    var queryObj = {};
    if (dataType == 'byLocation') {
      queryObj = {
        'spLocationObj.area': body.area,
        'spLocationObj.city': body.city,
        'spLocationObj.state': body.state,
        'isDeleted': false
      };
    } else {
      queryObj = {
        isDefault: true
      };
    }
    EU_UserHomeDAO.getUserHomeDataBydataType(queryObj, body.activePage, function(error, resObj) {
      if (error)
        callback({httpCode: 500, statusCode: resObj.statusCode, result: resObj.result});
      else if(resObj.statusCode === '0000')
        callback({httpCode: 200, statusCode: resObj.statusCode, result: resObj.result});
      else
        callback({httpCode: 400, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End getUserHomeDataBydataType: Code to get User Home Screen Data By dataType

 
// --- Begin getUserMapViewDataByLocation: Code to get User Map Screen Data By dataType
  getUserMapViewDataByLocation: function(body, callback) {
    var queryObj = body.hostsBy == 'Days' ?
      {
        'spLocationObj.area': body.area,
        'spLocationObj.city': body.city,
        'spLocationObj.state': body.state,
        'pricing.isDefaultBasePrice': true,
        'isDeleted': false,
        'status': 'Active'
      } : {
        'spLocationObj.area': body.area,
        'spLocationObj.city': body.city,
        'spLocationObj.state': body.state,
        'pricing.isDefaultMinBasePrice': true,
        'isDeleted': false,
        'status': 'Active'
      };
    var sortBy = CommonService.getPropertiesSortBy(body.sortBy);
    var filtersQuery = setSpsFilters(body.filterBy);
    if (filtersQuery) {
      var query = JSON.parse((JSON.stringify(queryObj) + JSON.stringify(filtersQuery)).replace(/}{/g, ','));
      EU_UserHomeDAO.getUserMapViewDataByLocation(query, sortBy, body.noOfPersons, body.noOfRooms, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
    } else {
      EU_UserHomeDAO.getUserMapViewDataByLocation(queryObj, sortBy, body.noOfPersons, body.noOfRooms, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
    }
  },
  // --- End getUserMapViewDataByLocation: Code to get User Map Screen Data By dataType


  // --- Begin getUserHomeDataByNearestArea: Code to get User Home Screen Data By Nearest Area
  getUserHomeDataByNearestArea: function(body, callback) {
    getUserHomeDataByNearestAreaByHosts(body, function(error, resObj) {
      if (error)
        callback({httpCode: 500, statusCode: resObj.statusCode, result: resObj.result});
      else if(resObj.statusCode === '0000')
        callback({httpCode: 200, statusCode: resObj.statusCode, result: resObj.result});
      else
        callback({httpCode: 400, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
  // --- End getUserHomeDataBydataType: Code to get User Home Screen Data By Nearest Area

  getUserHomeCompareHosts: function(compareIDS, callback) {
    EU_UserHomeDAO.getUserHomeCompareHosts(compareIDS, function(resObj) {
        callback({httpCode: 200, statusCode: resObj.statusCode, result: resObj.result});
    });
  },
};
// --- End: EU-UserHomeService

/**
 * @param {object} reqBody object
 * @param {string} activePage string
 * @param {function} callback is a callback function
 */
function getDefaultData(reqBody, activePage, loginStatus, decodedTokenData, callback) { 
  var lookup = maxmind.openSync(geolite2.paths.city);
  var locObj = lookup.get(reqBody.ip);
  // iplocation(reqBody.ip, [], (error, resData) => {
  //   console.log('=====locObj:', resData);
  // });
  if(locObj && locObj.city && locObj.city.names) {
    var query = {
      'spLocationObj.city': locObj.city.names.en,
      'spLocationObj.country': locObj.country.names.en,
      'pricing.isDefaultBasePrice': true,
      'isDeleted': false,
      'status': 'Active'
    };
    var sortBy = CommonService.getPropertiesSortBy(reqBody.sortBy);
    var filtersQuery = setSpsFilters(reqBody.filterBy);
    if(filtersQuery) {
      var query1 = JSON.parse((JSON.stringify(query) + JSON.stringify(filtersQuery)).replace(/}{/g, ','));
      EU_UserHomeDAO.getUserServiceProvidersData(query1, sortBy, activePage, reqBody.noOfPersons, reqBody.noOfRooms, loginStatus, decodedTokenData, function(resObj) {
        callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
      });
    } else {
      EU_UserHomeDAO.getUserServiceProvidersData(query, sortBy, activePage, reqBody.noOfPersons, reqBody.noOfRooms, loginStatus, decodedTokenData, function(resObj) {
        callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
      });
    }
  } else {
    var query = {
      'spLocationObj.city': config.defaultCity,
      'spLocationObj.state': config.defaultState,
      'spLocationObj.country': config.defaultCountry,
      'pricing.isDefaultBasePrice': true,
      'isDeleted': false,
      'status': 'Active'
    };
    var sortBy = CommonService.getPropertiesSortBy(reqBody.sortBy);
    EU_UserHomeDAO.getUserServiceProvidersData(query, sortBy, activePage, reqBody.noOfPersons, reqBody.noOfRooms, loginStatus, decodedTokenData, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  }
}

/**
 * @param {object} reqBody object
 * @param {function} callback is a callback function
 */
function getUserHomeDataByNearestAreaByHosts(reqBody, callback) {
  
  var query1 = reqBody.hostsBy == 'Days' ?
  {
    'nearestAreas': reqBody.area,
    'pricing.isDefaultBasePrice': true,
    'isDeleted': false,
    'status': 'Active'
  } : {
    'nearestAreas': reqBody.area,
    'pricing.isDefaultMinBasePrice': true,
    'isDeleted': false,
    'status': 'Active'
  };
  var filtersQuery = setSpsFilters(reqBody.filterBy);
  if (filtersQuery) {
    var query = JSON.parse((JSON.stringify(query1) + JSON.stringify(filtersQuery)).replace(/}{/g, ','));
    EU_UserHomeDAO.getUserHomeDataByNearestArea(query, reqBody.activePage, reqBody, function(error, resObj){
      callback(error, resObj)
    })
  } else {
    EU_UserHomeDAO.getUserHomeDataByNearestArea(query1, reqBody.activePage, reqBody, function(error, resObj){
      callback(error, resObj)
    })
  }
 }

/**
 * @param {object} reqBody object
 * @param {string} activePage string
 * @param {function} callback is a callback function
 */
function getSpsDataByLocation(reqBody, activePage, loginStatus, decodedTokenData, callback) {
  var query1 = reqBody.hostsBy == 'Days' ?
  {
    'spLocationObj.area': reqBody.area,
    'spLocationObj.city': reqBody.city,
    'spLocationObj.state': reqBody.state,
    'pricing.isDefaultBasePrice': true,
    'isDeleted': false,
    'status': 'Active'
  } : {
    'spLocationObj.area': reqBody.area,
    'spLocationObj.city': reqBody.city,
    'spLocationObj.state': reqBody.state,
    'pricing.isDefaultMinBasePrice': true,
    'isDeleted': false,
    'status': 'Active'
  };
  var sortBy = CommonService.getPropertiesSortBy(reqBody.sortBy);
  var filtersQuery = setSpsFilters(reqBody.filterBy);
  if(filtersQuery) {
    var query = JSON.parse((JSON.stringify(query1) + JSON.stringify(filtersQuery)).replace(/}{/g, ','));
    EU_UserHomeDAO.getUserServiceProvidersData(query, sortBy, activePage, reqBody.noOfPersons, reqBody.noOfRooms, loginStatus, decodedTokenData, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  } else {
    EU_UserHomeDAO.getUserServiceProvidersData(query1, sortBy, activePage, reqBody.noOfPersons, reqBody.noOfRooms, loginStatus, decodedTokenData, function(resObj) {
      callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
    });
  }
}

/**
 * @param {object} filtersObj object
 * @param {object} return
 */
function setSpsFilters(filtersObj) {
  var ratingQuery = (filtersObj && filtersObj.rating) ?
    {'rating': {'$gte': filtersObj.rating}} :
    '';
  var priceRangeQuery = (filtersObj && filtersObj.priceRange) ? 
    (filtersObj.basePriceMin && filtersObj.basePriceMax) ? {'pricing.basePrice': {'$gte': filtersObj.basePriceMin, '$lte': filtersObj.basePriceMax}} :
    filtersObj.basePriceMin ? {'pricing.basePrice': {'$gte': filtersObj.basePriceMin}} :
    {'pricing.basePrice': {'$lte': filtersObj.basePriceMax}}
  : '';
  var amenitiesQuery = (filtersObj && filtersObj.amenitiesArray && filtersObj.amenitiesArray.length > 0) ?
    {'amenities': { '$all': filtersObj.amenitiesArray}} : '';
  var servicesQuery = (filtersObj && filtersObj.servicesArray && filtersObj.servicesArray.length > 0) ?
    {'services': { '$all': filtersObj.servicesArray}} : '';
  var guestRulesQuery = (filtersObj && filtersObj.guestRulesArray && filtersObj.guestRulesArray.length > 0) ?
    {'guestRules': { '$all': filtersObj.guestRulesArray}} : '';
  var RentType = (filtersObj && filtersObj.rentType) ? {rentType: filtersObj.rentType} : '';
  var RoomCategory = (filtersObj && filtersObj.roomCategory) ? {roomCategory: filtersObj.roomCategory} : '';
  var RoomType = (filtersObj && filtersObj.roomType) ? {roomType: filtersObj.roomType} : '';
  var query1 = ratingQuery ? JSON.stringify(ratingQuery) : '';
  var query2 = priceRangeQuery ? JSON.stringify(priceRangeQuery) : '';
  var query3 = amenitiesQuery ? JSON.stringify(amenitiesQuery) : '';
  var query4 = servicesQuery ? JSON.stringify(servicesQuery) : '';
  var query5 = guestRulesQuery ? JSON.stringify(guestRulesQuery) : '';
  var query6 = RentType ? JSON.stringify(RentType) : '';
  var query7 = RoomCategory ? JSON.stringify(RoomCategory) : '';
  var query8 = RoomType ? JSON.stringify(RoomType) : '';
  var query = query1+query2+query3+query4+query5+query6+query7+query8;
  if(query)
    return JSON.parse((query).replace(/}{/g, ','));
  else 
    return '';
}
