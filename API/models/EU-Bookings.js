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

// Define schema for 'End Users - Bookings' model
var euBookingsSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    euUserId: {type: String, required: true, ref: config.collectionEndUserUsers},
    euName: {type: String, required: true},

    spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: false, trim: true},
    // spContactPerson:  {type: String, required: true, trim: true},
    // spContactNumber: {type: String, required: true, trim: true},
    // spContactEmail: {type: String, required: true, trim: true},
    // spLatitude: {type: Number, required: false},
    // spLongitude: {type: Number, required: false},
    spUserId: {type: String, required: false, ref: config.collectionSPUsers},
    spName: {type: String, required: false},

    spLocationId: {type: String, required: true, ref: config.collectionSPLocations},
    spLocationObj: {
        contactPerson: {type: String, required: true, trim: true},
        mobileNumber: {type: String, required: true, trim: true},
        alternateMobileNumber: {type: String, required: false, trim: true},
        email: {type: String, required: true, trim: true},
        address: {type: String, required: true, trim: true},
        landmark: {type: String, required: false, trim: true},
        area: {type: String, required: true, trim: true},
        areaLocality: {type: String, required: false, trim: true},
        zip: {type: String, required: true, trim: true},
        city: {type: String, required: true, trim: true},
        state: {type: String, required: true, trim: true},
        country: {type: String, default: 'India', trim: true},
        latitude: {type: String, required: true},
        longitude: {type: String, required: true},
    },
    spPropertyId: {type: String, required: true, ref: config.collectionSPProperties},
    spPropertyTitle: {type: String, required: true, trim: true},
    spPropertyType: {type: String, required: true, trim: true},
    spPropertyInfoId: {type: String, required: true, ref: config.collectionSPPropertyInfos},

    euName: {type: String, required: true, trim: true},
    euMobileNumber: {type: String, required: true, set: CommonService.encrypt, get: CommonService.decrypt, trim: true},
    euEmail: {type: String, required: false, set: CommonService.encrypt, trim: true},

    bookingCode: {type: String, required: true, unique: true, trim: true},
    bookingSecureCode: {type: String, required: true, trim: true},
    bookingSecureCodeAttempts: {type: Number, required: true, trim: true},
    noOfRooms: {type: Number, required: true, trim: true},
    checkInDate: {type: String, required: true, trim: true},
    checkInDateNumber: {type: Number, required: true},
    checkOutDate: {type: String, required: true, trim: true},
    checkOutDateNumber: {type: Number, required: true},
    noOfAdults: {type: Number, required: true, trim: true},
    noOfChilds: {type: Number, required: true, trim: true},
    totalHours: {type: Number, required: true, trim: true},
    totalDays: {type: Number, required: false, trim: true},
    totalNights: {type: Number, required: false, trim: true},
    totalWeeks: {type: Number, required: false, trim: true},
    totalMonths: {type: Number, required: false, trim: true},
    totalYears: {type: Number, required: false, trim: true},

    bookingType: {type: String, required: true, trim: true},
    appAmount: {type: Number, required: true, trim: true},
    appOtherCharges: {type: Number, default: 0}, // 0
    appDiscount: {type: Number, default: 0}, // 0
    appTotalAmount: {type: Number, required: true, trim: true}, // appAmount + appOtherCharges - appDiscount
    spAmount: {type: Number, required: true, trim: true},
    spOtherCharges: {type: Number, default: 0}, // 0
    spDiscount: {type: Number, default: 0}, // 0
    spTotalAmount: {type: Number, required: true, trim: true}, // spAmount + spOtherCharges - spDiscount
    grandTotal: {type: Number, required: true, trim: true}, // appTotalAmount  + spTotalAmount 100
    onlineCharges: {type: Number, required: true, trim: true},
    totalPrice: {type: Number, required: true, trim: true}, // grandTotal + onlineCharges
    
    appRefundAmount: {type: Number, required: false}, // appTotalAmount refund persontage
    spRefundAmount: {type: Number, required: false}, // spTotalAmount refund persontage
    totalRefundAmount: {type: Number, required: false}, // appRefundAmount  + spRefundAmount

    bookingStatus: {type: String, required: true, trim: true},
    paymentMode: {type: String, required: false, set: CommonService.encrypt, trim: true}, // Credit/Debit card, Netbanking, Paytm, Mobile Wallet
    paymentModeCode: {type: String, required: false, set: CommonService.encrypt, trim: true}, // CC, DC, NB, PTM, MW
    paymentHash: {type: String, required: false, trim: true},
    paymentGatewayStatus: {type: String, required: false, trim: true},
    paymentStatus: {type: String, required: true, trim: true}, // Paid, Partially Paid, Pending
    paymentUrl: {type: String, required: false, set: CommonService.encrypt, trim: true},
    paymentCode: {type: String, required: false, set: CommonService.encrypt, trim: true},

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

euBookingsSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionEndUserBookings, euBookingsSchema);
