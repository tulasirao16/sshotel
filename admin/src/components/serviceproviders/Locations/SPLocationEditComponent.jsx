/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { t } from 'ttag'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPLocationsEditComponent extends React.Component {
  constructor (props) {
    super(props)
    let data = this.props.spLocationObj
    this.state = {
      spLocationObj: this.props.spLocationObj ? this.props.spLocationObj : {},
      propertyId: this.props.propertyId ? this.props.propertyId : '',
      authObj: JSON.parse(localStorage.getItem('authObj')),
      _id: '',
      address: data && data.address ? data.address : '',
      city: data && data.city ? data.city : '',
      state: data && data.state ? data.state : 'Telangana',
      area: data && data.area ? data.area : '',
      zip: data && data.zip ? data.zip : '',
      landmark: data && data.landmark ? data.landmark : '',
      country: data && data.country ? data.country : 'India',
      longitude: data && data.longitude ? data.longitude.toString() : '',
      latitude: data && data.latitude ? data.latitude.toString() : '',
      ownerName: data && data.contactPerson ? data.contactPerson : '',
      mobileNumber: data && data.mobileNumber ? data.mobileNumber : '',
      alternateMobileNumber: data && data.alternateMobileNumber ? data.alternateMobileNumber : '',
      email: data && data.email ? data.email : '',
      locationStatus: 'Active',
      spServiceProvider: '',
      errorMessage: ''

    }
    this.handleCurrentLocation = this.handleCurrentLocation.bind(this)
    this.handleUpdateLocationDetails = this.handleUpdateLocationDetails.bind(this)
    this.handleHome = this.handleHome.bind(this)

  }

  componentWillMount () {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    let locationList = JSON.parse(localStorage.getItem('locationList'))
    this.setState({
      authObj: authObj,
      spServiceProvider: authObj.spServiceProvider,
      ownerName: authObj.spServiceProviderId.contactPerson,
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
  handleBack () {
    hashHistory.push('/host/locations')
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
            // alert('Not Getting Location.Please Enter Manually')
            toast.warn('Not Getting Location.Please Enter Manually', {
              position: toast.POSITION.TOP_CENTER
            });
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
        console.log('=== Create Location ERROR:', error)
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
      let obj = { url: config.baseUrl + config.putSPLocationUpdateAPI, body: putLocData }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          // hashHistory.push('/host/locations')
          toast.success('Location Updated Successfully', {
            position: toast.POSITION.TOP_CENTER
          });
          setTimeout(() => {
            hashHistory.push('/host/locations')
          }, 2000)
        } else {
          toast.error('Location update Failed', {
            position: toast.POSITION.TOP_CENTER
          });
         // alert('Location updated failed')
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
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a>{ t`lanSPTitleServiceLocations` }</a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBack}>{ t`lanSPTitleLocationsList` }</a></li>
                      <li className='breadcrumb-item'><a>{ t`lanSPTitleLocationEdit` }</a></li>
                    </ol>
                  </nav>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  {/* <a onClick={this.handleCurrentLocation} className='btn btn-neutral'><i className='fas fa-map-marker-alt' />{ t`lanSPButtonGetLocation` }</a> */}
                  {/* <a onClick={this.handleBack} className='btn btn-neutral'><i className='fas fa-chevron-left' />{ t`lanCommonButtonBack` }</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>{/* ---------- Header Ends ------------- */}
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
                        <button type='button' className='btn btn-primary mt-2' onClick={this.handleUpdateLocationDetails}>Update</button>
                        <ToastContainer rtl />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
SPLocationsEditComponent.propTypes = {
  spLocationObj: PropTypes.any,
  propertyId: PropTypes.any
}
export default SPLocationsEditComponent
