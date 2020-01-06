/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import config from '../../../../../public/config.json'
import { fetch as fetchPolyfill } from 'whatwg-fetch'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'

// import PropTypes from 'prop-types'
import moment from 'moment'
import './css/Profile.css'
import { t } from 'ttag'
import classnames from 'classnames'
import 'react-toastify/dist/ReactToastify.css'
import APICallManager from '../../../../services/callmanager'
import Modal from 'react-modal'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
}
const phRegex = /^\d{10}$/
class ADEUUserProfileEditComponent extends React.Component {
  constructor () {
    let maxDate = moment().subtract(18, 'years').format('YYYY-MM-DD')
    super()
    this.state = {
      euUserData: JSON.parse(localStorage.getItem('euUserData')),
      firstName: '',
      firstNameError: '',
      fNameSuccess: '',
      lastName: '',
      lastNameError: '',
      lNameSuccess: '',
      displayName: '',
      displayNameError: '',
      displayNameSuccess: '',
      email: '',
      emailError: '',
      emailSuccess: '',
      mobileNumber: '',
      mobileError: '',
      mobileSuccess: '',
      alternateContactNumber: '',
      alternatemobileError: '',
      alternatemobileSuccess: '',
      area: '',
      areaError: '',
      areaSuccess: '',
      city: '',
      cityError: '',
      citySuccess: '',
      zip: '',
      zipError: '',
      zipSuccess: '',
      stateError: '',
      countryError: '',
      address: '',
      addressSuccess: '',
      addressError: '',
      file: [],
      imgsrc: [],
      _id: '',
      state: '',
      country: '',
      stateOrg: '',
      countryOrg: '',
      userAccount: '',
      errorMessage: '',
      disabled: true,
      mobileVerifyButton: 'false',
      modalIsOpen: false,
      verifyStatus: false,
      maxDate: new Date(moment(maxDate).format('YYYY-MM-DD'))
    }
    this.onFileChange = this.onFileChange.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleUpdateUserProfile = this.handleUpdateUserProfile.bind(this)
    this.handleEnableProfileEdit = this.handleEnableProfileEdit.bind(this)
    this.handleVerifyMobileNumber = this.handleVerifyMobileNumber.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentWillMount () {
    let euUserData = JSON.parse(localStorage.getItem('euUserData'))
    if (euUserData.mobileNumber) {
      this.setState({ verifyStatus: true })
    }
    if (euUserData && euUserData.userRole === 'Customer') {
      this.setState({
        euUserData: euUserData,
        firstName: euUserData.firstName ? euUserData.firstName : '',
        lastName: euUserData.lastName ? euUserData.lastName : '',
        displayName: euUserData.displayName ? euUserData.displayName : '',
        mobileNumber: euUserData.mobileNumber ? euUserData.mobileNumber : '',
        mobileVerifyButton: euUserData.mobileNumber === '' ? 'true' : 'false',
        email: euUserData.email.includes('@') ? euUserData.email : '',
        address: euUserData.address ? euUserData.address : '',
        dob: euUserData.dob ? euUserData.dob : '',
        area: euUserData.area ? euUserData.area : '',
        city: euUserData.city ? euUserData.city : '',
        state: euUserData.state ? euUserData.state : '',
        stateOrg: euUserData.state ? euUserData.state : '',
        country: euUserData.country ? euUserData.country : '',
        countryOrg: euUserData.country ? euUserData.country : '',
        zip: euUserData.zip ? euUserData.zip : '',
        userAccount: euUserData.userAccount ? euUserData.userAccount : '',
        iconPath: euUserData.userIconPath ? euUserData.userIconPath : '',
        iconOriginalName: euUserData.userIconOriginalName ? euUserData.userIconOriginalName : '',
        userIcon: euUserData.userIcon ? euUserData.userIcon : ''
      })
    }
  }
  handleEnableProfileEdit () {
    this.setState({
      disabled: false
    })
  }
  handleMobileNumKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
    event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
    (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }
  handleChangeDate (date) {
    this.setState(prevState => {
      let euUserData = Object.assign({}, prevState.euUserData)
      let errorMessage = ''
      euUserData.dob = date
      return { euUserData, errorMessage }
    })
  }
  onFileChange (e) {
    this.setState({ file: e.target.files[0] })
    var file = e.target.files[0]
    var fileType = file.type ? file.type.split('/')[0] : ''
    if (fileType !== 'image') {
      this.setState({ errorMessage: t`lanEULabelErrorUploadValidImage` })
    } else {
      var reader = new FileReader()
      var url = reader.readAsDataURL(file)
      reader.onloadend = function (e) {
        this.setState({
          imgsrc: [reader.result], errorMessage: ''
        })
      }.bind(this)
      console.log('url', url)
    }
  }
  handleUpdateUserProfile () {
    let newEuUserData = this.state.euUserData
    // eslint-disable-next-line no-useless-escape
    const emailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/
    if (this.state.errorMessage) {
      this.setState({ errorMessage: t`lanEULabelErrorUploadValidImage` })
    } else if (!this.state.firstName) {
      this.setState({ firstNameError: t`lanCommonLabelErrorFirstNameRequired` })
    } else if (!this.state.lastName) {
      this.setState({ lastNameError: t`lanCommonLabelErrorLastNameRequired` })
    } else if (!this.state.displayName) {
      this.setState({ displayNameError: t`lanCommonLabelErrorDisplayNameRequired` })
    } else if (!this.state.email) {
      this.setState({ emailError: t`lanEULabelErrorEmailRequired` })
    } else if (!emailValidation.test(this.state.email)) {
      this.setState({ emailError: t`lanEULabelErrorInvalidEmail` })
    } else if (!this.state.mobileNumber) {
      this.setState({ mobileError: t`lanEULabelErrorMobileNumberRequired` })
    } else if (!this.state.mobileNumber.trim().match(phRegex)) {
      this.setState({ mobileError: t`lanEULabelErrorInvalidMobileNumber`, mobileSuccess: false })
    } else if (this.state.mobileNumber && this.state.mobileNumber.trim().match(phRegex) && !this.state.verifyStatus) {
      this.setState({ mobileError: 'Verify Mobile Number', mobileSuccess: false })
    } else if (!this.state.area) {
      this.setState({ areaError: t`lanEULabelErrorAreaRequired` })
    } else if (!this.state.city.trim()) {
      this.setState({ cityError: t`lanEULabelErrorCityRequired` })
    } else if (!this.state.zip) {
      this.setState({ zipError: t`lanEULabelErrorPinCodeRequired` })
    } else if (!this.state.state) {
      this.setState({ stateError: t`lanEULabelErrorStateRequired` })
    } else if (!this.state.country) {
      this.setState({ countryError: t`lanEULabelErrorCountryRequired` })
    } else if (!this.state.address) {
      this.setState({ addressError: t`lanEULabelErrorAdressRequired` })
    } else {
      var dateNumber = ''
      if (this.state.euUserData.dob) {
        dateNumber = moment.utc(this.state.euUserData.dob).valueOf()
      }
      let DoB = this.state.euUserData && this.state.euUserData.dob ? moment(this.state.euUserData.dob).format('YYYY-MM-DD') : ''
      let _this = this
      const data = new FormData()
      data.append('profileImage', this.state.file)
      data.append('profilefirstName', this.state.firstName)
      data.append('profilelastName', this.state.lastName)
      data.append('profiledisplayName', this.state.displayName)
      data.append('profilemobileNumber', this.state.mobileNumber)
      data.append('profileemail', this.state.email)
      data.append('profileuserAccount', this.state.userAccount)
      data.append('profiledob', DoB)
      data.append('dobNumber', dateNumber)
      data.append('profilezip', this.state.zip)
      data.append('profilearea', this.state.area)
      data.append('profilecity', this.state.city)
      data.append('profilestate', this.state.state)
      data.append('profilecountry', this.state.country)
      data.append('profileaddress', this.state.address)
      data.append('customerImageFilePath', this.state.iconPath)
      data.append('customerImageFilePath', this.state.iconOriginalName)
      fetchPolyfill(config.baseUrl + config.putADEUUserProfileUpdateAPI + this.state.euUserData._id, {
        method: 'PUT',
        body: data,
        headers: { 'token': localStorage.getItem('token') }
      }).then((response) => {
        response.json().then((body) => {
          if (response.headers.get('token')) {
            localStorage.setItem('token', response.headers.get('token'))
          }
          if (response.status === 200) {
            newEuUserData.firstName = body.statusResult.firstName
            newEuUserData.lastName = body.statusResult.lastName
            newEuUserData.name = body.statusResult.name
            newEuUserData.displayName = body.statusResult.displayName
            newEuUserData.mobileNumber = body.statusResult.mobileNumber
            newEuUserData.email = body.statusResult.email
            newEuUserData.area = body.statusResult.area
            newEuUserData.city = body.statusResult.city
            newEuUserData.state = body.statusResult.state
            newEuUserData.country = body.statusResult.country
            newEuUserData.zip = body.statusResult.zip
            newEuUserData.address = body.statusResult.address
            newEuUserData.dob = body.statusResult.dob ? body.statusResult.dob : ''
            newEuUserData.userIconPath = body.statusResult.userIconPath
            newEuUserData.userIconOriginalName = body.statusResult.userIconOriginalName
            newEuUserData.userIcon = body.statusResult.userIcon
            localStorage.setItem('euUserData', JSON.stringify(newEuUserData))
            _this.setState({ euUserData: newEuUserData })
            _this.setState({ disabled: true,
              fNameSuccess: false,
              lNameSuccess: false,
              displayNameSuccess: false,
              emailSuccess: false,
              mobileSuccess: false,
              areaSuccess: false,
              citySuccess: false,
              zipSuccess: false,
              addressSuccess: false
            })
            _this.props.toastFunc('Profile Updated Successfully')
            _this.props.updatedata(_this.state.imgsrc, newEuUserData)
            // _this.props.handleImageUpdate(_this.state.imgsrc)
          } else {
            _this.props.toastFunc('Profile Update Failed')
          }
        })
      })
    }
  }
  handleVerifyMobileNumber () {
    if (!this.state.mobileNumber.trim()) {
      this.setState({ mobileError: t`lanEULabelErrorMobileNumberRequired`, mobileSuccess: false })
    } else if (!this.state.mobileNumber.trim().match(phRegex)) {
      this.setState({ mobileError: t`lanEULabelErrorInvalidMobileNumber`, mobileSuccess: false })
    } else {
      let obj = { url: config.baseUrl + config.postProfileMobileNumberUniqnessVerifyAPI, body: { mobileNumber: this.state.mobileNumber } }
      let _this = this
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '1001') {
          _this.setState({ modalIsOpen: true, otpValue: resObj.data.statusResult.otpNumber })
        } else {
          _this.props.toastFunc('Number Already Exist')
        }
      })
    }
    event.preventDefault()
  }
  handleCloseModal () {
    this.setState({ modalIsOpen: false })
  }
  handleSubmit () {
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
      let obj = { url: config.baseUrl + config.postProfileMobileNumberOTPVerifyAPI, body: userData }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '1002') {
          _this.setState({ modalIsOpen: false })
          let euUserData = JSON.parse(localStorage.getItem('euUserData'))
          euUserData.mobileNumber = resObj.data.statusResult.mobileNumber
          localStorage.setItem('euUserData', JSON.stringify(euUserData))
          _this.setState({ verifyStatus: true, errorMessage: '' })
        } else {
          _this.setState({ errorMessage: t`lanEULabelErrorInvalidOTP` })
        }
      })
    }
    event.preventDefault()
  }
  render () {
    return (
      <div>
        <div className='edit-profile-info eu-edit-profile'>
          <div className='card'>
            <div className='card-header card-header-danger'>
              <h4 className='card-title' title='click edit button to edit profile' >{ t`lanEUTitleEditProfile` } </h4>
              <span className='pl-4' title='click edit button to edit profile'><i className='fas fa-edit' style={{ color: '#fff' }} onClick={this.handleEnableProfileEdit} /></span>
            </div>
            <div className='edit-profile-form'>
              <div className='card-body'>
                <form>
                  <div className='row'>
                    <div className='col-lg-12 card-profile-edit-col text-center'>
                      <div className='card-avatar' style={{ height: 120 }}>
                        <img src={this.state.imgsrc.length ? this.state.imgsrc : (this.state.euUserData.userIconPath
                          ? config.baseUrl + this.state.euUserData.userIconPath : require('../../../../../assets/profile-icon.png'))} className='rounded-circle' />
                      </div>
                      <div className='cam-icon-div'>
                        <a onClick={(e) => this.refs.handleFileSelect.click()}>
                          <i className='fas fa-camera' />
                        </a>
                        <input ref='handleFileSelect' name='EndUser-profile' type='file' onChange={this.onFileChange} disabled={this.state.disabled} style={{ display: 'none' }} />
                      </div>
                      <span className='text-danger'>{this.state.errorMessage}</span>
                    </div>
                  </div>
                  <div className=' row'>
                    <div className='col-sm-6' >
                      <div className='form-group row'>
                        <label className='col-md-4 col-form-label form-control-label'>{t`lanCommonLabelFirstName`}<span style={{ color: 'red' }} >*</span></label>
                        <div className='col-md-8 pt-2'>
                          <input autoFocus type='text' disabled={this.state.disabled} className='form-control'
                            placeholder='' id='firstName' style={this.state.fNameSuccess ? { borderColor: '#4da424' } : {}} value={this.state.firstName}
                            onChange={(event) => {
                              let fName = event.target.value.trim()
                              if (fName) {
                                this.setState({ firstName: event.target.value, firstNameError: '', fNameSuccess: true })
                              } else {
                                this.setState({ firstName: event.target.value, firstNameError: t`lanCommonLabelErrorFirstNameRequired`, fNameSuccess: false })
                              }
                            }} required maxLength={40} />
                          <span className='input-error-icon' ><i className='fas fa-check' style={this.state.fNameSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.firstNameError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='error errorMessage' >{this.state.firstNameError}</p>
                        </div>
                      </div>
                    </div>
                    <div className='col-sm-6' >
                      <div className='form-group row'>
                        <label className='col-md-4 col-form-label form-control-label'>{t`lanCommonLabelLastName`}<span style={{ color: 'red' }} >*</span></label>
                        <div className='col-md-8 pt-2'>
                          <input type='text' disabled={this.state.disabled} className='form-control' placeholder=''
                            id='lastName' value={this.state.lastName} style={this.state.lNameSuccess ? { borderColor: '#4da424' } : {}}
                            onChange={(event) => {
                              let lName = event.target.value.trim()
                              if (lName) {
                                this.setState({ lastName: event.target.value, lastNameError: '', lNameSuccess: true })
                              } else {
                                this.setState({ lastName: event.target.value, lastNameError: t`lanCommonLabelErrorLastNameRequired`, lNameSuccess: false })
                              }
                            }} required maxLength={40} />
                          <span className='input-error-icon' ><i className='fas fa-check' style={this.state.lNameSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.lastNameError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='error errorMessage' >{this.state.lastNameError}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=' row'>
                    <div className='col-sm-6' >
                      <div className='form-group row'>
                        <label className='col-md-4 col-form-label form-control-label'>{t`lanCommonLabelDisplayName`}<span style={{ color: 'red' }} >*</span></label>
                        <div className='col-md-8 pt-2'>
                          <input type='text' disabled={this.state.disabled} className='form-control'
                            placeholder='' id='displayName' value={this.state.displayName} style={this.state.displayNameSuccess ? { borderColor: '#4da424' } : {}}
                            onChange={(event) => {
                              let dName = event.target.value.trim()
                              if (dName) {
                                this.setState({ displayName: event.target.value, displayNameError: '', displayNameSuccess: true })
                              } else {
                                this.setState({ displayName: event.target.value, displayNameError: t`lanCommonLabelErrorDisplayNameRequired`, displayNameSuccess: false })
                              }
                            }} required maxLength={40} />
                          <span className='input-error-icon' ><i className='fas fa-check' style={this.state.displayNameSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.displayNameError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='error errorMessage' >{this.state.displayNameError}</p>
                        </div>
                      </div>
                    </div>
                    <div className='col-sm-6' >
                      <div className='form-group row'>
                        <label className='col-md-4 col-form-label form-control-label'>{t`lanCommonLabelEmail`}<span style={{ color: 'red' }} >*</span></label>
                        <div className='col-md-8 pt-2'>
                          <input type='email' disabled={this.state.disabled} className='form-control'
                            placeholder='' id='email' value={this.state.email} style={this.state.emailSuccess ? { borderColor: '#4da424' } : {}}
                            onChange={(event) => {
                              let emailID = event.target.value.trim()
                              if (emailID) {
                                this.setState({ email: event.target.value, emailError: '', emailSuccess: true })
                              } else {
                                this.setState({ email: event.target.value, emailError: t`lanEULabelErrorEmailRequired`, emailSuccess: false })
                              }
                            }} required maxLength={80}
                          />
                          <span className='input-error-icon' ><i className='fas fa-check' style={this.state.emailSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.emailError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='error errorMessage' >{this.state.emailError}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=' row'>
                    <div className='col-sm-6' >
                      <div className='form-group row'>
                        <label className='col-md-4 col-form-label form-control-label'>{t`lanCommonLabelMobileNumber`}<span style={{ color: 'red' }} >*</span></label>
                        <div className='col-md-8 pt-2'>
                          <input type='text' disabled={this.state.disabled || this.state.mobileVerifyButton === 'false'} className='form-control'
                            placeholder='' id='mobileNumber' value={this.state.mobileNumber} style={this.state.mobileSuccess ? { borderColor: '#4da424' } : {}}
                            onChange={(event) => {
                              let mNumber = event.target.value.trim()
                              if (mNumber) {
                                this.setState({ mobileNumber: event.target.value, mobileError: '', mobileSuccess: true })
                              } else {
                                this.setState({ mobileNumber: event.target.value, mobileError: t`lanEULabelErrorMobileNumberRequired`, mobileSuccess: false })
                              }
                            }} required maxLength={10} onKeyPress={this.handleMobileNumKeys}
                          />
                          <span className='input-error-icon' ><i className='fas fa-check' style={this.state.mobileSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.mobileError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          {!this.state.disabled && this.state.mobileVerifyButton === 'true' ? <button disabled={this.state.verifyStatus || !this.state.mobileNumber}
                            onClick={this.handleVerifyMobileNumber}>{this.state.verifyStatus ? 'Verified' : 'Verify' }</button> : ''}
                          <p className='error errorMessage' >{this.state.mobileError}</p>
                        </div>
                      </div>
                    </div>
                    <div className='col-sm-6' >
                      <div className='form-group row'>
                        <label className='col-md-4 col-form-label form-control-label'>{t`lanCommonLabelAlternateMobileNumber`}</label>
                        <div className='col-md-8 pt-2'>
                          <input type='text' disabled={this.state.disabled} className='form-control'
                            placeholder='' id='alternateContactNumber' value={this.state.alternateContactNumber} style={this.state.alternatemobileSuccess ? { borderColor: '#4da424' } : {}}
                            onChange={(event) => {
                              let altNumber = event.target.value.trim()
                              if (altNumber) {
                                this.setState({ alternateContactNumber: event.target.value, alternatemobileError: '', alternatemobileSuccess: true })
                              } else {
                                this.setState({ alternateContactNumber: event.target.value, alternatemobileError: '', alternatemobileSuccess: false })
                              }
                            }} required maxLength={10} onKeyPress={this.handleMobileNumKeys}
                          />
                          <span className='input-error-icon' ><i className='fas fa-check' style={this.state.alternatemobileSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.alternatemobileError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='error errorMessage' >{this.state.alternatemobileError}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=' row'>
                    <div className='col-sm-6' >
                      <div className='form-group row'>
                        <label className='col-md-4 col-form-label form-control-label'>{t`lanCommonLabelArea`}<span style={{ color: 'red' }}>*</span></label>
                        <div className='col-md-8 pt-2'>
                          <input type='text' disabled={this.state.disabled} className='form-control' placeholder='' id='area' value={this.state.area} style={this.state.areaSuccess ? { borderColor: '#4da424' } : {}}
                            onChange={(event) => {
                              let a = event.target.value.trim()
                              if (a) {
                                this.setState({ area: event.target.value, areaError: '', areaSuccess: true })
                              } else {
                                this.setState({ area: event.target.value, areaError: t`lanEULabelErrorAreaRequired`, areaSuccess: false })
                              }
                            }} required maxLength={20}
                          />
                          <span className='input-error-icon' ><i className='fas fa-check' style={this.state.areaSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.areaError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='error errorMessage' >{this.state.areaError}</p>
                        </div>
                      </div>
                    </div>
                    <div className='col-sm-6' >
                      <div className='form-group row'>
                        <label className='col-md-4 col-form-label form-control-label'>{t`lanCommonLabelCity`}<span style={{ color: 'red' }}>*</span></label>
                        <div className='col-md-8 pt-2'>
                          <input type='text' disabled={this.state.disabled} className='form-control' placeholder='' id='city' value={this.state.city} style={this.state.citySuccess ? { borderColor: '#4da424' } : {}}
                            onChange={(event) => {
                              let c = event.target.value.trim()
                              if (c) {
                                this.setState({ city: event.target.value, cityError: '', citySuccess: true })
                              } else {
                                this.setState({ city: event.target.value, cityError: t`lanEULabelErrorCityRequired`, citySuccess: false })
                              }
                            }} required maxLength={20}
                          />
                          <span className='input-error-icon' ><i className='fas fa-check' style={this.state.citySuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.cityError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='error errorMessage' >{this.state.cityError}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=' row'>
                    <div className='col-sm-6' >
                      <div className='form-group row'>
                        <label className='col-md-4 col-form-label form-control-label'>{ t`lanCommonLabelState` }<span style={{ color: 'red' }}>*</span></label>
                        <div className='col-md-8 pt-2'>
                          <select className='form-control' disabled={this.state.disabled} id='state' onChange={() => this.setState({ state: event.target.value, stateError: '' })}
                            required='' value={this.state.state}>
                            {this.state.stateOrg ? null : <option className='select-label' value=''>{ t`lanCommonLabelSelectState` }</option>}
                            <option value='Telangana'>Telangana</option>
                            <option value='Andhra Pradesh'>Andhra Pradesh</option>
                          </select>
                          <p className='error errorMessage' >{this.state.stateError}</p>
                        </div>
                      </div>
                    </div>
                    <div className='col-sm-6' >
                      <div className='form-group row'>
                        <label className='col-md-4 col-form-label form-control-label'>{ t`lanCommonLabelCountry` }<span style={{ color: 'red' }}>*</span></label>
                        <div className='col-md-8 pt-2'>
                          <select className='form-control' disabled={this.state.disabled} id='country' onChange={() => this.setState({ country: event.target.value, countryError: '' })}
                            required='' value={this.state.country} >
                            {this.state.countryOrg ? null : <option className='select-label' value=''>{ t`lanCommonLabelSelectCountry` }</option>}
                            <option value='India'>India</option>
                          </select>
                          <p className='error errorMessage' >{this.state.countryError}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-6' >
                      <div className='form-group row'>
                        <label className='col-md-4 col-form-label form-control-label'>{ t`lanCommonLabelDateOfBirth` }</label>
                        <div className='col-md-8 pt-2 profile-dob'>
                          <DatePicker
                            maxDate={this.state.maxDate}
                            selected={(this.state.dob)
                              ? new Date(moment(this.state.euUserData.dob).year(), moment(this.state.euUserData.dob).month(), moment(this.state.euUserData.dob).date()) : null}
                            filterDate={(date) => {
                              return moment() > date
                            }}
                            className={classnames('enableElement', { 'disableElement': this.state.disabled })}
                            onSelect={this.handleChangeDate}
                            value={(this.state.euUserData && this.state.euUserData.dob) ? moment(this.state.euUserData.dob).format('MMM DD, YY') : null}
                            showYearDropdown
                            showMonthDropdown
                            disabled={this.state.disabled}
                            onKeyDown={(event) => event.preventDefault()}
                          />
                          <i className='far fa-calendar-alt icon-cal' />
                        </div>
                      </div>
                    </div>
                    <div className='col-sm-6' >
                      <div className='form-group row'>
                        <label className='col-md-4 col-form-label form-control-label'>{t`lanCommonLabelZip`}<span style={{ color: 'red' }}>*</span></label>
                        <div className='col-md-8 pt-2'>
                          <input type='text' disabled={this.state.disabled} className='form-control' placeholder='' id='zip' value={this.state.zip} style={this.state.zipSuccess ? { borderColor: '#4da424' } : {}}
                            onChange={(event) => {
                              let z = event.target.value.trim()
                              if (z) {
                                this.setState({ zip: event.target.value, zipError: '', zipSuccess: true })
                              } else {
                                this.setState({ zip: event.target.value, zipError: t`lanEULabelErrorPinCodeRequired`, zipSuccess: false })
                              }
                            }} required maxLength={6} onKeyPress={this.handleMobileNumKeys}
                            />
                          <span className='input-error-icon' ><i className='fas fa-check' style={this.state.zipSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.zipError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='error errorMessage' >{this.state.zipError}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <label className='col-sm-2 form-control-label col-form-label'>{t`lanCommonLabelAddress`}<span style={{ color: 'red' }}>*</span></label>
                    <div className='col-sm-10 pl-3'>
                      <div className='form-group'>
                        <textarea type='text' disabled={this.state.disabled} className='form-control' id='address' rows={3}
                          placeholder={this.state.address} style={this.state.addressSuccess ? { borderColor: '#4da424' } : {}}
                          onChange={(event) => {
                            let ad = event.target.value.trim()
                            if (ad) {
                              this.setState({ address: event.target.value, addressError: '', addressSuccess: true })
                            } else {
                              this.setState({ address: event.target.value, addressError: t`lanEULabelErrorAdressRequired`, addressSuccess: false })
                            }
                          }} required maxLength={80} />
                        <span className='input-error-icon-address' ><i className='fas fa-check' style={this.state.addressSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                        <span className='input-error-icon-address' ><i className='far fa-times-circle' style={this.state.addressError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                        <p className='error errorMessage' >{this.state.addressError}</p>
                      </div>
                    </div>
                  </div>
                  {!this.state.disabled
                  ? <div className='row'>
                    <div className='col-sm-12 text-center' >
                      <a onClick={this.handleUpdateUserProfile} className='btn btn-primary btn-text-white btn-center' >{ t`lanCommonButtonUpdate` }</a>
                    </div>
                  </div>
                  : null }
                </form>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}>
          <div className='card-body px-lg-3 signup-verify'>
            <form role='form'>
              <div className='text-center mb-3'>
                {/* <h4 className='heading'>Hi,</h4> */}
                <p>{ t`lanSPLabelErrorEnterOtp` }</p>
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
                  <button type='button' className='btn btn-info mt-2' ref='mobileOtpClose' onClick={this.handleCloseModal}>{ t`lanCommonButtonBack` }</button>
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
        </Modal>
      </div>
    )
  }
}
ADEUUserProfileEditComponent.propTypes = {
  updatedata:PropTypes.any,
  toastFunc: PropTypes.func
}

export default ADEUUserProfileEditComponent
