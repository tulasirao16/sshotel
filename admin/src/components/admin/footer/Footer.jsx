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

class FooterComponent extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }

  render () {
    return (
      <footer className='footer mt-4'>
        <div className='container-fluid'>
          <div className='row align-items-center justify-content-lg-between'>
            <div className='col-md-12'>
              <div className='copyright text-center'>AM to PM © 2019 - All rights reserved.</div>
            </div>
            {/* <div className='col-lg-6'>
              <ul className='nav nav-footer justify-content-center justify-content-lg-end'>
                <li className='nav-item'>
                  <a href='#' className='nav-link' target='_blank'>About</a>
                </li>
                <li className='nav-item'>
                  <a href='#' className='nav-link' target='_blank'>Terms & Conditions</a>
                </li>
                <li className='nav-item'>
                  <a href='#' className='nav-link' target='_blank'>Privacy Policy</a>
                </li>
                <li className='nav-item'>
                  <a href='#' className='nav-link' target='_blank'>Site map</a>
                </li>
                <li className='nav-item'>
                  <a href='#' className='nav-link' target='_blank'>Trust & Safety</a>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </footer>
    )
  }
}

export default FooterComponent
