/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var AD_TicketsLifeCycle = require('../models/AD-TicketsLifeCycle');
var CommonService = require('../services/CommonService');
var AD_EndUsersSupportDAO = require('../daos/AD-EndUsersSupportDAO');


// BEGIN :AD-EndUsersSupportService
module.exports = {
  // BEGIN : getADEUSupportList
  getADEUSupportList: function (euUserId, pageNumber, searchString, callback) {
    AD_EndUsersSupportDAO.getADEUSupportList(euUserId, pageNumber, searchString,  function (resObj) {
      callback(resObj);
    });
  },
  // END : getADEUSupportList

  // Begin : postADEUSupportData
  postADEUSupportData: function (reqBody, callback) {
    var currentUTC = CommonService.currentUTCObj();
    setADEUSupportData(reqBody, currentUTC, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // End : postADEUSupportData

  // Begin : putADEUSupportUpdate
  putADEUSupportUpdate: function (supportId, body, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      ticketTitle: body.ticketTitle,
      ticketDescription: body.ticketDescription,
      ticketTag: body.ticketTag,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_EndUsersSupportDAO.putADEUSupportUpdate(supportId, updateObj, function (resObj) {
      if (resObj && resObj.result._id) {
        var adEUSupportLifeCycleObj = {
          adTicketId: resObj.result._id,
          euUserId: resObj.result.euUserId,
          euName: resObj.result.euName,
          spServiceProviderId: resObj.result.spServiceProviderId ? resObj.result.spServiceProviderId : '',
          spServiceProvider: resObj.result.spServiceProvider ? resObj.result.spServiceProvider : '',
          spUserId: resObj.result.spUserId ? resObj.result.spUserId : '',
          spName: resObj.result.spName ? resObj.result.spName : '',
          reqMobileNumber: resObj.result.reqMobileNumber,
          reqEmail: resObj.result.reqEmail ? resObj.result.reqEmail : '',
          adminUserId: resObj.result.adminUserId ? resObj.result.adminUserId : '',
          adminUserName: resObj.result.adminUserName ? resObj.result.adminUserName : '',
          assignStatus: 'Unassigned',
          ticketTitle: resObj.result.ticketTitle,
          ticketDescription: resObj.result.ticketDescription,
          ticketNumber: resObj.result.ticketNumber,
          ticketNumType: resObj.result.ticketNumType,
          ticketGroup: 'End User Service',
          ticketTag: resObj.result.ticketTag,
          ticketPriority: 'Medium',
          ticketStatus: 'New',
          notes: resObj.result.notes ? resObj.result.notes : '',
          isDeleted: false,
          createdAt: currentUTC.currentUTCDateTimeNumber,
          createdBy: 'superadmin',
          createdOn: currentUTC.currentUTCDateTimeString,
          updatedAt: currentUTC.currentUTCDateTimeNumber,
          updatedBy: 'superadmin',
          updatedOn: currentUTC.currentUTCDateTimeString
        }
      }
      var ADEULifeCycleObj = new AD_TicketsLifeCycle(adEUSupportLifeCycleObj);
      AD_EndUsersSupportDAO.putADEUSupportLifeCycle(ADEULifeCycleObj, function (resObj) {
      });
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // End : putADEUSupportUpdate

  // BEGIN : adEUSupportDelete
  adEUSupportDelete: function (supportId, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
      isDeleted: true
    };
    AD_EndUsersSupportDAO.adEUSupportDelete(supportId, updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // END : adEUSupportDelete 
}
// End :AD-EndUsersSupportService


/**
 * @param {object} reqObj object
 * @return {object} currentUTC object
 * @param {function} callback is a callback function
 */

function setADEUSupportData(reqObj,  currentUTC, callback) {
  var adEUSupportObj = {
    euUserId: reqObj.euUserId,
    euName: reqObj.euName,
    spServiceProviderId: reqObj.spServiceProviderId ? reqObj.spServiceProviderId : '',
    spServiceProvider: reqObj.spServiceProvider ? reqObj.spServiceProvider : '',
    spUserId: reqObj.spUserId ? reqObj.spUserId : '',
    spName: reqObj.spName ? reqObj.spName : '',
    reqMobileNumber: reqObj.reqMobileNumber,
    reqEmail: reqObj.reqEmail ? reqObj.reqEmail : '',
    adminUserId: reqObj.adminUserId ? reqObj.adminUserId : '',
    adminUserName: reqObj.adminUserName ? reqObj.adminUserName : '',
    assignStatus: 'Unassigned',
    ticketTitle: reqObj.ticketTitle,
    ticketNumType: reqObj.ticketNumType,
    ticketDescription: reqObj.ticketDescription,
    ticketGroup: 'End User Service',
    ticketTag: reqObj.ticketTag,
    ticketPriority: 'Medium',
    ticketStatus: 'New',
    notes: reqObj.notes ? reqObj.notes : '',
    isDeleted: false,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdBy: 'superadmin',
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedBy: 'superadmin',
    updatedOn: currentUTC.currentUTCDateTimeString
  };
  AD_EndUsersSupportDAO.postADEUSupportData(adEUSupportObj, function (resObj) {
    if (resObj && resObj.result._id) {
      setADEUSupportLifeCycleObj(resObj, currentUTC, function (resObj) {
      });
    }
    callback(resObj);
  });
}


/**
 * @param {object} resObj object
 * @return {object} currentUTC object
 * @param {function} callback is a callback function
 */

function setADEUSupportLifeCycleObj(resObj, currentUTC, callback) {
  var adEUSupportLifeCycleObj = {
    adTicketId: resObj.result._id,
    euUserId: resObj.result.euUserId,
    euName: resObj.result.euName,
    spServiceProviderId: resObj.result.spServiceProviderId ? resObj.result.spServiceProviderId : '',
    spServiceProvider: resObj.result.spServiceProvider ? resObj.result.spServiceProvider : '',
    spUserId: resObj.result.spUserId ? resObj.result.spUserId : '',
    spName: resObj.result.spName ? resObj.result.spName : '',
    reqMobileNumber: resObj.result.reqMobileNumber,
    reqEmail: resObj.result.reqEmail ? resObj.result.reqEmail : '',
    adminUserId: resObj.result.adminUserId ? resObj.result.adminUserId : '',
    adminUserName: resObj.result.adminUserName ? resObj.result.adminUserName : '',
    assignStatus: 'Unassigned',
    ticketNumber: resObj.result.ticketNumber,
    ticketTitle: resObj.result.ticketTitle,
    ticketDescription: resObj.result.ticketDescription,
    ticketNumType: resObj.result.ticketNumType,
    ticketGroup: 'End User Service',
    ticketTag: resObj.result.ticketTag,
    ticketPriority: 'Medium',
    ticketStatus: 'New',
    notes: resObj.result.notes ? resObj.result.notes : '',
    isDeleted: false,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdBy: 'superadmin',
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedBy: 'superadmin',
    updatedOn: currentUTC.currentUTCDateTimeString
  }
  var ADEULifeCycleObj = new AD_TicketsLifeCycle(adEUSupportLifeCycleObj);
  AD_EndUsersSupportDAO.postADEUSupportLifeCycle(ADEULifeCycleObj, function (resObj) {
  });
}
