/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var AD_HostsMessagesService = require('../services/AD-HostsMessagesService');

// BEGIN: AD-HostsMessagesController

module.exports.controller = function (app, passport) {

  // BEGIN GET API: '/api/v2/ad/hosts/messages/:hostId/:activePage/:searchString?'
  app.get('/api/v2/ad/hosts/messages/:hostId/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && req.params.hostId && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsMessagesService.getHostsMessages(req.params.hostId, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsMessagesController.js at get API -',
            '/api/v2/ad/hosts/messages/:hostId/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-HostsMessagesController.js at get API -',
            '/api/v2/ad/hosts/messages/:hostId/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsMessagesController.js at get API -',
        '/api/v2/ad/hosts/messages/:hostId/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // END GET API : /api/v2/ad/hosts/messages/:hostId/:activePage/:searchString?'


  // BEGIN GET API : '/api/v2/ad/hosts/count/messages/:hostId'
  app.get('/api/v2/ad/hosts/count/messages/:hostId', function (req, res, next) {
    if (req.headers.token && req.params.hostId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsMessagesService.hostsMessagesCount(req.params.hostId, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsMessagesController.js at get API -',
            '/api/v2/ad/hosts/count/messages/:hostId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-HostsMessagesController.js at get API -',
            '/api/v2/ad/hosts/count/messages/:hostId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsMessagesController.js at get API -',
        '/api/v2/ad/hosts/count/messages/:hostId: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // END GET API : '/api/v2/ad/hosts/count/messages/:hostId'


  // BEGIN GET API : '/api/v2/ad/hosts/chat/list/:hostId/:activePage/:searchString?'

  app.get('/api/v2/ad/hosts/chat/list/:hostId/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && req.params.hostId && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsMessagesService.hostsMessagesChatList(tokenDecodedData.decodedTokenData, req.params.hostId, pageNumber, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsMessagesController.js at get API -' +
            '/api/v2/ad/hosts/chat/list/:hostId/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-HostsMessagesController.js at get API -' +
            '/api/v2/ad/hosts/chat/list/:hostId/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsMessagesController.js at get API -' +
        '/api/v2/ad/hosts/chat/list/:hostId/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // END GET API : '/api/v2/ad/hosts/chat/list/:hostId/:activePage/:searchString?'


  // BEGIN GET API : '/api/v2/ad/hosts/serviceprovider/enduser/conversation/:euUserID/:propertyID/:activePage/:searchString?'

  app.get('/api/v2/ad/hosts/serviceprovider/enduser/conversation/:euUserID/:propertyID/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && req.params.euUserID && req.params.propertyID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsMessagesService.getHostsEuConversation(tokenDecodedData.decodedTokenData, req.params.euUserID, req.params.propertyID, pageNumber, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsMessagesController.js at get API -' +
            '/api/v2/ad/hosts/serviceprovider/enduser/conversation/:euUserID/:propertyID/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-HostsMessagesController.js at get API -' +
            '/api/v2/ad/hosts/serviceprovider/enduser/conversation/:euUserID/:propertyID/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsMessagesController.js at get API -' +
        '/api/v2/ad/hosts/serviceprovider/enduser/conversation/:euUserID/:propertyID/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // END GET API : '/api/v2/ad/hosts/serviceprovider/enduser/conversation/:euUserID/:propertyID/:activePage/:searchString?'

  //BEGIN POST API : '/api/v2/ad/hosts/send/message'
  app.post('/api/v2/ad/hosts/send/message', function (req, res, next) {
    var bodyValidation = adMessageBodyValidation(req.body);
    if (bodyValidation && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsMessagesService.hostsSendMessages(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsMessagesController.js at post API -',
            ' /api/v2/ad/hosts/send/message: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-HostsMessagesController.js at post API -',
            ' /api/v2/ad/hosts/send/message: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsMessagesController.js at post API -',
        '/api/v2/ad/hosts/send/message: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  //END POST API : '/api/v2/ad/hosts/send/message'

  //BEGIN PUT API : '/api/v2/ad/hosts/message/unread/to/read/:euUserID/:propertyID'

  app.put('/api/v2/ad/hosts/message/unread/to/read/:euUserID/:propertyID', function (req, res, next) {
    if (req.headers.token && req.params.euUserID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsMessagesService.adMessagesUnReadToRead(req.params, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsMessagesController.js at put API -' +
            '/api/v2/ad/hosts/message/unread/to/read/:euUserID/:propertyID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-HostsMessagesController.js at put API -' +
            ' /api/v2/ad/hosts/message/unread/to/read/:euUserID/:propertyID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsMessagesController.js at put API -' +
        '/api/v2/ad/hosts/message/unread/to/read/:euUserID/:propertyID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  //END PUT API : '/api/v2/ad/hosts/message/unread/to/read/:euUserID/:propertyID'


  //BEGIN PUT API : '/api/v2/ad/hosts/message/unread/to/read/:messageID'

  app.put('/api/v2/ad/hosts/message/unread/to/read/:messageID', function (req, res, next) {
    if (req.headers.token && req.params.messageID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsMessagesService.hostsMessagesUnReadToRead(req.params.messageID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsMessagesController.js at put API -',
            '/api/v2/ad/hosts/message/unread/to/read/:messageID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-HostsMessagesController.js at put API -',
            ' /api/v2/ad/hosts/message/unread/to/read/:messageID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsMessagesController.js at put API -',
        ' /api/v2/ad/hosts/message/unread/to/read/:messageID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  //BEGIN PUT API : '/api/v2/ad/hosts/message/unread/to/read/:messageID'

}
/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function adMessageBodyValidation(reqBodyObj) {
  if (reqBodyObj.message && reqBodyObj.euName && reqBodyObj.messagedBy && reqBodyObj.euUserId && reqBodyObj.propertyId
    && reqBodyObj.propertyTitle && reqBodyObj.propertyType) {
    return true;
  } else
    return false;
}
