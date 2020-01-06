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
import axios from 'axios'
import { t } from 'ttag'
import classnames from 'classnames'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

const myApi = axios.create()

class ADProfilePreferencesComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      defaultLanguage: '',
      defaultTimezone: '',
      defaultCurrency: '',
      dateFormat: '',
      errorMessage: '',
      activeProfileTitle: true,
      buttonDisabled: false
    }
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleUserProfile = this.handleUserProfile.bind(this)
    this.handleAddressDetails = this.handleAddressDetails.bind(this)
    this.handleIDProofs = this.handleIDProofs.bind(this)
    this.handlePreferences = this.handlePreferences.bind(this)
    this.handleBusinessInfo = this.handleBusinessInfo.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleLogOut = this.handleLogOut.bind(this)
    this.handleHome = this.handleHome.bind(this)
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
      defaultLanguage: authObj.preferences.defaultLanguage,
      defaultTimezone: authObj.preferences.defaultTimezone,
      defaultCurrency: authObj.preferences.defaultCurrency,
      dateFormat: authObj.preferences.dateFormat

    })
  }

  handleUserProfile () {
    hashHistory.push('/admin/profile')
    event.preventDefault()
  }
  handleAddressDetails () {
    hashHistory.push('/host/user/profile/address')
    event.preventDefault()
  }
  handleIDProofs () {
    hashHistory.push('/admin/user/profile/idproof')
    event.preventDefault()
  }
  handlePreferences () {
    this.setState({ activeProfileTitle: true })
    hashHistory.push('/admin/user/profile/preferences')
    event.preventDefault()
  }
  handleBusinessInfo () {
    hashHistory.push('/host/user/profile/businessinfo')
    event.preventDefault()
  }
  handleChangePassword () {
    hashHistory.push('/admin/user/profile/changepassword')
    event.preventDefault()
  }
  handleLogOut () {
    localStorage.clear()
    myApi.defaults.headers.token = null
    hashHistory.push('/admin')
  }

  handleUpdate () {
    let newAuthObj = this.state.authObj
    if (!this.state.defaultLanguage) {
      this.setState({ errorMessage: 'Language  is required' })
    } else if (!this.state.defaultTimezone) {
      this.setState({ errorMessage: 'Time  is required' })
    } else if (!this.state.defaultCurrency) {
      this.setState({ errorMessage: 'Currency is required' })
    } else if (!this.state.dateFormat) {
      this.setState({ errorMessage: 'Format is required' })
    } else {
      this.setState({ buttonDisabled: true })
      let _newAuthObj = newAuthObj
      _newAuthObj.preferences.defaultLanguage = this.state.defaultLanguage
      _newAuthObj.preferences.defaultTimezone = this.state.defaultTimezone
      _newAuthObj.preferences.defaultCurrency = this.state.defaultCurrency
      _newAuthObj.preferences.dateFormat = this.state.dateFormat
      localStorage.setItem('authObj', JSON.stringify(_newAuthObj))
      let putData = {
        defaultLanguage: this.state.defaultLanguage,
        defaultTimezone: this.state.defaultTimezone,
        defaultCurrency: this.state.defaultCurrency,
        dateFormat: this.state.dateFormat
      }
      let _this = this
      let obj = { url: config.baseUrl + config.putADProfilePreferencesUpdateAPI, body: putData } 
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          ToastsStore.success('Updated Successfully')
          setTimeout(() => {
            hashHistory.push('/admin/profile')
          }, 2000)
        } else {
          _this.setState({ buttonDisabled: false })
          ToastsStore.error('Updated Failed')
        }
      })
    }
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
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
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Preferences</li>
                    </ol>
                  </nav>
                </div>
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
                          <div className='col-md-10 col-9 pl-4 text-left'>
                            <p><span ><i className='fas fa-mobile-alt pr-2 pl-1' /></span><small>{this.state.mobileNumber}</small></p>
                          </div>
                          <div className='col-md-2 col-3 text-right'>
                            <i className='far fa-check-circle btn-outline-success' />
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className='row email'>
                          <div className='col-md-10 col-9 pl-4 text-left'>
                            <p style={{ fontSize: 13 }}><span ><i className='fas fa-envelope pr-2 pl-1' /></span>{this.state.email}</p>
                          </div>
                          <div className='col-md-2 col-3 pt-1 text-right'>
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
                    {/* <li>
                      <a onClick={this.handleAddressDetails} >{ t`lanSPTitleAddressDetails` }</a>
                    </li> */}
                    <li>
                      <a onClick={this.handleIDProofs} >{ t`lanSPTitleIDProofs` }</a>
                    </li>
                    <li>
                      <a className={classnames({ 'active-profile-title' :this.state.activeProfileTitle })} onClick={this.handlePreferences} >{ t`lanSPTitlePreferences` }</a>
                    </li>
                    {/* <li>
                      <a onClick={this.handleBusinessInfo} >{ t`lanSPTitleBusinessInfo` }</a>
                    </li> */}
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
                  <h5 className='card-title'>{ t`lanSPTitlePreferences` }</h5>
                </div>
                <div className='card-body'>
                  <form>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelLanguage` }</label>
                          <select className='form-control' id='defaultLanguage' value={this.state.defaultLanguage} onChange={() => this.setState({ defaultLanguage: event.target.value, errorMessage: '' })}>
                            <option value='English'>English</option>
                            <option value='Hindi'>Hindi</option>
                            <option value='Telugu'>Telugu</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelTimezone` }</label>
                          <select className='form-control' id='defaultTimezone' value={this.state.defaultTimezone} onChange={() => this.setState({ defaultTimezone: event.target.value, errorMessage: '' })}>
                            <option value='IST'>IST - Indian Standard Time (UTC+05:30)</option>
                            <option value='EST'>EST - Eastern Standard Time (UTC-05:00)</option>
                            <option value='EDT'>EDT - Eastern Daylight Time (UTC-04:00)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelCurrency` }</label>
                          <select className='form-control' id='defaultCurrency' value={this.state.defaultCurrency} onChange={() => this.setState({ defaultCurrency: event.target.value, errorMessage: '' })}>
                            <option value='INR'>INR - Indian Rupee (₹)</option>
                            <option value='USD'>USD - US Dollar ($)</option>
                            <option value='EUR'>EUR - Euro (€)</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label className='form-control-label'>{ t`lanCommonLabelDateFormat` }</label>
                          <select className='form-control' id='dateFormat' value={this.state.dateFormat} onChange={() => this.setState({ dateFormat: event.target.value, errorMessage: '' })}>
                            <option value='DD-MM-YY'>DD-MM-YY</option>
                            <option value='DD-MM-YYYY'>DD-MM-YYYY</option>
                            <option value='DD/MM/YY'>DD/MM/YY</option>
                            <option value='DD/MM/YYYY'>DD/MM/YYYY</option>
                            <option value='MMM DD, YY'>MMM DD, YY</option>
                            <option value='MMM DD, YYYY'>MMM DD, YYYY</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-sm-12 text-center mt-4'>
                        <button disabled={this.state.buttonDisabled} className='btn btn-primary' onClick={this.handleUpdate}>{ t`lanCommonButtonUpdate` }</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
        </div>
      </div>
    )
  }
}

export default ADProfilePreferencesComponent
