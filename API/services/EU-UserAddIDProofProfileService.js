/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */
var fs = require('fs');

var logger = require('../lib/logger');
var commonService = require('./CommonService');
var UserIDProofVerificationService = require('./UserIDProofVerificationService');
var EU_UserAddIDProofProfileDAO = require('../daos/EU-UserAddIDProofProfileDAO');
var EU_UsersKyc = require('../models/EU-UsersKyc');

// --- Begin: EU-Users AddIDProof Service
module.exports = {
  setEUProfileUserKyc: function (reqObj, fileLoc, orginalFileName, fileName, tokenDecodedData, currentUTC, callback) {
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
        postEUUserKycData (reqObj, fileData, 'Not-Verified', {}, tokenDecodedData, currentUTC, function(resObj) {
          callback(resObj);
        });
        break;
    }
  },

  getEndUsersIDProofs: function (idType, tokendecodeddata, callback) {
    EU_UserAddIDProofProfileDAO.getEndUsersIDProofs(idType, tokendecodeddata, function (resObj) {
       callback(resObj);
    });
  },
  getEUIDProofsData: function (tokenDecodedData, callback) {
    EU_UserAddIDProofProfileDAO.getEUIDProofsData(tokenDecodedData, function (error, resObj) {
      if (error) {
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj.statusCode === '0000') {
        callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
      } else {
        callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
      }
    });
  },
  updateEUProfileUserKyc: function (_id, profileObj, fileLoc, orginalFileName, fileName, currentUTC, decodedTokenData, callback) {
    switch(profileObj.idType) {
      case 'Driving License':
        if (profileObj.validateAdhaarApi == 'true') {
          updateUserKycDrivingLicense(_id, profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC, function(resObj) {
            callback(resObj);
          });
        } else {
          var updateIDProofObj = setIDProofObj(profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC);
          EU_UserAddIDProofProfileDAO.updateEUProfileUserKyc(_id, updateIDProofObj, decodedTokenData, function (resObj) {
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
          EU_UserAddIDProofProfileDAO.updateEUProfileUserKyc(_id, updateIDProofObj, decodedTokenData, function (resObj) {
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
          });
        }
        break;
      default:
        var updateIDProofObj = setIDProofObj(profileObj, fileLoc, fileName, orginalFileName, decodedTokenData, currentUTC);
        EU_UserAddIDProofProfileDAO.updateEUProfileUserKyc(_id, updateIDProofObj, decodedTokenData, function (resObj) {
          callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        });
        break;
    }
  }
  // --- End EU-Users AddIDProof Service:
};

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
function postEUUserKycData (reqObj, fileData, idStatus, kycData, tokenDecodedData, currentUTC, callback) {
  var EUIdProofObj = {
    euName: tokenDecodedData.un,
    euUserId: tokenDecodedData.iss,
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
  var euKycObj = new EU_UsersKyc(EUIdProofObj);
  EU_UserAddIDProofProfileDAO.setEUProfileUserKyc(euKycObj, tokenDecodedData, function (resObj) {
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
        postEUUserKycData (reqObj, fileData, 'Verified', drivingLicenceObj.result.kycData, tokenDecodedData, currentUTC, function(resObj) {
          callback(resObj);
        });
      } else {
        UserIDProofVerificationService.drivingLicence (reqObj.idNumber, reqObj.dobOnId, function(kycData) {
          // var kycData = JSON.parse(resData);
          if(kycData && kycData.response_msg == 'Success') {
            postEUUserKycData (reqObj, fileData, 'Verified', kycData, tokenDecodedData, currentUTC, function(resObj) {
              callback(resObj);
            });
          } else {
            fs.unlink('assets/eu/idproofs/' + tokenDecodedData.iss + '/' + fileData.kycImage, (err) => {
              if (err) throw err;
            });
            callback({ httpCode: 400, statusCode: '9980', result: {}});
          }
        });
      }
    });
  } else {
    fs.unlink('assets/eu/idproofs/' + tokenDecodedData.iss + '/' + fileData.kycImage, (err) => {
      if (err) throw err;
    });
    logger.error('There was an Error in services/EU-UsersAddIDProofProfileService.js at setEUProfileUserKyc of userKycDrivingLicence:' +
      ' Missing mandatory fields data');
    callback({ httpCode: 400, statusCode: '9998', result: {}});
  }
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
      postEUUserKycData (reqObj, fileData, 'Verified', voterIdObj.result.kycData, tokenDecodedData, currentUTC, function(resObj) {
        callback(resObj);
      });
    } else if (voterIdObj.statusCode == '9900') {
      UserIDProofVerificationService.voterCard (reqObj.idNumber, function(kycData) {
        // var kycData = JSON.parse(resData);
        if(kycData && kycData.response_msg == 'Success') {
          postEUUserKycData (reqObj, fileData, 'Verified', kycData, tokenDecodedData, currentUTC, function(resObj) {
            callback(resObj);
          });
        } else {
          fs.unlink('assets/eu/idproofs/' + tokenDecodedData.iss + '/' + fileData.kycImage, (err) => {
            if (err) throw err;
          });
          callback({ httpCode: 400, statusCode: '9980', result: {}});
        }
      });
    } else {
      fs.unlink('assets/eu/idproofs/' + tokenDecodedData.iss + '/' + fileData.kycImage, (err) => {
        if (err) throw err;
      });
      callback({ httpCode: 500, statusCode: '9999', result: {} })
    }
  })
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
  EU_UserAddIDProofProfileDAO.updateEUProfileUserKyc(_id, EUPutIdProofObj, tokenDecodedData, function (resObj) {
    callback(resObj);
  });
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
      putEUUserKycData (_id, reqObj, fileLoc, fileName, orginalFileName, 'Verified', voterIdObj.result.kycData, tokenDecodedData, currentUTC, function(resObj) {
        callback(resObj);
      });
    } else if (voterIdObj.statusCode == '9900') {
      UserIDProofVerificationService.voterCard (reqObj.idNumber, function(kycData) {
        // var kycData = JSON.parse(resData);
        if(kycData && kycData.response_msg == 'Success') {
          putEUUserKycData (_id, reqObj, fileLoc, fileName, orginalFileName, 'Verified', kycData, tokenDecodedData, currentUTC, function(resObj) {
            callback(resObj);
          });
        } else {
          fs.unlink('assets/eu/idproofs/' + tokenDecodedData.iss + '/' + fileName, (err) => {
            if (err) throw err;
          });
          callback({ httpCode: 400, statusCode: '9980', result: {}});
        }
      });
    } else {
      fs.unlink('assets/eu/idproofs/' + tokenDecodedData.iss + '/' + fileName, (err) => {
        if (err) throw err;
      });
      callback({ httpCode: 500, statusCode: '9999', result: {} })
    }
  })
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
            fs.unlink('assets/eu/idproofs/' + tokenDecodedData.iss + '/' + fileName, (err) => {
              if (err) throw err;
            });
            callback({ httpCode: 400, statusCode: '9980', result: {}});
          }
        });
      }
    });
  } else {
    fs.unlink('assets/eu/idproofs/' + tokenDecodedData.iss + '/' + fileName, (err) => {
      if (err) throw err;
    });
    logger.error('There was an Error in services/EU-UsersAddIDProofProfileService.js at setEUProfileUserKyc of userKycDrivingLicence:' +
      ' Missing mandatory fields data');
    callback({ httpCode: 400, statusCode: '9998', result: {}});
  }
}
//  --- End: EU-Users Profile Service
 