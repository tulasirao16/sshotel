/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class SPForgotPasswordOtpComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      otpNumber: '',
      otpNumber01: '',
      otpNumber02: '',
      otpNumber03: '',
      otpNumber04: '',
      errorMessage: ''
    }
    this.handleOtpDone = this.handleOtpDone.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  handleSignIn () {
    hashHistory.push('/host/signin')
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
      this.setState({ errorMessage: t`lanSPLabelErrorEnterOtp` })
    } else if (otpNumber.length < 4) {
      this.setState({ errorMessage: t`lanSPLabelErrorEnterOtp` })
    } else {
      let postObj = {
        url: config.baseUrl + config.postSPForgotPasswordOtpVerifyAPI,
        body: { otp: otpNumber }
      }
      let _this = this
      APICallManager.postCall(postObj, function (resObj) {
        try {
          if (resObj.data.statusCode === '1002') {
            hashHistory.push('/host/signin/forgotpasssword/reset')
          } else {
            _this.setState({ errorMessage: t`lanSPLabelErrorInvalidOtp` })
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
        {/* -------- Heaer ---------- */}
        {/* <div className='header py-8 py-lg-7 pt-lg-9 home-header'>
          <div className='separator separator-bottom separator-skew zindex-100'>
            <svg x='0' y='0' viewBox='0 0 2560 100' preserveAspectRatio='none' version='1.1' xmlns='http://www.w3.org/2000/svg'>
              <polygon className='fill-default' points='2560 0 2560 100 0 100' />
            </svg>
          </div>
        </div> */}
        <div className='container'>
          <div className='row login-box'>
            <div>
              <div className='card border-0 mb-0'>
                {/* <div className='card-header bg-transparent pb-3'>
                  <h5 className='card-title'>{t`lanSPTitleForgotPaswordOtp`}</h5>
                </div> */}
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='bg-img'>
                      <h3>{t`lanSPTitleWelcome`} <br /><span style={{ fontSize:30, fontWeight:500 }}>{t`lanSPTitleAmToPm`}</span></h3>
                      <p>{t`lanSPTitleTo`}</p>
                      <a className='btn-outline' onClick={this.handleSignIn}>{t`lanSPButtonSignin`}</a>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='login-inner-form'>
                      <div className='details'>
                        <div className='text-center'><h3>{t`lanSPLabelEnterForgotOtp`}</h3></div>
                        <form role='form'>
                          <div>
                            {/* <div className='text-center mb-3'>
                              <div className='h4 font-weight-300'>{t`lanSPLabelEnterForgotOtp`}</div>
                            </div> */}
                            <div className='form-row'>
                              <div className='col-md-3 col-3'>
                                <input type='text' autoFocus className='form-control text-center' ref='otpNumber01' maxLength={1} onChange={
                                  event => {
                                    this.setState({ otpNumber01: event.target.value, errorMessage: '' })
                                    if (event.target.value && event.target.value.length === 1) {
                                      this.refs.otpNumber02.focus()
                                    }
                                  }} />
                              </div>
                              <div className='col-md-3 col-3'>
                                <input type='text' className='form-control text-center' ref='otpNumber02' maxLength={1} onChange={
                                  event => {
                                    this.setState({ otpNumber02: event.target.value, errorMessage: '' })
                                    if (event.target.value && event.target.value.length === 1) {
                                      this.refs.otpNumber03.focus()
                                    }
                                  }} />
                              </div>
                              <div className='col-md-3 col-3'>
                                <input type='text' className='form-control text-center' ref='otpNumber03' maxLength={1} onChange={
                                  event => {
                                    this.setState({ otpNumber03: event.target.value, errorMessage: '' })
                                    if (event.target.value && event.target.value.length === 1) {
                                      this.refs.otpNumber04.focus()
                                    }
                                  }} />
                              </div>
                              <div className='col-md-3 col-3'>
                                <input type='text' className='form-control text-center' ref='otpNumber04' maxLength={1} onChange={
                                  event => {
                                    this.setState({ otpNumber04: event.target.value, errorMessage: '' })
                                    if (event.target.value && event.target.value.length === 1) {
                                      this.refs.otpNumberSubmit.focus()
                                    }
                                  }} />
                              </div>
                            </div>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.errorMessage}</small> </p>
                          </div>
                          <div>
                            <div className='text-center mt-4'>
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SPForgotPasswordOtpComponent
