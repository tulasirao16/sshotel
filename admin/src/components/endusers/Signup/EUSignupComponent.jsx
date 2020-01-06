/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'

import './css/EUSignup.css'
import EUSignupMobileOtpVerifyComponent from './EUSignupMobileOtpVerifyComponent'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import { t } from 'ttag'

const phRegex = /^\d{10}$/

class EUSignupComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      mobileNumber: '',
      mbnSuccess: false,
      password: '',
      pError: '',
      pSuccess: false,
      mbnError : '',
      verifyOtp: false,
      setPassword: false,
      passwordType: 'password',
      otpNumber: '',
      otpNumber01: '',
      otpNumber02: '',
      otpNumber03: '',
      otpNumber04: '',
      otpValue: '',
      errorMessage: '',
      showPassword: true
    }
    this.handleNumber = this.handleNumber.bind(this)
    this.handleSpVerify = this.handleSpVerify.bind(this)
    this.handleEndUserLogin = this.handleEndUserLogin.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }
  componentWillMount () {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userRole === 'Customer') {
      hashHistory.push('/hotels')
    } else if (authObj && authObj.userType) {
      this.setState({ errorMessage: t`lanEULabelErrorLoggedInHost` })
    }
  }
  handleSpVerify (event) {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userType) {
      this.setState({ errorMessage: t`lanEULabelErrorLoggedInHost` })
    } else if (!this.state.mobileNumber.trim()) {
      this.setState({ mbnError: t`lanEULabelErrorMobileNumberRequired`, mbnSuccess: false })
    } else if (!this.state.mobileNumber.trim().match(phRegex)) {
      this.setState({ mbnError: t`lanEULabelErrorInvalidMobileNumber`, mbnSuccess: false })
    } else if (this.state.otpValue) {
      this.setState({ verifyOtp: true, errorMessage: '' })
    } else {
      let _this = this
      let userData = {
        mobileNumber: this.state.mobileNumber
      }
      let obj = { url: config.baseUrl + config.postEUUserSignupSendOtpAPI, body: userData }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '1001') {
          _this.setState({ verifyOtp: true, otpValue: resObj.data.statusResult.otpNumber, errorMessage: '' })
        } else if (resObj.data.statusCode === '9989') {
          _this.setState({ errorMessage: t`lanEULabelErrorAlreadyAccountWithThisMobilenumber` })
        } else {
          _this.setState({ errorMessage: t`lanEULabelErrorOTPSentFailed` })
        }
      })
    }
    event.preventDefault()
  }

  handleNumber (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
    event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
    (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }

  handleEndUserLogin () {
    hashHistory.push('/login')
    event.preventDefault()
  }

  handleBack () {
    this.setState({ verifyOtp: false, errorMessage: '' })
  }

  render () {
    return (
      <div>
        {!this.state.verifyOtp
        ? <div className='container pb-5 eu-content enduser-signup'>
          <div className='row justify-content-center'>
            <div className='col-lg-10 col-md-8 text-center'>
              <div className='card signup-card border-0 mb-0'>
                <div className='row'>
                  <div className='col-lg-7'>
                    <div className='signup-overlay'>
                     {/* <div className='text-muted text-center'><p>Login with Social media</p></div> */}
                    </div>
                  </div>
                  <div className='col-lg-5'>
                    <div className='card border-0 mb-0'>
                      <div className='card-header bg-transparent pb-3'>
                        <h5 className='card-title'>{ t`lanEUTitleSignup` }</h5>
                      </div>
                      <div className='card-body px-lg-5 py-lg-6'>
                        <form role='form'>
                          <div className='row '>
                            <div className='col-lg-12'>
                              <div className='row'>
                                <div className='col-sm-12 text-left'>
                                  <div className='form-group'>
                                    <label className='form-control-label '>{ t`lanEULabelMobile` } <span className='error'>*</span></label>
                                    <input type='text' autoFocus className='form-control' placeholder={t`lanEULabelEnterMobileNumber`} style={this.state.mbnSuccess ? { borderColor: '#4da424' } : {}} maxLength={10}
                                      onKeyPress={this.handleNumber} onChange={(e) => this.setState({ mobileNumber: e.target.value, mbnError: '', errorMessage: '', mbnSuccess: true })} value={this.state.mobileNumber} />
                                    <span className='input-error-icon' ><i className='fas fa-check' style={this.state.mbnSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                                    <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.mbnError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                                    <p className='text-muted text-sm' style={{ height: 24 }}><small style={{ color: 'red' }}>{this.state.mbnError}</small> </p>
                                  </div>
                                </div>
                                <div className='col-lg-12 col-sm-12 text-right'>
                                  <button type='button' onClick={this.handleSpVerify} className='btn btn-primary mt-2'>{ t`lanEUButtonNext` }</button>
                                  <div className='text-right mt-2'>
                                    <span className='text-muted text-sm'><small>{ t`lanEULabelDontHaveAccount` } </small> <a style={{ color: '#01a4a2' }} onClick={this.handleEndUserLogin} className='text-underline'> { t`lanEUButtonLogin` }</a></span>
                                    <p className='text-muted'><small style={{ color: 'red' }}>{this.state.errorMessage}</small> </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        : <EUSignupMobileOtpVerifyComponent stateData={this.state} handleBack={this.handleBack} /> }
      </div>
    )
  }
}

export default EUSignupComponent
