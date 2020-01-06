/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import '../css/signup.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import { t } from 'ttag'

class SPSignupOtpComponent extends React.Component {

  constructor (props) {
    super(props)
    this.state = this.props.state
    this.handleValidateOtp = this.handleValidateOtp.bind(this)
  }

  componentWillReceiveProps (newProps) {
    this.state = newProps.state
    if (newProps.state.otpValue) {
      if (newProps.state.otpType === 'Mobile') {
        setTimeout(() => {
          this.refs.otpNumber01.value = ''
          this.refs.otpNumber02.value = ''
          this.refs.otpNumber03.value = ''
          this.refs.otpNumber04.value = ''
          this.refs.otpNumber01.focus()
        }, 120)
      } else {
        setTimeout(() => {
          this.refs.otpNumber05.value = ''
          this.refs.otpNumber06.value = ''
          this.refs.otpNumber07.value = ''
          this.refs.otpNumber08.value = ''
          this.refs.otpNumber05.focus()
        }, 120)
      }
    } else {
      if (newProps.state.otpType === 'Mobile') {
        setTimeout(() => {
          this.refs.mobileOtpClose.focus()
        }, 120)
      } else {
        setTimeout(() => {
          this.refs.emailOtpClose.focus()
        }, 120)
      }
    }
  }

  handleValidateOtp () {
    let otpNumber = this.state.otpNumber01 + this.state.otpNumber02 + this.state.otpNumber03 + this.state.otpNumber04
    if (!otpNumber) {
      this.setState({ popupErrorMsg: t`lanSPLabelErrorEnterOtp`, popupSuccessMsg: '' })
    } else if (otpNumber.length < 4) {
      this.setState({ popupErrorMsg: t`lanSPLabelErrorEnterFullOtp`, popupSuccessMsg: '' })
    } else {
      let _this = this
      let userData = {
        otpType: this.state.otpType,
        otpNumber: otpNumber
      }
      let obj = { url: config.baseUrl + config.postSPUserSignupVerifyOtpAPI, body: userData }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '1002') {
          if (_this.state.otpType === 'Mobile') {
            _this.setState({ mobileNumVerifyStatus: 'Verified', verifiedMobileNumber: _this.state.mobileNumber, popupErrorMsg: '', popupSuccessMsg: 'OTP Verfied', otpValue: '', otpNumber: '' })
            _this.refs.mobileOtpClose.click()
            setTimeout(() => {
              _this.callParent('Verified')
            }, 300)
          } else {
            _this.setState({ emailVerifyStatus: 'Verified', verifiedEmail: _this.state.email, popupErrorMsg: '', popupSuccessMsg: 'OTP Verfied', otpValue: '', otpNumber: '' })
            _this.refs.emailOtpClose.click()
            setTimeout(() => {
              _this.callParent('Verified')
            }, 300)
          }
        } else {
          _this.setState({ popupErrorMsg: t`lanSPLabelErrorOtpVerificationFailed` })
        }
      })
    }
  }

  callParent (verifyStatus) {
    setTimeout(() => {
      this.props.handlePropsValidateOtp(verifyStatus)
    }, 300)
  }

  render () {
    return (
      <div>
        {/* Modal - Phone Number */}
        <div className='modal fade' id='modal-verifyPhone' role='dialog' aria-labelledby='modal-form' aria-hidden='true'>
          <div className='modal-dialog modal- modal-dialog-centered modal-sm' role='document'>
            <div className='modal-content'>
              {this.state.mobileNumVerifyStatus === 'Verify'
              ? <div className='modal-body'>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>×</span>
                </button>
                <div className='text-center mb-3'>
                  <h4 className='heading'>Hi {this.state.contactPerson.trim() ? this.state.contactPerson : 'Guest'}</h4>
                  <p>{t`lanSPLabelEnterForgotOtp`}</p>
                </div>
                <div className='form-row mx-3'>
                  <div className='col-md-3 col-3'>
                    <input type='text' style={{ textAlign:'center' }} className='form-control' ref='otpNumber01' maxLength={1} onChange={
                      event => {
                        this.setState({ otpNumber01: event.target.value, popupErrorMsg: '' })
                        if (event.target.value && event.target.value.length === 1) {
                          this.refs.otpNumber02.focus()
                        }
                      }} />
                  </div>
                  <div className='col-md-3 col-3'>
                    <input type='text' style={{ textAlign:'center' }} className='form-control' ref='otpNumber02' maxLength={1} onChange={
                      event => {
                        this.setState({ otpNumber02: event.target.value, popupErrorMsg: '' })
                        if (event.target.value && event.target.value.length === 1) {
                          this.refs.otpNumber03.focus()
                        }
                      }} />
                  </div>
                  <div className='col-md-3 col-3'>
                    <input type='text' style={{ textAlign:'center' }} className='form-control' ref='otpNumber03' maxLength={1} onChange={
                      event => {
                        this.setState({ otpNumber03: event.target.value, popupErrorMsg: '' })
                        if (event.target.value && event.target.value.length === 1) {
                          this.refs.otpNumber04.focus()
                        }
                      }} />
                  </div>
                  <div className='col-md-3 col-3'>
                    <input type='text' style={{ textAlign:'center' }} className='form-control' ref='otpNumber04' maxLength={1} onChange={
                      event => {
                        this.setState({ otpNumber04: event.target.value, popupErrorMsg: '' })
                        if (event.target.value && event.target.value.length === 1) {
                          this.refs.mobileOtpNumberSubmit.focus()
                        }
                      }} />
                  </div>
                </div>
                <label className='text-danger'>{this.state.popupErrorMsg}</label>
                <label className='text-success'>{this.state.popupSuccessMsg}</label>
                <div className='form-row text-center'>
                  <div className='col'>
                    <button type='button' onClick={() => this.handleValidateOtp()} ref='mobileOtpNumberSubmit'
                      className='btn btn-primary mr-3'>Submit</button>
                    <button type='button' ref='mobileOtpClose' className='btn btn-outline-default' data-dismiss='modal' aria-label='Close'>Close</button>
                  </div>
                </div>
                <div className='text-center mt-4'>
                  <div className='h4 font-weight-300'>
                    <p>OTP: {this.state.otpValue}</p>
                    {/* <a href='#' className='btn-link'>Resend OTP</a> */}
                  </div>
                </div>
              </div>
              : <div className='modal-body'>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>×</span>
                </button>
                <div className='text-center mb-3'>
                  <h4 className='heading'>Hi {this.state.contactPerson.trim() ? this.state.contactPerson : 'Guest'}</h4>
                  <p>{this.state.errorMessage}</p>
                </div>
                <div className='form-row mt-3 text-center'>
                  <div className='col'>
                    <button type='button' ref='mobileOtpClose' className='btn btn-outline-default' data-dismiss='modal' aria-label='Close'>Okay</button>
                  </div>
                </div>
              </div>}
            </div>
          </div>
        </div>

        {/* Modal - Eamil */}
        <div className='modal fade' id='modal-verifyEamil' role='dialog' aria-labelledby='modal-form' aria-hidden='true'>
          <div className='modal-dialog modal- modal-dialog-centered modal-sm' role='document'>
            <div className='modal-content'>
              {this.state.emailVerifyStatus === 'Verify'
              ? <div className='modal-body'>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>×</span>
                </button>
                <div className='text-center mb-3'>
                  <h4 className='heading'>Hi {this.state.contactPerson.trim() ? this.state.contactPerson : 'Guest'}</h4>
                  <p>{t`lanSPLabelEnterForgotOtp`}</p>
                </div>
                <div className='form-row mx-3'>
                  <div className='col-md-3 col-3'>
                    <input type='text' style={{ textAlign:'center' }} className='form-control' ref='otpNumber05' maxLength={1} onChange={
                      event => {
                        this.setState({ otpNumber01: event.target.value, popupErrorMsg: '' })
                        if (event.target.value && event.target.value.length === 1) {
                          this.refs.otpNumber06.focus()
                        }
                      }} />
                  </div>
                  <div className='col-md-3 col-3'>
                    <input type='text' style={{ textAlign:'center' }} className='form-control' ref='otpNumber06' maxLength={1} onChange={
                      event => {
                        this.setState({ otpNumber02: event.target.value, popupErrorMsg: '' })
                        if (event.target.value && event.target.value.length === 1) {
                          this.refs.otpNumber07.focus()
                        }
                      }} />
                  </div>
                  <div className='col-md-3 col-3'>
                    <input type='text' style={{ textAlign:'center' }} className='form-control' ref='otpNumber07' maxLength={1} onChange={
                      event => {
                        this.setState({ otpNumber03: event.target.value, popupErrorMsg: '' })
                        if (event.target.value && event.target.value.length === 1) {
                          this.refs.otpNumber08.focus()
                        }
                      }} />
                  </div>
                  <div className='col-md-3 col-3'>
                    <input type='text' style={{ textAlign:'center' }} className='form-control' ref='otpNumber08' maxLength={1} onChange={
                      event => {
                        this.setState({ otpNumber04: event.target.value, popupErrorMsg: '' })
                        if (event.target.value && event.target.value.length === 1) {
                          this.refs.emailOtpNumberSubmit.focus()
                        }
                      }} />
                  </div>
                </div>
                <label className='text-danger'>{this.state.popupErrorMsg}</label>
                <label className='text-success'>{this.state.popupSuccessMsg}</label>
                <div className='form-row mt-4 text-center'>
                  <div className='col'>
                    <button type='button' ref='emailOtpNumberSubmit' onClick={() => this.handleValidateOtp()} className='btn btn-primary mr-3'>{t`lanSPButtonSubmit`}</button>
                    <button type='button' ref='emailOtpClose' className='btn btn-outline-default' data-dismiss='modal' aria-label='Close'>{t`lanSPButtonClose`}</button>
                  </div>
                </div>
                <div className='text-center mt-3'>
                  <div className='h4 font-weight-300'>
                    <p>OTP: {this.state.otpValue}</p>
                    {/* <a href='#' className='btn-link'>Resend OTP</a> */}
                  </div>
                </div>
              </div>
              : <div className='modal-body'>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>×</span>
                </button>
                <div className='text-center mb-3'>
                  <h4 className='heading'>Hi {this.state.contactPerson.trim() ? this.state.contactPerson : 'Guest'}</h4>
                  <p>{this.state.errorMessage}</p>
                </div>
                <div className='form-row mt-3 text-center'>
                  <div className='col'>
                    <button type='button' ref='emailOtpClose' className='btn btn-outline-default' data-dismiss='modal' aria-label='Close'>Okay</button>
                  </div>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SPSignupOtpComponent.propTypes = {
  state: PropTypes.any,
  handlePropsValidateOtp: PropTypes.func
}

export default SPSignupOtpComponent
