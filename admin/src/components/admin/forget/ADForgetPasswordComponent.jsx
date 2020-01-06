import React from 'react'
// import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import { t } from 'ttag'
import './Css/UserLogin.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import ADVerifyOTPComponent from './ADVerifyOTPComponent'

const phRegex = /^\d{10}$/
const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+[.]{1}[a-z]{2,4}$/
class ADForgetPasswordComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      userID:'',
      errorMessage:'',
      isShow:true,
      otpNum:''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSendOTP = this.handleSendOTP.bind(this)
  }

  handleSubmit () {
    if (!this.state.userID) {
      this.setState({ errorMessage: t`lanADErrorLabelMobileorEmailRequired` })
    } else {
      if (isNaN(this.state.userID)) {
        if (!this.state.userID.trim().match(emailRegex)) {
          this.setState({ errorMessage:t`lanADErrorLabelEmailRequired` })
        } else {
          this.handleSendOTP()
        }
      } else {
        if (!this.state.userID.trim().match(phRegex)) {
          this.setState({ errorMessage:t`lanADErrorLabelMobileRequired` })
        } else {
          this.handleSendOTP()
        }
      }
    }
  }

  handleSendOTP () {
    let _this = this
    let sendOtpObj = {
      userId : this.state.userID
    }
    let obj = { url: config.baseUrl + config.postADForgotPasswordOTPSendAPI, body: sendOtpObj }
    APICallManager.postCall(obj, function (resObj) {
      try {
        if (resObj.data.statusCode === '1001') {
          _this.setState({ isShow: false, otpNum: resObj.data.statusResult.otpNumber })
        } else if (resObj.data.statusCode === '9986') {
          _this.setState({ errorMessage:t`lanADErrorLabelRegisterWithMobileOrEmail` })
        }
      } catch (e) {
        console.log('=====AD Login ERROR:', e)
      }
    })
  }
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit()
    }
  }

  render () {
    return (
      <div>
        {this.state.isShow
        ? <div>
          <div className='header py-8 py-lg-7 pt-lg-9 home-header'>
            <div className='separator separator-bottom separator-skew zindex-100'>
              <svg x='0' y='0' viewBox='0 0 2560 100' preserveAspectRatio='none' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                <polygon className='fill-default' points='2560 0 2560 100 0 100' />
              </svg>
            </div>
          </div>
          <div className='container pb-5 forget-content'>
            <div className='row justify-content-center'>
              <div className='col-lg-5 col-md-7 text-center'>
                <div className='card border-0 mb-0'>
                  <div className='card-header bg-transparent pb-3'>
                    <h5 className='card-title' style={{ fontSize: 19 }}>{t`lanADTitleForgotPasword`}</h5>
                  </div>
                  <div className='card-body px-lg-5 py-lg-2'>
                    <div className='row mt-1'>
                      <div className='col-md-12 text-left'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanADLabelEmailOrMobile`} <span className='mandatory'>*</span></label>
                          <input type='text' autoFocus className='form-control' id='userID' value={this.state.userID} placeholder={t`lanADForgetLabelTooltipUserID`}
                            onChange={(e) => this.setState({ userID:e.target.value, errorMessage:'' })} maxLength={80} onKeyPress={this.handleKeyPress} />
                        </div>
                        <p className='errorMessage'>{this.state.errorMessage}</p>
                      </div>
                    </div>
                    <div className='row mt-4'>
                      <div className='col-md-6 text-left'>
                        <div className='mb-4'>
                          <button type='button' onClick={this.handleSubmit} className='btn btn-primary'>{t`lanADButtonSendOTP`}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> : <div>
          <ADVerifyOTPComponent otpNumProp={this.state.otpNum} />
        </div> }
      </div>
    )
  }
}

export default ADForgetPasswordComponent

