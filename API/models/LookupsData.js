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

// Define schema for 'LookupsData' model
var lookupsDataSchema = new Schema({
    _id: {type: String, default: uuid.v1},

    lookupType: {type: String, required: true, trim: true}, // App Specific, Universal
    lookupTypeName: {type: String, required: true, trim: true}, // Booking Statuses, Timezones
    lookupCode: {type: String, required: true, trim: true}, // IST
    lookupName: {type: String, required: true, trim: true}, // Indian Standard Time
    lookupValue: {type: String, required: true, trim: true}, // +05:30
    lookupDescription: {type: String, required: true, trim: true}, // IST - Indian Standard Time(UTC+05:30)
    lookupStatus: {type: String, required: true, trim: true}, // Active, Inactive

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

lookupsDataSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionLookupsData, lookupsDataSchema);
