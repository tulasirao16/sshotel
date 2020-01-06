/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var SP_Users = require('../models/SP-Users');
var SP_Properties = require('../models/SP-Properties');
var SP_UsersKyc = require('../models/SP-UsersKyc');

module.exports = {
    // --- Begin  updateADHostPropertyNearByAreasData:
    updateADHostPropertyNearByAreasData: function (upObj, proprtyID,tokenDecodedData, callback) {
      var query = {_id:proprtyID, isDeleted: false};
        SP_Properties.findOneAndUpdate(query, { $set: upObj }, {new: true}, function (error, resObj) {
            if (error) {
                logger.error('There was an Un-konwn Error occured in daos/AD-HostPropertyNearByAreasDAO.js, at updateADHostPropertyNearByAreasData:'+ error);
                callback({ httpCode: 400, statusCode: '9999', result: {} });
            } else if (resObj && resObj._id) {
               AuditingInfoDAO.adAuditing(tokenDecodedData, 'Update', {name: config.collectionSPServiceProviders, id: resObj._id, value: resObj.serviceProvider }, upObj);
                callback({ httpCode: 200, statusCode: '0000', result: resObj });
            } else {
                callback({ httpCode: 400, statusCode: '9992', result: {} });
            }
        });
    },
    // --- Ending  updateADHostPropertyNearByAreasData:
}