/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var CommonService = require('../services/CommonService');
var SP_ForgotPasswordService = require('../services/SP-ForgotPasswordService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function (app, passport) {

  app.post('/api/v1/sp/forgot/password/sendotp', function (req, res, next) {
    if (req.body.userId) {
      SP_ForgotPasswordService.spForgotPasswordSendOtp(req.body.userId, res, function (resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/SP-ForgotPasswordController.js at post API -' +
        '/api/v1/sp/forgot/password/sendotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // Begin -- SP Forgot Password Otp validation
  app.post('/api/v1/sp/forgot/password/verifyotp', function (req, res, next) {
    if (req.body.otp && req.headers.otp_token && req.headers.otp_token != 'undefined') {
      CommonService.tokenExpireValidation(req.headers.otp_token, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_ForgotPasswordService.spForgotPasswordOTPValidation(req.body.otp, tokenDecodedData.decodedTokenData, res, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-ForgotPasswordController.js at post API -',
            ' /api/v1/sp/forgot/password/verifyotp: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/SP-ForgotPasswordController.js at post API -',
            ' /api/v1/sp/forgot/password/verifyotp: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-ForgotPasswordController.js at post API -',
        ' /api/v1/sp/forgot/password/verifyotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // Begin -- SP Reset Password
  app.put('/api/v1/sp/forgot/password/reset', function (req, res, next) {
    if (req.body.newPassword && req.headers.otp_token) {
      CommonService.tokenExpireValidation(req.headers.otp_token, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_ForgotPasswordService.updateSpPassword(req.body.newPassword,
          tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-ForgotPasswordController.js at put API -' +
            '/api/v1/sp/forgot/password/reset: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/SP-ForgotPasswordController.js at put API -' +
            '/api/v1/sp/forgot/password/reset: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-ForgotPasswordController.js, at put API -'+
        '/api/v1/sp/forgot/password/reset: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
}
