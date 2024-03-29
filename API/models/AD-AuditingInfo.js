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

// Define schema for 'Admin - AuditingInfo' model
var adAuditingInfoSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    adUserId: {type: String, required: true, ref: config.collectionADUsers},
    adName: {type: String, required: true},
    actionType: {type: String, required: true}, // Create, Update, Delete
    collectionName: {type: String, required: true},
    collectionId: {type: String, required: true},
    collectionValue: {type: String, required: true},
    keysValuesObj: { type: Object, required: true },

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

adAuditingInfoSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionADAuditingInfo, adAuditingInfoSchema);
