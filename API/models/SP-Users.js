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

// Define schema for 'Service Provider - Users' model
var spUserSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: true, trim: true},
    displayName: {type: String, required: true, trim: true, default: 'Guest'},
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: false, trim: true},
    name: {type: String, required: false, trim: true},
    gender: {type: String, required: false, trim: true},
    dob: {type: String, required: false, trim: true},
    dobNumber: {type: Number, required: false},
    area: {type: String, required: false, trim: true}, // Area or Village
    areaLocality: {type: String, required: false, trim: true}, // Area Locality or Mandal
    city: {type: String, required: false, trim: true}, // City or District
    state: {type: String, required: false, trim: true},
    zip: {type: String, required: false, trim: true},
    country: {type: String, required: false, trim: true},
    landMark: {type: String, required: false, trim: true},
    address: {type: String, required: true, trim: true},
    userIcon: {type: String, required: false, trim: true},
    userIconOriginalName: {type: String, required: false, trim: true},
    userIconPath: {type: String, required: false, trim: true},

    deviceNotifyToken: {type: String, required: false, trim: true},
    userAccount: {type: String, required: true, unique: true, trim: true},
    mobileNumber: {type: String, set: CommonService.encrypt, get: CommonService.decrypt, required: true, trim: true},
    alternateContactNumber: {type: String, set: CommonService.encrypt, required: false, trim: true},
    mbnVerifyStatus: {type: String, required: true, trim: true}, // Open, Processing, Verified
    email: {type: String, required: true, set: CommonService.encrypt, get: CommonService.decrypt, trim: true},
    alternateEmail: {type: String, set: CommonService.encrypt, required: false, trim: true},
    emailVerifyStatus: {type: String, required: true, trim: true}, // Open, Processing, Verified
    mPin: {type: String, required: false},
    mPinSalt: {type: String, required: false},
    password: {type: String, required: false},
    passwordSalt: {type: String, required: false},
    loginKey: {type: String, required: false}, // This field is used for user 1st time login token validation
    otp: {type: String, required: false},
    otpSalt: {type: String, required: false},
    userType: {type: String, required: true, trim: true}, // Owner, Employee
    userRole: {type: String, required: true, trim: true},
    userStatus: {type: String, required: true, trim: true},
    preferences: {
        defaultLanguage: {type: String, default: 'English', trim: true},
        defaultTimezone: {type: String, default: 'IST - Indian Standard Time(UTC+05:30)', trim: true},
        defaultCurrency: {type: String, default: 'INR - Indian Rupee(₹)', trim: true},
        currencyFormat: {type: String, default: '#,###.##', trim: true},
        dateFormat: {type: String, default: 'MMM DD, YYYY', trim: true},
        rowsPerPage: {type: String, default: '20'},
        allowNotifications: {type: Boolean, default: true}
    },
    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

spUserSchema.index({'$**': 'text'});
spUserSchema.index({spServiceProviderId: 1, mobileNumber: 1}, {unique: true});
spUserSchema.index({spServiceProviderId: 1, email: 1}, {unique: true});

module.exports = mongoose.model(config.collectionSPUsers, spUserSchema);
