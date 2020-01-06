/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import EUForgotPasswordComponent from '../../../components/endusers/Login/EUForgotPasswordComponent'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import HeaderWithoutLogin from '../../../components/endusers/HeaderCompnt/HeaderWithoutLogin'

class EUForgotPasswordScreen extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj: {}
    }
  }
  render () {
    return (
      <div className='body-main enduser' >
        {this.state.authObj && this.state.authObj.userRole === 'Customer' ? <MainHeader /> : <HeaderWithoutLogin />}
        {/* <MainHeader /> */}
        <div className='main-content' id='panel'>
          {/* -------- Heaer ---------- */}
          <EUForgotPasswordComponent />
        </div>
      </div>
    )
  }
}

export default EUForgotPasswordScreen
