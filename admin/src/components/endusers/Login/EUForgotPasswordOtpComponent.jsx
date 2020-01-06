/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import EUResetPasswordComponent from './EUResetPasswordComponent'

class EUForgotPasswordOtpComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      otpNumber: '',
      otpNumber01: '',
      otpNumber02: '',
      otpNumber03: '',
      otpNumber04: '',
      errorMessage: '',
      isShowForgotPasswordOtp: true,
      isShowResetPassword: false
    }
    this.handleOtpDone = this.handleOtpDone.bind(this)
  }
  componentWillMount () {
    let forgotPasswordObj = JSON.parse(localStorage.getItem('forgotPasswordObj'))
    this.setState({
      otpNumber: forgotPasswordObj.otpNumber
    })
  }

  handleOtpDone (event) {
    let otpNumber = this.state.otpNumber01 + this.state.otpNumber02 + this.state.otpNumber03 + this.state.otpNumber04
    if (!otpNumber) {
      this.setState({ errorMessage: t`lanEULabelErrorEnterOtp` })
    } else if (otpNumber.length < 4) {
      this.setState({ errorMessage: t`lanEULabelErrorEnterOtp` })
    } else {
      let postObj = {
        url: config.baseUrl + config.postEUForgotPasswordOtpVerifyAPI,
        body: { otp: otpNumber }
      }
      let _this = this
      APICallManager.postCall(postObj, function (resObj) {
        try {
          if (resObj.data.statusCode === '1255') {
            _this.setState({
              isShowForgotPasswordOtp: false,
              isShowResetPassword: !_this.state.isShowResetPassword
            })
           // hashHistory.push('/login/forgotpasssword/reset')
          } else {
            _this.setState({ errorMessage: t`lanEULabelErrorInvalidOtp` })
          }
        } catch (error) {
          console.log('=====ERROR:', error)
        }
      })
    }
    event.preventDefault()
  }

  render () {
    return (
      <div>
        {this.state.isShowForgotPasswordOtp
        ? <div className='container pb-5 eu-content'>
          <div className='row justify-content-center'>
            <div className='col-lg-6 col-md-8'>
              <div className='card border-0 mb-0'>
                <div className='card-header bg-transparent'>
                  <h5 className='card-title text-center'>{t`lanEUTitleForgotPaswordOtp`}</h5>
                </div>
                <div className='card-body px-lg-3 py-lg-3'>
                  <form role='form'>
                    <div className='row justify-content-center'>{/* Styles */}
                    </div>
                    <div className='px-lg-6 py-lg-3'>
                      <div className='text-center mb-3'>
                        <div className='h4 font-weight-300'>{t`lanEULabelEnterForgotOtp`}</div>
                      </div>
                      <div className='form-row justify-content-center'>
                        <div className='col-md-2 col-3'>
                          <input type='text' autoFocus className='form-control text-center' ref='otpNumber01' maxLength={1} onChange={
                            event => {
                              this.setState({ otpNumber01: event.target.value, errorMessage: '' })
                              if (event.target.value && event.target.value.length === 1) {
                                this.refs.otpNumber02.focus()
                              }
                            }} />
                        </div>
                        <div className='col-md-2 col-3'>
                          <input type='text' className='form-control text-center' ref='otpNumber02' maxLength={1} onChange={
                            event => {
                              this.setState({ otpNumber02: event.target.value, errorMessage: '' })
                              if (event.target.value && event.target.value.length === 1) {
                                this.refs.otpNumber03.focus()
                              }
                            }} />
                        </div>
                        <div className='col-md-2 col-3'>
                          <input type='text' className='form-control text-center' ref='otpNumber03' maxLength={1} onChange={
                            event => {
                              this.setState({ otpNumber03: event.target.value, errorMessage: '' })
                              if (event.target.value && event.target.value.length === 1) {
                                this.refs.otpNumber04.focus()
                              }
                            }} />
                        </div>
                        <div className='col-md-2 col-3'>
                          <input type='text' className='form-control text-center' ref='otpNumber04' maxLength={1} onChange={
                            event => {
                              this.setState({ otpNumber04: event.target.value, errorMessage: '' })
                              if (event.target.value && event.target.value.length === 1) {
                                this.refs.otpNumberSubmit.focus()
                              }
                            }} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className='text-muted text-center'><small style={{ color: 'red' }}>{this.state.errorMessage}</small> </p>
                      <div className='text-center'>
                        <button type='button' ref='otpNumberSubmit' className='btn btn-primary mt-2' onClick={this.handleOtpDone}>{t`lanCommonButtonDone`}</button>
                      </div>
                    </div>
                    <div className='text-center mt-2'>
                      <div className='h4 font-weight-300'>
                        <p>{this.state.otpNumber}</p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        : this.state.isShowResetPassword ? <EUResetPasswordComponent />
        : null}
      </div>
    )
  }
}

export default EUForgotPasswordOtpComponent
