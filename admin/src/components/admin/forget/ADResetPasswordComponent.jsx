import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import './Css/UserLogin.css'
import { t } from 'ttag'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class ADResetPasswordComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      password:'',
      errorPassword:''
    }
    this.handleReset = this.handleReset.bind(this)
  }
  handleReset () {
    if (!this.state.password) {
      this.setState({ errorPassword:t`lanADErrorLabelResetNewPasswordRequired` })
    } else if (this.state.password.length < 6) {
      this.setState({ errorPassword: t`lanADErrorLabelResetPasswordMinLength` })
    } else {
      let putObj = {
        url: config.baseUrl + config.putADForgotPasswordResetPasswordAPI,
        body: {
          newPassword: this.state.password
        }
      }
      let _this = this
      APICallManager.putCall(putObj, function (resObj) {
        try {
          if (resObj.data.statusCode === '1012') {
            localStorage.clear()
            hashHistory.push('/admin')
          } else {
            _this.setState({ errorPassword: t`lanADErrorLabelResetPasswordUpdateFailed` })
          }
        } catch (error) {
          console.log('=====Reset ERROR:', error)
        }
      })
    }
    event.preventDefault()
  }
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleReset()
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
                  <h5 className='card-title' style={{ fontSize: 19 }}>{t`lanADTitleResetPasword`}</h5>
                </div>
                <div className='card-body px-lg-5 py-lg-2'>
                  <div className='row mt-1'>
                    <div className='col-md-12 text-left'>
                      <div className='form-group'>
                        <label className='form-control-label'>{t`lanADResetLabelEnterNewPassword`} <span className='mandatory'>*</span></label>
                        <input type='password' autoFocus className='form-control' id='password' value={this.state.password} placeholder={t`lanADResetLabelTooltippassword`}
                          onChange={(e) => this.setState({ password:e.target.value, errorPassword:'' })} maxLength={20} onKeyPress={this.handleKeyPress} />
                      </div>
                      <p className='errorMessage'>{this.state.errorPassword}</p>
                    </div>
                  </div>
                  <div className='row mt-4'>
                    <div className='col-md-6 text-left'>
                      <div className='mb-4'>
                        <button type='button' onClick={this.handleReset} className='btn btn-primary'>{t`lanADButtonReset`}</button>
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
export default ADResetPasswordComponent
