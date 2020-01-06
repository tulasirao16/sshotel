/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
// var randomNumber= require('random-number');
var fs = require('fs');
var request = require('request');
var uuid = require('node-uuid');
var path = require('path');
var moment = require('moment');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var socialAuth = require('./socialAuth');
var lookupsData = require('./lookupsData');
var EU_UserLoginDAO = require('../daos/EU-UserLoginDAO');
var SP_UsersLoginDAO = require('../daos/SP-UsersLoginDAO');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var EU_Users = require('../models/EU-Users');
var SP_ServiceProviders = require('../models/SP-ServiceProviders');
var SP_Users = require('../models/SP-Users');
var SP_UsersLogs= require('../models/SP-UsersLogs');
var EU_UsersLogs= require('../models/EU-UsersLogs');
var AD_UserLoginDAO = require('../daos/AD-UserLoginDAO');
var AD_UserLogs = require('../models/AD-UsersLogs');
var UAParser = require('ua-parser-js');
var macaddress = require('macaddress');
var requestIp = require('request-ip');

// --- Begining of passport
module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

// END USER LOCAL SIGNUP ============================================================
  passport.use('eu-local-signup', new LocalStrategy(
    {
      usernameField: 'mobileNumber',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, mobileNumber, password, callback) {
      try {
        EU_UserLoginDAO.checkMNAndEmail(mobileNumber, function(resObj) {
          if(resObj.statusCode == '0000') {
            callback({ httpCode: 400, statusCode: '9989', result: {} });
          } else {
            var currentUTC = CommonService.currentUTCObj();
            setEndUserSignupData(mobileNumber, password, req.body.deviceToken, currentUTC, function(usrObj) {
              callback(usrObj);
            });
          }
        });
      } catch(error) {
        logger.error('There was an Un-Known Error occured in config/passport.js,'+
          ' at End User Local Signup:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    }
  ));

// END USER LOCAL LOGIN =============================================================
  passport.use('eu-local-login', new LocalStrategy(
    {
      usernameField: 'userID',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, userID, password, callback) {
      try {
        var macAddress = ''
        macaddress.one(function (err, mac) {
          macAddress = mac;
        });
        EU_UserLoginDAO.userLogin(userID, req.body.deviceToken, function(resObj) {
          if(resObj.statusCode == '1000') {
            var userObj = resObj.result;
            if(userObj.userStatus == lookupsData.userStatuses.active
              && userObj.password && userObj.passwordSalt) {
              CommonService.passwordEncryption(password, userObj.passwordSalt, function(passwordObj) {
                if(passwordObj && passwordObj.passwordHash
                && passwordObj.passwordHash == userObj.password) {
                  setEUUserLogs(req, macAddress, resObj.result);
                  callback(resObj);
                } else {
                  callback({ statusCode: '9950', result: {} });
                }
              });
            } else if(userObj.userStatus == lookupsData.userStatuses.inactive) {
              callback({ statusCode: '9951', result: {} });
            } else if(userObj.userStatus == lookupsData.userStatuses.blocked) {
              callback({ statusCode: '9952', result: {} });
            } else {
              callback({ statusCode: '9950', result: {} });
            }
          } else {
            callback(resObj);
          }
        });
      } catch(error) {
        logger.error('There was an Un-Known Error occured in config/passport.js,',
          ' at Local Login:', error);
        callback({ statusCode: '9999', result: {} });
      }
    }
  ));

  // SUPPLIER LOCAL LOGIN =============================================================
  passport.use('sp-local-login', new LocalStrategy(
    {
      usernameField: 'userID',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, userID, password, callback) {
      try {
        var macAddress = ''
        macaddress.one(function (err, mac) {
          macAddress = mac;
        });
        SP_UsersLoginDAO.supplierSignin(userID, req.body, function(resObj) {
          if(resObj.statusCode == '1000') {
            var userObj = resObj.result;
            if(userObj.userStatus == lookupsData.userStatuses.active
              && userObj.password && userObj.passwordSalt) {
              CommonService.passwordEncryption(password, userObj.passwordSalt, function(passwordObj) {
                if(passwordObj && passwordObj.passwordHash
                && passwordObj.passwordHash == userObj.password) {
                  setSupplierUserLogs(req, macAddress, resObj.result);
                  callback(resObj);
                } else {
                  callback({ statusCode: '9950', result: {} });
                }
              });
            } else if(userObj.userStatus == lookupsData.userStatuses.inactive) {
              callback({ statusCode: '9951', result: {} });
            } else if(userObj.userStatus == lookupsData.userStatuses.blocked) {
              callback({ statusCode: '9952', result: {} });
            } else {
              callback({ statusCode: '9950', result: {} });
            }
          } else {
            callback(resObj);
          }
        });
      } catch(error) {
        logger.error('There was an Un-Known Error occured in config/passport.js,'+
          ' at sp-local-login:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    }
  ));

  // SUPPLIER LOCAL SIGNUP ============================================================
  passport.use('sp-local-signup', new LocalStrategy(
    {
      usernameField: 'userID',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, userID, password, callback) {
      try {
        SP_UsersLoginDAO.isSupplierExist(userID, req.body.contactEmail, req.body.contactMobileNumber, function(resObj) {
          if(resObj.statusCode == '0000') {
            var currentUTC = CommonService.currentUTCObj();
            setSupplierSignupSPData(req.body, currentUTC, function(spResObj) {
              if(spResObj.result && spResObj.result._id) {
                setServiceProviderUserData(spResObj.result._id, req.body, password, currentUTC, function(spUsrObj) {
                  callback(spUsrObj);
                });
              } else {
                callback(spResOb);
              }
            });
          // } else if(resObj.statusCode = '9997') {
          //   callback({ httpCode: 400, statusCode: '9955', result: {} });
          } else {
            callback(resObj)
          }
        });
      } catch(error) {
        logger.error('There was an Un-Known Error occured in config/passport.js,',
          ' at sp-local-signup:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    }
  ));

// END USER GOOGLE ==================================================================
  passport.use(new GoogleStrategy(socialAuth.googleAuth,
  function(request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    // console.log(accessToken, ':accessToken===refreshToken:', refreshToken);
    // console.log('===Profile:', profile);
    EU_UserLoginDAO.isSocialEndUserExist('Google', profile.id, profile.email, profile.email, accessToken, function(err, resObj) {
      if(err) {
        return done(err, resObj);
      } else if(resObj.result && resObj.result._id) {
        return done(err, resObj.result);
      } else {
        setGoogleSocialEUSignupData(profile, accessToken, 'Google', function(error, seuResObj) {
          return done(error, seuResObj);
        });
      }
    });
  }));

// END USER FACEBOOK ==================================================================
  passport.use( new FacebookStrategy(socialAuth.facebookAuth,
  function(request, token, refreshToken, profile, done) {
    // console.log('=====token: ', token);
    // console.log('=====profile: ', profile);
    EU_UserLoginDAO.isSocialEndUserExist('Facebook', profile.id, profile.emails[0].value, profile.emails[0].value, token, function(err, resObj) {
      if(err) {
        return done(err, resObj);
      } else if(resObj.result && resObj.result._id) {
        return done(err, resObj.result);
      } else {
        setFacebookSocialEUSignupData(profile, token, 'Facebook', function(error, seuResObj) {
          return done(error, seuResObj);
        });
      }
    });
  }));

  // ============= Start of ADMIN USER LOGIN====================================
  passport.use('ad-local-login', new LocalStrategy(
    {
      usernameField: 'userID',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, userID, password, callback) {
      try {
        var macAddress = ''
        macaddress.one(function (err, mac) {
          macAddress = mac;
        });
        AD_UserLoginDAO.adminUserLogin(userID, function (resObj) {
          if (resObj.statusCode == '1000') {
            var userObj = resObj.result;
            if (userObj.userStatus == lookupsData.userStatuses.active
              && userObj.password && userObj.passwordSalt) {
              CommonService.passwordEncryption(password, userObj.passwordSalt, function (passwordObj) {
                if (passwordObj && passwordObj.passwordHash
                && passwordObj.passwordHash == userObj.password) {
                  setAdminUserLogs(req, macAddress, resObj.result);
                  callback(resObj);
                } else {
                  callback({ statusCode: '9950', result: {} });
                }
              });
            } else if (userObj.userStatus == lookupsData.userStatuses.inactive) {
              callback({ statusCode: '9951', result: {} });
            } else if (userObj.userStatus == lookupsData.userStatuses.blocked) {
              callback({ statusCode: '9952', result: {} });
            } else {
              callback({ statusCode: '9950', result: {} });
            }
          } else {
            callback(resObj);
          }
        });
      } catch (error) {
        logger.error('There was an Un-Known Error occured in config/passport.js,' +
          ' at ad-local-login:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    }
  ));

};
// --- End of passport

/**
* @param {string} mobileNumber string
* @param {string} password string
* @param {string} deviceToken string
* @param {object} currentUTC object
* @param {function} callback is a callback function
*/
function setEndUserSignupData(mobileNumber, password, deviceToken, currentUTC, callback) {
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(password, salt, function(pwdObj) {
      var userAccount = moment().format('YY')+CommonService.orderSecureCodeGeneration(1, '012345678943210')+CommonService.orderSecureCodeGeneration(2, 'ASDFGHJKLZXCVBNMQWERTYUIOP')+moment().format('MM')+CommonService.orderSecureCodeGeneration(3, '9876501234567894321');
      var userObj = {
        deviceNotifyToken: deviceToken,
        userAccount: userAccount,
        mobileNumber: mobileNumber,
        signupType: 'Local',
        mbnVerifyStatus: 'Verified',
        email: mobileNumber,
        emailVerifyStatus: 'Open',
        password: pwdObj.passwordHash,
        passwordSalt: pwdObj.salt,
        userRole: 'Customer',
        userStatus: 'Active',
        preferences: {
          defaultLanguage: 'English',
          defaultTimezone: 'IST - Indian Standard Time(UTC+05:30)',
          defaultCurrency: 'INR - Indian Rupee(₹)',
          currencyFormat: '#,###.##',
          dateFormat: 'MMM DD, YYYY',
          rowsPerPage: 20,
        },
        isDeleted: false,
        createdBy: 'superadmin',
        createdAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      var userData = new EU_Users(userObj);
      EU_UserLoginDAO.setEndUserSignupData(userData, deviceToken, currentUTC, function(usrObj) {
        callback(usrObj);
      });
    });
  });
}

/**
* @param {object} reqBody object
* @param {object} currentUTC object
* @param {function} callback is a callback function
*/
function setSupplierSignupSPData(reqBody, currentUTC, callback) {
  var spObj = {
    serviceProvider: reqBody.bussinessName,
    contactPerson: reqBody.contactPerson,
    contactNumber: reqBody.contactMobileNumber,
    contactEmail: reqBody.contactEmail,
    contactAddress: reqBody.address,
    landmark: reqBody.landmark,
    area: reqBody.area,
    zip: reqBody.zip,
    city: reqBody.city,
    state: reqBody.state,
    status: 'Active',
    appPercentage: reqBody.appPercentage ? reqBody.appPercentage : 0,
    preferences: {
      defaultLanguage: 'English',
      defaultTimezone: 'IST - Indian Standard Time(UTC+05:30)',
      defaultCurrency: 'INR - Indian Rupee(₹)',
      currencyFormat: '#,###.##',
      dateFormat: 'MMM DD, YYYY',
      rowsPerPage: 20
    },
    isDeleted: false,
    createdBy: 'superadmin',
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedBy: 'superadmin',
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  var spData = new SP_ServiceProviders(spObj);
  SP_UsersLoginDAO.setServiceProviderData(spData, function(spResObj) {
    callback(spResObj);
  });
}

/**
* @param {object} reqBody object
* @param {string} mobileNumber string
* @param {string} password string
* @param {object} currentUTC object
* @param {function} callback is a callback function
*/
function setServiceProviderUserData(spID, reqBody, password, currentUTC, callback) {
  var name = reqBody.contactPerson.split(' ');
  var spBussiness = reqBody.bussinessName.replace(/\s/g,'');
  var lastIndex = name.length > 1 ? reqBody.contactPerson.lastIndexOf(' ') : '';
  var firstName = name.length > 1 ? reqBody.contactPerson.substring(0, lastIndex) : reqBody.contactPerson;
  var lastName = name.length > 1 ? name[name.length - 1] : '';
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(password, salt, function(pwdObj) {
      var userAccount = moment().format('YY')+CommonService.orderSecureCodeGeneration(1, '012345678943210')+CommonService.orderSecureCodeGeneration(2, spBussiness)+moment().format('MM')+CommonService.orderSecureCodeGeneration(3, '9876501234567894321');
      // var utcMoment = reqBody.dob ? moment.utc(reqBody.dob) : '';
      // var dob = reqBody.dob ? moment(reqBody.dob).format() : '';
      var userObj = {
        spServiceProviderId: spID,
        spServiceProvider: reqBody.bussinessName,
        displayName: name[0],
        firstName: firstName,
        lastName: lastName,
        name: reqBody.contactPerson,
        // dob: dob,
        // dobNumber: utcMoment ? moment(utcMoment, 'YYYY-MM-DD').valueOf() : 0,
        address: reqBody.address,
        area: reqBody.area,
        areaLocality: reqBody.areaLocality,
        city: reqBody.city,
        state: reqBody.state,
        landmark: reqBody.landmark,
        areaLocality: reqBody.areaLocality,
        zip: reqBody.zip,
        deviceNotifyToken: reqBody.deviceToken,
        userAccount: userAccount,
        mobileNumber: reqBody.contactMobileNumber,
        mbnVerifyStatus: 'Verified',
        email: reqBody.contactEmail,
        emailVerifyStatus: 'Verified',
        password: pwdObj.passwordHash,
        passwordSalt: pwdObj.salt,
        userType: 'Owner',
        userRole: 'Admin',
        userStatus: 'Active',
        preferences: {
          defaultLanguage: 'English',
          defaultTimezone: 'IST - Indian Standard Time(UTC+05:30)',
          defaultCurrency: 'INR - Indian Rupee(₹)',
          currencyFormat: '#,###.##',
          dateFormat: 'MMM DD, YYYY',
          rowsPerPage: 20
        },
        isDeleted: false,
        createdBy: 'superadmin',
        createdAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedBy: 'superadmin',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      };
      var spUserData = new SP_Users(userObj);
      SP_UsersLoginDAO.setServiceProviderUserSignupData(spUserData, currentUTC, function(usrObj) {
        callback(usrObj);
      });
    })
  });
}

var download = function(uri, filename, filePath, callback) {
  request.head(uri, function(err, res, body) {
    request(uri).pipe(fs.createWriteStream(filePath + '/' + filename)).on('close', callback);
  });
}

/**
* @param {object} profile object
* @param {string} accessToken string
* @param {string} signupType string
* @param {function} callback is a callback function
*/
function setGoogleSocialEUSignupData(profile, accessToken, signupType, callback) {
  const _id = uuid.v1();
  const euName = profile.displayName.replace(/\s/g,'');
  const name = profile.displayName.split(' ');
  var picName = '';
  var userIcon = '';
  var userIconPath = '';
  var currentUTC = CommonService.currentUTCObj();
  if(profile.picture) {
    const ppURL = profile.picture;
    const uplLoc = 'assets/eu-users/' + _id;
    picName = path.basename(profile.picture);
    const picNameArray = picName.split('.');
    userIcon = 'gp' + moment.utc().valueOf() + '.' + picNameArray[picNameArray.length - 1];
    userIconPath = uplLoc + '/' + userIcon;

    if(!fs.existsSync(uplLoc)) {
      fs.mkdirSync(uplLoc);
    }
    download(ppURL, userIcon, uplLoc, function() {});
  }
  const userAccount = moment().format('YY')+CommonService.orderSecureCodeGeneration(1, '012345678943210')+CommonService.orderSecureCodeGeneration(2, euName)+moment().format('MM')+CommonService.orderSecureCodeGeneration(3, '9876501234567894321');

  var userObj = {
    _id: _id,
    displayName: name[0],
    firstName: profile.given_name,
    lastName: profile.family_name,
    name: profile.displayName,
    userIcon: userIcon,
    userIconOriginalName: picName,
    userIconPath: userIconPath,
    userAccount: userAccount,
    mobileNumber: profile.email,
    mbnVerifyStatus: 'Open',
    email: profile.email,
    emailVerifyStatus: 'Verified',
    loginKey: accessToken,
    userRole: 'Customer',
    userStatus: 'Active',
    signupType: signupType,
    signupUserId: profile.id,
    preferences: {
      defaultLanguage: 'English',
      defaultTimezone: 'IST - Indian Standard Time(UTC+05:30)',
      defaultCurrency: 'INR - Indian Rupee(₹)',
      currencyFormat: '#,###.##',
      dateFormat: 'MMM DD, YYYY',
      rowsPerPage: 20
    },
    isDeleted: false,
    createdBy: 'superadmin',
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedBy: 'superadmin',
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  var userData = new EU_Users(userObj);
  EU_UserLoginDAO.setEndUserSignupData(userData, 'null', currentUTC, function(userResObj) {
    callback(null, userResObj.result);
  });
}

/**
* @param {object} profile object
* @param {string} accessToken string
* @param {string} signupType string
* @param {function} callback is a callback function
*/
function setFacebookSocialEUSignupData(profile, accessToken, signupType, callback) {
  const _id = uuid.v1();
  const euName = profile.displayName.replace(/\s/g,'');
  const name = profile.displayName.split(' ');
  var userIcon = '';
  var userIconPath = '';
  var currentUTC = CommonService.currentUTCObj();
  if(profile.photos && profile.photos.length > 0 && profile.photos[0].value) {
    const ppURL = profile.photos[0].value;
    const uplLoc = 'assets/eu-users/' + _id;
    userIcon = 'fb' + moment.utc().valueOf();
    userIconPath = uplLoc + '/' + userIcon;

    if(!fs.existsSync(uplLoc)) {
      fs.mkdirSync(uplLoc);
    }
    var options = {
      directory: uplLoc
    };
    download(ppURL, userIcon, uplLoc, function() {});
  }
  const userAccount = moment().format('YY')+CommonService.orderSecureCodeGeneration(1, '012345678943210')+CommonService.orderSecureCodeGeneration(2, euName)+moment().format('MM')+CommonService.orderSecureCodeGeneration(3, '9876501234567894321');

  var userObj = {
    _id: _id,
    displayName: name[0],
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    name: profile.displayName,
    userIcon: userIcon,
    userIconOriginalName: userIcon,
    userIconPath: userIconPath,
    userAccount: userAccount,
    mobileNumber: profile.emails[0].value,
    mbnVerifyStatus: 'Open',
    email: profile.emails[0].value,
    emailVerifyStatus: 'Verified',
    loginKey: accessToken,
    userRole: 'Customer',
    userStatus: 'Active',
    signupType: signupType,
    signupUserId: profile.id,
    preferences: {
      defaultLanguage: 'English',
      defaultTimezone: 'IST - Indian Standard Time(UTC+05:30)',
      defaultCurrency: 'INR - Indian Rupee(₹)',
      currencyFormat: '#,###.##',
      dateFormat: 'MMM DD, YYYY',
      rowsPerPage: 20
    },
    isDeleted: false,
    createdBy: 'superadmin',
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedBy: 'superadmin',
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  var userData = new EU_Users(userObj);
  EU_UserLoginDAO.setEndUserSignupData(userData, 'null', currentUTC, function(userResObj) {
    callback(null, userResObj.result);
  });
}

/**
* @param {object} req object
* @param {string} macAddress string
* @param {object} resObj object
* @return {object} object
*/
function setSupplierUserLogs(req, macAddress, resObj) {
  var currentUTC = CommonService.currentUTCObj();
  var ua = req.headers['user-agent'];
  var parser = new UAParser();
  var deviceType = req.device.type;
  var browserName = parser.setUA(ua).getBrowser().name;
  var fullBrowserVersion = parser.setUA(ua).getBrowser().version;
  var osName = parser.setUA(ua).getOS().name;
  var userAgent = parser.setUA(ua).getUA();
  var ipAddress = requestIp.getClientIp(req)
  var userLogObj = {
    spServiceProviderId: resObj.spServiceProviderId._id,
    spServiceProvider: resObj.spServiceProvider,
    spUserId:resObj._id,
    spName: resObj.name,
    appType: req.body.appType,
    deviceType: deviceType,
    deviceOs: osName ? osName: req.body.deviceOS,
    // deviceId: {type: String, required: false, trim: true},
    macAddress: macAddress,
    ipAddress: ipAddress,
    browserName: browserName,
    browserVersion: fullBrowserVersion,
    userAgent: userAgent,
    isDeleted: false,
    createdBy: 'superadmin',
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedBy: 'superadmin',
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  var postObj = new SP_UsersLogs(userLogObj);
  SP_UsersLoginDAO.postSPUserLogsData(postObj, function(resObj) {});
}

/**
* @param {object} req object
* @param {string} macAddress string
* @param {object} resObj object
* @return {object} object
*/
function setEUUserLogs(req, macAddress, resObj) {
  var currentUTC = CommonService.currentUTCObj();
  var ua = req.headers['user-agent'];
  var parser = new UAParser();
  var deviceType = req.device.type;
  var browserName = parser.setUA(ua).getBrowser().name;
  var fullBrowserVersion = parser.setUA(ua).getBrowser().version;
  var osName = parser.setUA(ua).getOS().name;
  var userAgent = parser.setUA(ua).getUA();
  var ipAddress = requestIp.getClientIp(req)
  var userLogObj = {
    euUserId: resObj._id,
    euName: resObj.name ? resObj.name : resObj.mobileNumber,
    appType: req.body.appType,
    deviceType: deviceType,
    deviceOs: osName ? osName: req.body.deviceOS,
    // deviceId: {type: String, required: false, trim: true},
    macAddress: macAddress,
    ipAddress: ipAddress,
    browserName: browserName,
    browserVersion: fullBrowserVersion,
    userAgent: userAgent,
    isDeleted: false,
    createdBy: resObj.userAccount,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedBy: resObj.userAccount,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  var postObj = new EU_UsersLogs(userLogObj);
  EU_UserLoginDAO.postEUUserLogsData(postObj, function(resObj) {
  });
}

/**
* @param {object} req object
* @param {string} macAddress string
* @param {object} resObj object
* @return {object} object
*/
function setAdminUserLogs(req, macAddress, resObj) {
  var currentUTC = CommonService.currentUTCObj();
  var ua = req.headers['user-agent'];
  var parser = new UAParser();
  var deviceType = req.device.type;
  var browserName = parser.setUA(ua).getBrowser().name;
  var fullBrowserVersion = parser.setUA(ua).getBrowser().version;
  var osName = parser.setUA(ua).getOS().name;
  var userAgent = parser.setUA(ua).getUA();
  var ipAddress = requestIp.getClientIp(req)
  var userLogObj = {
    adUserId: resObj._id,
    adName: resObj.name,
    appType: req.body.appType,
    deviceType: deviceType,
    deviceOs: osName ? osName : req.body.deviceOS,
    // deviceId: {type: String, required: false, trim: true},
    macAddress: macAddress,
    ipAddress: ipAddress,
    browserName: browserName,
    browserVersion: fullBrowserVersion,
    userAgent: userAgent,
    isDeleted: false,
    createdBy: resObj.userAccount,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedBy: resObj.userAccount,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  var postObj = new AD_UserLogs(userLogObj);
  AD_UserLoginDAO.postADUserLogsData(postObj, function (resObj) {
  });
}
