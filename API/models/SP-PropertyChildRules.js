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

// Define schema for 'Service Provider - PropertyChildRules' model
var spPropertyChildRulesSchema = new Schema({
    _id: {type: String, default: uuid.v1},

    spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: true},
    spLocationId: {type: String, required: true, ref: config.collectionSPLocations},
    propertyId: {type: String, required: true, ref: config.collectionSPProperties},
    propertyTitle: {type: String, required: true, trim: true},
    propertyType: {type: String, required: true, trim: true},
    propertyInfoId: {type: String, required: true, ref: config.collectionSPPropertyInfos},
    // propertyChildId: {type: String, required: true, ref: config.collectionSPPropertyChilds},

    ruleId: {type: String, required: true, trim: true},
    ruleName: {type: String, required: true, trim: true},
    ruleIconPath: {type: String, required: false, trim: true},
    ruleOrder: {type: String, required: true, trim: true},
    ruleStatus: {type: String, required: true, trim: true}, // Active, Inactive

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

spPropertyChildRulesSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionSPPropertyChildRules, spPropertyChildRulesSchema);
