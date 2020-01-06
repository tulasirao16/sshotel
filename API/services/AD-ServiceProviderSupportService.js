/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var AD_ServiceProviderSupportDAO = require('../daos/AD-ServiceProviderSupportDAO');
var AD_TicketsLifeCycle = require('../models/AD-TicketsLifeCycle');
var CommonService = require('../services/CommonService');

// BEGIN : AD-ServiceProviderSupportService
module.exports = {
  // BEGIN : getADHostSupportList
  getADHostSupportList: function (hostId, pageNumber, searchString,  callback) {
    AD_ServiceProviderSupportDAO.getADHostSupportList(hostId, pageNumber, searchString,  function (resObj) {
      callback(resObj);
    });
  },
  // END : getADHostSupportList

  // Begin : postADCreateHostSupportData
  postADCreateHostSupportData: function (reqBody,  callback) {
    var currentUTC = CommonService.currentUTCObj();
    setADHostSupportData(reqBody,  currentUTC, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // End : postADCreateHostSupportData

  // Begin : putADHostSupportUpdate
  putADHostSupportUpdate: function (supportId, body, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      ticketTitle: body.ticketTitle,
      ticketDescription: body.ticketDescription,
      ticketTag: body.ticketTag,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
    AD_ServiceProviderSupportDAO.putADHostSupportUpdate(supportId, updateObj, function (resObj) {
      if (resObj && resObj.result._id) {
        var adHostSupportLifeCycleObj = {
          adTicketId: resObj.result._id,
          euUserId: resObj.result.euUserId ? resObj.result.euUserId : '',
          euName: resObj.result.euName ? resObj.result.euName : '',
          spServiceProviderId: resObj.result.spServiceProviderId,
          spServiceProvider: resObj.result.spServiceProvider,
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
          ticketGroup: 'Host Service',
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
      var ADHostLifeCycleObj = new AD_TicketsLifeCycle(adHostSupportLifeCycleObj);
      AD_ServiceProviderSupportDAO.putADHostSupportLifeCycle(ADHostLifeCycleObj, function (resObj) {
      });
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // End : putADHostSupportUpdate

  // BEGIN : adSPHostSupportDelete
  adSPHostSupportDelete: function (supportId, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var updateObj = {
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedBy: tokenDecodedData.ua,
      updatedOn: currentUTC.currentUTCDateTimeString,
      isDeleted: true
    };
    AD_ServiceProviderSupportDAO.adSPHostSupportDelete(supportId, updateObj, tokenDecodedData, function (resObj) {
      callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  },
  // END : adSPHostSupportDelete 
}
// End : AD-ServiceProviderSupportService


/**
 * @param {object} reqObj object
 * @return {object} currentUTC object
 * @param {function} callback is a callback function
 */

function setADHostSupportData(reqObj,  currentUTC, callback) {
  var adHostSupportObj = {
    euUserId: reqObj.euUserId ? reqObj.euUserId : '',
    euName: reqObj.euName ? reqObj.euName : '',
    spServiceProviderId: reqObj.spServiceProviderId,
    spServiceProvider: reqObj.spServiceProvider,
    spUserId: reqObj.spUserId ? reqObj.spUserId : '',
    spName: reqObj.spName ? reqObj.spName : '',
    reqMobileNumber: reqObj.reqMobileNumber,
    reqEmail: reqObj.reqEmail ? reqObj.reqEmail : '',
    adminUserId: reqObj.adminUserId ? reqObj.adminUserId : '',
    adminUserName: reqObj.adminUserName ? reqObj.adminUserName : '',
    assignStatus: 'Unassigned',
    ticketTitle: reqObj.ticketTitle,
    ticketDescription: reqObj.ticketDescription,
    ticketNumType: reqObj.ticketNumType,
    ticketGroup: 'Host Service',
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
  AD_ServiceProviderSupportDAO.postADCreateHostSupportData(adHostSupportObj, function (resObj) {
    if (resObj && resObj.result._id) {
      setADHostSupportLifeCycleObj(resObj, currentUTC, function (resObj) {
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

function setADHostSupportLifeCycleObj(resObj, currentUTC, callback) {
  var adHostSupportLifeCycleObj = {
    adTicketId: resObj.result._id,
    euUserId: resObj.result.euUserId ? resObj.result.euUserId : '',
    euName: resObj.result.euName ? resObj.result.euName : '',
    spServiceProviderId: resObj.result.spServiceProviderId,
    spServiceProvider: resObj.result.spServiceProvider,
    spUserId: resObj.result.spUserId ? resObj.result.spUserId : '',
    spName: resObj.result.spName ? resObj.result.spName : '',
    reqMobileNumber: resObj.result.reqMobileNumber,
    reqEmail: resObj.result.resEmail ? resObj.result.resEmail : '',
    adminUserId: resObj.result.adminUserId ? resObj.result.adminUserId : '',
    adminUserName: resObj.result.adminUserName ? resObj.result.adminUserName : '',
    assignStatus: 'Unassigned',
    ticketTitle: resObj.result.ticketTitle,
    ticketDescription: resObj.result.ticketDescription,
    ticketNumber: resObj.result.ticketNumber,
    ticketNumType: resObj.result.ticketNumType,
    ticketGroup: 'Host Service',
    ticketTag: resObj.result.ticketTag,
    ticketPriority: 'Medium',
    ticketStatus: 'New',
    reqEmail: resObj.result.reqEmail,
    notes: resObj.result.notes ? resObj.result.notes : '',
    isDeleted: false,
    createdAt: currentUTC.currentUTCDateTimeNumber,
    createdBy: 'superadmin',
    createdOn: currentUTC.currentUTCDateTimeString,
    updatedAt: currentUTC.currentUTCDateTimeNumber,
    updatedBy: 'superadmin',
    updatedOn: currentUTC.currentUTCDateTimeString
  }
  var ADHostLifeCycleObj = new AD_TicketsLifeCycle(adHostSupportLifeCycleObj);
  AD_ServiceProviderSupportDAO.postADHostSupportLifeCycle(ADHostLifeCycleObj, function (resObj) {
  });
}
