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

// Define schema for 'End Users - BookingLifeCycle' model
var euBookingLifeCycleSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    bookingId: {type: String, required: true, ref: config.collectionEndUserBookings},
    euUserId: {type: String, ref: config.collectionEndUserUsers},
    spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
    spUserId: {type: String, required: false, ref: config.collectionSPUsers},
    spLocationId: {type: String, required: true, ref: config.collectionSPLocations},
    spPropertyId: {type: String, required: true, ref: config.collectionSPProperties},

    checkInDate: {type: String, required: true, trim: true},
    checkInDateNumber: {type: String, required: true},
    checkOutDate: {type: String, required: true, trim: true},
    checkOutDateNumber: {type: Number, required: true},
    bookingOldStatus: {type: String, required: false, trim: true},
    bookingNewStatus: {type: String, required: true, trim: true},

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

euBookingLifeCycleSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionEndUserBookingLifeCycle, euBookingLifeCycleSchema);
