/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var AD_Tickets = require('../models/AD-Tickets');
var AD_TicketsLifeCycle = require('../models/AD-TicketsLifeCycle')
var EU_Users = require('../models/EU-Users')
var SP_Users = require('../models/SP-Users')


// --- Begining of EU-UserSupportDAO

module.exports = {

  createSupportData: function (euSupportObj, reqBody, callback) {
    euSupportObj.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-konwn Error occured in daos/SupportDAO.js,' +
          ' at createSupportData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        euTicketLifeCycle(reqBody, resObj, function (ticketObj) {
        })
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    })
  },

  getEuDetails: function (reqBody, callback) {
    var query = {
      'mobileNumber': reqBody.reqMobileNumber
    };
    EU_Users.findOne(query).exec(function (err, resultObj) {
      if (err) {
        logger.error('There was an Un-konwn Error occured in daos/SupportDAO.js,' +
          ' at getEuDetails:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resultObj && resultObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resultObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    })
  },

  createTicketData: function (spSupportObj, reqBody, callback) {
    spSupportObj.save(function (error, resObj) {
      if (error) {
        logger.error('There was an Un-konwn Error occured in daos/SupportDAO.js,' +
          ' at createTicketData:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        euTicketLifeCycle(reqBody, resObj, function (ticketObj) {
        })
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    })
  },

  getSpDetails: function (reqBody, callback) {
    var query = {
      'mobileNumber': reqBody.reqMobileNumber
    };
    SP_Users.findOne(query).exec(function (err, resultObj) {
      if (err) {
        logger.error('There was an Un-konwn Error occured in daos/SupportDAO.js,' +
          ' at getSpDetails:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resultObj && resultObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resultObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    })
  }
};

// --- Ending of EU-UserHomeDAO

/**
 * @param {object} body object
 * @param {function} callback is a callback function
 */
function euTicketLifeCycle(reqBody, resObj, callback) {
  var currentUTC = CommonService.currentUTCObj();
  let euCreateticketLifeCycleData = {
    adTicketId: resObj._id,
    euUserId: resObj._id,
    euName: resObj.euName,
    reqMobileNumber: reqBody.reqMobileNumber,
    reqEmail: reqBody.reqEmail,
    ticketNumType: resObj.ticketNumType,
    ticketTitle: reqBody.ticketTitle,
    ticketDescription: reqBody.ticketDescription,
    ticketNumber: resObj.ticketNumber,
    ticketStatus: 'New',
    assignStatus: 'Unassigned',
    ticketGroup: 'Marketing',
    ticketPriority: 'Medium',
    ticketTag: reqBody.ticketTag,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdBy: 'superadmin',
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedBy: 'superadmin',
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedOn: currentUTC.currentUTCDateTimeString
  }
  let euCreateTicketObj = new AD_TicketsLifeCycle(euCreateticketLifeCycleData)
  euCreateTicketObj.save(function (error, TicketLifeCycleresObj) {
    if (error) {
      callback({ httpCode: 400, statusCode: '9999', result: {} });
    } else if (TicketLifeCycleresObj && TicketLifeCycleresObj._id) {
      callback({ httpCode: 200, statusCode: '0000', result: TicketLifeCycleresObj })
    } else {
      callback({ httpCode: 400, statusCode: '9999', result: {} });
    }
  })
}

 // End: UserSupportDAO
