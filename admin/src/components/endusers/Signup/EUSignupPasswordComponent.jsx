/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import { hashHistory } from 'react-router'
import './css/EUSignup.css'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import { t } from 'ttag'

class EUSignupPasswordComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = props.stateData
    this.handleSignupSubmit = this.handleSignupSubmit.bind(this)
  }

  handleSignupSubmit (event) {
    if (!this.state.password) {
      this.setState({ pError: t`lanEULabelErrorPleaseEnterPassword`, pSuccess: false })
    } else if (this.state.password.length < 6) {
      this.setState({ pError: t`lanEULabelErrorPasswordMinLength`, pSuccess: false })
    } else {
      let _this = this
      let userData = {
        mobileNumber: this.state.mobileNumber,
        password: this.state.password,
        deviceToken: 'null'
      }
      let obj = { url: config.baseUrl + config.postEUUserSignupAPI, body: userData }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ errorMessage: '' })
          hashHistory.push('/login')
        } else {
          _this.setState({ errorMessage: t`lanEULabelErrorUserSignupFailed` })
        }
      })
    }
    event.preventDefault()
  }

  render () {
    return (
      <div className='container pb-5 pt-5 eu-content'>
        <div className='row justify-content-center'>
          <div className='col-lg-6 col-md-8'>
            <div className='card border-0 mb-0'>
              <div className='card-header bg-transparent text-center pb-3'>
                <h5 className='card-title'>{ t`lanEUTitleSignup` }</h5>
              </div>
              <div className='card-body px-lg-3 signup-verify'>
                <form role='form'>
                  <div className='text-center mb-3'>
                    {/* <h4 className='heading'>Hi,</h4> */}
                    <small>{ t`lanEULabelErrorSetPassword` }</small>
                  </div>
                  <div className='px-lg-7 '>
                    <div className='form-group'>
                      <label className='form-control-label'>{ t`lanCommonLabelPassword` }*</label>
                      <input className='form-control tel-input eu-font' placeholder={t`lanEULabelEnterPassword`} style={this.state.pSuccess ? { borderColor: '#4da424' } : {}}
                        type={this.state.showPassword ? 'password' : 'text'} value={this.state.password} maxLength={20}
                        onChange={() => this.setState({ password: event.target.value, pError: '', pSuccess: true })} />
                      <a onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                        <span style={{ position:'absolute', right:20, bottom: 40 }}>
                          <i className={!this.state.showPassword ? 'far fa-eye' : 'far fa-eye-slash'} />
                        </span>
                      </a>
                      {/* <input type={this.state.passwordType} className='form-control tel-input eu-font' placeholder='Enter Password' style={this.state.pSuccess ? { borderColor: '#4da424' } : {}}
                        value={this.state.password} onChange={(e) => this.setState({ password: e.target.value, pError: '', pSuccess: true })} maxLength={20} /> */}
                      <span className='input-error-icon' ><i className='fas fa-check' style={this.state.pSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                      <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.pError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                      <p className='text-muted' style={{ height:30 }}><small style={{ color: 'red' }}>{this.state.pError}</small> </p>
                    </div>
                  </div>
                  <label className='text-danger text-center'>{this.state.errorMessage}</label>
                  <div>
                    <div className='text-center'>
                      <button type='button' className='btn btn-primary mt-2' onClick={this.handleSignupSubmit}>{ t`lanEUButtonSubmit` }</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

EUSignupPasswordComponent.propTypes = {
  stateData: PropTypes.any
}
export default EUSignupPasswordComponent
