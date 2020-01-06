
var config = require('config');
var logger = require('../lib/logger');
var utils = require('../lib/util');
var commonService = require('../services/CommonService');
var EU_BookingsPaymentsService = require('../services/EU-BookingsPaymentsService');

// --- Begin: EU-BookingsPaymentsController
module.exports.controller = function(app, passport) {
  app.post('/api/mobile/endusers/booking/paymentgateway/url', function(req, res, next) {
    if (req.headers.token && req.headers.token != 'undefined' && req.body && req.body.bookingInfo._id
    && req.body.bookingInfo.grandTotal && req.body.bookingInfo.euMobileNumber && req.body.contactNumber) {
      commonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        var email = req.body.contactEmail ? req.body.contactEmail : tokenDecodedData.decodedTokenData.ue;
        EU_BookingsPaymentsService.makePayment(req.body, email, 'Mobile App', tokenDecodedData.decodedTokenData, function(resObj) {
          utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
        });
      });
    } else {
      logger.error('There was an Error in controllers/EU-BookingsPaymentsController.js at Post API -',
        '/api/mobile/endusers/booking/paymentgateway/url: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.post('/api/endusers/booking/paymentgateway/url', function(req, res, next) {
    if (req.headers.token && req.headers.token != 'undefined' && req.body && req.body.bookingInfo._id
    && req.body.bookingInfo.grandTotal && req.body.bookingInfo.euMobileNumber && req.body.contactNumber) {
      commonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        var email = req.body.contactEmail ? req.body.contactEmail : tokenDecodedData.decodedTokenData.ue;
        EU_BookingsPaymentsService.makePayment(req.body, email, 'Web App', tokenDecodedData.decodedTokenData, function(resObj) {
          utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
        });
      });
    } else {
      logger.error('There was an Error in controllers/EU-BookingsPaymentsController.js at Post API -',
        '/api/endusers/booking/paymentgateway/url: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.post('/api/endusers/booking/payment/setup', function(req, res, next) {
    if(req.body.paymentTxnID && req.body.mobileAppUri) {
      if(req.headers.token && req.headers.token != 'undefined') {
        commonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
          EU_BookingsPaymentsService.mobilePaymentSetup(req.body.paymentTxnID, req.body.mobileAppUri, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        });
      } else {
        EU_BookingsPaymentsService.mobilePaymentSetup(req.body.paymentTxnID, req.body.mobileAppUri, function(resObj) {
          utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
        });
      }
    } else {
      logger.error('There was an Error in controllers/EU-BookingsPaymentsController.js at Post API -',
      '/api/endusers/booking/payment/setup: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/web/endusers/booking/payment/setup/:paymentTxnID', function(req, res, next) {
    if(req.params.paymentTxnID) {
        EU_BookingsPaymentsService.getPaymentSetup(req.params.paymentTxnID, function(resObj) {
          utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
        });
    } else {
      logger.error('There was an Error in controllers/EU-BookingsPaymentsController.js at get API -',
      '/api/web/endusers/booking/payment/setup/:paymentTxnID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.post('/api/mobile/endusers/booking/paymentgateway/status', function(req, res, next) {
    if (req.body.status === 'success') {
        EU_BookingsPaymentsService.updateCustomerBookingPaymentData(req.body, function(resObj) {
        res.writeHead(301,
          {Location: config.uiDomain + 'mobile/booking/payment/success/' + req.body.hash}
        );
        res.end();
      });
    } else {
        EU_BookingsPaymentsService.bookingPaymentFailed(req.body, function(resObj) {
        res.writeHead(301,
          {Location: config.uiDomain + 'mobile/booking/payment/fail/' + req.body.hash}
        );
        res.end();
      });
    }
  });

  app.post('/api/endusers/booking/paymentgateway/status', function(req, res, next) {
    if (req.body.status === 'success') {
        EU_BookingsPaymentsService.updateCustomerBookingPaymentData(req.body, function(resObj) {
        res.writeHead(301,
          {Location: config.uiDomain + 'booking/payment/success/' + req.body.hash}
        );
        res.end();
      });
    } else {
        EU_BookingsPaymentsService.bookingPaymentFailed(req.body, function(resObj) {
        res.writeHead(301,
          {Location: config.uiDomain + 'booking/payment/fail/' + req.body.hash}
        );
        res.end();
      });
    }
  });

  app.get('/api/endusers/booking/paymentgateway/response/status/:paymentResHash', function(req, res, next) {
    EU_BookingsPaymentsService.getBookingPaymentData(req.params.paymentResHash, function(resObj) {
      utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
    });
  });

  app.put('/api/v1/eu/booking/failed/:bookingId/:paymentId', function(req, res, next) {
    if(req.headers.token && req.params.bookingId && req.params.paymentId) {
      commonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_BookingsPaymentsService.deleteEndUsersPayment(req.params.bookingId, req.params.paymentId, tokenDecodedData.decodedTokenData, function(resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } else if(tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-BookingsPaymentsController.js at put API -',
          ' /api/v1/eu/booking/failed/:bookingId/:paymentId Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/EU-BookingsPaymentsController.js at put API -',
          ' /api/v1/eu/booking/failed/:bookingId/:paymentId Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-BookingsPaymentsController.js at put API -',
      ' /api/v1/eu/booking/failed/:bookingId/:paymentId Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    } 
});

};
