/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var SP_UserLoginService = require('../services/SP-UserLoginService');

module.exports.controller = function(app, passport) {

  // --- Begin: /api/v1/sp/user/signin
  app.post('/api/v1/sp/user/signin', function(req, res, next) {
    if(req.body.userID && req.body.password) {
      SP_UserLoginService.supplierSignin(req, res, next, passport, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserLoginController.js at post API -' +
        ' /api/v1/sp/user/signin: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: /api/v1/sp/user/signin

  // --- Begin: /api/v1/sp/user/signup/sendotp
  app.post('/api/v1/sp/user/signup/sendotp', function(req, res, next) {
    if(req.body.otpType && (req.body.mobileNumber || req.body.email) && req.body.otpType) {
      SP_UserLoginService.supplierSignupSendOTP(req.body, res, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserLoginController.js at post API -' +
        ' /api/v1/sp/user/signup/sendotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- END: /api/v1/sp/user/signup/sendotp

  // --- Begin: /api/v1/sp/user/signup/verifyotp
  app.post('/api/v1/sp/user/signup/verifyotp', function(req, res, next) {
    if(req.headers.otp_token && req.body.otpNumber) {
      CommonService.tokenExpireValidation(req.headers.otp_token, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserLoginService.supplierSignupValidateOTP(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UserLoginController.js at post API -' +
            ' /api/v1/sp/user/signup/verifyotp: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-UserLoginController.js at post API -' +
            ' /api/v1/sp/user/signup/verifyotp: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserLoginController.js at post API -' +
        ' /api/v1/sp/user/signup/verifyotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: /api/v1/sp/user/signup/verifyotp

  // --- Begin: /api/v1/sp/user/validate/userid
  app.post('/api/v1/sp/user/validate/userid', function(req, res, next) {
    if(req.body.userID) {
      SP_UserLoginService.supplierSignupValidateUserID(req.body.userID, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserLoginController.js at post API -' +
        ' /api/v1/sp/user/validate/userid: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- END: /api/v1/sp/user/signup/sendotp

  // --- Begin: /api/v1/sp/user/signup
  app.post('/api/v1/sp/user/signup', function(req, res, next) {
    var bodyValidation = supplierBodyValidation(req.body);
    if(bodyValidation) {
      SP_UserLoginService.supplierSignup(req, res, next, passport, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserLoginController.js at post API -' +
        ' /api/v1/sp/user/signup: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: /api/v1/sp/user/signup

   // --- Begin: /api/v1/sp/user/details/:userData Code to check user is available or not
  app.get('/api/v1/sp/user/details/:userData', function (req, res, next) {
    if (req.headers.token && req.params.userData) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserLoginService.getUserData(req.params.userData, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UserLoginController.js at get API -',
            ' /api/v1/sp/user/details/:userData: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-UserLoginController.js at get API -',
            ' /api/v1/sp/user/details/:userData: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    }
  });
  // --- End: /api/v1/sp/user/details/:userData Code to check user is available or not
  // --- Begin: /api/v1/sp/signup/ticket
  app.post('/api/v1/sp/signup/ticket', function(req, res, next) {
    var bodyValidation = supplierSignupTicketBodyValidation(req.body);
    if(bodyValidation) {
      SP_UserLoginService.supplierSignupTicket(req.body, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserLoginController.js at post API -' +
        ' /api/v1/sp/signup/ticket: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: /api/v1/sp/signup/ticket
};

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function supplierBodyValidation(reqBodyObj) {
  if(reqBodyObj.bussinessName && reqBodyObj.contactPerson && reqBodyObj.contactMobileNumber && reqBodyObj.contactEmail &&
  reqBodyObj.password && reqBodyObj.address && reqBodyObj.area && reqBodyObj.city && reqBodyObj.state && reqBodyObj.zip) {
    return true;
  } else
    return false;
}

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function supplierSignupTicketBodyValidation(reqBodyObj) {
  if(reqBodyObj.contactPerson && reqBodyObj.contactNumber && reqBodyObj.contactAddress
    && reqBodyObj.city && reqBodyObj.propertyType && reqBodyObj.contactEmail && reqBodyObj.serviceProvider) {
    return true;
  } else
    return false;
}
