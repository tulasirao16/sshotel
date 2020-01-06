
/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'

import './login.scss'

class EndUsersLoginOTPValidation extends React.Component {
  constructor () {
    super()
    this.state = {
      otpNumber: '',
      loginMobile: localStorage.getItem('loginMobile'),
      errorMessage: ''
    }

    this.handleEndUserLoginOTP = this.handleEndUserLoginOTP.bind(this)
    this.handleOTPNumKeys = this.handleOTPNumKeys.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleEndUserLoginOTP (event) {
    this.setState({ otpNumber: event.target.value, errorMessage: '' })
  }

  handleOTPNumKeys (event) {
    if ((event.charCode > 31 && event.charCode < 48) ||
    (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }

  handleSubmit (event) {
    const otpNumValid = /^\d{4}$/
    let otpNum = this.state.otpNumber
    if (!otpNum) {
      this.setState({ errorMessage: 'OTP is required' })
    } else if (!otpNumValid.test(otpNum)) {
      this.setState({ errorMessage: 'Inavlid OTP Number' })
    } else {
      this.setState({ errorMessage: '' })
      hashHistory.push('/app')
    }
    event.preventDefault()
  }

  render () {
    return (
      <div >
        <div>
          <div className='main-index-main'>
            <div className='owl-carousel owl-theme'> {/* Your Content Here... */} </div>
            <div className='' id='top'>
              {/* _____________________________ navigation End _______________________________ */}
              <main className='main-content enduser_loginpage'>
                <section className='wb-section ' id='products'>
                  <div className='container '>
                    <div className='row justify-content-center'>
                      <div className='col-md-5'>
                        <div className='card-group login'>
                          <div className='card'>
                            <div className='card-body'>
                              <h3 className='text-center'>Enter OTP Number</h3>
                              <p className='text-muted'>{/* --Style-- */}</p>
                              <form onSubmit={this.handleSubmit}>
                                <div className='otp_div'>
                                  <p>Please enter the OTP sent to <strong> {this.state.loginMobile} </strong> </p>
                                  <div className='input-group mb-4'>
                                    {/* <label>OTP*:</label> Please provide OTP number sent to your mobile number */}
                                    <div className='otp_field'>
                                      <div className='input-group-prepend'> <span className='input-group-text'> <i className='icon-lock' /> </span>
                                        <input type='text' className='form-control' placeholder='OTP' autoComplete='off' maxLength='4' name='endusers-loginotp-validation-name' id='endusers-loginotp-validation-id' value={this.state.otpNumber} onChange={this.handleEndUserLoginOTP} onKeyPress={this.handleOTPNumKeys} />
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-sm-12'>
                                    <label className='warning' >{this.state.errorMessage}</label>
                                  </div>
                                  <button type='submit' className='btn btn-primary px-4' >Verify</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EndUsersLoginOTPValidation
