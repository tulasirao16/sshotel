/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var AD_UserLoginService = require('../services/AD-UserLoginService');
var CommonService = require('../services/CommonService');

/** Begin: AD-UserLoginController */
module.exports.controller = function (app, passport) {
  /**ADMIN USER LOGIN  */
  app.post('/api/v1/ad/user/login', function (req, res, next) {
    if (req.body.userID && req.body.password) {
      AD_UserLoginService.adminUserLogin(req, res, next, passport, function (resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/AD-UserLoginController.js, at post API -' +
        '/api/v1/ad/user/login: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // --- Begin: /api/v1/ad/user/forgotpassword/sendotp
  app.post('/api/v1/ad/user/forgotpassword/sendotp', function (req, res, next) {
    if (req.body.userId) {
      AD_UserLoginService.adForgotPasswordSendOTP(req.body.userId, res, function (resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/AD-UserLoginController.js at post API -'+
        '/api/v1/ad/user/forgotpassword/sendotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: /api/v1/ad/user/forgotpassword/sendotp

  // --- Begin: /api/v1/ad/user/forgotpassword/verifyotp
  app.post('/api/v1/ad/user/forgotpassword/verifyotp', function (req, res, next) {
    if (req.body.otp && req.headers.otp_token && req.headers.otp_token != 'undefined') {
      CommonService.tokenExpireValidation(req.headers.otp_token, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_UserLoginService.adForgotPasswordVerifyOTPValidation(req.body.otp, tokenDecodedData.decodedTokenData, res, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-UserLoginController.js at post API -'+
            '/api/v1/ad/forgotpassword/verifyotp: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-UserLoginController.js at post API -'+
            '/api/v1/ad/forgotpassword/verifyotp: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-UserLoginController.js at post API -'+
        '/api/v1/ad/forgotpassword/verifyotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: /api/v1/ad/user/forgotpassword/verifyotp

  // Begin -- /api/v1/ad/user/forgotpassword/reset
  app.put('/api/v1/ad/user/forgotpassword/reset', function (req, res, next) {
    if (req.body.newPassword && req.headers.otp_token) {
      CommonService.tokenExpireValidation(req.headers.otp_token, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_UserLoginService.updateADPassword(req.body.newPassword,
            tokenDecodedData.decodedTokenData, function (resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-UserLoginController.js at put API -'+
            '/api/v1/ad/user/forgotpassword/reset: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-UserLoginController.js at put API -'+
            '/api/v1/ad/user/forgotpassword/reset: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-UserLoginController.js, at put API -'+
        '/api/v1/ad/user/forgotpassword/reset: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
 // End -- /api/v1/ad/user/forgotpassword/reset
}
/** End: AD-UserLoginController */
