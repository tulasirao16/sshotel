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
var SP_Properties = require('../models/SP-Properties');

module.exports = {
  endUserMessages: function(pageNumber, searchString, tokenDecodedData, callback) {
    var query = {
      'euUserId': tokenDecodedData.iss,
      'isEuDeleted': false,
      '$or': [
        {'messageBy': {$regex: searchString, $options: 'i'}},
        {'spServiceProvider': {$regex: searchString, $options: 'i'}},
        {'spName': {$regex: searchString, $options: 'i'}},
        {'message': {$regex: searchString, $options: 'i'}},
        {'euReadStatus': {$regex: searchString, $options: 'i'}},
        {'spReadStatus': {$regex: searchString, $options: 'i'}}
      ]
    }
    EU_Messages.find(query)
  //  .sort({'createdAt': -1})
    .populate('euUserId')
    .skip((pageNumber -1) * 30)
    .limit(30).exec(function(error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/EU-UserMessagesDAO.js,',
          ' at endUserMessages of EU_Messages query:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.length > 0) {
        EU_Messages.countDocuments(query).
        exec(function(errorCount, resultCount) {
          if(errorCount) {
              logger.error('There was an Un-known Error occured in daos/EU-UserMessagesDAO.js, at endUserMessages:', errorCount);
              callback({httpCode: 500, statusCode: '9999', result: {}});
          } else if(resultCount) {
              var resultObj = {totalDocs: resultCount, messageData: resObj};
              callback({httpCode: 200, statusCode: '0000', result: resultObj});
          }else {
              callback({httpCode: 400, statusCode: '9997', result: {}});
          }
        });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  endUserSendMessages: function(messageData, decodedTokenData, callback) {
    messageData.save(function(error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/EU-UserMessagesDAO.js, at endUserSendMessages of EU_Messages query:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.euAuditing(decodedTokenData, 'Create', { name: config.collectionEndUserMessages, id: resObj._id, value: 'Message ID' }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  endUserDeleteMessages: function(reqBody, tokenDecodedData, callback) {
    EU_Messages.updateMany({ 'euUserId': tokenDecodedData.iss, '_id': { '$in': reqBody }, 'isEuDeleted': false }, { $set: { isEuDeleted: true } })
      .exec(function(error, resObj) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/EU-UserMessagesDAO.js, at endUserDeleteMessages of EU_Messages query:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj.nModified >= 1) {
          AuditingInfoDAO.euAuditing(tokenDecodedData, 'Delete Many', { name: config.collectionEndUserMessages, id: tokenDecodedData.iss, value: 'Deleted By ID: ' + tokenDecodedData.ua }, { isEuDeleted: true, recordIds: reqBody });
          callback({ httpCode: 200, statusCode: '0000', result: resObj });
        } else {
          callback({ httpCode: 400, statusCode: '9994', result: {} });
        }
      });
  },
  endUserMessagesCount: function(tokenDecodedData, callback) {
    EU_Messages.countDocuments({ 'euUserId': tokenDecodedData.iss, 'euReadStatus': 'Unread', 'isEuDeleted': false })
      .exec(function(error, resultCount) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/EU-UserMessagesDAO.js,',
            ' at endUserMessagesCount of EU_Messages query:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resultCount) {
          callback({ httpCode: 200, statusCode: '0000', result: resultCount });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },

  getEndUserChatList: function(tokenDecodedData, pageNumber, searchString, callback) {
    EU_Messages.aggregate([
      { $match: { isDeleted: false, euUserId: tokenDecodedData.iss, '$or': [{'propertyTitle': {$regex: searchString, $options: 'i'}}, {'message': {$regex: searchString, $options: 'i'}}] } },
      { $sort : { createdAt : -1 } },
      {
        $group: {
          _id: { propertyId: "$propertyId", euReadStatus:"$euReadStatus"},
          message: { $first: "$message" },
          propertyTitle: {$first: "$propertyTitle" },
          propertyId: {$first: "$propertyId" },
          createdAt: {$first: "$createdAt" },
          createdOn: {$first: "$createdOn" },
          count: {$sum: 1}
        }
      },{
        $group: {
          _id: "$_id.propertyId",
          euReadStatusGroup: {
            $push:{
              euReadStatus: "$_id.euReadStatus",
              message: "$message",
              propertyTitle: "$propertyTitle",
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
        logger.error('There was an Error occured in daos/EU-UserMessagesDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (data && data.length > 0) {
        SP_Properties.populate(data, {path: '_id'}, function(err, res) {
          if(err) {
            logger.error('There was an Un-known Error occured in daos/EU-UserMessagesDAO.js, at getEndUserChatList:', err);
          } else if(res) {
            EU_Messages.aggregate([
              { $match: { isDeleted: false, euUserId: tokenDecodedData.iss, '$or': [{'propertyTitle': {$regex: searchString, $options: 'i'}}, {'message': {$regex: searchString, $options: 'i'}}] } },
              {
                $group: {
                  _id: { propertyId: "$propertyId"},
                }
              }
            ]).exec(function(errorCount, resultCount) {
              if(errorCount) {
                logger.error('There was an Un-known Error occured in daos/EU-UserMessagesDAO.js, at getEndUserChatList:', errorCount);
                var resultObj = { totalDocs: data.length, messageData: res };
                callback({ httpCode: 200, statusCode: '0000', result: resultObj });
              } else if(resultCount) {
                  var resultObj = {totalDocs: resultCount.length, messageData: res};
                  callback({httpCode: 200, statusCode: '0000', result: resultObj});
              }else {
                var resultObj = { totalDocs: data.length, messageData: res };
                callback({ httpCode: 200, statusCode: '0000', result: resultObj });
              }
            });
          }else {
            callback({ httpCode: 400, statusCode: '0000', result: {} });
          }
        });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
  },


  getEndUserServiceProviderConversation: function(tokenDecodedData, propertyID, pageNumber, searchString, callback) {
    var query = {
      'isDeleted': false,
      'euUserId': tokenDecodedData.iss,
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

  euMessagesUnReadToRead: function(propertyID, updateObj, tokenDecodedData, callback) {
    var query = { 
      'euUserId': tokenDecodedData.iss, 
      'propertyId': propertyID, 
      'isEuDeleted': false, 
      'euReadStatus': 'Unread'
    };
    EU_Messages.updateMany(query, { $set: updateObj }, {new: true})
    .exec(function(error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/EU-UserMessagesDAO.js,',
          ' at euMessagesUnReadToRead of EU_Messages query:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.nModified >= 1) {
        AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserMessages, id: resObj._id, value: 'Message ID' }, updateObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },

  endUserMessagesUnReadToRead: function(messageIDs, updateObj, tokenDecodedData, callback) {
    EU_Messages.findOneAndUpdate({ 'euUserId': tokenDecodedData.iss, '_id': messageIDs, 'isEuDeleted': false }, { $set: updateObj }, {new: true})
      .exec(function(error, resObj) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/EU-UserMessagesDAO.js,',
            ' at endUserMessagesUnReadToRead of EU_Messages query:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj._id) {
          AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserMessages, id: resObj._id, value: 'Message ID' }, updateObj);
          callback({ httpCode: 200, statusCode: '0000', result: resObj });
        } else {
          callback({ httpCode: 400, statusCode: '9994', result: {} });
        }
      });
  },

  endUserMessagesReadToUnRead: function(messageIDs, updateObj, tokenDecodedData, callback) {
    EU_Messages.findOneAndUpdate({ 'euUserId': tokenDecodedData.iss, '_id': messageIDs, 'isEuDeleted': false }, { $set: updateObj }, {new: true})
      .exec(function(error, resObj) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/EU-UserMessagesDAO.js,',
            ' at endUserMessagesReadToUnRead of EU_Messages query:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj._id) {
          AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserMessages, id: messageIDs, value: 'Message ID' }, updateObj);
          callback({ httpCode: 200, statusCode: '0000', result: resObj });
        } else {
          callback({ httpCode: 400, statusCode: '9994', result: {} });
        }
      });
  },
}