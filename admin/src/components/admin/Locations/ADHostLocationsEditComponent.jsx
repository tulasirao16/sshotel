/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'

import { hashHistory } from 'react-router'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import { t } from 'ttag'

import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import './css/location.css'

class ADHostLocationsEditComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hostData: JSON.parse(localStorage.getItem('hostData')),
      _id: '',
      address: '',
      city: '',
      state: 'Telangana',
      area: '',
      zip: '',
      landmark: '',
      country: 'India',
      longitude: '',
      latitude: '',
      ownerName: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      email: '',
      locationStatus: 'Active',
      spServiceProvider: '',
      errorMessage: '',
      buttonDisabled: false

    }
    this.handleCurrentLocation = this.handleCurrentLocation.bind(this)
    this.handleUpdateLocationDetails = this.handleUpdateLocationDetails.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }

  componentWillMount () {
    let hostData = JSON.parse(localStorage.getItem('hostData'))
    let locationList = JSON.parse(localStorage.getItem('locationList'))
    if (hostData && hostData._id && locationList && locationList._id) {
      this.setState({
        hostData: hostData,
        spServiceProvider: hostData.serviceProvider,
        ownerName: hostData.contactPerson,
        _id: locationList._id,
        address: locationList.address,
        area: locationList.area,
        landmark: locationList.landmark,
        zip: locationList.zip,
        city: locationList.city,
        state: locationList.state,
        country: locationList.country,
        locationStatus: locationList.locationStatus,
        longitude: locationList.longitude.toString(),
        latitude: locationList.latitude.toString(),
        contactPerson: locationList.ownerName,
        mobileNumber: locationList.mobileNumber,
        email: locationList.email,
        alternateMobileNumber: locationList.alternateMobileNumber
      })
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
        let isArea = false
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
        console.log('Create Location ERROR:', error)
        callback({ statusCode: '9999', result: {} })
      })
  }
  handleMobileNumKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
      event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
      (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }
  handleUpdateLocationDetails () {
    let locationList = JSON.parse(localStorage.getItem('locationList'))
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
    } else if (!this.state.mobileNumber) {
      this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired` })
    } else if (!phValidation.test(this.state.mobileNumber)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber` })
    } else if (this.state.alternatemobileNumber && !phValidation.test(this.state.alternatemobileNumber)) {
      this.setState({ errorMessage: t`lanCommonLabelErrorInvalidAlternateMobileNumber` })
    } else if (!this.state.email.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorEmailRequired` })
    } else if (!emailValidation.test(this.state.email)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else {
      this.setState({ buttonDisabled: true })
      let putLocData = {
        _id: this.state._id,
        address: this.state.address,
        area: this.state.area,
        zip: this.state.zip,
        city: this.state.city,
        state: this.state.state,
        landmark: this.state.landmark,
        country: this.state.country,
        contactPerson: this.state.ownerName,
        mobileNumber: this.state.mobileNumber,
        alternateMobileNumber: this.state.alternateMobileNumber,
        email: this.state.email,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        locationStatus: this.state.locationStatus
      }
      let obj = { url: config.baseUrl + config.putADHostlocationUpdateAPI + locationList._id, body: putLocData }
      let _this = this
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          ToastsStore.success('Location Updated Successfully')
          setTimeout(() => {
            hashHistory.push('/admin/host/location-list')
          }, 2000)
        } else {
          ToastsStore.error('Location update Failed')
          setTimeout(() => {
            _this.setState({ buttonDisabled: false })
          }, 5000)
        }
      })
    }
  }
  handleHome () {
    hashHistory.push('/host/home')
    event.preventDefault()
  }
  render () {
    return (
      <div>
        {/* ---------- Header Ends ------------- */}
        <div className='container-fluid mt--6 mb-4'>
          <div className='row justify-content-center'>
            <div className='col-lg-12 col-md-12'>
              <div className='card border-0 mb-0'>
                <div className='sp-hotels'>
                  <div className='card mb-0'>
                    {/* Card body */}
                    <div className='card-body p-2'>
                      <div className='row align-items-center'>
                        <div className='col-auto'>
                          {/* <a href='#' className='rounded-circle'>
                            <img src={require('../images/room1.jpg')} className='avatar rounded-circle' />
                          </a> */}
                        </div>
                        <div className='col ml--2'>
                          <h4 className='card-title mb-0'>
                            {this.state.spServiceProvider}
                          </h4>
                          <b className='text-sm mb-0 text-white'>{this.state.ownerName}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-header bg-transparent pb-3'>
                  <div className='row'>
                    <div className='col-lg-6 col-5'>
                      <h5 className='card-title'>{ t`lanSPTitleLocationEdit` }</h5>
                    </div>
                    <div className='col-lg-6 col-5 text-right'>
                      <a onClick={this.handleCurrentLocation} className='btn btn-primary text-white'><i className='fas fa-map-marker-alt' /> { t`lanSPButtonGetLocation` }</a>
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
                            onChange={(event) => this.setState({ address: event.target.value, errorMessage: '' })} value={this.state.address} />
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
                            onChange={() => this.setState({ latitude: event.target.value, errorMessage: '' })} value={this.state.latitude} onKeyPress={this.handleMobileNumKeys} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelLongitude` }<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='longitude' maxLength='13'
                            onChange={() => this.setState({ longitude: event.target.value, errorMessage: '' })} value={this.state.longitude} onKeyPress={this.handleMobileNumKeys} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelContactPerson` }<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' maxLength='20' id='contactPerson'
                            onChange={() => this.setState({ ownerName: event.target.value, errorMessage: '' })} value={this.state.ownerName} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelMobileNumber`}<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='mobileNumber' maxLength='10'
                            onChange={() => this.setState({ mobileNumber: event.target.value, errorMessage: '' })} value={this.state.mobileNumber} onKeyPress={this.handleMobileNumKeys} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelAlternateMobileNumber`}</label>
                          <input type='text' className='form-control' id='alternateMobileNumber' maxLength='10'
                            onChange={() => this.setState({ alternateMobileNumber: event.target.value, errorMessage: '' })} value={this.state.alternateMobileNumber} onKeyPress={this.handleMobileNumKeys} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelEmail`}<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='email' maxLength='80'
                            onChange={() => this.setState({ email: event.target.value, errorMessage: '' })} value={this.state.email} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='container-fluid'>
                        <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                      </div>
                    </div>
                    <div>
                      <small><span style={{ color: 'red' }}>Note :</span> <b>If not Mapped, Type the Address Manually</b></small>
                      <div className='text-center'>
                        <button type='button' disabled={this.state.buttonDisabled} className='btn btn-primary mt-2' onClick={this.handleUpdateLocationDetails}>Update</button>
                      </div>
                    </div>
                  </form>
                </div>
                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ADHostLocationsEditComponent
