/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var EU_UserHomeFiltersDAO = require('../daos/EU-UserHomeFiltersDAO');

module.exports = {
  getEndUserHomeFilterByData: function (reqBody, pageNumber, callback) {
    EU_UserHomeFiltersDAO.getEndUserHomeFilterByData(reqBody, pageNumber, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result })
    });
  },

  getEndUserHomeFilterRoomByData: function (reqBody, pageNumber, callback) {
    EU_UserHomeFiltersDAO.getEndUserHomeFilterRoomByData(reqBody, pageNumber, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result })
    });
  },

  getEndUserMapFilterByData: function (reqBody, callback) {
    EU_UserHomeFiltersDAO.getEndUserMapFilterByData(reqBody, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result })
    });
  },

  getEndUserHomeSortByData: function (reqBody, pageNumber, callback) {
    EU_UserHomeFiltersDAO.getEndUserHomeSortByData(reqBody, pageNumber, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result })
    });
  },
  getEndUserHomeFilterByGroup: function (reqBody, pageNumber, callback) {
    EU_UserHomeFiltersDAO.getEndUserHomeFilterByGroup(reqBody, pageNumber, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result })
    });
  }
};

