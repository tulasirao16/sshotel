/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
// import Switch from 'react-switch'
// import ReactDrawer from 'react-drawer'
import 'react-drawer/lib/react-drawer.css'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { t } from 'ttag'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import 'react-toastify/dist/ReactToastify.css'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ADHostUserListEditComponent extends React.Component {
  constructor () {
    let maxDate = moment().subtract(18, 'years').format('YYYY-MM-DD')
    super()
    this.state = {
      password: '',
      userInfo: {},
      oldUserInfo: {},
      errorMessage: '',
      buttonDisabed:false,
      maxDate: new Date(moment(maxDate).format('YYYY-MM-DD'))
    }
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleSelectGender = this.handleSelectGender.bind(this)
    this.handleSelectUserRole = this.handleSelectUserRole.bind(this)
    this.handleSelectUserStatus = this.handleSelectUserStatus.bind(this)
    this.handleSelectState = this.handleSelectState.bind(this)
    this.handleApiCall = this.handleApiCall.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }

  componentWillMount () {
    let userInfo = JSON.parse(localStorage.getItem('userData'))
    this.setState({
      userInfo: userInfo,
      oldUserInfo: userInfo
    })
  }

  handleMobileNumKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
      event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
      (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }

  handleBack () {
    localStorage.removeItem('userData')
    hashHistory.push('/admin/host-users')
    event.preventDefault()
  }

  handleChangeDate (date) {
    this.setState(prevState => {
      let userInfo = Object.assign({}, prevState.userInfo)
      let errorMessage = ''
      userInfo.dob = date
      return { userInfo, errorMessage }
    })
  }

  handleSelectGender (event) {
    if (event.target.value === '') {
      this.setState(prevState => {
        let userInfo = Object.assign({}, prevState.userInfo)
        let errorMessage = ''
        userInfo.gender = ''
        return { userInfo, errorMessage }
      })
    } else {
      let value = event.target.value
      this.setState(prevState => {
        let userInfo = Object.assign({}, prevState.userInfo)
        let errorMessage = ''
        userInfo.gender = value
        return { userInfo, errorMessage }
      })
    }
  }

  handleSelectUserRole () {
    this.setState(prevState => {
      let userInfo = Object.assign({}, prevState.userInfo)
      let errorMessage = ''
      userInfo.userRole = event.target.value
      return { userInfo, errorMessage }
    })
  }

  handleSelectUserStatus () {
    this.setState(prevState => {
      let userInfo = Object.assign({}, prevState.userInfo)
      let errorMessage = ''
      userInfo.userStatus = event.target.value
      return { userInfo, errorMessage }
    })
  }
  handleSelectState () {
    if (event.target.value === '') {
      this.setState(prevState => {
        let userInfo = Object.assign({}, prevState.userInfo)
        let errorMessage = ''
        userInfo.state = ''
        return { userInfo, errorMessage }
      })
    } else {
      this.setState(prevState => {
        let userInfo = Object.assign({}, prevState.userInfo)
        let errorMessage = ''
        userInfo.state = event.target.value
        return { userInfo, errorMessage }
      })
    }
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }

  handleUpdate () {
    const emailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+[.]{1}[a-z]{2,4}$/
    const phValidation = /^\d{10}$/
    if (!this.state.userInfo.firstName.trim()) {
      this.setState({ errorMessage: t`lanCommonLabelErrorFirstNameRequired` })
    } else if (!this.state.userInfo.lastName.trim()) {
      this.setState({ errorMessage: t`lanCommonLabelErrorLastNameRequired` })
    } else if (!this.state.userInfo.displayName.trim()) {
      this.setState({ errorMessage: t`lanCommonLabelErrorDisplayNameRequired` })
    } else if (!this.state.userInfo.mobileNumber) {
      this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired` })
    } else if (!phValidation.test(this.state.userInfo.mobileNumber)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber` })
    } else if (this.state.userInfo.alternateContactNumber && !phValidation.test(this.state.userInfo.alternateContactNumber)) {
      this.setState({ errorMessage: t`lanCommonLabelErrorInvalidAlternateMobileNumber` })
    } else if (!this.state.userInfo.email) {
      this.setState({ errorMessage: t`lanSPLabelErrorEmailRequired` })
    } else if (!emailValidation.test(this.state.userInfo.email)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else if (this.state.userInfo.alternateEmail && !emailValidation.test(this.state.userInfo.alternateEmail)) {
      this.setState({ errorMessage: t`lanCommonLabelErrorInvalidAlternateEmail` })
    } else if (!this.state.userInfo.userRole.trim()) {
      this.setState({ errorMessage: t`lanCommonLabelErrorUserRoleRequired` })
    } else if (this.state.password && this.state.password.length < 6) {
      this.setState({ errorMessage: t`lanSPLabelErrorPasswordMinLength` })
    } else if (!this.state.userInfo.address.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAdressRequired` })
    } else {
      this.setState({ buttonDisabed: true })
      if (this.state.password.trim() === '') {
        var isUpdate = JSON.stringify(this.state.oldUserInfo) === JSON.stringify(this.state.userInfo)
        if (isUpdate) {
          hashHistory.push('/admin/host-users')
        } else {
          this.handleApiCall()
        }
      } else {
        this.handleApiCall()
      }
    }
    event.preventDefault()
  }
  handleApiCall () {
    var dateNumber = ''
    if (this.state.dob) {
      dateNumber = moment.utc(this.state.dob).valueOf()
    }
    var userData = {
      _id: this.state.userInfo._id,
      firstName: this.state.userInfo.firstName,
      lastName: this.state.userInfo.lastName,
      displayName: this.state.userInfo.displayName,
      mobileNumber: this.state.userInfo.mobileNumber,
      alternateContactNumber: this.state.userInfo.alternateContactNumber,
      email: this.state.userInfo.email,
      alternateEmail: this.state.userInfo.alternateEmail,
      password: this.state.password,
      dob: this.state.userInfo.dob,
      dobNumber: dateNumber,
      gender: (this.state.userInfo && this.state.userInfo.gender) ? this.state.userInfo.gender : '',
      userRole: this.state.userInfo.userRole,
      userStatus: this.state.userInfo.userStatus,
      area: (this.state.userInfo && this.state.userInfo.area) ? this.state.userInfo.area : '',
      landMark: (this.state.userInfo && this.state.userInfo.landMark) ? this.state.userInfo.landMark : '',
      address: this.state.userInfo.address,
      city: (this.state.userInfo && this.state.userInfo.city) ? this.state.userInfo.city : '',
      state: (this.state.userInfo && this.state.userInfo.state) ? this.state.userInfo.state : '',
      pinCode: (this.state.userInfo && this.state.userInfo.zip) ? this.state.userInfo.zip : '',
      country: (this.state.userInfo && this.state.userInfo.country) ? this.state.userInfo.country : ''
    }
    let _this = this
    let obj = { url: config.baseUrl + config.putADHostUserUpdateAPI, body: userData }
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        ToastsStore.success('User Updated Successfully')
        setTimeout(() => {
          hashHistory.push('/admin/host-users')
        }, 2000)
      } else {
        _this.setState({ buttonDisabed: false })
        ToastsStore.error('User Update Failed')
        if (resObj.data.statusCode === '9988') {
          _this.setState({ errorMessage: t`lanSPLabelErrorUserEmailExist` })
        } else if (resObj.data.statusCode === '9989') {
          _this.setState({ errorMessage: t`lanSPLabelErrorUserMobileNumberExist` })
        }
      }
    })
  }
  render () {
    return (
      <div >
        <div className='container-fluid mt--6 mb-4'>
          <div className='row justify-content-center'>
            <div className='col-lg-12 col-md-12'>
              <div className='card user-edit border-0 mb-0'>
                <div className='card-header bg-transparent pb-3'>
                  <h5 className='card-title'>{t`lanADTooltipLabelHostUserEdit`}</h5>
                </div>
                <div className='card-body px-lg-4 py-lg-4'>
                  <form>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelFirstName`}<span className='mandatory'>*</span></label>
                          <input type='text' className='form-control' minLength='3' maxLength='20' value={this.state.userInfo.firstName} onChange={
                            () =>
                              this.setState(prevState => {
                                let userInfo = Object.assign({}, prevState.userInfo)
                                let errorMessage = ''
                                userInfo.firstName = event.target.value
                                return { userInfo, errorMessage }
                              })
                          } />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelLastName`}<span className='mandatory'>*</span></label>
                          <input type='text' className='form-control' minLength='3' maxLength='20'
                            value={(this.state.userInfo && this.state.userInfo.lastName) ? this.state.userInfo.lastName : ''} onChange={
                              () =>
                                this.setState(prevState => {
                                  let userInfo = Object.assign({}, prevState.userInfo)
                                  let errorMessage = ''
                                  userInfo.lastName = event.target.value
                                  return { userInfo, errorMessage }
                                })
                            } />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelDisplayName`}</label>
                          <input type='text' className='form-control' minLength='3' maxLength='20'
                            value={(this.state.userInfo && this.state.userInfo.displayName) ? this.state.userInfo.displayName : ''} onChange={
                              () =>
                                this.setState(prevState => {
                                  let userInfo = Object.assign({}, prevState.userInfo)
                                  let errorMessage = ''
                                  userInfo.displayName = event.target.value
                                  return { userInfo, errorMessage }
                                })
                            } />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelMobileNumber`}<span className='mandatory'>*</span></label>
                          <input type='text' className='form-control' maxLength='10' pattern='\d{10}' value={this.state.userInfo.mobileNumber} onKeyPress={this.handleMobileNumKeys} onChange={
                            () => {
                              if (event.target.value) {
                                this.setState(prevState => {
                                  let userInfo = Object.assign({}, prevState.userInfo)
                                  let errorMessage = ''
                                  userInfo.mobileNumber = event.target.value.match(/\d+/g).toString().replace(/,/g, '')
                                  return { userInfo, errorMessage }
                                })
                              } else {
                                this.setState(prevState => {
                                  let userInfo = Object.assign({}, prevState.userInfo)
                                  let errorMessage = ''
                                  userInfo.mobileNumber = event.target.value
                                  return { userInfo, errorMessage }
                                })
                              }
                            }} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelAlternateMobileNumber`}</label>
                          <input type='text' className='form-control' maxLength='10' pattern='\d{10}'
                            value={(this.state.userInfo && this.state.userInfo.alternateContactNumber) ? this.state.userInfo.alternateContactNumber : ''} onKeyPress={this.handleMobileNumKeys} onChange={
                              () => {
                                if (event.target.value) {
                                  this.setState(prevState => {
                                    let userInfo = Object.assign({}, prevState.userInfo)
                                    let errorMessage = ''
                                    userInfo.alternateContactNumber = event.target.value.match(/\d+/g).toString().replace(/,/g, '')
                                    return { userInfo, errorMessage }
                                  })
                                } else {
                                  this.setState(prevState => {
                                    let userInfo = Object.assign({}, prevState.userInfo)
                                    let errorMessage = ''
                                    userInfo.alternateContactNumber = event.target.value
                                    return { userInfo, errorMessage }
                                  })
                                }
                              }} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelEmail`}<span className='mandatory'>*</span></label>
                          <input type='text' className='form-control' minLength='3' maxLength='80' value={this.state.userInfo.email} onChange={
                            () =>
                              this.setState(prevState => {
                                let userInfo = Object.assign({}, prevState.userInfo)
                                let errorMessage = ''
                                userInfo.email = event.target.value
                                return { userInfo, errorMessage }
                              })
                          } />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelAlternateEmail`}</label>
                          <input type='text' className='form-control' minLength='3' maxLength='80'
                            value={(this.state.userInfo && this.state.userInfo.alternateEmail) ? this.state.userInfo.alternateEmail : ''}
                            onChange={
                              () =>
                                this.setState(prevState => {
                                  let userInfo = Object.assign({}, prevState.userInfo)
                                  let errorMessage = ''
                                  userInfo.alternateEmail = event.target.value
                                  return { userInfo, errorMessage }
                                })
                            } />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelUserRole`}<span className='mandatory'>*</span></label>
                          <select className='form-control' onChange={this.handleSelectUserRole} value={this.state.userInfo.userRole}>
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
                          <label>{t`lanCommonLabelSelectStatus`}<span className='mandatory'>*</span></label>
                          <select className='form-control' onChange={this.handleSelectUserStatus} value={this.state.userInfo.userStatus}>
                            <option value='Active'>Active</option>
                            <option value='Inactive'>Inactive</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelDateOfBirth`}</label>
                          <DatePicker
                            maxDate={this.state.maxDate}
                            selected={(this.state.userInfo && this.state.userInfo.dob)
                              ? new Date(moment(this.state.userInfo.dob).year(), moment(this.state.userInfo.dob).month(), moment(this.state.userInfo.dob).date()) : null}
                            filterDate={(date) => {
                              return moment() > date
                            }}
                            onSelect={this.handleChangeDate}
                            value={(this.state.userInfo && this.state.userInfo.dob) ? moment(this.state.userInfo.dob).format('MMM DD, YY') : null}
                            showYearDropdown
                            showMonthDropdown
                          />
                          <i className='far fa-calendar-alt icon-cal' />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelGender`}</label>
                          <select className='form-control' onChange={this.handleSelectGender} value={this.state.userInfo.gender} >
                            <option value=''>{t`lanCommonLabelSelectGender`}</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelPassword`}</label>
                          <input type='password' className='form-control' minLength='6' maxLength='20'
                            value={this.state.password} onChange={() => this.setState({ password: event.target.value.replace(/\s/g, '') })} />
                        </div>
                      </div>
                    </div>
                  </form>
                  <hr />
                  <div className='mb-3'><h3>{t`lanSPSubTitlePropertyLocationDetails`}</h3></div>
                  <form>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelArea`}</label>
                          <input type='text' className='form-control' minLength='3' maxLength='20'
                            value={(this.state.userInfo && this.state.userInfo.area) ? this.state.userInfo.area : ''}
                            onKeyPress={this.handleEnter}
                            onChange={
                              () =>
                                this.setState(prevState => {
                                  let userInfo = Object.assign({}, prevState.userInfo)
                                  let errorMessage = ''
                                  userInfo.area = event.target.value
                                  return { userInfo, errorMessage }
                                })
                            } />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelLandmark`}</label>
                          <input type='text' className='form-control' minLength='3' maxLength='30'
                            value={(this.state.userInfo && this.state.userInfo.landMark) ? this.state.userInfo.landMark : ''}
                            onKeyPress={this.handleEnter}
                            onChange={
                              () =>
                                this.setState(prevState => {
                                  let userInfo = Object.assign({}, prevState.userInfo)
                                  let errorMessage = ''
                                  userInfo.landMark = event.target.value
                                  return { userInfo, errorMessage }
                                })
                            } />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelCity`}</label>
                          <input type='text' className='form-control' minLength='3' maxLength='20'
                            value={(this.state.userInfo && this.state.userInfo.city) ? this.state.userInfo.city : ''}
                            onKeyPress={this.handleEnter}
                            onChange={
                              () =>
                                this.setState(prevState => {
                                  let userInfo = Object.assign({}, prevState.userInfo)
                                  let errorMessage = ''
                                  userInfo.city = event.target.value
                                  return { userInfo, errorMessage }
                                })
                            } />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelZip`}</label>
                          <input type='text' className='form-control' maxLength='6' pattern='\d{6}' onKeyPress={this.handleMobileNumKeys && this.handleEnter}
                            value={(this.state.userInfo && this.state.userInfo.zip) ? this.state.userInfo.zip : ''}
                            onChange={
                            () =>
                              this.setState(prevState => {
                                let userInfo = Object.assign({}, prevState.userInfo)
                                let errorMessage = ''
                                userInfo.zip = event.target.value
                                return { userInfo, errorMessage }
                              })
                          } />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelState`}<span className='mandatory'>*</span></label>
                          <select className='form-control' onChange={this.handleSelectState} value={this.state.userInfo.state} >
                            <option>{t`lanCommonLabelSelectState`}</option>
                            <option>Telangana</option>
                            <option>Andhra Pradesh</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelCountry`}<span className='mandatory'>*</span></label>
                          <select className='form-control' defaultValue={this.state.userInfo.country}>
                            <option>{t`lanCommonLabelSelectCountry`}</option>
                            <option>India</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-6 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelAddress`}<span className='mandatory'>*</span></label>
                          <textarea className='form-control textarea' minLength='3' maxLength='80' value={(this.state.userInfo && this.state.userInfo.address) ? this.state.userInfo.address : ''} onChange={
                            () =>
                              this.setState(prevState => {
                                let userInfo = Object.assign({}, prevState.userInfo)
                                let errorMessage = ''
                                userInfo.address = event.target.value
                                return { userInfo, errorMessage }
                              })
                          } />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='container'>
                        <div className='text-center'>
                          <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='update ml-auto mr-auto'>
                        <button disabled={this.state.buttonDisabed} className='btn btn-primary btn-round' onClick={this.handleUpdate}>{t`lanCommonButtonUpdate`}</button>
                        <button className='btn btn-danger' onClick={this.handleBack}>{t`lanCommonButtonBack`}</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

export default ADHostUserListEditComponent
