/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */
import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import 'react-drawer/lib/react-drawer.css'
// import DatePicker from 'react-datepicker'
// import moment from 'moment'
import APICallManager from '../../../services/callmanager'

import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ADHostsCreateHostComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      businessName: '',
      contactPerson: '',
      mobileNumber: '',
      email: '',
      password: '',
      userStatus: 'Active',
      area: '',
      landmark: '',
      city: '',
      zip: '',
      state: '',
      address: '',
      areaLocality :'',
      buttonDisabled: false,
      appPercentage: 0
    }

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

  handleSelectUserStatus () {
    this.setState({
      userStatus: event.target.value,
      errorMessage: ''
    })
  }
  handleCreateUser () {
    const emailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/
    const phValidation = /^\d{10}$/
    if (!this.state.businessName.trim()) {
      this.setState({ errorMessage: 'Business Name is required' })
    } else if (!this.state.contactPerson.trim()) {
      this.setState({ errorMessage: 'Contact Person is required' })
    } else if (!this.state.password) {
      this.setState({ errorMessage: t`lanSPLabelErrorPasswordRequired` })
    } else if (this.state.password && this.state.password.length < 6) {
      this.setState({ errorMessage: t`lanSPLabelErrorPasswordMinLength` })
    } else if (!this.state.mobileNumber) {
      this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired` })
    } else if (!phValidation.test(this.state.mobileNumber)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber` })
    } else if (!this.state.email) {
      this.setState({ errorMessage: t`lanSPLabelErrorEmailRequired` })
    } else if (!emailValidation.test(this.state.email)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else if (!this.state.area.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAreaRequired` })
    } else if (!this.state.city.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorCityRequired` })
    } else if (!this.state.zip.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorPinCodeRequired` })
    } else if (!this.state.state) {
      this.setState({ errorMessage: t`lanSPLabelErrorSateRequired` })
    } else if (!this.state.address.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAdressRequired` })
    } else {
      this.setState({ buttonDisabled: true })
      var userData = {
        bussinessName: this.state.businessName,
        contactPerson: this.state.contactPerson,
        userID: this.state.mobileNumber,
        contactMobileNumber: this.state.mobileNumber,
        contactEmail: this.state.email,
        password: this.state.password,
        appPercentage: this.state.appPercentage,
        area: this.state.area,
        landmark: this.state.landmark,
        address: this.state.address,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        areaLocality: this.state.areaLocality,
        deviceToken: ''
      }
      let _this = this
      let obj = { url: config.baseUrl + config.postSPUserSignupAPI, body: userData }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          let data = {
            appPercentage: _this.state.appPercentage,
            contactAddress: resObj.data.statusResult.address,
            area: resObj.data.statusResult.area,
            areaLocality:resObj.data.statusResult.areaLocality,
            city: resObj.data.statusResult.city,
            createdAt: resObj.data.statusResult.createdAt,
            createdBy: resObj.data.statusResult.createdBy,
            createdOn: resObj.data.statusResult.createdOn,
            deviceNotifyToken: resObj.data.statusResult.deviceNotifyToken,
            contactPerson: resObj.data.statusResult.displayName,
            contactEmail: _this.state.email,
            emailVerifyStatus: resObj.data.statusResult.emailVerifyStatus,
            firstName: resObj.data.statusResult.firstName,
            isDeleted: resObj.data.statusResult.isDeleted,
            lastName: resObj.data.statusResult.lastName,
            mbnVerifyStatus: resObj.data.statusResult.mbnVerifyStatus,
            contactNumber: _this.state.mobileNumber,
            name: resObj.data.statusResult.name,
            password: resObj.data.statusResult.password,
            passwordSalt: resObj.data.statusResult.passwordSalt,
            preferences: resObj.data.statusResult.preferences,
            serviceProvider:resObj.data.statusResult.spServiceProvider,
            spServiceProviderId: resObj.data.statusResult.spServiceProviderId,
            state: resObj.data.statusResult.state,
            updatedAt: resObj.data.statusResult.updatedAt,
            updatedBy: resObj.data.statusResult.updatedBy,
            updatedOn: resObj.data.statusResult.updatedOn,
            userAccount: resObj.data.statusResult.userAccount,
            userRole: resObj.data.statusResult.userRole,
            status: resObj.data.statusResult.userStatus,
            userType: resObj.data.statusResult.userType,
            zip: resObj.data.statusResult.zip,
            _id: resObj.data.statusResult._id
          }
          ToastsStore.success(t`lanADHostsUserCreatedSuccessfully`)
          setTimeout(() => {
            hashHistory.push('/admin/hosts/')
          }, 2000)
        } else {
          _this.setState({ buttonDisabled: false })
          ToastsStore.error(t`lanADHostsUserCreatefailed`)
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
            ToastsStore.warning(t`lanADHostsNotGettingLocationPleaseEnterManually`)
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
        callback({ statusCode: '9999', result: {} })
      })
  }
  render () {
    return (
      <div className='user-create'>
        <div className='py-lg-4'>
          <div className='mb-3'><h3>{ t`lanADButtonHostsCreateHost` }</h3></div>
          <form>
            <div className='row'>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanSPLabelBusinessName` }<span className='madatory'>*</span></label>
                  <input type='text' className='form-control' name='businessName' minLength='3' maxLength='20' value={this.state.businessName}
                    onChange={() => this.setState({ businessName: event.target.value, errorMessage:'' })} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelContactPerson` }<span className='madatory'>*</span></label>
                  <input type='text' className='form-control' name='contactPerson' minLength='3' maxLength='20' value={this.state.contactPerson}
                    onChange={() => this.setState({ contactPerson: event.target.value, errorMessage:'' })} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelPassword` }<span className='madatory'>*</span></label>
                  <input type='password' className='form-control' name='password' minLength='6' maxLength='20' value={this.state.password}
                    onChange={() => this.setState({ password: event.target.value.replace(/\s/g, ''), errorMessage:'' })} />
                </div>
              </div>
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
            </div>
            <div className='row'>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelEmail` }<span className='madatory'>*</span></label>
                  <input type='text' className='form-control' name='email' minLength='3' maxLength='80' value={this.state.email} onChange={() => this.setState({ email: event.target.value, errorMessage:'' })} />
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
                  <label>App Percentage<span className='madatory'>*</span></label>
                  <input type='text' className='form-control' name='email' minLength='1' maxLength='2' value={this.state.appPercentage} onChange={() => this.setState({ appPercentage: event.target.value })} />
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
                  <label>{ t`lanCommonLabelArea` }<span className='madatory'>*</span></label>
                  <input type='text' className='form-control' name='area' minLength='3' maxLength='20' value={this.state.area} onChange={() => this.setState({ area: event.target.value, errorMessage:'' })} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelCity` }<span className='madatory'>*</span></label>
                  <input type='text' className='form-control' name='city' minLength='3' maxLength='20' value={this.state.city} onChange={() => this.setState({ city: event.target.value, errorMessage:'' })} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelZip` }<span className='madatory'>*</span></label>
                  <input type='text' className='form-control' maxLength='6' onKeyPress={this.handleMobileNumKeys} value={this.state.zip} onChange={() => this.setState({ zip: event.target.value, errorMessage:'' })} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanSPLabelAreaLocality` }</label>
                  <input type='text' className='form-control' name='areaLocality'
                    minLength='6' maxLength='30' value={this.state.areaLocality} onChange={() => this.setState({ areaLocality: event.target.value, errorMessage:'' })} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelLandmark` }</label>
                  <input type='text' className='form-control' name='landmark' minLength='3' maxLength='30' value={this.state.landmark} onChange={() => this.setState({ landmark: event.target.value, errorMessage:'' })} />
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelState` }<span className='madatory'>*</span></label>
                  <select className='form-control' onChange={this.handleSelectState} value={this.state.state}>
                    <option value=''>{ t`lanCommonLabelSelectState` }</option>
                    <option value='Telangana' >Telangana</option>
                    <option value='Andhra Pradesh' >Andhra Pradesh</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='row'>
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
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}
export default ADHostsCreateHostComponent
