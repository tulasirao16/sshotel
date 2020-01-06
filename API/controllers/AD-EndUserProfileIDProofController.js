/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var multer = require('multer');
var fs = require('fs');

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var AD_EndUserProfileIDProofService = require('../services/AD-EndUserProfileIDProofService');

// --- Begin: AD-EndUserProfileIDProofController
module.exports.controller = function (app) {
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            CommonService.tokenExpireValidation(req.headers.token, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    var uplLoc = 'assets/eu/idproofs/' + tokenDecodedData.decodedTokenData.iss;
                    if (!fs.existsSync(uplLoc)) {
                        fs.mkdirSync(uplLoc);
                    }
                    callback(null, uplLoc);
                }
            });
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });
    var upload = multer({ storage: storage }).single('profileIdProofImage');

    // ----- Begin :/api/v1/ad/end/user/profile/idproof/:recordID
    app.get('/api/v1/ad/end/user/idproof/:recordID', function (req, res, next) {
        if (req.headers.token && req.params.recordID) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
            if (tokenDecodedData && !tokenDecodedData.expStatus) {
                AD_EndUserProfileIDProofService.getADEndUserIDProofsData( req.params.recordID, tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                });
            } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                logger.error('There was an Error in controllers/AD-End User Profile ID Proof Controller.js at get API -'+
                ' /api/v1/ad/end/user/profile/idproof/:recordID Token expired');
                utils.sendResponse(res, 400, '9995', {});
            } else {
                logger.error('There was an Error in controllers/AD-End User Profile ID Proof Controller.js at get API -'+
                ' /api/v1/ad/end/user/profile/idproof/:recordID Token decode failed');
                utils.sendResponse(res, 400, '9996', {});
            }
            });
        } else {
            logger.error('There was an Error in controllersAD-End User Profile ID Proof Controller.js, at get API -'+
            '/api/v1/ad/end/user/profile/idproof/:recordID Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // ----- Ending :/api/v1/ad/hosts/user/profile/idproof/:recordID

    // ----- Begin :/api/v1/ad/end/user/profile/idproof/:recordID
    app.put('/api/v1/ad/end/user/profile/idproof/update/:recordID', function (req, res, next) {
        upload(req, res, function (err) {
            var currentUTC = CommonService.currentUTCObj();
            if (req.headers.token && req.headers.token != 'undefined' && req.body.idType && req.body.idNumber && req.body.nameOnId) {
                CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                    if (tokenDecodedData && !tokenDecodedData.expStatus) {
                        if (req.file) {
                            var renameLoc = 'assets/eu/idproofs/' + tokenDecodedData.decodedTokenData.iss;
                            var fileExt = req.file.filename.split('.');
                            var fileName = currentUTC.currentUTCDateTimeNumber + '.' + fileExt[fileExt.length - 1];
                            var fileLoc = renameLoc + '/' + fileName;
                            fs.rename(renameLoc + '/' + req.file.filename, fileLoc, function () { });
                            AD_EndUserProfileIDProofService.updateADEUProfileUserKyc(req.params.recordID, req.body, fileLoc, req.file.filename, fileName, currentUTC,
                                tokenDecodedData.decodedTokenData, function (resObj) {
                                    utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                                });
                        } else {
                            AD_EndUserProfileIDProofService.updateADEUProfileUserKyc(req.params.recordID, req.body, '', '', '', currentUTC, tokenDecodedData.decodedTokenData, function (resObj) {
                                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                            });
                        }
                    } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                        logger.error('There was an Error in controllers/AD-End User Profile ID Proof Controller.js at put API -' +
                            ' /api/v1/ad/hosts/user/profile/idproof/:recordID: Token expired');
                        utils.sendResponse(res, 400, '9995', {});
                    } else {
                        logger.error('There was an Un-known Error in controllers/AD-End User Profile ID Proof Controller.js at put API -' +
                            ' /api/v1/ad/hosts/user/profile/idproof/:recordID: Token decode failed');
                        utils.sendResponse(res, 400, '9996', {});
                    }
                });
            } else {
                logger.error('There was an Error in controllers/AD-End User Profile ID Proof Controller.js at put API -' +
                    ' /api/v1/ad/hosts/user/profile/idproof/:recordID: Missing mandatory fields data');
                utils.sendResponse(res, 400, '9998', {});
            }
        });
    });
    // ----- Ending :/api/v1/ad/hosts/user/profile/idproof/:recordID

    // --- Begin '/api/v1/ad/end/user/profile/idproof/create':
    app.post('/api/v1/ad/end/user/profile/idproof/create', function (req, res, next) {
        upload(req, res, function (err) {
            var currentUTC = CommonService.currentUTCObj();
            if (req.headers.token && req.headers.token != 'undefined' && req.body.idType && req.body.idNumber && req.body.nameOnId ) {
                CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                    if (tokenDecodedData && !tokenDecodedData.expStatus) {
                        var renameLoc = 'assets/eu/idproofs/' + tokenDecodedData.decodedTokenData.iss;
                        var fileExt = req.file.filename.split('.');
                        var fileName = currentUTC.currentUTCDateTimeNumber + '.' + fileExt[fileExt.length - 1];
                        var fileLoc = renameLoc + '/' + fileName;
                        fs.rename(renameLoc + '/' + req.file.filename, fileLoc, function () { });
                        AD_EndUserProfileIDProofService.setADEUProfileUserKyc(req.body, fileLoc, req.file.filename, fileName,
                            tokenDecodedData.decodedTokenData, currentUTC, function (resObj) {
                                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                            });
                    } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                        logger.error('There was an Error in controllers/AD-End User Profile ID Proof Controller.js at post API -' +
                            '/api/v1/ad/end/user/profile/idproof/create: Token expired');
                        utils.sendResponse(res, 400, '9995', {});
                    } else {
                        logger.error('There was an Un-known Error in controllers/AD-End User Profile ID Proof Controller.js at post API -' +
                            '/api/v1/ad/end/user/profile/idproof/create: Token decode failed');
                        utils.sendResponse(res, 400, '9996', {});
                    }
                });
            } else {
                logger.error('There was an Error in controllers/AD-End User Profile ID Proof Controller.js at post API -' +
                    '/api/v1/ad/end/user/profile/idproof/create: Missing mandatory fields data');
                utils.sendResponse(res, 400, '9998', {});
            }
        });
    });
    // ----- Ending :/api/v1/ad/end/user/profile/idproof/create
    
 // ----- Begin :/api/v1/ad/enduser/profile/idproof/:idType/:euUserId
  app.get('/api/v1/ad/enduser/profile/idproof/:idType/:euUserId', function (req, res, next) {
    if (req.headers.token && req.params.idType && req.params.euUserId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
            AD_EndUserProfileIDProofService.getADEndUsersIDProofs(req.params.idType, req.params.euUserId, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-EndUserProfileIDProofController.js at get API -'+
            ' /api/v1/ad/enduser/profile/idproof/:idType/:euUserId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-EndUserProfileIDProofController.js at get API -'+
            ' /api/v1/ad/enduser/profile/idproof/:idType/:euUserId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    }else {
        logger.error('There was an Error in controllers/AD-EndUserProfileIDProofController.js at get API -'+
            '/api/v1/ad/enduser/profile/idproof/:idType/:euUserId: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- Ending :/api/v1/ad/enduser/profile/idproof/:idType/:euUserId
}
// --- End: AD-EndUserProfileIDProofController
