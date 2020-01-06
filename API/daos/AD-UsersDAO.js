/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var AD_Users = require('../models/AD-Users');
var CommonService = require('../services/CommonService');

// --- Begining of AD-UsersDAO......
module.exports = {

  // --- Begin postADUserData: To Create Admin User
  postADUserData: function (userData, tokenDecodedData, callback) {
    userData.save(function (error, resObj) {
      if (error) {
        if (error.errmsg.indexOf('mobileNumber_1') > 0) {
          logger.error('There was an Uniqueness(mobileNumber) Error occured in daos/AD-UsersDAO.js,' +
            ' at postADUserData:', error);
          callback({ httpCode: 400, statusCode: '9989', result: {} });
        } else if (error.errmsg.indexOf('email_1') > 0) {
          logger.error('There was an Uniqueness(email) Error occured in daos/AD-UsersDAO.js,' +
            ' at postADUserData:', error);
          callback({ httpCode: 400, statusCode: '9988', result: {} });
        } else if (error.errmsg.indexOf('userAccount_1') > 0) {
          logger.error('There was an Uniqueness(userAccount) Error occured in daos/AD-UsersDAO.js,' +
            ' at postADUserData:', error);
          callback({ httpCode: 400, statusCode: '9987', result: {} });
        } else {
          logger.error('There was an Un-known Error occured in daos/AD-UsersDAO.js,' +
            ' at postADUserData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', { name: config.collectionADUsers, id: resObj._id, value: resObj.userAccount }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End postADUserData: To Create Admin User

  // --- Begin getADUsersListingData: To Get Admin Users
  getADUsersListingData: function (pageNum, searchString, tokenDecodedData, callback) {
    var query = {
      'isDeleted': false,
      '$or': [
        { 'name': { $regex: searchString, $options: 'i' } },
        { 'firstName': { $regex: searchString, $options: 'i' } },
        { 'lastName': { $regex: searchString, $options: 'i' } },
        { 'email': { $regex: searchString, $options: 'i' } },
        { 'mobileNumber': { $regex: searchString, $options: 'i' } },
        { 'displayName': { $regex: searchString, $options: 'i' } },
        { 'userAccount': { $regex: searchString, $options: 'i' } },
        { 'userStatus': { $regex: searchString, $options: 'i' } },
        { 'userRole': { $regex: searchString, $options: 'i' } }
      ]
    };
    AD_Users.find(query)
      .skip((pageNum - 1) * 10)
      .limit(10)
      .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-UsersDAO.js, at getADUsersListingData:'+ error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
          AD_Users.countDocuments(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD-UsersDAO.js, at getADUsersListingData:'+ errorCount);
              var resultObj = { totalDocs: resultArray.length, userData: resultArray };
              callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount, userData: resultArray };
              callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            } else {
              var resultObj = { totalDocs: resultArray.length, userData: resultArray };
              callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            }
          });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },
  // --- End getADUsersListingData:To Get Admin Users



  // --- Begin getADUsersListDataForTickets: To Get Admin Users
  getADUsersListDataForTickets: function (tokenDecodedData, callback) {
    AD_Users.find({'isDeleted': false, userAccount: {"$nin": tokenDecodedData.ua == 'superadmin' ? [] : ['superadmin']}},  {"_id": 1, "userAccount": 1, "name": 1})
      .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-UsersDAO.js, at getADUsersListingData:'+ error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
          callback({ httpCode: 200, statusCode: '0000', result: resultArray });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },
  // --- End getADUsersListDataForTickets:To Get Admin Users

  //......Begin: getADUserDataByRecordId User Data By ID
  getADUserDataByRecordId: function (recordId, tokenDecodedData, callback) {
    var query = {
      '_id': recordId,
      'isDeleted': false
    }
    AD_Users.findOne(query, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-UsersDAO.js,' +
          ' at getADUserDataByRecordId:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    })
  },
  //........End: getADUserDataByRecordId User Data By ID

  // --- Begin  updateADUsers Password:
  updateADUsersPassword: function (userID, newPassword, tokenDecodedData, callback) {
    var query = { _id: userID, isDeleted: false };
    AD_Users.findOneAndUpdate(query, { $set: newPassword }, {new: true}, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-Known Error occured in daos/AD-HostUsersDAO.js,'+
          ' at updateADUsersChangePassword:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing({iss: resObj._id, ua: resObj.userAccount, un: resObj.name}, 'Update', {name: config.collectionADUsers, id: resObj._id, value: resObj.userAccount}, newPassword);
        callback({ httpCode: 200, statusCode: '1012', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9985', result: {} });
      }
    });
  },
  // --- End updateADUsers Password:

    // --- Begin updateADUserData:
    updateADUserData: function(body, decodedTokenData, updateUserObj, callback) {
      AD_Users.findOneAndUpdate({_id: body._id, isDeleted: false }, {$set: updateUserObj}, {new: true}, function(error, resObj) {
        if(error) {
          if(error.errmsg.indexOf('mobileNumber_1') > 0) {
            logger.error('There was an Uniqueness(mobileNumber) Error occured in daos/AD-UsersDAO.js,'+
            ' at updateADUserData:', error);
            callback({ httpCode: 400, statusCode: '9989', result: {}});
          } else if(error.errmsg.indexOf('email_1') > 0) {
              logger.error('There was an Uniqueness(email) Error occured in daos/AD-UsersDAO.js,'+
              ' at updateADUserData:', error);
              callback({ httpCode: 400, statusCode: '9988', result: {}});
          } else if(error.errmsg.indexOf('userAccount_1') > 0) {
              logger.error('There was an Uniqueness(userAccount) Error occured in daos/AD-UsersDAO.js,'+
              ' at updateADUserData:', error);
              callback({ httpCode: 400, statusCode: '9987', result: {}});
          } else {
              logger.error('There was an Un-known Error occured in daos/AD-UsersDAO.js,'+
              ' at updateADUserData:', error);
              callback({ httpCode: 500, statusCode: '9999', result: {}});
          }
        }else if(resObj && resObj._id) {
          AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', {name: config.collectionADUsers, id: resObj._id, value: resObj.userAccount }, updateUserObj);
          callback({httpCode: 200, statusCode: '0000', result: resObj});
        } else {
          callback({httpCode: 400, statusCode: '9992', result: {}});
        }
      });
    },
    // --- End updateADUserData:

    // --- Begin activateADUserData:
  activateADUserData: function(recordID, updateUserObj, decodedTokenData, callback) {
    AD_Users.findOneAndUpdate({_id: recordID, isDeleted: false }, {$set: updateUserObj}, {new: true}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/AD-UsersDAO.js,'+
        ' at activateADUserData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', {name: config.collectionADUsers, id: resObj._id, value: resObj.userAccount }, updateUserObj);
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({httpCode: 400, statusCode: '9992', result: {}});
      }
    });
  },
  // --- End activateADUserData:

  // --- Begin inActivateADUserData:
  inActivateADUserData: function(recordID, updateUserObj, decodedTokenData, callback) {
    AD_Users.findOneAndUpdate({_id: recordID, isDeleted: false }, {$set: updateUserObj}, {new: true}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/AD-UsersDAO.js,'+
        ' at inActivateADUserData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', {name: config.collectionADUsers, id: resObj._id, value: resObj.userAccount }, updateUserObj);
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({httpCode: 400, statusCode: '9992', result: {}});
      }
    });
  },
  // --- End inActivateADUserData:

}
// --- End of AD-UsersDAO