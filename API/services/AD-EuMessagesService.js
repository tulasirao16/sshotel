/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */
var CommonService = require('./CommonService');
var AD_EuMessagesDAO = require('../daos/AD-EuMessagesDAO');
var Messages = require('../models/EU-Messages');

// BEGIN : AD-EuMessagesService

module.exports = {
  // // BEGIN : getEuMessages

  getEuMessagesData: function (userId, pageNumber, searchString, tokenDecodedData, callback) {
    AD_EuMessagesDAO.getEuMessagesData(userId, pageNumber, searchString, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  getEuChatList: function (euUserId, pageNumber, searchString, callback) {
    AD_EuMessagesDAO.getEuChatList(euUserId, pageNumber, searchString, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  euMessagesCount: function (userId, tokenDecodedData, callback) {
    AD_EuMessagesDAO.euMessagesCount(userId, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  getEuServiceProviderConversation: function (tokenDecodedData, propertyID, userId, pageNumber, searchString, callback) {
    AD_EuMessagesDAO.getEuServiceProviderConversation(tokenDecodedData, propertyID, userId, pageNumber, searchString, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  adminEUSendMessages: function (reqBody, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var messageObj = {
      euUserId: reqBody.euUserId,
      euName: reqBody.euName,
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
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    var messageData = new Messages(messageObj);
    AD_EuMessagesDAO.adminEUSendMessages(messageData, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  adEUMessagesUnReadToRead: function (propertyID, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      adReadStatus: 'Read',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_EuMessagesDAO.adEUMessagesUnReadToRead(propertyID, updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  euMessagesUnReadToRead: function (messageID, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      euReadStatus: 'Read',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_EuMessagesDAO.euMessagesUnReadToRead(messageID, updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  euMessagesReadToUnRead: function (messageID, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      adReadStatus: 'Unread',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_EuMessagesDAO.euMessagesReadToUnRead(messageID, updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  }
};
