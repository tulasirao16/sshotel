/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */
var CommonService = require('./CommonService');
var AD_HostsMessagesDAO = require('../daos/AD-HostsMessagesDAO');
var Messages = require('../models/EU-Messages');
// BEGIN : AD-HostsMessagesService

module.exports = {

  // BEGIN : getHostsMessages
  getHostsMessages: function (hostId, pageNumber, searchString, tokenDecodedData, callback) {
    AD_HostsMessagesDAO.getHostsMessages(hostId, pageNumber, searchString, tokenDecodedData, function (error, resObj) {
      if (error) {
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
        callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
        callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
    });
  },
  // END : getHostsMessages

  // BEGIN : hostsMessagesCount
  hostsMessagesCount: function (hostId, tokenDecodedData, callback) {
    AD_HostsMessagesDAO.hostsMessagesCount(hostId, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // END : hostsMessagesCount

  // BEGIN : AD Host Get Chat List
  hostsMessagesChatList: function (tokenDecodedData, hostId, pageNumber, searchString, callback) {
    AD_HostsMessagesDAO.hostsMessagesChatList(tokenDecodedData, hostId, pageNumber, searchString, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // End : AD Host Get Chat List

  // BEGIN : AD Host Conversation
  getHostsEuConversation: function (tokenDecodedData, euUserID, propertyID, pageNumber, searchString, callback) {
    AD_HostsMessagesDAO.getHostsEuConversation(tokenDecodedData, euUserID, propertyID, pageNumber, searchString, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // END : AD Host Conversation

  // BEGIN : AD Host SendMessage
  hostsSendMessages: function (reqBody, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var messageObj = {
      spServiceProviderId: reqBody.spServiceProviderId,
      spServiceProvider: reqBody.spServiceProvider,
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
    AD_HostsMessagesDAO.hostsSendMessages(messageData, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },

  // End : AD Host SendMessage

  // BEGIN : AD Host UnReadToRead
  adMessagesUnReadToRead: function (params, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      adReadStatus: 'Read',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_HostsMessagesDAO.adMessagesUnReadToRead(params, updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // End : AD Host UnReadToRead

  // BEGIN : AD Host UnReadToRead
  hostsMessagesUnReadToRead: function (messageID, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      adReadStatus: 'Read',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_HostsMessagesDAO.hostsMessagesUnReadToRead(messageID, updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  }
  // End : AD Host UnReadToRead
};
// END : AD-HostsMessagesService