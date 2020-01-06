
/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var AD_HomeScreenService = require('../services/AD-HomeScreenService');
var CommonService = require('../services/CommonService');

// --- Begin: AD-HomeScreenController
module.exports.controller = function (app, passport) {
  // ----- Begin: /api/v1/ad/homescreen/user/counts'
  app.get('/api/v1/ad/homescreen/user/counts', function (req, res, next) {
    if (req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HomeScreenService.getADHomeScreenUsersCount(tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/user/counts: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/user/counts: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HomeScreenController.js, at get API -'+
        '/api/v1/ad/homescreen/user/counts: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End: /api/v1/ad/homescreen/user/counts

  // ----- Begin: /api/v1/ad/homescreen/users/bystatus/:activePage/:status/:searchString?
  app.get('/api/v1/ad/homescreen/users/bystatus/:activePage/:status/:searchString?', function (req, res, next) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    if (req.params.status && req.headers.token && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HomeScreenService.getADHomeScreenUsersCountByStatus(pageNum, req.params.status, tokenDecodedData.decodedTokenData, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/users/bystatus/:activePage/:status/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/users/bystatus/:activePage/:status/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HomeScreenController.js, at get API -'+
        '/api/v1/ad/homescreen/users/bystatus/:activePage/:status/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End: /api/v1/ad/homescreen/users/bystatus/:activePage/:status/:searchString?

  // ----- Begin: /api/v1/ad/homescreen/hostusers/bystatus/:activePage/:status/:searchString?'
  app.get('/api/v1/ad/homescreen/hostusers/bystatus/:activePage/:status/:searchString?', function (req, res, next) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    if (req.params.status && req.headers.token && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HomeScreenService.getADHomeScreenHostUsersCountByStatus(pageNum, req.params.status, tokenDecodedData.decodedTokenData, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/hostusers/bystatus/:activePage/:status/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/hostusers/bystatus/:activePage/:status/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HomeScreenController.js, at get API -'+
        '/api/v1/ad/homescreen/hostusers/bystatus/:activePage/:status/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End: /api/v1/ad/homescreen/hostusers/bystatus/:activePage/:status/:searchString?

  // --- Begin: '/api/v1/ad/homescreen/hosts/properties/bystatus/:activePage/:status/:searchString?'
  app.get('/api/v1/ad/homescreen/hosts/properties/bystatus/:activePage/:status/:searchString?', function (req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = req.params.searchString == 'undefined' || !req.params.searchString ? '' : req.params.searchString;
    if (req.headers.token && req.params.status && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HomeScreenService.getADHomeScreenHostsPropertiesByStatus(pageNum, req.params.status, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-AD_HomeScreenService.js at get API -' +
            '/api/v1/ad/homescreen/hosts/properties/bystatus/:activePage/:status/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-AD_HomeScreenService.js at get API -' +
            '/api/v1/ad/homescreen/hosts/properties/bystatus/:activePage/:status/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-AD_HomeScreenService.js at get API -' +
        '/api/v1/ad/homescreen/hosts/properties/bystatus/:activePage/:status/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: '/api/v1/ad/homescreen/hosts/properties/bystatus/:activePage/:status/:searchString?'

  // ----- Begin: /api/v1/ad/homescreen/booking/counts/bookings/list/:activePage/:searchString?'
  app.get('/api/v1/ad/homescreen/booking/counts/bookings/list/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HomeScreenService.getADBookingsCountBookingsList(pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/booking/counts/bookings/list/:activePage/:searchString?: Token expired');
          utils.sendResponse(res+ 400+ '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/booking/counts/bookings/list/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HomeScreenController.js, at get API -'+
        '/api/v1/ad/homescreen/booking/counts/bookings/list/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End: /api/v1/ad/homescreen/booking/counts/bookings/list/:activePage/:searchString?'

  // ----- Begin: /api/v1/ad/homescreen/booking/amounts/list/:activePage/:searchString?'
  app.get('/api/v1/ad/homescreen/booking/amounts/list/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HomeScreenService.getADBookingsAmountsList(pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/booking/amounts/list/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/booking/amounts/list/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HomeScreenController.js, at get API -'+
        '/api/v1/ad/homescreen/booking/amounts/list/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End: /api/v1/ad/homescreen/booking/amounts/list/:activePage/:searchString?'

  // ----- Begin: /api/v1/ad/homescreen/checkins/counts/bookings/list/:activePage/:searchString?'
  app.get('/api/v1/ad/homescreen/checkins/counts/bookings/list/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HomeScreenService.getADCheckInBookingsList(pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/checkins/counts/bookings/list/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/checkins/counts/bookings/list/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HomeScreenController.js, at get API -'+
        '/api/v1/ad/homescreen/checkins/counts/bookings/list/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End: /api/v1/ad/homescreen/checkins/counts/bookings/list/:activePage/:searchString?'

  // ----- Begin: /api/v1/ad/homescreen/checkouts/counts/bookings/list/:activePage/:searchString?'
  app.get('/api/v1/ad/homescreen/checkouts/counts/bookings/list/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HomeScreenService.getADCheckOutBookingsList(pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/checkouts/counts/bookings/list/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/checkouts/counts/bookings/list/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HomeScreenController.js, at get API -'+
        '/api/v1/ad/homescreen/checkouts/counts/bookings/list/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End: /api/v1/ad/homescreen/checkouts/counts/bookings/list/:activePage/:searchString?'

  // ----- Begin: /api/v1/ad/homescreen/booking/counts/cancelled/list/:activePage/:searchString?'
  app.get('/api/v1/ad/homescreen/booking/counts/cancelled/list/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HomeScreenService.getADBookingsCountCancelledList(pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/booking/counts/cancelled/list/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/booking/counts/cancelled/list/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HomeScreenController.js, at get API -'+
        '/api/v1/ad/homescreen/booking/counts/cancelled/list/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End: /api/v1/ad/homescreen/booking/counts/cancelled/list/:activePage/:searchString?'

  // ----- Begin: /api/v1/ad/homescreen/blockeddates/list/:activePage/:searchString?'
  app.get('/api/v1/ad/homescreen/blockeddates/list/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = !req.params.searchString || req.params.searchString == 'undefined' ? '' : req.params.searchString
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HomeScreenService.getADHomeScreenBlockedDatesList(pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/blockeddates/list/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HomeScreenController.js at get API -'+
            '/api/v1/ad/homescreen/blockeddates/list/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HomeScreenController.js, at get API -'+
        '/api/v1/ad/homescreen/blockeddates/list/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End: api/v1/ad/homescreen/blockeddates/list/:activePage/:searchString?'

}