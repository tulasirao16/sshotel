/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */
var CommonService = require('./CommonService');
var Messages = require('../models/EU-Messages');
var AD_TicketsDAO = require('../daos/AD-TicketsDAO');
var logger = require('../lib/logger');
var moment = require('moment');
var async = require('async');
var AD_TicketsLifeCycle = require('../models/AD-TicketsLifeCycle');

module.exports = {
    getADTicketsData: function(tokenDecodedData, byDateType, callback) {
      var utcMoment = moment.utc();
      var istMoment = utcMoment.add(5, 'hours'). add(30, 'minutes');
      var userStartDate = '';
      var userStartTime = '';
      var startUTCDateTimeNumber = 0;
      async.series([
        function(callback) {
            switch (byDateType) {
                case 'Today':
                  userStartDate = istMoment.startOf('day');
                  userStartTime = userStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                  startUTCDateTimeNumber = moment(userStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
                  callback(startUTCDateTimeNumber);
                  break;
                case 'Week':
                  userStartDate = istMoment.startOf('week');
                  userStartTime = userStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                  startUTCDateTimeNumber = moment(userStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
                  callback(startUTCDateTimeNumber);
                  break;
                case 'Month':
                  userStartDate = istMoment.startOf('month');
                  userStartTime = userStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                  startUTCDateTimeNumber = moment(userStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
                  callback(startUTCDateTimeNumber);
                  break;
                case 'Year':
                  userStartDate = istMoment.startOf('year');
                  userStartTime = userStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                  startUTCDateTimeNumber = moment(userStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
                  callback(startUTCDateTimeNumber);
                  break;
                default:
                  userStartDate = istMoment.startOf('day');
                  userStartTime = userStartDate.add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                  startUTCDateTimeNumber = moment(userStartTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
                  callback(startUTCDateTimeNumber);
                  break;
            }
        }
      ], function (err, result) {
        if(err) {
            logger.error('There was an Un-known Error occured in daos/AD-TicketsService.js, at getADTicketsData:', err);
        }
        var query = {
            getADTicketsByStatusQuery: {
                isDeleted: false,
                createdAt: {$gte: startUTCDateTimeNumber},
                ticketStatus: { $in: [ 'New', 'Open', 'Inprogress', 'Resolved' ] }
            },
            getADTicketsQuery: {
                isDeleted: false,
                createdAt: {$gte: startUTCDateTimeNumber},
            },
        }
        AD_TicketsDAO.getADTicketsData(tokenDecodedData, query, function(resObj) {
            callback(resObj);
        });
      });
    },

    getADTicketsGetData: function(pageNum, searchString,tokenDecodedData, callback) {
      AD_TicketsDAO.getADTicketsGetData(pageNum, searchString,tokenDecodedData, function(resObj) {
          callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
      });
    },


    postADCreateTicketData: function(reqBody, tokenDecodedData, callback) {
      var currentUTC = CommonService.currentUTCObj();
      setADCreateTicketData(reqBody, tokenDecodedData, currentUTC, function(resObj) {
        callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
      });
    },

    getADTicketsUserDetails: function(mobileNumber, userType, tokenDecodedData, callback) {
      if (userType == 'End User Service') {
        AD_TicketsDAO.getADTicketsEndUserDetails(mobileNumber, function(resObj) {
            callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
        });
      } else {
        AD_TicketsDAO.getADTicketsSPUserDetails(mobileNumber, userType, function(resObj) {
            callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
        });
      }
    },

    putADTicketUpdate: function(recordID, body, decodedTokenData, callback) {
      var currentUTC = CommonService.currentUTCObj();
      var updateUserObj = {
        ticketPriority: body.ticketPriority,
        ticketStatus: body.ticketStatus,
        assignStatus: body.reassignStatus == 'true' ? 'Reassigned' : (body.adminUserId ? 'Assigned' : 'Unassigned'),
        adminUserId: body.adminUserId ? body.adminUserId : '',
        adminUserName: body.adminUserName ? body.adminUserName : '',
        notes: body.notes ? body.notes : '',
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedBy: decodedTokenData.ua,
        updatedOn: currentUTC.currentUTCDateTimeString,
      };
      AD_TicketsDAO.putADTicketUpdate(recordID, updateUserObj, decodedTokenData, function(resObj) {
        setADTicketLifeCycleObj(resObj, currentUTC, function(resObj) {
        });
        callback({httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result});
      });
    }

};

/**
 * @param {object} reqObj object
 * @param {object} tokenDecodedData object
 * @return {object} currentUTC object
 * @param {function} callback is a callback function
 */

function setADCreateTicketData(reqObj, tokenDecodedData, currentUTC, callback) {
  var ticketsObj = {
    euUserId: reqObj.euUserId ? reqObj.euUserId : '',
    euName: reqObj.euName ? reqObj.euName : '',
    spServiceProviderId: reqObj.spServiceProviderId ? reqObj.spServiceProviderId : '',
    spServiceProvider: reqObj.spServiceProvider ? reqObj.spServiceProvider : '',
    spUserId: reqObj.spUserId ? reqObj.spUserId : '',
    spName: reqObj.spName ? reqObj.spName : '',
    reqMobileNumber: reqObj.reqMobileNumber,
    reqEmail: reqObj.reqEmail ? reqObj.reqEmail : '',
    adminUserId: reqObj.adminUserId ? reqObj.adminUserId : '',
    adminUserName: reqObj.adminUserName ? reqObj.adminUserName : '',
    assignStatus: reqObj.assignStatus, // Uassigned, Assigned, Reassigned
    ticketTitle: reqObj.ticketTitle,
    ticketDescription: reqObj.ticketDescription,
    ticketNumber: reqObj.ticketNumber,
    ticketNumType: reqObj.ticketNumberType,
    // ticketBody: Object,
    ticketGroup: reqObj.ticketGroup,
    ticketTag: reqObj.ticketTag,
    ticketPriority: reqObj.ticketPriority,
    ticketStatus: reqObj.ticketStatus,
    notes: reqObj.notes ? reqObj.notes : '',
    isDeleted: false,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdBy: 'superadmin',
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedBy: 'superadmin',
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  AD_TicketsDAO.postADCreateTicketData(ticketsObj, tokenDecodedData, function(resObj) {
    if (resObj && resObj.result._id) {
      setADTicketLifeCycleObj(resObj, currentUTC, function(resObj) {
      });
    }
    callback(resObj);
  });
}



/**
 * @param {object} resObj object
 * @param {object} tokenDecodedData object
 * @return {object} currentUTC object
 * @param {function} callback is a callback function
 */

function setADTicketLifeCycleObj(resObj, currentUTC, callback) {
  
    var adTicketsLifeCycle = {
      adTicketId: resObj.result._id,

      euUserId: resObj.result.euUserId ? resObj.result.euUserId : '',
      euName: resObj.result.euName ? resObj.result.euName : '',
      spServiceProviderId: resObj.result.spServiceProviderId ? resObj.result.spServiceProviderId : '',
      spServiceProvider: resObj.result.spServiceProvider ? resObj.result.spServiceProvider : '',
      spUserId: resObj.result.spUserId ? resObj.result.spUserId : '',
      spName: resObj.result.spName ? resObj.result.spName : '',
      reqMobileNumber: resObj.result.reqMobileNumber,
      reqEmail: resObj.result.reqEmail ? resObj.result.reqEmail : '',

      adminUserId: resObj.result.adminUserId ? resObj.result.adminUserId : '',
      adminUserName: resObj.result.adminUserName ? resObj.result.adminUserName : '',
      assignStatus: resObj.result.assignStatus,
      ticketTitle: resObj.result.ticketTitle,
      ticketDescription: resObj.result.ticketDescription,
      ticketNumber: resObj.result.ticketNumber,
      ticketGroup: resObj.result.ticketGroup,
      ticketTag: resObj.result.ticketTag,
      ticketPriority: resObj.result.ticketPriority,
      ticketStatus: resObj.result.ticketStatus,
      notes: resObj.result.notes,
      isDeleted: false,
      createdBy: 'superadmin',
      createdAt: currentUTC.currentUTCDateTimeNumber,
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedBy: 'superadmin',
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    }
  var ticketsLifeCycleObj = new AD_TicketsLifeCycle(adTicketsLifeCycle);
  AD_TicketsDAO.postADTicketsLifeCycle(ticketsLifeCycleObj, function (resObj) {
  });
}