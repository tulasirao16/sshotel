/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var mongoose = require('mongoose');
var uuid = require('node-uuid');

mongoose.createConnection(config.mongoDBConnection, {useUnifiedTopology: true, useNewUrlParser: true});

var Schema = mongoose.Schema;

// Define schema for 'End User - UsersLogs' model
var euUsersLogsSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    euUserId: {type: String, required: true, ref: config.collectionEndUserUsers},
    euName: {type: String, required: true, trim: true},
    appType: {type: String, required: true, trim: true}, // Web App, Mobile App
    deviceType: {type: String, required: true, trim: true}, // Desktop, Mobile, Tab
    deviceOs: {type: String, required: true, trim: true},
    deviceId: {type: String, required: false, trim: true},
    macAddress: {type: String, required: true, trim: true},
    ipAddress: {type: String, required: true, trim: true},
    browserName: {type: String, required: false, trim: true},
    browserVersion: {type: String, required: false, trim: true},
    userAgent: {type: String, required: true, trim: true},

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

euUsersLogsSchema.index({'$**': 'text'});


module.exports = mongoose.model(config.collectionEndUserUsersLogs, euUsersLogsSchema);
