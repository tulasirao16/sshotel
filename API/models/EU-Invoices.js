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

// Define schema for 'End Users - Invoices' model
var euInvoicesSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    euUserId: {type: String, required: true, index: true, ref: config.collectionEndUserUsers},
    euName: {type: String, required: true, trim: true},
    spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: true},
    spUserId: {type: String, required: false, ref: config.collectionSPUsers},
    spName: {type: String, required: false},
    euBookingId: {type: String, required: false, ref: config.collectionEndUserBookings},
    euBookingCode: {type: String, required: true},
    euBookingPaymentId: {type: String, required: false, ref: config.collectionEndUserBookingPayments},

    invoiceCode: {type: String, required: true},
    invoiceDate: {type: String, required: true},
    invoiceDateNumber: {type: Number, required: true},

    PAYMENT_TERMS,
    BILLTO_ADDRESS_LINE1,
    BILLTO_ADDRESS_LINE2,
    BILLTO_ADDRESS_CITY,
    BILLTO_ADDRESS_STATE,
    BILLTO_ADDRESS_ZIP,
    BILLTO_ADDRESS_COUNTRY,
    BILLTO_PHONE,
    BILLTO_EMAIL,
    REMITTO_ADDRESS_LINE1,
    REMITTO_ADDRESS_LINE2,
    REMITTO_ADDRESS_CITY,
    REMITTO_ADDRESS_STATE,
    REMITTO_ADDRESS_ZIP,
    REMITTO_ADDRESS_COUNTRY,
    REMITTO_PHONE,
    REMITTO_EMAIL,
    CUSTOMER_CONTACT_EMAIL,
    COMPANY_CONTACT_EMAIL,
    INVOICE_SUB_TOTAL,
    INVOICE_TAXES,
    INVOICE_DISCOUNTS,
    INVOICE_SURCHARGES,
    INVOICE_GRAND_TOTAL,

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

euInvoicesSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionEndUserInvoices, euInvoicesSchema);
