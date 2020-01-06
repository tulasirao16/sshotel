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

// Define schema for 'End Users - UsersKyc' model
var euUsersKycSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    euUserId: {type: String, required: true, index: true, ref: config.collectionEndUserUsers},
    euName: {type: String, required: true, trim: true},
    idType: {type: String, required: true, trim: true}, // Aadhar, Voter, Driving License, etc...
    idNumber: {type: String, required: true, trim: true},
    dobOnId: {type: String, required: false, trim: true},
    nameOnId: {type: String, required: true, trim: true},
    idStatus: {type: String, required: true, trim: true}, // Verified, Inprogress, Not-Verified
    kycStatus: {type: String, required: true, trim: true}, // Active, Inactive
    kycImage: {type: String, required: true, trim: true},
    kycImageOriginalName: {type: String, required: true, trim: true},
    kycImagePath: {type: String, required: true, trim: true},
    kycData: Object,

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

euUsersKycSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionEndUserUsersKyc, euUsersKycSchema);
