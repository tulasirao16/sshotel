/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var conf = require('nconf');
conf.argv().env();

conf.update = function() {
    conf.file('config/statusCodes.js');
    return;
};

conf.update();

module.exports = conf;
