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

// Define schema for 'Service Provider - Properties' model
var spPropertiesSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    name: {type: String, required: true, trim: true},

    spServiceProviderId: {type: String, required: true, ref: config.collectionSPServiceProviders},
    spServiceProvider: {type: String, required: true},
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
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
    },
    nearestAreas: [
        {type: String, required: false, trim: true}
    ],
    imageOriginalName: {type: String, required: true, trim: true},
    imageName: {type: String, required: true, trim: true},
    imagePath: {type: String, required: true, trim: true},
    propertyTitle: {type: String, required: true, trim: true},
    aboutProperty: {type: String, required: false, trim: true},
    propertyType: {type: String, required: true, trim: true}, // Hotel, Single Bed Room, 1BHK, Double Bed Room, 2BHK, Apartment, etc...
    propertyCapacity: {type: Number, required: true, trim: true},
    rating: {type: Number, required: false, trim: true},
    propertyFacingDirection: {type: String, required: false, trim: true},
    numFloors: {type: Number, required: false, trim: true},
    numRooms: {type: Number, required: false, trim: true},
    activeNumRooms: {type: Number, required: false, trim: true},
    onHoldNumRooms: {type: Number, required: false, trim: true},
    inactiveNumRooms: {type: Number, required: false, trim: true},
    status: {type: String, required: true, trim: true},
    isDefault: {type: Boolean, default: false},

    singleBedsCount: {type: Number, required: false, trim: true},
    doubleBedsCount: {type: Number, required: false, trim: true},
    kingBedsCount: {type: Number, required: false, trim: true},
    queenBedsCount: {type: Number, required: false, trim: true},
    bunkBedsCount: {type: Number, required: false, trim: true},
    // beds: [{
    //     bedType: {type: String, required: false, trim: true}, // Single Bed, Double Bed, Bunk Bed
    //     bedCapacity: {type: String, required: false, trim: true},
    //     bedsCount: {type: String, required: false, trim: true}
    // }],
    privateBathRooms: {type: Number, required: false, trim: true}, // Count
    commonBathRooms: {type: Number, required: false, trim: true}, // Count
    kitchensCount: {type: Number, required: false, trim: true}, // Count,
    hallsCount: {type: Number, required: false, trim: true}, // Count
    sofasCount: {type: Number, required: false, trim: true}, // Count,
    chairsCount: {type: Number, required: false, trim: true}, // Count,
    teapoiesCount: {type: Number, required: false, trim: true}, // Count,
    fansCount: {type: Number, required: false, trim: true}, // Count,
    acsCount: {type: Number, required: false, trim: true}, // Count,

    nearBy: {type: String, required: false, trim: true},
    guestFreedomNotes: {type: String, required: false, trim: true},
    propertyFreedomNotes: {type: String, required: false, trim: true},
    guestRulesNotes: {type: String, required: false, trim: true},
    propertyRulesNotes: {type: String, required: false, trim: true},

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdById: {type: String, required: true, trim: true, ref: config.collectionSPUsers},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedById: {type: String, required: true, trim: true, ref: config.collectionSPUsers},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

spPropertiesSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionSPProperties, spPropertiesSchema);
