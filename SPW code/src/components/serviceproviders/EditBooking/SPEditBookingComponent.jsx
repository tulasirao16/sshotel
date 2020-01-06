/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import 'react-toastify/dist/ReactToastify.css'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import SPDayEditBookingComponent from './SPDayEditBookingComponent'
import SPHourlyEditBookingComponent from './SPHourlyEditBookingComponent'

class ServiceProviderEditBooking extends React.Component {
  constructor () {
    super()
    let bookingData = JSON.parse(localStorage.getItem('bookingData'))
    this.state = {
      bookingDate: bookingData
    }
  }
  render () {
    let bookingData = this.state.bookingDate
    return (
      <div>
        {bookingData.spPropertyInfoId.pricing.minBasePriceUnit === '6 Hours'
          ? <SPHourlyEditBookingComponent bookingData={bookingData} />
          : <SPDayEditBookingComponent bookingData={bookingData} />}
      </div>
    )
  }
}

export default ServiceProviderEditBooking
