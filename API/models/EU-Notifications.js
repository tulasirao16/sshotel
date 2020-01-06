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

// Define schema for 'End Users - Notifications' model
var euNotificationsSchema = new Schema({
    _id: {type: String, default: uuid.v1},

    euUserId: {type: String, required: true, trim: true, ref: config.collectionEndUserUsers},
    euName: {type: String, required: true, trim: true},
    notificationTitle: {type: String, required: true, trim: true},
    notificationMessage: {type: String, required: true, trim: true},
    notificationUrl: {type: String, required: false, trim: true},
    notificationBody: Object, // {recordId: _id; type: User, Booking..;}
    notifWhatsAppRes: Object,
    status: {type: String, required: true, trim: true},

    isDeleted: {type: Boolean, default: false},
    createdBy: {type: String, required: true, trim: true},
    createdAt: {type: Number, required: true},
    createdOn: {type: String, required: true},
    updatedBy: {type: String, required: true, trim: true},
    updatedAt: {type: Number, required: true},
    updatedOn: {type: String, required: true}
});

euNotificationsSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionEndUserNotifications, euNotificationsSchema);
