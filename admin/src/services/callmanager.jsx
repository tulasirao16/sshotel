/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import axios from 'axios'
import { hashHistory } from 'react-router'
import bootbox from 'bootbox'
import cbootbox from './../common/bootbox'
import i18n from '../../public/i18n/en.json'
// import 'react-block-ui/style.scss'
import $$ from 'jquery'

require('./blockUI.scss')

function blockElement () {
  return '<div class="block-ui"></div><div class="block-ui-msg"><i class="fa fa-spinner fa-spin fa-3x"></i><h3>Please wait<span class="loading"></span></h3></div>'
}

const myApi = axios.create()
var timeId = null

function handleErrorMessage (error, callback) {
  $$('.block-ui, .block-ui-msg').remove()
  $$('.av-block-ui-container').hide()
  // bootbox.hideAll()
  if (error.response && error.response.data &&
  (error.response.data.statusCode === '9995' || error.response.data.statusCode === '9996' ||
  error.response.data.statusCode === '9998' || error.response.data.statusCode === '9999')) {
    switch (error.response.statusCode) {
      case '9995':
        toasterMessage(i18n.errorMessageSessionExpired, '/login')
        break
      case '9996':
        toasterMessage(i18n.errorMessageRequestInvalid, null)
        break
      case '9998':
        toasterMessage(i18n.errorMessageRequestMissedMandatoryFields, null)
        break
      default:
        toasterMessage(i18n.errorMessageRequestUnknownErrorInServer, null)
        break
    }
  } else if (error.response && error.response.status) {
    switch (error.response.status) {
      case 400:
        callback(error.response)
        toasterMessage(error.response.data.statusMessage, null)
        break
      default:
        toasterMessage(i18n.errorMessageRequestInvalid, null)
        break
    }
  } else {
    toasterMessage(i18n.errorMessageRequestInvalid, null)
  }
}

// function handleSuccessMessage (response, callback) {
//   $$('.block-ui, .block-ui-msg').remove()
//   $$('.av-block-ui-container').hide()
//   // bootbox.hideAll()
//   if (response) {
//     toasterSuccessMessage('Login Success', '/app')
//     callback(response)
//   }
// }

function toasterMessage (message, pushUrl) {
  clearTimeout(timeId)
  timeId = setTimeout(function () {
    let bb = cbootbox
    bb.alert({
      size: 'medium',
      title: 'Alert',
      type: 'error',
      message: message,
      callback: function () {
        bootbox.hideAll()
        /* let data = localStorage.getItem('token')
        localStorage.clear()
        localStorage.setItem('token', data) */
        if (pushUrl) {
          hashHistory.push(pushUrl)
        }
        $$('.av-block-ui-container').hide()
      },
      buttons: {
        ok: {
          label: 'OK'
        }
      }
    })
  }, 800)
}
// function toasterSuccessMessage (message, pushUrl) {
//   clearTimeout(timeId)
//   timeId = setTimeout(function () {
//     let bb = cbootbox
//     bb.alert({
//       size: 'medium',
//       title: 'Alert',
//       type: 'success',
//       message: message,
//       callback: function () {
//         bootbox.hideAll()
//         if (pushUrl) {
//           hashHistory.push(pushUrl)
//         }
//         $$('.av-block-ui-container').hide()
//       },
//       buttons: {
//         ok: {
//           label: 'OK'
//         }
//       }
//     })
//   }, 800)
// }
function addLogging (error) {
  if (window.FS && typeof window.FS.log === 'function') {
    window.FS.log(error)
  }
}

const ApiCallManager = {
  getCall: function (obj, callback) {
    if (localStorage.getItem('token')) {
      myApi.defaults.headers.token = localStorage.getItem('token')
    }
    if (!$$('.block-ui').length) {
      $$('body').append(blockElement())
    }

    myApi.get(obj.url).then(function (response) {
      $$('.block-ui, .block-ui-msg').remove()
      if (response.headers.token) {
        localStorage.setItem('token', response.headers.token)
      }
      callback(response)
    }).catch(function (error) {
      addLogging(error)
      $$('.block-ui, .block-ui-msg').remove()
      callback(error.response)
      // handleErrorMessage(error, callback)
    })
  },

  postCall: function (obj, callback) {
    if (localStorage.getItem('token')) {
      myApi.defaults.headers.token = localStorage.getItem('token')
    }
    if (localStorage.getItem('otp_token')) {
      myApi.defaults.headers.otp_token = localStorage.getItem('otp_token')
    }
    $$('body').append(blockElement())

    myApi.post(obj.url, obj.body).then(function (response) {
      $$('.block-ui, .block-ui-msg').remove()
      // handleSuccessMessage(response, callback)
      if (response.headers.token) {
        localStorage.setItem('token', response.headers.token)
      }
      if (response.headers.otp_token) {
        localStorage.setItem('otp_token', response.headers.otp_token)
      }
      callback(response)
    }).catch(function (error) {
      addLogging(error)
      $$('.block-ui, .block-ui-msg').remove()
      callback(error.response)
      // handleErrorMessage(error, callback)
    })
  },

  putCall: function (obj, callback) {
    if (localStorage.getItem('token')) {
      myApi.defaults.headers.token = localStorage.getItem('token')
    }
    $$('body').append(blockElement())

    myApi.put(obj.url, obj.body).then(function (response) {
      $$('.block-ui, .block-ui-msg').remove()
      if (response.headers.token) {
        localStorage.setItem('token', response.headers.token)
      }
      callback(response)
    }).catch(function (error) {
      addLogging(error)
      $$('.block-ui, .block-ui-msg').remove()
      callback(error.response)
      // handleErrorMessage(error, callback)
    })
  },

  deleteCall: function (obj, callback) {
    if (localStorage.getItem('token')) {
      myApi.defaults.headers.token = localStorage.getItem('token')
    }
    $$('body').append(blockElement())

    myApi.delete(obj.url).then((response) => {
      $$('.block-ui, .block-ui-msg').remove()
      if (response.headers.token) {
        localStorage.setItem('token', response.headers.token)
      }
      callback(response)
    }).catch((error) => {
      addLogging(error)
      $$('.block-ui, .block-ui-msg').remove()
      callback(error.response)
      // handleErrorMessage(error, callback)
    })
  },

  allCall: function (obj, callback) {
    myApi.defaults.headers.token = localStorage.getItem('token')
    $$('body').append(blockElement())
    // setHeaderOptions(obj)
    axios.all(obj).then(axios.spread((...args) => {
      $$('.block-ui, .block-ui-msg').remove()
      localStorage.setItem('token', args.headers.token)
      callback(args)
    })).catch(function (error) {
      addLogging(error)
      $$('.block-ui, .block-ui-msg').remove()
      handleErrorMessage(error, callback)
    })
  }
}

export default ApiCallManager
