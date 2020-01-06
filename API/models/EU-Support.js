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

// Define schema for 'End Users - Support' model
var euSupportSchema = new Schema({
    _id: {type: String, default: uuid.v1},

    euUserId: {type: String, required: false, index: true, ref: config.collectionEndUserUsers},
    euName: {type: String, required: false, trim: true},
    spServiceProviderId: {type: String, required: false, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: false},
    spUserId: {type: String, required: false, ref: config.collectionSPUsers},
    spName: {type: String, required: false},
    adminUserId: {type: String, required: false},
    ticket: {type: String, required: true, trim: true},
    ticketDescription: {type: String, required: true, trim: true},
    ticketNumber: {type: String, required: false, trim: true},
    status: {type: String, required: true, trim: true},
    notes: {type: String, required: false, trim: true},

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

euSupportSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionEndUserSupport, euSupportSchema);
