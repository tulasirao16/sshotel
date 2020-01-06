/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

var fs = require('fs');
var commonService = require('./CommonService');
var SP_UserAddIDProofProfileDAO = require('../daos/SP-UserAddIDProofProfileDAO');
var SP_UsersKyc = require('../models/SP-UsersKyc');
var UserIDProofVerificationService = require('./UserIDProofVerificationService');
var EU_UserAddIDProofProfileDAO = require('../daos/EU-UserAddIDProofProfileDAO');

// --- Begin: SP-Users Profile Service
module.exports = {
    // --- Begin SP-Users ProfileUpdate:

    setSPUserProfileUserKyc: function (reqObj, fileLoc, orginalFileName, fileName, tokenDecodedData, currentUTC, callback) {
        var fileData = { kycImagePath: fileLoc, kycImageOriginalName: orginalFileName, kycImage: fileName };
        switch(reqObj.idType) {
        case 'Driving License':
            userKycDrivingLicence(reqObj, fileData, tokenDecodedData, currentUTC, function(resObj) {
              callback(resObj);
            });
            break;
        case 'Voter Card':
            userKycVoterCard(reqObj, fileData, tokenDecodedData, currentUTC, function(resObj) {
              callback(resObj);
            });
            break;
        default:
            postSPUserKycData (reqObj, fileData, 'Not-Verified', {}, tokenDecodedData, currentUTC, function(resObj) {
              callback(resObj);
            });
            break;
        }
    },

    getSPIDProofsData: function (tokenDecodedData, callback) {
        SP_UserAddIDProofProfileDAO.getSPIDProofsData(tokenDecodedData, function (error, resObj) {
            if (error) {
                callback({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (resObj.statusCode === '0000') {
                callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
            } else {
                callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
            }
        });
    },

    updateSPProfileUserKyc: function (_id, profileObj, fileLoc, orginalFileName, fileName, currentUTC, decodedTokenData, callback) {
      switch(profileObj.idType) {
        case 'Driving License':
          if (profileObj.validateAdhaarApi == 'true') {
            updateUserKycDrivingLicense(_id, profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC, function(resObj) {
              callback(resObj);
            });
          } else {
            var updateIDProofObj = setIDProofObj(profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC);
            SP_UserAddIDProofProfileDAO.updateSPProfileUserKyc(_id, updateIDProofObj, decodedTokenData, function (resObj) {
              callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
            });
          }
          break;
        case 'Voter Card':
          if (profileObj.validateAdhaarApi == 'true') {
            updateUserKycVoterCard(_id, profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC, function(resObj) {
              callback(resObj);
            });
          } else {
            var updateIDProofObj = setIDProofObj(profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC);
            SP_UserAddIDProofProfileDAO.updateSPProfileUserKyc(_id, updateIDProofObj, decodedTokenData, function (resObj) {
              callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
            });
          }
          break;
        default:
          var updateIDProofObj = setIDProofObj(profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC);
          SP_UserAddIDProofProfileDAO.updateSPProfileUserKyc(_id, updateIDProofObj, decodedTokenData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
          });
          break;
      }
    },

    updateSPUserPreferenceData: function (reqObj, tokenDecodedData, callback) {
        var currentUTC = commonService.currentUTCObj();
        var userPreferenceObj = {
            preferences: {
                defaultLanguage: reqObj.defaultLanguage,
                defaultTimezone: reqObj.defaultTimezone,
                defaultCurrency: reqObj.defaultCurrency,
                dateFormat: reqObj.dateFormat,
                updatedBy: tokenDecodedData.ua,
                updatedAt: currentUTC.currentUTCDateTimeNumber,
                updatedOn: currentUTC.currentUTCDateTimeString
            }
        };
        SP_UserAddIDProofProfileDAO.updateSPUserPreferenceData(tokenDecodedData, userPreferenceObj,
            function (error, resObj) {
                if (error) {
                    logger.error('There was an Un-known Error in controllers/SP-Users ProfileService.js',
                        ' at updateSPUserPreferenceData:', error);
                    callback({ httpCode: 500, statusCode: resObj.statusCode, result: resObj.result });
                } else if (resObj.statusCode === '0000') {
                    callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
                } else {
                    callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
                }
            });
    },
    // --- End SP-Users ProfileUpdate:

    // --- Begin getSPUserKycByIdType
    getSPUserKycByIdType: function (idType, tokenDecodedData, callback) {
        SP_UserAddIDProofProfileDAO.getSPUserKycByIdType(idType, tokenDecodedData, function (resObj) {
            callback(resObj);
        });
    },
    //--- End getSPUserKycByIdType
};


/**
 * @param {object} reqObj object
 * @param {object} fileData object
 * @param {string} idStatus string
 * @param {object} kycData object
 * @param {object} tokenDecodedData object
 * @param {object} currentUTC object
 * @param {function} callback is a callback function
 */
function postSPUserKycData (reqObj, fileData, idStatus, kycData, tokenDecodedData, currentUTC, callback) {
    var SPIdProofObj = {
        spServiceProviderId: tokenDecodedData.uspid,
        spServiceProvider: tokenDecodedData.usp,
        spName: tokenDecodedData.un,
        spUserId: tokenDecodedData.iss,
        idType: reqObj.idType,
        idNumber: reqObj.idNumber,
        dobOnId: reqObj.dobOnId,
        nameOnId: reqObj.nameOnId,
        idStatus: 'Not-Verified',
        kycStatus: 'Active',
        kycImage: fileData.kycImage,
        kycImageOriginalName: fileData.kycImageOriginalName,
        kycImagePath: fileData.kycImagePath,
        kycData: kycData,
        isDeleted: false,
        createdBy: tokenDecodedData.ua,
        updatedBy: tokenDecodedData.ua,
        createdAt: currentUTC.currentUTCDateTimeNumber,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        createdOn: currentUTC.currentUTCDateTimeString,
        updatedOn: currentUTC.currentUTCDateTimeString
    };
    var spUserKycObj = new SP_UsersKyc(SPIdProofObj);
    SP_UserAddIDProofProfileDAO.setSPUserProfileUserKyc(spUserKycObj, tokenDecodedData, function(resObj) {
        callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
    });
  }


/**
 * @param {object} reqObj object
 * @param {object} fileData object
 * @param {object} tokenDecodedData object
 * @param {object} currentUTC object
 * @param {function} callback is a callback function
 */
function userKycVoterCard(reqObj, fileData, tokenDecodedData, currentUTC, callback) {
  EU_UserAddIDProofProfileDAO.getVoterIdDetails(reqObj, function(voterIdObj) {
      if(voterIdObj.statusCode == '0000') {
        postSPUserKycData (reqObj, fileData, 'Verified', voterIdObj.result.kycData, tokenDecodedData, currentUTC, function(resObj) {
          callback(resObj);
        });
      } else if (voterIdObj.statusCode == '9900') {
        UserIDProofVerificationService.voterCard (reqObj.idNumber, function(kycData) {
          // var kycData = JSON.parse(resData);
          if(kycData && kycData.response_msg == 'Success') {
            postSPUserKycData (reqObj, fileData, 'Verified', kycData, tokenDecodedData, currentUTC, function(resObj) {
              callback(resObj);
            });
          } else {
            fs.unlink('assets/sp/idproofs/' + tokenDecodedData.iss + '/' + fileData.kycImage, (err) => {
              if (err) throw err;
            });
            callback({ httpCode: 400, statusCode: '9980', result: {}});
          }
        });
      } else {
        fs.unlink('assets/sp/idproofs/' + tokenDecodedData.iss + '/' + fileData.kycImage, (err) => {
          if (err) throw err;
        });
        callback({ httpCode: 500, statusCode: '9999', result: {} })
      }
    })
  }

/**
 * @param {object} reqObj object
 * @param {string} fileLoc string
 * @param {string} fileName string
 * @param {string} orginalFileName string
 * @param {object} decodedTokenData object
 * @param {object} currentUTC object
 * @return {object} object
 */
function setIDProofObj(reqObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC) {
  var idproofObj;
  if (fileLoc) {
    idproofObj = {
      idType: reqObj.idType,
      idNumber: reqObj.idNumber,
      nameOnId: reqObj.nameOnId,
      kycImage: fileName,
      kycImageOriginalName: orginalFileName,
      dobOnId: reqObj.dobOnId,
      kycImagePath: fileLoc,
      idStatus: 'Not-Verified',
      kycStatus: 'Active',
      updatedBy: decodedTokenData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
  } else {
    idproofObj = {
      idType: reqObj.idType,
      idNumber: reqObj.idNumber,
      nameOnId: reqObj.nameOnId,
      dobOnId: reqObj.dobOnId,
      idStatus: 'Not-Verified',
      kycStatus: 'Active',
      updatedBy: decodedTokenData.ua,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
  }
  return idproofObj;
}

/**
 * @param {object} reqObj object
 * @param {object} fileData object
 * @param {string} idStatus string
 * @param {object} kycData object
 * @param {object} tokenDecodedData object
 * @param {object} currentUTC object
 * @param {function} callback is a callback function
 */
function putEUUserKycData (_id, reqObj, fileLoc, fileName, orginalFileName, idStatus, kycData, tokenDecodedData, currentUTC, callback) {
  var EUPutIdProofObj = {}
  if (fileLoc) {
    EUPutIdProofObj = {
      idType: reqObj.idType,
      idNumber: reqObj.idNumber,
      dobOnId: reqObj.dobOnId,
      nameOnId: reqObj.nameOnId,
      idStatus: 'Not-Verified',
      kycStatus: 'Active',
      kycImage: fileName,
      kycImageOriginalName: orginalFileName,
      kycImagePath: fileLoc,
      kycData: kycData,
      isDeleted: false,
      createdBy: tokenDecodedData.ua,
      updatedBy: tokenDecodedData.ua,
      createdAt: currentUTC.currentUTCDateTimeNumber,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
  } else {
    EUPutIdProofObj = {
      idType: reqObj.idType,
      idNumber: reqObj.idNumber,
      dobOnId: reqObj.dobOnId,
      nameOnId: reqObj.nameOnId,
      idStatus: 'Not-Verified',
      kycStatus: 'Active',
      kycData: kycData,
      isDeleted: false,
      createdBy: tokenDecodedData.ua,
      updatedBy: tokenDecodedData.ua,
      createdAt: currentUTC.currentUTCDateTimeNumber,
      updatedAt: currentUTC.currentUTCDateTimeNumber,
      createdOn: currentUTC.currentUTCDateTimeString,
      updatedOn: currentUTC.currentUTCDateTimeString
    };
  }
  SP_UserAddIDProofProfileDAO.updateSPProfileUserKyc(_id, EUPutIdProofObj, tokenDecodedData, function (resObj) {
    callback(resObj);
  });
}


/**
 * @param {object} reqObj object
 * @param {object} fileData object
 * @param {object} tokenDecodedData object
 * @param {object} currentUTC object
 * @param {function} callback is a callback function
 */
  function userKycDrivingLicence(reqObj, fileData, tokenDecodedData, currentUTC, callback) {
    if (reqObj.dobOnId) {
      EU_UserAddIDProofProfileDAO.getDrivingLicenceDetails(reqObj, function(drivingLicenceObj) {
        if (drivingLicenceObj.statusCode === '0000') {
          postSPUserKycData (reqObj, fileData, 'Verified', drivingLicenceObj.result.kycData, tokenDecodedData, currentUTC, function(resObj) {
            callback(resObj);
          });
        } else {
          UserIDProofVerificationService.drivingLicence (reqObj.idNumber, reqObj.dobOnId, function(kycData) {
            // var kycData = JSON.parse(resData);
            if(kycData && kycData.response_msg == 'Success') {
              postSPUserKycData (reqObj, fileData, 'Verified', kycData, tokenDecodedData, currentUTC, function(resObj) {
                callback(resObj);
              });
            } else {
              fs.unlink('assets/sp/idproofs/' + tokenDecodedData.iss + '/' + fileData.kycImage, (err) => {
                if (err) throw err;
              });
              callback({ httpCode: 400, statusCode: '9980', result: {}});
            }
          });
        }
      });
    } else {
      fs.unlink('assets/sp/idproofs/' + tokenDecodedData.iss + '/' + fileData.kycImage, (err) => {
        if (err) throw err;
      });
      logger.error('There was an Error in services/SP-UsersAddIDProofProfileService.js at setEUProfileUserKyc of userKycDrivingLicence:' +
        ' Missing mandatory fields data');
      callback({ httpCode: 400, statusCode: '9998', result: {}});
    }
  }

  /**
 * @param {object} _id string
 * @param {object} reqObj object
 * @param {object} fileLoc string
 * @param {object} fileName string
 * @param {object} orginalFileName string
 * @param {object} tokenDecodedData object
 * @param {object} currentUTC object
 * @param {function} callback is a callback function
 */
function updateUserKycDrivingLicense(_id, reqObj, fileLoc, fileName, orginalFileName, tokenDecodedData, currentUTC, callback) {
  if (reqObj.dobOnId) {
    EU_UserAddIDProofProfileDAO.getDrivingLicenceDetails(reqObj, function(drivingLicenceObj) {
      if (drivingLicenceObj.statusCode === '0000') {
        putEUUserKycData (_id, reqObj, fileLoc, fileName, orginalFileName, 'Verified', drivingLicenceObj.result.kycData, tokenDecodedData, currentUTC, function(resObj) {
          callback(resObj);
        });
      } else {
        UserIDProofVerificationService.drivingLicence(reqObj.idNumber, reqObj.dobOnId, function(kycData) {
          // var kycData = JSON.parse(resData);
          if(kycData && kycData.response_msg == 'Success') {
            putEUUserKycData (_id, reqObj, fileLoc, fileName, orginalFileName, 'Verified', kycData, tokenDecodedData, currentUTC, function(resObj) {
              callback(resObj);
            });
          } else {
            fs.unlink('assets/sp/idproofs/' + tokenDecodedData.iss + '/' + fileName, (err) => {
              if (err) throw err;
            });
            callback({ httpCode: 400, statusCode: '9980', result: {}});
          }
        });
      }
    });
  } else {
    fs.unlink('assets/sp/idproofs/' + tokenDecodedData.iss + '/' + fileName, (err) => {
      if (err) throw err;
    });
    logger.error('There was an Error in services/SP-UsersAddIDProofProfileService.js at setSPProfileUserKyc of userKycDrivingLicense:' +
      ' Missing mandatory fields data');
    callback({ httpCode: 400, statusCode: '9998', result: {}});
  }
}

/**
 * @param {object} _id string
 * @param {object} reqObj object
 * @param {object} fileLoc string
 * @param {object} fileName string
 * @param {object} orginalFileName string
 * @param {object} tokenDecodedData object
 * @param {object} currentUTC object
 * @param {function} callback is a callback function
 */
function updateUserKycVoterCard(_id, reqObj, fileLoc, fileName, orginalFileName, tokenDecodedData, currentUTC, callback) {
  EU_UserAddIDProofProfileDAO.getVoterIdDetails(reqObj, function(voterIdObj) { 
    if(voterIdObj.statusCode == '0000') {
      putSPUserKycData (_id, reqObj, fileLoc, fileName, orginalFileName, 'Verified', voterIdObj.result.kycData, tokenDecodedData, currentUTC, function(resObj) {
        callback(resObj);
      });
    } else if (voterIdObj.statusCode == '9900') {
      UserIDProofVerificationService.voterCard (reqObj.idNumber, function(kycData) {
        // var kycData = JSON.parse(resData);
        if(kycData && kycData.response_msg == 'Success') {
          putSPUserKycData (_id, reqObj, fileLoc, fileName, orginalFileName, 'Verified', kycData, tokenDecodedData, currentUTC, function(resObj) {
            callback(resObj);
          });
        } else {
          fs.unlink('assets/sp/idproofs/' + tokenDecodedData.iss + '/' + fileName, (err) => {
            if (err) throw err;
          });
          callback({ httpCode: 400, statusCode: '9980', result: {}});
        }
      });
    } else {
      fs.unlink('assets/sp/idproofs/' + tokenDecodedData.iss + '/' + fileName, (err) => {
        if (err) throw err;
      });
      callback({ httpCode: 500, statusCode: '9999', result: {} })
    }
  })
}


// // --- End: SP-Users Profile Service
