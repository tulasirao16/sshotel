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
var AD_EndUserProfileService = require('../services/AD-EndUserProfileService');

// --- Begin: AD-End Users Profile Controller
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

  // --- Begin '/api/v1/ad/eu/user/profile/update/:recordID':
  app.put('/api/v1/ad/eu/user/profile/update/:recordID', function (req, res, next) {
      upload(req, res, function (err) {
          var currentUTC = CommonService.currentUTCObj();
          var recordID = req.params.recordID
          if (req.headers.token && req.headers.token != 'undefined' && recordID && req.body.profilefirstName && req.body.profilelastName && req.body.profileaddress && req.body.profileuserAccount && req.body.profileemail &&
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
                          AD_EndUserProfileService.ADEndUsersProfileUpdate( req.body,recordID, fileLoc, req.file.filename, fileName,
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
                          AD_EndUserProfileService.ADEndUsersProfileUpdate(req.body,recordID, '', '', '', tokenDecodedData.decodedTokenData, function (resObj) {
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
                      logger.error('There was an Error in controllers/AD-End User Profile Controller.js at put API -'+
                          ' /api/v1/ad/eu/user/profile/update/:recordID: Token expired');
                      utils.sendResponse(res, 400, '9995', {});
                  } else {
                      logger.error('There was an Un-known Error in controllers/AD-End User Profile Controller.js at put API -'+
                          '/api/v1/ad/eu/user/profile/update/:recordID: Token decode failed');
                      utils.sendResponse(res, 400, '9996', {});
                  }
              });
          } else {
              logger.error('There was an Error in controllers/AD-End User Profile Controller.js at put API -'+
                  '/api/v1/ad/eu/user/profile/update/:recordID: Missing mandatory fields data');
              utils.sendResponse(res, 400, '9998', {});
          }
      });
  });
  // --- End:  AD-End Users Profile Controller

  // --- Begin '/api/v1/ad/end/user/changepassword/:userID'
  app.put('/api/v1/ad/end/user/changepassword/:userID', function (req, res, callback) {
    var newPassword=req.body.newPassword;
    var userID =req.params.userID
    if( req.headers.token && userID && newPassword ) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if(tokenDecodedData && !tokenDecodedData.expStatus) {
            AD_EndUserProfileService.updateADEndUsersChangePassword(userID, newPassword, tokenDecodedData, function (resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            }); 
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-End User Profile Controller.js at put API -'+
          '/api/v1/ad/end/user/changepassword/:userID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-End User Profile Controller.js at put API -'+
          '/api/v1/ad/end/user/changepassword/:userID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        } 
      });
    } else {
        logger.error('There was an Error in controllers/AD-End User Profile Controller.js at put API -'+
        '/api/v1/ad/end/user/changepassword/:userID: Missing mandatory fields data');
       utils.sendResponse(res, 400, '9998', {});
    } 
  });
  // --- End '/api/v1/ad/end/user/changepassword/:userID'

  // ----- Begin :/api/v1/ad/end/user/profile/preference/:recordID
  app.put('/api/v1/ad/end/user/profile/preference/:recordID', function (req, res, next) {
    var updateuserpreferenceBody = updateADEndUserProfilePreferenceBodyValidation(req.body);
    if (updateuserpreferenceBody && req.headers.token && req.params.recordID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
            AD_EndUserProfileService.updateADEndUserPreferenceData(req.body, req.params.recordID,
            tokenDecodedData.decodedTokenData, function (resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-End User Profile Controller.js at put API -'+
            '/api/v1/ad/end/user/profile/preference/:recordID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/AD-End User Profile Controller.js at put API -'+
            '/api/v1/ad/end/user/profile/preference/:recordID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-End User Profile Controller.js at put API -'+
        '/api/v1/ad/end/user/profile/preference/:recordID: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // ----- Ending :/api/v1/ad/end/user/profile/preference/:recordID 
}

/**
 * @param {object} reqBodyObj object
 * @return {boolean} boolean
 */
function updateADEndUserProfilePreferenceBodyValidation(reqBodyObj) {
    if (reqBodyObj.defaultLanguage && reqBodyObj.defaultTimezone && reqBodyObj.defaultCurrency && reqBodyObj.dateFormat) {
      return true;
    } else {
      return false;
    }
  }