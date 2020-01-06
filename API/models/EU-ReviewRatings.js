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

// Define schema for 'End Users - ReviewRatings' model
var euReviewRatingsSchema = new Schema({
    _id: {type: String, default: uuid.v1},

    euUserId: {type: String, required: true, index: true, ref: config.collectionEndUserUsers},
    euName: {type: String, required: true, trim: true},
    spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: true},
    spLocationId: {type: String, required: true, ref: config.collectionSPLocations},
    spPropertyId: {type: String, required: true, ref: config.collectionSPProperties},
    spPropertyInfoId: {type: String, required: true, ref: config.collectionSPPropertyInfos},
    bookingId: {type: String, required: false, ref: config.collectionEndUserBookings},
    bookingCode: {type: String, required: true},

    rating: {type: Number, required: true},
    reviewHeadline: {type: String, required: true, trim: true},
    reviewComments: {type: String, required: true, trim: true},
    reviewStatus: {type: String, required: true, trim: true}, // Inactive, Active, Hold/Block

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

euReviewRatingsSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionEndUserReviewRatings, euReviewRatingsSchema);
