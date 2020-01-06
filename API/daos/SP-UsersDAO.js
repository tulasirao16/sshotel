/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var SP_Users = require('../models/SP-Users');
var SP_NotificationsDAO = require('./SP-NotificationsDAO');
var CommonService = require('../services/CommonService');

// --- Begining of SP-UsersDAO
module.exports = {

  // --- Begin getSPUsersListingData:
  getSPUsersListingData: function(pageNum, searchString, tokenDecodedData, callback) {
    var query = {
      'spServiceProviderId': tokenDecodedData.uspid, 
      'isDeleted': false,
      '$or': [
        { 'name': { $regex: searchString, $options: 'i' } },
        { 'firstName': { $regex: searchString, $options: 'i' } },
        { 'lastName': { $regex: searchString, $options: 'i' } },
        { 'email': { $regex: searchString, $options: 'i' } },
        { 'mobileNumber': { $regex: searchString, $options: 'i' } },
        { 'spServiceProvider': { $regex: searchString, $options: 'i' } },
        { 'displayName': { $regex: searchString, $options: 'i' } },
        { 'userAccount': { $regex: searchString, $options: 'i' } },
        { 'userStatus': { $regex: searchString, $options: 'i' } },
        { 'userRole': { $regex: searchString, $options: 'i' } },
        { 'email': { $regex: searchString, $options: 'i' } }
      ]
    };
    SP_Users.find(query)
    .skip((pageNum - 1) * 20)
    .limit(20)
    .sort({ 'createdAt': -1 }).exec(function(error, resultArray) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-UsersDAO.js, at getSPUsersListingData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resultArray && resultArray.length > 0) {
        var userArray = [];
        resultArray.forEach(function (userObj) {
          var spUserObj = userObj;
          var decObj = {
            mobileNumber: userObj.mobileNumber,
            email: userObj.email,
            alternateContactNumber: userObj.alternateContactNumber ? CommonService.decrypt(userObj.alternateContactNumber) : '',
            alternateEmail: userObj.alternateEmail ? CommonService.decrypt(userObj.alternateEmail) : '',
          };
          var resultObj = JSON.parse((JSON.stringify(spUserObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
          userArray.push(resultObj)
        });
        SP_Users.find(query).exec(function(errorCount, resultCount) {
          if(errorCount) {
            logger.error('There was an Un-known Error occured in daos/SP-UsersDAO.js, at getSPUsersListingData:', errorCount);
            var resultObj = { totalDocs: userArray.length, userData: userArray };
            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
          } else if(resultCount) {
            var resultObj = { totalDocs: resultCount.length, userData: userArray };
            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
          } else {
            var resultObj = { totalDocs: userArray.length, userData: userArray };
            callback({ httpCode: 200, statusCode: '0000', result: resultObj });
          }
        });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // --- End getSPUsersListingData:

  // --- Begin postSPUserData:
  postSPUserData: function(userData, tokenDecodedData, callback) {
    userData.save(function(error, resObj) {
      if(error) {
        if(error.errmsg.indexOf('mobileNumber_1') > 0) {
          logger.error('There was an Uniqueness(mobileNumber) Error occured in daos/SP-UsersDAO.js,'+
          ' at postSPUserData:', error);
          callback({ httpCode: 400, statusCode: '9989', result: {}});
        } else if(error.errmsg.indexOf('email_1') > 0) {
            logger.error('There was an Uniqueness(email) Error occured in daos/SP-UsersDAO.js,'+
            ' at postSPUserData:', error);
            callback({ httpCode: 400, statusCode: '9988', result: {}});
        } else if(error.errmsg.indexOf('userAccount_1') > 0) {
            logger.error('There was an Uniqueness(userAccount) Error occured in daos/SP-UsersDAO.js,'+
            ' at postSPUserData:', error);
            callback({ httpCode: 400, statusCode: '9987', result: {}});
        } else {
            logger.error('There was an Un-known Error occured in daos/SP-UsersDAO.js,'+
            ' at postSPUserData:', error);
            callback({ httpCode: 500, statusCode: '9999', result: {}});
        }
      } else if(resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', {name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount }, resObj);
        var spUserObj = resObj;
        var decObj = {
          mobileNumber: resObj.mobileNumber,
          email: resObj.email,
          alternateContactNumber: resObj.alternateContactNumber ? CommonService.decrypt(resObj.alternateContactNumber) : '',
          alternateEmail: resObj.alternateEmail ? CommonService.decrypt(resObj.alternateEmail) : '',
        };
        var resultObj = JSON.parse((JSON.stringify(spUserObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
        if(tokenDecodedData) {
          var ntyObj = {
            spId: tokenDecodedData.uspid,
            sp: tokenDecodedData.usp,
            spUserId: tokenDecodedData.iss,
            spName: tokenDecodedData.un
          };
          // var ntyObj = {
          //   spId: tokenDecodedData.iss,
          //   name: tokenDecodedData.un
          // };
          let notificationObj = {title: 'Welcome To AM to PM', titleBody: 'You have Created a new User' + ' ' + resObj.name };
          let ntyUserObj = {recordId: resObj._id, type:'User Create', contact: resObj.mobileNumber};
          SP_NotificationsDAO.setSupplierNotificationTokenData(ntyObj, tokenDecodedData, ntyUserObj, notificationObj, resObj.mobileNumber, function(notifyResObj) {});
        }
        callback({ httpCode: 200, statusCode: '0000', result: resultObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End postSPUserData:

  // --- Begin verifyUniqueness:
  verifyUniqueness: function(body, tokenDecodedData, callback) {
    var spUserQuery = {
      spServiceProviderId: tokenDecodedData.uspid,
      $or: [{ mobileNumber: body.mobileNumber }, { email: body.email }],
      isDeleted: false
    };
    SP_Users.find({spServiceProviderId: tokenDecodedData.uspid, mobileNumber: body.mobileNumber, isDeleted: false}).exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-UsersDAO.js, at verifyUniqueness:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj.length > 0) {
        callback({ httpCode: 400, statusCode: '9989', result: resObj });
      } else {
        SP_Users.find({spServiceProviderId: tokenDecodedData.uspid, email: body.email, isDeleted: false}).exec(function(error1, resultObj1) {
          if(error1) {
            logger.error('There was an Un-known Error occured in daos/SP-UsersDAO.js, at verifyUniqueness:', error1);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if(resultObj1 && resultObj1.length) {
            callback({ httpCode: 400, statusCode: '9988', result: resultObj1 });
          } else {
            callback({ httpCode: 200, statusCode: '0000', result: {} });
          }
        });
      }
    });
  },
  // --- End verifyUniqueness:

  // --- Begin updateSPUserData:
  updateSPUserData: function(body, decodedTokenData, updateUserObj, callback) {
    SP_Users.findOneAndUpdate({_id: body._id, isDeleted: false }, {$set: updateUserObj}, function(error, resObj) {
      if(error) {
        if(error.errmsg.indexOf('mobileNumber_1') > 0) {
          logger.error('There was an Uniqueness(mobileNumber) Error occured in daos/SP-UsersDAO.js,'+
          ' at updateSPUserData:', error);
          callback({ httpCode: 400, statusCode: '9989', result: {}});
        } else if(error.errmsg.indexOf('email_1') > 0) {
            logger.error('There was an Uniqueness(email) Error occured in daos/SP-UsersDAO.js,'+
            ' at updateSPUserData:', error);
            callback({ httpCode: 400, statusCode: '9988', result: {}});
        } else if(error.errmsg.indexOf('userAccount_1') > 0) {
            logger.error('There was an Uniqueness(userAccount) Error occured in daos/SP-UsersDAO.js,'+
            ' at updateSPUserData:', error);
            callback({ httpCode: 400, statusCode: '9987', result: {}});
        } else {
            logger.error('There was an Un-known Error occured in daos/SP-UsersDAO.js,'+
            ' at updateSPUserData:', error);
            callback({ httpCode: 500, statusCode: '9999', result: {}});
        }
      } else if(resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount }, updateUserObj);
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({httpCode: 400, statusCode: '9992', result: {}});
      }
    });
  },
  // --- End updateSPUserData:

  // --- Begin activateSPUserData:
  activateSPUserData: function(recordID, updateUserObj, decodedTokenData, callback) {
    SP_Users.findOneAndUpdate({_id: recordID, isDeleted: false }, {$set: updateUserObj}, {new: true}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-UsersDAO.js,'+
        ' at activateSPUserData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount }, updateUserObj);
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({httpCode: 400, statusCode: '9992', result: {}});
      }
    });
  },
  // --- End activateSPUserData:

  // --- Begin inActivateSPUserData:
  inActivateSPUserData: function(recordID, updateUserObj, decodedTokenData, callback) {
    SP_Users.findOneAndUpdate({_id: recordID, isDeleted: false }, {$set: updateUserObj}, {new: true}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-UsersDAO.js,'+
        ' at inActivateSPUserData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount }, updateUserObj);
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({httpCode: 400, statusCode: '9992', result: {}});
      }
    });
  },
  // --- End inActivateSPUserData:

  // --- Begin deleteSPUserData:
  deleteSPUserData: function(recordID, updateUserObj, decodedTokenData, callback) {
    SP_Users.findOneAndUpdate({_id: recordID, isDeleted: false }, {$set: updateUserObj}, {new: true}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-UsersDAO.js,'+
        ' at deleteSPUserData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.spAuditing(decodedTokenData, 'Update', {name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount }, updateUserObj);
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({httpCode: 400, statusCode: '9992', result: {}});
      }
    });
  },

  // --- End deleteSPUserData:
  getSPUserData: function(recordId, tokenDecodedData, callback) {
    var query = {
      '_id': recordId,
      'spServiceProviderId': tokenDecodedData.uspid
    }
    SP_Users.findOne(query, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-UsersDAO.js,'+
        ' at getSPUserData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj._id) {
        var spUserObj = resObj;
        var decObj = {
          mobileNumber: resObj.mobileNumber,
          email: resObj.email,
          alternateContactNumber: resObj.alternateContactNumber ? CommonService.decrypt(resObj.alternateContactNumber) : '',
          alternateEmail: resObj.alternateEmail ? CommonService.decrypt(resObj.alternateEmail) : '',
        };
        var resultObj = JSON.parse((JSON.stringify(spUserObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
        callback({httpCode: 200, statusCode: '0000', result: resultObj});
      } else {
        callback({httpCode: 400, statusCode: '9997', result: {}});
      }
    })
  },

  updateSpPassword: function (tokenDecodedData, updateSPPasswordObj, callback) {
    var query = { _id: tokenDecodedData._id, isDeleted: false };
    SP_Users.findOneAndUpdate(query, { $set: updateSPPasswordObj }, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-Known Error occured in daos/SP-UsersDAO.js.js,'+
          ' at updateSpPassword:', err);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing({iss: resObj._id, ua: resObj.userAccount, un: resObj.name}, 'Update', {name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount}, updateSPPasswordObj);
        callback({ httpCode: 200, statusCode: '1012', result: {} });
      } else {
        callback({ httpCode: 400, statusCode: '9985', result: {} });
      }
    });
  }
};
// --- End of SP-UsersDAO
