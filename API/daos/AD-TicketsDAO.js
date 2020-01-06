/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

var config = require('config');
var async = require('async');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var AD_Tickets = require('../models/AD-Tickets');
var EU_Users = require('../models/EU-Users');
var SP_Users = require('../models/SP-Users');

module.exports = {
  getADTicketsData: function(tokenDecodedData, query, callback) {
      var TicketsByStatusData = {}, TicketsByAssignData = {}, TicketsByPrioritiesData = {}, TicketsByGroupData={}, TicketsByTagData={}, TicketsCountByStatus={}
      async.parallel([
        function(callback) {
         getADTicketsByStatus(query.getADTicketsByStatusQuery, function(resObj1) {
            TicketsByStatusData = resObj1;
            callback(null, TicketsByStatusData);
          });
        },
        function(callback) {
          getADTicketsByAssignStatus(query.getADTicketsQuery, function(resObj2) {
            TicketsByAssignData = resObj2;
            callback(null, TicketsByAssignData);
          });
        },
        function(callback) {
          getADTicketsByPriorities(query.getADTicketsQuery, function(resObj3) {
            TicketsByPrioritiesData = resObj3;
            callback(null, TicketsByPrioritiesData);
          });
        },
        function(callback) {
          getADTicketsByGroup(query.getADTicketsQuery, function(resObj4) {
            TicketsByGroupData = resObj4;
            callback(null, TicketsByGroupData);
          });
        },
        function(callback) {
          getADTicketsByTag(query.getADTicketsQuery, function(resObj5) {
            TicketsByTagData = resObj5;
            callback(null, TicketsByTagData);
          });
        },
        function(callback) {
          getADTicketsCountByStatus(query.getADTicketsQuery, function(resObj6) {
            TicketsCountByStatus = resObj6;
            callback(null, TicketsCountByStatus);
          });
        },
        function(callback) {
          getADTicketsTotalCount(function(resObj7) {
            TicketsTotalCount = resObj7;
            callback(null, TicketsTotalCount);
          });
        },
      ], function (err, result) {
        if(err) {
          logger.error('There was an Un-known Error occured in daos/AD-TicketsDAO.js,' +
         ' at getADTicketsData:', err);
        }
        var cResObj = {TicketsByStatusData: TicketsByStatusData, TicketsByAssignData: TicketsByAssignData, TicketsByPrioritiesData: TicketsByPrioritiesData, TicketsByGroupData: TicketsByGroupData, TicketsByTagData: TicketsByTagData, TicketsCountByStatus: TicketsCountByStatus, TicketsTotalCount: TicketsTotalCount};
        callback({ httpCode: 200, statusCode: '0000', result: cResObj });
      });
  },
  
  getADTicketsGetData: function(pageNum, searchString, tokenDecodedData, callback) {
    var query = {
        isDeleted: false,
        '$or': [
            {ticketTitle: {$regex: searchString, $options: 'i'}},
            {ticket: {$regex: searchString, $options: 'i'}},
            {status: {$regex: searchString, $options: 'i'}},
            {ticketNumber: {$regex: searchString, $options: 'i'}} ,
            {euName: {$regex: searchString, $options: 'i'}} ,
            {reqEmail: {$regex: searchString, $options: 'i'}},
            {reqMobileNumber: {$regex: searchString, $options: 'i'}},
            {adminUserName: {$regex: searchString, $options: 'i'}},
            {assignStatus: {$regex: searchString, $options: 'i'}},
            {group: {$regex: searchString, $options: 'i'}},
            {ticketTag: {$regex: searchString, $options: 'i'}},
            {ticketStatus: {$regex: searchString, $options: 'i'}},
            {ticketGroup: {$regex: searchString, $options: 'i'}},
            {ticketPriority: {$regex: searchString, $options: 'i'}},
            
        ]
    };
    AD_Tickets.find(query)
    .populate('spServiceProviderId')
    .skip((pageNum - 1) * 10)
    .limit(10).sort({'createdAt': -1})
    .exec(function(error, resultArray) {
        if(error) {
            logger.error('There was an Un-konwn Error occured in daos/AD-TicketsDAO.js,',
            ' at getADTicketsGetData:', error);
            callback({httpCode: 500, statusCode: '9999', result: {}});
        } else if (resultArray && resultArray.length > 0) {
          AD_Tickets.find(query).exec(function (errorCount, resultCount) {
                if (errorCount) {
                    logger.error('There was an Un-known Error occured in daos/AD-TicketsDAO.js, at getADTicketsGetData:', errorCount);
                    var resultObj = { totalDocs: resultArray.length, ticketData: resultArray };
                    callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                } else if (resultCount) {
                    var resultObj = { totalDocs: resultCount.length, ticketData: resultArray };
                    callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                } else {
                    var resultObj = { totalDocs: resultArray.length, ticketData: resultArray };
                    callback({ httpCode: 200, statusCode: '0000', result: resultObj });
                }
            });
            // callback({httpCode: 200, statusCode: '0000', result: data});
        } else {
            callback({httpCode: 400, statusCode: '9997', result: {}});
        }
    });
  },

  postADCreateTicketData: function(ticketsObj, tokenDecodedData, callback) {
    var ticketData = new AD_Tickets(ticketsObj);
    ticketData.save(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-TicketsDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },

  postADTicketsLifeCycle: function(ticketsLifeCycleObj, callback) {
    ticketsLifeCycleObj.save(function(error, resObj) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-TicketsDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },

    
  getADTicketsEndUserDetails: function(mobileNumber, callback) {
    var query = {
        isDeleted: false,
        mobileNumber: mobileNumber
    };
    EU_Users.findOne(query)
    .exec(function(error, data) {
        if(error) {
            logger.error('There was an Un-konwn Error occured in daos/AD-TicketsDAO.js,',
            ' at getADTicketsEndUserDetails:', error);
            callback({httpCode: 500, statusCode: '9999', result: {}});
        } else if (data && data._id) {
          var userObj = data;
          var decObj = {
            email: data.email,
          };
          var resultObj = JSON.parse((JSON.stringify(userObj) + JSON.stringify(decObj)).replace(/}{/g, ','));
          callback({httpCode: 200, statusCode: '0000', result: resultObj});
        } else {
            callback({httpCode: 400, statusCode: '9997', result: {}});
        }
    });
  },
    
  getADTicketsSPUserDetails: function(mobileNumber, userType, callback) {
    if (userType === 'supplier') {
      var query = {
        $or: [{ mobileNumber: mobileNumber }, { email: mobileNumber }],
        isDeleted: false
      }
    } else {
      var query = {
        isDeleted: false,
        mobileNumber: mobileNumber
      }
    }
    SP_Users.findOne(query)
    .exec(function(error, data) {
        if(error) {
            logger.error('There was an Un-konwn Error occured in daos/AD-TicketsDAO.js,',
            ' at getADTicketsSPUserDetails:', error);
            callback({httpCode: 500, statusCode: '9999', result: {}});
        } else if (data && data._id) {
          var userObj = data;
          var decObj = {
            email: data.email,
          };
          var resultObj = JSON.parse((JSON.stringify(userObj) + JSON.stringify(decObj)).replace(/}{/g, ','));
          callback({httpCode: 200, statusCode: '0000', result: resultObj});
        } else {
            callback({httpCode: 400, statusCode: '9997', result: {}});
        }
    });
  },

  putADTicketUpdate: function(recordID, updateUserObj, decodedTokenData, callback) {
    AD_Tickets.findOneAndUpdate({_id: recordID, isDeleted: false }, {$set: updateUserObj}, {new: true}, function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/AD-TicketsDAO.js,'+
        ' at putADTicketUpdate:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {}});
      } else if(resObj && resObj._id) {
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({httpCode: 400, statusCode: '9992', result: {}});
      }
    });
  }

}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getADTicketsByStatus(query, callback) {
    AD_Tickets.aggregate([
        { $match: query },
        {$group: {
               _id: '$ticketStatus',
               count: { $sum: 1 }
            }
        }
      ])
      .exec(function (error, data) {
        if (error) {
          logger.error('There was an Error occured in daos/AD-TicketsDAO.js' + error);
          callback({ httpCode: 500, statusCode: '9999', result: [] });
        } else if (data && data.length > 0) {
          callback({httpCode: 200, statusCode: '0000', result: data});
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: [] });
        }
      });
}



/**
 * @param {object} query object
 * @return {function} callback
 */
function getADTicketsByAssignStatus(query, callback) {
    AD_Tickets.aggregate([
        { $match: query },
        {$group: {
               _id: '$assignStatus',
               count: { $sum: 1 }
            }
        }
      ])
      .exec(function (error, data) {
        if (error) {
          logger.error('There was an Error occured in daos/AD-TicketsDAO.js' + error);
          callback({ httpCode: 500, statusCode: '9999', result: [] });
        } else if (data && data.length > 0) {
          callback({httpCode: 200, statusCode: '0000', result: data});
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: [] });
        }
      });
}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getADTicketsByPriorities(query, callback) {
    AD_Tickets.aggregate([
        { $match: query },
        {$group: {
               _id: '$ticketPriority',
               count: { $sum: 1 }
            }
        }
      ])
      .exec(function (error, data) {
        if (error) {
          logger.error('There was an Error occured in daos/AD-TicketsDAO.js' + error);
          callback({ httpCode: 500, statusCode: '9999', result: [] });
        } else if (data && data.length > 0) {
          callback({httpCode: 200, statusCode: '0000', result: data});
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: [] });
        }
    });
}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getADTicketsByGroup(query, callback) {
    AD_Tickets.aggregate([
        { $match: query },
        {$group: {
               _id: '$ticketGroup',
               count: { $sum: 1 }
            }
        }
      ])
      .exec(function (error, data) {
        if (error) {
          logger.error('There was an Error occured in daos/AD-TicketsDAO.js' + error);
          callback({ httpCode: 500, statusCode: '9999', result: [] });
        } else if (data && data.length > 0) {
          callback({httpCode: 200, statusCode: '0000', result: data});
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: [] });
        }
      });
}



/**
 * @param {object} query object
 * @return {function} callback
 */
function getADTicketsByTag(query, callback) {
    AD_Tickets.aggregate([
        { $match: query },
        {$group: {
               _id: '$ticketTag',
               count: { $sum: 1 }
            }
        }
      ])
      .exec(function (error, data) {
        if (error) {
          logger.error('There was an Error occured in daos/AD-TicketsDAO.js' + error);
          callback({ httpCode: 500, statusCode: '9999', result: [] });
        } else if (data && data.length > 0) {
          callback({httpCode: 200, statusCode: '0000', result: data});
        } else {
          callback({ httpCode: 400, statusCode: '9997', result: [] });
        }
      });
}


/**
 * @param {object} query object
 * @return {function} callback
 */
function getADTicketsCountByStatus(query, callback) {
  var query1 = {
    isDeleted: false,
    ticketStatus: { $in: [ 'Completed', 'Onhold', 'Escalate', 'Closed' ] }
  }
  AD_Tickets.aggregate([
      { $match: query1 },
      {$group: {
             _id: '$ticketStatus',
             count: { $sum: 1 }
          }
      }
    ])
    .exec(function (error, data) {
      if (error) {
        logger.error('There was an Error occured in daos/AD-TicketsDAO.js' + error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if (data && data.length > 0) {
        callback({httpCode: 200, statusCode: '0000', result: data});
        // AD_Tickets.countDocuments({isDeleted: false}).exec(function (errorCount,resultCount) {
        //   console.log('resultCount', resultCount)
        //   var resultObj = { totalTickets: resultCount, ticketsByStatus: data };
        //   callback({httpCode: 200, statusCode: '0000', result: resultObj});
        // });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
}


/**
 * @return {function} callback
 */
function getADTicketsTotalCount(callback) {
   AD_Tickets.countDocuments({isDeleted: false}).exec(function (errorCount,resultCount) {
    // var resultObj = { totalTickets: resultCount, ticketsByStatus: data };
    callback({httpCode: 200, statusCode: '0000', result: resultCount});
  });

}

