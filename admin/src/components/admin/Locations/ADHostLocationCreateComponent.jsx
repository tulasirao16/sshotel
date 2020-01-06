/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ADHostLocationCreateComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      locationList: JSON.parse(localStorage.getItem('locationList')),
      address: '',
      city: '',
      state: 'Telangana',
      area: '',
      landmark: '',
      country: 'India',
      longitude: '',
      latitude: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      email: '',
      locationStatus: 'Active',
      spServiceProvider: '',
      ownerName: '',
      errorMessage: '',
      errorClass: false,
      zip: '',
      buttonDisabled: false
    }
    this.handleCurrentLocation = this.handleCurrentLocation.bind(this)
    this.handleSubmitLocationDetails = this.handleSubmitLocationDetails.bind(this)
    this.handleMobileNumKeys = this.handleMobileNumKeys.bind(this)
  }
  componentWillMount () {
    this.setState({ errorClass:'label-control text-danger' })
    let hostData = JSON.parse(localStorage.getItem('hostData'))
    this.setState({
      hostData : hostData,
      ownerName: hostData.contactPerson,
      mobileNumber: hostData.contactNumber,
      alternateMobileNumber: hostData.alternateMobileNumber ? hostData.alternateMobileNumber : '',
      email: hostData.contactEmail,
      spServiceProvider: hostData.serviceProvider,
      spServiceProviderId: hostData._id
      // spServiceProvider: locationList.spServiceProvider
    })
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
              if (value.types.indexOf('country') !== -1) {
                _this.setState({ country: value.long_name })
              }
            })
          } else {
            ToastsStore.warning('Not Getting Location.Please Enter Manually')
          }
        })
      },
    (error) => this.setState({ errorMessage: error.message }),
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

  handleSubmitLocationDetails () {
    // let locationList = JSON.parse(localStorage.getItem('locationList'))
    // this.setState({
    //   spServiceProviderId: locationList.spServiceProviderId,
    //   spServiceProvider: locationList.spServiceProvider
    // })
    const emailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/
    const phValidation = /^((\(\d{3}\))|\d{3,4})(\-|\s)?(\d{3})(\-|\s)?(\d{1,4})(\-|\s)?(\d{1,3})$/
    if (!this.state.address.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAdressRequired` })
    } else if (!this.state.area.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAreaRequired` })
    } else if (!this.state.zip) {
      this.setState({ errorMessage: t`lanSPLabelErrorPinCodeRequired` })
    } else if (!this.state.locationStatus) {
      this.setState({ errorMessage: t`lanSPLabelErrorStatusIsRequired` })
    } else if (!this.state.city.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorCityRequired` })
    } else if (!this.state.state) {
      this.setState({ errorMessage: t`lanSPLabelErrorSateRequired` })
    } else if (!this.state.country) {
      this.setState({ errorMessage: t`lanSPLabelErrorCountryRequired` })
    } else if (!this.state.latitude.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorLatitudeRequired` })
    } else if (!this.state.longitude.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorLongitudeRequired` })
    } else if (!this.state.ownerName.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorContactPersonRequired` })
    } else if (!this.state.mobileNumber.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired` })
    } else if (!phValidation.test(this.state.mobileNumber)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber` })
    } else if (this.state.alternateMobileNumber && !phValidation.test(this.state.alternateMobileNumber)) {
      this.setState({ errorMessage: t`lanCommonLabelErrorInvalidAlternateMobileNumber` })
    } else if (!this.state.email.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorEmailRequired` })
    } else if (!emailValidation.test(this.state.email)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else {
      let postLocData = {
        'spServiceProviderId':this.state.spServiceProviderId,
        'spServiceProvider':this.state.spServiceProvider,
        'address': this.state.address,
        'area': this.state.area,
        'zip': this.state.zip,
        'city': this.state.city,
        'state': this.state.state,
        'landmark': this.state.landmark,
        'country': this.state.country,
        'contactPerson': this.state.ownerName,
        'mobileNumber': this.state.mobileNumber,
        'alternateMobileNumber': this.state.alternateMobileNumber,
        'email': this.state.email,
        'latitude': this.state.latitude,
        'longitude': this.state.longitude,
        'locationStatus': this.state.locationStatus
      }
      this.setState({ buttonDisabled:true })
      let obj = { url: config.baseUrl + config.postADHostlocationCreateAPI, body: postLocData }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          ToastsStore.success('Location Created Successfully')
          setTimeout(() => {
            hashHistory.push('/admin/host/location-list')
          }, 2000)
        } else {
          ToastsStore.error('Location Create Failed')
          setTimeout(() => {
            this.setState({ buttonDisabled:false })
          }, 3000)
        }
      })
    }
  }

  handleMobileNumKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
      event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
      (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }

  render () {
    return (
      <div>
        {/* ---------- Header Starts ------------- */}
        {/* ---------- Header Ends ------------- */}
        <div className='container-fluid mt--6 mb-4'>
          <div className='row create-locations'>
            <div className='col-lg-12 col-md-12'>
              <div className='card border-0 mb-0'>
                <div className='sp-hotels'>
                  <div className='card mb-0'>
                    {/* Card body */}
                    <div className='card-body'>
                      <div className='row align-items-center'>
                        <div className='col-auto'>
                          {/* Avatar */}
                          {/* <a className='rounded-circle'>
                            <img src={require('../images/room1.jpg')} className='avatar rounded-circle' />
                          </a> */}
                        </div>
                        <div className='col ml--2'>
                          <h4 className='card-title mb-2'>
                            {this.state.spServiceProvider}
                          </h4>
                          <p className='text-sm mb-0'>{this.state.ownerName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-header bg-transparent pb-3'>
                  <div className='row'>
                    <div className='col-md-6 col-5'>
                      <h5 className='card-title'>{ t`lanSPTitleLocationCreate` }</h5>
                    </div>
                    <div className='col-md-6 col-5 text-right'>
                      <a onClick={this.handleCurrentLocation} className='btn btn-primary text-white'><i className='fas fa-map-marker-alt' /> { t`lanSPButtonCurrentLocation` }</a>
                    </div>
                  </div>
                </div>
                <div className='card-body px-lg-4 py-lg-4'>
                  <form role='form'>
                    <div className='row'>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelAddress` }<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='address' maxLength='80'
                            onChange={() => this.setState({ address: event.target.value, errorMessage: '' })} value={this.state.address} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelArea` }<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='area' maxLength='20' onChange={() => this.setState({ area: event.target.value, errorMessage: '' })} value={this.state.area} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelLandmark` }</label>
                          <input type='text' className='form-control' id='landmark' maxLength='30'
                            onChange={() => this.setState({ landmark: event.target.value, errorMessage: '' })} value={this.state.landmark} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelZip` }<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='zip' maxLength='6' onKeyPress={this.handleMobileNumKeys}
                            onChange={() => this.setState({ zip: event.target.value, errorMessage: '' })} value={this.state.zip} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelStatus` }<span style={{ color: 'red' }}>*</span></label>
                          <select className='form-control' id='locationStatus' value={this.state.locationStatus} onChange={() => this.setState({ locationStatus: event.target.value, errorMessage: '' })}>
                            <option value='Active'>Active</option>
                            <option value='Inactive'>Inactive</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelCity` }<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='city' maxLength='20'
                            onChange={() => this.setState({ city: event.target.value, errorMessage: '' })} value={this.state.city} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelState` }<span style={{ color: 'red' }}>*</span></label>
                          <select className='form-control' id='state' onChange={() => this.setState({ state: event.target.value, errorMessage: '' })} value={this.state.state}>
                            <option value='Telangana'>Telangana</option>
                            <option value='Andhra Pradesh'>Andhra Pradesh</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelCountry` }<span style={{ color: 'red' }}>*</span></label>
                          <select className='form-control' id='country' onChange={() => this.setState({ country: event.target.value, errorMessage: '' })} value={this.state.country} >
                            <option>India</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelLatitude` }<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='latitude' maxLength='13'
                            onChange={() => this.setState({ latitude: event.target.value, errorMessage: '' })} value={this.state.latitude} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelLongitude` }<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='longitude' maxLength='13'
                            onChange={() => this.setState({ longitude: event.target.value, errorMessage: '' })} value={this.state.longitude} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelContactPerson` }<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='contactPerson' maxLength='20'
                            onChange={() => this.setState({ ownerName: event.target.value, errorMessage: '' })} value={this.state.ownerName} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelMobileNumber`}<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='mobileNumber' maxLength='10'
                            onChange={() => this.setState({ mobileNumber: event.target.value, errorMessage: '' })} value={this.state.mobileNumber} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelAlternateMobileNumber`}</label>
                          <input type='text' className='form-control' id='alternateMobileNumber' maxLength='10'
                            onChange={() => this.setState({ alternateMobileNumber: event.target.value, errorMessage: '' })} value={this.state.alternateMobileNumber} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelEmail`}<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='email'
                            onChange={() => this.setState({ email: event.target.value, errorMessage: '' })} maxLength='80' value={this.state.email} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='container-fluid'>
                        <label className={this.state.errorClass}>{this.state.errorMessage}</label>
                        {/* <label className='label-control'>{this.state.errorMessage}</label> */}
                      </div>
                    </div>
                    <div>
                      <small><span style={{ color: 'red' }}>Note :</span> <b>{t`lanSPMessageIfNotMapped`}</b></small>
                      <div className='text-center'>
                        <button type='button' disabled={this.state.buttonDisabled} className='btn btn-primary mt-2' onClick={this.handleSubmitLocationDetails}>{t`lanCommonButtonCreate`}</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ADHostLocationCreateComponent
