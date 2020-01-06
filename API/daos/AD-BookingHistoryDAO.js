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
var EU_Bookings = require('../models/EU-Bookings');
// --- Begin: AD-BookingHistoryDAO
module.exports = {
    // --- Begin getADbookingsSearch
    getADbookingSearch: function (decodedTokenData, pageNum, searchString, callback) {
        var query = {
            'isDeleted': false,
            '$or': [
                { 'euName': { $regex: searchString, $options: 'i' } },
                { 'spPropertyTitle': { $regex: searchString, $options: 'i' } },
                { 'bookingCode': { $regex: searchString, $options: 'i' } },
                { 'bookingStatus': { $regex: searchString, $options: 'i' } },
                { 'euMobileNumber': { $regex: searchString, $options: 'i' } },
                { 'euEmail': { $regex: searchString, $options: 'i' } },
                { 'spLocationObj.area': { $regex: searchString, $options: 'i' } }
            ]
        };
        EU_Bookings.find(query)
        .populate('spPropertyId')
        .populate('euUserId')
        .populate('spServiceProviderId')
        .populate('spPropertyInfoId')
        .skip((pageNum - 1) * 20)
        .limit(20)
        .sort({ 'createdAt': -1 }).exec(function (error, resultArray) {
            if (error) {
                logger.error('There was an Un-known Error occured in daos/AD-BookingHistoryDAO.js, at getADbookingsSearch:' + error);
                callback({ httpCode: 500, statusCode: '9999', result: [] });
            } else if (resultArray && resultArray.length > 0) {
                var userArray = [];
                resultArray.forEach(function (userObj) {
                    var adUserObj = userObj;
                    var euUserId = userObj.euUserId;
                    var euUserDec = {
                        mobileNumber: userObj.euUserId.mobileNumber,
                        email: userObj.euUserId.email && userObj.euUserId.email.includes('@') ? userObj.euUserId.email : ''
                    }
                    var euUserIdObj = JSON.parse((JSON.stringify(euUserId) + JSON.stringify(euUserDec)).replace(/}{/g, ','))
                    var decObj = {
                        euMobileNumber: userObj.euMobileNumber,
                        paymentMode: userObj.paymentMode ? CommonService.decrypt(userObj.paymentMode) : '',
                        paymentModeCode: userObj.paymentModeCode ? CommonService.decrypt(userObj.paymentModeCode) : '',
                        euEmail: userObj.euEmail ? CommonService.decrypt(userObj.euEmail) : '',
                        paymentUrl: userObj.paymentUrl ? CommonService.decrypt(userObj.paymentUrl) : '',
                        paymentCode: userObj.paymentCode ? CommonService.decrypt(userObj.paymentCode) : ''                        
                    };
                    var resultObj = JSON.parse((JSON.stringify(adUserObj) + JSON.stringify(decObj) + JSON.stringify({euUserId: euUserIdObj})).replace(/}{/g, ','))
                    userArray.push(resultObj)
                });
                EU_Bookings.countDocuments(query).exec(function (errorCount, resultCount) {
                    if (errorCount) {
                        logger.error('There was an Un-known Error occured in daos/AD-BookingHistoryDAO.js, at getADbookingsSearch:' + errorCount);
                        var resultObj = { totalDocs: userArray.length, userData: userArray };
                        callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                    } else if (resultCount) {
                        var resultObj = { totalDocs: resultCount, userData: userArray };
                        callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                    } else {
                        var resultObj = { totalDocs: userArray.length, userData: userArray };
                        callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                    }
                });
            } else {
                callback({ httpCode: 400, statusCode: '9997', result: [] });
            }
        });
    },
    // --- End  getADbookingsSearch
}
// --- End: AD-BookingsHistoryDAO