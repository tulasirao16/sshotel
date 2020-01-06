/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');

var CommonService = require('../services/CommonService');
var SP_UserMessagesService = require('../services/SP-UserMessagesService');

module.exports.controller = function (app, passport) {

  app.get('/api/v1/sp/user/messages/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserMessagesService.serviceProviderGetEUMessages(pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UserMessagesController.js at get API -',
            ' /api/v1/sp/user/messages/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/Sp-UserMessagesController.js at get API -',
            ' /api/v1/sp/user/messages/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserMessagesController.js at get API -',
        ' /api/v1/sp/user/messages/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // app.post('/api/v1/sp/user/send/message', function (req, res, next) {
  //   var bodyValidation = spMessageBodyValidation(req.body);
  //   if (bodyValidation && req.headers.token) {
  //     CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
  //       if (tokenDecodedData && !tokenDecodedData.expStatus) {
  //         SP_UserMessagesService.serviceProviderSendMessages(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
  //           utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
  //         });
  //       } else if (tokenDecodedData && tokenDecodedData.expStatus) {
  //         logger.error('There was an Error in controllers/SP-UserMessagesController.js at post API -',
  //           ' /api/v1/sp/user/send/message: Token expired');
  //         utils.sendResponse(res, 400, '9995', {});
  //       } else {
  //         logger.error('There was an Un-known Error in controllers/SP-UserMessagesController.js at post API -',
  //           ' /api/v1/sp/user/send/message: Token decode failed');
  //         utils.sendResponse(res, 400, '9996', {});
  //       }
  //     });
  //   } else {
  //     logger.error('There was an Error in controllers/SP-UserMessagesController.js at post API -',
  //       ' /api/v1/sp/user/send/message: Missing mandatory fields data');
  //     utils.sendResponse(res, 400, '9998', {});
  //   }
  // });


  app.post('/api/v1/sp/user/send/message', function (req, res, next) {
    var bodyValidation = spMessageBodyValidation(req.body);
    if (bodyValidation && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserMessagesService.serviceProviderSendMessages(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UserMessagesController.js at post API -',
            ' /api/v1/sp/user/send/message: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/SP-UserMessagesController.js at post API -',
            ' /api/v1/sp/user/send/message: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserMessagesController.js at post API -',
        ' /api/v1/sp/user/send/message: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.post('/api/v1/sp/user/delete/message', function (req, res, next) {
    if (req.body._id && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserMessagesService.serviceProviderDeleteMessages(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UserMessagesController.js at delete API -',
            ' /api/v1/sp/user/delete/message: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/Sp-UserMessagesController.js at delete API -',
            ' /api/v1/sp/user/delete/message: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/Sp-UserMessagesController.js at delete API -',
        ' /api/v1/sp/user/delete/message: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });


  app.put('/api/v1/sp/user/message/unread/to/read/:euUserID/:propertyID', function(req, res, next) {
    if (req.headers.token && req.params.euUserID) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserMessagesService.spMessagesUnReadToRead(req.params, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UserMessagesController.js at put API -'+
            '/api/v1/sp/user/message/unread/to/read/:euUserID/:propertyID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/SP-UserMessagesController.js at put API -'+
            ' /api/v1/sp/user/message/unread/to/read/:euUserID/:propertyID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserMessagesController.js at put API -'+
        ' /api/v1/sp/user/message/unread/to/read/:euUserID/:propertyID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.put('/api/v1/sp/user/message/unread/to/read/:messageID', function (req, res, next) {
    if (req.headers.token && req.params.messageID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserMessagesService.serviceProviderMessagesUnReadToRead(req.params.messageID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UserMessagesController.js at put API -',
            '/api/v1/sp/user/message/unread/to/read/:messageID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/SP-UserMessagesController.js at put API -',
            ' /api/v1/sp/user/message/unread/to/read/:messageID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserMessagesController.js at put API -',
        ' /api/v1/sp/user/message/unread/to/read/:messageID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v1/sp/user/count/messages', function (req, res, next) {
    if (req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserMessagesService.serviceProviderMessagesCount(tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UserMessagesController.js at get API -',
            '/api/v1/sp/user/count/messages: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/SP-UserMessagesController.js at get API -',
            ' /api/v1/sp/user/count/messages: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserMessagesController.js at get API -',
        ' /api/v1/sp/user/count/messages: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });


  app.get('/api/v1/sp/user/chat/list/:activePage/:searchString?', function(req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if(!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserMessagesService.getServiceProviderChatList(tokenDecodedData.decodedTokenData, pageNumber, searchString, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UserMessagesController.js at get API -'+
            '/api/v1/sp/user/count/messages: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/SP-UserMessagesController.js at get API -'+
            ' /api/v1/sp/user/count/messages: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserMessagesController.js at get API -'+
        ' /api/v1/sp/user/count/messages: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v1/sp/serviceprovider/enduser/conversation/:euUserID/:propertyID/:activePage/:searchString?', function(req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if(!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && req.params.propertyID) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserMessagesService.getServiceProviderEndUserConversation(tokenDecodedData.decodedTokenData, req.params.euUserID, req.params.propertyID, pageNumber, searchString, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UserMessagesController.js at get API -' +
            '/api/v1/sp/serviceprovider/enduser/conversation/:euUserID/:propertyID/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/SP-UserMessagesController.js at get API -' +
            '/api/v1/sp/serviceprovider/enduser/conversation/:euUserID/:propertyID/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserMessagesController.js at get API -' +
        '/api/v1/sp/serviceprovider/enduser/conversation/:euUserID/:propertyID/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });


  app.put('/api/v1/sp/user/message/read/to/unread/:messageID', function (req, res, next) {
    if (req.headers.token && req.params.messageID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserMessagesService.serviceProviderMessagesReadToUnRead(req.params.messageID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UserMessagesController.js at put API -',
            '/api/v1/sp/user/message/read/to/unread/:messageID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/SP-UserMessagesController.js at put API -',
            ' /api/v1/sp/user/message/read/to/unread/:messageID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UserMessagesController.js at put API -',
        '/api/v1/sp/user/message/read/to/unread/:messageID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

};

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function spMessageBodyValidation(reqBodyObj) {
  if (reqBodyObj.message && reqBodyObj.euName && reqBodyObj.messagedBy && reqBodyObj.euUserId && reqBodyObj.propertyId
    && reqBodyObj.propertyTitle && reqBodyObj.propertyType) {
    return true;
  } else
    return false;
}

