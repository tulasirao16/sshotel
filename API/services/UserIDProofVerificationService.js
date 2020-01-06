/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var https = require('https');
var Request = require('request');
var logger = require('../lib/logger');

// --- Begin: UserIDProofVerificationService
module.exports = {

  drivingLicence: function(dlNumber, dob, callback) {
    const postData = {
      'dl_no': dlNumber, // 'TS02620190005094',
      'dob': dob, // '08-06-1991',
      'consent': 'Y',
      'consent_text': 'Driving Licence Validation Using DL Number and DoB with Nextgen'
    };

    // var options = {
    //   'method': 'POST',
    //   'hostname': 'https://preprod.aadhaarapi.com',
    //   'path': '/verify-dl',
    //   'headers': {
    //     'Content-Type': 'application/json',
    //     'qt_api_key': 'f0f87350-719d-4eea-980f-3988e8688854',
    //     'qt_agency_id': '6969afeb-e146-43ce-b91c-9b90f0164618'
    //   }
    // };
    // var req = https.request(options, function (res) {
    //   var chunks = [];

    //   res.on('data', function (chunk) {
    //     chunks.push(chunk);
    //   });

    //   res.on('end', function (chunks) {
    //     var body = Buffer.concat(chunks);
    //     console.log(body.toString());
    //   });

    //   res.on('error', function (error) {
    //     console.error(error);
    //   });
    // });

    // req.write(JSON.stringify(postData));
    // req.end();

    Request.post({
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'qt_api_key': 'f0f87350-719d-4eea-980f-3988e8688854',
        'qt_agency_id': '6969afeb-e146-43ce-b91c-9b90f0164618'
      },
      url: 'https://preprod.aadhaarapi.com/verify-dl',
      body: JSON.stringify(postData)
    }, function(error, response, body) {
      if(error) {
        logger.error('There was an Un-Known Error occured in UserIDProofVerificationService - drivingLicence:', error);
        callback({});
      } else {
        callback(JSON.parse(body));
      }
    });
  },

  voterCard: function(voterEPICNumber, callback) {
    // var https = require('https');
    // var options = {
    //   'method': 'POST',
    //   'hostname': '{{base_url}}',
    //   'path': '/verify-voter',
    //   'headers': {
    //     'Content-Type': 'application/json',
    //     'qt_api_key': '{{qt_api_key_value}}',
    //     'qt_agency_id': '{{qt_agency_id}}'
    //   }
    // };

    // var req = https.request(options, function (res) {
    //   var chunks = [];
    //   res.on('data', function (chunk) {
    //     chunks.push(chunk);
    //   });
    //   res.on('end', function (chunk) {
    //     var body = Buffer.concat(chunks);
    //     console.log(body.toString());
    //   });
    //   res.on('error', function (error) {
    //     console.error(error);
    //   });
    // });
    var postData =  {
      'epic_no': voterEPICNumber,
      'consent': 'Y',
      'consent_text': 'Voter Card Validation Using Voter EPIC Number with Nextgen'
    };
    // req.write(postData);
    // req.end();
    Request.post({
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'qt_api_key': 'f0f87350-719d-4eea-980f-3988e8688854',
        'qt_agency_id': '6969afeb-e146-43ce-b91c-9b90f0164618'
      },
      url: 'https://preprod.aadhaarapi.com/verify-voter',
      body: JSON.stringify(postData)
    }, function(error, response, body) {
      if(error) {
        logger.error('There was an Un-Known Error occured in Service:', error);
        callback('');
      } else {
        callback(JSON.parse(body));
      }
    });
  }
}
