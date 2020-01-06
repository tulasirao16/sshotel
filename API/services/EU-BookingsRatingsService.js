/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
var commonService = require('./CommonService');
var EU_BookingsRatingsDAO = require('../daos/EU-BookingsRatingsDAO');

// --- Begin:  EndUsers Bookings Ratings Service
module.exports = { 

    getEndUsersBookingsRatings:function(searchString, tokendecodeddata, callback) {
        EU_BookingsRatingsDAO.getEndUsersBookingsRatings(searchString, tokendecodeddata, function(error, resObj) {
            if (error) {
                callback({httpCode: 500, statusCode: '9999', result: {}});
            } else if(resObj.statusCode === '0000') {
                callback({httpCode: 200, statusCode: resObj.statusCode, result: resObj.result});
            } else {
                callback({httpCode: 400, statusCode: resObj.statusCode, result: resObj.result});
            }
        });
    }
}