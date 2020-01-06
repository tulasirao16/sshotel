/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var CommonService = require('./CommonService');
var AD_BookingHistoryDAO = require('../daos/AD-BookingHistoryDAO');
var EU_Users = require('../models/EU-Users');
var moment = require('moment');
// --- Begin: AD-BookingsHistoryService
module.exports = {
    // --- Begin getADBookingsHistoryService
    getADbookingSearch: function (decodedTokenData, pageNum, searchString, callback) {
        AD_BookingHistoryDAO.getADbookingSearch(decodedTokenData, pageNum, searchString, function (resObj) {
            callback(resObj);
        });
    },
    //--- End getADBookingsHistoryService
}
