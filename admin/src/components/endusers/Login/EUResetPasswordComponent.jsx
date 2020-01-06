/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import './Css/EULogin.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class EuResetPasswordComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      newPassword: '',
      showPassword: false,
      errorMessage: ''
    }
    this.handleResetPasswordDone = this.handleResetPasswordDone.bind(this)
  }

  componentWillMount () {
    localStorage.removeItem('forgotPasswordObj')
  }

  handleResetPasswordDone (event) {
    if (!this.state.newPassword) {
      this.setState({ errorMessage: t`lanEULabelEnterNewPassword` })
    } else if (this.state.newPassword.length < 6) {
      this.setState({ errorMessage: t`lanEULabelErrorPasswordMinLength` })
    } else {
      let putObj = {
        url: config.baseUrl + config.putEUForgotPasswordResetPasswordAPI,
        body: {
          newPassword: this.state.newPassword
        }
      }
      let _this = this
      APICallManager.putCall(putObj, function (resObj) {
        try {
          if (resObj.data.statusCode === '1256') {
            localStorage.clear()
            hashHistory.push('/login')
          } else {
            _this.setState({ errorMessage: t`lanEULabelErrorPasswordUpdateFailed` })
          }
        } catch (error) {
          console.log('=====Reset ERROR:', error)
        }
      })
    }
    event.preventDefault()
  }

  render () {
    return (
      <div>
        <div className='container pb-5 pt-7 eu-content'>
          <div className='row justify-content-center'>
            <div className='col-lg-5 col-md-8 text-center'>
              <div className='card border-0 mb-0 resetPassword'>
                <div className='card-header bg-transparent pb-3'>
                  <h5 className='card-title'>{t`lanEUTitleResetPasword`}</h5>
                </div>
                <div className='card-body px-lg-5 py-lg-3'>
                  <form role='form'>
                    <div className='row mt-1'>
                      <div className='col-md-12 text-left'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanEULabelEnterNewPassword`}<span className='mandatory'>*</span></label>
                          <input autoFocus type={this.state.showPassword ? 'text' : 'password'} className='form-control' placeholder={t`lanEULabelEnterNewPassword`}
                            value={this.state.newPassword} onChange={(e) => this.setState({ newPassword: e.target.value, errorMessage: '' })} maxLength={20} />
                          <span className='input-error-icon' ><i className='ni ni-fat-remove' style={this.state.errorMessage ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <a onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                            <span style={{ position:'absolute', right:10, bottom: 10 }}>
                              <i className={this.state.showPassword ? 'far fa-eye' : 'far fa-eye-slash'} />
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <p className='text-muted'><small style={{ color: 'red' }}>{this.state.errorMessage}</small> </p>
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
    )
  }
}

export default EuResetPasswordComponent
