/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */
var logger = require('../lib/logger');
var SP_Properties = require('../models/SP-Properties');
var SP_PropertyInfo = require('../models/SP-PropertyInfo');
var SP_PropertyChildAmenities = require('../models/SP-PropertyChildAmenities');

module.exports = {
  getEndUserHomeFilterByData: function (reqBody, pageNumber, callback) {
    var query = {
      'spLocationObj.area': reqBody.area,
      'spLocationObj.city': reqBody.city,
      'spLocationObj.state': reqBody.state,
      'membersCapacity': { '$gte': reqBody.adult },
      'childsCapacity': { '$gte': reqBody.child },
      'infantsCapacity': { '$gte': reqBody.infants },
      // 'roomType': reqBody.BHK,
      'roomType': 'Single Bed Room'
    };
    SP_PropertyInfo.find(query)
      .skip((pageNumber - 1) * 10)
      .limit(10)
      .exec(function (error, resObj) {
        if (error) {
          logger.error('There was an Error occured in daos/EU-UserHomeFiltersDAO.js,',
            ' at getEndUserHomeFilterByData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj.length > 0) {
          if (reqBody.Amenities.length > 0) {
            checkSpPropertyAmenitiesData(resObj, reqBody.Amenities, pageNumber, function (amObj) {
              callback({ httpCode: amObj.httpCode, statusCode: amObj.statusCode, result: amObj.result });
            });
          } else {
            SP_PropertyInfo.countDocuments(query).exec(function (errorCount, resultCount) {
              if (errorCount) {
                logger.error('There was an Un-known Error occured in daos/EU-UserHomeFiltersDAO.js, at getEndUserHomeFilterByData:', errorCount);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
              } else if (resultCount) {
                var resultObj = { totalDocs: resultCount, homedata: resObj };
                callback({ httpCode: 200, statusCode: '0000', result: resultObj });
              } else {
                callback({ httpCode: 400, statusCode: '9997', result: {} });
              }
            });
          }
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },

  getEndUserHomeFilterRoomByData: function (reqBody, pageNumber, callback) {
    var query = {
      'spLocationObj.area': reqBody.area,
      'spLocationObj.city': reqBody.city,
      'spLocationObj.state': reqBody.state,
      'membersCapacity': { '$gte': reqBody.adult },
      'childsCapacity': { '$gte': reqBody.child },
      'infantsCapacity': { '$gte': reqBody.infants },
      'rentType': reqBody.roomType,
      // 'roomType': reqBody.BHK,
      'roomType': 'Single Bed Room'
    };
    SP_PropertyInfo.find(query)
      .skip((pageNumber - 1) * 10)
      .limit(10)
      .exec(function (error, resObj) {
        if (error) {
          logger.error('There was an Error occured in daos/EU-UserHomeFiltersDAO.js,',
            ' at getEndUserHomeFilterRoomByData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj.length > 0) {
          if (reqBody.Amenities.length > 0) {
            checkSpPropertyAmenitiesData(resObj, reqBody.Amenities, pageNumber, function (amObj) {
              callback({ httpCode: amObj.httpCode, statusCode: amObj.statusCode, result: amObj.result });
            });
          } else {
            SP_PropertyInfo.countDocuments(query).exec(function (errorCount, resultCount) {
              if (errorCount) {
                logger.error('There was an Un-known Error occured in daos/EU-UserHomeFiltersDAO.js, at getEndUserHomeFilterRoomByData:', errorCount);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
              } else if (resultCount) {
                var resultObj = { totalDocs: resultCount, homedata: resObj };
                callback({ httpCode: 200, statusCode: '0000', result: resultObj });
              } else {
                callback({ httpCode: 400, statusCode: '9997', result: {} });
              }
            });
          }
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },

  getEndUserMapFilterByData: function (reqBody, callback) {
    var query = {};
    if (reqBody.BHK && reqBody.BHK != '') {
      query = {
        'spLocationObj.area': reqBody.area,
        'spLocationObj.city': reqBody.city,
        'spLocationObj.state': reqBody.state,
        'membersCapacity': reqBody.guests,
        'roomType': reqBody.BHK
      };
    } else {
      query = {
        'spLocationObj.area': reqBody.area,
        'spLocationObj.city': reqBody.city,
        'spLocationObj.state': reqBody.state,
        'membersCapacity': reqBody.guests,
      };
    }

    SP_PropertyInfo.find(query).populate('propertyId').exec(function (error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-UserHomeFiltersDAO.js,',
          ' at getEndUserMapFilterByData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        SP_PropertyInfo.countDocuments(query).exec(function (errorCount, resultCount) {
          if (errorCount) {
            logger.error('There was an Un-known Error occured in daos/UserHomeFiltersDAO.js, at getEndUserHomeFilterByData:', errorCount);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if (resultCount) {
            var resultObj = { totalDocs: resultCount, homedata: resObj };
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

  getEndUserHomeSortByData: function (reqBody, pageNumber, callback) {
    var query = {
      'pricing.minBasePrice': { '$gte': 100, '$lte': 50000 },
      'spLocationObj.area': reqBody.area,
      'spLocationObj.city': reqBody.city,
      'spLocationObj.state': reqBody.state,
      'membersCapacity': { '$gte': reqBody.adult },
      'childsCapacity': { '$gte': reqBody.child },
      'infantsCapacity': { '$gte': reqBody.infants },
      // 'roomType': reqBody.BHK,
      'roomType': 'Single Bed Room'
    };
    SP_PropertyInfo.find(query)
      .skip((pageNumber - 1) * 10)
      .limit(10)
      .sort({ 'pricing.minBasePrice': 1 })
      .exec(function (error, resObj) {
        if (error) {
          logger.error('There was an Error occured in daos/EU-UserHomeDAO.js,',
            ' at getUserDefaultHomeData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj.length > 0) {
          if (reqBody.Amenities.length > 0) {
            checkSpPropertyAmenitiesData(resObj, reqBody.Amenities, pageNumber, function (amObj) {
              callback({ httpCode: amObj.httpCode, statusCode: amObj.statusCode, result: amObj.result });
            });
          } else {
            SP_PropertyInfo.countDocuments(query).exec(function (errorCount, resultCount) {
              if (errorCount) {
                logger.error('There was an Un-known Error occured in daos/MobileEndUsersHomeDAO.js, at getSPDataByServiceType:', errorCount);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
              } else if (resultCount) {
                var resultObj = { totalDocs: resultCount, homedata: resObj };
                callback({ httpCode: 200, statusCode: '0000', result: resultObj });
              } else {
                callback({ httpCode: 400, statusCode: '9997', result: {} });
              }
            });
          }
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },
  getEndUserHomeFilterByGroup: function (reqBody, pageNumber, callback) {
    var query = {
      'pricing.minBasePrice': { '$gte': reqBody.lowCost, '$lte': reqBody.highCost },
      'spLocationObj.area': reqBody.area,
      'spLocationObj.city': reqBody.city,
      'spLocationObj.state': reqBody.state,
      'membersCapacity': { '$gte': reqBody.adult },
      'childsCapacity': { '$gte': reqBody.child },
      'infantsCapacity': { '$gte': reqBody.infants },
      'roomType': 'Single Bed Room'
    };
    SP_PropertyInfo.find((query), { 'propertyId': 1 })
      .skip((pageNumber - 1) * 10)
      .limit(10)
      .exec(function (error, resObj) {
        if (error) {
          logger.error('There was an Error occured in daos/EU-UserHomeDAO.js,',
            ' at getEndUserHomeFilterByGuest:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj.length > 0) {
          var propertiesId = [];
          resObj.forEach(function (item) {
            propertiesId.push(item.propertyId);
          });

          SP_Properties.find({ '_id': { '$in': propertiesId }, 'rating': { '$gte': reqBody.rating } }, function (ptyError, ptyResObj) {
            if (ptyError) {
              logger.error('There was an Error occured in daos/EU-UserHomeDAO.js,',
                ' at getEndUserHomeFilterByGuest:', ptyError);
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (ptyResObj && ptyResObj.length > 0) {
              var ptyIds = [];
              ptyResObj.forEach(function (item) {
                ptyIds.push(item._id);
              });
              if (reqBody.Amenities.length > 0) {
                SP_PropertyChildAmenities.find({ 'propertyId': { '$in': ptyIds }, 'amenityName': { '$in': reqBody.Amenities } }, function (emError, emResObj) {
                  if (emError) {
                    logger.error('There was an Error occured in daos/EU-UserHomeDAO.js,',
                      ' at getEndUserHomeFilterByGuest:', emError);
                    callback({ httpCode: 500, statusCode: '9999', result: {} });
                  } else if (emResObj && emResObj.length > 0) {
                    var ptyIds1 = [];
                    emResObj.forEach(function (item) {
                      ptyIds1.push(item.propertyId);
                    });
                    SP_PropertyInfo.find({ 'propertyId': { '$in': ptyIds1 } }).exec(function (sptyError, sptyResObj) {
                      if (sptyError) {
                        logger.error('There was an Error occured in daos/EU-UserHomeDAO.js,',
                          ' at getEndUserHomeFilterByGuest:', sptyError);
                        callback({ httpCode: 500, statusCode: '9999', result: {} });
                      } else if (sptyResObj && sptyResObj.length > 0) {
                        SP_PropertyInfo.countDocuments({ 'propertyId': { '$in': ptyIds1 } }).exec(function (errorCount, resultCount) {
                          if (errorCount) {
                            logger.error('There was an Un-known Error occured in daos/MobileEndUsersHomeDAO.js, at getSPDataByServiceType:', errorCount);
                            callback({ httpCode: 500, statusCode: '9999', result: {} });
                          } else if (resultCount) {
                            var resultObj = { totalDocs: resultCount, homedata: sptyResObj };
                            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                          } else {
                            callback({ httpCode: 400, statusCode: '9997', result: {} });
                          }
                        });
                      } else {
                        callback({ httpCode: 400, statusCode: '9997', result: {} });
                      }
                    });
                  } else {
                    callback({ httpCode: 400, statusCode: '9997', result: {} });
                  }
                });
              } else {
                SP_PropertyInfo.find({ 'propertyId': { '$in': ptyIds } }).exec(function (sptyError, sptyResObj) {
                  if (sptyError) {
                    logger.error('There was an Error occured in daos/EU-UserHomeDAO.js,',
                      ' at getEndUserHomeFilterByGuest:', sptyError);
                    callback({ httpCode: 500, statusCode: '9999', result: {} });
                  } else if (sptyResObj && sptyResObj.length > 0) {
                    SP_PropertyInfo.countDocuments({ 'propertyId': { '$in': ptyIds } }).exec(function (errorCount, resultCount) {
                      if (errorCount) {
                        logger.error('There was an Un-known Error occured in daos/MobileEndUsersHomeDAO.js, at getSPDataByServiceType:', errorCount);
                        callback({ httpCode: 500, statusCode: '9999', result: {} });
                      } else if (resultCount) {
                        var resultObj = { totalDocs: resultCount, homedata: sptyResObj };
                        callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                      } else {
                        callback({ httpCode: 400, statusCode: '9997', result: {} });
                      }
                    });
                  } else {
                    callback({ httpCode: 400, statusCode: '9997', result: {} });
                  }
                });
              }
            } else {
              callback({ httpCode: 400, statusCode: '9997', result: {} });
            }
          });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  }
};

/**
 * 
 * @param {object} resData 
 * @param {object} amenities 
 * @param {object} callback 
 */

function checkSpPropertyAmenitiesData(resData, amenities, pageNumber, callback) {
  var ptyIds = [];
  resData.forEach(function (item) {
    ptyIds.push(item.propertyId);
  });
  SP_PropertyChildAmenities.find({ 'propertyId': { '$in': ptyIds }, 'amenityName': { '$in': amenities } })
  .exec(function (emError, emResObj) {
    if (emError) {
      logger.error('There was an Error occured in daos/EU-UserHomeDAO.js,',
        ' at getEndUserHomeFilterByGuest:', emError);
      callback({ httpCode: 500, statusCode: '9999', result: {} });
    } else if (emResObj && emResObj.length > 0) {
      var ptyIds1 = [];
      emResObj.forEach(function (item) {
        ptyIds1.push(item.propertyId);
      });
      SP_PropertyInfo.find({ 'propertyId': { '$in': ptyIds1 } })
      .skip((pageNumber - 1) * 10)
      .limit(10)
      .sort({ 'pricing.minBasePrice': 1 })
      .exec(function (sptyError, sptyResObj) {
        if (sptyError) {
          logger.error('There was an Error occured in daos/EU-UserHomeDAO.js,',
            ' at getEndUserHomeFilterByGuest:', sptyError);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (sptyResObj && sptyResObj.length > 0) {
          SP_PropertyInfo.countDocuments({ 'propertyId': { '$in': ptyIds1 } }).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/MobileEndUsersHomeDAO.js, at getSPDataByServiceType:', errorCount);
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount, homedata: sptyResObj };
              callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            } else {
              callback({ httpCode: 400, statusCode: '9997', result: {} });
            }
          });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
    } else {
      callback({ httpCode: 400, statusCode: '9997', result: {} });
    }
  });
}