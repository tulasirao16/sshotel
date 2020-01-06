/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var AD_EndUserService = require('../services/AD-EndUserService');

// --- Begin: AD-EndUserController
module.exports.controller = function (app, passport) {
  // --- Begin '/api/v1/ad/eu/users/bysearch/:activePage/:searchString'
  app.get('/api/v1/ad/eu/users/bysearch/:activePage/:searchString', function (req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    if (req.headers.token && req.params.searchString && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUserService.getADEndUserListDataBySearch(pageNum, req.params.searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -' +
            '/api/v1/ad/eu/users/bysearch/:activePage/:searchString: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -' +
            '/api/v1/ad/eu/users/bysearch/:activePage/:searchString: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUserController.js at get API -' +
        '/api/v1/ad/eu/users/bysearch/:activePage/:searchString: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/eu/users/bysearch/:activePage/:searchString'

  // --- Begin '/api/v1/ad/eu/users/list/:activePage/:searchString?'
  app.get('/api/v1/ad/eu/users/list/:activePage/:searchString?', function (req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = req.params.searchString == 'undefined' || !req.params.searchString ? '' : req.params.searchString;
    if (req.headers.token && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUserService.getADEndUserListingData(pageNum, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -' +
            '/api/v1/ad/eu/users/list/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -' +
            '/api/v1/ad/eu/users/list/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUserController.js at get API -' +
        '/api/v1/ad/eu/users/list/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ad/eu/users/list/:activePage/:searchString?'

  // --- Begin /api/v1/ad/eu/users/status/update/:recordID'
  app.put('/api/v1/ad/eu/users/status/update/:recordID', function (req, res, callback) {
    if (req.headers.token && req.params.recordID && req.body.status) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUserService.updateADEndUserStatus(req.params.recordID, req.body, tokenDecodedData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUserController.js at put API -' +
            '/api/v1/ad/eu/users/status/update/:recordID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUserController.js at put API -' +
            '/api/v1/ad/eu/users/status/update/:recordID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUserController.js at put API -' +
        '/api/v1/ad/eu/users/status/update/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End /api/v1/ad/eu/users/status/update/:recordID'

  //Begin: '/api/v1/ad/eu/users/create'
  app.post('/api/v1/ad/eu/users/create', function (req, res, next) {
    var bodyValidation = adEndUserBodyValidation(req.body);
    if (bodyValidation && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUserService.postADEndUserData(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUserController.js at post API -' +
            '/api/v1/ad/eu/users/create: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-EndUserController.js at post API -' +
            '/api/v1/ad/eu/users/create: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUserController.js at post API -' +
        '/api/v1/ad/eu/users/create: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // End: '/api/v1/ad/eu/users/create'
  app.get('/api/v1/ad/eu/dashboard/bookings/counts/:recordID', function (req, res, next) {
    if (req.headers.token && req.params.recordID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUserService.getADEUDashboardScreenBookingsCount(tokenDecodedData.decodedTokenData, req.params.recordID, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);

          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -',
            '/api/v1/ad/eu/dashboard/bookings/counts/:recordID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -',
            '/api/v1/ad/eu/dashboard/bookings/counts/:recordID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUserController.js, at get API -',
        '/api/v1/ad/eu/dashboard/bookings/counts/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v1/ad/eu/booking/counts/bookings/list/:activePage/:userId/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && pageNumber && req.params.userId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUserService.getADEUBookingsCountBookingsList(pageNumber, req.params.userId, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -',
            '/api/v1/ad/eu/booking/counts/bookings/list/:activePage/:userId/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -',
            '/api/v1/ad/eu/booking/counts/bookings/list/:activePage/:userId/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUserController.js, at get API -',
        '/api/v1/ad/eu/booking/counts/bookings/list/:activePage/:userId/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v1/ad/eu/booking/counts/cancelled/list/:activePage/:userId/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUserService.getADEUBookingsCountCancelledList(pageNumber, req.params.userId, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -',
            '/api/v1/ad/eu/booking/counts/cancelled/list/:activePage/:userId/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -',
            '/api/v1/ad/eu/booking/counts/cancelled/list/:activePage/:userId/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUserController.js, at get API -',
        '/api/v1/ad/eu/booking/counts/cancelled/list/:activePage/:userId/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- End:/api/v1/ad/eu/booking/counts/cancelled/list/:activePage/:userId/:searchString?'

  app.get('/api/v1/ad/eu/booking/counts/expired/list/:activePage/:userId/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUserService.getADEUBookingsCountExpiredList(pageNumber, req.params.userId, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -',
            '/api/v1/ad/eu/booking/counts/expired/list/:activePage/:userId/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -',
            '/api/v1/ad/eu/booking/counts/expired/list/:activePage/:userId/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUserController.js, at get API -',
        '/api/v1/ad/eu/booking/counts/expired/list/:activePage/:userId/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v1/ad/eu/booking/counts/totalamount/list/:activePage/:userId/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUserService.getADEUBookingsCounttotalAmountList(pageNumber, req.params.userId, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -',
            '/api/v1/ad/eu/booking/counts/totalamount/list/:activePage/:userId/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -',
            '/api/v1/ad/eu/booking/counts/totalamount/list/:activePage/:userId/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUserController.js, at get API -',
        '/api/v1/ad/eu/booking/counts/totalamount/list/:activePage/:userId/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v1/ad/eu/booking/counts/spentamount/list/:activePage/:userId/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EndUserService.getADEUBookingsCountSpentAmountList(pageNumber, req.params.userId, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -',
            '/api/v1/ad/eu/booking/counts/spentamount/list/:activePage/:userId/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUserController.js at get API -',
            '/api/v1/ad/eu/booking/counts/spentamount/list/:activePage/:userId/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EndUserController.js, at get API -',
        '/api/v1/ad/eu/booking/counts/spentamount/list/:activePage/:userId/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

};
// --- End: AD-EndUserController

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function adEndUserBodyValidation(reqBodyObj) {
  if (reqBodyObj.firstName && reqBodyObj.lastName && reqBodyObj.address && reqBodyObj.mobileNumber && reqBodyObj.email
    && reqBodyObj.userStatus && reqBodyObj.password) {
    return true;
  } else
    return false;
}
