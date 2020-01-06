/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var logger = require('../lib/logger');
var EU_Users = require('../models/EU-Users');
var SP_Properties = require('../models/SP-Properties');
var SP_Properties_Info = require('../models/SP-PropertyInfo');
var SP_PropertyChildAmenities = require('../models/SP-PropertyChildAmenities');

// --- Begining of EU-UserHomeDAO
module.exports = {
  // --- Begin getUserServiceProvidersData: Code to get User Home Screen Data
  getUserServiceProvidersData: function(query, sortBy, pageNum, noOfPersons, noOfRooms, loginStatus, decodedTokenData, callback) {
    var limitCount = config.recordsCount;
    var pQuery = {
        'propertyCapacity': {'$gte': noOfPersons},
        'activeNumRooms': {'$gte': noOfRooms},
        'isDeleted': false,
        'status': 'Active'
    };
    SP_Properties.find(pQuery, {'_id': 1}).exec(function(pError, pResObj) {
      if(pError) {
        logger.error('There was an un-known Error occured in daos/EU-UserHomeDAO.js, at getUserServiceProvidersData:', pError);
        callback({httpCode: 500, statusCode: '9999', result: {}});
      } else if(pResObj && pResObj.length > 0) {
        var sppIds = [];
        pResObj.forEach(function (item) {
            sppIds.push(item);
        });
        var pid = {'propertyId': { '$in': sppIds }};
        var query1 = JSON.parse((JSON.stringify(query) + JSON.stringify(pid)).replace(/}{/g, ','));
        SP_Properties_Info.find(query1).skip((pageNum - 1) * limitCount).
        populate('propertyId').
        limit(limitCount).sort(sortBy).exec(function(error, data) {
          if(error) {
            logger.error('There was an un-known Error occured in daos/EU-UserHomeDAO.js, at getUserServiceProvidersData:', error);
            callback({httpCode: 500, statusCode: '9999', result: {}});
          } else if(data && data.length > 0) {
            SP_Properties_Info.countDocuments(query1).exec(function(errorCount, resultCount) {
              if(errorCount) {
                logger.error('There was an Un-known Error occured in daos/EU-UserHomeDAO.js, at getUserServiceProvidersData-countDocuments:', errorCount);
                var resultObj = {totalDocs: data.length, homeData: data};
                callback({httpCode: 200, statusCode: '0000', result: resultObj});
              } else if(resultCount) {
                if (loginStatus == 'withToken') {
                  EU_Users.find({_id: decodedTokenData.iss}).exec(function(error, userObj) {
                    var resultObj = {totalDocs: resultCount, homeData: data, userData: userObj[0]};
                    callback({httpCode: 200, statusCode: '0000', result: resultObj});
                  });
                } else {
                  var resultObj = {totalDocs: resultCount, homeData: data, userData: {}};
                  callback({httpCode: 200, statusCode: '0000', result: resultObj});
                }
              } else {
                var resultObj = {totalDocs: data.length, homeData: data, userData: {}};
                callback({httpCode: 200, statusCode: '0000', result: resultObj});
              }
            });
          } else {
            callback({httpCode: 400, statusCode: '9997', result: {}});
          }
        });
      } else {
        callback({httpCode: 400, statusCode: '9997', result: {}});
      }
    });
  },
  // --- End getUserServiceProvidersData: to get User Home Screen Data

  // --- Begin getUserHomeDataBydataType: Code to get User Home Screen Data By dataType
  getUserHomeDataBydataType: function(queryObj, pageNum, callback) {
    SP_Properties_Info.find(queryObj)
    .skip((pageNum - 1) * 10)
    .limit(10)
    .exec(function(error, data) {
        if(error) {
            logger.error('There was an Error occured in daos/EU-UserHomeDAO.js,',
                ' at getUserHomeDataBydataType:', error);
            callback(error, {statusCode: '9999', result: {}});
        } else if(data && data.length > 0) {
            SP_Properties_Info.countDocuments(queryObj).exec(function(errorCount, resultCount) {
                if(errorCount) {
                    logger.error('There was an Un-known Error occured in daos/EU-UserHomeDAO.js, at getSPDataByServiceType:', errorCount);
                    callback(errorCount, {statusCode: '9999', result: {}});
                } else if(resultCount) {
                    var resultObj = {totalDocs: resultCount, homedata: data};
                    callback(errorCount, {statusCode: '0000', result: resultObj});
                }else {
                    callback(errorCount, {statusCode: '9997', result: {}});
                }
            });
        } else {
            callback(error, {statusCode: '9997', result: {}});
        }
    });
  },
  // --- End getUserHomeDataBydataType: to get User Home Screen Data By dataType

  // --- Begin getUserMapViewDataByLocation: Code to get User Map Screen Data By dataType
  getUserMapViewDataByLocation: function(queryObj, sortBy, noOfPersons, noOfRooms, callback) {
    var pQuery = {
        'propertyCapacity': {'$gte': noOfPersons},
        'numRooms': {'$gte': noOfRooms},
        'isDeleted': false,
        'status': 'Active'
    };
    SP_Properties.find(pQuery, {'_id': 1}).exec(function(pError, pResObj) {
        if(pError) {
            logger.error('There was an un-known Error occured in daos/EU-UserHomeDAO.js, at getUserServiceProvidersData:', pError);
            callback({httpCode: 500, statusCode: '9999', result: {}});
        } else if(pResObj && pResObj.length > 0) {
            var sppIds = [];
            pResObj.forEach(function (item) {
                sppIds.push(item);
            });
            var pid = {'propertyId': { '$in': sppIds }};
            var query1 = JSON.parse((JSON.stringify(queryObj) + JSON.stringify(pid)).replace(/}{/g, ','));
            SP_Properties_Info.find(query1).populate('propertyId').sort(sortBy).exec(function(error, data) {
                if(error) {
                    logger.error('There was an un-known Error occured in daos/EU-UserHomeDAO.js, at getUserServiceProvidersData:', error);
                    callback({httpCode: 500, statusCode: '9999', result: {}});
                } else if(data && data.length > 0) {
                    var resultObj = {totalDocs: data.length, homedata: data};
                    callback({httpCode: 200, statusCode: '0000', result: resultObj});
                } else {
                    callback({httpCode: 400, statusCode: '9997', result: {}});
                }
            });
        } else {
            callback({httpCode: 400, statusCode: '9997', result: {}});
        }
    });
  },
  // --- End getUserHomeDataBydataType: to get User Map Screen Data By dataType


   // --- Begin getUserHomeDataByNearestArea: Code to get User Home Screen Data By Nearest Area
   getUserHomeDataByNearestArea: function(query, pageNum, body, callback) {
    var propertyQuery = {
        'propertyCapacity': {'$gte': body.noOfPersons},
        'activeNumRooms': {'$gte': body.noOfRooms},
        'isDeleted': false,
        'status': 'Active'
    };
    SP_Properties.find(propertyQuery, {'_id': 1}).exec(function(pError, pResObj) {
        if(pError) {
            logger.error('There was an un-known Error occured in daos/EU-UserHomeDAO.js, at getUserHomeDataByNearestArea:', pError);
            callback({httpCode: 500, statusCode: '9999', result: {}});
        } else if(pResObj && pResObj.length > 0) {
            var sppIds = [];
            pResObj.forEach(function (item) {
                sppIds.push(item);
            });
            var pid = {'propertyId': { '$in': sppIds }};
            var query1 = JSON.parse((JSON.stringify(query) + JSON.stringify(pid)).replace(/}{/g, ','));
            SP_Properties_Info.find(query1).populate('propertyId').skip((pageNum - 1) * 10).limit(10)
            .exec(function(error, data) {
                if(error) {
                    logger.error('There was an Error occured in daos/EU-UserHomeDAO.js,',
                        ' at getUserHomeDataBydataType:', error);
                    callback(error, {statusCode: '9999', result: {}});
                } else if(data && data.length > 0) {
                    SP_Properties_Info.countDocuments(query).exec(function(errorCount, resultCount) {
                        if(errorCount) {
                            logger.error('There was an Un-known Error occured in daos/EU-UserHomeDAO.js, at getSPDataByServiceType:', errorCount);
                            callback(errorCount, {statusCode: '9999', result: {}});
                        } else if(resultCount) {
                            var resultObj = {totalDocs: resultCount, homedata: data};
                            callback(errorCount, {statusCode: '0000', result: resultObj});
                        }else {
                            callback(errorCount, {statusCode: '9997', result: {}});
                        }
                    });
                } else {
                    callback(error, {statusCode: '9997', result: {}});
                }
            });
            }   
       })
  },
  // --- End getUserHomeDataByNearestArea: to get User Home Screen Data By Nearest Area

  getUserHomeCompareHosts: function(compareIDS, callback) {
    SP_PropertyChildAmenities.find({'propertyInfoId': {$in: compareIDS}})
    .sort('amenityOrder')
    .exec(function(error, data) {
        if(error) {
            logger.error('There was an Error occured in daos/EU-UserHomeDAO.js,',
                ' at getUserHomeCompareHosts:', error);
            callback({httpCode: 500, statusCode: '9999', result: {}});
        } else if(data && data.length > 0) {
            callback({httpCode: 200, statusCode: '0000', result: data});
        } else {
            callback({httpCode: 400, statusCode: '9997', result: []});
        }
    });
  },
};
// --- Ending of EU-UserHomeDAO



