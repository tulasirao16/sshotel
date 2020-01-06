/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import PropTypes from 'prop-types'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import SPHeaderComponent from '../../../components/serviceproviders/HeaderCompnt/Header'

class SPSetPasswordComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      newPassword: '',
      showPassword: false,
      errorMessage: '',
      token: ''
    }
    this.handleResetPasswordDone = this.handleResetPasswordDone.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
  }

  handleSignIn () {
    hashHistory.push('/host/signin')
  }

  componentWillMount () {
    let paymentResHash = this.props && this.props.params ? this.props.params.token : ''
    this.setState({ token: paymentResHash })
  }

  handleResetPasswordDone (event) {
    if (!this.state.newPassword) {
      this.setState({ errorMessage: t`lanSPLabelEnterNewPassword` })
    } else if (this.state.newPassword.length < 6) {
      this.setState({ errorMessage: t`lanSPLabelErrorPasswordMinLength` })
    } else {
      let putObj = {
        url: config.baseUrl + config.putSPNewUserSetPassworddAPI,
        body: {
          password: this.state.newPassword,
          token: this.state.token
        }
      }
      let _this = this
      APICallManager.putCall(putObj, function (resObj) {
        try {
          if (resObj.data.statusCode === '1012') {
            localStorage.clear()
            hashHistory.push('/host/signin')
          } else {
            _this.setState({ errorMessage: t`lanSPLabelErrorPasswordUpdateFailed` })
          }
        } catch (error) {
          console.log('=====Reset ERROR:', error)
        }
      })
    }
    event.preventDefault()
  }
  handleEnter (e) {
    if (e.key === 'Enter') {
      this.handleResetPasswordDone(event)
      e.preventDefault()
    }
  }

  render () {
    return (
      <div className='login-page'>
        <div className='body-main'>
          <SPHeaderComponent />
          <div className='container'>
            <div className='row login-box'>
              <div>
                <div className='card border-0 mb-0'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='bg-img'>
                        <h3>{t`lanSPTitleWelcome`} <br /><span style={{ fontSize:30, fontWeight:500 }}>{t`lanSPTitleAMToPM`}</span></h3>
                        <p>{t`lanSPTitleTo`}</p>
                        {/* <a className='btn-outline' onClick={this.handleSignIn}>{t`lanSPButtonSignin`}</a> */}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='login-inner-form'>
                        <div className='details'>
                          <div className='text-center'><h3>{t`lanEULabelErrorSetPassword`}</h3></div>
                          <form role='form'>
                            <div className='form-group'>
                              <label className='form-control-label'>{t`lanSPLabelEnterNewPassword`}<span className='mandatory'>*</span></label>
                              <input autoFocus type={this.state.showPassword ? 'text' : 'password'} className='input-text'
                                onKeyPress={this.handleEnter} value={this.state.newPassword} onChange={(e) => this.setState({ newPassword: e.target.value, errorMessage: '' })} maxLength={20} />
                              <span className='input-error-icon' ><i className='ni ni-fat-remove' style={this.state.errorMessage ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                              <a onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                                <span style={{ position:'absolute', right:10, bottom: 10 }}>
                                  <i className={this.state.showPassword ? 'far fa-eye' : 'far fa-eye-slash'} />
                                </span>
                              </a>
                            </div>
                            <p className='text-muted text-center'><small style={{ color: 'red' }}>{this.state.errorMessage}</small> </p>
                            <div className='text-center'>
                              <button type='button' className='btn btn-primary mt-2' onClick={this.handleResetPasswordDone}>{t`lanCommonButtonDone`}</button>
                            </div>
                          </form>
                        </div>
                      </div>
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

SPSetPasswordComponent.propTypes = {
  params: PropTypes.any
}
export default SPSetPasswordComponent
