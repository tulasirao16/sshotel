/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import ADHostCreateBookingComponent from '../../../components/admin/ADHostCreateBookingComponent/ADHostCreateBookingComponent'
import FooterComponent from '../../../components/admin/footer/Footer'

class ADHostCreateBooking extends React.Component {

  render () {
    return (
      <div >
        <DrawerWithHeader />
        <ADHostCreateBookingComponent />
        <FooterComponent />
      </div>
    )
  }
}

export default ADHostCreateBooking
