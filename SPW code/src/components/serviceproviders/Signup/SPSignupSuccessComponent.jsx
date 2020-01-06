/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import SPHeaderComponent from '../HeaderCompnt/Header'
// import FooterComponent from '../FooterCompnt/Footer'
import 'react-drawer/lib/react-drawer.css'
import '../css/signup.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import { t } from 'ttag'

class SPSignupSuccessComponent extends React.Component {
  constructor () {
    super()
    this.handleSignIn = this.handleSignIn.bind(this)
  }
  handleSignIn () {
    hashHistory.push('/host/signin')
    event.preventDefault()
  }

  render () {
    return (
      <div className='success-page'>
        <div className='body-main'>
          {/* ------- Navbar --------- */}
          <SPHeaderComponent />
          <div className='main-content' id='panel'>
            {/* -------- Header ---------- */}
            {/* <div className='header py-8 py-lg-7 pt-lg-9 home-header'>
              <div className='separator separator-bottom separator-skew zindex-100'>
                <svg x='0' y='0' viewBox='0 0 2560 100' preserveAspectRatio='none' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                  <polygon className='fill-default' points='2560 0 2560 100 0 100' />
                </svg>
              </div>
            </div> */}
            <div className='container'>
              <div className='row signup-box'>
                <div>
                  <div className='card border-0 mb-0'>
                    {/* <div className='card-header bg-transparent pb-3'>
                      <h5 className='card-title'>Success</h5>
                    </div> */}
                    <div className='card-body'>
                      <form role='form'>
                        <div className='login-inner-form'>
                          <div className='justify-content-center'>
                            <div className='card-success'>
                              <i className='fas fa-check success-icon' />
                            </div>
                          </div>
                          <div className='mt-4 text-center'>
                            <div>
                              <h4>{t`lanSPLabelSuccessSignupSuccess`}</h4>
                              <h5>{t`lanSPLabelPleaseSignin`}</h5>
                            </div>
                          </div>
                          <div className='mt-4 text-center'>
                            <button type='button' onClick={this.handleSignIn} className='btn-md btn-theme'>{t`lanSPButtonOkay`}</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <FooterComponent /> */}
          </div>
        </div>
      </div>
    )
  }
}

export default SPSignupSuccessComponent
