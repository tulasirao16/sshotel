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

// Define schema for 'Service Provider - PropertyPrices' model
var spPropertyPricesSchema = new Schema({
    _id: {type: String, default: uuid.v1},

    spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: true},
    spLocationId: {type: String, required: true, ref: config.collectionSPLocations},
    propertyId: {type: String, required: true, ref: config.collectionSPProperties},
    // propertyChildId: {type: String, required: true, ref: config.collectionSPPropertyChilds},

    minBasePrice: {type: Number, required: true, trim: true},
    billingType: {type: String, required: true, trim: true}, // Hours, Days, Weeks, Months, Years
    basePrice: {type: Number, required: true, trim: true},
    currency: {type: String, required: true, trim: true},
    offers: {type: String, required: true, trim: true}, // Applied, NA
    discounts: {type: String, required: true, trim: true}, // Applied, NA
    checkInCredentials: {type: String, required: true, trim: true}, // Around the Clock, Specific Time
    checkInTime: {type: String, required: false, trim: true}, // 12 PM
    defaultCheckInTime: {type: String, required: true, trim: true}, // 01:00 PM
    checkOutTime: {type: String, required: false, trim: true},
    defaultCheckOutTime: {type: String, required: true, trim: true}, // 11:00 AM
    isDefault: {type: Boolean, default: false},

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

spPropertyPricesSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionSPPropertyPrices, spPropertyPricesSchema);
