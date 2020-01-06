/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import axios from 'axios'
import { t } from 'ttag'
import classnames from 'classnames'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const myApi = axios.create()

class SPProfileBusinessInfoComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      firstName: '',
      lastName: '',
      displayName: '',
      email: '',
      mobileNumber: '',
      address: '',
      userIconPath: '',
      userIcon: '',
      userIconOriginalName: '',
      recordId: '',
      bussinessName: '',
      serviceProvider: '',
      contactPerson: '',
      contactNumber: '',
      contactEmail: '',
      contactAddress: '',
      landmark: '',
      area: '',
      city: '',
      state: '',
      stateOrg: '',
      zip: '',
      token: '',
      _id: '',
      errorMessage: '',
      activeProfileTitle: true,
      disabled: true
    }
    this.handleUserProfile = this.handleUserProfile.bind(this)
    this.handleAddressDetails = this.handleAddressDetails.bind(this)
    this.handleIDProofs = this.handleIDProofs.bind(this)
    this.handlePreferences = this.handlePreferences.bind(this)
    this.handleBusinessInfo = this.handleBusinessInfo.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleLogOut = this.handleLogOut.bind(this)
    this.handleUpdateDetails = this.handleUpdateDetails.bind(this)
    this.handleEnableEdit = this.handleEnableEdit.bind(this)
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
      iconPath: authObj.userIconPath ? authObj.userIconPath : '',
      iconOriginalName: authObj.userIconOriginalName ? authObj.userIconOriginalName : '',
      userIcon: authObj.userIcon ? authObj.userIcon : '',
      spServiceProvider: authObj.spServiceProvider,
      recordId: authObj.spServiceProviderId._id,
      serviceProvider: authObj.spServiceProvider,
      contactPerson: authObj.spServiceProviderId.contactPerson,
      contactNumber: authObj.spServiceProviderId.contactNumber,
      contactEmail: authObj.spServiceProviderId.contactEmail,
      contactAddress: authObj.spServiceProviderId.contactAddress,
      area: authObj.spServiceProviderId.area,
      landmark: authObj.spServiceProviderId.landmark,
      city: authObj.spServiceProviderId.city,
      state: authObj.spServiceProviderId.state,
      stateOrg: authObj.spServiceProviderId.state ? authObj.spServiceProviderId.state : '',
      zip: authObj.spServiceProviderId.zip
    })
  }
  handleUserProfile () {
    hashHistory.push('/host/user/profile')
    event.preventDefault()
  }
  handleAddressDetails () {
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
    this.setState({ activeProfileTitle: true })
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
  handleUpdateDetails () {
    let newAuthObj = this.state.authObj
    const emailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/
    const phValidation = /^(\d{10})$/
    if (!this.state.serviceProvider.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorBusinessNameRequired` })
    } else if (!this.state.contactPerson.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorContactPersonRequired` })
    } else if (!this.state.contactNumber) {
      this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired` })
    } else if (!phValidation.test(this.state.contactNumber)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber` })
    } else if (!this.state.contactEmail.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorEmailRequired` })
    } else if (!emailValidation.test(this.state.contactEmail)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else if (!this.state.area.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAreaRequired` })
    } else if (!this.state.city.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorCityRequired` })
    } else if (!this.state.state) {
      this.setState({ errorMessage: t`lanSPLabelErrorStateRequired` })
    } else if (!this.state.zip) {
      this.setState({ errorMessage: t`lanSPLabelErrorPinCodeRequired` })
    } else if (!this.state.contactAddress.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAdressRequired` })
    } else {
      let _newAuthObj = newAuthObj
      _newAuthObj.spServiceProviderId.contactNumber = this.state.contactNumber
      _newAuthObj.spServiceProviderId.serviceProvider = this.state.serviceProvider
      _newAuthObj.spServiceProviderId.contactPerson = this.state.contactPerson
      _newAuthObj.spServiceProviderId.contactEmail = this.state.contactEmail
      _newAuthObj.spServiceProviderId.landmark = this.state.landmark
      _newAuthObj.spServiceProviderId.area = this.state.area
      _newAuthObj.spServiceProviderId.city = this.state.city
      _newAuthObj.spServiceProviderId.state = this.state.state
      _newAuthObj.spServiceProviderId.zip = this.state.zip
      _newAuthObj.spServiceProviderId.contactAddress = this.state.contactAddress
      _newAuthObj.spServiceProviderId._id = this.state.recordId
      localStorage.setItem('authObj', JSON.stringify(_newAuthObj))
      let putLocData = {
        serviceProvider: this.state.serviceProvider,
        contactPerson: this.state.contactPerson,
        contactNumber: this.state.contactNumber,
        contactEmail: this.state.contactEmail,
        landmark: this.state.landmark,
        area: this.state.area,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        contactAddress: this.state.contactAddress,
        _id: this.state.recordId
      }
      let obj = { url: config.baseUrl + config.putSPProfileBusinessInfoUpdateAPI + this.state.recordId, body: putLocData }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          // alert('Updated successfully')
          // hashHistory.push('/host/user/profile')
          toast.success('Updated Successfully', {
            position: toast.POSITION.TOP_CENTER
          })
          setTimeout(() => {
            hashHistory.push('/host/user/profile')
          }, 2000)
        } else {
          // alert('Update Failed')
          toast.error('Update Failed', {
            position: toast.POSITION.TOP_CENTER
          })
        }
      })
    }
  }
  handleEnableEdit () {
    this.setState({
      disabled: false
    })
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
                      <a onClick={this.handleAddressDetails} >{ t`lanSPTitleAddressDetails` }</a>
                    </li>
                    <li>
                      <a onClick={this.handleIDProofs} >{ t`lanSPTitleIDProofs` }</a>
                    </li>
                    <li>
                      <a onClick={this.handlePreferences} >{ t`lanSPTitlePreferences` }</a>
                    </li>
                    <li>
                      <a className={classnames({ 'active-profile-title' :this.state.activeProfileTitle })} onClick={this.handleBusinessInfo} >{ t`lanSPTitleBusinessInfo` }</a>
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
                    <div className='col-sm-12'>
                      {this.state.disabled
                      ? <h5 className='card-title'>{ t`lanSPTitleBusinessInfo` }</h5>
                      : <h5 className='card-title'>Edit Business Info</h5>
                      }
                    </div>
                    <div className=' text-center enable-edit-business-info'>
                      <a onClick={this.handleEnableEdit} title='Click To Edit Business Info'>
                        <span><i className='fas fa-edit' style={this.state.disabled ? { color: '#38325d', fontSize: 18, position: 'absolute', top:16, left: 164 }
                         : { color: '#37aaa9', fontSize: 18, position: 'absolute', top:16, left: 205 }} /></span></a>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <form>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label>{t`lanSPLabelBusinessName`}<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='serviceProvider' value={this.state.serviceProvider}
                            onChange={() => this.setState({ serviceProvider: event.target.value, errorMessage: '' })}
                            minLength={3} maxLength={40} disabled={this.state.disabled} />
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelContactPerson`}<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='contactPerson' value={this.state.contactPerson}
                            onChange={() => this.setState({ contactPerson: event.target.value, errorMessage: '' })}
                            maxLength={20} disabled={this.state.disabled} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelMobileNumber`}<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='contactNumber' value={this.state.contactNumber} onKeyPress={this.handleMobileNumKeys}
                            onChange={() => this.setState({ contactNumber: event.target.value, errorMessage: '' })}
                            maxLength={10} disabled={this.state.disabled} />
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelEmail`}<span style={{ color: 'red' }}>*</span></label>
                          <input type='email' className='form-control' id='contactEmail' value={this.state.contactEmail}
                            onChange={() => this.setState({ contactEmail: event.target.value, errorMessage: '' })}
                            maxLength={80} disabled={this.state.disabled} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelArea` }<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='area' value={this.state.area}
                            onChange={() => this.setState({ area: event.target.value, errorMessage: '' })}
                            maxLength={20} disabled={this.state.disabled} />
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelLandmark` }</label>
                          <input type='text' className='form-control' id='landmark' value={this.state.landmark}
                            onChange={() => this.setState({ landmark: event.target.value, errorMessage: '' })}
                            maxLength={30} disabled={this.state.disabled} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelCity` }<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='city' value={this.state.city}
                            onChange={() => this.setState({ city: event.target.value, errorMessage: '' })}
                            maxLength={20} disabled={this.state.disabled} />
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelState` }<span style={{ color: 'red' }}>*</span></label>
                          <select className='form-control' id='state' onChange={() => this.setState({ state: event.target.value, errorMessage: '' })} value={this.state.state}>
                            {this.state.stateOrg ? null : <option value=''>Select State</option>}
                            <option value='Telangana'>Telangana</option>
                            <option value='Andhra Pradesh'>Andhra Pradesh</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelZip` }<span style={{ color: 'red' }}>*</span></label>
                          <input type='text' className='form-control' id='zip' value={this.state.zip} onKeyPress={this.handleMobileNumKeys}
                            onChange={() => this.setState({ zip: event.target.value, errorMessage: '' })}
                            maxLength={6} disabled={this.state.disabled} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-12'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelAddress` }<span style={{ color: 'red' }}>*</span></label>
                          <textarea className='form-control textarea' id='contactAddress' value={this.state.contactAddress}
                            onChange={() => this.setState({ contactAddress: event.target.value, errorMessage: '' })}
                            maxLength={80} disabled={this.state.disabled} />
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
                        <button type='button' className='btn btn-primary' onClick={this.handleUpdateDetails}>{ t`lanCommonButtonUpdate` }</button>
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

export default SPProfileBusinessInfoComponent
