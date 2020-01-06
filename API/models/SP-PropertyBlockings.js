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

// Define schema for 'Service Provider - PropertyChilds' model
var spPropertyChildsSchema = new Schema({
    _id: {type: String, default: uuid.v1},

    spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: true},
    spLocationId: {type: String, required: true, ref: config.collectionSPLocations},
    propertyId: {type: String, required: true, ref: config.collectionSPProperties},
    // propertyChildId: {type: String, required: false, ref: config.collectionSPPropertyChilds},

    blockingType: {type: String, required: true, trim: true},
    blockingFromDate: {type: String, required: false, trim: true},
    blockingFromDateNumber: {type: Number, required: false, trim: true},
    blockingToDate: {type: String, required: false, trim: true},
    blockingToDateNumber: {type: Number, required: false, trim: true},
    blockingDateStatus: {type: String, required: true, trim: true},

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

spPropertyChildsSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionSPPropertyBlockedDates, spPropertyChildsSchema);
