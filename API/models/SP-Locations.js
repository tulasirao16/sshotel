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

// Define schema for 'Service Provider - Locations' model
var spLocationsSchema = new Schema({
    _id: {type: String, default: uuid.v1},

    spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: true},
    contactPerson: {type: String, required: true, trim: true},
    mobileNumber: {type: String, required: true, trim: true},
    alternateMobileNumber: {type: String, required: false, trim: true},
    email: {type: String, required: true, trim: true},
    address: {type: String, required: true, trim: true},
    landmark: {type: String, required: false, trim: true},
    area: {type: String, required: true, trim: true},
    areaLocality: {type: String, required: false, trim: true},
    zip: {type: String, required: true, trim: true},
    city: {type: String, required: true, trim: true},
    country: {type: String, required: true, trim: true},
    state: {type: String, required: true, trim: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    locationStatus: {type: String, required: true, trim: true},

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

spLocationsSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionSPLocations, spLocationsSchema);
