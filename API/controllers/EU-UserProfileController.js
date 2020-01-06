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
var EU_UserProfileService = require('../services/EU-UserProfileService');

// --- Begin: EU-Users Profile Controller
module.exports.controller = function (app) {
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            CommonService.tokenExpireValidation(req.headers.token, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    var uplLoc = 'assets/eu-users/' + tokenDecodedData.decodedTokenData.iss;
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

    // --- Begin '/api/v1/eu/user/profile':
    app.put('/api/v1/eu/user/profile/:id', function (req, res, next) {
        upload(req, res, function (err) {
            var currentUTC = CommonService.currentUTCObj();
            if (req.headers.token && req.headers.token != 'undefined' && req.body.profilefirstName && req.body.profilelastName && req.body.profileaddress && req.body.profileuserAccount && req.body.profileemail &&
                req.body.profilemobileNumber && req.body.profiledisplayName) {
                CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                    if (tokenDecodedData && !tokenDecodedData.expStatus) {
                        if (req.file) {
                            var renameLoc = 'assets/eu-users/' + tokenDecodedData.decodedTokenData.iss;
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
                            EU_UserProfileService.endUsersProfileUpdate(req.body, fileLoc, req.file.filename, fileName,
                                tokenDecodedData.decodedTokenData, function (resObj) {
                                    CommonService.tokenGeneration(resObj.result, res, function(token) {
                                        if(token) {
                                            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                                        } else {
                                            utils.sendResponse(res, 500, '9999', {});
                                        }
                                    });
                                    // utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                                });
                        } else {
                            EU_UserProfileService.endUsersProfileUpdate(req.body, '', '', '', tokenDecodedData.decodedTokenData, function (resObj) {
                                CommonService.tokenGeneration(resObj.result, res, function(token) {
                                    if(token) {
                                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                                    } else {
                                        utils.sendResponse(res, 500, '9999', {});
                                    }
                                });
                                // utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                            });
                        }
                    } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                        logger.error('There was an Error in controllers/EU-Users ProfileController.js at put API -',
                            ' /api/v1/eu/user/profile/:id: Token expired');
                        utils.sendResponse(res, 400, '9995', {});
                    } else {
                        logger.error('There was an Un-known Error in controllers/EU-Users ProfileController.js at put API -',
                            ' /api/v1/eu/user/profile/:id: Token decode failed');
                        utils.sendResponse(res, 400, '9996', {});
                    }
                });
            } else {
                logger.error('There was an Error in controllers/EU-Users ProfileController.js at put API -',
                    ' /api/v1/eu/user/profile/:id: Missing mandatory fields data');
                utils.sendResponse(res, 400, '9998', {});
            }
        });
    });
    // --- End: EU-Users Profile Controller

    // Begin -- EU Change Password
    app.put('/api/v1/eu/profile/changepassword', function (req, res, next) {
        if (req.body.currentPassword && req.body.newPassword
            && req.headers.token && req.headers.token != 'undefined') {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    EU_UserProfileService.updateUserProfilePassword(req.body,
                        tokenDecodedData.decodedTokenData, function (resObj) {
                            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                        });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/EU- ProfileController.js at post API -' +
                        ' /api/v1/eu/profile/changepassword: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Error in controllers/EU- ProfileController.js at post API -' +
                        ' /api/v1/eu/profile/changepassword: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/EU- ProfileController.js at post API -',
                '/api/v1/eu/profile/changepassword: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });

    app.put('/api/v1/eu/user/profile/preference/:id', function (req, res, next) {
        var updateuserpreferenceBody = updateUserProfilePreferenceBodyValidation(req.body);
        if (updateuserpreferenceBody && req.headers.token && req.headers.token != 'undefined') {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    EU_UserProfileService.updateUserPreferenceData(req.body,
                        tokenDecodedData.decodedTokenData, function (resObj) {
                            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                        });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/EU-Users ProfileController.js at put API -',
                        ' /api/v1/eu/user/profile/preference/:id: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Un-known Error in controllers/EU-Users ProfileController.js at put API -',
                        ' /api/v1/eu/user/profile/preference/:id: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/EU-Users ProfileController.js at put API -',
                ' /api/v1/eu/user/profile/preference/:id: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });

    app.put('/api/v1/eu/user/booking/userinfo', function (req, res, next) {
        if (req.headers.token && req.body.firstName && req.body.lastName && req.body.mobileNumber) {
            CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
                if (tokenDecodedData && !tokenDecodedData.expStatus) {
                    EU_UserProfileService.updateUserName(req.body,
                    tokenDecodedData.decodedTokenData, res, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
                } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                    logger.error('There was an Error in controllers/EU-Users ProfileController.js at put API -',
                        ' /api/v1/eu/user/profile/firstname/lastname: Token expired');
                    utils.sendResponse(res, 400, '9995', {});
                } else {
                    logger.error('There was an Un-known Error in controllers/EU-Users ProfileController.js at put API -',
                        ' /api/v1/eu/user/profile/firstname/lastname: Token decode failed');
                    utils.sendResponse(res, 400, '9996', {});
                }
            });
        } else {
            logger.error('There was an Error in controllers/EU-Users ProfileController.js at put API -',
                '/api/v1/eu/user/profile/firstname/lastname: Missing mandatory fields data');
            utils.sendResponse(res, 400, '9998', {});
        }
    });
};

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function updateUserProfilePreferenceBodyValidation(reqBodyObj) {
    if (reqBodyObj.defaultLanguage && reqBodyObj.defaultTimezone && reqBodyObj.defaultCurrency && reqBodyObj.dateFormat) {
        return true;
    } else {
        return false;
    }
}

// --- End: EU-Users Profile Controller
