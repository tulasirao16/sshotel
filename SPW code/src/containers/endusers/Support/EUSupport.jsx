/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'

import '../../../components/endusers/profile/css/Profile.css'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
import EUSupportComponent from '../../../components/endusers/Support/EUSupport'
import HeaderWithoutLogin from '../../../components/endusers/HeaderCompnt/HeaderWithoutLogin'

class EUSupport extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj: {}
    }
  }
  render () {
    return (
      <div className='main-content eu-profile-container' id='panel'>
        {/* ------- Navbar --------- */}
        <HeaderWithoutLogin />
        <div className='main-content' id='panel'>
          <EUSupportComponent />
        </div>
        <FooterComponent />
      </div>
    )
  }
}

export default EUSupport
