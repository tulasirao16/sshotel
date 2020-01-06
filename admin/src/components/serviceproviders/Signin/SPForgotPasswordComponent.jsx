/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import './Css/UserLogin.css'
import { t } from 'ttag'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class SPForgotPasswordComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      userId: '',
      errorMessage: ''
    }
    this.handleSendOTP = this.handleSendOTP.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    this.handleSPSignup = this.handleSPSignup.bind(this)
  }
  componentWillMount () {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userRole === 'Customer') {
      this.setState({ errorMessage: t`lanSPLabelErrorLoggedInEndUser` })
    }
  }
  handleSignIn () {
    hashHistory.push('/host/signin')
  }

  handleSPSignup (event) {
    hashHistory.push('/host')
    event.preventDefault()
  }

  handleSendOTP (event) {
    if (!this.state.userId.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorMobileOrEmailRequired` })
    } else {
      let postObj = {
        url: config.baseUrl + config.postSPForgotPasswordOtpSendAPI,
        body: {
          userId: this.state.userId
        }
      }
      let _this = this
      const authObj = JSON.parse(localStorage.getItem('authObj'))
      APICallManager.postCall(postObj, function (resObj) {
        try {
          if (resObj.data.statusCode === '1001') {
            localStorage.setItem('forgotPasswordObj', JSON.stringify(resObj.data.statusResult))
            if (authObj && authObj.userRole) {
              _this.setState({ errorMessage: t`lanSPLabelErrorLoggedInEndUser` })
            } else {
              hashHistory.push('/host/signin/forgotpasssword/otp')
            }
          } else if (resObj.data.statusCode === '9986') {
            _this.setState({ errorMessage: t`lanSPLabelErrorRegisterWithMobileOrEmail` })
          } else {
            _this.setState({ errorMessage: t`lanSPLabelErrorOtpSentFailed` })
          }
        } catch (e) {
          console.log('=====ERROR:', e)
        }
      })
    }
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
                  <h5 className='card-title' style={{ fontSize: 19 }}>{t`lanSPTitleForgotPasword`}</h5>
                </div> */}
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='bg-img'>
                      <h3>{t`lanSPTitleWelcome`} <br /><span style={{ fontSize:30, fontWeight:500 }}>{t`lanSPTitleAmToPm`}</span></h3>
                      <p>{t`lanSPTitleTo`}</p>
                      <a className='btn-outline' onClick={this.handleSPSignup}>{t`lanSPButtonSignup`}</a>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='login-inner-form'>
                      <div className='details'>
                        <div className='text-center'><h3>{t`lanSPTitleForgotPasword`}</h3></div>
                        {/* <div className='col-lg-12 colsm-12 col-xs-12 mt-4 mb-4'>
                          <div className='compare-img'>
                            <img src={require('../../../../assets/wait.png')} className='img-fluid img-rounded' style={{ width: '60px' }} />
                          </div>
                        </div> */}
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanSPLabelEmailOrMobile`}<span className='mandatory'>*</span></label>
                          <input autoFocus type='text' className='input-text' id='email-phone' maxLength={80}
                            value={this.state.userId} onChange={() => this.setState({ userId: event.target.value, errorMessage:'' })} />
                          <span className='input-error-icon' ><i className='ni ni-fat-remove' style={this.state.errorMessage ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                        </div>
                        <p style={{ color: 'red', lineHeight:1.2, textAlign:'center' }}><small>{this.state.errorMessage}</small> </p>
                        <div className='mb-4 text-center'>
                          <button type='button' onClick={this.handleSendOTP} className='btn-md btn-theme'>{t`lanSPButtonSendOtp`}</button>
                        </div>
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

export default SPForgotPasswordComponent
