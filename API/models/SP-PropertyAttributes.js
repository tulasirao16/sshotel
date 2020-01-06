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

// Define schema for 'Sevice Provider - PropertyAttributes' model
var spPropertyAttributesSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    spId: {type: String, required: true, index: true, ref: config.collectionSPServiceProviders},
    propertyTypeId: {type: String, required: true, index: true, ref: config.collectionLookupsData},
    attributeTypeId: {type: String, required: true, index: true, ref: config.collectionSPPropertyAttributeTypes}, // House Type, Room Type, Bed Type, Bath Room Type, etc...LoV
    attributeName: {type: String, required: true, index: true, trim: true},
    attributeDescription: {type: String, required: true, trim: true},
    lookType: {type: String, required: false, trim: true},
    filedType: {type: String, required: false, trim: true}, // Text, List
    fieldDataType: {type: String, required: true, trim: true},
    fieldLength: {type: Number, required: true},
    fieldOrder: {type: Number, required: true},
    isFieldMandatory: {type: Boolean, default: false},
    isFieldUnique: {type: Boolean, default: false},
    isEnabled: {type: Boolean, default: true},
    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

spPropertyAttributesSchema.index({'$**': 'text'});
spPropertyAttributesSchema.index({spId: 1, propertyTypeId: 1, attributeType: 1, attributeName: 1}, {unique: true});

module.exports = mongoose.model(config.collectionSPPropertyAttributes, spPropertyAttributesSchema);
