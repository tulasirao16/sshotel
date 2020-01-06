
/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import { hashHistory } from 'react-router'
// import { RadioGroup, RadioButton } from 'react-radio-buttons'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPPropertyLocationCreate extends React.Component {
  constructor (props) {
    super(props)
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    let mobileNumber = authObj ? authObj.mobileNumber : ''
    let alternateMobileNumber = authObj ? authObj.alternateMobileNumber : ''
    let email = authObj ? authObj.email : ''
    let spServiceProvider = authObj ? authObj.spServiceProvider : ''
    let contactPerson = authObj ? authObj.spServiceProviderId.contactPerson : ''
    this.state = {
      authObj: authObj,
      locationId: props.spLocationObj && props.spLocationObj._id ? props.spLocationObj._id : '',
      address: props.spLocationObj && props.spLocationObj.address ? props.spLocationObj.address : '',
      city: props.spLocationObj && props.spLocationObj.city ? props.spLocationObj.city : '',
      state: props.spLocationObj && props.spLocationObj.state ? props.spLocationObj.state : 'Telangana',
      area: props.spLocationObj && props.spLocationObj.area ? props.spLocationObj.area : '',
      zip: props.spLocationObj && props.spLocationObj.zip ? props.spLocationObj.zip : '',
      landmark: props.spLocationObj && props.spLocationObj.landmark ? props.spLocationObj.landmark : '',
      country: props.spLocationObj && props.spLocationObj.country ? props.spLocationObj.country : 'India',
      longitude: props.spLocationObj && props.spLocationObj.longitude ? props.spLocationObj.longitude : '',
      latitude: props.spLocationObj && props.spLocationObj.latitude ? props.spLocationObj.latitude : '',
      mobileNumber: props.spLocationObj && props.spLocationObj.mobileNumber ? props.spLocationObj.mobileNumber : mobileNumber,
      alternateMobileNumber: props.spLocationObj && props.spLocationObj.alternateMobileNumber ? props.spLocationObj.alternateMobileNumber : alternateMobileNumber,
      email: props.spLocationObj && props.spLocationObj.email ? props.spLocationObj.email : email,
      locationStatus: props.spLocationObj && props.spLocationObj.locationStatus ? props.spLocationObj.locationStatus : 'Active',
      spServiceProvider: props.spLocationObj && props.spLocationObj.spServiceProvider ? props.spLocationObj.spServiceProvider : spServiceProvider,
      contactPerson: props.spLocationObj && props.spLocationObj.contactPerson ? props.spLocationObj.contactPerson : contactPerson,
      locationValue: props.spLocationObj && props.spLocationObj.locationValue ? props.spLocationObj.locationValue : 'Create',
      locationItemIndex: -1,
      spLocationsList: [],
      errorMessage: '',
      errorClass: false
    }
    this.handleCurrentLocation = this.handleCurrentLocation.bind(this)
    this.handleSubmitLocationDetails = this.handleSubmitLocationDetails.bind(this)
    this.handleLocations = this.handleLocations.bind(this)
    this.handleLocationChange = this.handleLocationChange.bind(this)
  }
  componentWillMount () {
    this.setState({ errorClass:'label-control text-danger' })
    let obj = {
      url: config.baseUrl + config.getSPPropertyLocationsListAPI
    }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ spLocationsList: resObj.data.statusResult })
        let index = resObj.data.statusResult.map(function (e) { return e._id }).indexOf(_this.state.locationId)
        _this.setState({ locationItemIndex: index })
      } else {
        _this.setState({ spLocationsList: [] })
      }
    })
    // if (this.state.locationValue === 'Select Locations List') {
    //   // alert(this.state.locationId)
    //   let index = this.state.spLocationsList && this.state.spLocationsList.length > 0 ? this.state.spLocationsList.map(function (e) { return e._id }).indexOf(this.state.locationId) : -1
    //   alert(index)
    //   this.setState({ locationItemIndex: index })
    // } else {
    // }
  }
  handleMobileNumKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
      event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
      (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }
  handleMobileNumLatLangKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 && event.charCode !== 46 &&
      event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
      (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
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
                _this.setState({ area: value.long_name })
              }
              if (value.types.indexOf('postal_code') !== -1) {
                _this.setState({ zip: value.long_name })
              }
              if (value.types.indexOf('country') !== -1) {
                _this.setState({ country: value.long_name })
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

  handleBack () {
    hashHistory.push('/host/locations')
  }

  handleLocations (event) {
    this.setState({
      locationId: '',
      address: '',
      city: '',
      state: 'Telangana',
      area: '',
      landmark: '',
      zip: '',
      country: 'India',
      longitude: '',
      latitude: '',
      locationStatus: 'Active',
      contactPerson: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      email: '',
      areaLocality: '',
      errorMessage: ''
    })
    if (event.target.value === 'Select Locations List') {
      this.setState({
        locationValue: event.target.value,
        locationItemIndex: -1
      })
    } else {
      let authObj = JSON.parse(localStorage.getItem('authObj'))
      if (authObj && authObj.userAccount) {
        this.setState({
          locationValue: event.target.value,
          authObj: authObj,
          contactPerson: authObj.spServiceProviderId.contactPerson,
          mobileNumber: authObj.mobileNumber,
          alternateMobileNumber: authObj.alternateMobileNumber,
          email: authObj.email,
          spServiceProvider: authObj.spServiceProvider
        })
      }
    }
  }
  handleLocationChange (event) {
    if (event.target.value === '') {
      this.setState({
        locationItemIndex: -1,
        locationId: '',
        address: '',
        city: '',
        state: 'Telangana',
        area: '',
        landmark: '',
        zip: '',
        country: 'India',
        longitude: '',
        latitude: '',
        locationStatus: 'Active',
        contactPerson: '',
        mobileNumber: '',
        alternateMobileNumber: '',
        email: '',
        areaLocality: '',
        errorMessage: ''
      })
    } else {
      let index = event.target.value
      let item = this.state.spLocationsList[event.target.value]
      this.setState({
        locationItemIndex: index,
        locationId: item._id,
        address: item.address,
        city: item.city,
        state: item.state,
        area: item.area,
        landmark: item.landmark ? item.landmark : '',
        zip: item.zip,
        country: item.country,
        longitude: item.longitude,
        latitude: item.latitude,
        locationStatus: item.locationStatus,
        contactPerson: item.contactPerson,
        mobileNumber: item.mobileNumber,
        alternateMobileNumber: item.alternateMobileNumber ? item.alternateMobileNumber : '',
        email: item.email,
        areaLocality: item.areaLocality ? item.areaLocality : '',
        errorMessage: ''
      })
    }
  }
  handleGetLatLong = () => {
    this.setState({ errorMessage: '' })
    let addressLocation = this.state.address + ',' + this.state.area + '/' + this.state.city + ',' + this.state.state + ',' + this.state.zip
    let _this = this
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + addressLocation + ',IN&key=' + config.googleMapsAPIKey)
      .then((response) => response.json())
      .then((responseJson) => {
        _this.setState({
          latitude: (responseJson.results && responseJson.results.length > 0) ? responseJson.results[0].geometry.location.lat : '',
          longitude: (responseJson.results && responseJson.results.length > 0) ? responseJson.results[0].geometry.location.lng : ''
        })
      })
  }
  handleSubmitLocationDetails () {
    const emailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/
    const phValidation = /^((\(\d{3}\))|\d{3,4})(\-|\s)?(\d{3})(\-|\s)?(\d{1,4})(\-|\s)?(\d{1,3})$/
    if (!this.state.address.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAdressRequired` })
    } else if (!this.state.area.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAreaRequired` })
    } else if (!this.state.zip) {
      this.setState({ errorMessage: t`lanSPLabelErrorPinCodeRequired` })
    } else if (!this.state.locationStatus) {
      this.setState({ errorMessage: 'Status is required' })
    } else if (!this.state.city.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorCityRequired` })
    } else if (!this.state.state) {
      this.setState({ errorMessage: t`lanSPLabelErrorSateRequired` })
    } else if (!this.state.country) {
      this.setState({ errorMessage: 'Country is required' })
    } else if (!this.state.latitude) {
      this.setState({ errorMessage: 'Latitude is required' })
    } else if (!this.state.longitude) {
      this.setState({ errorMessage: 'Longitude is required' })
    } else if (!this.state.contactPerson.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorContactPersonRequired` })
    } else if (!this.state.mobileNumber) {
      this.setState({ errorMessage:  t`lanSPLabelErrorMobileNumberRequired` })
    } else if (!phValidation.test(this.state.mobileNumber)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber` })
    } else if (this.state.alternateMobileNumber && !phValidation.test(this.state.alternateMobileNumber)) {
      this.setState({ errorMessage: t`lanCommonLabelErrorInvalidAlternateMobileNumber` })
    } else if (!this.state.email.trim()) {
      this.setState({ errorMessage:  t`lanSPLabelErrorEmailRequired` })
    } else if (!emailValidation.test(this.state.email)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else {
      let postLocData = {
        '_id': this.state.locationId,
        'address': this.state.address,
        'area': this.state.area,
        'zip': this.state.zip,
        'city': this.state.city,
        'state': this.state.state,
        'landmark': this.state.landmark,
        'country': this.state.country,
        'contactPerson': this.state.contactPerson,
        'mobileNumber': this.state.mobileNumber,
        'alternateMobileNumber': this.state.alternateMobileNumber,
        'email': this.state.email,
        'latitude': this.state.latitude,
        'longitude': this.state.longitude,
        'locationStatus': this.state.locationStatus,
        'locationValue': this.state.locationValue
      }
      this.props.commonFunction(postLocData, 'locationObj')
      this.setState({ errorClass:'text-success' })
      this.setState({ errorMessage: t`lanSPSuccessPropertyLocationCreated` })
    }
  }

  render () {
    return (
      <div>
        <form role='form'>
          <div className='row'>
            <div className='col-md-6 room-catageory'>
              <div className='form-group'>
                <div className='custom-control custom-radio'>
                  <input value='Create' type='radio' checked={this.state.locationValue === 'Create'}
                    onChange={this.handleLocations} />
                  <label>{t`lanSPButtonCreateLocation`}</label>
                </div>
                <div className='custom-control custom-radio'>
                  <input value='Select Locations List' type='radio' checked={this.state.locationValue === 'Select Locations List'} onChange={this.handleLocations} />
                  <label>{t`lanSPLabelSelectLocationsList`}</label>
                </div>
              </div>
            </div>
            <div className='col-md-6 text-right'>
              <a onClick={this.handleCurrentLocation} className='btn btn-success text-white'><i className='fas fa-map-marker-alt' /> {''} {t`lanSPButtonCurrentLocation`}</a>
            </div>
          </div>
          {this.state.locationValue === 'Select Locations List'
            ? <div className='row'>
              <div className='col-md-4'>
                <div className='form-group'>
                  <select className='form-control' value={this.state.locationItemIndex} onChange={this.handleLocationChange}>
                    <option value=''>{t`lanSPLabelSelectLocation`}</option>
                    {this.state.spLocationsList && this.state.spLocationsList.length > 0 ? this.state.spLocationsList.map((item, i) =>
                      <option value={i} key={i}>{item.address}</option>
                    ) : null}
                  </select>
                </div>
              </div>
            </div> : null}
          <div className='row'>
            <div className='col-md-4'>
              <div className='form-group'>
                <label className='form-control-label'>{t`lanCommonLabelAddress`}<span style={{ color: 'red' }}>*</span></label>
                <input type='text' className='form-control' id='address' maxLength='80'
                  onChange={() => this.setState({ address: event.target.value, errorMessage: '' })} value={this.state.address} />
              </div>
            </div>
            <div className='col-md-4'>
              <div className='form-group'>
                <label className='form-control-label'>{t`lanCommonLabelArea`}<span style={{ color: 'red' }}>*</span></label>
                <input type='text' className='form-control' id='area' maxLength='20'
                  onChange={() => this.setState({ area: event.target.value, errorMessage: '' })} value={this.state.area} />
              </div>
            </div>
            <div className='col-md-4'>
              <div className='form-group'>
                <label className='form-control-label'>{t`lanCommonLabelLandmark`}</label>
                <input type='text' className='form-control' id='landmark' maxLength='30'
                  onChange={() => this.setState({ landmark: event.target.value, errorMessage: '' })} value={this.state.landmark} />
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-4'>
              <div className='form-group'>
                <label className='form-control-label'>{t`lanCommonLabelZip`}<span style={{ color: 'red' }}>*</span></label>
                <input type='text' className='form-control' id='zip' maxLength='6'
                  onChange={() => this.setState({ zip: event.target.value, errorMessage: '' })} value={this.state.zip} onKeyPress={this.handleMobileNumKeys} />
              </div>
            </div>
            <div className='col-md-4'>
              <div className='form-group'>
                <label className='form-control-label'>{t`lanCommonLabelStatus`}<span style={{ color: 'red' }}>*</span></label>
                <select className='form-control' id='locationStatus' value={this.state.locationStatus} onChange={() => this.setState({ locationStatus: event.target.value, errorMessage: '' })}>
                  <option value='Active'>Active</option>
                  <option value='Inactive'>Inactive</option>
                </select>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='form-group'>
                <label className='form-control-label'>{t`lanCommonLabelCity`}<span style={{ color: 'red' }}>*</span></label>
                <input type='text' className='form-control' id='city' maxLength='20'
                  onChange={() => this.setState({ city: event.target.value, errorMessage: '' })} value={this.state.city} />
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-4'>
              <div className='form-group'>
                <label className='form-control-label'>{t`lanCommonLabelState`}<span style={{ color: 'red' }}>*</span></label>
                <select className='form-control' id='state' onChange={() => this.setState({ state: event.target.value, errorMessage: '' })} value={this.state.state}>
                  <option value='Telangana'>Telangana</option>
                  <option value='Andhra Pradesh'>Andhra Pradesh</option>
                </select>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='form-group'>
                <label className='form-control-label'>{t`lanCommonLabelCountry`}<span style={{ color: 'red' }}>*</span></label>
                <select className='form-control' id='country' onChange={() => this.setState({ country: event.target.value, errorMessage: '' })} value={this.state.country} >
                  <option>India</option>
                </select>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='form-group'>
                <div className='get-latitde'>
                  <a onClick={this.handleGetLatLong}><small style={{ color: 'red' }}>Get Lat & Long</small></a>
                </div>
                <label className='form-control-label'>{t`lanCommonLabelLatitude`}<span style={{ color: 'red' }}>*</span></label>
                <input type='text' className='form-control' id='latitude' maxLength='13'
                  onChange={() => this.setState({ latitude: event.target.value, errorMessage: '' })} value={this.state.latitude} onKeyPress={this.handleMobileNumLatLangKeys} />
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-4'>
              <div className='form-group'>
                <label className='form-control-label'>{t`lanCommonLabelLongitude`}<span style={{ color: 'red' }}>*</span></label>
                <input type='text' className='form-control' id='longitude' maxLength='13'
                  onChange={() => this.setState({ longitude: event.target.value, errorMessage: '' })} value={this.state.longitude} onKeyPress={this.handleMobileNumLatLangKeys} />
              </div>
            </div>
            <div className='col-md-4'>
              <div className='form-group'>
                <label className='form-control-label'>{t`lanCommonLabelContactPerson`}<span style={{ color: 'red' }}>*</span></label>
                <input type='text' className='form-control' id='contactPerson' maxLength='20'
                  onChange={() => this.setState({ contactPerson: event.target.value, errorMessage: '' })} value={this.state.contactPerson} />
              </div>
            </div>
            <div className='col-md-4'>
              <div className='form-group'>
                <label className='form-control-label'>{t`lanCommonLabelMobileNumber`}<span style={{ color: 'red' }}>*</span></label>
                <input type='text' className='form-control' id='mobileNumber' maxLength='10'
                  onChange={() => this.setState({ mobileNumber: event.target.value, errorMessage: '' })} value={this.state.mobileNumber} onKeyPress={this.handleMobileNumKeys} />
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-4'>
              <div className='form-group'>
                <label className='form-control-label'>{t`lanCommonLabelAlternateMobileNumber`}</label>
                <input type='text' className='form-control' id='alternateMobileNumber' maxLength='10'
                  onChange={() => this.setState({ alternateMobileNumber: event.target.value, errorMessage: '' })} value={this.state.alternateMobileNumber} onKeyPress={this.handleMobileNumKeys} />
              </div>
            </div>
            <div className='col-md-4'>
              <div className='form-group'>
                <label className='form-control-label'>{t`lanCommonLabelEmail`}<span style={{ color: 'red' }}>*</span></label>
                <input type='text' className='form-control' id='email'
                  onChange={() => this.setState({ email: event.target.value, errorMessage: '' })} maxLength='80' value={this.state.email} />
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='container'>
              <div className='text-center'><label className={this.state.errorClass}>{this.state.errorMessage}</label></div>
              {/* <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label> */}
            </div>
          </div>
          <div>
            <small><span style={{ color: 'red' }}>Note :</span> <b>{t`lanSPMessageIfNotMapped`}</b></small>
            <div className='text-center'>
              <button type='button' className='btn btn-primary' onClick={this.handleSubmitLocationDetails}>{t`lanCommonButtonCreate`}</button>
            </div>
          </div>
        </form>
        {/* <div className='header bg-primary pb-6'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleLocationCreate`}</h6>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  <a onClick={this.handleCurrentLocation} className='btn btn-sm btn-neutral'><i className='fas fa-map-marker-alt' />{t`lanSPButtonCurrentLocation`}</a>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* <div className='container mt--6 mb-4'>
          <div className='row justify-content-center'>
            <div className='col-lg-12 col-md-12'>
              <div className='card border-0 mb-0'>
                <div className='card-header bg-transparent pb-3'>
                  <h5 className='card-title'>{t`lanSPTitleLocationCreate`}</h5>
                </div>
                <div className='card-body px-lg-4 py-lg-4'>

                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    )
  }
}

SPPropertyLocationCreate.propTypes = {
  commonFunction: PropTypes.any,
  spLocationObj: PropTypes.any
}
export default SPPropertyLocationCreate
