/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var AD_HostsPropertiesService = require('../services/AD-HostsPropertiesService');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var multer = require('multer');
var uuid = require('node-uuid');
var fs = require('fs');
var jwt = require('jwt-simple');
var config = require('config');


// --- Begin: AD-HostsPropertiesController
module.exports.controller = function (app, passport) {
  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      var decodedTokenData = jwt.decode(req.headers.token, config.jwtSecretKey);
      if (req.params.propertyID) {
        var uplLoc = 'assets/sp/property/docs/' + 'SPPD' + req.params.propertyID;
      } else if (decodedTokenData.ua) {
        var uplLoc = 'assets/sp/property/docs/' + 'SPPD' + decodedTokenData.ua;
      } else {
        var uplLoc = 'assets/sp/property/docs/' + 'SPPD';
      }
      if (!fs.existsSync(uplLoc)) {
        fs.mkdirSync(uplLoc);
      }
      callback(null, uplLoc);
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    }
  });
  var upload = multer({ storage: storage }).array('propertyImages', 11);

  // --- Begin '/api/v1/ad/hosts/properties/:activePage/:spid/:searchString?'
  app.get('/api/v1/ad/hosts/properties/:activePage/:spid/:searchString?', function (req, res, callback) {
    var pageNum = parseInt(req.params.activePage);
    var searchString = req.params.searchString == 'undefined' || !req.params.searchString ? '':req.params.searchString ;
    if (req.headers.token && req.params.spid && pageNum) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
           AD_HostsPropertiesService.getADHostsSPDataByID(pageNum, req.params.spid, searchString, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
           });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at get API -' +
            '/api/v1/ad/hosts/properties/:activePage/:spid/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at get API -' +
            '/api/v1/ad/hosts/properties/:activePage/:spid/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
          }
      });
     }  else {
        logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at get API -' +
        '/api/v1/ad/hosts/properties/:activePage/:spid/:searchString?: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
        }
  });
  // --- End '/api/v1/ad/hosts/properties/:activePage/:spid/:searchString?'

  //----Begin '/api/v1/ad/hosts/property/:propertyid'
  app.get('/api/v1/ad/hosts/property/:propertyid', function (req, res, callback) {
    if (req.headers.token && req.params.propertyid) {
       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPropertiesService.getADHostspropertyDataByID(req.params.propertyid, function (resObj) {
           utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
           });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at get API -' +
            '/api/v1/ad/hosts/property/:propertyid: Token expired');
          utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at get API -' +
            '/api/v1/ad/hosts/property/:propertyid: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
       });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at get API -' +
        '/api/v1/ad/hosts/property/:propertyid: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
      }
  });
  // --- End '/api/v1/ad/hosts/property/:propertyid':

  // -- Begin : /api/v1/ad/hosts/property/status/change/:propertyID/:status:
  app.put('/api/v1/ad/hosts/property/status/change/:propertyID/:status', function (req, res, next) {
    if (req.headers.token && req.params.propertyID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPropertiesService.updateADHostsPropertyStatusChange(req.params.propertyID, req.params.status, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at put API -' +
            '/api/v1/ad/hosts/property/status/change/:propertyID/:status: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at put API -' +
            '/api/v1/ad/hosts/property/status/change/:propertyID/:status: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at put API -' +
        '/api/v1/ad/hosts/property/status/change/:propertyID/:status: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/ad/hosts/property/status/change/:propertyID/:status:

  // -- Begin : /api/v1/ad/hosts/property/update/:propertyID 
  app.put('/api/v1/ad/hosts/property/update/:propertyID', function (req, res, next) {
    upload(req, res, function (err) {
      if (req.headers.token && req.params.propertyID) {
        CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            if (req.files) {
              AD_HostsPropertiesService.updateADHostsProperty(req.params.propertyID, req.body, req.files, tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
            } else {
              AD_HostsPropertiesService.updateADHostsProperty(req.params.propertyID, req.body, '', tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
            }
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at put API -' +
              '/api/v1/ad/hosts/property/update/:propertyID: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at put API -' +
              '/api/v1/ad/hosts/property/update/:propertyID: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at put API -' +
          '/api/v1/ad/hosts/property/update/:propertyID: Missing Mandatory Fields');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
  });
  // -- End : /api/v1/ad/hosts/property/update/:propertyID
  
   // -- Begin : /api/v1/ad/hosts/property/create 
   app.post('/api/v1/ad/hosts/property/create', function (req, res, next) {
    upload(req, res, function (err) {
      if (req.headers.token) {
        CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            if (req.files) {
              var propertyID = uuid.v1();
              var imagesData = req.files;
              for (i = 0; i < imagesData.length; i++) {
                var renameLoc = req.files[i].destination;
                var fileLoc = renameLoc.split('SPPD')[0] + 'SPPD' + propertyID;
                imagesData[i].destination = fileLoc + '/' + req.files[i].filename;
                imagesData[i].path = fileLoc + '/' + req.files[i].filename;
                fs.rename(renameLoc, fileLoc, function () {
                });
              }
              AD_HostsPropertiesService.createADHostsProperty(req.body, propertyID, imagesData, tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
            } else {
              logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at post API -' +
                '/api/v1/ad/hosts/property/create: Missing Mandatory Fields');
              utils.sendResponse(res, 400, '9998', {});
            }
          } else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at post API -' +
              '/api/v1/ad/hosts/property/create: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at post API -' +
              '/api/v1/ad/hosts/property/create: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      } else {
        logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at post API -' +
          '/api/v1/ad/hosts/property/create: Missing Mandatory Fields');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
  });
  // -- End : /api/v1/ad/hosts/property/create

  //----Begin '/api/v1/ad/hosts/property/locations/:spid'
  app.get('/api/v1/ad/hosts/property/locations/:spid', function (req, res, callback) {
    if (req.headers.token ) {
       CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPropertiesService.getADHostspropertyLocationsData(req.params.spid, function (resObj) {
           utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
           });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at get API -' +
            '/api/v1/ad/hosts/property/locations/:spid: Token expired');
          utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at get API -' +
            '/api/v1/ad/hosts/property/locations/:spid: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
       });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at get API -' +
        '/api/v1/ad/hosts/property/locations/:spid: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
      }
  });
  // --- End '/api/v1/ad/hosts/property/locations/:spid':

  // --- Begin : /api/v1/ad/hosts/property/delete/images 
  app.put('/api/v1/ad/hosts/property/delete/images/', function (req, res, next) {
    if (req.headers.token && req.body) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          AD_HostsPropertiesService.deleteADHostPropertyDocs(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            if(resObj.statusCode == '0000') {
              req.body.imagesPath.forEach(item => {
                fs.unlink(item, function(err) {})
              });
            }
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at put API -' +
            ' /api/v1/ad/hosts/property/delete/images: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at put API -' +
            ' /api/v1/ad/hosts/property/delete/images: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/AD-HostsPropertiesController.js at put API -' +
        ' /api/v1/ad/hosts/property/delete/images: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: /api/v1/ad/hosts/property/delete/images
}
// --- End: AD-HostsPropertiesController