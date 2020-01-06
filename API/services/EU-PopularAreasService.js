/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

// var logger = require('../lib/logger');
// var commonService = require('./CommonService');
var popularAreasData = require('../assets/lookups/popularAreas.json');


// --- Begin:  EndUsers Bookings  Service
module.exports = { 
  popularAreasInCity: function(reqObj, res, callback) {
    var getAreasArray = popularAreasData.areas.filter(area => (area.city === reqObj.city && area.state === reqObj.state));
    if(getAreasArray && getAreasArray.length > 1) {
        callback({ httpCode: 200, statusCode: '0000', result: getAreasArray });
    } else {
      callback({httpCode: 400, statusCode: '9950', result: {}});
    }
  },
}
