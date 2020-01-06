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
var EU_Users = require('../models/EU-Users');
var EU_UsersVerifications = require('../models/EU-UsersVerifications');

// --- Begining of EU-UserLoginDAO
module.exports = {

  // --- Begin userLogin: Code to handle User Login credentials
  userLogin: function(userID, deviceToken, callback) {
    var currentUTC = CommonService.currentUTCObj();
    EU_Users.findOne({
      $or: [{ userAccount: userID }, { email: userID }, { mobileNumber: userID }],
      isDeleted: false
    }).exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,',
          ' at userLogin of User query:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        if(deviceToken !== null) {
          EU_Users.findOne({ 'deviceNotifyToken': deviceToken, 'isDeleted': false }, function(dtError, dtResObj) {
            if(dtError) {
              logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js at userLogin:', dtError);
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if(dtResObj && dtResObj.deviceNotifyToken) {
              var updateToken = {
                deviceNotifyToken: null,
                updatedAt: currentUTC.currentUTCDateTimeNumber,
                updatedBy: 'superadmin',
                updatedOn: currentUTC.currentUTCDateTimeString
              };
              EU_Users.updateOne({ '_id': dtResObj._id, 'isDeleted': false }, { $set: updateToken }, function(tError, tResObj) {
                if(tError) {
                  logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js at userLogin:', tError);
                  callback({ httpCode: 500, statusCode: '9999', result: {} });
                } else if(tResObj && tResObj.nModified == 1) {
                  AuditingInfoDAO.euAuditing({iss: dtResObj._id, ua: dtResObj.userAccount, un: dtResObj.name}, 'Update', { name: config.collectionEndUserUsers, id: dtResObj._id, value: dtResObj.userAccount }, updateToken);
                  var updateTokenObj = {
                    deviceNotifyToken: deviceToken,
                    updatedAt: currentUTC.currentUTCDateTimeNumber,
                    updatedBy: 'superadmin',
                    updatedOn: currentUTC.currentUTCDateTimeString
                  };
                  EU_Users.findOneAndUpdate({ '_id': resObj._id, 'isDeleted': false }, { $set: updateTokenObj }, { new: true }, function(upError, upResObj) {
                    if(upError) {
                      logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,',
                        ' at userLogin of User query:', upError);
                      callback({ httpCode: 500, statusCode: '9999', result: {} });
                    } else if(upResObj && upResObj._id) {
                      AuditingInfoDAO.euAuditing({iss: resObj._id, ua: resObj.userAccount, un: resObj.name}, 'Update', { name: config.collectionEndUserUsers, id: resObj._id, value: resObj.userAccount }, updateTokenObj);
                      callback({ httpCode: 200, statusCode: '1000', result: upResObj });
                    } else {
                      callback({ httpCode: 200, statusCode: '1000', result: resObj });
                    }
                  });
                } else {
                  callback({ httpCode: 200, statusCode: '1000', result: resObj });
                }
              });
            } else {
              callback({ httpCode: 200, statusCode: '1000', result: resObj });
            }
          });
        } else {
          callback({ httpCode: 200, statusCode: '1000', result: resObj });
        }
      } else {
        callback({ httpCode: 400, statusCode: '9950', result: {} });
      }
    });
  },
  // --- Begin : userVerifyLogin
  userVerifyLogin: function(mobileNumber, email, callback) {
    EU_UsersVerifications.findOne({ email: email, mobileNumber: mobileNumber, isDeleted: false })
      .exec(function(error, resObj) {
        if(error) {
          logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,',
            ' at userVerifyLogin of User query:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if(resObj && resObj._id) {
          callback({ httpCode: 200, statusCode: '1000', result: resObj });
        } else {
          EU_UsersVerifications.findOne({
            $or: [{ email: email }, { mobileNumber: mobileNumber }],
            isDeleted: false
          })
            .exec(function(VfyError, VfyResObj) {
              if(VfyError) {
                logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,',
                  ' at userVerifyLogin of User query:', VfyError);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
              } else if(VfyResObj && VfyResObj._id) {
                callback({ httpCode: 200, statusCode: '0000', result: VfyResObj });
              } else {
                callback({ httpCode: 400, statusCode: '9950', result: {} });
              }
            });
        }
      });
  },
  // --- End : userVerifyLogin

  // --- Begin : setMobileOtpToVerifications
  setMobileOtpToVerifications: function(verificationData, callback) {
    verificationData.save(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,' +
          ' at setMobileOtpToVerifications:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        AuditingInfoDAO.euAuditing({}, 'Create', { name: config.collectionEndUserUsersVerifications, id: resObj._id, value: resObj.verifyValue }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  },
  // --- End : setMobileOtpToVerifications

  // --- Begin : userMobileVerify
  userMobileVerify: function(mobileNumber, email, callback) {
    EU_UsersVerifications.findOne({ mobileNumber: mobileNumber, email: email, isDeleted: false }).exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,',
          ' at userMobileVerify:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // --- End : userMobileVerify

  // --- Begin : userMobile1Verify
  userMobile1Verify: function(verifySign, callback) {
    EU_UsersVerifications.findOne({ verifySign: verifySign, isDeleted: false }).exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,' +
          ' at userMobile1Verify:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // --- End : userMobile1Verify

  // --- Begin : updateEndUserSignupMobileOTP
  updateEndUserSignupMobileOTP: function(tokenDecodedData, currentUTC, callback) {
    var otpUObj = {
      mbnOtp: '',
      mbnOtpSalt: '',
      mbnVerifyStatus: 'Verified',
      updatedBy: 'superadmin',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    EU_UsersVerifications.findOneAndUpdate({ verifySign: tokenDecodedData.iss }, { $set: otpUObj }, {new: true}, function(userError, usrObj) {
      if(userError) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,',
          ' at updateEndUserSignupMobileOTP:', userError);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(usrObj && usrObj._id) {
        AuditingInfoDAO.euAuditing({}, 'Update', { name: config.collectionEndUserUsersVerifications, id: usrObj._id, value: usrObj.verifyValue }, otpUObj);
        callback({ httpCode: 200, statusCode: '1002', result: {} });
      } else {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js, at updateEndUserSignupMobileOTP:');
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End : updateEndUserSignupMobileOTP

  // --- Begin : userEmailVerify
  userEmailVerify: function(email, callback) {
    EU_UsersVerifications.findOne({ email: email, isDeleted: false }).exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,',
          ' at userEmailVerify:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // --- End : userEmailVerify

  // --- Begin : updateEndUserSignupEmailOTP
  updateEndUserSignupEmailOTP: function(tokenDecodedData, currentUTC, callback) {
    var otpUObj = {
      emailOtp: '',
      emailOtpSalt: '',
      emailVerifyStatus: 'Verified',
      updatedBy: 'superadmin',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    EU_UsersVerifications.findOneAndUpdate({ email: tokenDecodedData.ise }, { $set: otpUObj }, {new: true}, function(userError, usrObj) {
      if(userError) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,',
          ' at updateEndUserSignupEmailOTP:', userError);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(usrObj && usrObj._id) {
        AuditingInfoDAO.euAuditing({}, 'Update', { name: config.collectionEndUserUsersVerifications, id: usrObj._id, value: usrObj.verifyValue }, otpUObj);
        callback({ httpCode: 200, statusCode: '1002', result: {} });
      } else {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js, at updateEndUserSignupEmailOTP:');
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End : updateEndUserSignupEmailOTP

  // --- Begin : setEndUserSignupData
  setEndUserSignupData: function(userData, deviceToken, currentUTC, callback) {
    if(deviceToken && deviceToken !== 'null') {
      EU_Users.findOne({ 'deviceNotifyToken': deviceToken, 'isDeleted': false }, function(dtError, dtResObj) {
        if(dtError) {
          logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js at setEndUserSignupData:', dtError);
        } else if(dtResObj && dtResObj.deviceNotifyToken) {
          var updateToken = {
            deviceNotifyToken: 'null',
            updatedAt: currentUTC.currentUTCDateTimeNumber,
            updatedBy: 'superadmin',
            updatedOn: currentUTC.currentUTCDateTimeString
          };
          EU_Users.updateOne({ '_id': dtResObj._id, 'isDeleted': false }, { $set: updateToken }, function(uptError, uptResObj) {
            AuditingInfoDAO.euAuditing({iss: dtResObj._id, ua: dtResObj.userAccount, un: dtResObj.name}, 'Update', { name: config.collectionEndUserUsers, id: dtResObj._id, value: dtResObj.userAccount }, updateToken);
          });
        }
      });
      setSignUpData(userData, currentUTC, function(resObj) {
        callback(resObj);
      });
    } else {
      setSignUpData(userData, currentUTC, function(resObj) {
        callback(resObj);
      });
    }
  },
  // --- End : setEndUserSignupData

  // --- Begin : updateMobileVerification
  updateMobileVerification: function(ID, vfyObj, callback) {
    EU_UsersVerifications.findOneAndUpdate({ _id: ID }, { $set: vfyObj }, {new: true}, function(userError, usrObj) {
      if(userError) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,',
          ' at updateMobileVerification:', userError);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(usrObj && usrObj._id) {
        AuditingInfoDAO.euAuditing({}, 'Update', { name: config.collectionEndUserUsersVerifications, id: usrObj._id, value: usrObj.verifyValue }, vfyObj);
        callback({ httpCode: 200, statusCode: '0000', result: {} });
      } else {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js, at updateMobileVerification:');
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End : updateMobileVerification
  checkMNAndEmail: function(userID, callback) {
    var vfyQuery = {
      $or: [{ userAccount: userID }, { email: userID }, { mobileNumber: userID }],
      isDeleted: false
    };
    EU_Users.findOne(vfyQuery, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,'+
          ' at checkMNAndEmail:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },


  // --- Begin: userSocialLoginRegister
  userSocialLoginRegister: function(userObj, res, callback) {
    userObj.save( function(err, data) {
        if(err) {
          if(err.name === 'MongoError' && err.code === 11000) {
              logger.error('There was an Uniqueness Error occured in daos/EU-UserLoginDAO.js,'+
              ' at userSocialLoginRegister:', err);
              callback({httpCode: 400, statusCode: '9850', result: {}});
          }else{
              logger.error('There was an Un-Known Error occured in daos/EU-UserLoginDAO.js,'+
              ' at userSocialLoginRegister:', err);
              callback({httpCode: 500, statusCode: '9999', result: {}});
          }
        } else if(data && data._id) {
          CommonService.tokenGeneration(data, res, function(token) {
            if(token) {
              AuditingInfoDAO.euAuditing({}, 'Create', { name: config.collectionEndUserUsers, id: data._id, value: data.userAccount }, data);
              callback({ httpCode: 200, statusCode: '0000', result: data });
            } else {
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            }
          });
        } else {
          callback({httpCode: 400, statusCode: '9993', result: {}});
        }
      });
  },
  // --- End: userSocialLoginRegister

  // --- Begin: userLoginVerification
  userLoginVerification: function(body, res, callback) {
    EU_Users.findOne({ 'email': body.email, isDeleted: false }, function(urError, urResObj) {
      if(urError) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,',
          ' at checkMNAndEmail:', urError);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(urResObj && urResObj._id) {
        CommonService.tokenGeneration(urResObj, res, function(token) {
          if(token) {
            callback({ httpCode: 200, statusCode: '0000', result: urResObj });
          } else {
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          }
        });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // --- End: userLoginVerification

  // --- Begin: isSocialEndUserExist
  isSocialEndUserExist: function(signupType, signupUserId, email, mobileNumber, accessToken, callback) {
    var query = {
      $or: [{ email: email }, { mobileNumber: mobileNumber }, { signupType: signupType, signupUserId: signupUserId }],
      isDeleted: false
    };
    EU_Users.findOne(query, function(urError, urResObj) {
      if(urError) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,' +
        ' at isSocialEndUserExist:', urError);
        callback(urError, { httpCode: 500, statusCode: '9999', result: {} });
      } else if(urResObj && urResObj._id) {
        var currentUTC = CommonService.currentUTCObj();
        var seuLogKeyObj = {
          loginKey: accessToken,
          updatedBy: 'superadmin',
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedOn: currentUTC.currentUTCDateTimeString
        };
        EU_Users.findOneAndUpdate({ _id: urResObj._id }, {$set: seuLogKeyObj}, {new: true}).
        exec(function(err, usrObj) {
          if(err) {
            logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,' +
            ' at isSocialEndUserExist:', err);
            callback(err, { httpCode: 500, statusCode: '9999', result: {} });
          } else if(usrObj && usrObj.loginKey) {
            AuditingInfoDAO.euAuditing({iss: urResObj._id, ua: urResObj.userAccount, un: urResObj.name}, 'Update', { name: config.collectionEndUserUsers, id: usrObj._id, value: usrObj.userAccount }, seuLogKeyObj);
            callback(err, { httpCode: 200, statusCode: '0000', result: usrObj });
          } else {
            callback(err, { httpCode: 400, statusCode: '9997', result: {} });
          }
        });
      } else {
        callback(urError, { httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // --- End: isSocialEndUserExist

  endUsersSocialLogin: function(query, callback) {
    EU_Users.findOne(query).exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,',
          ' at endUsersSocialLogin of User query:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        var currentUTC = CommonService.currentUTCObj();
        var updateTokenObj = {
          loginKey: null,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedBy: resObj.userAccount,
          updatedOn: currentUTC.currentUTCDateTimeString
        };
        EU_Users.findOneAndUpdate({ '_id': resObj._id }, { $set: updateTokenObj }).exec(function(upError, upResObj) {
          AuditingInfoDAO.euAuditing({iss: resObj._id, ua: resObj.userAccount, un: resObj.name}, 'Update', { name: config.collectionEndUserUsers, id: resObj._id, value: resObj.userAccount }, updateTokenObj);
        });
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: resObj });
      }
    });
  },

  // --- Begin postEUUserLogsData:
  postEUUserLogsData: function(userLogObj, callback) {
    userLogObj.save(function(error, resObj) {
      if(error) {
        console.log("========error:"+error)
      } else {
        AuditingInfoDAO.euAuditing({iss: resObj.euUserId, ua: resObj.createdBy, un: resObj.euName}, 'Create', { name: config.collectionEndUserUsersLogs, id: resObj._id, value: resObj.macAddress }, resObj);
      }
    });
  },

  // --- Begin : isUserVerified
  isUserVerified: function(verifySign, callback) {
    EU_UsersVerifications.findOne({ verifySign: verifySign, isDeleted: false }).exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,' +
          ' at isUserVerified:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  // --- End : isUserVerified


  userSocialLoginUpdateDeviceToken: function(updateObj, recordId, callback) {
    EU_Users.findOneAndUpdate({ '_id': recordId, 'isDeleted': false }, { $set: updateObj }, {new: true})
      .exec(function(error, resObj) {
        if (error) {
          logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,',
            ' at userSocialLoginUpdateDeviceToken of EU_Users query:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj && resObj._id) {
          callback({ httpCode: 200, statusCode: '0000', result: resObj });
        } else {
          callback({ httpCode: 400, statusCode: '9994', result: {} });
        }
      });
  },

  // --- Begin : updateMobileOtpToVerifications
  updateMobileOtpToVerifications: function(verifySign, updateData, callback) {
    EU_UsersVerifications.findOneAndUpdate({ verifySign: verifySign, isDeleted: false },
    {$set: updateData}, {new: true}).exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,' +
          ' at updateMobileOtpToVerifications:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        AuditingInfoDAO.euAuditing({}, 'Update', { name: config.collectionEndUserUsersVerifications, id: resObj._id, value: resObj.verifyValue }, updateData);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  },
  // --- End : updateMobileOtpToVerifications

  // --- Begin : updateEUSignupOTPVerification
  updateEUSignupOTPVerification: function(recordId, currentUTC, callback) {
    var otpUObj = {
      mbnOtp: '',
      mbnOtpSalt: '',
      mbnVerifyStatus: 'Verified',
      updatedBy: 'superadmin',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    EU_UsersVerifications.findOneAndUpdate({ _id: recordId, isDeleted: false }, { $set: otpUObj }, function(userError, usrObj) {
      if(userError) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,'+
          ' at updateEUSignupOTPVerification:', userError);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(usrObj && usrObj._id) {
        AuditingInfoDAO.euAuditing({}, 'Update', { name: config.collectionEndUserUsersVerifications, id: usrObj._id, value: usrObj.verifyValue }, otpUObj);
        callback({ httpCode: 200, statusCode: '1002', result: {} });
      } else {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js, at updateEUSignupOTPVerification: Record update failed');
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  // --- End : updateEUSignupOTPVerification


  updateUserProfileMobileNumberVerify: function (tokenDecodedData, mobileNumber, res, callback) {
    EU_Users.findOne({ mobileNumber: mobileNumber, isDeleted: false }, function (error, data) {
        if (error) {
            logger.error('There was an Un-konwn Error occured in daos/EU-UserLoginDAO.js,',
                ' at updateUserProfileMobileNumberVerify:', error);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (data && data._id) {
            callback({ httpCode: 200, statusCode: '0000', result: data });
        } else {
            callback({ httpCode: 400, statusCode: '9997', result: {} });
        }
    });
  },


  // --- Begin : updateUserMobileNumber
  updateUserMobileNumber: function(userObj, tokenDecodedData, callback) {
    EU_Users.findOneAndUpdate({ email: tokenDecodedData.ue }, { $set: userObj }, {new: true}, function(userError, usrObj) {
      if(userError) {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js,' +
          ' at updateUserMobileNumber:', userError);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(usrObj && usrObj._id) {
        var UserObj = usrObj;
        var decObj = {
          mobileNumber: usrObj.mobileNumber,
          email: usrObj.email,
          alternateContactNumber: usrObj.alternateContactNumber ? CommonService.decrypt(usrObj.alternateContactNumber) : '',
          alternateEmail: usrObj.alternateEmail ? CommonService.decrypt(usrObj.alternateEmail) : '',
        };
        var resultObj = JSON.parse((JSON.stringify(UserObj) + JSON.stringify(decObj)).replace(/}{/g, ','));
        AuditingInfoDAO.euAuditing({iss: usrObj._id, ua: usrObj.userAccount, un: usrObj.name}, 'Update', { name: config.collectionEndUserUsers, id: usrObj._id, value: usrObj.userAccount }, userObj);
        callback({ httpCode: 200, statusCode: '1002', result: resultObj });
      } else {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js, at updateUserMobileNumber:');
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  }
};
// --- Ending of EU-UserLoginDAO

/**
 * @param {object} userData 
 * @param {callback} callback 
 */

function setSignUpData(userData, currentUTC, callback) {
  userData.save(function(error, resObj) {
    if(error) {
      if(error.errmsg.indexOf('mobileNumber_1') > 0) {
        logger.error('There was an Uniqueness(mobileNumber) Error occured in daos/EU-UserLoginDAO.js,' +
          ' at setEndUserSignupData - setSignUpData:', error);
        callback({ httpCode: 400, statusCode: '9956', result: {} });
      } else if(error.errmsg.indexOf('email_1') > 0) {
        logger.error('There was an Uniqueness(email) Error occured in daos/EU-UserLoginDAO.js,' +
          ' at setEndUserSignupData - setSignUpData:', error);
        callback({ httpCode: 400, statusCode: '9957', result: {} });
      } else {
        logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js at setEndUserSignupData - setSignUpData:' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    } else if(resObj && resObj._id) {
      // var upObj = {
      //   isUserCreated: true,
      //   updatedAt: currentUTC.currentUTCDateTimeNumber,
      //   updatedBy: 'superadmin',
      //   updatedOn: currentUTC.currentUTCDateTimeString
      // };
      // EU_UsersVerifications.update({ verifyValue: resObj.mobileNumber, isDeleted: false }, { $set: upObj },
      // function(vfError, vfResObj) {
      //   if(vfError) {
      //     logger.error('There was an Un-known Error occured in daos/EU-UserLoginDAO.js at setEndUserSignupData - setSignUpData(EU_UsersVerifications):' + vfError);
      //     callback({ httpCode: 200, statusCode: '0000', result: resObj });
      //   } else if(vfResObj && vfResObj.nModified == 1) {
        AuditingInfoDAO.euAuditing({iss: resObj._id, ua: resObj.userAccount, un: resObj.name}, 'Update', { name: config.collectionEndUserUsers, id: resObj._id, value: resObj.userAccount }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      //   } else {
      //     logger.error('There was an Error occured in daos/EU-UserLoginDAO.js, at setEndUserSignupData - setSignUpData(EU_UsersVerifications): No data updated, due to no record found');
      //     callback({ httpCode: 200, statusCode: '0000', result: resObj });
      //   }
      // });
    } else {
      logger.error('There was an Error occured in daos/EU-UserLoginDAO.js, at setEndUserSignupData - setSignUpData:' +
      'Record insertion failed(User creation failed)');
      callback({ httpCode: 400, statusCode: '9993', result: {} });
    }
  });
}
