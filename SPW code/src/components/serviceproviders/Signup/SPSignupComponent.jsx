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
// eslint-disable-next-line no-useless-escape
const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/

class SPSignupComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      signupScreen: true,
      name: '',
      mobileNumber: '',
      verifiedMobileNumber: 'null',
      mobileNumVerifyStatus: 'Verify',
      propertyType: '',
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
      showPassword: false,
      businessName: '',
      email: '',
      statusCode: ''
    }
    this.handleSignupNext = this.handleSignupNext.bind(this)
    this.handleVerifyMobile = this.handleVerifyMobile.bind(this)
    this.handleVerifyEmail = this.handleVerifyEmail.bind(this)
    this.handleValidateOtp = this.handleValidateOtp.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleSignupSubmit = this.handleSignupSubmit.bind(this)
    this.handleCurrentLocation = this.handleCurrentLocation.bind(this)
    this.handleDone = this.handleDone.bind(this)
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
    if (!this.state.businessName.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorBusinessNameRequired` })
    } else if (!this.state.name.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorNameRequired` })
    } else if (!this.state.mobileNumber.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired` })
    } else if (!phRegex.test(this.state.mobileNumber)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber` })
    } else if (this.state.mobileNumVerifyStatus === 'Verify') {
      this.setState({ errorMessage: t`lanSPLabelErrorVerifyMobileNumber` })
    } else if (!this.state.email.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorEmailRequired` })
    } else if (!emailRegex.test(this.state.email)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else if (this.state.emailVerifyStatus === 'Verify') {
      this.setState({ errorMessage: t`lanSPLabelErrorVerifyEmail` })
    } else if (!this.state.city.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorCityRequired` })
    } else if (!this.state.propertyType.trim()) {
      this.setState({ errorMessage: 'property type required' })
    } else if (!this.state.address.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAdressRequired` })
    } else {
      let userData = {
        serviceProvider: this.state.businessName,
        contactPerson: this.state.name,
        contactNumber: this.state.mobileNumber,
        contactAddress: this.state.address,
        city: this.state.city,
        propertyType: this.state.propertyType,
        contactEmail: this.state.email
      }
      let _this = this
      let obj = { url: config.baseUrl + config.postSPUserSignupOnboardingAPI, body: userData }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ signupScreen: false, statusCode: resObj.data.statusCode })
        } else if (resObj.data.statusCode === '9957') {
          _this.setState({ signupScreen: false, statusCode: resObj.data.statusCode })
        } else if (resObj.data.statusCode === '9956') {
          _this.setState({ signupScreen: false, statusCode: resObj.data.statusCode })
        } else if (resObj.data.statusCode === '9951') {
          _this.setState({ signupScreen: false, statusCode: resObj.data.statusCode })
        } else {
          _this.setState({ errorMessage: 'lanSPLabelErrorFailed' })
        }
      })
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
  handleDone (e) {
    hashHistory.push('/')
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
              _this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberVerified`, verifiedMobileNumber: _this.state.mobileNumber, mobileNumVerifyStatus: 'Verified' })
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
              _this.setState({ errorMessage: t`lanSPLabelErrorEmailVerified`, verifiedEmail: _this.state.email, emailVerifyStatus: 'Verified' })
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
        var isArea = false
        this.getLocation(position.coords.latitude, position.coords.longitude, function (data) {
          if (data.statusCode === '0000') {
            _this.setState({ address: data.address })
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
                isArea = true
                _this.setState({ area: value.long_name })
              } else if (!isArea && value.types.indexOf('locality') !== -1) {
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
              // if (value.types.indexOf('sublocality') !== -1) {
              //   _this.setState({ address: _this.state.houseNumber + ', ' + _this.state.lineName + ', ' + _this.state.street + ', ' + value.long_name })
              // }
            })
          } else {
            alert(t`lanSPLabelErrorNotGettingLocationPleaseEnterManually`)
          }
        })
      },
      (error) => this.setState({ errorMessage: error.message }),
      { enableHighAccuracy: true, timeout: 1000, maximumAge: 1000 },
    )
  }

  getLocation (lat, long, callback) {
    fetch(config.googleGeoLocationLatLng + lat + ',' + long + '&key=' + config.googleMapsAPIKey)
      .then((response) => response.json())
      .then((responseJson) => {
        callback({ statusCode: '0000', result: responseJson.results[0].address_components, address: responseJson.results[0].formatted_address })
      }).catch((error) => {
        console.log('=== Create Location ERROR:', error)
        callback({ statusCode: '9999', result: {}, address: '' })
      })
  }
  handleEnter = (e) => {
    if (e.key === 'Enter') {
      this.handleSignupNext()
    }
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
                      <h3>{t`lanSPTitleWelcome`} <br /><span style={{ fontSize:30, fontWeight:500 }}>{t`lanSPTitleAMToPM`}</span></h3>
                      <p>{t`lanSPTitleTo`}</p>
                      {/* <a className='btn-outline' onClick={this.handleSignIn}>{t`lanSPButtonSignin`}</a> */}
                    </div>
                  </div>
                  <div className='col-md-7'>
                    <form role='form'>
                      <div className='login-inner-form'>
                        <div className='details'>
                          <div className='text-center'><h3>{t`lanSPLabelBecomeHost`}</h3></div>
                          <div className='row'>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelBusinessName`}<span className='mandatory'>*</span></label>
                                <input type='text' className='form-control' maxLength={30} onKeyDown={this.handleEnter} onChange={(e) => this.setState({ businessName: e.target.value, errorMessage: '' })} />
                              </div>
                            </div>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelName`} <span className='mandatory'>*</span></label>
                                <input type='text' className='form-control' maxLength={40}
                                  value={this.state.name} onKeyDown={this.handleEnter} onChange={() => this.setState({ name: event.target.value, errorMessage: '' })} />
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelMobileNumber`}<span className='mandatory'>*</span></label>
                                <input type='tel' className='form-control tel-input' maxLength={10} value={this.state.mobileNumber} onKeyPress={this.handleMobileNumKeys}
                                  onKeyDown={this.handleEnter} onChange={() => this.setState({ mobileNumber: event.target.value,
                                    mobileNumVerifyStatus: event.target.value === this.state.verifiedMobileNumber ? 'Verified' : 'Verify',
                                    errorMessage: '' })} />
                                <a onClick={this.handleVerifyMobile} className='verify' data-toggle='modal'
                                  data-target={this.state.mobileNumVerifyStatus === 'Verify' && this.state.mobileNumber.length === 10 ? '#modal-verifyPhone' : ''}>
                                  <small>{this.state.mobileNumVerifyStatus}</small></a>
                              </div>
                            </div>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelEmail`}<span className='mandatory'>*</span></label>
                                <input type='text' className='form-control' maxLength={30} onKeyDown={this.handleEnter} onChange={(e) => this.setState({ email: e.target.value, errorMessage: '' })} />
                                <a onClick={this.handleVerifyEmail} className='verify' data-toggle='modal'
                                  data-target={this.state.emailVerifyStatus === 'Verify' && this.state.email.trim() !== '' && emailRegex.test(this.state.email) ? '#modal-verifyEamil' : ''}>
                                  <small>{this.state.emailVerifyStatus}</small></a>
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelPropertyType`}<span className='mandatory'>*</span></label>
                                <select className='form-control' value={this.state.propertyType} onChange={(e) => this.setState({ propertyType: e.target.value, errorMessage: '' })} >
                                  <option value=''>{t`lanSPLabelSelectPropertyType`}</option>
                                  <option value='Hotel'>Hotel</option>
                                  <option value='Home'>Individual House</option>
                                  <option value='Hostels'>Hostels</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-6 pr-1'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelCity`}<span className='mandatory'>*</span></label>
                                <input type='text' className='form-control' maxLength={30} onKeyDown={this.handleEnter} onChange={(e) => this.setState({ city: e.target.value, errorMessage: '' })} />
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-12 pr-1'>
                              <div className='form-group'>
                                <label>{t`lanCommonLabelAddress`}<span className='mandatory'>*</span></label>
                                <textarea className='form-control textarea' placeholder={t`lanCommonLabelAddress`} value={this.state.address}
                                  onKeyDown={this.handleEnter} onChange={(e) => this.setState({ address: e.target.value, errorMessage: '' })} />
                              </div>
                            </div>
                          </div>
                          <div className='text-center'><label className='text-danger text-center'>{this.state.errorMessage}</label></div>
                          <div className='form-group text-center mb-3'>
                            <button type='button' onClick={this.handleSignupNext} className='btn-md btn-theme mt-2'>{t`lanSPButtonSubmit`}</button>
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
          <div className='row signup-box'>
            <div className='col-sm-12 px-0'>
              <div className='card border-0 mb-0'>
                {/* <div className='card-header bg-transparent'>
                  <h5 className='card-title'>{t`lanSPTitleSignup`}</h5>
                </div> */}
                <div className='row'>
                  <div className='col-md-5'>
                    <div className='bg-img'>
                      <h3>{t`lanSPTitleWelcome`} <br /><span style={{ fontSize:30, fontWeight:500 }}>{t`lanSPTitleAMToPM`}</span></h3>
                      <p>{t`lanSPTitleTo`}</p>
                      {/* <a className='btn-outline' onClick={this.handleSignIn}>{t`lanSPButtonSignin`}</a> */}
                    </div>
                  </div>
                  <div className='col-md-6 text-center mr-5 pl-0 m-auto'>
                    <div className='justify-content-center'>
                      <div className='card-body'>
                        <div className='row justify-content-center'>
                          {this.state.statusCode === '0000'
                        ? <div className='col-sm-12 text-center'>
                          <p><span className='text-success'><i className='fas fa-check-circle' style={{ fontSize: 35 }} /></span></p>
                          <p className='success-text'>{t`lanSPLabelThankYouForParterningWithUs`} <br /> {t`lanSPLabelOurTeamGetBackToYouSoon`}</p>
                        </div>
                        : this.state.statusCode === '9956'
                        ? <div className='col-sm-12 text-center'>
                          {/* <p><span className='text-success'><i className='fas fa-check-circle' style={{ fontSize: 35 }} /></span></p> */}
                          <p className='success-text'>{t`lanSPLabelMobilenumberAlreadyExistPleaseLogin`}</p>
                        </div> : this.state.statusCode === '9957'
                        ? <div className='col-sm-12 text-center'>
                          {/* <p><span className='text-success'><i className='fas fa-check-circle' style={{ fontSize: 35 }} /></span></p> */}
                          <p className='success-text'>{t`lanSPLabelEmailAlreadyExistPleaseLogin`}</p>
                        </div> : this.state.statusCode === '9951'
                        ? <div className='col-sm-12 text-center'>
                          <p><span className='text-success'><i className='fas fa-check-circle' style={{ fontSize: 35 }} /></span></p>
                          <p className='success-text'>{t`lanSPLabelYourRequestIsUnderProgressOurTeamWillGetBackToYouSoon`}</p>
                        </div> : '' }
                        </div>
                      </div>
                      <div className='form-group text-center'>
                        {this.state.statusCode === '0000' || this.state.statusCode === '9951'
                        ? <button type='button' onClick={this.handleDone} className='btn btn-primary'>{t`lanCommonButtonDone`}</button>
                        : <button type='button' onClick={this.handleSignIn} className='btn btn-primary'>{t`lanEUTitleLogin`}</button> }
                      </div>
                    </div>
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
