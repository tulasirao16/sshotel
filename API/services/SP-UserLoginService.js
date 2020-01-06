/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var CommonService = require('./CommonService');
var randomNumber = require('random-number');
var SP_UserLoginDAO = require('../daos/SP-UsersLoginDAO');
var SP_UsersVerifications = require('../models/SP-UsersVerifications');
var SP_ServiceProviders = require('../models/SP-ServiceProviders');
var logger = require('../lib/logger');
var mail = require('../config/mail');

// --- Begin: SP-UserLoginService
module.exports = {
  // --- Begin supplierSignin: Code to handle Supplier User Login credentials
  supplierSignin: function(req, res, next, passport, callback) {
    // --- This is to authenticate login credentials and gives the response using passport
    passport.authenticate('sp-local-login', function(resObj) {
      try {
        if(resObj.statusCode == '1000') {
          CommonService.tokenGeneration(resObj.result, res, function(token) {
            if(token) {
              var spUserObj = resObj.result;
              var decObj = {
                mobileNumber: resObj.result.mobileNumber,
                email: resObj.result.email,
                alternateContactNumber: resObj.result.alternateContactNumber ? CommonService.decrypt(resObj.result.alternateContactNumber) : '',
                alternateEmail: resObj.result.alternateEmail ? CommonService.decrypt(resObj.result.alternateEmail) : '',
                pgcInPercent: config.pgcInPercent
              };
              spUserObj['_id'] = undefined;
              spUserObj['passwordSalt'] = undefined;
              spUserObj['password'] = undefined;
              spUserObj['loginKey'] = undefined;
              spUserObj['otp'] = undefined;
              spUserObj['otpSalt'] = undefined;
              spUserObj['mobileNumber'] = undefined;
              spUserObj['email'] = undefined;
              spUserObj['alternateEmail'] = undefined;
              spUserObj['alternateContactNumber'] = undefined;
              if(!spUserObj._id && !spUserObj.passwordSalt && !spUserObj.password
              && !spUserObj.loginKey && !spUserObj.otp && !spUserObj.otpSalt) {
                var resultObj = JSON.parse((JSON.stringify(spUserObj) + JSON.stringify(decObj)).replace(/}{/g, ','))
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resultObj });
              }
            } else {
              logger.error('There was an Error in services/EU-UserLoginService.js,'+
                ' at userLogin function of generateToken:', error);
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            }
          });
        } else if(resObj.statusCode != '9999') {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: {} });
        } else {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } catch (error) {
        logger.error('There was an Un-Known Error occured in services/EU-UserLoginService.js,'+
          ' at userLogin:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    })(req, res, next);
  },
  // --- End supplierSignin: Code to handle Supplier User Login credentials

  // --- Begin: supplierSignupSendOTP
  supplierSignupSendOTP: function(reqBody, res, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var otpNumberLimit = { min: 1000, max: 9999, integer: true };
    var otpNumber = randomNumber(otpNumberLimit).toString();
    switch(reqBody.otpType) {
      case 'Mobile':
        SP_UserLoginDAO.isSupplierMobileNumVerified(reqBody.mobileNumber, function(mnvResObj) {
          if(mnvResObj.statusCode == '9956') {
            var uvData = mnvResObj.result;
            if(uvData.mbnVerifyStatus == 'Verified') {
              callback({ httpCode: 200, statusCode: '1009', result: {'otpMessage': 'Mobile number already verified', 'otpNumber': ''} });
            } else {
              supplierUVUpdateSignupSendOTPtoMobile(reqBody.mobileNumber, otpNumber, currentUTC, uvData, res, function(mnvResObj) {
                callback(mnvResObj);
              });
            }
          } else if(mnvResObj.statusCode == '9989') {
            callback({ httpCode: 200, statusCode: '9989', result: {'otpMessage': 'Service provider exist with this mobile number', 'otpNumber': ''} });
          } else {
            supplierSignupSendOTPtoMobile(reqBody.mobileNumber, otpNumber, currentUTC, res, function(mnvResObj) {
              callback(mnvResObj);
            });
          }
        });
        break;
      case 'Email':
        SP_UserLoginDAO.isSupplierEmailVerified(reqBody.email, function(evResObj) {
          if(evResObj.statusCode == '9957') {
            var uvData = evResObj.result;
            if(uvData.emailVerifyStatus == 'Verified') {
              callback({ httpCode: 200, statusCode: '1010', result: {'otpMessage': 'Email already verified', 'otpNumber': ''} });
            } else {
              supplierUVUpdateSignupSendOTPtoEmail(reqBody.email, otpNumber, currentUTC, uvData, res, function(evResObj) {
                callback(evResObj);
              });
            }
          } else if(evResObj.statusCode == '9988') {
            callback({ httpCode: 200, statusCode: '9988', result: {'otpMessage': 'Service provider exist with this email', 'otpNumber': ''} });
          } else {
            supplierSignupSendOTPtoEmail(reqBody.email, otpNumber, currentUTC, res, function(evResObj) {
              callback(evResObj);
            });
          }
        });
        break;
    }
  },
  // --- End: supplierSignupSendOTP

  // --- Begin: supplierSignupValidateOTP:
  supplierSignupValidateOTP: function(reqBody, tokenDecodedData, callback) {
    switch(reqBody.otpType) {
      case 'Mobile':
        SP_UserLoginDAO.getUserVerificationData(tokenDecodedData, function(resObj) {
          if(resObj.result && resObj.result._id) {
            supplierSignupValidateMobileOTP(reqBody.otpNumber, resObj.result, function(otpUVResObj) {
              callback(otpUVResObj);
            });
          } else {
            callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
          }
        });
        break;
      case 'Email':
        SP_UserLoginDAO.getUserVerificationData(tokenDecodedData, function(resObj) {
          if(resObj.result && resObj.result._id) {
            supplierSignupValidateEmailOTP(reqBody.otpNumber, resObj.result, function(otpUVResObj) {
              callback(otpUVResObj);
            });
          } else {
            callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
          }
        });
        break;
    }
  },
  // --- End: supplierSignupValidateOTP:

  supplierSignupValidateUserID: function(userID, callback) {
    SP_UserLoginDAO.supplierSignupValidateUserID(userID, function(resObj) {
      callback(resObj);
    });
  },
  
  // --- Begin: supplierSignup
  supplierSignup: function(req, res, next, passport, callback) {
    passport.authenticate('sp-local-signup', function(resObj) {
      try {
        callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result })
      } catch (error) {
        logger.error('There was an Un-Known Error occured in services/SP-UserLoginService.js,',
          ' at supplierSignup:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    })(req, res, next);
  },
  // --- END: supplierSignup

  // --- Begin: getUserData
  getUserData: function (userData, tokendecodeddata, callback) {
    SP_UserLoginDAO.getUserData(userData,tokendecodeddata,function (error, resObj) {
      if (error) {
        callback(error, { httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
        callback(error, { httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
        callback(error, { httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
    });
  },
  // --- END: getUserData
  // --- Begin: supplierSignupTicket
  supplierSignupTicket: function(body, callback) {
    var currentUTC = CommonService.currentUTCObj();
    let onBoardingData = {
      serviceProvider: body.serviceProvider,
      contactPerson: body.contactPerson,
      contactNumber: body.contactNumber,
      contactEmail: body.contactEmail,
      contactAddress: body.contactAddress,
      city: body.city,
      status: 'Inactive',
      createdAt: currentUTC.currentUTCDateTimeNumber,
      createdBy: 'superadmin',
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedBy: 'superadmin',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString,
    }
    let onBoardingServiceProviderObj = new SP_ServiceProviders(onBoardingData)
    SP_UserLoginDAO.postOnBoardingTicket(onBoardingServiceProviderObj, body, function (error, resObj) {
      if (error) {
        if (resObj.statusCode === '9956') {
          callback({ httpCode: 400, statusCode: '9956', result: {} })
        } else if (resObj.statusCode === '9957') {
          callback({ httpCode: 400, statusCode: '9957', result: {} })
        } else {
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } else if (resObj.statusCode === '0000') {
        callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else if (resObj.statusCode === '9951') {
        callback({ httpCode: 200, statusCode: resObj.statusCode, result: {} });
      } else {
        callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
    })
  },
  // --- END: supplierSignupTicket

};

/**
* @param {string} mobileNumber string
* @param {string} otpNumber string
* @param {object} currentUTC object
* @param {object} uvData object
* @param {object} res object
* @param {function} callback is a callback function
*/
function supplierUVUpdateSignupSendOTPtoMobile(mobileNumber, otpNumber, currentUTC, uvData, res, callback) {
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(otpNumber, salt, function(otpObj) {
      var uvObj = {
        mbnVerifyStatus: 'Open',
        mbnOtp: otpObj.passwordHash,
        mbnOtpSalt: otpObj.salt,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      SP_UserLoginDAO.updateSupplierSignupUV(uvObj, uvData._id, function(mnvResObj) {
        if(mnvResObj.statusCode == '0000') {
          CommonService.loginOTPTokenGeneration({ '_id': uvData._id, 'mobileNumber': mobileNumber, 'nToken': '' }, 'Signup',
          res, function(token) {
            if(token) {
              // var message = otpNumber + config.smsLoginOTPMessage;
              // sendSMS.sendSMS(mobileNumber, message, function(smsError, smsRes) {
              //   if(smsError) {
              //     logger.error('There was an Un-known Error in services/SP-UserLoginService.js at supplierSignupSendOTP - sendSMS:', smsError);
              //     callback({httpCode: 500, statusCode: '9999', result: {}});
              //   } else {
              //     callback({httpCode: 200, statusCode: spuResObj.statusCode, result: {'otpMessage': 'OTP Sent', 'otpNumber': otpNumber}});
              //   }
              // });
              callback({ httpCode: 200, statusCode: '1001', result: { 'otpMessage': 'OTP Sent', 'otpNumber': otpNumber } });
            } else {
              callback({ httpCode: 400, statusCode: '9953', result: {} });
            }
          });
        } else {
          callback({ httpCode: 400, statusCode: '9953', result: {} });
        }
      });
    });
  });
}

/**
* @param {string} mobileNumber string
* @param {string} otpNumber string
* @param {object} currentUTC object
* @param {object} res object
* @param {function} callback is a callback function
*/
function supplierSignupSendOTPtoMobile(mobileNumber, otpNumber, currentUTC, res, callback) {
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(otpNumber, salt, function(otpObj) {
      var uvData = {
        mobileNumber: mobileNumber,
        mbnSign: mobileNumber,
        mbnVerifyStatus: 'Open',
        mbnOtp: otpObj.passwordHash,
        mbnOtpSalt: otpObj.salt,
        isDeleted: false,
        createdBy: 'superadmin',
        createdAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      var uvObj = new SP_UsersVerifications(uvData);
      SP_UserLoginDAO.setSupplierSignupUV(uvObj, function(mnvResObj) {
        if(mnvResObj.statusCode == '0000') {
          CommonService.loginOTPTokenGeneration({ '_id': mnvResObj.result._id, 'mobileNumber': mobileNumber, 'nToken': '' }, 'Signup',
          res, function(token) {
            if(token) {
              // var message = otpNumber + config.smsLoginOTPMessage;
              // sendSMS.sendSMS(mobileNumber, message, function(smsError, smsRes) {
              //   if(smsError) {
              //     logger.error('There was an Un-known Error in services/SP-UserLoginService.js at supplierSignupSendOTP - sendSMS:', smsError);
              //     callback({httpCode: 500, statusCode: '9999', result: {}});
              //   } else {
              //     callback({httpCode: 200, statusCode: spuResObj.statusCode, result: {'otpMessage': 'OTP Sent', 'otpNumber': otpNumber}});
              //   }
              // });
              callback({ httpCode: 200, statusCode: '1001', result: { 'otpMessage': 'OTP Sent', 'otpNumber': otpNumber } });
            } else {
              callback({ httpCode: 400, statusCode: '9953', result: {} });
            }
          });
        } else {
          callback({ httpCode: 400, statusCode: '9953', result: {} });
        }
      });
    });
  });
}

/**
 * @param {string} otpNumber string
 * @param {object} uvObj object
 * @param {function} callback is a callback function
 */
function supplierSignupValidateMobileOTP(otpNumber, uvObj, callback) {
  var currentUTC = CommonService.currentUTCObj();
  CommonService.passwordEncryption(otpNumber, uvObj.mbnOtpSalt, function(otpHashObj) {
    if(otpHashObj && otpHashObj.passwordHash && otpHashObj.passwordHash == uvObj.mbnOtp) {
      var updateUVObj = {
        mbnOtp: '',
        mbnOtpSalt: '',
        mbnVerifyStatus: 'Verified',
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      SP_UserLoginDAO.updateSupplierSignupUV(updateUVObj, uvObj._id, function(mnvResObj) {
        if(mnvResObj.statusCode == '0000') {
          callback({ httpCode: 200, statusCode: '1002', result: { otpMessage: 'OTP Verified' } });
        } else {
          callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
        }
      });
    } else {
      callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
    }
  });
}

/**
* @param {string} email string
* @param {string} otpNumber string
* @param {object} currentUTC object
* @param {object} uvData object
* @param {object} res object
* @param {function} callback is a callback function
*/
function supplierUVUpdateSignupSendOTPtoEmail(email, otpNumber, currentUTC, uvData, res, callback) {
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(otpNumber, salt, function(otpObj) {
      var uvObj = {
        emailVerifyStatus: 'Open',
        emailOtp: otpObj.passwordHash,
        emailOtpSalt: otpObj.salt,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      SP_UserLoginDAO.updateSupplierSignupUV(uvObj, uvData._id, function(evResObj) {
        if(evResObj.statusCode == '0000') {
          CommonService.loginOTPTokenGeneration({ '_id': uvData._id, 'email': email, 'nToken': '' }, 'Signup',
          res, function(token) {
            if(token) {
              // mail.sendEMail(evResObj.result.email, 'Email OTP Verification', otpNumber, function(error, resEObj) {
              //   if(error) {
              //   logger.error('There was an Un-known Error in services/SP-UserLoginService.js at supplierUVUpdateSignupSendOTPtoEmail email otp send failed');
              //     callback({httpCode:400, statusCode: '9953', result: {}});
              //   } else {
              //     callback({ httpCode: 200, statusCode: '1001', result: { 'otpMessage': 'OTP Sent', 'otpNumber': otpNumber } });
              //   }
              // });
              callback({ httpCode: 200, statusCode: '1001', result: { 'otpMessage': 'OTP Sent', 'otpNumber': otpNumber } });
            } else {
              callback({ httpCode: 400, statusCode: '9953', result: {} });
            }
          });
        } else {
          callback({ httpCode: 400, statusCode: '9953', result: {} });
        }
      });
    });
  });
}

/**
* @param {string} email string
* @param {string} otpNumber string
* @param {object} currentUTC object
* @param {object} res object
* @param {function} callback is a callback function
*/
function supplierSignupSendOTPtoEmail(email, otpNumber, currentUTC, res, callback) {
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(otpNumber, salt, function(otpObj) {
      var uvData = {
        email: email,
        emailSign: email,
        emailVerifyStatus: 'Open',
        emailOtp: otpObj.passwordHash,
        emailOtpSalt: otpObj.salt,
        isDeleted: false,
        createdBy: 'superadmin',
        createdAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      var uvObj = new SP_UsersVerifications(uvData);
      SP_UserLoginDAO.setSupplierSignupUV(uvObj, function(evResObj) {
        if(evResObj.statusCode == '0000') {
          CommonService.loginOTPTokenGeneration({ '_id': evResObj.result._id, 'email': email, 'nToken': '' }, 'Signup',
          res, function(token) {
            if(token) {
              // mail.sendEMail(evResObj.result.email, 'Email OTP Verification', otpNumber, function(error, resEObj) {
              //   if(error) {
              //     logger.error('There was an Un-known Error in services/SP-UserLoginService.js at supplierSignupSendOTPtoEmail email otp send failed');
              //     callback({httpCode:400, statusCode: '9953', result: {}});
              //   } else {
              //     callback({ httpCode: 200, statusCode: '1001', result: { 'otpMessage': 'OTP Sent', 'otpNumber': otpNumber } });
              //   }
              // });
              callback({ httpCode: 200, statusCode: '1001', result: { 'otpMessage': 'OTP Sent', 'otpNumber': otpNumber } });
            } else {
              callback({ httpCode: 400, statusCode: '9953', result: {} });
            }
          });
        } else {
          callback({ httpCode: 400, statusCode: '9953', result: {} });
        }
      });
    });
  });
}

/**
 * @param {string} otpNumber string
 * @param {object} uvObj object
 * @param {function} callback is a callback function
 */
function supplierSignupValidateEmailOTP(otpNumber, uvObj, callback) {
  var currentUTC = CommonService.currentUTCObj();
  CommonService.passwordEncryption(otpNumber, uvObj.emailOtpSalt, function(otpHashObj) {
    if(otpHashObj && otpHashObj.passwordHash && otpHashObj.passwordHash == uvObj.emailOtp) {
      var updateUVObj = {
        emailOtp: '',
        emailOtpSalt: '',
        emailVerifyStatus: 'Verified',
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      SP_UserLoginDAO.updateSupplierSignupUV(updateUVObj, uvObj._id, function(evResObj) {
        if(evResObj.statusCode == '0000') {
          callback({ httpCode: 200, statusCode: '1002', result: { otpMessage: 'OTP Verified' } });
        } else {
          callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
        }
      });
    } else {
      callback({ httpCode: 400, statusCode: '9954', result: { otpMessage: 'OTP verification failed' } });
    }
  });
}
