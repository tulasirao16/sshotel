/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import { t } from 'ttag'

import SPSignupOtpComponent from './SPSignupOtpComponent'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import './css/signup.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

const phRegex = /^\d{10}$/
const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/

class SPSignupComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      signupScreen: true,
      businessName: '',
      mobileNumber: '',
      verifiedMobileNumber: 'null',
      mobileNumVerifyStatus: 'Verify',
      email: '',
      verifiedEmail: 'null',
      emailVerifyStatus: 'Verify',
      contactPerson: '',
      password: '',
      otpType: '',
      otpValue: '',
      otpNumber: '',
      otpNumber01: '',
      otpNumber02: '',
      otpNumber03: '',
      otpNumber04: '',
      area: '',
      city: '',
      zip: '',
      areaLocality: '',
      landmark: '',
      state: '',
      address: '',
      errorMessage: '',
      errorNextMessage: '',
      popupErrorMsg: '',
      popupSuccessMsg: '',
      latitude: '',
      longitude: '',
      houseNumber: '',
      lineName: '',
      street: '',
      showPassword: false
    }
    this.handleSignupNext = this.handleSignupNext.bind(this)
    this.handleVerifyMobile = this.handleVerifyMobile.bind(this)
    this.handleVerifyEmail = this.handleVerifyEmail.bind(this)
    this.handleValidateOtp = this.handleValidateOtp.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleSignupSubmit = this.handleSignupSubmit.bind(this)
    this.handleCurrentLocation = this.handleCurrentLocation.bind(this)
  }
  componentWillMount () {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userRole === 'Customer') {
      this.setState({ errorMessage: t`lanSPLabelErrorLoggedInEndUser` })
    } else if (authObj && authObj.userType) {
      hashHistory.push('/host/home')
    }
  }
  handleSignupNext () {
    let stateObj = this.state
    if (!stateObj.businessName.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorBusinessNameRequired` })
    } else if (stateObj.businessName.trim().length < 3) {
      this.setState({ errorMessage: t`lanSPLabelErrorBusinessNameMinLength` })
    } else if (!stateObj.contactPerson.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorContactPersonRequired` })
    } else if (!stateObj.password) {
      this.setState({ errorMessage: t`lanSPLabelErrorPasswordRequired` })
    } else if (stateObj.password.length < 6) {
      this.setState({ errorMessage: t`lanSPLabelErrorPasswordMinLength` })
    } else if (!stateObj.mobileNumber.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired` })
    } else if (!stateObj.mobileNumber.trim().match(phRegex)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber` })
    } else if (!stateObj.email.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorEmailRequired` })
    } else if (!stateObj.email.trim().match(emailRegex)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else if (this.state.mobileNumVerifyStatus === 'Verify') {
      this.setState({ errorMessage: t`lanSPLabelErrorVerifyMobileNumber` })
    } else if (this.state.emailVerifyStatus === 'Verify') {
      this.setState({ errorMessage: t`lanSPLabelErrorVerifyEmail` })
    } else {
      this.setState({ signupScreen: false })
    }
    event.preventDefault()
  }
  handleSignupSubmit () {
    if (!this.state.area.trim()) {
      this.setState({ errorNextMessage: t`lanSPLabelErrorAreaRequired` })
    } else if (!this.state.city.trim()) {
      this.setState({ errorNextMessage: t`lanSPLabelErrorCityRequired` })
    } else if (!this.state.zip.trim()) {
      this.setState({ errorNextMessage: t`lanSPLabelErrorPinCodeRequired` })
    } else if (!this.state.state.trim()) {
      this.setState({ errorNextMessage: t`lanSPLabelErrorSateRequired` })
    } else if (!this.state.address.trim()) {
      this.setState({ errorNextMessage: t`lanSPLabelErrorAdressRequired` })
    } else {
      let _this = this
      let userData = {
        bussinessName: this.state.businessName,
        contactPerson: this.state.contactPerson,
        userID: this.state.mobileNumber,
        contactMobileNumber: this.state.mobileNumber,
        contactEmail: this.state.email,
        password: this.state.password,
        deviceToken: '',
        address: this.state.address,
        area: this.state.area,
        city: this.state.city,
        areaLocality: this.state.areaLocality,
        landmark: this.state.landmark,
        state: this.state.state,
        zip: this.state.zip
      }
      let obj = { url: config.baseUrl + config.postSPUserSignupAPI, body: userData }
      APICallManager.postCall(obj, function (resObj) {
        try {
          if (resObj.data.statusCode === '0000') {
            hashHistory.push('/host/signup/success')
          } else if (resObj.data.statusCode === '1003') {
            _this.setState({ errorNextMessage: t`lanSPLabelErrorHaveAccountWithEmailOrMobile` })
          } else if (resObj.data.statusCode === '9959') {
            _this.setState({ errorNextMessage: t`lanSPLabelErrorUserIDExist` })
          } else if (resObj.data.statusCode === '9955') {
            _this.setState({ errorNextMessage: t`lanSPLabelErrorSignupVerifyMobileAndEmail` })
          } else if (resObj.data.statusCode === '9956') {
            _this.setState({ errorNextMessage: t`lanSPLabelErrorMobileNumberExist` })
          } else if (resObj.data.statusCode === '9957') {
            _this.setState({ errorNextMessage: t`lanSPLabelErrorEmailExist` })
          } else {
            _this.setState({ errorNextMessage: t`lanSPLabelErrorRegistrationFailed` })
          }
        } catch (e) {
          console.log('=====SP SignupSubmit ERROR:', e)
        }
      })
    }
    event.preventDefault()
  }
  handleBack () {
    this.setState({ signupScreen: true })
    event.preventDefault()
  }

  handleSignIn () {
    hashHistory.push('/host/signin')
    event.preventDefault()
  }
  handleMobileNumKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
    event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
    (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }

  handleVerifyMobile () {
    if (this.state.mobileNumVerifyStatus === 'Verify') {
      if (!this.state.mobileNumber.trim()) {
        this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired`, otpValue: '' })
      } else if (!phRegex.test(this.state.mobileNumber)) {
        this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber`, otpValue: '' })
      } else {
        let _this = this
        let userData = {
          otpType: 'Mobile',
          mobileNumber: this.state.mobileNumber
        }
        let obj = { url: config.baseUrl + config.postSPUserSignupSendOtpAPI, body: userData }
        APICallManager.postCall(obj, function (resObj) {
          try {
            if (resObj.data.statusCode === '1001') {
              _this.setState({ otpValue: resObj.data.statusResult.otpNumber, otpType: 'Mobile' })
            } else if (resObj.data.statusCode === '9989') {
              _this.setState({ errorMessage: t`lanSPLabelErrorHaveAccountWithMobile`, verifiedMobileNumber: _this.state.mobileNumber, mobileNumVerifyStatus: 'Verified' })
            } else if (resObj.data.statusCode === '1009') {
              _this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberVerified`, verifiedMobileNumber: _this.state.mobileNumber, mobileNumVerifyStatus: 'Verified' })
            } else {
              _this.setState({ errorMessage: t`lanSPLabelErrorOtpSentFailed` })
            }
          } catch (e) {
            console.log('=====SP SignupMobileOTP ERROR:', e)
          }
        })
      }
    } else {
      this.setState({ otpValue: '' })
    }
  }

  handleVerifyEmail () {
    if (this.state.emailVerifyStatus === 'Verify') {
      if (!this.state.email.trim()) {
        this.setState({ errorMessage: t`lanSPLabelErrorEmailRequired`, otpValue: '' })
      } else if (!emailRegex.test(this.state.email)) {
        this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail`, otpValue: '' })
      } else {
        let _this = this
        let userData = {
          otpType: 'Email',
          email: this.state.email
        }
        let obj = { url: config.baseUrl + config.postSPUserSignupSendOtpAPI, body: userData }
        APICallManager.postCall(obj, function (resObj) {
          try {
            if (resObj.data.statusCode === '1001') {
              _this.setState({ otpValue: resObj.data.statusResult.otpNumber, otpType: 'Email' })
            } else if (resObj.data.statusCode === '9988') {
              _this.setState({ errorMessage: t`lanSPLabelErrorHaveAccountWithEmail`, verifiedEmail: _this.state.email, emailVerifyStatus: 'Verified' })
            } else if (resObj.data.statusCode === '1010') {
              _this.setState({ errorMessage: t`lanSPLabelErrorEmailVerified`, verifiedEmail: _this.state.email, emailVerifyStatus: 'Verified' })
            } else {
              _this.setState({ errorMessage: t`lanSPLabelErrorOtpSentFailed` })
            }
          } catch (e) {
            console.log('=====SP SignupEmailOTP ERROR:', e)
          }
        })
      }
    } else {
      this.setState({ otpValue: '' })
    }
  }

  handleValidateOtp (verifyStatus) {
    if (this.state.otpType === 'Mobile') {
      this.setState({ mobileNumVerifyStatus: verifyStatus, verifiedMobileNumber: this.state.mobileNumber, otpValue: '' })
    } else {
      this.setState({ emailVerifyStatus: verifyStatus, verifiedEmail: this.state.email, otpValue: '' })
    }
  }

  handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        })
        let _this = this
        this.getLocation(position.coords.latitude, position.coords.longitude, function (data) {
          if (data.statusCode === '0000') {
            data.result.forEach(value => {
              if (value.types.indexOf('premise') !== -1) {
                _this.setState({ houseNumber: value.long_name })
              }
              if (value.types.indexOf('sublocality_level_3') !== -1) {
                _this.setState({ lineName: value.long_name })
              }
              if (value.types.indexOf('sublocality_level_2') !== -1) {
                _this.setState({ street: value.long_name })
              }
              if (value.types.indexOf('sublocality_level_1') !== -1) {
                _this.setState({ area: value.long_name })
              }
              if (value.types.indexOf('administrative_area_level_2') !== -1) {
                _this.setState({ city: value.long_name })
              }
              if (value.types.indexOf('postal_code') !== -1) {
                _this.setState({ zip: value.long_name })
              }
              if (value.types.indexOf('locality') !== -1) {
                _this.setState({ areaLocality: value.long_name })
              }
              if (value.types.indexOf('administrative_area_level_1') !== -1) {
                _this.setState({ state: value.long_name })
              }
              if (value.types.indexOf('sublocality') !== -1) {
                _this.setState({ address: _this.state.houseNumber + ', ' + _this.state.lineName + ', ' + _this.state.street + ', ' + value.long_name })
              }
            })
          } else {
            alert('Not Getting Location.Please Enter Manually')
          }
        })
      },
      (error) => this.setState({ errorMessage: error.message }),
      { enableHighAccuracy: true, timeout: 1000, maximumAge: 1000 },
    )
  }

  getLocation (lat, long, callback) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + config.googleMapsAPIKey)
      .then((response) => response.json())
      .then((responseJson) => {
        callback({ statusCode: '0000', result: responseJson.results[0].address_components })
      }).catch((error) => {
        console.log('=== Create Location ERROR:', error)
        callback({ statusCode: '9999', result: {} })
      })
  }

  render () {
    return (
      <div>
        {this.state.signupScreen
        ? <div className='container'>
          <div className='row signup-box'>
            <div>
              <div className='card border-0 mb-0'>
                {/* <div className='card-header bg-transparent'>
                  <h5 className='card-title'>{t`lanSPTitleSignup`}</h5>
                </div> */}
                <div className='row'>
                  <div className='col-md-5'>
                    <div className='bg-img'>
                      <h3>{t`lanSPTitleWelcome`} <br /><span style={{ fontSize:30, fontWeight:500 }}>{t`lanSPTitleAmToPm`}</span></h3>
                      <p>{t`lanSPTitleTo`}</p>
                      <a className='btn-outline' onClick={this.handleSignIn}>{t`lanSPButtonSignin`}</a>
                    </div>
                  </div>
                  <div className='col-md-7'>
                    <form role='form'>
                      <div className='login-inner-form'>
                        <div className='details'>
                          <div className='text-center'><h3>{t`lanSPTitleSignup`}</h3></div>
                          {/* <div className='row justify-content-center'>
                            <div className='col-lg-3 mb-4'>
                              <div className='card-profile-upload'>
                                <i className='fas fa-camera cam-icon' />
                              </div>
                            </div>
                          </div> */}
                          <div className='row'>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelBusinessName`}</label>
                                <input type='text' autoFocus className='input-text' minLength={3} maxLength={80}
                                  value={this.state.businessName} onChange={() => this.setState({ businessName: event.target.value, errorMessage: '' })} />
                              </div>
                            </div>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelContactPerson`}</label>
                                <input type='text' className='input-text' maxLength={40}
                                  value={this.state.contactPerson} onChange={() => this.setState({ contactPerson: event.target.value, errorMessage: '' })} />
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelPassword`}</label>
                                <input className='input-text' type={this.state.showPassword ? 'text' : 'password'} value={this.state.password} minLength={6} maxLength={20}
                                  onChange={() => this.setState({ password: event.target.value, errorMessage: '' })} />
                                <a onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                                  <span style={{ position:'absolute', right:10, bottom: 10 }}>
                                    <i className={this.state.showPassword ? 'far fa-eye' : 'far fa-eye-slash'} />
                                  </span>
                                </a>
                                {/* <input className='input-text' type='password' minLength={6} maxLength={20}
                                  value={this.state.password} onChange={() => this.setState({ password: event.target.value, errorMessage: '' })} /> */}
                              </div>
                            </div>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelMobileNumber`}</label>
                                <input type='tel' className='input-text tel-input' maxLength={10} value={this.state.mobileNumber} onKeyPress={this.handleMobileNumKeys}
                                  onChange={() => this.setState({ mobileNumber: event.target.value,
                                    mobileNumVerifyStatus: event.target.value === this.state.verifiedMobileNumber ? 'Verified' : 'Verify',
                                    errorMessage: '' })} />
                                <a onClick={this.handleVerifyMobile} className='verify' data-toggle='modal'
                                  data-target={this.state.mobileNumVerifyStatus === 'Verify' && this.state.mobileNumber.length === 10 ? '#modal-verifyPhone' : ''}>
                                  <small>{this.state.mobileNumVerifyStatus}</small></a>
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelEmail`}</label>
                                <input type='email' className='input-text mail-input' maxLength={80} value={this.state.email}
                                  onChange={() => this.setState({ email: event.target.value, emailVerifyStatus: event.target.value === this.state.verifiedEmail ? 'Verified' : 'Verify', errorMessage: '' })} />
                                <a onClick={this.handleVerifyEmail} className='verify' data-toggle='modal'
                                  data-target={this.state.emailVerifyStatus === 'Verify' && this.state.email.trim() !== '' && emailRegex.test(this.state.email) ? '#modal-verifyEamil' : ''}>
                                  <small>{this.state.emailVerifyStatus}</small></a>
                              </div>
                            </div>
                          </div>
                          <label className='text-danger text-center'>{this.state.errorMessage}</label>
                          <div className='form-group text-center'>
                            <button type='button' onClick={this.handleSignupNext} className='btn-md btn-theme mt-2'>{t`lanSPButtonNext`}</button>
                            {/* <div className='pt-3'><small>{t`lanSPLabelAlreadyHaveAccount`} </small> <a onClick={this.handleSignIn} className='text-underline' > {t`lanSPButtonSignin`}</a></div> */}
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
        : <div className='container'>
          <div className='row signup-box signup-location'>
            <div>
              <div className='card border-0 mb-0'>
                {/* <div className='card-header bg-transparent pb-3'>
                  <h5 className='card-title'>{t`lanSPTitleSignupLocation`}</h5>
                </div> */}
                <div className='row'>
                  <div className='col-md-5'>
                    <div className='bg-img'>
                      <h3>{t`lanSPTitleWelcome`} <br /><span style={{ fontSize:30, fontWeight:500 }}>{t`lanSPTitleAmToPm`}</span></h3>
                      <p>{t`lanSPTitleTo`}</p>
                      <a className='btn-outline' onClick={this.handleSignIn}>{t`lanSPButtonSignin`}</a>
                    </div>
                  </div>
                  <div className='col-md-7'>
                    <form role='form'>
                      <div className='login-inner-form'>
                        <div className='details'>
                          <div className='text-center'><h3>{t`lanSPTitleSignupLocation`}</h3></div>
                          <div className='col-md-12 text-right'>
                            <a onClick={this.handleCurrentLocation} title='get current location' className='btn btn-success text-white current-location'><i className='fas fa-map-marker-alt' /> </a>
                          </div>
                          <div className='row'>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelArea`}<span className='madatory'>*</span></label>
                                <input type='text' autoFocus className='input-text' maxLength={30}
                                  value={this.state.area} onChange={(e) => this.setState({ area: e.target.value, errorNextMessage: '' })} />
                              </div>
                            </div>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelCity`}<span className='madatory'>*</span></label>
                                <input type='text' className='input-text' maxLength={30}
                                  value={this.state.city} onChange={(e) => this.setState({ city: e.target.value, errorNextMessage: '' })} />
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelZip`}<span className='madatory'>*</span></label>
                                <input type='text' className='input-text' maxLength={6}
                                  value={this.state.zip} onChange={(e) => this.setState({ zip: e.target.value, errorNextMessage: '' })} />
                              </div>
                            </div>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelAreaLocality`}</label>
                                <input type='text' className='input-text' maxLength={30}
                                  value={this.state.areaLocality} onChange={(e) => this.setState({ areaLocality: e.target.value, errorNextMessage: '' })} />
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelLandmark`}</label>
                                <input type='text' className='input-text' maxLength={40}
                                  value={this.state.landmark} onChange={(e) => this.setState({ landmark: e.target.value, errorNextMessage: '' })} />
                              </div>
                            </div>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelState`}<span className='madatory'>*</span></label>
                                <select className='input-text' value={this.state.state} onChange={(e) => this.setState({ state: e.target.value, errorNextMessage: '' })} >
                                  <option value=''>{ t`lanCommonLabelSelectState` }</option>
                                  <option value='Telangana'>Telangana</option>
                                  <option value='Andhra Pradesh'>Andhra Pradesh</option>
                                  <option value='Tamilnadu'>Tamilnadu</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-8'>
                              <div className='form-group'>
                                <label>{t`lanCommonLabelAddress`}<span className='madatory'>*</span></label>
                                <textarea className='input-text textarea' maxLength={60}
                                  value={this.state.address} onChange={(e) => this.setState({ address: e.target.value, errorNextMessage: '' })} />
                              </div>
                            </div>
                          </div>
                          <label className='text-danger'>{this.state.errorNextMessage}</label>
                          <div className='form-group text-center'>
                            <button type='button' onClick={this.handleBack} className='btn-outline'>{t`lanCommonButtonBack`}</button>
                            <button type='button' onClick={this.handleSignupSubmit} className='btn-md btn-theme'>{t`lanSPButtonSignup`}</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
        <SPSignupOtpComponent state={this.state} handlePropsValidateOtp={this.handleValidateOtp} />
      </div>
    )
  }
}

export default SPSignupComponent
