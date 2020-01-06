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
import { t } from 'ttag'

require('./blockUI.scss')

function blockElement () {
  return '<div class="block-ui"></div><div class="block-ui-msg"><i class="fa fa-spinner fa-spin fa-3x"></i><h3 class="text-white">Please wait<span class="loading"></span></h3></div>'
}

function unBlockElement () {
  return '<div ></div>'
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

function handleSuccessMessage (response, callback) {
  $$('.block-ui, .block-ui-msg').remove()
  $$('.av-block-ui-container').hide()
  // bootbox.hideAll()
  if (response) {
    toasterSuccessMessage('Login Success', '/app')
    callback(response)
  }
}

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
  }, 500)
}
function toasterSuccessMessage (message, pushUrl) {
  clearTimeout(timeId)
  timeId = setTimeout(function () {
    let bb = cbootbox
    bb.alert({
      size: 'medium',
      title: 'Alert',
      type: 'success',
      message: message,
      callback: function () {
        bootbox.hideAll()
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
function addLogging (error) {
  if (window.FS && typeof window.FS.log === 'function') {
    window.FS.log(error)
  }
}

function setAPITimeout (time, pushUrl) {
  return setTimeout(function () {
    toasterMessage(t`lanSPLabelErrorServerNotConnectAlert`, null)
    setTimeout(function () {
      $$('.block-ui, .block-ui-msg').remove()
      if (pushUrl) {
        hashHistory.push(pushUrl)
      }
    }, 2000)
  }, time)
}

const ApiCallManager = {
  getCall: function (obj, callback) {
    var input = navigator.onLine
    if (input) {
      if (localStorage.getItem('token')) {
        myApi.defaults.headers.token = localStorage.getItem('token')
      }
      if (!$$('.block-ui').length && !obj.unBlockStatus) {
        $$('body').append(blockElement())
      } else {
        $$('body').append(unBlockElement())
      }
      let isLoading = setAPITimeout(10000, obj.routing)

      myApi.get(obj.url).then(function (response) {
        clearTimeout(isLoading)
        $$('.block-ui, .block-ui-msg').remove()
        if (response.headers.token) {
          localStorage.setItem('token', response.headers.token)
        }
        setTimeout(function () {
          callback(response)
        }, 100)
      }).catch(function (error) {
        clearTimeout(isLoading)
        addLogging(error)
        $$('.block-ui, .block-ui-msg').remove()
        setTimeout(function () {
          callback(error.response)
        }, 200)
        // handleErrorMessage(error, callback)
      })
    } else {
      toasterMessage(t`lanSPLabelErrorInternetAlert`, null)
      setTimeout(function () {
        callback(null)
      }, 200)
      // localStorage.setItem('reRequest', obj.routing)
      // // alert('No Internet' + '========' + JSON.stringify(input))
      // hashHistory.push('/nointernet')
    }
  },

  postCall: function (obj, callback) {
    var input = navigator.onLine
    if (input) {
      if (localStorage.getItem('token')) {
        myApi.defaults.headers.token = localStorage.getItem('token')
      }
      if (localStorage.getItem('otp_token')) {
        myApi.defaults.headers.otp_token = localStorage.getItem('otp_token')
      }
      $$('body').append(blockElement())
      let isLoading = setAPITimeout(20000, obj.routing)

      myApi.post(obj.url, obj.body).then(function (response) {
        clearTimeout(isLoading)
        $$('.block-ui, .block-ui-msg').remove()
        // handleSuccessMessage(response, callback)
        if (response.headers.token) {
          localStorage.setItem('token', response.headers.token)
        }
        if (response.headers.otp_token) {
          localStorage.setItem('otp_token', response.headers.otp_token)
        }
        setTimeout(function () {
          callback(response)
        }, 100)
      }).catch(function (error) {
        clearTimeout(isLoading)
        addLogging(error)
        $$('.block-ui, .block-ui-msg').remove()
        setTimeout(function () {
          callback(error.response)
        }, 200)
        // handleErrorMessage(error, callback)
      })
    } else {
      toasterMessage(t`lanSPLabelErrorInternetAlert`, null)
      setTimeout(function () {
        callback(null)
      }, 200)
    }
  },

  putCall: function (obj, callback) {
    var input = navigator.onLine
    if (input) {
      if (localStorage.getItem('token')) {
        myApi.defaults.headers.token = localStorage.getItem('token')
      }
      $$('body').append(blockElement())
      let isLoading = setAPITimeout(15000, obj.routing)

      myApi.put(obj.url, obj.body).then(function (response) {
        clearTimeout(isLoading)
        $$('.block-ui, .block-ui-msg').remove()
        if (response.headers.token) {
          localStorage.setItem('token', response.headers.token)
        }
        setTimeout(function () {
          callback(response)
        }, 100)
      }).catch(function (error) {
        clearTimeout(isLoading)
        addLogging(error)
        $$('.block-ui, .block-ui-msg').remove()
        setTimeout(function () {
          callback(error.response)
        }, 200)
        // handleErrorMessage(error, callback)
      })
    } else {
      toasterMessage(t`lanSPLabelErrorInternetAlert`, null)
      setTimeout(function () {
        callback(null)
      }, 200)
    }
  },

  deleteCall: function (obj, callback) {
    var input = navigator.onLine
    if (input) {
      if (localStorage.getItem('token')) {
        myApi.defaults.headers.token = localStorage.getItem('token')
      }
      $$('body').append(blockElement())
      let isLoading = setAPITimeout(15000, obj.routing)

      myApi.delete(obj.url).then((response) => {
        clearTimeout(isLoading)
        $$('.block-ui, .block-ui-msg').remove()
        if (response.headers.token) {
          localStorage.setItem('token', response.headers.token)
        }
        setTimeout(function () {
          callback(response)
        }, 100)
      }).catch((error) => {
        clearTimeout(isLoading)
        addLogging(error)
        $$('.block-ui, .block-ui-msg').remove()
        setTimeout(function () {
          callback(error.response)
        }, 200)
        // handleErrorMessage(error, callback)
      })
    } else {
      toasterMessage(t`lanSPLabelErrorInternetAlert`, null)
      setTimeout(function () {
        callback(null)
      }, 200)
    }
  },

  allCall: function (obj, callback) {
    var input = navigator.onLine
    if (input) {
      myApi.defaults.headers.token = localStorage.getItem('token')
      $$('body').append(blockElement())
      // setHeaderOptions(obj)
      axios.all(obj).then(axios.spread((...args) => {
        $$('.block-ui, .block-ui-msg').remove()
        localStorage.setItem('token', args.headers.token)
        setTimeout(function () {
          callback(args)
        }, 100)
      })).catch(function (error) {
        addLogging(error)
        $$('.block-ui, .block-ui-msg').remove()
        handleErrorMessage(error, callback)
      })
    } else {
      toasterMessage(t`lanSPLabelErrorInternetAlert`, null)
      setTimeout(function () {
        callback(null)
      }, 200)
    }
  }
}

export default ApiCallManager
