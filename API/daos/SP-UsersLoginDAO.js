/**
* Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written by Hari <hari@ngstek.com>, Mar 2019
*/

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var SP_NotificationsDAO = require('./SP-NotificationsDAO');
var SP_ServiceProviders = require('../models/SP-ServiceProviders');
var SP_UsersVerifications = require('../models/SP-UsersVerifications');
var SP_Users = require('../models/SP-Users');
var EU_Users = require('../models/EU-Users');
var AD_Tickets = require('../models/AD-Tickets')
var AD_TicketsLifeCycle = require('../models/AD-TicketsLifeCycle')

module.exports = {
  // --- Begin supplierSignin: Code to handle supplier Login credentials
  supplierSignin: function(userID, reqBody, callback) {
    SP_Users.findOne({
      $or: [{ userAccount: userID }, { email: userID }, { mobileNumber: userID }],
      isDeleted: false
    }).populate('spServiceProviderId').exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-UserLoginDAO.js,'+
          ' at supplierSignin of User query:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        if(reqBody && reqBody.appType && reqBody.appType == 'Web App') {
          callback({ httpCode: 200, statusCode: '1000', result: resObj });
        } else {
          if(resObj.deviceNotifyToken === reqBody.deviceToken) {
            callback({ httpCode: 200, statusCode: '1000', result: resObj });
          } else {
            var currentUTC = CommonService.currentUTCObj();
            var updateObj = { 
              deviceNotifyToken: reqBody.deviceToken,
              updatedBy: 'superadmin',
              updatedAt: currentUTC.currentUTCDateTimeNumber,
              updatedOn: currentUTC.currentUTCDateTimeString
            };
            SP_Users.findOneAndUpdate({'_id': resObj._id, 'isDeleted': false}, {$set: updateObj}, {new: true})
            .populate('spServiceProviderId')
            .exec(function(upError, upResObj) {
              if(upError) {
                logger.error('There was an Un-known Error occured in daos/SP-UserLoginDAO.js,'+
                ' at supplierSignin of User query:', upError);
              callback({ httpCode: 500, statusCode: '9999', result: {} });
              } else if(upResObj && upResObj._id) {
                AuditingInfoDAO.spAuditing({iss: upResObj._id, ua: upResObj.userAccount, un: upResObj.name}, 'Update', {name: config.collectionSPUsers, id: upResObj._id, value: upResObj.userAccount }, updateObj);
                callback({ httpCode: 200, statusCode: '1000', result: upResObj });
              } else {
                callback({ httpCode: 200, statusCode: '1000', result: resObj });
              }
            });
          }
        }
      } else {
        callback({ httpCode: 400, statusCode: '9950', result: {} });
      }
    });
  },
  // --- END supplierSignin: Code to handle supplier Login credentials


  // --- Begin postSPUserData:
  postSPUserLogsData: function(userLogObj, callback) {
    userLogObj.save(function(error, resObj) {
      AuditingInfoDAO.spAuditing({iss: resObj.spUserId, ua: 'superadmin', un: resObj.spName}, 'Create', {name: config.collectionSPUsersLogs, id: resObj._id, value: resObj.macAddress }, resObj);
    });
  },

  // --- Begin isSupplierMobileNumVerified: Code to handle supplier mobile # verified
  isSupplierMobileNumVerified: function(mobileNumber, callback) {
    SP_UsersVerifications.findOne({ mbnSign: mobileNumber, isDeleted: false }).
    exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-UsersLoginDAO.js,'+
          ' at isSupplierMobileNumVerified:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        SP_ServiceProviders.findOne({ contactNumber: mobileNumber, isDeleted: false }, function(error, spResObj) {
          if(error) {
            callback({ httpCode: 400, statusCode: '9997', result: resObj });
          } else if(spResObj && spResObj._id) {
            callback({ httpCode: 200, statusCode: '9989', result: resObj });
          } else {
            callback({ httpCode: 200, statusCode: '9956', result: resObj });
          }
        });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: resObj });
      }
    });
  },
  // --- END isSupplierMobileNumVerified: Code to handle supplier mobile # verified

  // --- Begin: isSupplierEmailVerified
  isSupplierEmailVerified: function(email, callback) {
    SP_UsersVerifications.findOne({ emailSign: email, isDeleted: false }).
    exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-UsersLoginDAO.js,'+
          ' at isSupplierEmailVerified:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        SP_ServiceProviders.findOne({ contactEmail: email, isDeleted: false }, function(error, spResObj) {
          if(error) {
            callback({ httpCode: 200, statusCode: '9957', result: resObj });
          } else if(spResObj && spResObj._id) {
            callback({ httpCode: 200, statusCode: '9988', result: resObj });
          } else {
            callback({ httpCode: 200, statusCode: '9957', result: resObj });
          }
        });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: resObj });
      }
    });
  },
  // --- END: isSupplierEmailVerified

  // --- Begin: supplierSignupValidateUserID
  supplierSignupValidateUserID: function(userID, callback) {
    SP_Users.findOne({ userAccount: userID, isDeleted: false }).
    exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-UsersLoginDAO.js,'+
          ' at supplierSignupValidateUserID:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '9987', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: resObj });
      }
    });
  },
  // --- END: supplierSignupValidateUserID

  // --- Begin: getUserData
  getUserData: function(userData, tokendecodeddata, callback) {
      EU_Users.findOne({
        $or: [{ mobileNumber: userData }, { email: userData }],
        isDeleted: false
       }).
      exec(function(error, resObj) {
        if(error) {
          logger.error('There was an Un-known Error occured in daos/SP-UsersLoginDAO.js,'+
            ' at getUserData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if(resObj && resObj._id) {
          var email = resObj.email;
          var mobileNumber = resObj.mobileNumber;
          var decObj = {
            mobileNumber: !mobileNumber.includes('@') ? mobileNumber : '',
            email: email.includes('@') ? email : ''
          };
          var resultObj = JSON.parse((JSON.stringify(resObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
          callback({ httpCode: 200, statusCode: '9987', result: resultObj });
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: resObj });
        }
      });
    },
  // --- END: getUserData

  // --- Begin: updateSupplierSignupUV
  updateSupplierSignupUV: function(uvObj, uvId, callback) {
    SP_UsersVerifications.updateOne({ _id: uvId }, { $set: uvObj }, function(userError, uvResObj) {
      if(userError) {
        logger.error('There was an Un-known Error occured in daos/SP-UserLoginDAO.js,'+
          ' at updateSupplierSignupUV:', userError);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(uvResObj && uvResObj.nModified == 1) {
        AuditingInfoDAO.spAuditing({}, 'Update', {name: config.collectionSPUsersVerifications, id: uvId, value: 'User Verification' }, uvObj);
        callback({ httpCode: 200, statusCode: '0000', result: {} });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- END: updateSupplierSignupUV

  // --- Begin: setSupplierSignupUV
  setSupplierSignupUV: function(uvObj, callback) {
    uvObj.save(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-UserLoginDAO.js,'+
          ' at setSupplierSignupUV:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        AuditingInfoDAO.spAuditing({}, 'Create', {name: config.collectionSPUsersVerifications, id: resObj._id, value: 'User Verification' }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  },
  // --- End: setSupplierSignupUV

  // --- Begin : getUserVerificationData
  getUserVerificationData: function(tokenDecodedData, callback) {
    SP_UsersVerifications.findOne({ _id: tokenDecodedData._id, isDeleted: false }).
    exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/SP-UserLoginDAO.js,'+
          ' at getUserVerificationData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // --- End : getUserVerificationData

  // --- Begin : isSupplierExist
  isSupplierExist: function(userID, email, mobileNumber, callback) {
    var spQuery = {
      $or: [{ contactNumber: mobileNumber }, { contactEmail: email }],
      isDeleted: false
    };
    SP_ServiceProviders.findOne(spQuery, function(spError, spResObj) {
      if(spError) {
        logger.error('There was an Un-known Error occured in daos/SP-UserLoginDAO.js,'+
          ' at isSupplierExist - SP_ServiceProviders:', spError);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(spResObj && spResObj._id) {
        callback({ httpCode: 400, statusCode: '1003', result: {} });
      } else {
        callback({ httpCode: 200, statusCode: '0000', result: {} });
      }
    });
  },
  // --- End : isSupplierExist

  // --- Begin : setServiceProviderData
  setServiceProviderData: function(spData, callback) {
    spData.save(function(error, resObj) {
      if(error) {
        if(error.errmsg.indexOf('contactNumber_1') > 0) {
          logger.error('There was an Uniqueness(contactNumber) Error occured in daos/SP-UserLoginDAO.js,'+
          ' at setEndUserSignupData:', error);
          callback({ httpCode: 400, statusCode: '9956', result: {} });
        } else if(error.errmsg.indexOf('contactEmail_1') > 0) {
          logger.error('There was an Uniqueness(contactEmail) Error occured in daos/SP-UserLoginDAO.js,'+
          ' at setEndUserSignupData:', error);
          callback({ httpCode: 400, statusCode: '9957', result: {} });
        } else {
          logger.error('There was an Un-known Error occured in daos/SP-UserLoginDAO.js at SP-UserLoginDAO:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } else if(resObj && resObj._id) {
        AuditingInfoDAO.spAuditing({}, 'Create', {name: config.collectionSPServiceProviders, id: resObj._id, value: resObj.serviceProvider }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  },
  // --- End : setServiceProviderData  

  // --- Begin : setServiceProviderUserSignupData
  setServiceProviderUserSignupData: function(spUserData, currentUTC, callback) {
    spUserData.save(function(error, resObj) {
      if(error) {
        if(error.errmsg.indexOf('mobileNumber_1') > 0) {
          logger.error('There was an Uniqueness(mobileNumber) Error occured in daos/SP-UserLoginDAO.js,'+
            ' at setServiceProviderUserSignupData:', error);
          callback({ httpCode: 400, statusCode: '9956', result: {} });
        } else if(error.errmsg.indexOf('email_1') > 0) {
          logger.error('There was an Uniqueness(email) Error occured in daos/SP-UserLoginDAO.js,'+
            ' at setServiceProviderUserSignupData:', error);
          callback({ httpCode: 400, statusCode: '9957', result: {} });
        } else if(error.errmsg.indexOf('userAccount_1') > 0) {
          logger.error('There was an Uniqueness(userAccount_1) Error occured in daos/SP-UserLoginDAO.js,'+
            ' at setServiceProviderUserSignupData:', error);
          callback({ httpCode: 400, statusCode: '9959', result: {} });
        } else {
          logger.error('There was an Un-known Error occured in daos/SP-UserLoginDAO.js setServiceProviderUserSignupData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } else if(resObj && resObj._id) {
        AuditingInfoDAO.spAuditing({}, 'Create', {name: config.collectionSPUsers, id: resObj._id, value: resObj.userAccount }, resObj);
        if(resObj) {
          var ntyObj = {
            spId: resObj.spServiceProviderId,
            sp: resObj.spServiceProvider,
            spUserId: resObj._id,
            spName: resObj.name
          };
          let notificationObj = {title: 'Welcome To AM to PM', titleBody: 'Hi' + ' ' + resObj.name + ' ' + 'Thanks for choosing us' };
          let ntyUserObj = {recordId: resObj._id, type:'User Create', contact: resObj.mobileNumber};
          SP_NotificationsDAO.setSupplierNotificationTokenData(ntyObj, resObj, ntyUserObj, notificationObj, resObj.mobileNumber, function(notifyResObj) {});
        }
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  },
  // --- End : setServiceProviderUserSignupData

  // --- Begin: postOnBoardingTicket
  postOnBoardingTicket: function (onBoardingServiceProviderObj, body, callback) {
    SP_ServiceProviders.findOne(
      {
        '$or': [
          { contactNumber: body.contactNumber, status: 'Inactive' },
          { contactEmail: body.contactEmail, status: 'Inactive' }
        ]
      }).exec(function (err, data) {
        if (err) {
          logger.error('There was an Un-known Error occured in daos/SP-UserLoginDAO.js, - postOnBoardingTicket:', err);
          callback(err, { httpCode: 500, statusCode: '9999', result: {} });
        } else if (data && data._id) {
          callback(err, { httpCode: 200, statusCode: '9951', result: {} });
        } else {
          onBoardingServiceProviderObj.save(function (error, resObj) {
            if (error) {
              if (error.errmsg.indexOf('contactNumber_1') > 0) {
                logger.error('There was an Uniqueness(mobileNumber) Error occured in daos/SP-UserLoginDAO.js,' +
                  ' at setServiceProviderUserSignupData:', error);
                callback(error, { httpCode: 400, statusCode: '9956', result: {} });
              } else if (error.errmsg.indexOf('contactEmail_1') > 0) {
                logger.error('There was an Uniqueness(email) Error occured in daos/SP-UserLoginDAO.js,' +
                  ' at setServiceProviderUserSignupData:', error);
                callback(error, { httpCode: 400, statusCode: '9957', result: {} });
              } else {
                logger.error('There was an Un-known Error occured in daos/SP-UserLoginDAO.js,' +
                  ' at setServiceProviderUserSignupData:', error);
                callback(error, { httpCode: 500, statusCode: '9999', result: {} });
              }
            } else if (resObj && resObj._id) {
              spOnboardingTicket(body, resObj, function (ticketObj) {
                if (ticketObj.result && ticketObj.result._id) {
                  callback(error,{httpCode: 200, statusCode: '0000', result: ticketObj.result});
                } else {
                  callback(error, {httpCode: 500, statusCode: '9999', result: {}});
                }
              });
            } else {
              logger.error('There was an Error occured in daos/SP-UsersLoginDAO.js at get postOnBoardingTicket');

            }
          })
        }
      })
  },
  // --- END: postOnBoardingTicket
}

/**
 * @param {object} body object
 * @param {function} callback is a callback function
 */
function spOnboardingTicket(body, resObj, callback) {
  var currentUTC = CommonService.currentUTCObj();
  let onBoardingTicketData = {
    spServiceProviderId: resObj._id,
    spServiceProvider: resObj.serviceProvider,
    reqMobileNumber: body.contactNumber,
    reqEmail: body.contactEmail,
    spName: body.contactPerson,
    ticketNumType: 'OBT19',
    assignStatus: 'Unassigned',
    ticketTitle: 'Onboarding',
    ticketDescription: 'Need to complete OnBoarding process',
    // ticketNumber: '123456',
    ticketGroup: 'Marketing',
    ticketTag: 'Onboarding',
    ticketPriority: 'High',
    ticketStatus: 'New',
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdBy: 'superadmin',
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedBy: 'superadmin',
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedOn: currentUTC.currentUTCDateTimeString
  }
  let onBoardingTicketObj = new AD_Tickets(onBoardingTicketData)
  onBoardingTicketObj.save(function(error, TicketresObj) {
    if (error) {
      callback({ httpCode: 400, statusCode: '9999', result: {} });
    } else if (resObj && resObj._id) {
        spOnboardingTicketLifeCycle(body, resObj, TicketresObj, function(ticketObj) {
          if(ticketObj.result && ticketObj.result._id) {
            callback( { httpCode: 200, statusCode: '0000', result: ticketObj.result })
          } else {
            callback({ httpCode: 400, statusCode: '9999', result: {} });
          }
        })
    } else {
      callback({ httpCode: 400, statusCode: '9999', result: {} });
    }
  })
}

/**
 * @param {object} body object
 * @param {function} callback is a callback function
 */
function spOnboardingTicketLifeCycle(body, resObj, TicketresObj, callback) {
  var currentUTC = CommonService.currentUTCObj();
  let onBoardingticketLifeCycleData = {
    adTicketId: TicketresObj._id,
    spServiceProviderId: resObj._id,
    spServiceProvider: resObj.serviceProvider,
    reqMobileNumber: body.contactNumber,
    reqEmail: body.contactEmail,
    spName: body.contactPerson,
    ticketNumType: TicketresObj.ticketNumType,
    assignStatus: 'Unassigned',
    ticketTitle: 'Onboarding',
    ticketDescription: 'Need to complete OnBoarding process',
    ticketNumber: TicketresObj.ticketNumber,
    ticketGroup: 'Marketing',
    ticketTag: 'Onboarding',
    ticketPriority: 'High',
    ticketStatus: 'New',
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdBy: 'superadmin',
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedBy: 'superadmin',
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedOn: currentUTC.currentUTCDateTimeString
  }
  let onBoardingTicketObj = new AD_TicketsLifeCycle(onBoardingticketLifeCycleData)
  onBoardingTicketObj.save(function(error, TicketLifeCycleresObj) {
    if (error) {
      callback({ httpCode: 400, statusCode: '9999', result: {} });
    } else if (TicketLifeCycleresObj && TicketLifeCycleresObj._id) {
      callback({ httpCode: 200, statusCode: '0000', result: TicketLifeCycleresObj })
    } else {
      callback({ httpCode: 400, statusCode: '9999', result: {} });
    }
  })
}