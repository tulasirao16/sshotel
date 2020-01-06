/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.createConnection(config.mongoDBConnection, {useUnifiedTopology: true, useNewUrlParser: true});
var Schema = mongoose.Schema;

// Define schema for 'Admin - Tickets' model
var adTicketsSchema = new Schema({
    _id: {type: String, default: uuid.v1},

    euUserId: {type: String, required: false, ref: config.collectionEndUserUsers},
    euName: {type: String, required: false, trim: true},
    spServiceProviderId: {type: String, required: false, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: false},
    spUserId: {type: String, required: false, ref: config.collectionSPUsers},
    spName: {type: String, required: false},
    reqMobileNumber: {type: String, required: true},
    reqEmail: {type: String, required: false},

    adminUserId: {type: String, required: false, ref: config.collectionADUsers},
    adminUserName: {type: String, required: false},
    assignStatus: {type: String, required: true, trim: true}, // Uassigned, Assigned, Reassigned
    ticketTitle: {type: String, required: true, trim: true},
    ticketDescription: {type: String, required: true, trim: true},
    ticketNumType: {type: String, required: true, trim: true},
    ticketNumber: {type: Number, trim: true},
    ticketBody: Object,
    ticketGroup: {type: String, required: true, trim: true},
    ticketTag: {type: String, required: true, trim: true},
    ticketPriority: {type: String, required: true, trim: true},
    ticketStatus: {type: String, required: true, trim: true},
    notes: {type: String, required: false, trim: true},

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

adTicketsSchema.index({'$**': 'text'});
adTicketsSchema.plugin(AutoIncrement, {id: 'ticketNum_seq', inc_field: 'ticketNumber', reference_fields: ['ticketNumType'], start_seq: 100001 });
adTicketsSchema.path('ticketNumber', String);

module.exports = mongoose.model(config.collectionADTickets, adTicketsSchema);
