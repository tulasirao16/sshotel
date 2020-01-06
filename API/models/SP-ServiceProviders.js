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

// Define schema for 'Service Provider - ServiceProviders' model
var spServiceProvidersSchema = new Schema({
    _id: {type: String, default: uuid.v1},

    serviceProvider: {type: String, required: true, trim: true},
    serviceProviderIcon: {type: String, required: false, trim: true},
    serviceProviderIconOriginalName: {type: String, required: false, trim: true},
    serviceProviderIconPath: {type: String, required: false, trim: true},
    avgRating: {type: Number, required: false, trim: true},
    contactPerson: {type: String, required: true, trim: true},
    contactNumber: {type: String, required: true, unique: true, trim: true},
    alternateContactNumber: {type: String, required: false, trim: true},
    contactEmail: {type: String, required: true, unique: true, trim: true},
    alternateContactEmail: {type: String, required: false, trim: true},
    contactAddress: {type: String, required: true, trim: true},
    landmark: {type: String, required: false, trim: true},
    area: {type: String, required: false, trim: true},
    zip: {type: String, required: false, trim: true},
    city: {type: String, required: true, trim: true},
    state: {type: String, required: false, trim: true},
    status: {type: String, required: true, trim: true}, // Inactive, Active
    appPercentage: {type: String, default: '0'},
    preferences: {
        defaultLanguage: {type: String, default: 'English', trim: true},
        defaultTimezone: {type: String, default: 'IST - Indian Standard Time(UTC+05:30)', trim: true},
        defaultCurrency: {type: String, default: 'INR - Indian Rupee(₹)', trim: true},
        currencyFormat: {type: String, default: '#,###.##', trim: true},
        dateFormat: {type: String, default: 'MMM DD, YYYY', trim: true},
        rowsPerPage: {type: String, default: '20'}
    },

    notes: {type: String, required: false, trim: true},
    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

spServiceProvidersSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionSPServiceProviders, spServiceProvidersSchema);
