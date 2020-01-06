/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class HeaderComponent extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }
  render () {
    return (
      <nav id='navbar-main' className='navbar navbar-horizontal navbar-transparent navbar-main navbar-expand-lg navbar-light'>
        <div className='container-fluid'>
          <div className='logo-text'>
            <a href='#'><img src={require('../../../../assets/logo.png')} className='logo-image' /></a>
          </div>
          <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbar-collapse' aria-controls='navbar-collapse' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon' />
          </button>
          <div className='navbar-collapse navbar-custom-collapse collapse' id='navbar-collapse'>
            <div className='navbar-collapse-header'>
              <div className='row'>
                <div className='col-6 collapse-brand'>
                  <div className='logo-text'>
                    <img src={require('../../../../assets/logo.png')} className='logo-image' />
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
          </div>
        </div>
      </nav>
    )
  }
}

export default HeaderComponent
