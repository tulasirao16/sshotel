/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import '../../../components/endusers/Login/Css/EULogin.css'
// import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import HeaderWithoutLogin from '../../../components/endusers/HeaderCompnt/HeaderWithoutLogin'
import EULoginComponent from '../../../components/endusers/Login/EULoginComponent'

class EULoginScreen extends React.Component {

  render () {
    return (
      <div className='body-main eu-login-container' style={{ fontFamily: 'Lato' }}>
        {/* ------- Navbar --------- */}
        <HeaderWithoutLogin />
        <div className='main-content' id='panel'>
          {/* -------- Heaer ---------- */}
          <div className='header py-8 py-lg-7 pt-lg-9 home-header'>
            <div className='separator separator-bottom separator-skew zindex-100'>
              <svg x='0' y='0' viewBox='0 0 2560 100' preserveAspectRatio='none' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                <polygon className='fill-default' points='2560 0 2560 100 0 100' />
              </svg>
            </div>
          </div>
          <EULoginComponent />
          {/* <footer className='footer-main mt-5'>
            <div className='container'>
              <div className='row align-items-center justify-content-lg-between'>
                <div className='col-lg-6'>
                  <div className='copyright text-center text-lg-left'>AMtoPM © 2019 - All rights reserved.</div>
                </div>
                <div className='col-lg-6'>
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
                </div>
              </div>
            </div>
          </footer> */}
        </div>
      </div>
    )
  }
}

export default EULoginScreen
