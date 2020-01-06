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

// Define schema for 'Service Provider - Property Info' model
var spPropertyInfoSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    // name: {type: String, required: true, trim: true},

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
        longitude: {type: Number, required: true}
    },
    nearestAreas: [
        {type: String, required: false, trim: true}
    ],
    propertyId: {type: String, required: true, ref: config.collectionSPProperties},
    propertyTitle: {type: String, required: true, trim: true},
    propertyType: {type: String, required: true, trim: true},

    rentType: {type: String, required: true, trim: true}, // Sharing Room, Private Room, Entire Space
    roomCategory: {type: String, required: true, trim: true}, // Economy, Delux, Luxury
    roomType: {type: String, required: true, trim: true}, // Single Bed Room, 1BHK, double bed room, bath room, hall, kitchen
    rating: {type: Number, required: false, trim: true},
    membersCapacity: {type: Number, required: true, trim: true}, // 3 Members
    childsCapacity: {type: Number, required: true, trim: true}, // 3 Members
    infantsCapacity: {type: Number, required: false, trim: true}, // 3 Members
    roomsName: {type: String, required: false, trim: true}, // 201
    roomsCount: {type: Number, required: true, trim: true},
    activeRoomsCount: {type: Number, required: true, trim: true},
    inactiveRoomsCount: {type: Number, required: true, trim: true},
    onHoldRoomsCount: {type: Number, required: false, trim: true},
    status: {type: String, required: true, trim: true}, // Active, Inactive

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

   
pricing: {
    minBasePriceUnit: {type: String, required: true, trim: true}, // 4 Hours, 6 Hours, 8 Hours, 12 Hours, 16 Hours, Per Day, Per Month, Per Year
    minBasePriceUnitValue: {type: Number, required: true, trim: true}, // In hours only 4, 6, 8, 12, 16, 22, 7*24 - 2, 30*24-2
    minBasePrice: {type: Number, required: true, trim: true},
    minBasePrice2: {type: Number, required: true, trim: true},
    minBasePrice3: {type: Number, required: true, trim: true},
    minBasePrice4: {type: Number, required: true, trim: true},
    weekEndMinBasePrice: {type: Number, required: true, trim: true},
    weekEndMinBasePrice2: {type: Number, required: true, trim: true},
    weekEndMinBasePrice3: {type: Number, required: true, trim: true},
    weekEndMinBasePrice4: {type: Number, required: true, trim: true},
    billingType: {type: String, required: true, trim: true}, // Per Hour, Per Day, Per Week, Per Month, Per Year
    basePrice: {type: Number, required: true, trim: true},
    basePriceDiscount: {type: String, default: '0'},
    weekEndBasePrice: {type: Number, required: true, trim: true},
    weekEndBasePriceDiscount: {type: String, default: '0'},
    serviceCharges: {type: Number, default: 0},
    otherCharges: {type: Number, default: 0},
    currency: {type: String, required: true, trim: true},
    // offers: {type: String, required: true, trim: true}, // Applied, NA
    // discounts: {type: String, required: true, trim: true}, // Applied, NA
    checkInCredentials: {type: String, required: true, trim: true}, // Around the Clock, Specific Time
    checkInTime: {type: String, required: false, trim: true}, // 01:00 PM
    // defaultCheckInTime: {type: String, required: true, trim: true}, // 01:00 PM
    checkOutTime: {type: String, required: false, trim: true}, // 11:00 AM
    // defaultCheckOutTime: {type: String, required: true, trim: true}, // 11:00 AM
    durationTimeHrs:{type: Number, default: 0},
    fullRefundCancelTime: {type: String, default: '32'},
    refundCancelTime: {type: String, default: '6'},
    refundCancelPercentage: {type: String, default: '60'},
    cgstPercentage: {type: String, default: '0'},
    // cgstAmount: {type: Number, default: 0}, // GST on base price - discount
    sgstPercentage: {type: String, default: '0'},
    // sgstAmount: {type: Number, default: 0}, // GST on base price - discount
    appPercentage: {type: String, default: '0'},
    appCharges: {type: Number, default: 0},
    weekEndAppCharges: {type: Number, default: 0},
    minBaseAppCharges: {type: Number, default: 0},
    minBaseHrsAppCharges: {type: Number, default: 0},
    minBaseAppCharges2: {type: Number, default: 0},
    minBaseHrsAppCharges2: {type: Number, default: 0},
    minBaseAppCharges3: {type: Number, default: 0},
    minBaseHrsAppCharges3: {type: Number, default: 0},
    minBaseAppCharges4: {type: Number, default: 0},
    minBaseHrsAppCharges4: {type: Number, default: 0},
    weekEndMinBaseAppCharges: {type: Number, default: 0},
    weekEndMinBaseHrsAppCharges: {type: Number, default: 0},
    weekEndMinBaseAppCharges2: {type: Number, default: 0},
    weekEndMinBaseHrsAppCharges2: {type: Number, default: 0},
    weekEndMinBaseAppCharges3: {type: Number, default: 0},
    weekEndMinBaseHrsAppCharges3: {type: Number, default: 0},
    weekEndMinBaseAppCharges4: {type: Number, default: 0},
    weekEndMinBaseHrsAppCharges4: {type: Number, default: 0},
    appPgPercentage: {type: String, default: '0'},
    spAmount: {type: Number, default: 0}, // base price - discount + service + other + GST
    weekEndSpAmount: {type: Number, default: 0},
    minBaseSpAmount: {type: Number, default: 0},
    minBaseHrsSpAmount: {type: Number, default: 0},
    minBaseSpAmount2: {type: Number, default: 0},
    minBaseHrsSpAmount2: {type: Number, default: 0},
    minBaseSpAmount3: {type: Number, default: 0},
    minBaseHrsSpAmount3: {type: Number, default: 0},
    minBaseSpAmount4: {type: Number, default: 0},
    minBaseHrsSpAmount4: {type: Number, default: 0},
    weekEndMinBaseSpAmount: {type: Number, default: 0},
    weekEndMinBaseHrsSpAmount: {type: Number, default: 0},
    weekEndMinBaseSpAmount2: {type: Number, default: 0},
    weekEndMinBaseHrsSpAmount2: {type: Number, default: 0},
    weekEndMinBaseSpAmount3: {type: Number, default: 0},
    weekEndMinBaseHrsSpAmount3: {type: Number, default: 0},
    weekEndMinBaseSpAmount4: {type: Number, default: 0},
    weekEndMinBaseHrsSpAmount4: {type: Number, default: 0},
    totalPrice: {type: Number, default: 0}, // spAmount + appCharges + paymentCharges
    weekEndTotalPrice: {type: Number, default: 0},
    minBaseTotalPrice: {type: Number, default: 0},
    minBaseHrsTotalPrice: {type: Number, default: 0},
    minBaseTotalPrice2: {type: Number, default: 0},
    minBaseHrsTotalPrice2: {type: Number, default: 0},
    minBaseTotalPrice3: {type: Number, default: 0},
    minBaseHrsTotalPrice3: {type: Number, default: 0},
    minBaseTotalPrice4: {type: Number, default: 0},
    minBaseHrsTotalPrice4: {type: Number, default: 0},
    weekEndMinBaseTotalPrice: {type: Number, default: 0},
    weekEndMinBaseHrsTotalPrice: {type: Number, default: 0},
    weekEndMinBaseTotalPrice2: {type: Number, default: 0},
    weekEndMinBaseHrsTotalPrice2: {type: Number, default: 0},
    weekEndMinBaseTotalPrice3: {type: Number, default: 0},
    weekEndMinBaseHrsTotalPrice3: {type: Number, default: 0},
    weekEndMinBaseTotalPrice4: {type: Number, default: 0},
    weekEndMinBaseHrsTotalPrice4: {type: Number, default: 0},
    grandTotalPrice: {type: Number, default: 0}, // spAmount + appCharges
    weekEndGrandTotalPrice: {type: Number, default: 0},
    minBaseGrandTotalPrice: {type: Number, default: 0},
    minBaseHrsGrandTotalPrice: {type: Number, default: 0},
    minBaseGrandTotalPrice2: {type: Number, default: 0},
    minBaseHrsGrandTotalPrice2: {type: Number, default: 0},
    minBaseGrandTotalPrice3: {type: Number, default: 0},
    minBaseHrsGrandTotalPrice3: {type: Number, default: 0},
    minBaseGrandTotalPrice4: {type: Number, default: 0},
    minBaseHrsGrandTotalPrice4: {type: Number, default: 0},
    weekEndMinBaseGrandTotalPrice: {type: Number, default: 0},
    weekEndMinBaseHrsGrandTotalPrice: {type: Number, default: 0},
    weekEndMinBaseGrandTotalPrice2: {type: Number, default: 0},
    weekEndMinBaseHrsGrandTotalPrice2: {type: Number, default: 0},
    weekEndMinBaseGrandTotalPrice3: {type: Number, default: 0},
    weekEndMinBaseHrsGrandTotalPrice3: {type: Number, default: 0},
    weekEndMinBaseGrandTotalPrice4: {type: Number, default: 0},
    weekEndMinBaseHrsGrandTotalPrice4: {type: Number, default: 0},
    wdTotalPrice: {type: Number, default: 0}, // without Discount
    weekEndWdTotalPrice: {type: Number, default: 0},
    minBaseWdTotalPrice: {type: Number, default: 0},
    minBaseHrsWdTotalPrice: {type: Number, default: 0},
    minBaseWdTotalPrice2: {type: Number, default: 0},
    minBaseHrsWdTotalPrice2: {type: Number, default: 0},
    minBaseWdTotalPrice3: {type: Number, default: 0},
    minBaseHrsWdTotalPrice3: {type: Number, default: 0},
    minBaseWdTotalPrice4: {type: Number, default: 0},
    minBaseHrsWdTotalPrice4: {type: Number, default: 0},
    weekEndMinBaseWdTotalPrice: {type: Number, default: 0},
    weekEndMinBaseHrsWdTotalPrice: {type: Number, default: 0},
    weekEndMinBaseWdTotalPrice2: {type: Number, default: 0},
    weekEndMinBaseHrsWdTotalPrice2: {type: Number, default: 0},
    weekEndMinBaseWdTotalPrice3: {type: Number, default: 0},
    weekEndMinBaseHrsWdTotalPrice3: {type: Number, default: 0},
    weekEndMinBaseWdTotalPrice4: {type: Number, default: 0},
    weekEndMinBaseHrsWdTotalPrice4: {type: Number, default: 0},
    isDefaultBasePrice: {type: Boolean, default: false},
    isDefaultMinBasePrice: {type: Boolean, default: false},
    isMidnightCheckOutAllowed: {type: Boolean, default: false}
},
    amenities: [{type: String, required: false, trim: true}],
    services: [{type: String, required: false, trim: true}],
    guestRules: [{type: String, required: false, trim: true}],

    // isDefault: {type: Boolean, default: false},
    guestFreedomNotes: {type: String, required: false, trim: true},
    propertyFreedomNotes: {type: String, required: false, trim: true},
    guestRulesNotes: {type: String, required: false, trim: true},
    propertyRulesNotes: {type: String, required: false, trim: true},

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

spPropertyInfoSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionSPPropertyInfos, spPropertyInfoSchema);
