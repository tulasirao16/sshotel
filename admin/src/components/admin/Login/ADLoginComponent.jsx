/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import { t } from 'ttag'
import './Css/UserLogin.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class ADLoginComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      name:'',
      errorName:'',
      password:'',
      errorPassword:'',
      errorMessage: ''
    }
    this.handleLogin = this.handleLogin.bind(this)
  }
  componentWillMount () {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && (authObj.userRole === 'Super Admin' || authObj.userRole === 'Tech Help')) {
      hashHistory.push('/admin/home')
    } else if (authObj && authObj.userType) {
      this.setState({ errorMessage:t`lanEULabelErrorLoggedInHost` })
    } else if (authObj && authObj.userRole === 'Customer') {
      this.setState({ errorMessage:t`lanEULabelErrorLoggedInEndUser` })
    }
    document.addEventListener('keypress', this.boundEnter)
  }
  componentWillUnmount () {
    document.removeEventListener('keypress', this.boundEnter)
  }
  boundEnter = target => {
    if (target.charCode === 13) {
      this.handleLogin()
    }
  }
  handleLogin () {
    if (!this.state.name.trim()) {
      this.setState({ errorName:t`lanADErrorLabelUserIDEmailOrMobile` })
    } else if (!this.state.password.trim()) {
      this.setState({ errorPassword:t`lanADErrorLabelPasswordRequired` })
    } else {
      let _this = this
      let loginObj = {
        userID: this.state.name,
        password: this.state.password,
        appType: config.appType
      }
      let obj = { url: config.baseUrl + config.postADUserLoginAPI, body: loginObj }
      APICallManager.postCall(obj, function (resObj) {
        try {
          if (resObj.data.statusCode === '1000') {
            localStorage.setItem('authObj', JSON.stringify(resObj.data.statusResult))
            hashHistory.push('/admin/home')
          } else {
            _this.setState({ errorMessage: t`lanADErrorLabelInvalidLogin` })
          }
        } catch (e) {
          console.log('=====EU Login ERROR:', e)
        }
      })
    }
  }
  render () {
    return (
      <div>
        <div className='header py-8 py-lg-7 pt-lg-9 home-header'>
          <div className='separator separator-bottom separator-skew zindex-100'>
            <svg x='0' y='0' viewBox='0 0 2560 100' preserveAspectRatio='none' version='1.1' xmlns='http://www.w3.org/2000/svg'>
              <polygon className='fill-default' points='2560 0 2560 100 0 100' />
            </svg>
          </div>
        </div>
        <div className='container pb-5 content'>
          <div className='row justify-content-center'>
            <div className='col-lg-5 col-md-7 text-center'>
              <div className='card border-0 mb-0'>
                <div className='card-header bg-transparent pb-3'>
                  <h5 className='card-title' style={{ fontSize: 19 }}>{t`lanADTitleLogin`}</h5>
                </div>
                <div className='card-body px-lg-5 py-lg-2'>
                  <div className='row mt-1'>
                    <div className='col-md-12 text-left'>
                      <div className='form-group'>
                        <label className='form-control-label'>{t`lanADLabelUserID`} <span className='mandatory'>*</span></label>
                        <input type='text' className='form-control' id='name' value={this.state.name} placeholder={t`lanADLabelTooltipUserID`}
                          onChange={(e) => this.setState({ name:e.target.value, errorName:'' })} maxLength={80} />
                        <p className='errorMessage'>{this.state.errorName}</p>
                      </div>
                    </div>
                    <div className='col-md-12 text-left'>
                      <div className='form-group' style={{ marginBottom: '0.3rem' }}>
                        <label className='form-control-label'>{t`lanADLabelPassword`}<span className='mandatory'>*</span></label>
                        <input type='password' className='form-control' id='password' value={this.state.password} placeholder={t`lanADLabelTooltipPassword`}
                          onChange={(e) => { this.setState({ password:e.target.value, errorPassword:'' }) }} maxLength={20} />
                        <p className='errorMessage'>{this.state.errorPassword}</p>
                      </div>
                    </div>
                  </div>
                  <label className='text-danger'>{this.state.errorMessage}</label>
                  <div className='row mt-4'>
                    <div className='col-md-6 text-left'>
                      <div className='mb-4'>
                        <button type='button' onClick={this.handleLogin} className='btn btn-primary'>{t`lanADButtonLogin`}</button>
                      </div>
                    </div>
                    <div className='col-md-6 text-right mb-2'>
                      <a onClick={() => hashHistory.push('/admin/forgetpassword')} className='text-underline forget-pawd'><u>{t`lanADButtonForgotPassword`}</u></a>
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

export default ADLoginComponent
