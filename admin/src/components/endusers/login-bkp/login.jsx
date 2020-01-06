/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import { t } from 'ttag'
import './login.scss'

class EndUsersLogin extends React.Component {
  constructor () {
    super()
    this.state = {
      userID: '',
      password: '',
      errorMessage: ''
    }
    this.handleEndUserLoginChange = this.handleEndUserLoginChange.bind(this)
    this.handleMobileNumKeys = this.handleMobileNumKeys.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleEndUserLoginChange (event) {
    if (event.target.id === 'endusers-loginuser-mobilenum-id') {
      this.setState({ password: event.target.value, errorMessage: '' })
    } else if (event.target.id === 'endusers-loginuser-name-id') {
      this.setState({ userID: event.target.value, errorMessage: '' })
    }
  }

  handleMobileNumKeys (event) {
    if ((event.charCode > 32 && event.charCode < 48 && event.charCode !== 40 &&
    event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
    (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }

  handleSubmit (event) {
    // const phValidation = /^((\(\d{3}\))|\d{3,4})(\-|\s)?(\d{3})(\-|\s)?(\d{1,4})(\-|\s)?(\d{1,3})$/
    if (!this.state.userID) {
      this.setState({ errorMessage: 'userID is required' })
    } else if (!this.state.password) {
      this.setState({ errorMessage: 'password is required' })
    } else {
      this.setState({ errorMessage: '' })
      let postObj = {
        url: config.baseUrl + config.endUserLogin,
        body: { userID: this.state.userID, password: this.state.password }
      }
      APICallManager.postCall(postObj, function (resObj) {
        try {
          if (resObj.data.statusCode === '1000') {
            hashHistory.push('/langugae')
          }
        } catch (e) {
          console.log('=====ERROR:', e)
        }
      })
    }
    event.preventDefault()
  }

  render () {
    return (
      <div>
        <div className='main-index-main'>
          <div className='owl-carousel owl-theme'> {/* Your Content Here... */} </div>
          <div className='' id='top'>
            {/* _____________________________ navigation End _______________________________ */}
            <main className='main-content enduser_loginpage'>
              <section className='wb-section ' id='products'>
                <div className='container '>
                  <div className='row justify-content-center'>
                    <div className='col-md-5 '>
                      <div className='login'>
                        <div className='card-group'>
                          <div className='card'>
                            <div className='card-body'>
                              <h3 className='text-center'>Login</h3>
                              <p className='text-muted' />
                              <form onSubmit={this.handleSubmit} className='login'>
                                <div className='input-group mb-3'>
                                  <div className='input-group-prepend'> <span className='input-group-text'> <i className='icon-user'>{/* user icon */}</i> </span> </div>
                                  <input type='text' autoComplete='off' name='endusers-loginuser-name-name' id='endusers-loginuser-name-id' maxLength='40' placeholder='Enter Username'
                                    value={this.state.userID} onChange={this.handleEndUserLoginChange} className='form-control' required />
                                </div>
                                <div className='input-group mb-3'>
                                  <div className='input-group-prepend'> <span className='input-group-text'> <i className='icon-lock'>{/* lock icon */}</i> </span> </div>
                                  <input autoComplete='off' name='endusers-loginuser-mobilenum-name' id='endusers-loginuser-mobilenum-id' maxLength='15' value={this.state.password}
                                    onChange={this.handleEndUserLoginChange} placeholder='password' className='form-control' type='password' required />
                                </div>
                                <div className='row'>
                                  <div className='col-sm-8 '>
                                    <label className='warning'>{this.state.errorMessage}</label>
                                  </div>
                                  <div className='col-sm-4 '>
                                    <button type='submit' className='btn btn-primary px-4 '>{t`Submit`}</button>
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
              </section>
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default EndUsersLogin
