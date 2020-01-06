/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');
var SP_Notifications = require('../models/SP-Notifications');
var sendSMS = require('../config/sendSMS');

// BEGIN : AD-HostsNotificationsDAO
module.exports = {
    // BEGIN : getHostsNotifications
    getHostsNotifications: function (hostId, pageNumber, searchString, tokenDecodedData, callback) {
        var query = {
            'spServiceProviderId': hostId,
            'isDeleted': false,
            '$or': [
                { 'notificationTitle': { $regex: searchString, $options: 'i' } },
                { 'notificationMessage': { $regex: searchString, $options: 'i' } }
            ]
        };
        SP_Notifications.find(query)
            .populate('spUserId')
            .sort({ 'createdAt': -1 })
            .skip((pageNumber - 1) * 10)
            .limit(10)
            .exec(function (error, resObj) {
                if (error) {
                    logger.error('There was an Error occured in daos/AD-HostsNotificationsDAO.js at getADHostsNotifications', error);
                    callback({ httpCode: 500, statusCode: '9999', result: {} });
                } else if (resObj && resObj.length > 0) {
                    SP_Notifications.countDocuments(query).
                        exec(function (errorCount, resultCount) {
                            if (errorCount) {
                                logger.error('There was an Un-known Error occured in daos/AD-HostsNotificationsDAO.js, at getHostsNotifications:', errorCount);
                                callback({ httpCode: 500, statusCode: '9999', result: {} });
                            } else if (resultCount) {
                                var resultObj = { totalDocs: resultCount, notificationsData: resObj };
                                callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                            } else {
                                callback({ httpCode: 400, statusCode: '9997', result: {} });
                            }
                        });
                } else {
                    callback({ httpCode: 400, statusCode: '9997', result: {} });
                }
            });
    },
    // END : getHostsNotifications

    // BEGIN : hostsNotificationsDelete
    hostsNotificationsDelete: function (recordID, updateObj, tokenDecodedData, callback) {
        var query = {
            // 'spUserId': tokenDecodedData.iss,
            '_id': { '$in': recordID },
            'isDeleted': false
        };
        SP_Notifications.updateMany(query, { $set: updateObj }, function (error, resObj) {
            if (error) {
                logger.error('There was an Error occured in daos/AD-HostsNotificationsDAO.js at hostsNotificationsDelete', error);
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj && resObj.nModified >= 1) {
                AuditingInfoDAO.spAuditing(tokenDecodedData, 'Update Many', { name: config.collectionSPNotifications, id: resObj._id, value: 'Admin Hosts Notifications Delete' }, updateObj);
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9992', result: {} });
            }
        });
    },
    // END : hostsNotificationsDelete 

    // BEGIN : hostsNotificationsReadStatus   
    hostsNotificationsReadStatus: function (updateObj, recordID, tokenDecodedData, callback) {
        var query = { _id: recordID, isDeleted: false };
        SP_Notifications.findOneAndUpdate(query, { $set: updateObj }, { new: true }, function (error, resObj) {
            if (error) {
                logger.error('There was an Un-konwn Error occured in daos/AD_HostsNotificationsDAO.js, at updateADHostsNotificationsReadStatus:' + error);
                callback({ httpCode: 400, statusCode: '9900', result: {} });
            } else if (resObj && resObj._id) {
                AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', { name: config.collectionSPNotifications, id: resObj._id, value: 'Admin Hosts Notifications Read status' }, updateObj);
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9992', result: {} });
            }
        });
    },
    // END : hostsNotificationsReadStatus  
}

// END : AD-HostsNotificationsDAO