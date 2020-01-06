/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */
var CommonService = require('./CommonService');
var SP_UserMessagesDAO = require('../daos/SP-UserMessagesDAO');
var Messages = require('../models/EU-Messages');

module.exports = {
  serviceProviderGetEUMessages: function (pageNumber, searchString, tokenDecodedData, callback) {
    SP_UserMessagesDAO.serviceProviderGetEUMessages(pageNumber, searchString, tokenDecodedData, function (error, resObj) {
      if (error) {
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
        callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
        callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
    });
  },

  // serviceProviderSendMessages: function (reqBody, tokenDecodedData, callback) {
  //   var currentUTC = CommonService.currentUTCObj();
  //   if (reqBody.from == 'End User') {
  //     var messageObj = {
  //       spServiceProviderId: tokenDecodedData.uspid,
  //       spServiceProvider: tokenDecodedData.usp,
  //       spUserId: tokenDecodedData.iss,
  //       spName: tokenDecodedData.ua,
  //       euUserId: reqBody.euUserId,
  //       euName: reqBody.euName,
  //       userAccount: reqBody.userAccount,
  //       messageBy: reqBody.messagedBy,
  //       message: reqBody.message,
  //       propertyId: reqBody.propertyId,
  //       propertyTitle: reqBody.propertyTitle,
  //       propertyType: reqBody.propertyType,
  //       euReadStatus: 'Unread',
  //       spReadStatus: 'Read',
  //       adReadStatus: 'Unread',
  //       createdAt: currentUTC.currentUTCDateTimeNumber,
  //       createdBy: tokenDecodedData.ua,
  //       createdOn: currentUTC.currentUTCDateTimeString,
  //       updatedAt: currentUTC.currentUTCDateTimeNumber,
  //       updatedBy: tokenDecodedData.ua,
  //       updatedOn: currentUTC.currentUTCDateTimeString
  //     };
  //   } else {
  //     var messageObj = {
  //       spServiceProviderId: tokenDecodedData.uspid,
  //       spServiceProvider: tokenDecodedData.usp,
  //       spUserId: tokenDecodedData.iss,
  //       spName: tokenDecodedData.ua,
  //       euUserId: reqBody.euUserId,
  //       euName: reqBody.euName,
  //       userAccount: reqBody.userAccount,
  //       messageBy: reqBody.messagedBy,
  //       adminUserId: reqBody.adminUserId,
  //       adminName: reqBody.adminName,
  //       message: reqBody.message,
  //       euReadStatus: 'Unread',
  //       spReadStatus: 'Read',
  //       adReadStatus: 'Unread',
  //       createdAt: currentUTC.currentUTCDateTimeNumber,
  //       createdBy: tokenDecodedData.ua,
  //       createdOn: currentUTC.currentUTCDateTimeString,
  //       updatedAt: currentUTC.currentUTCDateTimeNumber,
  //       updatedBy: tokenDecodedData.ua,
  //       updatedOn: currentUTC.currentUTCDateTimeString
  //     };
  //   }
  //   var messageData = new Messages(messageObj);
  //   SP_UserMessagesDAO.serviceProviderSendMessages(messageData, tokenDecodedData, function (resObj) {
  //     callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
  //   });
  // },

  serviceProviderSendMessages: function (reqBody, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var messageObj = {
      spServiceProviderId: tokenDecodedData.uspid,
      spServiceProvider: tokenDecodedData.usp,
      spUserId: tokenDecodedData.iss,
      spName: tokenDecodedData.ua,
      euUserId: reqBody.euUserId,
      euName: reqBody.euName,
      messageBy: reqBody.messagedBy,
      message: reqBody.message,
      propertyId: reqBody.propertyId,
      propertyTitle: reqBody.propertyTitle,
      propertyType: reqBody.propertyType,
      euReadStatus: 'Unread',
      spReadStatus: 'Read',
      adReadStatus: 'Unread',
      createdAt: currentUTC.currentUTCDateTimeNumber,
      createdBy: tokenDecodedData.ua,
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    var messageData = new Messages(messageObj);
    SP_UserMessagesDAO.serviceProviderSendMessages(messageData, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  serviceProviderDeleteMessages: function (body, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var messageDeleteObj = {
      isSpDeleted: true,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    SP_UserMessagesDAO.serviceProviderDeleteMessages(body._id, messageDeleteObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },


  spMessagesUnReadToRead: function(params, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      spReadStatus: 'Read',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    SP_UserMessagesDAO.spMessagesUnReadToRead(params, updateObj, tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  serviceProviderMessagesUnReadToRead: function (messageIDs, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      spReadStatus: 'Read',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: 'superadmin',
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    SP_UserMessagesDAO.serviceProviderMessagesUnReadToRead(messageIDs, updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  serviceProviderMessagesCount: function (tokenDecodedData, callback) {
    SP_UserMessagesDAO.serviceProviderMessagesCount(tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  
  getServiceProviderChatList: function(tokenDecodedData, pageNumber, searchString, callback) {
    SP_UserMessagesDAO.getServiceProviderChatList(tokenDecodedData, pageNumber, searchString, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  getServiceProviderEndUserConversation: function(tokenDecodedData, euUserID, propertyID, pageNumber, searchString, callback) {
    SP_UserMessagesDAO.getServiceProviderEndUserConversation(tokenDecodedData, euUserID, propertyID, pageNumber, searchString, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  serviceProviderMessagesReadToUnRead: function (messageIDs, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      spReadStatus: 'Unread',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: 'superadmin',
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    SP_UserMessagesDAO.serviceProviderMessagesReadToUnRead(messageIDs, updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  }
};