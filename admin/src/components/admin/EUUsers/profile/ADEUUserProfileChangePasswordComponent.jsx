/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import 'react-drawer/lib/react-drawer.css'

import config from '../../../../../public/config.json'
import './css/Profile.css'
import APICallManager from '../../../../services/callmanager'

class ADEUUserProfileChangePasswordComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      euUserData: JSON.parse(localStorage.getItem('euUserData')),
      currentPassword: '',
      newPassword: '',
      showPassword: false,
      errorMessageOne: '',
      errorMessageTwo: '',
      successTickCpwd: false,
      successTickNpwd: false,
      buttonDisabled:false
    }
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  handleNameNumKeys (event) {
    if (event.charCode === 32 || event.charCode === 13) {
      event.preventDefault()
    }
  }

  handleUpdate () {
    if (!this.state.newPassword) {
      this.setState({ errorMessageTwo: t`lanEULabelErrorEnterNewPassword` })
    } else if (this.state.newPassword.length < 6) {
      this.setState({ errorMessageTwo: t`lanSPLabelErrorPasswordMinLength` })
    } else {
      this.setState({ buttonDisabled: true })
      let updateData = {
        newPassword: this.state.newPassword
      }
      let _this = this
      let obj = { url: config.baseUrl + config.putADEUUserProfileChangePasswordAPI + this.state.euUserData._id, body: updateData }
      APICallManager.putCall(obj, function (res) {
        if (res.data.statusCode === '1012') {
          _this.props.toastFunc('Password Updated Successfully')
          setTimeout(() => {
            _this.props.handleHome()
          }, 2000)
        } else {
          _this.setState({ buttonDisabled: false })
          _this.props.toastFunc('Password Update Failed')
        }
      })
    }
  }

  render () {
    return (
      <div className='main-content' id='panel'>
        <div className='container-fluid mt-5 pb-5'>
          <div className='edit-profile-info preference'>
            <div className='card'>
              <div className='card-header card-header-danger'>
                <h4 className='card-title'>{ t`lanADTitlePaswordReset` }</h4>
              </div>
              <div className='edit-profile-form '>
                <div className='card-body '>
                  <form>
                    {/* <div className='row'>
                      <div className='col-md-6 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelCurrentPassword` }</label>
                          <input type='password' className='form-control' id='currentPassword' value={this.state.currentPassword} onKeyPress={this.handleNameNumKeys}
                            onChange={() => this.setState({ currentPassword: event.target.value, errorMessageOne: '', successTickCpwd: event.target.value.length >= 6 })} />
                          <span className='input-error-icon-cp' ><i className='fas fa-check' style={this.state.successTickCpwd ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                          <span className='input-error-icon-cp' ><i className='far fa-times-circle' style={this.state.errorMessageOne ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='error errorMessage' >{this.state.errorMessageOne}</p>
                        </div>
                      </div>
                    </div> */}
                    <div className='row'>
                      <div className='col-md-6 pr-1'>
                        <div className='form-group'>
                          <label>{ t`lanADTitlePaswordReset` }</label>
                          <input autoFocus type={this.state.showPassword ? 'text' : 'password'} className='form-control' placeholder=''
                            id='newPassword' value={this.state.newPassword} maxLength={20} onKeyPress={this.handleNameNumKeys}
                            onChange={() => this.setState({ newPassword: event.target.value, errorMessageTwo: '', successTickNpwd: event.target.value.length >= 6 })} />
                          <a onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                            <span style={{ position:'absolute', right:10, bottom: 10, top: 35 }}>
                              <i className={this.state.showPassword ? 'far fa-eye' : 'far fa-eye-slash'} />
                            </span>
                          </a>
                          <span className='input-error-icon-cpn' ><i className='fas fa-check' style={this.state.successTickNpwd ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                          <span className='input-error-icon-cpn' ><i className='far fa-times-circle' style={this.state.errorMessageTwo ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='error errorMessage' >{this.state.errorMessageTwo}</p>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className='row'>
                    <div className='container'>
                      <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                    </div>
                  </div>
                  <div className=' row'>
                    <div className='col-sm-12 text-center' >
                      <button disabled={this.state.buttonDisabled} className='btn btn-primary text-white' onClick={this.handleUpdate}>{ t`lanCommonButtonUpdate` }</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ADEUUserProfileChangePasswordComponent.propTypes = {
  handleHome: PropTypes.func,
  toastFunc: PropTypes.any
}
export default ADEUUserProfileChangePasswordComponent
