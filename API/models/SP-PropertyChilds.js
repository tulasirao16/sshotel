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

// Define schema for 'Service Provider - PropertyChilds' model
var spPropertyChildsSchema = new Schema({
    _id: {type: String, default: uuid.v1},

    spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: true},
    spLocationId: {type: String, required: true, ref: config.collectionSPLocations},
    spLocationObj: {
        contactPerson: {type: String, required: true, trim: true},
        mobileNumber: {type: String, required: true, trim: true},
        alternateMobileNumber: {type: String, required: true, trim: true},
        email: {type: String, required: true, trim: true},
        address: {type: String, required: true, trim: true},
        landmark: {type: String, required: false, trim: true},
        area: {type: String, required: true, trim: true},
        areaLocality: {type: String, required: false, trim: true},
        zip: {type: String, required: true, trim: true},
        city: {type: String, required: true, trim: true},
        state: {type: String, required: true, trim: true},
        latitude: {type: String, required: true},
        longitude: {type: String, required: true},
    },
    propertyId: {type: String, required: true, ref: config.collectionSPProperties},
    propertyTitle: {type: String, required: true, trim: true},
    propertyType: {type: String, required: true, trim: true},
    propertyInfoId: {type: String, required: true, ref: config.collectionSPPropertyInfos},

    singleBedsCount: {type: String, required: true, trim: true},
    doubleBedsCount: {type: String, required: true, trim: true},
    kingBedsCount: {type: String, required: true, trim: true},
    queenBedsCount: {type: String, required: true, trim: true},
    privateBathRooms: {type: String, required: false, trim: true}, // Count
    commonBathRooms: {type: String, required: false, trim: true}, // Count
    hallsCount: {type: String, required: false, trim: true}, // Count
    kitchensCount: {type: String, required: false, trim: true}, // Count,
    dainingCapacity: {type: String, required: false, trim: true}, // Count,
    sofaCount: {type: String, required: false, trim: true}, // Count,
    chairsCount: {type: String, required: false, trim: true}, // Count,
    teapoiesCount: {type: String, required: false, trim: true}, // Count,
    fansAvailable: {type: Boolean, default: true},
    acAvailable: {type: Boolean, default: true},

    roomNumber: {type: String, required: false, trim: true}, // 201
    roomName: {type: String, required: false, trim: true}, // 201
    roomStatus: {type: String, required: false, trim: true}, // Active
    floor: {type: String, required: false, trim: true}, // Ground, 1st, etc

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

spPropertyChildsSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionSPPropertyChilds, spPropertyChildsSchema);
