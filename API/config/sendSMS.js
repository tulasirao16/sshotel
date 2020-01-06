/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var msg91 = require('msg91-sms');
var config = require('config');

const accountSid = config.twilioAccSID;
const authToken = config.twilioAuthToken;
// const client = require('twilio')(accountSid, authToken);

module.exports = {

    // --- Begin sendSMS: Code to send a SMS
    sendSMS: function(number, message, callback) {
        var dialCountryCode = '91';
        var authkey = config.msg91AuthKey;
        var senderID = config.smsMsg91SenderID;
        var route = config.smsMsg91TransactionalRoute;
        try {
            msg91.sendOne(authkey, number, message, senderID, route, dialCountryCode, function(response) {
                callback(null, response);
                // msg91.checkBalance(authkey, route, function(balance) {
                //     console.log('============checkBalanceResponse:', balance);
                // });
            });
        } catch(error) {
            logger.error('There was an Error in config/sendSMS.js, at sendSMS function:', error);
            callback(error, '');
        }
    },
    // --- End sendSMS: Code to send a SMS

    // sendWhatsApp: function(toNumber, message, callback) {
    //     client.messages.create({
    //         from: 'whatsapp:'+config.twilioWhatsAppNum, // +14155238886
    //         body: message,
    //         to: 'whatsapp:+91'+toNumber
    //     }).then(message => {
    //        // console.log('=====' + JSON.stringify(message));
    //        callback(message);
    //     });
    // }

};
