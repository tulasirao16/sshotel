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

// Define schema for 'Feedback' model
var feedbackSchema = new Schema({
    _id: {type: String, default: uuid.v1},

    euUserId: {type: String, required: true, index: true, ref: config.collectionEndUserUsers},
    euName: {type: String, required: true, trim: true},
    spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: true},
    spUserId: {type: String, required: false, ref: config.collectionSPUsers},
    spName: {type: String, required: false},
    bookingCode: {type: String, required: true, ref: config.collectionEndUserBookings},

    feedbackType: {type: String, required: true, trim: true}, // Service, Neatness, etc...
    feedbackOtherType: {type: String, required: false, trim: true},
    feedbackTitle: {type: String, required: false, trim: true},
    feedbackMessage: {type: String, required: false, trim: true},
    feedbackStatus: {type: String, required: true, trim: true}, // Inactive, Active, Hold/Block

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

feedbackSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionFeedback, feedbackSchema);
