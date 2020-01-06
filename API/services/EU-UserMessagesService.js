/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */
var CommonService = require('./CommonService');
var EU_UserMessagesDAO = require('../daos/EU-UserMessagesDAO');
var Messages = require('../models/EU-Messages');

module.exports = {
  endUserMessages: function(pageNumber, searchString, tokenDecodedData, callback) {
    EU_UserMessagesDAO.endUserMessages(pageNumber, searchString, tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  endUserSendMessages: function(reqBody, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var messageObj = {
      euUserId: tokenDecodedData.iss,
      euName: tokenDecodedData.un ? tokenDecodedData.un : reqBody.euName,
      messageBy: reqBody.messagedBy,
      spServiceProviderId: reqBody.spServiceProviderId,
      spServiceProvider: reqBody.spServiceProvider,
      propertyId: reqBody.propertyId,
      propertyTitle: reqBody.propertyTitle,
      propertyType: reqBody.propertyType,
      spUserId: reqBody.spUserId ? reqBody.spUserId : '',
      spName: reqBody.spName ? reqBody.spName : '',
      message: reqBody.message,
      euReadStatus: 'Read',
      spReadStatus: 'Unread',
      adReadStatus: 'Unread',
      createdAt: currentUTC.currentUTCDateTimeNumber,
      createdBy: 'superadmin',
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: 'superadmin',
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    var messageData = new Messages(messageObj);
    EU_UserMessagesDAO.endUserSendMessages(messageData, tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  endUserDeleteMessages: function(reqBody, tokenDecodedData, callback) {
    EU_UserMessagesDAO.endUserDeleteMessages(reqBody, tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  endUserMessagesCount: function(tokenDecodedData, callback) {
    EU_UserMessagesDAO.endUserMessagesCount(tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  getEndUserChatList: function(tokenDecodedData, pageNumber, searchString, callback) {
    EU_UserMessagesDAO.getEndUserChatList(tokenDecodedData, pageNumber, searchString, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  getEndUserServiceProviderConversation: function(tokenDecodedData, propertyID, pageNumber, searchString, callback) {
    EU_UserMessagesDAO.getEndUserServiceProviderConversation(tokenDecodedData, propertyID, pageNumber, searchString, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },


  euMessagesUnReadToRead: function(propertyID, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      euReadStatus: 'Read',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: 'superadmin',
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    EU_UserMessagesDAO.euMessagesUnReadToRead(propertyID, updateObj, tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  endUserMessagesUnReadToRead: function(messageIDs, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      euReadStatus: 'Read',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    EU_UserMessagesDAO.endUserMessagesUnReadToRead(messageIDs, updateObj, tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  endUserMessagesReadToUnRead: function(messageIDs, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      euReadStatus: 'Unread',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: 'superadmin',
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    EU_UserMessagesDAO.endUserMessagesReadToUnRead(messageIDs, updateObj, tokenDecodedData, function(resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  }
};