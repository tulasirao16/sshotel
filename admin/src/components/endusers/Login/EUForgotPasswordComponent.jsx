/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import './Css/EULogin.css'
import { t } from 'ttag'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import EUForgotPasswordOtpComponent from './EUForgotPasswordOtpComponent'
import { hashHistory } from 'react-router'

class EUForgotPasswordComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      userId: '',
      errorMessage: '',
      isShowForgotPassword: true,
      isShowForgotPasswordOtp: false
    }
    this.handleSendOTP = this.handleSendOTP.bind(this)
  }
  componentWillMount () {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userRole === 'Customer') {
      hashHistory.push('/hotels')
    } else if (authObj && authObj.userType) {
      this.setState({ errorMessage: t`lanEULabelErrorLoggedInHost` })
    }
  }
  handleSendOTP (event) {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userRole === 'Customer') {
      this.setState({ errorMessage: t`lanEULabelErrorLoggedInEndUser` })
    } else if (!this.state.userId.trim()) {
      this.setState({ errorMessage: t`lanEULabelErrorEmailRequired` })
    } else {
      let postObj = {
        url: config.baseUrl + config.postEUForgotPasswordOtpSendAPI,
        body: {
          email: this.state.userId
        }
      }
      let _this = this
      APICallManager.postCall(postObj, function (resObj) {
        try {
          if (resObj.data.statusCode === '1254') {
            localStorage.setItem('forgotPasswordObj', JSON.stringify(resObj.data.statusResult))
            _this.setState({
              isShowForgotPassword: false,
              isShowForgotPasswordOtp: !_this.state.isShowForgotPasswordOtp
            })
          } else if (resObj.data.statusCode === '9788') {
            _this.setState({ errorMessage: t`lanEULabelErrorRegisterWithMobileOrEmail` })
          } else {
            _this.setState({ errorMessage: t`lanEULabelErrorOTPSentFailed` })
          }
        } catch (e) {
          console.log('=====ERROR:', e)
        }
      })
    }
  }
  render () {
    return (
      <div style={{ fontFamily: 'Lato' }}>
        <div className='header py-8 py-lg-7 pt-lg-9 home-header'>
          <div className='separator separator-bottom separator-skew zindex-100'>
            <svg x='0' y='0' viewBox='0 0 2560 100' preserveAspectRatio='none' version='1.1' xmlns='http://www.w3.org/2000/svg'>
              <polygon className='fill-default' points='2560 0 2560 100 0 100' />
            </svg>
          </div>
        </div>
        {this.state.isShowForgotPassword
        ? <div className='container pb-5 eu-content'>
          <div className='row justify-content-center'>
            <div className='col-lg-5 col-md-7 text-center'>
              <div className='card border-0 mb-0'>
                <div className='card-header bg-transparent pb-3'>
                  <h5 className='card-title' style={{ fontSize: 19 }}>{t`lanEUTitleForgotPasword`}</h5>
                </div>
                <div className='card-body px-lg-5 py-lg-2'>
                  <div className='row mt-1'>
                    <div className='col-lg-12 colsm-12 col-xs-12 mt-4 mb-4'>
                      <div className='compare-img'>
                        <img src={require('../../../../assets/wait.png')} className='img-fluid img-rounded' style={{ width: '60px' }} />
                      </div>
                    </div>
                    <div className='col-md-12 text-left'>
                      <div className='px-lg-3 '>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanEULabelEmailOrMobile`}<span className='mandatory'>*</span></label>
                          <input autoFocus type='text' className='form-control eu-font' id='email-phone' maxLength={80}
                            value={this.state.userId} onChange={() => this.setState({ userId: event.target.value, errorMessage:'' })}
                            style={this.state.errorMessage ? { borderColor: 'red', borderWidth:1 } : { }} />
                          <span className='input-error-icon' ><i className='ni ni-fat-remove' style={this.state.errorMessage ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className='text-muted' ><small style={{ color: 'red' }}>{this.state.errorMessage}</small> </p>
                  <div className='row'>
                    <div className='col-md-12 text-center'>
                      <div className=' mb-4'>
                        <button type='button' onClick={this.handleSendOTP} className='btn btn-primary'>{t`lanEUButtonSendOtp`}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        : this.state.isShowForgotPasswordOtp ? <EUForgotPasswordOtpComponent />
       : null}
      </div>
    )
  }
}

export default EUForgotPasswordComponent
