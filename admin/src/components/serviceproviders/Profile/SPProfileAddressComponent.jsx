/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import config from '../../../../public/config.json'
import { fetch as fetchPolyfill } from 'whatwg-fetch'
import axios from 'axios'
import { t } from 'ttag'
// import moment from 'moment'
import classnames from 'classnames'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const myApi = axios.create()

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPProfileAddressComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      address: '',
      area: '',
      landMark: '',
      city: '',
      stateOrg: '',
      state: '',
      countryOrg: '',
      country: '',
      zip: '',
      userAccount: '',
      dob: '',
      userIconPath: '',
      image: '',
      data: {},
      authObj: {},
      imgsrc: [],
      iconPath: '',
      iconOriginalName: '',
      userIcon: '',
      file: [],
      _id: '',
      errorMessage: '',
      activeProfileTitle: true
    }
    this.updateProfileAddressdetails = this.updateProfileAddressdetails.bind(this)
    this.handleUserProfile = this.handleUserProfile.bind(this)
    this.handleAddressDetails = this.handleAddressDetails.bind(this)
    this.handleIDProofs = this.handleIDProofs.bind(this)
    this.handlePreferences = this.handlePreferences.bind(this)
    this.handleBusinessInfo = this.handleBusinessInfo.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleLogOut = this.handleLogOut.bind(this)
    this.handleCurrentLocation = this.handleCurrentLocation.bind(this)
  }
  componentWillMount () {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    this.setState({
      authObj: authObj,
      firstName: authObj.firstName,
      lastName: authObj.lastName,
      displayName: authObj.displayName,
      mobileNumber: authObj.mobileNumber,
      email: authObj.email ? authObj.email : '',
      address: authObj.address ? authObj.address : '',
      area: authObj.area ? authObj.area : '',
      city: authObj.city ? authObj.city : '',
      state: authObj.state ? authObj.state : '',
      stateOrg: authObj.state ? authObj.state : '',
      countryOrg: authObj.country ? authObj.country : '',
      country: authObj.country ? authObj.country : '',
      zip: authObj.zip ? authObj.zip : '',
      dob: authObj.dob ? authObj.dob : '',
      landMark: authObj.landMark ? authObj.landMark : '',
      userAccount: authObj.userAccount,
      iconPath: authObj.userIconPath ? authObj.userIconPath : '',
      iconOriginalName: authObj.userIconOriginalName ? authObj.userIconOriginalName : '',
      spServiceProvider: authObj.spServiceProvider
    })
  }

  handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
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

  handleUserProfile () {
    hashHistory.push('/host/user/profile')
    event.preventDefault()
  }
  handleAddressDetails () {
    this.setState({ activeProfileTitle: true })
    hashHistory.push('/host/user/profile/address')
    event.preventDefault()
  }
  handleIDProofs () {
    hashHistory.push('/host/user/profile/idproof')
    event.preventDefault()
  }
  handlePreferences () {
    hashHistory.push('/host/user/profile/preferences')
    event.preventDefault()
  }
  handleBusinessInfo () {
    hashHistory.push('/host/user/profile/businessinfo')
    event.preventDefault()
  }
  handleChangePassword () {
    hashHistory.push('/host/user/profile/changepassword')
    event.preventDefault()
  }
  handleLogOut () {
    localStorage.clear()
    myApi.defaults.headers.token = null
    hashHistory.push('/host/signin')
  }
  handleMobileNumKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
      event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
      (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }
  updateProfileAddressdetails () {
    let newAuthObj = this.state.authObj
    if (!this.state.address.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAdressRequired` })
    } else if (!this.state.area.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAreaRequired` })
    } else if (!this.state.city.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorCityRequired` })
    } else if (!this.state.zip) {
      this.setState({ errorMessage: t`lanSPLabelErrorPinCodeRequired` })
    } else if (!this.state.country.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorCountryRequired` })
    } else if (!this.state.state.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorSateRequired` })
    } else {
      let DoB = this.state.dob // ? moment(this.state.dob, 'DD/MM/YYYY').format('YYYY-MM-DD') : ''
      const data = new FormData()
      data.append('profilefirstName', this.state.firstName)
      data.append('profilelastName', this.state.lastName)
      data.append('profiledisplayName', this.state.displayName)
      data.append('profileuserAccount', this.state.userAccount)
      data.append('profilemobileNumber', this.state.mobileNumber)
      data.append('profileemail', this.state.email)
      data.append('profilearea', this.state.area)
      data.append('profilecity', this.state.city)
      data.append('profilestate', this.state.state)
      data.append('profilezip', this.state.zip)
      data.append('profilecountry', this.state.country)
      data.append('profilelandMark', this.state.landMark)
      data.append('profileaddress', this.state.address)
      data.append('profiledob', DoB)
      data.append('serviceproviderImageFilePath', this.state.iconPath)
      data.append('serviceproviderImageFileName', this.state.iconOriginalName)
      // let _this = this
      fetchPolyfill(config.baseUrl + config.putSPUserProfileAPI + '_id', {
        method: 'PUT',
        body: data,
        headers: { 'token': localStorage.getItem('token') }
      }).then((response) => {
        response.json().then((body) => {
          if (response.headers.get('token')) {
            localStorage.setItem('token', response.headers.get('token'))
          }
          if (response.status === 200) {
            let _newAuthObj = newAuthObj
            _newAuthObj.area = this.state.area
            _newAuthObj.city = this.state.city
            _newAuthObj.state = this.state.state
            _newAuthObj.country = this.state.country
            _newAuthObj.zip = this.state.zip
            _newAuthObj.address = this.state.address
            _newAuthObj.landMark = this.state.landMark
            _newAuthObj.userAccount = this.state.userAccount
            localStorage.setItem('authObj', JSON.stringify(_newAuthObj))
            // alert('Address Updated Successfully')
            toast.success('Address Updated Successfully', {
              position: toast.POSITION.TOP_CENTER
            })
          } else {
            // alert('Address Update Failed')
            toast.error('Address Update Failed', {
              position: toast.POSITION.TOP_CENTER
            })
          }
        })
      })
    }
  }

  render () {
    return (
      <div>
        {/* ---------- Header Starts ------------- */}
        <div className='header bg-primary pb-6'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{ t`lanSPTitleProfile` }</h6>
                </div>
                {/* <div className='col-lg-6 col-5 text-right'>
                  <a onClick={this.handleCurrentLocation} className='btn btn-sm btn-neutral'><i className='fas fa-map-marker-alt' />{ t`lanSPButtonGetLocation` }</a>
                </div> */}
              </div>
            </div>
          </div>
        </div>{/* ---------- Header Starts ------------- */}
        <div className='container mt--6'>
          <div className='row'>
            <div className='col-md-4'>
              <div className='card card-profile'>
                <img src={require('../images/img-1-1000x600.jpg')} className='card-img-top' />
                <div className='row justify-content-center'>
                  <div className='col-lg-3 order-lg-2'>
                    <div className='card-profile-image rounded-circle mt--5'>
                      <a>
                        <img src={this.state.authObj.userIconPath ? config.baseUrl + this.state.authObj.userIconPath : require('../images/profile-icon.png')} className='rounded-circle' />
                      </a>
                    </div>
                  </div>
                </div>
                <div className='card-body mt-6 pt-0'>
                  <div className='text-center'>
                    <h5 className='h3'>{this.state.displayName}</h5>
                    <div className='h5 font-weight-300'>
                      <i className='ni ni-pin-3 mr-2' />{this.state.address}
                    </div>
                    <ul className='list-unstyled team-members'>
                      <li>
                        <div className='row mobile'>
                          <div className='col-md-9 col-9 pl-4 text-left'>
                            <p><span ><i className='fas fa-mobile-alt pr-2 pl-1' /></span><small>{this.state.mobileNumber}</small></p>
                          </div>
                          <div className='col-md-3 col-3 text-right'>
                            <i className='far fa-check-circle btn-outline-success' />
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className='row email'>
                          <div className='col-md-9 col-9 pl-4 text-left'>
                            <p><span ><i className='fas fa-envelope pr-2 pl-1' /></span>{this.state.email}</p>
                          </div>
                          <div className='col-md-3 col-3 pt-1 text-right'>
                            <i className='far fa-check-circle btn-outline-success' />
                          </div>
                        </div>
                      </li>
                      <hr className='divider' />
                    </ul>
                  </div>
                  <ul className='list-unstyled team-members'>
                    <li>
                      <a onClick={this.handleUserProfile} >{ t`lanSPTitleUserProfile` }</a>
                    </li>
                    <li>
                      <a className={classnames({ 'active-profile-title' :this.state.activeProfileTitle })} onClick={this.handleAddressDetails} >{ t`lanSPTitleAddressDetails` }</a>
                    </li>
                    <li>
                      <a onClick={this.handleIDProofs} >{ t`lanSPTitleIDProofs` }</a>
                    </li>
                    <li>
                      <a onClick={this.handlePreferences} >{ t`lanSPTitlePreferences` }</a>
                    </li>
                    <li>
                      <a onClick={this.handleBusinessInfo} >{ t`lanSPTitleBusinessInfo` }</a>
                    </li>
                    <li>
                      <a onClick={this.handleChangePassword} >{ t`lanSPTitleChangePassword` }</a>
                    </li>
                    <li>
                      <a onClick={this.handleLogOut}>{ t`lanSPTitleLogout` }</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='col-md-8'>
              <div className='card card-user'>
                <div className='card-header'>
                  <div className='row'>
                    <div className='col-md-6 col-6'>
                      <h5 className='card-title'>{ t`lanSPTitleProfileAddress` }</h5>
                    </div>
                    <div className='col-md-6 col-6 text-right'>
                      <a onClick={this.handleCurrentLocation} className='btn btn-sm btn-primary text-white'><i className='fas fa-map-marker-alt pr-2' />{ t`lanSPButtonGetLocation` }</a>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <form>
                    <div className='row'>
                      <div className='col-md-12'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanCommonLabelAddress`}<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='address' maxLength='80'
                            onChange={() => this.setState({ address: event.target.value, errorMessage: '' })} value={this.state.address} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6 '>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanCommonLabelLandmark`}</label>
                          <input type='text' className='form-control' id='landMark' maxLength='30'
                            onChange={() => this.setState({ landMark: event.target.value, errorMessage: '' })} value={this.state.landMark} />
                        </div>
                      </div>
                      <div className='col-md-6 '>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanCommonLabelArea`}<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='area' maxLength='20' onChange={() => this.setState({ area: event.target.value, errorMessage: '' })} value={this.state.area} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanCommonLabelCity`}<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='city' maxLength='20'
                            onChange={() => this.setState({ city: event.target.value, errorMessage: '' })} value={this.state.city} />
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanCommonLabelZip`}<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='zip' maxLength='6'
                            onChange={() => this.setState({ zip: event.target.value, errorMessage: '' })} value={this.state.zip} onKeyPress={this.handleMobileNumKeys} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelCountry` }<span style={{ color: 'red' }}>*</span></label>
                          <select className='form-control' id='country' onChange={() => this.setState({ country: event.target.value, errorMessage: '' })} value={this.state.country} >
                            {this.state.countryOrg ? null : <option value=''>Select Country</option>}
                            <option value='India'>India</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelState` }<span style={{ color: 'red' }}>*</span></label>
                          <select className='form-control' id='state' onChange={() => this.setState({ state: event.target.value, errorMessage: '' })} value={this.state.state}>
                            {this.state.stateOrg ? null : <option value=''>Select State</option>}
                            <option value='Telangana'>Telangana</option>
                            <option value='Andhra Pradesh'>Andhra Pradesh</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-12 text-center'>
                        <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-sm-12 text-center'>
                        <button type='button' className='btn btn-primary' onClick={this.updateProfileAddressdetails}>{ t`lanCommonButtonUpdate` }</button>
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

export default SPProfileAddressComponent
