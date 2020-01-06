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

class SPResetPasswordComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      newPassword: '',
      showPassword: false,
      errorMessage: ''
    }
    this.handleResetPasswordDone = this.handleResetPasswordDone.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  handleSignIn () {
    hashHistory.push('/host/signin')
  }

  componentWillMount () {
    localStorage.removeItem('forgotPasswordObj')
  }

  handleResetPasswordDone (event) {
    if (!this.state.newPassword) {
      this.setState({ errorMessage: t`lanSPLabelEnterNewPassword` })
    } else if (this.state.newPassword.length < 6) {
      this.setState({ errorMessage: t`lanSPLabelErrorPasswordMinLength` })
    } else {
      let putObj = {
        url: config.baseUrl + config.putSPForgotPasswordResetPasswordAPI,
        body: {
          newPassword: this.state.newPassword
        }
      }
      let _this = this
      APICallManager.putCall(putObj, function (resObj) {
        try {
          if (resObj.data.statusCode === '1012') {
            localStorage.clear()
            hashHistory.push('/host/signin')
          } else {
            _this.setState({ errorMessage: t`lanSPLabelErrorPasswordUpdateFailed` })
          }
        } catch (error) {
          console.log('=====Reset ERROR:', error)
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
                  <h5 className='card-title'>{t`lanSPTitleResetPasword`}</h5>
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
                        <div className='text-center'><h3>{t`lanSPTitleResetPasword`}</h3></div>
                        <form role='form'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanSPLabelEnterNewPassword`}<span className='mandatory'>*</span></label>
                            <input autoFocus type={this.state.showPassword ? 'text' : 'password'} className='input-text'
                              value={this.state.newPassword} onChange={(e) => this.setState({ newPassword: e.target.value, errorMessage: '' })} maxLength={20} />
                            <span className='input-error-icon' ><i className='ni ni-fat-remove' style={this.state.errorMessage ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <a onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                              <span style={{ position:'absolute', right:10, bottom: 10 }}>
                                <i className={this.state.showPassword ? 'far fa-eye' : 'far fa-eye-slash'} />
                              </span>
                            </a>
                          </div>
                          <p className='text-muted text-center'><small style={{ color: 'red' }}>{this.state.errorMessage}</small> </p>
                          <div className='text-center'>
                            <button type='button' className='btn btn-primary mt-2' onClick={this.handleResetPasswordDone}>{t`lanCommonButtonDone`}</button>
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

export default SPResetPasswordComponent
