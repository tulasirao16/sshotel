/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import axios from 'axios'

import './css/Profile.css'
import config from '../../../../public/config.json'
import { t } from 'ttag'

const myApi = axios.create()

class EUProfileSideMenu extends React.Component {
  constructor () {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      displayName: '',
      email: '',
      mobileNumber: '',
      area: '',
      address: '',
      authObj: {},
      userIconPath: ''
    }
    this.handleEditProfile = this.handleEditProfile.bind(this)
    this.handleAddIdProof = this.handleAddIdProof.bind(this)
    this.handlePreference = this.handlePreference.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleSupport = this.handleSupport.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentWillMount () {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    this.setState({
      authObj: authObj,
      firstName: authObj.firstName,
      lastName: authObj.lastName,
      displayName: authObj.displayName,
      mobileNumber: !authObj.mobileNumber.includes('@') ? authObj.mobileNumber : '',
      email: authObj.email ? authObj.email : '',
      address: authObj.address ? authObj.address : '',
      dob: authObj.dob ? authObj.dob : '',
      iconPath: authObj.userIconPath ? authObj.userIconPath : '',
      iconOriginalName: authObj.userIconOriginalName ? authObj.userIconOriginalName : '',
      userIcon: authObj.userIcon ? authObj.userIcon : ''
    })
  }

  componentWillReceiveProps (newProps) {
    let authObj = newProps.authObj
    this.setState({
      authObj: authObj,
      firstName: authObj.firstName,
      lastName: authObj.lastName,
      displayName: authObj.displayName,
      mobileNumber: !authObj.mobileNumber.includes('@') ? authObj.mobileNumber : '',
      email: authObj.email ? authObj.email : '',
      address: authObj.address ? authObj.address : '',
      dob: authObj.dob ? authObj.dob : '',
      iconPath: authObj.userIconPath ? authObj.userIconPath : '',
      iconOriginalName: authObj.userIconOriginalName ? authObj.userIconOriginalName : '',
      userIcon: authObj.userIcon ? authObj.userIcon : ''
    })
  }

  handleEditProfile () {
    hashHistory.push('/profile')
    event.preventDefault()
  }
  handleAddIdProof () {
    hashHistory.push('/idproofs')
    event.preventDefault()
  }
  handlePreference () {
    hashHistory.push('/preferences')
    event.preventDefault()
  }
  handleChangePassword () {
    hashHistory.push('/changepassword')
    event.preventDefault()
  }
  handleSupport () {
    hashHistory.push('/support')
    event.preventDefault()
  }
  handleLogout () {
    localStorage.clear()
    myApi.defaults.headers.token = null
    hashHistory.push('/login')
    event.preventDefault()
  }
  render () {
    return (
      <div style={{ fontFamily: 'Lato' }}>
        <div className='profile-info'>
          <div className='card card-profile'>
            <div className='card-avatar'>
              <a>
                {/* <img className='img' src={require('../../../../assets/avatar_01.jpg')} /> */}
                <img className='img' src={this.state.authObj.userIconPath ? config.baseUrl + this.state.authObj.userIconPath : require('../../../../assets/profile-icon.png')} />
              </a>
            </div>
            <div className='card-body'>
              <h5 className='h3 title'>
                <span className='d-block mb-1'>{this.state.displayName}</span>
              </h5>
              <p className='card-text user-address'>{this.state.address}</p>
              <div style={{ display: 'grid' }}>
                <div className='verify-div'>
                  <h6 className='card-category '>{this.state.mobileNumber}</h6>
                  <span className='verift-icon'><i className='fas fa-check-circle text-green' /></span>
                </div>
                <div className='verify-div'>
                  <h6 className='card-category email'>{this.state.email}</h6>
                  <span className='verift-icon'><i className='fas fa-check-circle text-green' /></span>
                </div>
              </div>
              <hr />
              <a onClick={this.handleEditProfile} >
                <h4 className='card-title route-opt'>{t`lanEUButtonEditProfile`}</h4>
              </a>
              <hr />
              <a onClick={this.handleAddIdProof} >
                <h4 className='card-title route-opt'>{t`lanEUButtonIDProofs`}</h4>
              </a>
              <hr />
              <a onClick={this.handlePreference} >
                <h4 className='card-title route-opt'>{t`lanEUButtonPreferences`}</h4>
              </a>
              <hr />
              <a onClick={this.handleChangePassword} >
                <h4 className='card-title route-opt'>{t`lanEUButtonChangePassword`}</h4>
              </a>
              <hr />
              {/* <h4 className='card-title route-opt'>Feedback</h4>
              <hr /> */}
              <a onClick={this.handleSupport} >
                <h4 className='card-title route-opt'>{t`lanEUButtonGetSupport`}</h4>
              </a>
              <hr />
              <a onClick={this.handleLogout}>
                <h4 className='card-title route-opt'>{t`lanEUButtonLogOut`}</h4>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EUProfileSideMenu
