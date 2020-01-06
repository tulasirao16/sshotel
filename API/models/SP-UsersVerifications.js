/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var CommonService = require('../services/CommonService');

mongoose.createConnection(config.mongoDBConnection, {useUnifiedTopology: true, useNewUrlParser: true});
var Schema = mongoose.Schema;

// Define schema for 'Service Provider - UsersVerifications' model
var spUsersVerificationsSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    // name: {type: String, required: false, trim: true},
    mobileNumber: {type: String, set: CommonService.rsaEncrypt, get: CommonService.rsaDecrypt, required: false, trim: true},
    mbnSign: {type: String, set: CommonService.rsaHashAndSign, required: false, trim: true},
    mbnVerifyStatus: {type: String, required: false, trim: true}, // Open, Processing, Verified
    mbnOtp: {type: String, required: false, trim: true},
    mbnOtpSalt: {type: String, required: false, trim: true},
    email: {type: String, set: CommonService.rsaEncrypt, get: CommonService.rsaDecrypt, required: false, trim: true},
    emailSign: {type: String, set: CommonService.rsaHashAndSign, required: false, trim: true},
    emailVerifyStatus: {type: String, required: false, trim: true}, // Open, Processing, Verified
    emailOtp: {type: String, required: false, trim: true},
    emailOtpSalt: {type: String, required: false, trim: true},
    // isUserCreated: {type: Boolean, default: false},
    // notes: {type: String, required: false, trim: true},
    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

spUsersVerificationsSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionSPUsersVerifications, spUsersVerificationsSchema);
