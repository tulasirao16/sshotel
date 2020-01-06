/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ADUserEditComponent extends React.Component {
  constructor (props) {
    let maxDate = moment().subtract(18, 'years').format('YYYY-MM-DD')
    super(props)
    this.state = {
      userInfo: props.UserView,
      isUserList: props.isUserList,
      oldUserInfo: {},
      errorMessage: '',
      buttonDisabled: false,
      maxDate: new Date(moment(maxDate).format('YYYY-MM-DD'))
    }
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleSelectUserRole = this.handleSelectUserRole.bind(this)
    this.handleSelectUserStatus = this.handleSelectUserStatus.bind(this)
    this.handleSelectState = this.handleSelectState.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }
  handleMobileNumKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
      event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
      (event.charCode > 57 && event.charCode < 127 || event.charCode === 13)) {
      event.preventDefault()
    }
  }

  handleChangeDate (date) {
    let userInfo = this.state.userInfo
    userInfo.dob = date
    this.setState({ userInfo: userInfo, errorMessage: '' })
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }

  handleSelectUserRole (event) {
    let userInfo = this.state.userInfo
    userInfo.userRole = event.target.value
    this.setState({ userInfo: userInfo, errorMessage: '' })
  }

  handleSelectUserStatus (event) {
    let userInfo = this.state.userInfo
    userInfo.userStatus = event.target.value
    this.setState({ userInfo: userInfo, errorMessage: '' })
  }
  handleSelectState () {
    if (event.target.value === '') {
      let userInfo = this.state.userInfo
      userInfo.state = event.target.value
      this.setState({
        userInfo: userInfo, errorMessage: ''
      })
    } else {
      let userInfo = this.state.userInfo
      userInfo.state = event.target.value
      this.setState({
        userInfo: userInfo, errorMessage: ''
      })
    }
  }

  handleUpdate () {
    const emailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/
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
      this.setState({ buttonDisabled : true })
      var userData = {
        _id: this.state.userInfo._id,
        firstName: this.state.userInfo.firstName,
        lastName: this.state.userInfo.lastName,
        displayName: this.state.userInfo.displayName,
        mobileNumber: this.state.userInfo.mobileNumber,
        alternateContactNumber: this.state.userInfo.alternateContactNumber,
        email: this.state.userInfo.email,
        alternateEmail: this.state.userInfo.alternateEmail,
        dob: this.state.userInfo.dob,
        userRole: this.state.userInfo.userRole,
        userStatus: this.state.userInfo.userStatus,
        area: (this.state.userInfo && this.state.userInfo.area) ? this.state.userInfo.area : '',
        landMark: (this.state.userInfo && this.state.userInfo.area) ? this.state.userInfo.area : '',
        address: this.state.userInfo.address,
        city: (this.state.userInfo && this.state.userInfo.city) ? this.state.userInfo.city : '',
        state: (this.state.userInfo && this.state.userInfo.state) ? this.state.userInfo.state : '',
        pinCode: (this.state.userInfo && this.state.userInfo.zip) ? this.state.userInfo.zip : '',
        country: (this.state.userInfo && this.state.userInfo.country) ? this.state.userInfo.country : 'India'
      }
      let _this = this
      let obj = { url: config.baseUrl + config.putADUserEditAPI, body: userData }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          let usersData = _this.props.usersList
          let index = usersData.findIndex(x => x._id === _this.state.userInfo._id)
          usersData[index] = resObj.data.statusResult
          ToastsStore.success('User Updated Successfully')
          setTimeout(() => {
            _this.props.handleEditUser(usersData)
          }, 1000)
        } else {
          _this.setState({ buttonDisabled: false })
          ToastsStore.error('User Update Failed')
          if (resObj.data.statusCode === '9988') {
            _this.setState({ errorMessage: t`lanSPLabelErrorUserEmailExist` })
          } else if (resObj.data.statusCode === '9989') {
            _this.setState({ errorMessage: t`lanSPLabelErrorUserMobileNumberExist` })
          }
        }
      })
    }
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }
  render () {
    return (
      <div >
        {/* <DrawerWithHeader /> */}
        {/* ---------- Header Starts ------------- */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADTitleUsers`}</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={() => this.props.handleEditUser({})} >{t`lanSPTitleUsersList`} </a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanLabelADUserEdit`}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>{/* ---------- Header Ends ------------- */}
        <div className='container-fluid mt--6 mb-4'>
          <div className='row justify-content-center'>
            <div className='col-lg-12 col-md-12'>
              <div className='card user-edit border-0 mb-0'>
                <div className='card-header bg-transparent pb-3'>
                  <h5 className='card-title'>{t`lanSPSubTitleEditUser`}</h5>
                </div>
                <div className='card-body px-lg-4 py-lg-4'>
                  <form>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelFirstName`}<span className='mandatory'>*</span></label>
                          <input type='text' className='form-control' minLength='3' maxLength='20' value={this.state.userInfo.firstName} onChange={
                            () => {
                              let userInfo = this.state.userInfo
                              userInfo.firstName = event.target.value
                              this.setState({
                                userInfo: userInfo, errorMessage: ''
                              })
                            }} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelLastName`}<span className='mandatory'>*</span></label>
                          <input type='text' className='form-control' minLength='3' maxLength='20'
                            value={(this.state.userInfo && this.state.userInfo.lastName) ? this.state.userInfo.lastName : ''} onChange={
                              () => {
                                let userInfo = this.state.userInfo
                                userInfo.lastName = event.target.value
                                this.setState({
                                  userInfo: userInfo, errorMessage: ''
                                })
                              }} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelDisplayName`}</label>
                          <input type='text' className='form-control' minLength='3' maxLength='20'
                            value={(this.state.userInfo && this.state.userInfo.displayName) ? this.state.userInfo.displayName : ''} onChange={
                              () => {
                                let userInfo = this.state.userInfo
                                userInfo.displayName = event.target.value
                                this.setState({
                                  userInfo: userInfo, errorMessage: ''
                                })
                              }} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelMobileNumber`}<span className='mandatory'>*</span></label>
                          <input type='text' className='form-control' maxLength='10' pattern='\d{10}' value={this.state.userInfo.mobileNumber} onKeyPress={this.handleMobileNumKeys} onChange={
                            () => {
                              if (event.target.value) {
                                let userInfo = this.state.userInfo
                                userInfo.mobileNumber = event.target.value
                                this.setState({
                                  userInfo: userInfo, errorMessage: ''
                                })
                              } else {
                                let userInfo = this.state.userInfo
                                userInfo.mobileNumber = event.target.value
                                this.setState({
                                  userInfo: userInfo, errorMessage: ''
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
                                  let userInfo = this.state.userInfo
                                  userInfo.alternateContactNumber = event.target.value
                                  this.setState({
                                    userInfo: userInfo, errorMessage: ''
                                  })
                                } else {
                                  let userInfo = this.state.userInfo
                                  userInfo.alternateContactNumber = event.target.value
                                  this.setState({
                                    userInfo: userInfo, errorMessage: ''
                                  })
                                }
                              }} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelEmail`}<span className='mandatory'>*</span></label>
                          <input type='text' className='form-control' minLength='3' maxLength='80' value={this.state.userInfo.email} onChange={
                            () => {
                              let userInfo = this.state.userInfo
                              userInfo.email = event.target.value
                              this.setState({
                                userInfo: userInfo, errorMessage: ''
                              })
                            }} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelAlternateEmail`}</label>
                          <input type='text' className='form-control' minLength='3' maxLength='80'
                            value={(this.state.userInfo && this.state.userInfo.alternateEmail) ? this.state.userInfo.alternateEmail : ''}
                            onChange={
                              () => {
                                let userInfo = this.state.userInfo
                                userInfo.alternateEmail = event.target.value
                                this.setState({
                                  userInfo: userInfo, errorMessage: ''
                                })
                              }} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelUserRole`}<span className='mandatory'>*</span></label>
                          <select className='form-control' id='exampleFormControlSelect1' onChange={this.handleSelectUserRole} value={this.state.userInfo.userRole}>
                            <option value='Manager'>{t`lanLabelADUserManager`}</option>
                            <option value='Customer Service Rep'>{t`lanLabelADUserCustomerServiceRep`}</option>
                            <option value='Tech Help'>{t`lanLabelADUserTechHelp`}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelSelectStatus`}<span className='mandatory'>*</span></label>
                          <select className='form-control' id='exampleFormControlSelect1' value={this.state.userInfo.userStatus} onChange={this.handleSelectUserStatus} >
                            <option value='Active'>{t`lanLabelADUserActive`}</option>
                            <option value='Inactive'>{t`lanLabelADUserInactive`}</option>
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
                        </div>
                      </div>
                      {/* <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelPassword` }</label>
                          <input type='password' className='form-control' minLength='6' maxLength='20'
                            value={this.state.password} onChange={() => this.setState({ password: event.target.value })} />
                        </div>
                      </div> */}
                    </div>
                  </form>
                  <div className='mb-3'><h3>{t`lanSPSubTitlePropertyLocationDetails`}</h3></div>
                  <form>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelArea`}</label>
                          <input type='text' className='form-control' minLength='3' maxLength='20'
                            value={(this.state.userInfo && this.state.userInfo.area) ? this.state.userInfo.area : ''} onChange={
                              () => {
                                let userInfo = this.state.userInfo
                                userInfo.area = event.target.value
                                this.setState({
                                  userInfo: userInfo, errorMessage: ''
                                })
                              }} onKeyPress={this.handleEnter} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelLandmark`}</label>
                          <input type='text' className='form-control' minLength='3' maxLength='30'
                            value={(this.state.userInfo && this.state.userInfo.landMark) ? this.state.userInfo.landMark : ''} onChange={
                              () => {
                                let userInfo = this.state.userInfo
                                userInfo.landMark = event.target.value
                                this.setState({
                                  userInfo: userInfo, errorMessage: ''
                                })
                              }} onKeyPress={this.handleEnter} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelCity`}</label>
                          <input type='text' className='form-control' minLength='3' maxLength='20'
                            value={(this.state.userInfo && this.state.userInfo.city) ? this.state.userInfo.city : ''} onChange={
                              () => {
                                let userInfo = this.state.userInfo
                                userInfo.city = event.target.value
                                this.setState({
                                  userInfo: userInfo, errorMessage: ''
                                })
                              }} onKeyPress={this.handleEnter} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelZip`}</label>
                          <input type='text' className='form-control' maxLength='6' onKeyPress={this.handleMobileNumKeys}
                            value={(this.state.userInfo && this.state.userInfo.zip) ? this.state.userInfo.zip : ''} onChange={
                            () => {
                              let userInfo = this.state.userInfo
                              userInfo.zip = event.target.value
                              this.setState({
                                userInfo: userInfo, errorMessage: ''
                              })
                            }} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelState`}</label>
                          <select className='form-control' id='exampleFormControlSelect1' onChange={this.handleSelectState} value={this.state.userInfo.state} >
                            <option>{t`lanCommonLabelSelectState`}</option>
                            <option>Telangana</option>
                            <option>Andhra Pradesh</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelCountry`}</label>
                          <select className='form-control' id='exampleFormControlSelect1' defaultValue={this.state.userInfo.country}>
                            <option>India</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-6 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelAddress`}<span className='mandatory'>*</span></label>
                          <textarea className='form-control textarea' minLength='3' maxLength='80' value={(this.state.userInfo && this.state.userInfo.address) ? this.state.userInfo.address : ''} onChange={
                            () => {
                              let userInfo = this.state.userInfo
                              userInfo.address = event.target.value
                              this.setState({
                                userInfo: userInfo, errorMessage: ''
                              })
                            }} onKeyPress={this.handleEnter} />
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
                        <button disabled={this.state.buttonDisabled} className='btn btn-primary btn-round' onClick={this.handleUpdate}>{t`lanCommonButtonUpdate`}</button>
                        <button className='btn btn-danger' onClick={this.props.handleEditUser}>{t`lanCommonButtonBack`}</button>
                        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <FooterComponent /> */}
      </div>
    )
  }
}

export default ADUserEditComponent

ADUserEditComponent.propTypes = {
  UserView: PropTypes.any,
  isUserList: PropTypes.any,
  handleEditUser: PropTypes.any
}
