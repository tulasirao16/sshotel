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
import { t } from 'ttag'

import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ADHostsEditHostComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      password: '',
      userInfo: {},
      oldUserInfo: {},
      errorMessage: '',
      buttonDisable: false
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
    let userInfo = JSON.parse(localStorage.getItem('hostData'))
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

  handleChangeDate (date) {
    this.setState(prevState => {
      let userInfo = Object.assign({}, prevState.userInfo)
      let errorMessage = ''
      userInfo.dob = date
      return { userInfo, errorMessage }
    })
  }
  handleBack () {
    hashHistory.push('/admin/hosts')
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
      userInfo.status = event.target.value
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

  handleUpdate () {
    const emailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/
    const phValidation = /^\d{10}$/
    if (!this.state.userInfo.serviceProvider.trim()) {
      this.setState({ errorMessage: 'Business Name is required' })
    } else if (!this.state.userInfo.contactPerson.trim()) {
      this.setState({ errorMessage: 'Contact Person is required' })
    } else if (!this.state.userInfo.contactNumber) {
      this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired` })
    } else if (!phValidation.test(this.state.userInfo.contactNumber)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber` })
    } else if (!this.state.userInfo.contactEmail) {
      this.setState({ errorMessage: t`lanSPLabelErrorEmailRequired` })
    } else if (!emailValidation.test(this.state.userInfo.contactEmail)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else if (this.state.password && this.state.password.length < 6) {
      this.setState({ errorMessage: t`lanSPLabelErrorPasswordMinLength` })
    } else if (!this.state.userInfo.contactAddress.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAdressRequired` })
    } else {
      this.setState({ buttonDisable: true })
      if (this.state.password.length > 0) {
        if (this.state.password.trim() === '') {
          var isUpdate = JSON.stringify(this.state.oldUserInfo) === JSON.stringify(this.state.userInfo)
          if (isUpdate) {
            hashHistory.push('/admin/hosts')
          } else {
            this.handleApiCall()
          }
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
    var hostData = {
      serviceProvider: this.state.userInfo.serviceProvider,
      contactPerson: this.state.userInfo.contactPerson,
      contactNumber: this.state.userInfo.contactNumber,
      contactEmail: this.state.userInfo.contactEmail,
      userStatus: this.state.userInfo.status,
      area: this.state.userInfo.area,
      landmark: this.state.userInfo.landmark,
      contactAddress: this.state.userInfo.contactAddress,
      city: this.state.userInfo.city,
      state: this.state.userInfo.state,
      zip: this.state.userInfo.zip,
      appPercentage: this.state.userInfo.appPercentage,
      areaLocality: this.state.userInfo.areaLocality
    }
    let _this = this
    let obj = { url: config.baseUrl + config.putADHostsEditHostAPI + this.state.userInfo._id, body: hostData }
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        ToastsStore.success('User Updated Successfully')
        setTimeout(() => {
          hashHistory.push('/admin/hosts')
        }, 2000)
      } else {
        _this.setState({ buttonDisable: false })
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
                  <h5 className='card-title'>{ t`lanADLabelHostsEditHost` }</h5>
                </div>
                <div className='card-body px-lg-4 py-lg-4'>
                  <form>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanSPLabelBusinessName` }<span className='mandatory'>*</span></label>
                          <input type='text' className='form-control' minLength='3' maxLength='20' value={this.state.userInfo.serviceProvider} onChange={
                            () =>
                              this.setState(prevState => {
                                let userInfo = Object.assign({}, prevState.userInfo)
                                let errorMessage = ''
                                userInfo.serviceProvider = event.target.value
                                return { userInfo, errorMessage }
                              })
                            } />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelContactPerson` }<span className='mandatory'>*</span></label>
                          <input type='text' className='form-control' minLength='3' maxLength='20'
                            value={(this.state.userInfo && this.state.userInfo.contactPerson) ? this.state.userInfo.contactPerson : ''} onChange={
                              () =>
                                this.setState(prevState => {
                                  let userInfo = Object.assign({}, prevState.userInfo)
                                  let errorMessage = ''
                                  userInfo.contactPerson = event.target.value
                                  return { userInfo, errorMessage }
                                })
                              } />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelPassword` }</label>
                          <input type='password' className='form-control' minLength='6' maxLength='20'
                            value={this.state.password} onChange={() => this.setState({ password: event.target.value.replace(/\s/g, '') })} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelMobileNumber` }<span className='mandatory'>*</span></label>
                          <input type='text' className='form-control' maxLength='10' pattern='\d{10}' value={this.state.userInfo.contactNumber} onKeyPress={this.handleMobileNumKeys} onChange={
                              () => {
                                if (event.target.value) {
                                  this.setState(prevState => {
                                    let userInfo = Object.assign({}, prevState.userInfo)
                                    let errorMessage = ''
                                    userInfo.contactNumber = event.target.value.match(/\d+/g).toString().replace(/,/g, '')
                                    return { userInfo, errorMessage }
                                  })
                                } else {
                                  this.setState(prevState => {
                                    let userInfo = Object.assign({}, prevState.userInfo)
                                    let errorMessage = ''
                                    userInfo.contactNumber = event.target.value
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
                          <label>{ t`lanCommonLabelEmail` }<span className='mandatory'>*</span></label>
                          <input type='text' className='form-control' minLength='3' maxLength='80' value={this.state.userInfo.contactEmail} onChange={
                            () =>
                              this.setState(prevState => {
                                let userInfo = Object.assign({}, prevState.userInfo)
                                let errorMessage = ''
                                userInfo.contactEmail = event.target.value
                                return { userInfo, errorMessage }
                              })
                            } />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelSelectStatus` }<span className='mandatory' /></label>
                          <select className='form-control' id='exampleFormControlSelect' onChange={this.handleSelectUserStatus} value={this.state.userInfo.status}>
                            <option value='Active'>{ t`lanLabelADUserActive` }</option>
                            <option value='Inactive'>{ t`lanLabelADUserInactive` }</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>App Percentage<span className='mandatory'>*</span></label>
                          <input type='text' className='form-control' minLength='3' maxLength='80' value={this.state.userInfo.appPercentage} onChange={
                            () =>
                              this.setState(prevState => {
                                let userInfo = Object.assign({}, prevState.userInfo)
                                let errorMessage = ''
                                userInfo.appPercentage = event.target.value
                                return { userInfo, errorMessage }
                              })
                            } />
                        </div>
                      </div>
                    </div>
                    {/* <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelSelectStatus` }<span className='mandatory'>*</span></label>
                          <select className='form-control' id='exampleFormControlSelect1' onChange={this.handleSelectUserStatus} value={this.state.userInfo.userStatus}>
                            <option value='Active'>Active</option>
                            <option value='Inactive'>Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div> */}
                  </form>
                  <hr />
                  <div className='mb-3'><h3>{t`lanSPSubTitlePropertyLocationDetails`}</h3></div>
                  <form>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelArea` }</label>
                          <input type='text' className='form-control' minLength='3' maxLength='20'
                            value={(this.state.userInfo && this.state.userInfo.area) ? this.state.userInfo.area : ''} onChange={
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
                          <label>{ t`lanCommonLabelCity` }</label>
                          <input type='text' className='form-control' minLength='3' maxLength='20'
                            value={(this.state.userInfo && this.state.userInfo.city) ? this.state.userInfo.city : ''} onChange={
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
                          <label>{ t`lanCommonLabelZip` }</label>
                          <input type='text' className='form-control' maxLength='6' pattern='\d{6}'  value={(this.state.userInfo && this.state.userInfo.zip) ? this.state.userInfo.zip : ''} onKeyPress={this.handleMobileNumKeys} onChange={
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
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanSPLabelAreaLocality` }</label>
                          <input type='text' className='form-control' minLength='3' maxLength='30'
                            value={(this.state.userInfo && this.state.userInfo.areaLocality) ? this.state.userInfo.areaLocality : ''} onChange={
                            () =>
                              this.setState(prevState => {
                                let userInfo = Object.assign({}, prevState.userInfo)
                                let errorMessage = ''
                                userInfo.areaLocality = event.target.value
                                return { userInfo, errorMessage }
                              })
                            } />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelLandmark` }</label>
                          <input type='text' className='form-control' minLength='3' maxLength='30'
                            value={(this.state.userInfo && this.state.userInfo.landmark) ? this.state.userInfo.landmark : ''} onChange={
                            () =>
                              this.setState(prevState => {
                                let userInfo = Object.assign({}, prevState.userInfo)
                                let errorMessage = ''
                                userInfo.landmark = event.target.value
                                return { userInfo, errorMessage }
                              })
                            } />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelState` }</label>
                          <select className='form-control' id='exampleFormControlSelect1' onChange={this.handleSelectState} value={this.state.userInfo.state} >
                            <option>{ t`lanCommonLabelSelectState` }</option>
                            <option>Telangana</option>
                            <option>Andhra Pradesh</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-6 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelAddress` }<span className='mandatory'>*</span></label>
                          <textarea className='form-control textarea' minLength='3' maxLength='80' value={(this.state.userInfo && this.state.userInfo.contactAddress) ? this.state.userInfo.contactAddress : ''} onChange={
                            () =>
                              this.setState(prevState => {
                                let userInfo = Object.assign({}, prevState.userInfo)
                                let errorMessage = ''
                                userInfo.contactAddress = event.target.value
                                return { userInfo, errorMessage }
                              })
                            } />
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
                        <button disabled={this.state.buttonDisable} className='btn btn-primary btn-round' onClick={this.handleUpdate}>{t`lanCommonButtonUpdate`}</button>
                        <button className='btn btn-danger' onClick={this.handleBack}>{t`lanCommonButtonBack`}</button>
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

export default ADHostsEditHostComponent
