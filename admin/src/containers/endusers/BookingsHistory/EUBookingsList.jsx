/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
import EUBookingsListComponent from '../../../components/endusers/BookingHistory/EUBookingsListComponent'
import HeaderWithoutLogin from '../../../components/endusers/HeaderCompnt/HeaderWithoutLogin'

class SPBookingsList extends React.Component {
  constructor () {
    super()
    this.state = { authObj: JSON.parse(localStorage.getItem('authObj')) }
  }
  render () {
    return (
      <div className='main-content eu-bookingHistory' id='panel'>
        {/* ------- Navbar --------- */}
        {this.state.authObj && this.state.authObj.userRole === 'Customer' ? <MainHeader /> : <HeaderWithoutLogin />}
        {/* <MainHeader /> */}
        <EUBookingsListComponent />
        <FooterComponent />
      </div>
    )
  }
}

export default SPBookingsList
