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

// Define schema for 'Sevice Provider - PropertyAttributeTypes' model
var spPropertyAttributeTypesSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    spId: {type: String, required: true, index: true, ref: config.collectionSPServiceProviders},
    propertyTypeId: {type: String, required: true, index: true, ref: config.collectionLookupsData},
    attributeType: {type: String, required: true, trim: true}, // House Type, Room Type, Bed Type, Bath Room Type, etc...LoV
    attributeOrder: {type: Number, required: true},
    isEnabled: {type: Boolean, default: true},
    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

spPropertyAttributeTypesSchema.index({'$**': 'text'});
spPropertyAttributeTypesSchema.index({spId: 1, propertyTypeId: 1, attributeType: 1}, {unique: true});

module.exports = mongoose.model(config.collectionSPPropertyAttributeTypes, spPropertyAttributeTypesSchema);
