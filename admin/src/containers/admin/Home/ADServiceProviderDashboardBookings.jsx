/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import MainHeader from '../../../components/admin/Drawer/DrawerComponent'
import ADSPBookingsList from '../../../components/admin/Home/ADServiceProviderDashboardBookingListComponent'

class ADSPDashboardBookingList extends React.Component {

  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <MainHeader />
        <ADSPBookingsList />
      </div>
    )
  }
}

export default ADSPDashboardBookingList
