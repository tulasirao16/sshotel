/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var CommonService = require('../services/CommonService');
var SP_PropertiesService = require('../services/SP-PropertiesService');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var multer = require('multer');
var uuid = require('node-uuid');
var fs = require('fs');
var jwt = require('jwt-simple');
var config = require('config');

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

  // -- Begin : /api/v1/sp/service/properties/:activePage/:searchString? 
  app.get('/api/v1/sp/service/properties/:activePage/:searchString?', function (req, res, next) {
    var pageNumber = parseInt(req.params.activePage);
    var searchString = req.params.searchString;
    if (!req.params.searchString || req.params.searchString == 'undefined') {
      searchString = '';
    }
    if (req.headers.token && pageNumber) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertiesService.getSpProperties(pageNumber, searchString, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertiesController.js at get API -' +
            ' /api/v1/sp/service/properties/:activePage/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertiesController.js at get API -' +
            '  /api/v1/sp/service/properties/:activePage/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-PropertiesController.js at get API -' +
        '  /api/v1/sp/service/properties/:activePage/:searchString?: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/service/properties/:activePage/:searchString?

  // -- Begin : /api/v1/sp/property/create 
  app.post('/api/v1/sp/property/create', function (req, res, next) {
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
              SP_PropertiesService.createSPProperty(req.body, propertyID, imagesData, tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
            } else {
              logger.error('There was an Error in controllers/SP-PropertiesController.js at post API -' +
                ' /api/v1/sp/property/create: Missing Mandatory Fields');
              utils.sendResponse(res, 400, '9998', {});
            }
          }
          else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-PropertiesController.js at post API -' +
              ' /api/v1/sp/property/create: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/SP-PropertiesController.js at post API -' +
              '  /api/v1/sp/property/create: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      }
      else {
        logger.error('There was an Error in controllers/SP-PropertiesController.js at post API -' +
          '  /api/v1/sp/property/create: Missing Mandatory Fields');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
  });
  // -- End : /api/v1/sp/property/info/create 

  // -- Begin : /api/v1/sp/service/property/docs/:propertyID 
  app.get('/api/v1/sp/service/property/docs/:propertyID', function (req, res, next) {
    if (req.headers.token && req.params.propertyID) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertiesService.getSPPropertyDocs(req.params.propertyID, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertiesController.js at get API -' +
            ' /api/v1/sp/service/property/docs/:propertyID: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertiesController.js at get API -' +
            '  /api/v1/sp/service/property/docs/:propertyID: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    }
    else {
      logger.error('There was an Error in controllers/SP-PropertiesController.js at get API -' +
        '  /api/v1/sp/service/property/docs/:propertyID: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/service/property/docs/:propertyID

  // -- Begin : /api/v1/sp/property/update/:propertyID 
  app.put('/api/v1/sp/property/update/:propertyID', function (req, res, next) {
    upload(req, res, function (err) {
      if (req.headers.token && req.params.propertyID) {
        CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
          if (tokenDecodedData && !tokenDecodedData.expStatus) {
            if (req.files) {
              SP_PropertiesService.updateSPProperty(req.params.propertyID, req.body, req.files, tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
            } else {
              SP_PropertiesService.updateSPProperty(req.params.propertyID, req.body, '', tokenDecodedData.decodedTokenData, function (resObj) {
                utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
              });
            }
          }
          else if (tokenDecodedData && tokenDecodedData.expStatus) {
            logger.error('There was an Error in controllers/SP-PropertiesController.js at put API -' +
              '/api/v1/sp/property/update/:propertyID: Token expired');
            utils.sendResponse(res, 400, '9995', {});
          } else {
            logger.error('There was an Error in controllers/SP-PropertiesController.js at put API -' +
              '  /api/v1/sp/property/update/:propertyID: Token decode failed');
            utils.sendResponse(res, 400, '9996', {});
          }
        });
      }
      else {
        logger.error('There was an Error in controllers/SP-PropertiesController.js at put API -' +
          ' /api/v1/sp/property/update/:propertyID: Missing Mandatory Fields');
        utils.sendResponse(res, 400, '9998', {});
      }
    });
  });
  // -- End : /api/v1/sp/property/update/:propertyID 

  // -- Begin : /api/v1/sp/property/status/change/:propertyID/:status 
  app.put('/api/v1/sp/property/status/change/:propertyID/:status', function (req, res, next) {
    if (req.headers.token) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertiesService.updateSPPropertyStatusChange(req.params.propertyID, req.params.status, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertiesController.js at put API -' +
            ' /api/v1/sp/property/status/change/:propertyID/:status: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertiesController.js at put API -' +
            '  /api/v1/sp/property/status/change/:propertyID/:status: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-PropertiesController.js at put API -' +
        '  /api/v1/sp/property/status/change/:propertyID/:status: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/property/status/change/:propertyID/:status 

   // -- Begin : /api/v1/sp/property/delete/images 
   app.put('/api/v1/sp/property/delete/images', function (req, res, next) {
    if (req.headers.token && req.body) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertiesService.deleteSPPropertyDocs(req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            if(resObj.statusCode == '0000') {
              req.body.imagesPath.forEach(item => {
                fs.unlink(item, function(err) {})
              });
            }
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertiesController.js at put API -' +
            ' /api/v1/sp/property/delete/images: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertiesController.js at put API -' +
            ' /api/v1/sp/property/delete/images: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-PropertiesController.js at put API -' +
        ' /api/v1/sp/property/delete/images: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // -- End : /api/v1/sp/property/status/change/:propertyID/:status 

  app.get('/api/sp/property/locations', function (req, res, next) {
    if (req.headers.token) {
        CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
            if (tokenDecodedData && !tokenDecodedData.expStatus) {
              SP_PropertiesService.getSPLocationsData(tokenDecodedData.decodedTokenData, function (resObj) {
                    utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                });
            } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                logger.error('There was an Error in controllers/SP-PropertiesController.js at get API -',
                    ' /api/sp/property/locations: Token expired');
                utils.sendResponse(res, 400, '9995', {});
            } else {
                logger.error('There was an Error in controllers/SP-PropertiesController.js at get API -',
                    ' /api/sp/property/locations: Token decode failed');
                utils.sendResponse(res, 400, '9996', {});
            }
        });
    } else {
        logger.error('There was an Error in controllers/SP-PropertiesController.js, at get API -',
            ' /api/sp/property/locations: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.put('/api/v1/sp/property/location/update/:propertyId', function (req, res, next) {
    if (req.headers.token && req.params.propertyId && req.body) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertiesService.updateSPPropertyLocationUpdate(req.params.propertyId, req.body, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertiesController.js at put API -' +
            ' /api/v1/sp/property/location/update/:propertyId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertiesController.js at put API -' +
            '  /api/v1/sp/property/location/update/:propertyId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/SP-PropertiesController.js at put API -' +
        '  /api/v1/sp/property/location/update/:propertyId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.get('/api/v1/sp/property/:recordId', function (req, res, next) {
    if (req.headers.token && req.params.recordId) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          SP_PropertiesService.getSPPropertyData(req.params.recordId, tokenDecodedData.decodedTokenData, function (resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        }
        else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/SP-PropertiesController.js at get API -' +
            ' /api/v1/sp/property/:recordId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Error in controllers/SP-PropertiesController.js at get API -' +
            '  /api/v1/sp/property/:recordId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    }
    else {
      logger.error('There was an Error in controllers/SP-PropertiesController.js at get API -' +
        '  /api/v1/sp/property/:recordId: Missing Mandatory Fields');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
}
