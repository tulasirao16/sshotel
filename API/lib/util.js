/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var conf = require('./configuration');

var responseTemplate = {
    statusCode: '1',
    statusMessage: 'Success',
    statusResult: {}
};

exports.sendResponse = function(response, httpCode, statusCode, statusResult) {
    responseTemplate.statusCode = statusCode;
    responseTemplate.statusMessage = conf.get(statusCode);
    if (statusResult != null || !statusResult) {
        responseTemplate.statusResult = statusResult;
    } else {
        responseTemplate.statusResult = {};
    }
    response.status(httpCode).send(responseTemplate);
};

