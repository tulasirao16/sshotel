/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');

var CommonService = require('../services/CommonService');
var AD_EuMessagesService = require('../services/AD-EuMessagesService');

// BEGIN : AD-EuMessagesController
module.exports.controller = function (app, passport) {

  app.get('/api/v2/ad/eu/messages/:userId/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && req.params.userId && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EuMessagesService.getEuMessagesData(req.params.userId, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -',
            ' /api/v2/ad/eu/messages/:userId/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at get API -',
            ' /api/v2/ad/eu/messages/:userId/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -',
        ' /api/v2/ad/eu/messages/:userId/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v2/ad/eu/chat/list/:euUserId/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && req.params.euUserId && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EuMessagesService.getEuChatList(req.params.euUserId, pageNumber, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -' +
            '/api/v2/ad/eu/chat/list/:euUserId/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at get API -' +
            '/api/v2/ad/eu/chat/list/:euUserId/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -' +
        ' /api/v2/ad/eu/chat/list/:euUserId/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  app.get('/api/v2/ad/eu/count/messages/:userId', function (req, res, next) {
    if (req.headers.token && req.params.userId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EuMessagesService.euMessagesCount(req.params.userId, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -',
            '/api/v2/ad/eu/count/messages/:userId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at get API -',
            '/api/v2/ad/eu/count/messages/:userId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -',
        '/api/v2/ad/eu/count/messages/:userId: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });


  app.get('/api/v2/ad/eu/serviceprovider/conversation/:userId/:propertyID/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && req.params.propertyID && req.params.userId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EuMessagesService.getEuServiceProviderConversation(tokenDecodedData.decodedTokenData, req.params.propertyID, req.params.userId, pageNumber, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -' +
            '/api/v2/ad/eu/serviceprovider/conversation/:userId/:propertyID/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at get API -' +
            '/api/v2/ad/eu/serviceprovider/conversation/:userId/:propertyID/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -' +
        '/api/v2/ad/eu/serviceprovider/conversation/:userId/:propertyID/:activePage/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.post('/api/v2/ad/eu/send/message', function (req, res, next) {
    var bodyValidation = adMessageBodyValidation(req.body);
    if (bodyValidation && req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EuMessagesService.adminEUSendMessages(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EuMessagesController.js at post API -',
            ' /api/v2/ad/eu/send/message: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at post API -',
            ' /api/v2/ad/eu/send/message: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EuMessagesController.js at post API -',
        ' /api/v2/ad/eu/send/message: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.put('/api/v2/ad/eu/message/unread/to/read/:propertyID', function (req, res, next) {
    if (req.headers.token && req.params.propertyID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EuMessagesService.adEUMessagesUnReadToRead(req.params.propertyID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -' +
            '/api/v2/ad/eu/message/unread/to/read/:propertyID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at put API -' +
            ' /api/v2/ad/eu/message/unread/to/read/:propertyID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -' +
        ' /api/v2/ad/eu/message/unread/to/read/:propertyID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.put('/api/v2/ad/eu/message/unread/to/read/:messageID', function (req, res, next) {
    if (req.headers.token && req.params.messageID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EuMessagesService.euMessagesUnReadToRead(req.params.messageID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -',
            '/api/v2/ad/eu/message/unread/to/read/:messageID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at put API -',
            ' /api/v2/ad/eu/message/unread/to/read/:messageID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -',
        ' /api/v2/ad/eu/message/unread/to/read/:messageID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.put('/api/v2/ad/eu/message/read/to/unread/:messageID', function (req, res, next) {
    if (req.headers.token && req.params.messageID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_EuMessagesService.euMessagesReadToUnRead(req.params.messageID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -',
            '/api/v2/ad/eu/message/read/to/unread/:messageID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at put API -',
            ' /api/v2/ad/eu/message/read/to/unread/:messageID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -',
        '/api/v2/ad/eu/message/read/to/unread/:messageID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

}

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function adMessageBodyValidation(reqBodyObj) {
  if (reqBodyObj.message && reqBodyObj.messagedBy && reqBodyObj.propertyId
    && reqBodyObj.propertyTitle && reqBodyObj.propertyType && reqBodyObj.spServiceProviderId && reqBodyObj.spServiceProvider) {
    return true;
  } else
    return false;
}

//   //BEGIN GET API : '/api/v1/ad/eu/messages/:userId/:activePage/:searchString?'
//   app.get('/api/v1/ad/eu/messages/:userId/:activePage/:searchString?', function (req, res, next) {
//     var pageNumber = parseInt(req.params.activePage);
//     var searchString = req.params.searchString ? req.params.searchString : '';
//     if (req.headers.token && req.params.userId && pageNumber) {
//       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
//         if (tokenDecodedData && !tokenDecodedData.expStatus) {
//           AD_EuMessagesService.getEuMessages(req.params.userId, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
//             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
//           });
//         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
//           logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -',
//             '/api/v1/ad/eu/messages/:userId/:activePage/:searchString?: Token expired');
//           utils.sendResponse(res, 400, '9995', {});
//         }
//         else {
//           logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at get API -',
//             ' /api/v1/ad/eu/messages/:userId/:activePage/:searchString?: Token decode failed');
//           utils.sendResponse(res, 400, '9996', {});
//         }
//       });
//     } else {
//       logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -',
//         ' /api/v1/ad/eu/messages/:userId/:activePage/:searchString?: Missing mandatory fields data');
//       utils.sendResponse(res, 400, '9998', {});
//     }

//   });
//   //END GET API : '/api/v1/ad/eu/messages/:userId/:activePage/:searchString?'

//   // BEGIN PUT API : '/api/v1/ad/eu/messages/unread/to/read/:recordID'
//   app.put('/api/v1/ad/eu/messages/unread/to/read/:recordID', function (req, res, next) {
//     if (req.headers.token && req.params.recordID) {
//       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
//         if (tokenDecodedData && !tokenDecodedData.expStatus) {
//           AD_EuMessagesService.euMessagesUnReadToRead(req.params.recordID, tokenDecodedData.decodedTokenData, function (resObj) {
//             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
//           });
//         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
//           logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -',
//             '/api/v1/ad/eu/messages/unread/to/read/:recordID: Token expired');
//           utils.sendResponse(res, 400, '9995', {});
//         } else {
//           logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at put API -',
//             '/api/v1/ad/eu/messages/unread/to/read/:recordID: Token decode failed');
//           utils.sendResponse(res, 400, '9996', {});
//         }
//       });
//     } else {
//       logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -',
//         '/api/v1/ad/eu/messages/unread/to/read/:recordID: Missing mandatory fields data');
//       utils.sendResponse(res, 400, '9998', {});
//     }
//   });
//   // END PUT API : '/api/v1/ad/eu/messages/unread/to/read/:recordID'

//   // BEGIN PUT API : '/api/v1/ad/eu/messages/read/to/unread/:recordID'
  // app.put('/api/v1/ad/eu/messages/read/to/unread/:recordID', function (req, res, next) {
  //   if (req.headers.token && req.params.recordID) {
  //     CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
  //       if (tokenDecodedData && !tokenDecodedData.expStatus) {
  //         AD_EuMessagesService.euMessagesReadToUnRead(req.params.recordID, tokenDecodedData.decodedTokenData, function (resObj) {
  //           utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
  //         });
  //       } else if (tokenDecodedData && tokenDecodedData.expStatus) {
  //         logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -',
  //           '/api/v1/ad/eu/messages/read/to/unread/:recordID: Token expired');
  //         utils.sendResponse(res, 400, '9995', {});
  //       } else {
  //         logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at put API -',
  //           ' /api/v1/ad/eu/messages/read/to/unread/:recordID: Token decode failed');
  //         utils.sendResponse(res, 400, '9996', {});
  //       }
  //     });
  //   } else {
  //     logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -',
  //       '/api/v1/ad/eu/messages/read/to/unread/:recordID: Missing mandatory fields data');
  //     utils.sendResponse(res, 400, '9998', {});
  //   }
  // });
//   // END PUT API : '/api/v1/ad/eu/messages/read/to/unread/:recordID'

//   // BEGIN PUT API : '/api/v1/ad/eu/messages/delete/:recordID'
//   app.put('/api/v1/ad/eu/messages/delete/:recordID', function (req, res, next) {
//     if (req.params.recordID && req.headers.token) {
//       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
//         if (tokenDecodedData && !tokenDecodedData.expStatus) {
//           AD_EuMessagesService.euMessagesDelete(req.params.recordID, tokenDecodedData.decodedTokenData, function (resObj) {
//             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
//           });
//         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
//           logger.error('There was an Error in controllers/AD-EuMessagesController.js at delete API -',
//             '/api/v1/ad/eu/messages/delete/:recordID: Token expired');
//           utils.sendResponse(res, 400, '9995', {});
//         } else {
//           logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at delete API -',
//             '/api/v1/ad/eu/messages/delete/:recordID: Token decode failed');
//           utils.sendResponse(res, 400, '9996', {});
//         }
//       });
//     } else {
//       logger.error('There was an Error in controllers/AD-EuMessagesController.js at delete API -',
//         '/api/v1/ad/eu/messages/delete/:recordID: Missing mandatory fields data');
//       utils.sendResponse(res, 400, '9998', {});
//     }
//   });
//   // END PUT API : '/api/v1/ad/eu/messages/delete/:recordID'

//   // BEGIN POST API : '/api/v1/ad/eu/messages/create'
//   app.post('/api/v1/ad/eu/messages/create', function (req, res, next) {
//     var bodyValidation = adMessageBodyValidation(req.body);
//     if (bodyValidation && req.headers.token) {
//       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
//         if (tokenDecodedData && !tokenDecodedData.expStatus) {
//           AD_EuMessagesService.euMessagesCreate(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
//             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
//           });
//         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
//           logger.error('There was an Error in controllers/AD-EuMessagesController.js at post API -',
//             ' /api/v1/ad/eu/messages/create: Token expired');
//           utils.sendResponse(res, 400, '9995', {});
//         } else {
//           logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at post API -',
//             '/api/v1/ad/eu/messages/create: Token decode failed');
//           utils.sendResponse(res, 400, '9996', {});
//         }
//       });
//     } else {
//       logger.error('There was an Error in controllers/AD-EuMessagesController.js at post API -',
//         ' /api/v1/ad/eu/messages/create: Missing mandatory fields data');
//       utils.sendResponse(res, 400, '9998', {});
//     }
//   });
//   // END POST API : '/api/v1/ad/eu/messages/create'

//   // BEGIN PUT API : '/api/v1/ad/eu/messages/update/:recordID'
//   app.put('/api/v1/ad/eu/messages/update/:recordID', function (req, res, callback) {
//     if (req.headers.token && req.params.recordID && req.body.message && req.body.spReadStatus && req.body.euReadStatus && req.body.adReadStatus) {
//       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
//         if (tokenDecodedData && !tokenDecodedData.expStatus) {
//           AD_EuMessagesService.euMessagesUpdate(req.params.recordID, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
//             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
//           });
//         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
//           logger.error('There was an Error in controllers/AD-EUMessagesController.js at put API -' +
//             '/api/v1/ad/eu/messages/update/:recordID: Token expired');
//           utils.sendResponse(res, 400, '9995', {});
//         } else {
//           logger.error('There was an Error in controllers/AD-EUMessagesController.js at put API -' +
//             '/api/v1/ad/eu/messages/update/:recordID: Token decode failed');
//           utils.sendResponse(res, 400, '9996', {});
//         }
//       });
//     } else {
//       logger.error('There was an Error in controllers/AD-EUMessagesController.js at put API -' +
//         '/api/v1/ad/eu/messages/update/:recordID: Missing mandatory fields data');
//       utils.sendResponse(res, 400, '9998', {});
//     }
//   });
//   // END PUT API : '/api/v1/ad/eu/messages/update/:recordID'

// }
// // END : AD-EuMessagesController
// function adMessageBodyValidation(reqBodyObj) {
//   if (reqBodyObj.message && reqBodyObj.euName && reqBodyObj.messagedBy && reqBodyObj.from) {
//     return true;
//   } else
//     return false;
// }

// /**
//  * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
//  * Unauthorized copying of this file, via any medium is strictly prohibited
//  * Proprietary and confidential
//  * Written by Hari <hari@ngstek.com>, Mar 2019
//  */

// var logger = require('../lib/logger');
// var utils = require('../lib/util');

// var CommonService = require('../services/CommonService');
// var AD_EuMessagesService = require('../services/AD-EuMessagesService');

// // BEGIN : AD-EuMessagesController
// module.exports.controller = function (app, passport) {

//   // BEGIN GET API: '/api/v2/ad/eu/messages/:userId/:activePage/:searchString?'

//   app.get('/api/v2/ad/eu/messages/:userId/:activePage/:searchString?', function (req, res, next) {
//     var pageNumber = parseInt(req.params.activePage);
//     var searchString = req.params.searchString;
//     if (!req.params.searchString || req.params.searchString == 'undefined') {
//       searchString = '';
//     }
//     if (req.headers.token && req.params.userId && pageNumber) {
//       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
//         if (tokenDecodedData && !tokenDecodedData.expStatus) {
//           AD_EuMessagesService.getEuMessagesData(req.params.userId, pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
//             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
//           });
//         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
//           logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -',
//             ' /api/v2/ad/eu/messages/:userId/:activePage/:searchString?: Token expired');
//           utils.sendResponse(res, 400, '9995', {});
//         } else {
//           logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at get API -',
//             ' /api/v2/ad/eu/messages/:userId/:activePage/:searchString?: Token decode failed');
//           utils.sendResponse(res, 400, '9996', {});
//         }
//       });
//     } else {
//       logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -',
//         ' /api/v2/ad/eu/messages/:userId/:activePage/:searchString?: Missing mandatory fields data');
//       utils.sendResponse(res, 400, '9998', {});
//     }
//   });
//   // END GET API : /api/v2/ad/eu/messages/:userId/:activePage/:searchString?'

//   // BEGIN GET API : '/api/v2/ad/hosts/chat/list/:hostId/:activePage/:searchString?'

//   app.get('/api/v2/ad/hosts/chat/list/:hostId/:activePage/:searchString?', function (req, res, next) {
//     var pageNumber = parseInt(req.params.activePage);
//     var searchString = req.params.searchString;
//     if (!req.params.searchString || req.params.searchString == 'undefined') {
//       searchString = '';
//     }
//     if (req.headers.token && req.params.euUserId && pageNumber) {
//       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
//         if (tokenDecodedData && !tokenDecodedData.expStatus) {
//           AD_EuMessagesService.getEuChatList(req.params.euUserId, pageNumber, searchString, function (resObj) {
//             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
//           });
//         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
//           logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -' +
//             '/api/v2/ad/hosts/chat/list/:hostId/:activePage/:searchString?: Token expired');
//           utils.sendResponse(res, 400, '9995', {});
//         } else {
//           logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at get API -' +
//             '/api/v2/ad/hosts/chat/list/:hostId/:activePage/:searchString?: Token decode failed');
//           utils.sendResponse(res, 400, '9996', {});
//         }
//       });
//     } else {
//       logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -' +
//         ' /api/v2/ad/hosts/chat/list/:hostId/:activePage/:searchString?: Missing mandatory fields data');
//       utils.sendResponse(res, 400, '9998', {});
//     }
//   });

//   // END GET API : '/api/v2/ad/hosts/chat/list/:hostId/:activePage/:searchString?'

//   // BEGIN GET API : '/api/v2/ad/eu/count/messages/:userId'
//   app.get('/api/v2/ad/eu/count/messages/:userId', function (req, res, next) {
//     if (req.headers.token && req.params.userId) {
//       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
//         if (tokenDecodedData && !tokenDecodedData.expStatus) {
//           AD_EuMessagesService.euMessagesCount(req.params.userId, tokenDecodedData.decodedTokenData, function (resObj) {
//             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
//           });
//         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
//           logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -',
//             '/api/v2/ad/eu/count/messages/:userId: Token expired');
//           utils.sendResponse(res, 400, '9995', {});
//         } else {
//           logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at get API -',
//             '/api/v2/ad/eu/count/messages/:userId: Token decode failed');
//           utils.sendResponse(res, 400, '9996', {});
//         }
//       });
//     } else {
//       logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -',
//         '/api/v2/ad/eu/count/messages/:userId: Missing mandatory fields data');
//       utils.sendResponse(res, 400, '9998', {});
//     }
//   });

//   // End : '/api/v2/ad/eu/count/messages/:userId'

//   // BEGIN GET API : '/api/v2/ad/eu/serviceprovider/conversation/:userId/:propertyID/:activePage/:searchString?'

//   app.get('/api/v2/ad/eu/serviceprovider/conversation/:userId/:propertyID/:activePage/:searchString?', function (req, res, next) {
//     var pageNumber = parseInt(req.params.activePage);
//     var searchString = req.params.searchString;
//     if (!req.params.searchString || req.params.searchString == 'undefined') {
//       searchString = '';
//     }
//     if (req.headers.token && req.params.propertyID && req.params.userId) {
//       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
//         if (tokenDecodedData && !tokenDecodedData.expStatus) {
//           AD_EuMessagesService.getEuServiceProviderConversation(tokenDecodedData.decodedTokenData, req.params.propertyID, req.params.userId, pageNumber, searchString, function (resObj) {
//             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
//           });
//         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
//           logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -' +
//             '/api/v2/ad/eu/serviceprovider/conversation/:userId/:propertyID/:activePage/:searchString?: Token expired');
//           utils.sendResponse(res, 400, '9995', {});
//         } else {
//           logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at get API -' +
//             '/api/v2/ad/eu/serviceprovider/conversation/:userId/:propertyID/:activePage/:searchString?: Token decode failed');
//           utils.sendResponse(res, 400, '9996', {});
//         }
//       });
//     } else {
//       logger.error('There was an Error in controllers/AD-EuMessagesController.js at get API -' +
//         '/api/v2/ad/eu/serviceprovider/conversation/:userId/:propertyID/:activePage/:searchString?: Missing mandatory fields data');
//       utils.sendResponse(res, 400, '9998', {});
//     }
//   });

//   // End: '/api/v2/ad/eu/serviceprovider/conversation/:userId/:propertyID/:activePage/:searchString?'

//   // BEGIN POST API : '/api/v2/ad/eu/send/message'

//   app.post('/api/v2/ad/eu/send/message', function (req, res, next) {
//     var bodyValidation = adMessageBodyValidation(req.body);
//     if (bodyValidation && req.headers.token) {
//       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
//         if (tokenDecodedData && !tokenDecodedData.expStatus) {
//           AD_EuMessagesService.adminEUSendMessages(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
//             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
//           });
//         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
//           logger.error('There was an Error in controllers/AD-EuMessagesController.js at post API -',
//             ' /api/v2/ad/eu/send/message: Token expired');
//           utils.sendResponse(res, 400, '9995', {});
//         } else {
//           logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at post API -',
//             ' /api/v2/ad/eu/send/message: Token decode failed');
//           utils.sendResponse(res, 400, '9996', {});
//         }
//       });
//     } else {
//       logger.error('There was an Error in controllers/AD-EuMessagesController.js at post API -',
//         ' /api/v2/ad/eu/send/message: Missing mandatory fields data');
//       utils.sendResponse(res, 400, '9998', {});
//     }
//   });

//   // END POST API : '/api/v2/ad/eu/send/message'

//   // BEGIN PUT API : '/api/v2/ad/eu/message/unread/to/read/:propertyID'

//   app.put('/api/v2/ad/eu/message/unread/to/read/:propertyID', function (req, res, next) {
//     if (req.headers.token && req.params.propertyID) {
//       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
//         if (tokenDecodedData && !tokenDecodedData.expStatus) {
//           AD_EuMessagesService.adEUMessagesUnReadToRead(req.params.propertyID, tokenDecodedData.decodedTokenData, function (resObj) {
//             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
//           });
//         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
//           logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -' +
//             '/api/v2/ad/eu/message/unread/to/read/:propertyID: Token expired');
//           utils.sendResponse(res, 400, '9995', {});
//         } else {
//           logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at put API -' +
//             ' /api/v2/ad/eu/message/unread/to/read/:propertyID: Token decode failed');
//           utils.sendResponse(res, 400, '9996', {});
//         }
//       });
//     } else {
//       logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -' +
//         ' /api/v2/ad/eu/message/unread/to/read/:propertyID: Missing mandatory fields data');
//       utils.sendResponse(res, 400, '9998', {});
//     }
//   });

//   // END PUT API : '/api/v2/ad/eu/message/unread/to/read/:propertyID'


//   // BEGIN PUT API : '/api/v2/ad/eu/message/unread/to/read/:messageID'

//   app.put('/api/v2/ad/eu/message/unread/to/read/:messageID', function (req, res, next) {
//     if (req.headers.token && req.params.messageID) {
//       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
//         if (tokenDecodedData && !tokenDecodedData.expStatus) {
//           AD_EuMessagesService.euMessagesUnReadToRead(req.params.messageID, tokenDecodedData.decodedTokenData, function (resObj) {
//             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
//           });
//         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
//           logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -',
//             '/api/v2/ad/eu/message/unread/to/read/:messageID: Token expired');
//           utils.sendResponse(res, 400, '9995', {});
//         } else {
//           logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at put API -',
//             ' /api/v2/ad/eu/message/unread/to/read/:messageID: Token decode failed');
//           utils.sendResponse(res, 400, '9996', {});
//         }
//       });
//     } else {
//       logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -',
//         ' /api/v2/ad/eu/message/unread/to/read/:messageID: Missing mandatory fields data');
//       utils.sendResponse(res, 400, '9998', {});
//     }
//   });

//   // END PUT API : '/api/v2/ad/eu/message/unread/to/read/:propertyID'

//   // BEGIN PUT API : '/api/v2/ad/eu/message/read/to/unread/:messageID'

//   app.put('/api/v2/ad/eu/message/read/to/unread/:messageID', function (req, res, next) {
//     if (req.headers.token && req.params.messageID) {
//       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
//         if (tokenDecodedData && !tokenDecodedData.expStatus) {
//           AD_EuMessagesService.euMessagesReadToUnRead(req.params.messageID, tokenDecodedData.decodedTokenData, function (resObj) {
//             utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
//           });
//         } else if (tokenDecodedData && tokenDecodedData.expStatus) {
//           logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -',
//             '/api/v2/ad/eu/message/read/to/unread/:messageID: Token expired');
//           utils.sendResponse(res, 400, '9995', {});
//         } else {
//           logger.error('There was an Un-known Error in controllers/AD-EuMessagesController.js at put API -',
//             ' /api/v2/ad/eu/message/read/to/unread/:messageID: Token decode failed');
//           utils.sendResponse(res, 400, '9996', {});
//         }
//       });
//     } else {
//       logger.error('There was an Error in controllers/AD-EuMessagesController.js at put API -',
//         '/api/v2/ad/eu/message/read/to/unread/:messageID: Missing mandatory fields data');
//       utils.sendResponse(res, 400, '9998', {});
//     }
//   });

//   // END PUT API : '/api/v2/ad/eu/message/read/to/unread/:messageID'

// }

// // END AD-EuMessagesController'

// /**
//  * @param {object} reqBodyObj object
//  * @return {boolean} boolean
//  */
// function adMessageBodyValidation(reqBodyObj) {
//   if (reqBodyObj.message && reqBodyObj.messagedBy && reqBodyObj.propertyId
//     && reqBodyObj.propertyTitle && reqBodyObj.propertyType && reqBodyObj.spServiceProviderId && reqBodyObj.spServiceProvider) {
//     return true;
//   } else
//     return false;
// }
