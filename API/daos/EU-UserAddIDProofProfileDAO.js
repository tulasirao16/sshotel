/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var EU_Users = require('../models/EU-Users');
var EU_UsersKyc = require('../models/EU-UsersKyc');
var SP_UsersKyc = require('../models/SP-UsersKyc');

// --- Begining of EU-Users AddIDProofDAO
module.exports = {
  setEUProfileUserKyc: function (euKycObj, decodedTokenData, callback) {
    euKycObj.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-known Error occured in daos/EU-UsersAddIDProofProfileDAO.js,'+
        ' at setEUProfileUserKyc:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.euAuditing(decodedTokenData, 'Create', { name: config.collectionEndUserUsersKyc, id: resObj._id, value: resObj.idNumber }, resObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  },
  getEndUsersIDProofs: function (idType, tokenDecodedData, callback) {
    EU_UsersKyc.findOne({'euUserId': tokenDecodedData.iss, 'idType': {'$eq': idType }, 'isDeleted': false })
    .exec(function (error, resObj) { 
      if (error) {
        logger.error('There was an Un-Known Error occured in daos/EU-UsersAddIDProofProfileDAO.js at find query - getEndUsersIDProofs:'+ error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  getEUIDProofsData: function (tokenDecodedData, callback) {
    var query = {
      'euUserId': tokenDecodedData.iss,
      'isDeleted': false,
    }
    EU_UsersKyc
    .find(query)
    .populate('euUserId')
    .sort({ 'createdAt': -1 }).exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/EU-UsersAddIDProofProfileDAO.js,' + error);
        callback(error, { httpCode: 500, statusCode: '9999', result: {} });
      } else if (data && data.length > 0) {
        callback(error, { httpCode: 200, statusCode: '0000', result: data });
      } else {
        callback(error, { httpCode: 400, statusCode: '9997', result: {} });
      }
    });
  },
  getDrivingLicenceDetails: function (body, callback) {
    var query = {
      'idNumber': body.idNumber,
      'dobOnId': body.dobOnId,
      'isDeleted': false,
    }
    EU_UsersKyc.findOne(query).exec(function (euError, euData) {
      if (euError) {
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (euData && euData._id) {
        callback({ httpCode: 200, statusCode: '0000', result: euData });
      } else {
        SP_UsersKyc.findOne(query).exec(function (spError, spData) {
          if (spError) {
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if (spData && spData._id) {
            callback({ httpCode: 200, statusCode: '0000', result: spData });
          } else {
            callback({ httpCode: 400, statusCode: '9900', result: {} });
          }
        })
      }
    })
  },
  getVoterIdDetails: function (body, callback) {
    var query = {
      'idNumber': body.idNumber,
      'isDeleted': false,
    }
    EU_UsersKyc.findOne(query).exec(function (euError, euData) {
      if (euError) {
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (euData && euData._id) {
        callback({ httpCode: 200, statusCode: '0000', result: euData });
      } else {
        SP_UsersKyc.findOne(query).exec(function (spError, spData) {
          if (spError) {
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          } else if (spData && spData._id) {
            callback({ httpCode: 200, statusCode: '0000', result: spData });
          } else {
            callback({ httpCode: 400, statusCode: '9900', result: {} });
          }
        })
      }
    })
  },
  updateEUProfileUserKyc: function (_id, updateIDProofObj, tokenDecodedData, callback) {
    var query = { _id: _id, euUserId: tokenDecodedData.iss, isDeleted: false };
    EU_UsersKyc.findOneAndUpdate(query, { $set: updateIDProofObj }, { new: true }, function (error, resObj) {
      if (error) {
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update', { name: config.collectionEndUserUsersKyc, id: _id, value: resObj.idNumber }, updateIDProofObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9900', result: {} });
      }
    });
  }
};
// -----Ending of EU-Users AddIDProofDAO