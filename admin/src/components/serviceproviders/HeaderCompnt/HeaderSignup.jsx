/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
// import { th } from 'date-fns/esm/locale';
// import { t } from 'ttag/types';

class HeaderSignUpComponent extends React.Component {
  constructor () {
    super()
    this.state = {
    }
    this.handleSPSignup = this.handleSPSignup.bind(this)
    this.handleEndUserHome = this.handleEndUserHome.bind(this)
  }
  handleSPSignup (event) {
    hashHistory.push('/host/signup')
    event.preventDefault()
  }
  handleEndUserHome (e) {
    hashHistory.push('/')
    event.preventDefault()
  }
  render () {
    return (
      <nav id='navbar-main' className='navbar navbar-horizontal navbar-transparent navbar-main navbar-expand-lg navbar-light'>
        <div className='container'>
          <a onClick={this.handleEndUserHome} >
            <div className='logo-text'>
              <img src={require('../../../../assets/logo-white.png')} className='logo-image' />
              {/* <h1>AM to PM</h1> */}
            </div>
          </a>
          {/* <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbar-collapse' aria-controls='navbar-collapse' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon' />
          </button>
          <div className='navbar-collapse navbar-custom-collapse collapse' id='navbar-collapse'>
            <div className='navbar-collapse-header'>
              <div className='row'>
                <div className='col-6 collapse-brand'>
                  <div className='logo-text'>
                    <h1 style={{ color:'#333' }}>AM to PM</h1>
                  </div>
                </div>
                <div className='col-6 collapse-close'>
                  <button type='button' className='navbar-toggler' data-toggle='collapse' data-target='#navbar-collapse' aria-controls='navbar-collapse' aria-expanded='false' aria-label='Toggle navigation'>
                    <span />
                    <span />
                  </button>
                </div>
              </div>
            </div>
            <ul className='navbar-nav mr-auto'>
              <li className='nav-item'>
                <a href='#' className='nav-link'>
                  <span className='nav-link-inner--text'>Support</span>
                </a>
              </li>
              <li className='nav-item d-lg-block ml-lg-4'>
                <a onClick={this.handleSPSignup} className='btn btn-neutral btn-icon'>
                  <span className='btn-inner--icon'>
                    <i className='fas fa-sign-in-alt mr-2' />
                  </span>
                  <span className='nav-link-inner--text'> Sign Up </span>
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </nav>
    )
  }
}

export default HeaderSignUpComponent
