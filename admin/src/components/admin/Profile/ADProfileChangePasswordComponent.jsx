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
import axios from 'axios'
import { t } from 'ttag'
import classnames from 'classnames'

import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

const myApi = axios.create()

class ADProfileChangePasswordComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      currentPassword: '',
      newPassword: '',
      showPassword: false,
      errorMessage:'',
      activeProfileTitle: true,
      buttonDisabled:false
    }
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this)
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
      area: authObj.area ? authObj.area : '',
      city: authObj.city ? authObj.city : '',
      state: authObj.state ? authObj.state : '',
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

  handleNameNumKeys (event) {
    if (event.charCode === 32 || event.charCode === 13) {
      event.preventDefault()
    }
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
    hashHistory.push('/admin/user/profile/preferences')
    event.preventDefault()
  }
  handleBusinessInfo () {
    hashHistory.push('/host/user/profile/businessinfo')
    event.preventDefault()
  }
  handleChangePassword () {
    this.setState({ activeProfileTitle: true })
    hashHistory.push('/admin/user/profile/changepassword')
    event.preventDefault()
  }
  handleLogOut () {
    localStorage.clear()
    myApi.defaults.headers.token = null
    hashHistory.push('/admin')
  }

  handleUpdatePassword () {
    if (!this.state.currentPassword) {
      this.setState({ errorMessage: t`lanSPLabelErrorEnterCurrentPassword` })
    } else if (!this.state.newPassword) {
      this.setState({ errorMessage: t`lanSPLabelErrorEnterNewPassword` })
    } else if (this.state.newPassword.length < 6) {
      this.setState({ errorMessage: t`lanSPLabelErrorPasswordMinLength` })
    } else {
      this.setState({ buttonDisabled: true })
      let updateData = {
        currentPassword: this.state.currentPassword,
        newPassword: this.state.newPassword
      }
      let _this = this
      let obj = { url: config.baseUrl + config.putADProfileChangePasswordAPI, body: updateData }  
      APICallManager.putCall(obj, function (res) {
        if (res.data.statusCode === '1012') {
          localStorage.clear()
          ToastsStore.success('Password Updated Successfully')
          setTimeout(() => {
            hashHistory.push('/admin')
          }, 2000)
        } else if (res.data.statusCode === '9979') {
          ToastsStore.warning('Invalid Current Password')
          _this.setState({ buttonDisabled: false })
        } else {
          _this.setState({ buttonDisabled: false })
          ToastsStore.error('Password Update Failed')
        }
      })
    }
    event.preventDefault()
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
                      <li className='breadcrumb-item active' aria-current='page'>Change Password</li>
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
                      <a onClick={this.handlePreferences} >{ t`lanSPTitlePreferences` }</a>
                    </li>
                    {/* <li>
                      <a onClick={this.handleBusinessInfo} >{ t`lanSPTitleBusinessInfo` }</a>
                    </li> */}
                    <li>
                      <a className={classnames({ 'active-profile-title' :this.state.activeProfileTitle })} onClick={this.handleChangePassword} >{ t`lanSPTitleChangePassword` }</a>
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
                  <h5 className='card-title'>{ t`lanSPTitleChangePassword` }</h5>
                </div>
                <div className='card-body'>
                  <form>
                    <div className='row'>
                      <div className='col-md-6 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelCurrentPassword` }</label>
                          <input type='password' autoFocus className='form-control' id='currentPassword' value={this.state.currentPassword} onKeyPress={this.handleNameNumKeys}
                            onChange={() => this.setState({ currentPassword: event.target.value, errorMessage: '' })} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelNewPassword` }</label>
                          <input type={this.state.showPassword ? 'text' : 'password'} className='form-control' id='newPassword' value={this.state.newPassword} minLength={6} maxLength={20} onKeyPress={this.handleNameNumKeys}
                            onChange={() => this.setState({ newPassword: event.target.value, errorMessage: '' })} />
                          <a onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                            <span style={{ position:'absolute', right:10, bottom: 10 }}>
                              <i className={this.state.showPassword ? 'far fa-eye' : 'far fa-eye-slash'} />
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='container'>
                        <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-sm-12 text-center'>
                        <button disabled={this.state.buttonDisabled} className='btn btn-primary' onClick={this.handleUpdatePassword}>{ t`lanCommonButtonUpdate` }</button>
                        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
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

export default ADProfileChangePasswordComponent
