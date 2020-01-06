/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import DrawerWithHeader from '../../../components/serviceproviders/Drawer/DrawerComponent'
import FooterComponent from '../../../components/serviceproviders/FooterCompnt/Footer'
import SPBookingsViewComponent from '../../../components/serviceproviders/BookingsHistory/SPBookingsViewComponent'

class SPBookingsView extends React.Component {
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
        <DrawerWithHeader />
        <SPBookingsViewComponent recordId={this.state.recordId} />
        <FooterComponent />
      </div>
    )
  }
}
SPBookingsView.propTypes = {
  params: PropTypes.any
}
export default SPBookingsView
