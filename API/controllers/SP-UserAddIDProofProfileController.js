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
var SP_UserAddIDProofProfileService = require('../services/SP-UserAddIDProofProfileService');

// --- Begin: SP-Users Profile Controller
module.exports.controller = function (app) {
  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      CommonService.tokenExpireValidation(req.headers.token, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          var uplLoc = 'assets/sp/idproofs/' + tokenDecodedData.decodedTokenData.iss;
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

  // --- Begin '/api/v1/sp/user/profile/idproof':
  app.post('/api/v1/sp/user/profile/idproof/create', function (req, res, next) {
    upload(req, res, function (err) {
      var currentUTC = CommonService.currentUTCObj();
      if (req.headers.token && req.headers.token != 'undefined' && req.body.idType && req.body.idNumber && req.body.nameOnId && req.file) {
        CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            var renameLoc = 'assets/sp/idproofs/' + tokenDecodedData.decodedTokenData.iss;
            var fileExt = req.file.filename.split('.');
            var fileName = currentUTC.currentUTCDateTimeNumber + '.' + fileExt[fileExt.length - 1];
            var fileLoc = renameLoc + '/' + fileName;
            fs.rename(renameLoc + '/' + req.file.filename, fileLoc, function () { });
            SP_UserAddIDProofProfileService.setSPUserProfileUserKyc(req.body, fileLoc, req.file.filename, fileName,
            tokenDecodedData.decodedTokenData, currentUTC, function (resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-UsersAddIDProofProfileController.js at post API -' +
              ' /api/v1/sp/user/profile/idproof/create: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Un-known Error in controllers/SP-UsersAddIDProofProfileController.js at post API -' +
              ' /api/v1/sp/user/profile/idproof/create: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/SP-UsersAddIDProofProfileController.js at post API -' +
          ' /api/v1/sp/user/profile/idproof/create: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
  });

  app.get('/api/v1/sp/user/profile/idproof', function (req, res, next) {
    if (req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserAddIDProofProfileService.getSPIDProofsData(tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-LocationsController.js at get API -',
            ' /api/v1/sp/user/profile/idproof Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-LocationsController.js at get API -',
            ' /api/v1/sp/user/profile/idproof Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-LocationsController.js, at get API -',
        ' /api/v1/sp/user/profile/idproof Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.put('/api/v1/sp/user/profile/idproof/update/:id', function (req, res, next) {
    upload(req, res, function (err) {
      var currentUTC = CommonService.currentUTCObj();
      if (req.headers.token && req.headers.token != 'undefined' && req.body.idType && req.body.idNumber && req.body.nameOnId) {
        CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            if (req.file) {
              var renameLoc = 'assets/sp/idproofs/' + tokenDecodedData.decodedTokenData.iss;
              var fileExt = req.file.filename.split('.');
              var fileName = currentUTC.currentUTCDateTimeNumber + '.' + fileExt[fileExt.length - 1];
              var fileLoc = renameLoc + '/' + fileName;
              fs.rename(renameLoc + '/' + req.file.filename, fileLoc, function () { });
              SP_UserAddIDProofProfileService.updateSPProfileUserKyc(req.params.id, req.body, fileLoc, req.file.filename, fileName, currentUTC,
                tokenDecodedData.decodedTokenData, function (resObj) {
                  utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                });
            } else {
              SP_UserAddIDProofProfileService.updateSPProfileUserKyc(req.params.id, req.body, '', '', '', currentUTC, tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
            }
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-UsersAddIDProofProfileController.js at put API -' +
              ' /api/v1/sp/user/profile/idproof/update/:id: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Un-known Error in controllers/SP-UsersAddIDProofProfileController.js at put API -' +
              ' /api/v1/sp/user/profile/idproof/update/:id: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/SP-UsersAddIDProofProfileController.js at put API -' +
          ' /api/v1/sp/user/profile/idproof/update/:id: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
  });

  app.put('/api/v1/sp/user/profile/preference/:id', function (req, res, next) {
    var updateuserpreferenceBody = updateSPUserProfilePreferenceBodyValidation(req.body);
    if (updateuserpreferenceBody && req.headers.token && req.headers.token != 'undefined') {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserAddIDProofProfileService.updateSPUserPreferenceData(req.body,
            tokenDecodedData.decodedTokenData, function (resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UsersAddIDProofProfileController.js at put API -',
            ' /api/v1/sp/user/profile/preference/:id: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/SP-UsersAddIDProofProfileController.js at put API -',
            ' /api/v1/sp/user/profile/preference/:id: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UsersAddIDProofProfileController.js at put API -',
        ' /api/v1/sp/user/profile/preference/:id: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  // --- Begin '/api/v1/sp/user/profile/idtype/:idType?'   
  app.get('/api/v1/sp/user/profile/idtype/:idType?', function (req, res, next) {
    if (req.headers.token && req.params.idType) {
      CommonService.refreshUserToken(req.headers.token, res, function(tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_UserAddIDProofProfileService.getSPUserKycByIdType(req.params.idType, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-UsersAddIDProofProfileController.js at get API -' +
            '/api/v1/sp/user/profile/idtype/:idType?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-UsersAddIDProofProfileController.js at get API -' +
            '/api/v1/sp/user/profile/idtype/:idType?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-UsersAddIDProofProfileController.js at get API -' +
        ' /api/v1/sp/user/profile/idtype/:idType?: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/sp/user/profile/idtype/:idType?'
}

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function updateSPUserProfilePreferenceBodyValidation(reqBodyObj) {
  if (reqBodyObj.defaultLanguage && reqBodyObj.defaultTimezone && reqBodyObj.defaultCurrency && reqBodyObj.dateFormat) {
    return true;
  } else {
    return false;
  }
}

 // --- End: SP-Users Profile Controller
