/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var EU_Messages = require('../models/EU-Messages');
var EU_Users = require('../models/EU-Users');
var SP_Properties = require('../models/SP-Properties');

module.exports = {
  serviceProviderGetEUMessages: function (pageNumber, searchString, tokenDecodedData, callback) {
    var query = {
      'spServiceProviderId': tokenDecodedData.uspid,
      'isSpDeleted': false,
      '$or': [
        { 'displayName': { $regex: searchString, $options: 'i' } },
        { 'euName': { $regex: searchString, $options: 'i' } },
        { 'message': { $regex: searchString, $options: 'i' } },
      ]
    };
    EU_Messages.find(query)
    .populate('euUserId')
    .skip((pageNumber - 1) * 10)
    .limit(10)
    .sort({ createdAt: -1 })
    .exec(function (error, resultArray) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP_LocationsDAO.js, at getServiceLocations:', error);
        callback(error, { statusCode: '9999', result: {} });
      } else if (resultArray && resultArray.length > 0) {
        EU_Messages.countDocuments(query).
          exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Error occured in daos/getSPServiceLocationsData.js at getSPServiceLocationsData countDocument', errorCount);
              callback(errorCount, { statusCode: '9999', result: {} });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount, messagesList: resultArray };
              callback(errorCount, { statusCode: '0000', result: resultObj });
            } else {
              callback(errorCount, { statusCode: '9997', result: {} });
            }
          });
      } else {
        callback(error, { statusCode: '9997', result: {} });
      }
    });
  },

  serviceProviderSendMessages: function (messageData, tokenDecodedData, callback) {
    messageData.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP-UserMessagesDAO.js,',
          ' at serviceProviderSendMessages of EU_Messages query:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionEndUserMessages, id: resObj._id, value: resObj.spName }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },

  serviceProviderDeleteMessages: function (recordID, messageDeleteObj, tokenDecodedData, callback) {
    EU_Messages.findOneAndUpdate({ _id: recordID, isSpDeleted: false }, { $set: messageDeleteObj }, { new: true }, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP-UserMessagesDAO.js,' +
          ' at serviceProviderDeleteMessages:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionEndUserMessages, id: resObj._id, value: resObj.spName }, messageDeleteObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },


  spMessagesUnReadToRead: function(params, updateObj, tokenDecodedData, callback) {
    var query = { 
      'euUserId': params.euUserID, 
      'propertyId': params.propertyID, 
      'isSpDeleted': false, 
      'spReadStatus': 'Unread'
    };
    EU_Messages.updateMany(query, { $set: updateObj }, {new: true})
    .exec(function(error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/SP-UserMessagesDAO.js,',
          ' at spMessagesUnReadToRead of EU_Messages query:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.nModified >= 1) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionEndUserMessages, id: resObj._id, value: resObj.spName }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },

  serviceProviderMessagesCount: function (tokenDecodedData, callback) {
    EU_Messages.countDocuments({ 'spServiceProviderId': tokenDecodedData.uspid, 'spReadStatus': 'Unread', 'isSpDeleted': false })
      .exec(function (error, resultCount) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/SP-UserMessagesDAO.js,',
            ' at serviceProviderMessagesCount of EU_Messages query:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resultCount) {
          callback({ httpCode: 200, statusCode: '0000', result: resultCount });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },


  getServiceProviderChatList: function(tokenDecodedData, pageNumber, searchString, callback) {
    EU_Messages.aggregate([
      { $match: { isDeleted: false, spServiceProviderId: tokenDecodedData.uspid, '$or': [{'euName': {$regex: searchString, $options: 'i'}}, {'propertyTitle': {$regex: searchString, $options: 'i'}}, {'message': {$regex: searchString, $options: 'i'}}] } },
      { $sort : { createdAt : -1 } },
      {
        $group: {
          _id: { euUserId: "$euUserId", propertyId: "$propertyId", spReadStatus:"$spReadStatus" },
          message: { $first: "$message" },
          propertyTitle: {$first: "$propertyTitle" },
          propertyId: {$first: "$propertyId" },
          euName: {$first: "$euName"},
          createdAt: {$first: "$createdAt" },
          createdOn: {$first: "$createdOn" },
          count: {$sum: 1}
        }
      },{
        $group: {
          _id: { euUserId: "$_id.euUserId", propertyId:"$_id.propertyId"},
          spReadStatusGroup: {
            $push:{
              spReadStatus: "$_id.spReadStatus",
              propertyId: "$_id.propertyId",
              message: "$message",
              propertyTitle: "$propertyTitle",
              euName: "$euName",
              message: "$message",
              createdAt: "$createdAt",
              createdOn: "$createdOn",
              count: "$count"
            }
          },
        }
      }
    ]).skip((pageNumber -1) * 100)
    .limit(100)
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/SP-UserMessagesDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (data && data.length > 0) {
        EU_Users.populate(data, {path: '_id.euUserId'}, function(err, res) {
          if(err) {
            logger.error('There was an Un-known Error occured in daos/SP-UserMessagesDAO.js, at getServiceProviderChatList:', err);
          } else if(res) {
            EU_Messages.aggregate([
              { $match: { isDeleted: false, spServiceProviderId: tokenDecodedData.uspid, '$or': [{'euName': {$regex: searchString, $options: 'i'}}, {'propertyTitle': {$regex: searchString, $options: 'i'}}, {'message': {$regex: searchString, $options: 'i'}}] } },
              {
                $group: {
                  _id: { propertyId: "$propertyId", euUserId: "$euUserId"},
                }
              }
            ]).exec(function(errorCount, resultCount) {
              if(errorCount) {
                logger.error('There was an Un-known Error occured in daos/SP-UserMessagesDAO.js, at getServiceProviderChatList:', errorCount);
                var resultObj = { totalDocs: data.length, messageData: data };
                callback({ httpCode: 200, statusCode: '0000', result: resultObj });
              } else if(resultCount) {
                  var resultObj = {totalDocs: resultCount.length, messageData: data};
                  callback({httpCode: 200, statusCode: '0000', result: resultObj});
              }else {
                var resultObj = { totalDocs: data.length, messageData: data };
                callback({ httpCode: 200, statusCode: '0000', result: resultObj });
              }
            });
          }else {
            callback({ httpCode: 400, statusCode: '0000', result: resultObj });
          }
        });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
  },

  getServiceProviderEndUserConversation: function(tokenDecodedData, euUserID, propertyID, pageNumber, searchString, callback) {
    var query = {
      'isDeleted': false,
      'euUserId': euUserID,
      'spServiceProviderId': tokenDecodedData.uspid,
      'propertyId': propertyID,
      '$or': [{'message': {$regex: searchString, $options: 'i'}},]
    }
    EU_Messages.aggregate([
      { $match: query },
      { $sort : { createdAt : -1 } },
    ]).skip((pageNumber -1) * 20)
    .limit(20)
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-UserMessagesDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (data && data.length > 0) {
        EU_Messages.aggregate([
          { $match: query },
          {
            $group: {
              _id: null,
              count: {$sum: 1}
            }
          }
        ]).exec(function(errorCount, resultCount) {
          if(errorCount) {
            logger.error('There was an Un-known Error occured in daos/EU-UserMessagesDAO.js, at getEndUserChatList:', errorCount);
            var resultObj = { totalDocs: data.length, messagesData: data };
            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
          } else if(resultCount) {
              var resultObj = {totalDocs: resultCount[0].count, messagesData: data};
              callback({httpCode: 200, statusCode: '0000', result: resultObj});
          } else {
            var resultObj = { totalDocs: data.length, messagesData: data };
            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
          }
        });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
  },



  serviceProviderMessagesUnReadToRead: function (messageIDs, updateObj, tokenDecodedData, callback) {
    EU_Messages.findOneAndUpdate({ 'spServiceProviderId': tokenDecodedData.uspid, '_id': messageIDs, 'isSpDeleted': false }, { $set: updateObj }, {new: true})
      .exec(function (error, resObj) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/SP-UserMessagesDAO.js,',
            ' at serviceProviderMessagesUnReadToRead of EU_Messages query:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj.spReadStatus == 'Read') {
          AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionEndUserMessages, id: resObj._id, value: resObj.spName }, updateObj);
          callback({ httpCode: 200, statusCode: '0000', result: resObj });
        } else {
          callback({ httpCode: 400, statusCode: '9994', result: {} });
        }
      });
  },

  serviceProviderMessagesReadToUnRead: function (messageIDs, updateObj, tokenDecodedData, callback) {
    EU_Messages.findOneAndUpdate({ 'spServiceProviderId': tokenDecodedData.uspid, '_id': messageIDs, 'isSpDeleted': false }, { $set: updateObj }, {new: true})
      .exec(function (error, resObj) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/SP-UserMessagesDAO.js,',
            ' at serviceProviderMessagesReadToUnRead of EU_Messages query:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj.spReadStatus == 'Unread') {
          AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update', {name: config.collectionEndUserMessages, id: resObj._id, value: resObj.spName }, updateObj);
          callback({ httpCode: 200, statusCode: '0000', result: resObj });
        } else {
          callback({ httpCode: 400, statusCode: '9994', result: {} });
        }
      });
  }
}