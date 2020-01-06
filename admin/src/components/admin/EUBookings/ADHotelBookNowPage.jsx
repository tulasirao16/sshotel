/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import './Css/ADHotelsListItemView.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'rc-time-picker/assets/index.css'
import PropTypes from 'prop-types'
import ADDaysHotelBooking from './ADDaysHotelBooking'
import ADHourlyHotelBooking from './ADHourlyHotelBooking'

class ADHotelBookNowPage extends React.Component {
  constructor () {
    super()
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
    this.state = {
      propertyInfoData: propertyInfoData,
      bookingType: JSON.parse(localStorage.getItem('EUBookingType')),
      isHourlyBooking: (propertyInfoData && propertyInfoData.pricing) ? propertyInfoData.pricing.minBasePriceUnit === '6 Hours' : false
    }
  }
  handlePropertyInfo = (data) => {
    localStorage.setItem('EUPropertyInfoData', JSON.stringify(data))
    this.setState({ isHourlyBooking: (data && data.pricing) ? data.pricing.minBasePriceUnit === '6 Hours' : false })
  }
  render () {
    return (
      // && !this.state.isHourlyBooking
      <div id='eu-page-wrapper'>
        {this.state.bookingType === 'Days'
        ? <ADDaysHotelBooking handlePropertyInfo={this.handlePropertyInfo} />
        : <ADHourlyHotelBooking handlePropertyInfo={this.handlePropertyInfo} /> }
      </div>
    )
  }
}
ADHotelBookNowPage.propTypes = {
  google: PropTypes.any
}
export default ADHotelBookNowPage

