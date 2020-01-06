import React from 'react'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import './Css/UserLogin.css'
import PropTypes from 'prop-types'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import ADResetPasswordComponent from './ADResetPasswordComponent'

class ADVerifyOTPComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      otpNumber: '',
      otpNumber01: '',
      otpNumber02: '',
      otpNumber03: '',
      otpNumber04: '',
      errorMessage: '',
      isShow:true
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit (event) {
    let otpNumber = this.state.otpNumber01 + this.state.otpNumber02 + this.state.otpNumber03 + this.state.otpNumber04
    if (!otpNumber) {
      this.setState({ errorMessage:t`lanADErrorLabelEnterOTP` })
    } else if (otpNumber.length < 4) {
      this.setState({ errorMessage:t`lanADErrorLabelOTP` })
    } else {
      let postObj = {
        url:config.baseUrl + config.postADForgotPasswordOTPVerifyAPI,
        body:{ otp: otpNumber }
      }
      let _this = this
      APICallManager.postCall(postObj, function (resObj) {
        try {
          if (resObj.data.statusCode === '1002') {
            _this.setState({ isShow:false })
          } else {
            _this.setState({ errorMessage:t`lanADErrorLabelInvalidOTP` })
          }
        } catch (error) {
          console.log('=====ERROR:', error)
        }
      })
    }
    event.preventDefault()
  }

  render () {
    return (
      <div>
        {this.state.isShow === true
        ? <div>
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
                    <h5 className='card-title' style={{ fontSize: 19 }}>{t`lanADTitlePleaseEnterOTP`}</h5>
                  </div>
                  <div className='card-body px-lg-5 py-lg-2'>
                    <div className='row mt-1'>
                      <div className='col-md-12 text-left'>
                        <div className='form-group'>
                          <div>
                            <div className='form-row'>
                              <div className='col-md-3 col-3'>
                                <input type='text' autoFocus className='form-control text-center' ref='otpNumber01' maxLength={1} onChange={
                                  event => {
                                    this.setState({ otpNumber01: event.target.value, errorMessage: '' })
                                    if (event.target.value && event.target.value.length === 1) {
                                      this.refs.otpNumber02.focus()
                                    }
                                  }} />
                              </div>
                              <div className='col-md-3 col-3'>
                                <input type='text' className='form-control text-center' ref='otpNumber02' maxLength={1} onChange={
                                  event => {
                                    this.setState({ otpNumber02: event.target.value, errorMessage: '' })
                                    if (event.target.value && event.target.value.length === 1) {
                                      this.refs.otpNumber03.focus()
                                    }
                                  }} />
                              </div>
                              <div className='col-md-3 col-3'>
                                <input type='text' className='form-control text-center' ref='otpNumber03' maxLength={1} onChange={
                                  event => {
                                    this.setState({ otpNumber03: event.target.value, errorMessage: '' })
                                    if (event.target.value && event.target.value.length === 1) {
                                      this.refs.otpNumber04.focus()
                                    }
                                  }} />
                              </div>
                              <div className='col-md-3 col-3'>
                                <input type='text' className='form-control text-center' ref='otpNumber04' maxLength={1} onChange={
                                  event => {
                                    this.setState({ otpNumber04: event.target.value, errorMessage: '' })
                                    if (event.target.value && event.target.value.length === 1) {
                                      this.refs.otpNumberSubmit.focus()
                                    }
                                  }} />
                              </div>
                            </div>
                            <p className='errorMessage'>{this.state.errorMessage}</p>
                          </div>
                        </div>
                        <div className='row mt-4'>
                          <div className='col-md-6 text-left'>
                            <div className='mb-4'>
                              <button type='button' ref='otpNumberSubmit' onClick={this.handleSubmit} className='btn btn-primary'>{t`lanADButtonDone`}</button>
                            </div>
                            <div className='text-center mt-2'>
                              <div className='h4 font-weight-300'>
                                <p>OTP:{this.props.otpNumProp}</p>
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
          </div>
        </div>
        : <div><ADResetPasswordComponent /></div>
      }
      </div>
    )
  }
}

ADVerifyOTPComponent.propTypes = {
  otpNumProp: PropTypes.any
}
export default ADVerifyOTPComponent
