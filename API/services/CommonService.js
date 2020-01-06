/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var jwt = require('jwt-simple');
var moment = require('moment');
var Request = require('request');
var logger = require('../lib/logger');

'use strict';
const crypto = require('crypto');
var fs = require('fs');
var ursa = require('ursa');

const ENCRYPTION_KEY = '$6!dA6@Ne*tGe#tEk#0LoGy$07uT!O#$'; // process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
// const IV_LENGTH = 16; // For AES, this is always 16

// function encrypt(text) {
//   let iv = crypto.randomBytes(IV_LENGTH);
//   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
//   let encrypted = cipher.update(text);

//   encrypted = Buffer.concat([encrypted, cipher.final()]);
//   return iv.toString('hex') + ':' + encrypted.toString('hex');
// }

// function decrypt(text) {
//   let textParts = text.split(':');
//   let iv = Buffer.from(textParts.shift(), 'hex');
//   let encryptedText = Buffer.from(textParts.join(':'), 'hex');
//   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
//   let decrypted = decipher.update(encryptedText);

//   decrypted = Buffer.concat([decrypted, decipher.final()]);
//   return decrypted.toString();
// }

module.exports = {
  // --- Begin tokenGeneration: Token Generation Code
  tokenGeneration: function(userObj, res, callback) {
    try {
      var expires = moment().add(config.loginUserExpireTime, config.loginUserExpireTimeType).valueOf();
      var payload = {
        iss: userObj._id,
        ua: userObj.userAccount,
        ue: (userObj.email && userObj.email.includes('@')) ? userObj.email : '',
        un: userObj.name,
        umn: (userObj.mobileNumber && !userObj.mobileNumber.includes('@')) ? userObj.mobileNumber : '',
        ur: userObj.userRole,
        nt: userObj.deviceNotifyToken,
        uprf: userObj.preferences,
        uspid: (userObj.spServiceProviderId && userObj.spServiceProviderId._id) ? userObj.spServiceProviderId._id : '',
        usp: userObj.spServiceProvider ? userObj.spServiceProvider : '',
        exp: expires
      };

      var jwtToken = jwt.encode(payload, config.jwtSecretKey);
      // var token = encrypt(jwtToken);
      res.header('token', jwtToken);

      callback(jwtToken);
    } catch(error) {
      logger.error('There was an Un-Known Error occured in services/CommonService.js,' +
        ' at tokenGeneration:', error);
      callback(null);
    }
  },
  // --- End tokenGeneration: Token Generation Code

  loginOTPTokenGeneration: function(eurObj, otpType, res, callback) {
    try {
      var otpExpires = moment().add(config.smsUserRegOTPExpireTime, config.smsUserRegOTPExpireTimeType).valueOf();
      var payload = {
        iss: eurObj.mobileNumber ? eurObj.mobileNumber : '',
        ise: eurObj.email ? eurObj.email : '',
        _id: eurObj._id ? eurObj._id : '',
        un: eurObj.name ? eurObj.name : '',
        ot: otpType,
        nt: eurObj.nToken ? eurObj.nToken : '',
        exp: otpExpires
      };
      var jwtToken = jwt.encode(payload, config.jwtSecretKey);
      // var token = encrypt(jwtToken);
      res.header('otp_token', jwtToken);
      callback(jwtToken);
    } catch(error) {
      logger.error('There was an Un-Known Error occured in services/CommonService.js,' +
        ' at loginOTPTokenGeneration:', error);
      callback(null);
    }
  },

  refreshUserToken: function(currentToken, res, callback) {
    try {
      var currentTime = moment().valueOf();
      var expires = moment().add(config.loginUserExpireTime, config.loginUserExpireTimeType).valueOf();
      // var jwtCurrentToken = decrypt(currentToken);
      var decodedTokenData = jwt.decode(currentToken, config.jwtSecretKey);
      if(decodedTokenData.exp >= currentTime) {
        var jwtToken = jwt.encode({iss: decodedTokenData.iss,
          ua: decodedTokenData.ua,
          ue: decodedTokenData.ue,
          un: decodedTokenData.un,
          umn: decodedTokenData.umn,
          ur: decodedTokenData.ur,
          nt: decodedTokenData.nt,
          uprf: decodedTokenData.uprf,
          uspid: decodedTokenData.uspid,
          usp: decodedTokenData.usp,
          exp: expires
        }, config.jwtSecretKey);

        // var token = encrypt(jwtToken);
        res.header('token', jwtToken);
        callback({'decodedTokenData': decodedTokenData, 'expStatus': false});
      } else {
        res.header('token', currentToken);
        callback({'decodedTokenData': decodedTokenData, 'expStatus': true});
      }
    } catch(error) {
      logger.error('There was an Un-Known Error occured in services/CommonService.js,' +
      ' at refreshUserToken:', error);
      callback(null);
    }
  },

  tokenExpireValidation: function(token, callback) {
    try {
      var currentTime = moment().valueOf();
      // var jwtToken = decrypt(token);
      var decodedTokenData = jwt.decode(token, config.jwtSecretKey);
      if(decodedTokenData.exp >= currentTime) {
        callback({'decodedTokenData': decodedTokenData, 'expStatus': false});
      } else {
        callback({'decodedTokenData': decodedTokenData, 'expStatus': true});
      }
    } catch(error) {
      logger.error('There was an Un-Known Error occured in services/CommonService.js,' +
        ' at tokenExpireValidation: ', error);
      callback(null);
    }
  },

  orderAmountsSetup: function(amount) {
    var totalAmountString = Math.round(((100 * amount)/(100 - config.paymentGatewayPercent))
        .toFixed(2)).toString().split('.');
    var totalAmount = (totalAmountString[1] && parseInt(totalAmountString[1]) > 0)
        ? (parseInt(totalAmountString[0]) + 1) : parseInt(totalAmountString[0]);
    var onlineCharges = totalAmount - amount;
    if(amount <= 50) {
        var oasizAmount = Math.round((amount * config.oasizPercentBelow50)/100);
        var supplierAmount = amount - oasizAmount;
        return {
            'actualAmount': parseInt(amount),
            'onlineCharges': parseInt(onlineCharges),
            'totalAmount': parseInt(totalAmount),
            'oasizAmount': parseInt(oasizAmount),
            'supplierAmount': parseInt(supplierAmount)
        };
    } else if(amount <= 150) {
        var oasizAmount1 = Math.round(((amount - 50) * config.oasizPercentBelow100)/100);
        var oasizAmount2 = config.oasizPercentBelow50/2;
        var oasizAmount = oasizAmount1 + oasizAmount2;
        var supplierAmount = amount - oasizAmount;
        return {
          'actualAmount': parseInt(amount),
          'onlineCharges': parseInt(onlineCharges),
          'totalAmount': parseInt(totalAmount),
          'oasizAmount': parseInt(oasizAmount),
          'supplierAmount': parseInt(supplierAmount)
        };
    } else if(amount <= 1150) {
        var oasizAmount1 = Math.round(((amount - 150) * config.oasizPercentBelow1000)/100);
        var oasizAmount2 = config.oasizPercentBelow100;
        var oasizAmount3 = config.oasizPercentBelow50/2;
        var oasizAmount = oasizAmount1 + oasizAmount2 + oasizAmount3;
        var supplierAmount = amount - oasizAmount;
        return {
          'actualAmount': parseInt(amount),
          'onlineCharges': parseInt(onlineCharges),
          'totalAmount': parseInt(totalAmount),
          'oasizAmount': parseInt(oasizAmount),
          'supplierAmount': parseInt(supplierAmount)
        };
    } else {
        var oasizAmount1 = Math.round(((amount - 1150) * config.oasizPercentGreater1000)/100);
        var oasizAmount2 = config.oasizPercentBelow1000 * 10;
        var oasizAmount3 = config.oasizPercentBelow100;
        var oasizAmount4 = config.oasizPercentBelow50/2;
        var oasizAmount = oasizAmount1 + oasizAmount2 + oasizAmount3 + oasizAmount4;
        var supplierAmount = amount - oasizAmount;
        return {
          'actualAmount': parseInt(amount),
            'onlineCharges': parseInt(onlineCharges),
            'totalAmount': parseInt(totalAmount),
            'oasizAmount': parseInt(oasizAmount),
            'supplierAmount': parseInt(supplierAmount)
        };
    }
  },

  /**
   * Begin saltGeneration: Salt Generation Code.
   * @param {String} length giving length of salt for password encryption.
   * @param {function} callback return callback function.
   */
  saltGeneration: function(length, callback) {
    try {
      callback(crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, length)); // return required number of characters
    } catch(error) {
      logger.error('There was an Un-Known Error occured in services/CommonService.js,' +
      ' at saltGeneration:', error);
      callback(config.defaultSalt);
    }
  },
  // --- End saltGeneration: Salt Generation Code.

  /**
   * Begin passwordEncryption: Pasword Encryption Code.
   * @param {String} password given password for encryption.
   * @param {String} salt given salt for encryption.
   * @param {function} callback return callback function.
   */
  passwordEncryption: function(password, salt, callback) {
    try {
      var hash = crypto.createHmac('sha512', salt); // Hashing algorithm sha512
      hash.update(password);
      var value = hash.digest('hex');
      callback({salt: salt, passwordHash: value});
    } catch(error) {
      logger.error('There was an Un-Known Error occured in services/CommonService.js,' +
      ' at passwordEncryption:', error);
      callback({salt: '', passwordHash: ''});
    }
  },
  // --- End passwordEncryption: Pasword Encryption Code.

  currentUTCObj: function() {
    // var utcMoment = moment.utc().add(5, 'hours');
    var utcMoment = moment.utc();
    var currentUTCDateTimeString = utcMoment.format('YYYY-MM-DD HH:mm:ss');
    var currentUTCDateTimeNumber = moment(currentUTCDateTimeString, 'YYYY-MM-DD HH:mm:ss').valueOf();
    return {
      'currentUTCDateTimeNumber': currentUTCDateTimeNumber,
      'currentUTCDateTimeString': currentUTCDateTimeString
    };
  },

  currentUTC: function(type) {
    var utcMoment = moment.utc();
    var currentUTCDateTimeString = utcMoment.format('YYYY-MM-DD HH:mm:ss');
    switch(type) {
      case 'number':
        var currentUTCDateTimeNumber = moment(currentUTCDateTimeString, 'YYYY-MM-DD HH:mm:ss').valueOf();
        return currentUTCDateTimeNumber;
        break;
      case 'datetime':
        return currentUTCDateTimeString;
        break;
      default:
        return currentUTCDateTimeString;
        break;
    }
  },

  isJsonObjectEmpty: function(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  },

  pushNotification: function(token, title, titleBody) {
    Request.post({
      headers: {'accept': 'application/json', 'content-type': 'application/json'},
      url: 'https://exp.host/--/api/v2/push/send',
      body: JSON.stringify({
        to: token,
        title: title,
        body: titleBody,
        data: {'message': title + ' ' + titleBody}
      })
    }, function(error, response, body) {
      if(error) {
        logger.error('There was an Un-Known Error occured in services/CommonService.js,' +
        ' at pushNotification:', error);
      }

      return body;
    });
  },

  orderSecureCodeGeneration: function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },

  getPropertiesSortBy: function(sortBy) {
    switch(sortBy) {
      case 'Recommended':
        // return {'createdAt': -1};
        return {};
      case 'Ratings':
        return {'rating': -1};
      case 'Price Low to High':
        return {'pricing.basePrice': 1};
      case 'Price High to Low':
        return {'pricing.basePrice': -1};
      default:
        return {};
    }
  },
  decrypt, encrypt, rsaEncrypt, rsaDecrypt, rsaHashAndSign, rsaHashAndVerify
}

/**
 * @param {string} data string
 * @return {string}
 */
function encrypt(data) {
  var cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  var crypted = cipher.update(data, 'utf-8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

/**
 * @param {string} enc string
 * @return {string}
 */
function decrypt(enc) {
  var decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  var decrypted = decipher.update(enc, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

function rsaEncrypt(data) {
  // var cipher = crypto.createCipher('aes-256-cbc', config.jwtSecretKey);
  var pubkeyAlice = ursa.createPublicKey(fs.readFileSync('./assets/alice/pubkey.pem'));
  var crypted = pubkeyAlice.encrypt(data, 'utf8', 'base64');
  return crypted;
}

function rsaDecrypt(data) {
  // var decipher = crypto.createDecipher('aes-256-cbc', config.jwtSecretKey);
  var privkeyAlice = ursa.createPrivateKey(fs.readFileSync('./assets/alice/privkey.pem'));
  var decrypted = privkeyAlice.decrypt(data, 'base64', 'utf8');
  return decrypted;
}

function rsaHashAndSign(data) {
  var privkeyBob = ursa.createPrivateKey(fs.readFileSync('./assets/bob/privkey.pem'));
  var sign = privkeyBob.hashAndSign('sha256', data, 'utf8', 'base64');
  return sign;
}

function rsaHashAndVerify(data, sign) {
  var pubkeyBob = ursa.createPublicKey(fs.readFileSync('./assets/bob/pubkey.pem'));
  return pubkeyBob.hashAndVerify('sha256', data, sign, 'base64');
}