/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
import EUBookingViewComponent from '../../../components/endusers/BookingHistory/EUBookingViewComponent'

class EUBookingView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      recordId: this.props && this.props.params ? this.props.params.recordId : ''
    }
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <MainHeader />
        <EUBookingViewComponent recordId={this.state.recordId} />
        <FooterComponent />
      </div>
    )
  }
}
EUBookingView.propTypes = {
  params: PropTypes.any
}
export default EUBookingView
