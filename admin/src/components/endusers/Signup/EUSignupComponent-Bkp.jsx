/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import moment from 'moment'
// import DatePicker from 'react-datepicker'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import './css/EUSignup.css'

class EUSignupComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      fName: '',
      lName: '',
      dob:'',
      address: '',
      maxDate: moment().format('YYYY-MM-DD'),
      fSuccess: true,
      lSuccess: false,
      dobSuccess: false,
      aSuccess: false,
      fError :'',
      lError: '',
      dobError: '',
      aError: '',
      errorMessage: ''
    }
    this.handleSpVerify = this.handleSpVerify.bind(this)
    this.handleEndUserLogin = this.handleEndUserLogin.bind(this)
  }

  handleSpVerify (event) {
    if (!this.state.fName) {
      this.setState({ fError: 'Please Provide First Name', fSuccess: false })
    } else if (!this.state.lName) {
      this.setState({ lError: 'Please Provide Last Name', lSuccess: false })
    } else if (!this.state.dob) {
      this.setState({ dobError: 'Please Provide Date of Birth', dobSuccess: false })
    } else if (!this.state.address) {
      this.setState({ aError: 'Please Provide Address', aSuccess: false })
    } else {
      hashHistory.push('/EnduserVerification')
      event.preventDefault()
    }
  }

  handleEndUserLogin () {
    hashHistory.push('/login')
    event.preventDefault()
  }

  render () {
    return (
      <div className='container pb-5 content enduser-signup'>
        <div className='row justify-content-center'>
          <div className='col-lg-10 col-md-8 text-center'>
            <div className='card signup-card border-0 mb-0'>
              <div className='row flex-row-reverse'>
                <div className='col-lg-5'>
                  <div className='card card-login-form mb-0'>
                    <div className='card-header bg-transparent pb-2'>
                      <h5 className='card-title'>Signup</h5>
                    </div>
                    <div className='card-body px-lg-5 py-lg-3'>
                      <form role='form'>
                        <div className='row '>
                          <div className='col-sm-12 text-left'>
                            <div className='form-group'>
                              <label className='form-control-label '>First Name <span className='error'>*</span></label>
                              <input type='text' autoFocus={this.state.fSuccess} className='form-control' placeholder='First Name' style={this.state.fSuccess ? { borderColor: '#4da424' } : {}}
                                onChange={(e) => this.setState({ fName: e.target.value, fError: '', fSuccess: true })} value={this.state.fName} maxLength={30} />
                              <span className='input-error-icon' ><i className='fas fa-check' style={this.state.fSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.fError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                              <p className='text-muted text-sm'><small style={{ color: 'red' }}>{this.state.fError}</small> </p>
                            </div>
                          </div>
                          <div className='col-md-12 text-left'>
                            <div className='form-group'>
                              <label className='form-control-label'>Last Name <span className='error'>*</span></label>
                              <input type='text' autoFocus={this.state.lSuccess} className='form-control' placeholder='Last Name' style={this.state.lSuccess ? { borderColor: '#4da424' } : {}}
                                onChange={(e) => this.setState({ lName: e.target.value, lError: '', lSuccess: true })} value={this.state.lName} maxLength={30} />
                              <span className='input-error-icon' ><i className='fas fa-check' style={this.state.lSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.lError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                              <p className='text-muted text-sm'><small style={{ color: 'red' }}>{this.state.lError}</small> </p>
                            </div>
                          </div>
                          <div className='col-md-12 col-lg-12 text-left'>
                            <div className='form-group'>
                              <label className='form-control-label'>Date of Birth <span className='error'>*</span></label><br />
                              <DayPickerInput
                                autoFocus={this.state.dobSuccess}
                                className='form-control'
                                style={this.state.dobSuccess ? { borderColor: '#4da424' } : {}}
                                onChange={(e) => this.setState({ dob: e.target.value, dobError: '', dobSuccess: true })}
                                value={this.state.dob}
                                max={this.state.maxDate}
                               />
                              {/* <input type='date' autoFocus={this.state.dobSuccess} className='form-control' style={this.state.dobSuccess ? { borderColor: '#4da424' } : {}}
                                onChange={(e) => this.setState({ dob: e.target.value, dobError: '', dobSuccess: true })} value={this.state.dob} max={this.state.maxDate} /> */}
                              <span className='input-error-icon' ><i className='fas fa-check' style={this.state.dobSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.dobError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                              <p className='text-muted text-sm'><small style={{ color: 'red' }}>{this.state.dobError}</small> </p>
                            </div>
                          </div>
                          <div className='col-md-12 col-lg-12 text-left '>
                            <div className='form-group'>
                              <label className='form-control-label' >Address <span className='error'>*</span></label>
                              <textarea className='form-control' autoFocus={this.state.aSuccess} rows='2' style={this.state.aSuccess ? { borderColor: '#4da424' } : {}}
                                onChange={(e) => this.setState({ address: e.target.value, aError: '', aSuccess: true })} value={this.state.address} />
                              <span className='input-error-icon' ><i className='fas fa-check' style={this.state.aSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.aError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                              <p className='text-muted text-sm'><small style={{ color: 'red' }}>{this.state.aError}</small> </p>
                            </div>
                          </div>
                          <div className='col-lg-12 col-sm-12 text-right'>
                            <button type='button' onClick={this.handleSpVerify} className='btn btn-primary mt-2'>Next</button>
                            <div className='text-right mt-2'>
                              <span className='text-muted text-sm'><small>Do you have an account ? </small> <a style={{ color: '#01a4a2' }} onClick={this.handleEndUserLogin} className='text-underline'> Login</a></span>
                              <p className='text-muted'><small style={{ color: 'red' }}>{this.state.errorMessage}</small> </p>
                            </div>
                          </div>
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
    )
  }
}

export default EUSignupComponent
