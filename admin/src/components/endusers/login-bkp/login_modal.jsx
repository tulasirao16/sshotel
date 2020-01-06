/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React, { Component } from 'react'
import { hashHistory } from 'react-router'

class LoginModal extends Component {
  constructor () {
    super()
    this.state = {
      modalIsOpen: false
    }
    this.handleLogin = this.handleLogin.bind(this)
  }
  handleLogin () {
    hashHistory.push('/login')
  }
  render () {
    return (
      <div>
        <li className='lang-menu nav-item'>
          <button onClick={this.handleLogin} className='  btn btn-default' data-toggle='modal' data-target='#reservationModal'>Login&nbsp; <i className='fa fa-sign-in' /></button>
          <button className='  btn btn-default' data-toggle='modal' data-target='#reservationModal'>Register&nbsp; <i className='icon-user' /></button>
        </li>
      </div>
    )
  }
}

export default LoginModal
