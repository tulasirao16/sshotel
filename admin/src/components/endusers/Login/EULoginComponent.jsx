/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import './Css/EULogin.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class EULoginComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      userid: '',
      password: '',
      showPassword: '',
      errorMessage: '',
      authObj: JSON.parse(localStorage.getItem('authObj'))
    }
    this.handleEnduserSignup = this.handleEnduserSignup.bind(this)
    this.handleSubmitLogin = this.handleSubmitLogin.bind(this)
    this.handleForgotPassword = this.handleForgotPassword.bind(this)
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this)
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this)
  }
  componentWillMount () {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userRole === 'Customer') {
      hashHistory.push('/hotels')
    } else if (authObj && authObj.userType) {
      this.setState({ errorMessage: t`lanEULabelErrorLoggedInHost` })
    }
  }
  handleEnduserSignup () {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userType) {
      this.setState({ errorMessage: t`lanEULabelErrorLoggedInHost` })
    } else {
      hashHistory.push('/signup')
      event.preventDefault()
    }
  }
  handleSubmitLogin () {
    let EUPropertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
    let navigateTo = localStorage.getItem('navigateTo')
    if (this.state.authObj && this.state.authObj.name) {
      this.setState({ errorMessage: t`lanEULabelErrorAlreadyLogged` + ' ' + this.state.authObj.name })
    } else if (!this.state.userid) {
      this.setState({ useridErrorMessage: t`lanEULabelErrorUserIDRequired` })
    } else if (!this.state.password) {
      this.setState({ passwordErrorMessage: t`lanEULabelErrorPasswordRequired` })
    } else {
      let _this = this
      let loginObj = {
        userID: this.state.userid,
        password: this.state.password,
        appType: config.appType
      }
      let obj = { url: config.baseUrl + config.postEUUserLoginAPI, body: loginObj }
      APICallManager.postCall(obj, function (resObj) {
        try {
          if (resObj.data.statusCode === '1000') {
            localStorage.setItem('authObj', JSON.stringify(resObj.data.statusResult))
            if (!EUPropertyInfoData || !EUPropertyInfoData._id) {
              hashHistory.push('/hotels')
            } else {
              let postBooking = localStorage.getItem('postBooking')
              let propertyDocs = localStorage.getItem('propertyDocs')
              if (postBooking && propertyDocs) {
                hashHistory.push('/hotels/booknow/confirm')
              } else {
                hashHistory.push('hotels/booknow')
              }
            }
          } else {
            _this.setState({ errorMessage: t`lanEULabelErrorInvalidLogin` })
          }
        } catch (e) {
          console.log('=====EU Login ERROR:', e)
        }
      })
    }
    event.preventDefault()
  }
  handleForgotPassword () {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userType) {
      this.setState({ errorMessage: t`lanEULabelErrorLoggedInHost` })
    } else {
      hashHistory.push('/login/forgotpassword')
      event.preventDefault()
    }
  }

  handleGoogleLogin () {
    window.location.href = config.baseUrl + config.getEUUserSocialGoogleLoginAPI
  }

  handleFacebookLogin () {
    window.location.href = config.baseUrl + config.getEUUserSocialFacebookLoginAPI
  }

  render () {
    return (
      <div>
        <div className='container pb-5 eu-content'>
          <div className='row justify-content-center'>
            <div className='col-lg-10 col-md-7 text-center'>
              <div className='card login-card border-0 mb-0'>
                <div className='row '>
                  <div className='col-lg-7'>
                    <div className='login-overlay'>
                     {/* <div className='text-muted text-center'><p>Login with Social media</p></div> */}
                    </div>
                  </div>
                  <div className='col-lg-5'>
                    <div className='card card-login-form mb-0'>
                      <div className='card-header bg-transparent pb-3'>
                        <h5 className='card-title' style={{ fontSize: 19 }}>{ t`lanEUTitleLogin` }</h5>
                      </div>
                      <div className='card-body px-lg-5 py-lg-2'>
                        {/* <div className='text-muted text-center'><p>Login with Social media</p></div> */}
                        <div className='row my-2'>
                          <div className='col-sm-6'>
                            <div className='btn-wrapper text-center mb-2'>
                              <button type='button' onClick={this.handleFacebookLogin} className='btn btn-block btn-outline-primary btn-icon'>
                                <span className='btn-inner--icon'><i className='fab fa-facebook' /></span>
                                <span className='btn-inner--text'>{ t`lanEUButtonFacebook` }</span>
                              </button>
                            </div>
                          </div>
                          <div className='col-sm-6'>
                            <div className='btn-wrapper text-center mb-2'>
                              <button type='button' onClick={this.handleGoogleLogin} className='btn btn-block btn-outline-danger btn-icon'>
                                <span className='btn-inner--icon'><i className='fab fa-google-plus-g' /></span>
                                <span className='btn-inner--text'>{ t`lanEUButtonGoogle` }</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className='row mt-1'>
                          <div className='col-md-12 text-left'>
                            <div className='form-group'>
                              <label className='form-control-label'>{ t`lanEULabelUserID` } <span className='mandatory'>*</span></label>
                              <input autoFocus type='text' className='form-control' id='userid' placeholder={t`lanEULabelEnterUserID`} value={this.state.userid}
                                onChange={() => this.setState({ userid: event.target.value, useridErrorMessage: '', errorMessage: '' })} maxLength={80} />
                              <span className='input-error-icon' ><i className='ni ni-fat-remove' style={this.state.useridErrorMessage ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                              <p className='text-muted'><small style={{ color: 'red' }}>{this.state.useridErrorMessage}</small> </p>
                            </div>
                          </div>
                          <div className='col-md-12 text-left'>
                            <div className='form-group' style={{ marginBottom: '0.3rem' }}>
                              <label className='form-control-label'>{ t`lanEULabelPassword` } <span className='mandatory'>*</span></label>
                              <input className='form-control' type={this.state.showPassword ? 'text' : 'password'} id='password' placeholder={t`lanEULabelEnterPassword`} value={this.state.password} maxLength={20}
                                onChange={() => this.setState({ password: event.target.value, passwordErrorMessage: '', errorMessage: '' })} />
                              <a onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                                <span className='pswdShowIconView' >
                                  <i className={this.state.showPassword ? 'far fa-eye' : 'far fa-eye-slash'} />
                                </span>
                              </a>
                              {/* <input type='password' className='form-control' id='password' placeholder={t`lanEULabelEnterPassword`} value={this.state.password}
                                onChange={() => this.setState({ password: event.target.value, passwordErrorMessage: '', errorMessage: '' })} maxLength={20} /> */}
                              <span className='input-error-icon' ><i className='ni ni-fat-remove' style={this.state.passwordErrorMessage ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                              <p className='text-muted'><small style={{ color: 'red' }}>{this.state.passwordErrorMessage}</small> </p>
                            </div>
                          </div>
                        </div>
                        <div className='row my-2'>
                          <div className='col-md-6 text-left mb-2'>
                            <a onClick={this.handleForgotPassword} className='text-underline forget-pawd'><u>{ t`lanEUButtonForgotPassword` }</u></a>
                          </div>
                          <div className='col-md-6 text-right mb-2'>
                            <button type='button' onClick={this.handleSubmitLogin} className='btn btn-primary'>{ t`lanEUButtonLogin` }</button>
                          </div>
                        </div>
                        <div className='row my-2'>
                          <div className='col-md-12 text-right mb-2'>
                            <span className='text-muted'><small>{ t`lanEULabelDontHaveAccount` } {' '} </small> <a style={{ color: '#01a4a2' }} onClick={this.handleEnduserSignup} className='text-underline'> { t`lanEUButtonSignup` }</a></span>
                          </div>
                        </div>
                        <div className='row my-2'>
                          <div className='col-md-12 text-center mb-2 ' style={{ height:30 }}>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.errorMessage}</small> </p>
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
      </div>
    )
  }
}

export default EULoginComponent
