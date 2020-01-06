/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var CommonService = require('../services/CommonService');
var EU_ForgotPasswordService = require('../services/EU-ForgotPasswordService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function(app, passport) {
  app.post('/api/v1/eu/user/forgot/password/sendotp', function(req, res, next) {
    if(req.body.email) {
      EU_ForgotPasswordService.euForgotPasswordSendOtp(req.body.email, res, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/EU-ForgotPasswordController.js at post API -',
        '/api/v1/eu/user/forgot/password/sendotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // Begin -- EU Forgot Password Otp validation
  app.post('/api/v1/eu/user/forgot/password/verifyotp', function(req, res, next) {
    if(req.headers.otp_token && req.body.otp) {
      CommonService.tokenExpireValidation(req.headers.otp_token, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_ForgotPasswordService.euForgotPasswordOTPValidation(req.body.otp, tokenDecodedData.decodedTokenData, res, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-ForgotPasswordController.js at post API -',
            ' /api/v1/eu/user/forgot/password/verifyotp: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-ForgotPasswordController.js at post API -',
            ' /api/v1/eu/user/forgot/password/verifyotp: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-ForgotPasswordController.js at post API -',
        ' /api/v1/eu/user/forgot/password/verifyotp: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // Begin -- Eu Reset Password
  app.put('/api/v1/eu/user/forgot/password/reset', function(req, res, next) {
    if(req.body.newPassword && req.headers.otp_token) {
      CommonService.tokenExpireValidation(req.headers.otp_token, function(tokenDecodedData) {
          if(tokenDecodedData && !tokenDecodedData.expStatus) {
            EU_ForgotPasswordService.updateEuPassword(req.body.newPassword,
              tokenDecodedData.decodedTokenData, function(resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
          } else if(tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/EU-ForgotPasswordController.js at put API -',
              '/api/v1/eu/user/forgot/password/reset: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Un-known Error in controllers/EU-ForgotPasswordController.js at put API -',
              '/api/v1/eu/user/forgot/password/reset: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
    } else {
      logger.error('There was an Error in controllers/EU-ForgotPasswordController.js, at put API -',
        '/api/v1/eu/user/forgot/password/reset: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
}