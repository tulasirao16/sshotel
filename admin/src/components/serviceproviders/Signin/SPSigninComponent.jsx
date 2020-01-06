/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import './Css/UserLogin.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class SPSigninComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      userid: '',
      useridErrorMessage: '',
      password: '',
      passwordErrorMessage: '',
      errorMessage: '',
      showPassword: false
    }
    this.handleSubmitLogin = this.handleSubmitLogin.bind(this)
    this.handleForgotPassword = this.handleForgotPassword.bind(this)
    this.handleSPSignup = this.handleSPSignup.bind(this)
  }
  componentWillMount () {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userRole === 'Customer') {
      this.setState({ errorMessage: t`lanSPLabelErrorLoggedInEndUser` })
    } else if (authObj && authObj.userType) {
      hashHistory.push('/host/home')
    }
  }
  componentDidMount () {
    // this._isMounted = true
    // window.onpopstate = () => {
    //   if (this._isMounted) {
    //     const { hash } = location
    //     if (hash === '#/host/signin') {
    //       localStorage.clear()
    //     } else {
    //       // let authObj = JSON.parse(localStorage.getItem('authObj'))
    //       let token = localStorage.getItem('token')
    //       if (!token) {
    //         hashHistory.push('/host/signin')
    //       }
    //     }
    //   }
    // }
  }

  handleSubmitLogin () {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userRole === 'Customer') {
      this.setState({ errorMessage: t`lanSPLabelErrorLoggedInEndUser` })
    } else if (!this.state.userid.trim()) {
      this.setState({ useridErrorMessage: t`lanSPLabelErrorUserIDRequired` })
    } else if (!this.state.password) {
      this.setState({ passwordErrorMessage: t`lanSPLabelErrorPasswordRequired` })
    } else {
      let _this = this
      let userData = {
        userID: this.state.userid.trim(),
        password: this.state.password,
        appType: config.appType
      }
      let obj = { url: config.baseUrl + config.postSPUserSigninAPI, body: userData }
      APICallManager.postCall(obj, function (resObj) {
        try {
          if (resObj.data.statusCode === '1000') {
            localStorage.setItem('authObj', JSON.stringify(resObj.data.statusResult))
            hashHistory.push('/host/home')
          } else {
            _this.setState({ errorMessage: t`lanSPLabelErrorInvalidSignin` })
          }
        } catch (e) {
          console.log('=====SP Signin ERROR:', e)
        }
      })
    }
    event.preventDefault()
  }
  handleForgotPassword () {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userRole === 'Customer') {
      this.setState({ errorMessage: t`lanSPLabelErrorLoggedInEndUser` })
    } else {
      hashHistory.push('/host/signin/forgotpasssword')
      event.preventDefault()
    }
  }
  handleSPSignup (event) {
    hashHistory.push('/host')
    event.preventDefault()
  }

  render () {
    return (
      <div>
        {/* <div className='header home-header'>
          <div className='separator separator-bottom separator-skew zindex-100'>
            <svg x='0' y='0' viewBox='0 0 2560 100' preserveAspectRatio='none' version='1.1' xmlns='http://www.w3.org/2000/svg'>
              <polygon className='fill-default' points='2560 0 2560 100 0 100' />
            </svg>
          </div>
        </div> */}
        <div className='container'>
          <div className='row login-box'>
            <div className='card border-0 mb-0'>
              {/* <div className='card-header'>
                <h5 className='card-title'>{t`lanSPTitleSignin`}</h5>
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
                      <div className='text-center'><h3>{t`lanSPTitleSignin`}</h3></div>
                      <div className='form-group'>
                        <label className='form-control-label'>{t`lanSPLabelUserID`} <span className='mandatory'>*</span></label>
                        <input autoFocus type='text' className='input-text' id='userid' value={this.state.userid}
                          onChange={(e) => this.setState({ userid: e.target.value, useridErrorMessage: '', errorMessage: '' })} maxLength={60} />
                        <span className='input-error-icon' ><i className='ni ni-fat-remove' style={this.state.useridErrorMessage ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                        <p className='text-muted'><small style={{ color: 'red', position:'absolute' }}>{this.state.useridErrorMessage}</small> </p>
                      </div>
                      <div className='form-group'>
                        <label className='form-control-label'>{t`lanSPLabelPassword`} <span className='mandatory'>*</span></label>
                        <input className='input-text' type={this.state.showPassword ? 'text' : 'password'} id='password' value={this.state.password} maxLength={20}
                          onChange={() => this.setState({ password: event.target.value, passwordErrorMessage: '', errorMessage: '' })} />
                        <a onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                          <span style={{ position:'absolute', right:30, bottom: 10 }}>
                            <i className={this.state.showPassword ? 'far fa-eye' : 'far fa-eye-slash'} />
                          </span>
                        </a>
                        {/* <input type='password' className='input-text' id='password' value={this.state.password}
                          onChange={(e) => this.setState({ password: e.target.value, passwordErrorMessage: '', errorMessage: '' })} maxLength={20} /> */}
                        <span className='input-error-icon' ><i className='ni ni-fat-remove' style={this.state.passwordErrorMessage ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                        <p className='text-muted'><small style={{ color: 'red', position:'absolute' }}>{this.state.passwordErrorMessage}</small> </p>
                      </div>
                      <div className='checkbox clearfix'>
                        <a onClick={this.handleForgotPassword} className='text-underline forget-pawd'><u>{t`lanCommonButtonForgotPassword`}</u></a>
                      </div>
                      <p className='text-muted'><small style={{ color: 'red', position:'absolute', bottom:35 }}>{this.state.errorMessage}</small> </p>
                      <div className='form-group text-center'>
                        <button type='button' onClick={this.handleSubmitLogin} className='btn-md btn-theme'>{t`lanSPButtonSignin`}</button>
                      </div>
                      {/* <div className='mt-2'>
                        <span><small>{t`lanSPLabelDontHaveAccount`} </small> <a onClick={this.handleSPSignup} className='text-underline'> {t`lanSPButtonSignup`}</a></span>
                      </div> */}
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

export default SPSigninComponent
