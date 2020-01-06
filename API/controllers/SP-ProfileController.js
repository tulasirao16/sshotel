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
var SP_ProfileService = require('../services/SP-ProfileService');

// --- Begin: SP Profile Controller
module.exports.controller = function (app) {
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            CommonService.tokenExpireValidation(req.headers.token, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    var uplLoc = 'assets/sp/users/' + tokenDecodedData.decodedTokenData.iss;
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
    var upload = multer({ storage: storage }).single('profileImage');    

    // --- Begin '/api/v1/sp/profile':
    app.put('/api/v1/sp/profile/:id', function (req, res, next) {
        upload(req, res, function (err) {
            var currentUTC = CommonService.currentUTCObj();
            if (req.headers.token && req.headers.token != 'undefined' && req.body.profilefirstName && req.body.profilelastName && req.body.profileaddress && req.body.profileuserAccount && req.body.profileemail &&
            req.body.profilemobileNumber) {
                CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                    if (tokenDecodedData && !tokenDecodedData.expStatus) {
                        if (req.file) {
                            var renameLoc = 'assets/sp/users/' + tokenDecodedData.decodedTokenData.iss;
                            var fileExt = req.file.filename.split('.');
                            var fileName = currentUTC.currentUTCDateTimeNumber + '.' + fileExt[fileExt.length - 1];
                            var fileLoc = renameLoc + '/' + fileName;
                            if (req.body.userImageFileName) {
                                var oldpath = req.body.userImageFilePath;
                                fs.unlink(oldpath, function (err) {
                                    if (err) {
                                        logger.error('There was an error3 in update enterpriseresource: ', err);
                                    } else {
                                        fs.rename(renameLoc + '/' + req.file.filename, fileLoc, function () { });
                                    }
                                });
                            } else {
                                fs.rename(renameLoc + '/' + req.file.filename, fileLoc, function () {
                                    // fs.rmdir(renameLoc, function(erererer) {});
                                });
                            }
                            SP_ProfileService.serviceProvidersProfileUpdate(req.body, fileLoc, req.file.filename, fileName,
                                tokenDecodedData.decodedTokenData, function (resObj) {
                                    utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                                });
                        } else {
                            SP_ProfileService.serviceProvidersProfileUpdate(req.body, '', '', '', tokenDecodedData.decodedTokenData, function (resObj) {
                                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                            });
                        }
                    } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                        logger.error('There was an Error in controllers/SP- ProfileController.js at put API -'+
                            ' /api/v1/sp/profile/:id: Token expired');
                        utils.sendResponse(res, 400, '9995', {});
                    } else {
                        logger.error('There was an Un-known Error in controllers/SP- ProfileController.js at put API -'+
                            ' /api/v1/sp/profile/:id: Token decode failed');
                        utils.sendResponse(res, 400, '9996', {});
                    }
                });
            } else {
                logger.error('There was an Error in controllers/SP- ProfileController.js at put API -'+
                    ' /api/v1/sp/profile/:id: Missing mandatory fields data');
                utils.sendResponse(res, 400, '9998', {});
            }
        });
    });

    // Begin -- SP Change Password
    app.put('/api/sp/profile/changepassword', function (req, res, next) {
        if (req.body.currentPassword && req.body.newPassword
            && req.headers.token && req.headers.token != 'undefined') {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    SP_ProfileService.updateUserProfilePassword(req.body,
                        tokenDecodedData.decodedTokenData, function (resObj) {
                            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                        });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/SP- ProfileController.js at post API -'+
                        ' /api/sp/profile/changepassword: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/SP- ProfileController.js at post API -'+
                        ' /api/sp/profile/changepassword: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/SP- ProfileController.js at post API -',
                '/api/v1/sp/profile/changepassword: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });

    // --- Begin '/api/sp/serviceProvider/update'
    app.put('/api/sp/serviceProvider/update/:recordID', function (req, res, next) {
        var bodyValidation = spUpdateBodyValidation(req.body);
        if (bodyValidation && req.headers.token && req.params.recordID) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    SP_ProfileService.updateSPData(req.params.recordID, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/SP-ProfileController.js at put API -' +
                        ' /api/sp/serviceProvider/update: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/SP-ProfileController.js at put API -' +
                        ' /api/sp/serviceProvider/update: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/SP-ProfileController.js at put API -' +
                '/api/sp/serviceProvider/update: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
    // --- End '/api/sp/user/update'     
}

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function spUpdateBodyValidation(reqBodyObj) {
    if (reqBodyObj.contactPerson && reqBodyObj.contactNumber && reqBodyObj.contactEmail && reqBodyObj.contactAddress && reqBodyObj.city && reqBodyObj.state
        && reqBodyObj.zip && reqBodyObj.area && reqBodyObj.serviceProvider) {
        return true;
    } else
        return false;
}

// --- End: SP Profile Controller
