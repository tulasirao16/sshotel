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

// Define schema for 'End Users - Messages(Inbox)' model
var euMessagesSchema = new Schema({
   _id: {type: String, default: uuid.v1},
   messageBy: {type: String, required: true}, // End User, Service Provider, App Admin
   euUserId: {type: String, required: true, index: true, ref: config.collectionEndUserUsers},
   euName: {type: String, required: true, trim: true},
   spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
   spServiceProvider: {type: String, required: true},
   propertyId: {type: String, required: true, ref: config.collectionSPProperties},
   propertyTitle: {type: String, required: true, trim: true},
   propertyType: {type: String, required: true, trim: true},
   spUserId: {type: String, required: false, ref: config.collectionSPUsers},
   spName: {type: String, required: false},
   adminUserId: {type: String, required: false, ref: config.collectionSPUsers},
   adminName: {type: String, required: false},
   message: {type: String, required: true, trim: true},
   euReadStatus: {type: String, required: true, trim: true}, // Read, Un-Read
   spReadStatus: {type: String, required: true, trim: true}, // Read, Un-Read
   adminReadStatus: {type: String, default: 'Unread'}, // Read, Un-Read
   isEuDeleted: {type: Boolean, default: false},
   isSpDeleted: {type: Boolean, default: false},
   isAdminDeleted: {type: Boolean, default: false},
   isDeleted: {type: Boolean, default: false},
   createdBy: {type: String, required: false, trim: true},
   spCreatedBy: {type: String, required: false, trim: true},
   adminCreatedBy: {type: String, required: false, trim: true},
   createdAt: {type: Number, required: true},
   createdOn: {type: String, required: true},
   updatedBy: {type: String, required: false, trim: true},
   spUpdatedBy: {type: String, required: false, trim: true},
   adminUpdatedBy: {type: String, required: false, trim: true},
   updatedAt: {type: Number, required: true},
   updatedOn: {type: String, required: true}
});
euMessagesSchema.index({'$**': 'text'});
module.exports = mongoose.model(config.collectionEndUserMessages, euMessagesSchema);