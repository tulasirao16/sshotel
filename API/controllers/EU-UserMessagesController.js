/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');

var CommonService = require('../services/CommonService');
var EU_UserMessagesService = require('../services/EU-UserMessagesService');

module.exports.controller = function(app, passport) {

  app.get('/api/v1/eu/user/messages/:activePage/:searchString?', function(req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if(!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserMessagesService.endUserMessages(pageNumber, searchString, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserMessagesController.js at get API -',
            ' /api/v1/eu/user/messages/:activePage: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-UserMessagesController.js at get API -',
            ' /api/v1/eu/user/messages/:activePage: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserMessagesController.js at get API -',
        ' /api/v1/eu/user/messages/:activePage: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.post('/api/v1/eu/user/send/message', function(req, res, next) {
    var bodyValidation = endUserMessageBodyValidation(req.body);
    if (bodyValidation && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserMessagesService.endUserSendMessages(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserMessagesController.js at post API -' +
            ' /api/v1/eu/user/send/message: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-UserMessagesController.js at post API -' +
            ' /api/v1/eu/user/send/message: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserMessagesController.js at post API -' +
        ' /api/v1/eu/user/send/message: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.put('/api/v1/eu/user/delete/message', function(req, res, next) {
   if (req.body.messageIDs && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserMessagesService.endUserDeleteMessages(req.body.messageIDs, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserMessagesController.js at delete API -',
            ' /api/v1/eu/user/delete/message: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-UserMessagesController.js at delete API -',
            ' /api/v1/eu/user/delete/message: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserMessagesController.js at delete API -',
        ' /api/v1/eu/user/delete/message: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v1/eu/user/count/messages', function(req, res, next) {
    if (req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserMessagesService.endUserMessagesCount(tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserMessagesController.js at get API -',
            '/api/v1/eu/user/count/messages: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-UserMessagesController.js at get API -',
            ' /api/v1/eu/user/count/messages: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserMessagesController.js at get API -',
        ' /api/v1/eu/user/count/messages: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v1/eu/user/chat/list/:activePage/:searchString?', function(req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if(!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserMessagesService.getEndUserChatList(tokenDecodedData.decodedTokenData, pageNumber, searchString, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserMessagesController.js at get API -'+
            '/api/v1/eu/user/count/messages: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-UserMessagesController.js at get API -'+
            ' /api/v1/eu/user/count/messages: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserMessagesController.js at get API -'+
        ' /api/v1/eu/user/count/messages: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v1/eu/user/serviceprovider/conversation/:propertyID/:activePage/:searchString?', function(req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if(!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && req.params.propertyID) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserMessagesService.getEndUserServiceProviderConversation(tokenDecodedData.decodedTokenData, req.params.propertyID, pageNumber, searchString, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserMessagesController.js at get API -' +
            '/api/v1/eu/user/serviceprovider/conversation/:propertyID/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-UserMessagesController.js at get API -' +
            '/api/v1/eu/user/serviceprovider/conversation/:propertyID/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserMessagesController.js at get API -' +
        '/api/v1/eu/user/serviceprovider/conversation/:propertyID/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.put('/api/v1/eu/user/message/unread/to/read/:propertyID', function(req, res, next) {
    if (req.headers.token && req.params.propertyID) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserMessagesService.euMessagesUnReadToRead(req.params.propertyID, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserMessagesController.js at put API -'+
            '/api/v1/eu/user/message/unread/to/read/:propertyID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-UserMessagesController.js at put API -'+
            ' /api/v1/eu/user/message/unread/to/read/:propertyID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserMessagesController.js at put API -'+
        ' /api/v1/eu/user/message/unread/to/read/:propertyID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.put('/api/v1/eu/user/message/unread/to/read/:messageID', function(req, res, next) {
    if (req.headers.token && req.params.messageID) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserMessagesService.endUserMessagesUnReadToRead(req.params.messageID, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserMessagesController.js at put API -',
            '/api/v1/eu/user/message/unread/to/read/:messageID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-UserMessagesController.js at put API -',
            ' /api/v1/eu/user/message/unread/to/read/:messageID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserMessagesController.js at put API -',
        ' /api/v1/eu/user/message/unread/to/read/:messageID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.put('/api/v1/eu/user/message/read/to/unread/:messageID', function(req, res, next) {
    if (req.headers.token && req.params.messageID) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          EU_UserMessagesService.endUserMessagesReadToUnRead(req.params.messageID, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-UserMessagesController.js at put API -',
            '/api/v1/eu/user/message/read/to/unread/:messageID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-UserMessagesController.js at put API -',
            ' /api/v1/eu/user/message/read/to/unread/:messageID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-UserMessagesController.js at put API -',
        '/api/v1/eu/user/message/read/to/unread/:messageID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

};

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function endUserMessageBodyValidation(reqBodyObj) {
  if (reqBodyObj.message && reqBodyObj.messagedBy && reqBodyObj.propertyId
    && reqBodyObj.propertyTitle && reqBodyObj.propertyType && reqBodyObj.spServiceProviderId && reqBodyObj.spServiceProvider) {
    return true;
  } else
    return false;
}
