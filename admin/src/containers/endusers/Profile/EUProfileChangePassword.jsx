/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
import EUProfileChangePasswordComponent from '../../../components/endusers/profile/EUProfileChangePasswordComponent'

class EUProfileChangePassword extends React.Component {

  render () {
    return (
      <div style={{ fontFamily: 'Lato' }}>
        <div className='main-content eu-profile-container' id='panel'>
          <MainHeader />
          {/* ---------- Header Starts ------------- */}
          <EUProfileChangePasswordComponent />
          <FooterComponent />
        </div>
      </div>
    )
  }
}

export default EUProfileChangePassword
