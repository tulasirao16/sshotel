/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import PropTypes from 'prop-types'
import APICallManager from '../../../services/callmanager'

import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ADHostUserCreateComponent extends React.Component {
  constructor () {
    let maxDate = moment().subtract(18, 'years').format('YYYY-MM-DD')
    super()
    this.state = {
      hostData: JSON.parse(localStorage.getItem('hostData')),
      userData: JSON.parse(localStorage.getItem('userData')),
      firstName: '',
      lastName: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      email: '',
      alternateEmail: '',
      password: '',
      dob: '',
      gender: '',
      userRole: '',
      userStatus: 'Active',
      area: '',
      landmark: '',
      city: '',
      zip: '',
      state: '',
      country: 'India',
      address: '',
      buttonDisabled:false,
      maxDate: new Date(moment(maxDate).format('YYYY-MM-DD'))
    }

    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleSelectGender = this.handleSelectGender.bind(this)
    this.handleSelectUserRole = this.handleSelectUserRole.bind(this)
    this.handleSelectUserStatus = this.handleSelectUserStatus.bind(this)
    this.handleCreateUser = this.handleCreateUser.bind(this)
    this.handleSelectState = this.handleSelectState.bind(this)
  }

  handleMobileNumKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
    event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
    (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }

  handleChangeDate (date) {
    this.setState({
      dob: date
    })
  }

  handleSelectGender (event) {
    if (event.target.value === '') {
      this.setState({
        gender: '',
        errorMessage: ''
      })
    } else {
      this.setState({
        gender: event.target.value,
        errorMessage: ''
      })
    }
  }

  handleSelectUserRole () {
    if (event.target.value === '') {
      this.setState({
        userRole: '',
        errorMessage: ''
      })
    } else {
      this.setState({
        userRole: event.target.value,
        errorMessage: ''
      })
    }
  }

  handleSelectUserStatus () {
    this.setState({
      userStatus: event.target.value,
      errorMessage: ''
    })
  }
  handleCreateUser () {
    // eslint-disable-next-line no-useless-escape
    const emailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/
    const phValidation = /^\d{10}$/
    if (!this.state.firstName.trim()) {
      this.setState({ errorMessage: t`lanCommonLabelErrorFirstNameRequired` })
    } else if (!this.state.lastName.trim()) {
      this.setState({ errorMessage: t`lanCommonLabelErrorLastNameRequired` })
    } else if (!this.state.userRole.trim()) {
      this.setState({ errorMessage: t`lanCommonLabelErrorUserRoleRequired` })
    } else if (!this.state.mobileNumber) {
      this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired` })
    } else if (!phValidation.test(this.state.mobileNumber)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber` })
    } else if (this.state.alternateMobileNumber && !phValidation.test(this.state.alternateMobileNumber)) {
      this.setState({ errorMessage: t`lanCommonLabelErrorInvalidAlternateMobileNumber` })
    } else if (!this.state.email) {
      this.setState({ errorMessage: t`lanSPLabelErrorEmailRequired` })
    } else if (!emailValidation.test(this.state.email)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else if (this.state.alternateEmail && !emailValidation.test(this.state.alternateEmail)) {
      this.setState({ errorMessage: t`lanCommonLabelErrorInvalidAlternateEmail` })
    } else if (!this.state.password) {
      this.setState({ errorMessage: t`lanSPLabelErrorPasswordRequired` })
    } else if (this.state.password && this.state.password.length < 6) {
      this.setState({ errorMessage: t`lanSPLabelErrorPasswordMinLength` })
    } else if (!this.state.address.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAdressRequired` })
    } else {
      this.setState({ buttonDisabled: true })
      var dateNumber = ''
      if (this.state.dob) {
        dateNumber = moment.utc(this.state.dob).valueOf()
      }
      var userData = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        mobileNumber: this.state.mobileNumber,
        alternateContactNumber: this.state.alternateMobileNumber,
        email: this.state.email,
        alternateEmail: this.state.alternateEmail,
        password: this.state.password,
        dob: this.state.dob,
        dobNumber: dateNumber,
        gender: this.state.gender ? this.state.gender : '',
        userRole: this.state.userRole,
        userStatus: this.state.userStatus,
        area: this.state.area,
        landMark: this.state.landmark,
        address: this.state.address,
        city: this.state.city,
        state: this.state.state,
        pinCode: this.state.zip,
        country: this.state.country,
        spServiceProviderId: this.state.hostData._id,
        spServiceProvider: this.state.hostData.serviceProvider
      }
      let _this = this
      let obj = { url: config.baseUrl + config.postADHostUserCreateAPI, body: userData }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.props.toastFunc('User Created Successfully')
          let resData = resObj.data.statusResult
          setTimeout(() => {
            _this.props.handleUserCreatedData(resData)
          }, 2000)
        } else {
          _this.setState({ buttonDisabled: false })
          _this.props.toastFunc('User Create failed')
          if (resObj.data.statusCode === '9988') {
            _this.setState({ errorMessage: t`lanSPLabelErrorUserEmailExist` })
          } else if (resObj.data.statusCode === '9989') {
            _this.setState({ errorMessage: t`lanSPLabelErrorUserMobileNumberExist` })
          }
        }
      })
    }
    event.preventDefault()
  }

  handleSelectState () {
    if (event.target.value === '') {
      this.setState({
        state: '',
        errorMessage: ''
      })
    } else {
      this.setState({
        state: event.target.value,
        errorMessage: ''
      })
    }
  }

  handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          let _this = this
          var isArea = false
          this.getLocation(position.coords.latitude, position.coords.longitude, function (data) {
            if (data.statusCode === '0000') {
              _this.setState({ loading: false })
              data.result.forEach(value => {
                if (value.types.indexOf('premise') !== -1) {
                  _this.setState({ houseNumber: value.long_name })
                }
                if (value.types.indexOf('administrative_area_level_2') !== -1) {
                  _this.setState({ city: value.long_name })
                }
                if (value.types.indexOf('administrative_area_level_1') !== -1) {
                  _this.setState({ state: value.long_name })
                }
                if (value.types.indexOf('sublocality') !== -1) {
                  _this.setState({ address: _this.state.houseNumber + ', ' + _this.state.lineName + ', ' + _this.state.street + ', ' + value.long_name })
                }
                if (value.types.indexOf('sublocality_level_2') !== -1) {
                  _this.setState({ street: value.long_name })
                }
                if (value.types.indexOf('sublocality_level_3') !== -1) {
                  _this.setState({ lineName: value.long_name })
                }
                if (value.types.indexOf('sublocality_level_1') !== -1) {
                  isArea = true
                  this.setState({ area: value.long_name })
                } else if (!isArea && value.types.indexOf('locality') !== -1) {
                  this.setState({ area: value.long_name })
                }
                if (value.types.indexOf('postal_code') !== -1) {
                  _this.setState({ zip: value.long_name })
                }
                if (value.types.indexOf('locality') !== -1) {
                  _this.setState({ areaLocality: value.long_name })
                }
                if (value.types.indexOf('country') !== -1) {
                  _this.setState({ country: value.long_name })
                }
              })
            } else {
              _this.setState({ loading: false })
              _this.props.toastFunc('Not Getting Location.Please Enter Manually')
            }
          })
        },
        (error) => this.setState({ errorMessage: error.message, loading: false }),
        { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
    )
  }

  getLocation (lat, long, callback) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + config.googleMapsAPIKey)
        .then((response) => response.json())
        .then((responseJson) => {
          callback({ statusCode: '0000', result: responseJson.results[0].address_components })
        }).catch((error) => {
          console.log('===Error:', error)
          callback({ statusCode: '9999', result: {} })
        })
  }
  render () {
    return (
      <div className='user-create'>
        <div className='py-lg-4'>
          <div className='mb-3'><h3>{t`lanADTitleHostsCreateHostUser`}</h3></div>
          <form>
            <div className='row'>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanSPLabelBusinessName` }</label>
                  <input type='text' className='form-control' name='businessName' value={this.state.hostData.serviceProvider} disabled='disabled' />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelFirstName` }<span className='madatory'>*</span></label>
                  <input type='text' className='form-control' name='firstName' minLength='3' maxLength='20' value={this.state.firstName}
                    onChange={() => this.setState({ firstName: event.target.value, errorMessage:'' })} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelLastName` }<span className='madatory'>*</span></label>
                  <input type='text' className='form-control' name='lastName' minLength='3' maxLength='20' value={this.state.lastName} onChange={() => this.setState({ lastName: event.target.value, errorMessage:'' })} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelUserRole` }<span className='madatory'>*</span></label>
                  <select className='form-control' onChange={this.handleSelectUserRole} value={this.state.userRole} >
                    <option value=''>{ t`lanCommonLabelSelectUserRole` }</option>
                    <option value='Admin'>Admin</option>
                    <option value='Manager'>Manager</option>
                    <option value='Receptionist'>Receptionist</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelMobileNumber` }<span className='madatory'>*</span></label>
                  <input type='text' className='form-control' name='mobileNumber' maxLength='10' pattern='\d{10}' onKeyPress={this.handleMobileNumKeys}
                    value={this.state.mobileNumber} onChange={
                      () => {
                        if (event.target.value) {
                          this.setState({ mobileNumber: event.target.value.match(/\d+/g).toString().replace(/,/g, ''), errorMessage:'' })
                        } else {
                          this.setState({ mobileNumber: event.target.value, errorMessage:'' })
                        }
                      }} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelAlternateMobileNumber` }</label>
                  <input type='text' className='form-control' name='alternateMobileNumber' maxLength='10' pattern='\d{10}' onKeyPress={this.handleMobileNumKeys}
                    value={this.state.alternateMobileNumber} onChange={
                      () => {
                        if (event.target.value) {
                          this.setState({ alternateMobileNumber: event.target.value.match(/\d+/g).toString().replace(/,/g, ''), errorMessage:'' })
                        } else {
                          this.setState({ alternateMobileNumber: event.target.value, errorMessage:'' })
                        }
                      }} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelEmail` }<span className='madatory'>*</span></label>
                  <input type='text' className='form-control' name='email' minLength='3' maxLength='80' value={this.state.email} onChange={() => this.setState({ email: event.target.value, errorMessage:'' })} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelAlternateEmail` }</label>
                  <input type='text' className='form-control' name='alternateEmail' minLength='3' maxLength='80' value={this.state.alternateEmail}
                    onChange={() => this.setState({ alternateEmail: event.target.value, errorMessage:'' })} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelDateOfBirth` }</label>
                  <DatePicker
                    maxDate={this.state.maxDate}
                    selected={this.state.dob ? this.state.dob : null}
                    filterDate={(date) => {
                      return moment() > date
                    }}
                    onSelect={this.handleChangeDate}
                    value={this.state.dob ? moment(this.state.dob).format('MMM DD, YY') : null}
                    showYearDropdown
                    showMonthDropdown
                    className='form-control dob-form-control'
                    // format='YYYY-MM-DD'}
                  />
                  <i className='far fa-calendar-alt icon-cal' />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelGender` }</label>
                  <select className='form-control' onChange={this.handleSelectGender} value={this.state.gender} >
                    <option value=''>{ t`lanCommonLabelSelectGender` }</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelSelectStatus` }<span className='madatory'>*</span></label>
                  <select className='form-control' onChange={this.handleSelectUserStatus} value={this.state.userStatus}>
                    <option value='Active'>Active</option>
                    <option value='Inactive'>Inactive</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelPassword` }<span className='madatory'>*</span></label>
                  <input type='password' className='form-control' name='password' minLength='6' maxLength='20' value={this.state.password}
                    onChange={() => this.setState({ password: event.target.value.replace(/\s/g, ''), errorMessage:'' })} />
                </div>
              </div>
            </div>
          </form>
          <div className='mb-3'>
            <div className='pull-left'>
              <h3>{t`lanSPSubTitlePropertyLocationDetails`}</h3>
            </div>
            <div className='pull-right'>
              <a onClick={this.handleLocation} className='btn btn-success text-white'><i className='fas fa-map-marker-alt' />{' '}{ t`lanSPButtonGetLocation` }</a>
            </div>
            <div className='clearfix' />
          </div>
          <form>
            <div className='row'>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelArea` }</label>
                  <input type='text' className='form-control' name='area' minLength='3' maxLength='20' value={this.state.area} onChange={() => this.setState({ area: event.target.value, errorMessage:'' })} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelLandmark` }</label>
                  <input type='text' className='form-control' name='landmark' minLength='3' maxLength='30' value={this.state.landmark} onChange={() => this.setState({ landmark: event.target.value, errorMessage:'' })} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelCity` }</label>
                  <input type='text' className='form-control' name='city' minLength='3' maxLength='20' value={this.state.city} onChange={() => this.setState({ city: event.target.value, errorMessage:'' })} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelZip` }</label>
                  <input type='text' className='form-control' name='zip' maxLength='6'
                    onKeyPress={this.handleMobileNumKeys} value={this.state.zip} onChange={() => this.setState({ zip: event.target.value, errorMessage:'' })} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelState` }</label>
                  <select className='form-control' onChange={this.handleSelectState} value={this.state.state}>
                    <option value=''>{ t`lanCommonLabelSelectState` }</option>
                    <option value='Telangana' >Telangana</option>
                    <option value='Andhra Pradesh' >Andhra Pradesh</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelCountry` }</label>
                  <select className='form-control' defaultValue={this.state.country}>
                    {/* <option>{ t`lanCommonLabelSelectCountry` }</option> */}
                    <option value='India' >India</option>
                  </select>
                </div>
              </div>
              <div className='col-md-6 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelAddress` }<span className='madatory'>*</span></label>
                  <textarea className='form-control textarea' name='address' minLength='3' maxLength='80' value={this.state.address} onChange={() => this.setState({ address: event.target.value, errorMessage:'' })} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='container'>
                <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
              </div>
            </div>
            <div className='row'>
              <div className='update ml-auto mr-auto'>
                <button disabled={this.state.buttonDisabled} className='btn btn-primary btn-round' onClick={this.handleCreateUser}>{ t`lanCommonButtonCreate` }</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
ADHostUserCreateComponent.propTypes = {
  handleUserCreatedData: PropTypes.any,
  toastFunc: PropTypes.any
}

export default ADHostUserCreateComponent
