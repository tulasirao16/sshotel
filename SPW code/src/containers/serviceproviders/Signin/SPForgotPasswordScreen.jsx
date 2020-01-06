/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import SPHeaderComponent from '../../../components/serviceproviders/HeaderCompnt/Header'
// import FooterComponent from '../../../components/serviceproviders/FooterCompnt/Footer'
import SPForgotPasswordComponent from '../../../components/serviceproviders/Signin/SPForgotPasswordComponent'

class SPForgotPasswordScreen extends React.Component {

  render () {
    return (
      <div className='login-page' >
        <div className='body-main'>
          {/* ------- Navbar --------- */}
          <SPHeaderComponent />
          <div className='main-content' id='panel'>
            {/* -------- Heaer ---------- */}
            <SPForgotPasswordComponent />
            {/* <FooterComponent /> */}
          </div>
        </div>
      </div>
    )
  }
}

export default SPForgotPasswordScreen
