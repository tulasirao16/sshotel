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

// Define schema for 'End Users - BookingPayments' model
var euBookingPaymentsSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    bookingId: {type: String, ref: config.collectionEndUserBookings},
    euUserId: {type: String, ref: config.collectionEndUserUsers},
    spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: false, trim: true},
    spUserId: {type: String, required: false, ref: config.collectionSPUsers},
    spName: {type: String, required: false},

    uiToken: {type: String, required: false, trim: true},
    uiAuthObj: {type: String, required: false, set: CommonService.encrypt, trim: true},
    uiData: {type: String, required: true, set: CommonService.encrypt, get: CommonService.decrypt, trim: true},
    paymentData: {type: Object, required: true, trim: true},
    paymentUrl: {type: String, required: true, set: CommonService.encrypt, get: CommonService.decrypt, trim: true},
    paymentCode: {type: String, required: true, set: CommonService.encrypt, trim: true},
    paymentStatus: {type: String, required: true, trim: true}, // Success, Pending, Failed, Canceled
    mobileAppUri: {type: String, required: false, trim: true},

    txnID: {type: String, required: true, trim: true},
    paymentResponse: Object,
    paymentResMode: {type: String, required: false, set: CommonService.encrypt, trim: true}, // Credit/Debit card, Netbanking, Cash on Delivery, Paytm,
    paymentResModeCode: {type: String, required: false, set: CommonService.encrypt, trim: true}, // CC, DC, NB, MW, CoD
    paymentResHash: {type: String, required: false, trim: true},
    paymentResGatewayStatus: {type: String, required: false, trim: true},
    paymentResStatus: {type: String, required: false, trim: true},

    paymentWebhookResponse: Object,
    paymentID: {type: String, required: false, trim: true},
    merchantTransactionID: {type: String, required: false, trim: true},

    amount: {type: Number, required: false, trim: true},
    totalAmount: {type: Number, required: false, trim: true},
    appTotalAmount: {type: Number, required: false, trim: true},
    spTotalAmount: {type: Number, required: false, trim: true},
    status: {type: String, required: false, trim: true},
    paymentMode: {type: String, required: false, set: CommonService.encrypt, trim: true},
    euEmail: {type: String, required: false, set: CommonService.encrypt, trim: true},
    euPhone: {type: String, required: false, set: CommonService.encrypt, trim: true},
    euName: {type: String, required: false, trim: true},
    productInfo: {type: String, required: false, trim: true},
    additionalCharges: {type: String, required: false, trim: true},
    errorMessage: {type: String, required: false, trim: true},
    splitInfo: {type: String, required: false, trim: true},
    notificationID: {type: String, required: false, trim: true},
    hash: {type: String, required: false, trim: true},

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

euBookingPaymentsSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionEndUserBookingPayments, euBookingPaymentsSchema);
