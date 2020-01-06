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

const phRegex = /^\d{10}$/
const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/

class EUSignupVerificationComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stateData: props.stateData,
      userID: '',
      uError: '',
      uSuccess: '',
      password: '',
      pError: '',
      pSuccess: '',
      mobile: '',
      mVerifyStatus: false,
      mError: '',
      mSuccess: '',
      email: '',
      eVerifyStatus: false,
      eError: '',
      eSuccess: '',
      svErrorMessage: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }

  handleSubmit (event) {
    if (!this.state.userID.trim()) {
      this.setState({ uError: 'Please enter user id', uSuccess: false })
    } else if (!this.state.mobile.trim()) {
      this.setState({ mError: 'Please enter mobile number', mSuccess: false })
    } else if (!this.state.mobile.trim().match(phRegex)) {
      this.setState({ mError: 'Invalid mobile number', mSuccess: false })
    } else if (!this.state.email.trim()) {
      this.setState({ eError: 'Please enter email', eSuccess: false })
    } else if (!this.state.email.trim().match(emailRegex)) {
      this.setState({ eError: 'Invalid email', eSuccess: false })
    } else if (!this.state.password) {
      this.setState({ pError: 'Please enter password', pSuccess: false })
    } else if (this.state.password.length < 6) {
      this.setState({ pError: 'Password should contain minimum 6 characters', pSuccess: false })
    } else if (!this.state.mVerifyStatus) {
      this.setState({ svErrorMessage: 'Please verify mobile number' })
    } else if (!this.state.eVerifyStatus) {
      this.setState({ svErrorMessage: 'Please verify email' })
    } else {
      hashHistory.push('/EnduserIdDetails')
    }
    event.preventDefault()
  }
  handleBack () {
    this.props.handleBack()
  }

  render () {
    return (
      <div>
        <div className='container pb-5 content'>
          <div className='row justify-content-center'>
            <div className='col-lg-6 col-md-8'>
              <div className='card border-0 mb-0'>
                <div className='card-header bg-transparent text-center pb-3'>
                  <h5 className='card-title'>Signup</h5>
                </div>
                <div className='card-body px-lg-3 signup-verify'>
                  <form role='form'>
                    <div className='row justify-content-center'>
                      {/* <div className='col-lg-3 mb-4'>
                        <div className='card-profile-img'>
                          <img src={require('../../serviceproviders/images/team-4.jpg')} className='rounded-circle border-secondary' />
                        </div>
                      </div> */}
                      <div className='col-lg-8 mb-4'>
                        <h5 className='h3 title'>
                          <span className='d-block mb-1'>{this.state.stateData.fName + ' ' + this.state.stateData.lName}</span>
                          <small className='h4 font-weight-light text-muted'>{this.state.stateData.dob}</small>
                        </h5>
                        <p className='card-text'>{this.state.stateData.address}</p>
                      </div>
                    </div>
                    <div className='px-lg-6 '>
                      <div className='form-group'>
                        <label className='form-control-label'>User ID*</label>
                        <input type='tel' className='form-control tel-input' placeholder='Enter User ID' style={this.state.uSuccess ? { borderColor: '#4da424' } : {}}
                          value={this.state.userID} onChange={(e) => this.setState({ userID: e.target.value, uError: '', uSuccess: true })} maxLength={20} />
                        <span className='input-error-icon' ><i className='fas fa-check' style={this.state.uSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                        <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.uError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                        <p className='text-muted'><small style={{ color: 'red' }}>{this.state.uError}</small> </p>
                      </div>
                      <div className='form-group'>
                        <label className='form-control-label'>Mobile #*</label>
                        <input type='tel' className='form-control tel-input' placeholder='Enter Mobile Number' style={this.state.mSuccess ? { borderColor: '#4da424' } : {}}
                          value={this.state.mobile} onChange={(e) => this.setState({ mobile: e.target.value, mError: '', mSuccess: true })} maxLength={10} />
                        <span className='input-error-icon' ><i className='fas fa-check' style={this.state.mSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                        <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.mError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                        <p className='text-muted'><small style={{ color: 'red' }}>{this.state.mError}</small> </p>
                        <a className='verify' data-toggle='modal' data-target='#modal-verifyPhone'><small>{this.state.mVerifyStatus ? 'Verified' : 'Verify'}</small></a>
                      </div>
                      <div className='form-group'>
                        <label className='form-control-label'>Email*</label>
                        <input type='email' className='form-control mail-input' placeholder='name@mail.com' style={this.state.eSuccess ? { borderColor: '#4da424' } : {}}
                          onChange={(e) => this.setState({ email: e.target.value, eError:'', eSuccess: true })} value={this.state.mail} maxLength={80} />
                        <span className='input-error-icon' ><i className='fas fa-check' style={this.state.eSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                        <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.eError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                        <p className='text-muted'><small style={{ color: 'red' }}>{this.state.eError}</small> </p>
                        <a className='verify' data-toggle='modal' data-target='#modal-verifyEamil'><small>{this.state.eVerifyStatus ? 'Verified' : 'Verify'}</small></a>
                      </div>
                      <div className='form-group'>
                        <label className='form-control-label'>Password*</label>
                        <input type='tel' className='form-control tel-input' placeholder='Enter Password' style={this.state.pSuccess ? { borderColor: '#4da424' } : {}}
                          value={this.state.password} onChange={(e) => this.setState({ password: e.target.value, pError: '', pSuccess: true })} maxLength={20} />
                        <span className='input-error-icon' ><i className='fas fa-check' style={this.state.pSuccess ? { color: '#4da424', fontSize: 18 } : { opacity: 0 }} /></span>
                        <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.pError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                        <p className='text-muted'><small style={{ color: 'red' }}>{this.state.pError}</small> </p>
                      </div>
                    </div>
                    <label className='text-danger text-center'>{this.state.svErrorMessage}</label>
                    <div>
                      <div className='text-center'>
                        <button type='button' className='btn btn-primary mt-2' onClick={this.handleBack}>Back</button>
                        <button type='button' className='btn btn-primary mt-2' onClick={this.handleSubmit}>Done</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal - Phone Number */}
        <div className='modal fade' id='modal-verifyPhone' role='dialog' aria-labelledby='modal-form' aria-hidden='true'>
          <div className='modal-dialog modal- modal-dialog-centered modal-sm' role='document'>
            <div className='modal-content'>
              <div className='modal-body'>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>×</span>
                </button>
                <div className='text-center mb-3'>
                  <h4 className='heading'>Hi {this.state.stateData.fName + ' ' + this.state.stateData.lName}</h4>
                  <p>Please enter the 4 digit OTP number below</p>
                </div>
                <div className='form-row mx-3'>
                  <div className='col-md-3'>
                    <input type='text' className='form-control' ref='otpNumber01' maxLength={1} onChange={
                      event => {
                        this.setState({ otpNumber01: event.target.value, popupErrorMsg: '' })
                        if (event.target.value && event.target.value.length === 1) {
                          this.refs.otpNumber02.focus()
                        }
                      }} />
                  </div>
                  <div className='col-md-3'>
                    <input type='text' className='form-control' ref='otpNumber02' maxLength={1} onChange={
                      event => {
                        this.setState({ otpNumber02: event.target.value, popupErrorMsg: '' })
                        if (event.target.value && event.target.value.length === 1) {
                          this.refs.otpNumber03.focus()
                        }
                      }} />
                  </div>
                  <div className='col-md-3'>
                    <input type='text' className='form-control' ref='otpNumber03' maxLength={1} onChange={
                      event => {
                        this.setState({ otpNumber03: event.target.value, popupErrorMsg: '' })
                        if (event.target.value && event.target.value.length === 1) {
                          this.refs.otpNumber04.focus()
                        }
                      }} />
                  </div>
                  <div className='col-md-3'>
                    <input type='text' className='form-control' ref='otpNumber04' maxLength={1} onChange={
                      event => {
                        this.setState({ otpNumber04: event.target.value, popupErrorMsg: '' })
                        if (event.target.value && event.target.value.length === 1) {
                          this.refs.mobileOtpSubmit.focus()
                        }
                      }} />
                  </div>
                </div>
                <div className='form-row mt-4 text-center'>
                  <div className='col'>
                    <button type='button' ref='mobileOtpSubmit' className='btn btn-primary mr-3'>Submit</button>
                    <button type='button' ref='mobileOtpClose' className='btn btn-outline-default' data-dismiss='modal' aria-label='Close'>Close</button>
                  </div>
                </div>
                <div className='text-center mt-4'>
                  <div className='h4 font-weight-300'>
                    <p>OTP : 8839</p>
                    <a href='#' className='btn-link'>Resend OTP</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal - Eamil */}
        <div className='modal fade' id='modal-verifyEamil' role='dialog' aria-labelledby='modal-form' aria-hidden='true'>
          <div className='modal-dialog modal- modal-dialog-centered modal-sm' role='document'>
            <div className='modal-content'>
              <div className='modal-body'>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>×</span>
                </button>
                <div className='text-center mb-3'>
                  <h4 className='heading'>Hi {this.state.stateData.fName + ' ' + this.state.stateData.lName}</h4>
                  <p>Please enter the 4 digit OTP number below</p>
                </div>
                <div className='form-row mx-3'>
                  <div className='col-md-3'>
                    <input type='number' className='form-control' id='validationCustom01' />
                  </div>
                  <div className='col-md-3'>
                    <input type='number' className='form-control' id='validationCustom02' />
                  </div>
                  <div className='col-md-3'>
                    <input type='number' className='form-control' id='validationCustomUsername' />
                  </div>
                  <div className='col-md-3'>
                    <input type='number' className='form-control' id='validationCustomUsername' />
                  </div>
                </div>
                <div className='form-row mt-4 text-center'>
                  <div className='col'>
                    <button type='button' className='btn btn-primary mr-3'>Submit</button>
                    <button type='button' className='btn btn-outline-default'>Close</button>
                  </div>
                </div>
                <div className='text-center mt-4'>
                  <div className='h4 font-weight-300'>
                    <p>OTP : 8839</p>
                    <a href='#' className='btn-link'>Resend OTP</a>
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

EUSignupVerificationComponent.propTypes = {
  stateData: PropTypes.any,
  handleBack: PropTypes.func
}
export default EUSignupVerificationComponent
