/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var CommonService = require('../services/CommonService');
var AD_EndUsersBookingsHistoryService = require('../services/AD-EndUsersBookingsHistoryService');
var utils = require('../lib/util');
var logger = require('../lib/logger');

//Begin AD-EndUsersBookingsHistoryController
module.exports.controller = function (app, passport) {
    //Begin '/api/v1/ad/eu/user/bookings/history/byuserid/:euUserId/:bhType/:activePage/:searchString?'
    app.get('/api/v1/ad/eu/user/bookings/history/byuserid/:euUserId/:bhType/:activePage/:searchString?', function (req, res, next) {
        var pageNum = parseInt(req.params.activePage);
        var searchString = req.params.searchString == 'undefined' || !req.params.searchString ? '' : req.params.searchString;
        if (pageNum && req.headers.token && req.params.euUserId && req.params.bhType) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_EndUsersBookingsHistoryService.getADEUBookings(pageNum, req.params.euUserId, req.params.bhType, searchString, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                }
                else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-EndUsersBookingsHistoryController.js at get API -'+
                        '/api/v1/ad/eu/user/bookings/history/byuserid/:euUserId/:bhType/:activePage/:searchString?: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/AD-EndUsersBookingsHistoryController.js at get API -'+
                        '/api/v1/ad/eu/user/bookings/history/byuserid/:euUserId/:bhType/:activePage/:searchString?: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-EndUsersBookingsHistoryController.js at get API -'+
                ' /api/v1/ad/eu/user/bookings/history/byuserid/:euUserId/:bhType/:activePage/:searchString?: Missing Mandatory Fields');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    //End '/api/v1/ad/eu/user/bookings/history/byuserid/:euUserId/:bhType/:activePage/:searchString?'

    // Begin - '/api/v1/ad/eu/user/bookings/history/:recordId'
    app.put('/api/v1/ad/eu/user/bookings/history/:recordId', function (req, res, next) {
        var putBookingBody = bookingPutBodyValidation(req.body);
        if (putBookingBody && req.headers.token && req.params.recordId) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    AD_EndUsersBookingsHistoryService.putADEndUserBooking(req.body, req.params.recordId, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/AD-EndUsersBookingsHistoryController.js at post API -'+
                        '/api/v1/ad/eu/user/bookings/history/:recordId: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/AD-EndUsersBookingsHistoryController.js at post API -'+
                        '/api/v1/ad/eu/user/bookings/history/:recordId: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/AD-EndUsersBookingsHistoryController.js at post API -'+
                '/api/v1/ad/eu/user/bookings/history/:recordId: Missing Mandatory Fields');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // End -'/api/v1/ad/eu/user/bookings/history/:recordId'  
}
//End AD-EndUsersBookingsHistoryController

/**
* @param {object} reqBodyObj object
* @return {boolean} boolean
*/
function bookingPutBodyValidation(reqBodyObj) {
    if (reqBodyObj.bookingCode && reqBodyObj.euName && reqBodyObj.euMobileNumber && reqBodyObj.noOfAdults && reqBodyObj.noOfChilds
        && reqBodyObj.noOfRooms && reqBodyObj.totalDays && reqBodyObj.checkInDate && reqBodyObj.checkOutDate && reqBodyObj.bookingStatus
        && reqBodyObj.paymentMode && reqBodyObj.totalPrice && reqBodyObj.paymentStatus && reqBodyObj.bookingType) {
        return true;
    } else {
        return false;
    }
}