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
import ADHostEditDayBooking from './ADHostEditDayBooking'
import ADHostEditHourlyBooking from './ADHostEditHourlyBooking'

class ADHostEditBookingsComponent extends React.Component {
  constructor () {
    super()
    let bookingData = JSON.parse(localStorage.getItem('bookingData'))
    this.state = {
      bookingDate: bookingData
    }
  }
  render () {
    let bookingData = this.state.bookingDate
    let minBasePriceUnit = bookingData.spPropertyInfoId.pricing.minBasePriceUnit
    return (
      <div>
        {minBasePriceUnit === '6 Hours'
          ? <ADHostEditHourlyBooking bookingData={bookingData} />
          : <ADHostEditDayBooking bookingData={bookingData} />}
      </div>
    )
  }
}

export default ADHostEditBookingsComponent
