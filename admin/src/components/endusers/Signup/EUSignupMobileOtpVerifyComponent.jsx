/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'

import { t } from 'ttag'
import './css/EUSignup.css'
import EUSignupPasswordComponent from './EUSignupPasswordComponent'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'

class EUSignupMobileOtpVerifyComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = props.stateData

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleNumber = this.handleNumber.bind(this)
  }

  componentWillReceiveProps (newProps) {
    this.state = newProps.state
    if (newProps.state.otpValue) {
      this.refs.otpNumber01.value = ''
      this.refs.otpNumber02.value = ''
      this.refs.otpNumber03.value = ''
      this.refs.otpNumber04.value = ''
      this.refs.otpNumber01.focus()
    } else {
      setTimeout(() => {
        this.refs.mobileOtpClose.focus()
      }, 120)
    }
  }

  handleNumber (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
    event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
    (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }

  handleSubmit (event) {
    let otpNumber = this.state.otpNumber01 + this.state.otpNumber02 + this.state.otpNumber03 + this.state.otpNumber04
    if (!otpNumber) {
      this.setState({ errorMessage: t`lanEULabelErrorPleaseEnterOTPNumber` })
    } else if (otpNumber.length < 4) {
      this.setState({ errorMessage: t`lanEULabelErrorPleaseEnterFullOTPNumber` })
    } else {
      let _this = this
      let userData = {
        otpNumber: otpNumber
      }
      let obj = { url: config.baseUrl + config.postEUUserSignupVerifyOtpAPI, body: userData }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '1002') {
          _this.setState({ setPassword: true, errorMessage: '' })
        } else {
          _this.setState({ errorMessage: t`lanEULabelErrorInvalidOTP` })
        }
      })
    }
    event.preventDefault()
  }
  handleBack () {
    this.props.handleBack()
  }

  render () {
    return (
      <div>
        {!this.state.setPassword
        ? <div className='container pb-5 eu-content'>
          <div className='row justify-content-center'>
            <div className='col-lg-6 col-md-8'>
              <div className='card border-0 mb-0'>
                <div className='card-header bg-transparent text-center pb-3'>
                  <h5 className='card-title'>{ t`lanEUTitleSignup` }</h5>
                </div>
                <div className='card-body px-lg-3 signup-verify'>
                  <form role='form'>
                    <div className='text-center mb-3'>
                      {/* <h4 className='heading'>Hi,</h4> */}
                      <p>{ t`lanEULabelErrorEnterOtp` }</p>
                    </div>
                    <div className='form-row justify-content-center'>
                      <div className='col-md-2 col-2'>
                        <input autoFocus type='text' className='form-control text-center' ref='otpNumber01' maxLength={1} onKeyPress={this.handleNumber}
                          onChange={event => {
                            this.setState({ otpNumber01: event.target.value, errorMessage: '' })
                            if (event.target.value && event.target.value.length === 1) {
                              this.refs.otpNumber02.focus()
                            }
                          }} />
                      </div>
                      <div className='col-md-2 col-2'>
                        <input type='text' className='form-control text-center' ref='otpNumber02' maxLength={1} onKeyPress={this.handleNumber}
                          onChange={event => {
                            this.setState({ otpNumber02: event.target.value, errorMessage: '' })
                            if (event.target.value && event.target.value.length === 1) {
                              this.refs.otpNumber03.focus()
                            }
                          }} />
                      </div>
                      <div className='col-md-2 col-2'>
                        <input type='text' className='form-control text-center' ref='otpNumber03' maxLength={1} onKeyPress={this.handleNumber}
                          onChange={event => {
                            this.setState({ otpNumber03: event.target.value, errorMessage: '' })
                            if (event.target.value && event.target.value.length === 1) {
                              this.refs.otpNumber04.focus()
                            }
                          }} />
                      </div>
                      <div className='col-md-2 col-2'>
                        <input type='text' className='form-control text-center' ref='otpNumber04' maxLength={1} onKeyPress={this.handleNumber}
                          onChange={event => {
                            this.setState({ otpNumber04: event.target.value, errorMessage: '' })
                            if (event.target.value && event.target.value.length === 1) {
                              this.refs.mobileOtpNumSubmit.focus()
                            }
                          }} />
                      </div>
                    </div>
                    <label className='text-danger text-center'>{this.state.errorMessage}</label>
                    <div>
                      <div className='text-center'>
                        <button type='button' className='btn btn-info mt-2' ref='mobileOtpClose' onClick={this.handleBack}>{ t`lanCommonButtonBack` }</button>
                        <button type='button' className='btn btn-primary mt-2' ref='mobileOtpNumSubmit' onClick={this.handleSubmit}>{ t`lanCommonButtonDone` }</button>
                      </div>
                    </div>
                    <div className='text-center mt-4'>
                      <div className='h4 font-weight-300'>
                        <p>{ t`lanEULabelErrorOTP` }: {this.state.otpValue}</p>
                        <a className='btn-link'>{ t`lanEUButtonResendOTP` }</a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        : <EUSignupPasswordComponent stateData={this.state} />}
      </div>
    )
  }
}

EUSignupMobileOtpVerifyComponent.propTypes = {
  stateData: PropTypes.any,
  handleBack: PropTypes.func
}
export default EUSignupMobileOtpVerifyComponent
