/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var moment = require('moment');
var jwt = require('jwt-simple');
var mail = require('../config/mail');
var sendSMS = require('../config/sendSMS');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var SP_Users = require('../models/SP-Users');
var SP_NotificationsDAO = require('./SP-NotificationsDAO');
var CommonService = require('../services/CommonService');
var SP_Notifications = require('../models/SP-Notifications');
var SP_ServiceProviders = require('../models/SP-ServiceProviders');

// --- Begining of AD-HostUsersDAO
module.exports = {

  // --- Begin getADHostUsersListingData:
  getADHostUsersListingData: function (hostId, pageNum, searchString, tokenDecodedData, callback) {
    var query = {
      'spServiceProviderId': hostId,
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
        { 'userRole': { $regex: searchString, $options: 'i' } }
      ]
    };
    SP_Users.find(query)
      .skip((pageNum - 1) * 20)
      .limit(20)
      .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/AD-HostUsersDAO.js,' +
            'at getADHostUsersListingData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resultArray && resultArray.length > 0) {
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
          SP_Users.countDocuments(query).exec(function (errorCount, resultCount) {
            if (errorCount) {
              logger.error('There was an Un-known Error occured in daos/AD-HostUsersDAO.js,' +
                ' at getADHostUsersListingData of countDocuments:', errorCount);
              var resultObj = { totalDocs: resultArray.length, userData: userArray };
              callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            } else if (resultCount) {
              var resultObj = { totalDocs: resultCount, userData: userArray };
              callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            } else {
              var resultObj = { totalDocs: resultArray.length, userData: userArray };
              callback({ httpCode: 200, statusCode: '0000', result: resultObj });
            }
          });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },
  // --- End getADHostUsersListingData

  // --- Begin  updateADHostUsersChangePassword:
  updateADHostUsersChangePassword: function (userID, newPassword, tokenDecodedData, callback) {
    var query = { _id: userID, isDeleted: false };
    SP_Users.findOneAndUpdate(query, { $set: newPassword }, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-Known Error occured in daos/AD-HostUsersDAO.js,' +
          ' at updateADHostUsersChangePassword:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '1012', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9985', result: {} });
      }
    });
  },
  // --- End updateADHostUsersChangePassword:

  // --- Begin updateADHostUserData:
  updateADHostUserData: function (body, decodedTokenData, updateUserObj, callback) {
    SP_Users.findOneAndUpdate({ _id: body._id, isDeleted: false }, { $set: updateUserObj }, function (error, resObj) {
      if (error) {
        if (error.errmsg.indexOf('mobileNumber_1') > 0) {
          logger.error('There was an Uniqueness(mobileNumber) Error occured in daos/AD-HostUsersDAO.js,' +
            ' at updateADHostUserData:', error);
          callback({ httpCode: 400, statusCode: '9989', result: {} });
        } else if (error.errmsg.indexOf('email_1') > 0) {
          logger.error('There was an Uniqueness(email) Error occured in daos/AD-HostUsersDAO.js,' +
            ' at updateADHostUserData:', error);
          callback({ httpCode: 400, statusCode: '9988', result: {} });
        } else if (error.errmsg.indexOf('userAccount_1') > 0) {
          logger.error('There was an Uniqueness(userAccount) Error occured in daos/AD-HostUsersDAO.js,' +
            ' at updateADHostUserData:', error);
          callback({ httpCode: 400, statusCode: '9987', result: {} });
        } else {
          logger.error('There was an Un-known Error occured in daos/AD-HostUsersDAO.js,' +
            ' at updateADHostUserData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } else if (resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', { name: config.collectionADUsers, id: resObj._id, value: resObj.userAccount }, updateUserObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End updateADHostUserData:

  // --- Begin postADHostUserData:
  postADHostUserData: function (userData, tokenDecodedData, callback) {
    userData.save(function (error, resObj) {
      if (error) {
        if (error.errmsg.indexOf('mobileNumber_1') > 0) {
          logger.error('There was an Uniqueness(mobileNumber) Error occured in daos/AD-HostUsersDAO.js,' +
            ' at postADHostUserData:', error);
          callback({ httpCode: 400, statusCode: '9989', result: {} });
        } else if (error.errmsg.indexOf('email_1') > 0) {
          logger.error('There was an Uniqueness(email) Error occured in daos/AD-HostUsersDAO.js,' +
            ' at postADHostUserData:', error);
          callback({ httpCode: 400, statusCode: '9988', result: {} });
        } else if (error.errmsg.indexOf('userAccount_1') > 0) {
          logger.error('There was an Uniqueness(userAccount) Error occured in daos/AD-HostUsersDAO.js,' +
            ' at postADHostUserData:', error);
          callback({ httpCode: 400, statusCode: '9987', result: {} });
        } else {
          logger.error('There was an Un-known Error occured in daos/AD-HostUsersDAO.js,' +
            ' at postADHostUserData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } else if (resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Create', { name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount }, resObj);
        var spUserObj = resObj;
        var decObj = {
          mobileNumber: resObj.mobileNumber,
          email: resObj.email,
          alternateContactNumber: resObj.alternateContactNumber ? CommonService.decrypt(resObj.alternateContactNumber) : '',
          alternateEmail: resObj.alternateEmail ? CommonService.decrypt(resObj.alternateEmail) : '',
        };
        var resultObj = JSON.parse((JSON.stringify(spUserObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
        if (tokenDecodedData) {
          var ntyObj = {
            spId: tokenDecodedData.iss,
            name: tokenDecodedData.un
          };
          let notificationObj = { title: 'Welcome To AM to PM', titleBody: 'You have Created a new User' + ' ' + resObj.name };
          let ntyUserObj = { recordId: resObj._id, type: 'User Create', contact: resObj.mobileNumber };
          SP_NotificationsDAO.setSupplierNotificationTokenData(ntyObj, tokenDecodedData, ntyUserObj, notificationObj, resObj.mobileNumber, function (notifyResObj) { });
        }
        callback({ httpCode: 200, statusCode: '0000', result: resultObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End postADHostUserData:

  // --- Begin updateADHostUserStatus:
  updateADHostUserStatus: function (upObj, recordId, tokenDecodedData, callback) {
    var query = { _id: recordId, isDeleted: false };
    SP_Users.findOneAndUpdate(query, { $set: upObj }, { new: true }, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-konwn Error occured in daos/AD-HostUsersDAO.js, at updateADHostUserStatus:' + error);
        callback({ httpCode: 400, statusCode: '9900', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', { name: config.collectionSpUsers, id: resObj._id, value: resObj.userAccount }, upObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End updateADHostUserStatus:

  // --- Begin deleteADHostUserData:
  deleteADHostUserData: function (recordID, updateUserObj, decodedTokenData, callback) {
    SP_Users.findOneAndUpdate({ _id: recordID, isDeleted: false }, { $set: updateUserObj }, { new: true }, function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/AD-HostUsersDAO.js,' +
          ' at deleteADHostUserData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj.spServiceProviderId) {
        AuditingInfoDAO.adAuditing(decodedTokenData, 'Update', { name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount }, updateUserObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End deleteADHostUserData:

  // BEGIN : getHostUserNotifications
  getHostUserNotifications: function (hostId, pageNumber,userId, searchString, tokenDecodedData, callback) {
    if (userId) {
    var query = {
      'spServiceProviderId': hostId,
      '_id':userId,
      'isDeleted': false,
      '$or': [
        { 'notificationTitle': { $regex: searchString, $options: 'i' } },
        { 'notificationMessage': { $regex: searchString, $options: 'i' } },
        { 'status': { $regex: searchString, $options: 'i' } }
      ]
    };
  } else {
    var query = {
      'spServiceProviderId': hostId,
      // '_id':userId,
      'isDeleted': false,
      '$or': [
        { 'notificationTitle': { $regex: searchString, $options: 'i' } },
        { 'notificationMessage': { $regex: searchString, $options: 'i' } },
        { 'status': { $regex: searchString, $options: 'i' } }
      ]
    };
  }
    SP_Notifications.find(query)
      .populate('spUserId')
      .sort({ 'createdAt': -1 })
      .skip((pageNumber - 1) * 10)
      .limit(10)
      .exec(function (error, resObj) {
        if (error) {
          logger.error('There was an Error occured in daos/AD-HostUsersDAO.js at getHostUserNotifications', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj.length > 0) {
          SP_Notifications.countDocuments(query).
            exec(function (errorCount, resultCount) {
              if (errorCount) {
                logger.error('There was an Un-known Error occured in daos/AD-HostUsersDAO.js, at getHostUserNotifications:', errorCount);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
              } else if (resultCount) {
                var resultObj = { totalDocs: resultCount, notificationsData: resObj };
                callback({ httpCode: 200, statusCode: '0000', result: resultObj });
              } else {
                callback({ httpCode: 400, statusCode: '9997', result: {} });
              }
            });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
      });
  },
  // END : getHostUserNotifications

  postADSPUserData: function (userData, tokenDecodedData, res, reqBody, callback) {
    userData.save(function (error, resObj) {
      if (error) {
        if (error.errmsg.indexOf('mobileNumber_1') > 0) {
          logger.error('There was an Uniqueness(mobileNumber) Error occured in daos/AD-HostUsersDAO.js,' +
            ' at postSPUserData:', error);
          callback({ httpCode: 400, statusCode: '9989', result: {} });
        } else if (error.errmsg.indexOf('email_1') > 0) {
          logger.error('There was an Uniqueness(email) Error occured in daos/AD-HostUsersDAO.js,' +
            ' at postSPUserData:', error);
          callback({ httpCode: 400, statusCode: '9988', result: {} });
        } else if (error.errmsg.indexOf('userAccount_1') > 0) {
          logger.error('There was an Uniqueness(userAccount) Error occured in daos/AD-HostUsersDAO.js,' +
            ' at postSPUserData:', error);
          callback({ httpCode: 400, statusCode: '9987', result: {} });
        } else {
          logger.error('There was an Un-known Error occured in daos/AD-HostUsersDAO.js,' +
            ' at postSPUserData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.spAuditing(tokenDecodedData, 'Create', { name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount }, resObj);
        SP_ServiceProviders.findOneAndUpdate({ '_id': reqBody.spServiceProviderId }, { $set: {'status': 'Active', appPercentage: reqBody.spPercentage} }, { new: true }, function (spError, spResObj) {})
        var spUserObj = resObj;
        var decObj = {
          mobileNumber: resObj.mobileNumber,
          email: resObj.email,
          alternateContactNumber: resObj.alternateContactNumber ? CommonService.decrypt(resObj.alternateContactNumber) : '',
          alternateEmail: resObj.alternateEmail ? CommonService.decrypt(resObj.alternateEmail) : '',
        };
        var resultObj = JSON.parse((JSON.stringify(spUserObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
        let tokenGeneration = adSPUserTokenGeneration(resObj);
        if (tokenGeneration !== false) {
          // let tokenencryptGeneration = CommonService.encrypt(tokenGeneration)
          if (tokenGeneration) {
            spUserSetPasswordMobile(resultObj, tokenGeneration, function (mobData) {
              console.log({ mobData })
            })
            spUserSetPasswordEmail(resultObj, tokenGeneration, function (emailData) {
              console.log({ emailData })
            })
          }
        }
        callback({ httpCode: 200, statusCode: '0000', result: resultObj });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },

}
// --- Ending of AD-HostUsersDAO

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function adSPUserTokenGeneration(reqBodyObj) {
  var otpExpires = moment().add('24', 'hours').valueOf();
  var payload = {
    iss: reqBodyObj.mobileNumber ? reqBodyObj.mobileNumber : '',
    ise: reqBodyObj.email ? reqBodyObj.email : '',
    _id: reqBodyObj._id ? reqBodyObj._id : '',
    exp: otpExpires
  };
  var jwtToken = jwt.encode(payload, config.jwtSecretKey);
  let token = CommonService.encrypt(jwtToken);
  if (token) {
    return token;
  } else {
    return false
  }
}

/**
* @param {string} resultObj object
* @param {string} tokenencryptGeneration string
* @param {function} callback is a callback function
*/
function spUserSetPasswordMobile(resultObj, tokenencryptGeneration, callback) {
  if (resultObj.mobileNumber && tokenencryptGeneration) {
    var message = config.uiDomain + 'host/newuser/setpassword/' + tokenencryptGeneration;
    // // var message = config.uiDomain + config.smsLoginOTPMessage;
    // sendSMS.sendSMS(resultObj.mobileNumber, message, function(smsError, smsRes) {
    //   if(smsError) {
    //     logger.error('There was an Un-known Error in DAO/AD-HostUsersDAO.js at spUserSetPasswordMobile - sendSMS:', smsError);
    //     callback({httpCode: 500, statusCode: '9999', result: {}});
    //   } else {
    //     callback({httpCode: 200, statusCode: '0000', result: {'Message': 'Message Sent'}});
    //   }
    // });
    callback({ httpCode: 200, statusCode: '0000', result: { 'Message': message } });
  } else {
    logger.error('There was an Error in DAO/AD-HostUsersDAO.js at spUserSetPasswordMobile - spUserSetPasswordMobile: SMS Send failed');
    callback({ httpCode: 400, statusCode: '9994', result: { Message: 'Message Sent failed' } });
  }
}

/**
 * @param {string} resultObj string
 * @param {string} tokenencryptGeneration string
 * @param {function} callback is a callback function
 */
function spUserSetPasswordEmail(resultObj, tokenencryptGeneration, callback) {
  if (resultObj.email && tokenencryptGeneration) {
    var message = config.uiDomain + 'host/newuser/setpassword/' + tokenencryptGeneration;
    mail.sendEMail(resultObj.email, 'Set Password', message, function (error, resEObj) {
      if (error) {
        logger.error('There was an Un-known Error in DAO/AD-HostUsersDAO.js at  spUserSetPasswordEmail  email send failed');
        callback({ httpCode: 400, statusCode: '9953', result: {} });
      } else {
        callback({ httpCode: 200, statusCode: '0000', result: { 'Message': message } });
      }
    });
    callback({ httpCode: 200, statusCode: '0000', result: { 'Message': message } });
  } else {
    logger.error('There was an Un-known Error in DAO/AD-HostUsersDAO.js at  at spUserSetPasswordEmail');
    callback({ httpCode: 500, statusCode: '9999', result: {} });
  }
}
